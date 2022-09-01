'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const BisnisUnit = use("App/Models/BisnisUnit")
const LampiranFile = use("App/Models/LampiranFile")
const BarangLokasi = use("App/Models/BarangLokasi")
const TrxOrderBeli = use("App/Models/transaksi/TrxOrderBeli")
const TrxTerimaBarang = use("App/Models/logistik/LogistikTerimaBarang")
const KeuPurchasingRequest = use("App/Models/transaksi/KeuPurchasingRequest")
const TrxTerimaBarangItem = use("App/Models/logistik/LogistikTerimaBarangItem")
const KeuPurchasingRequestItems = use("App/Models/transaksi/KeuPurchasingRequestItems")
const LogistikTerimaBarangAttach = use("App/Models/logistik/LogistikTerimaBarangAttach")

class terimaBarang {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.WORKSPACE(user)
        try {
            const data = (
                await TrxTerimaBarang
                .query()
                .with('pemasok')
                .with('gudang')
                .with('purchasing')
                .with('files')
                .where( w => {
                    if(req.reff_ro){
                        w.where('reff_ro', 'like', `${req.reff_ro}%`)
                    }
                    if(req.reff_rcp){
                        w.where('reff_ro', 'like', `${req.reff_rcp}%`)
                    }
                    if(req.narasi){
                        w.where('reff_ro', 'like', `${req.narasi}%`)
                    }
                    if(req.pemasok_id){
                        w.where('reff_ro', req.pemasok_id)
                    }
                    if(req.gudang_id){
                        w.where('reff_ro', req.gudang_id)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
    
            return data
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async POST (req, user, attach) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)
        const kode = await initFunc.GEN_KODE_TERIMA_BRG(user.cabang_id)

        console.log('====================================');
        console.log(req);
        console.log('====================================');

        const trxTerimaBarang = new TrxTerimaBarang()
        try {
            trxTerimaBarang.fill({
                reff_fb: req.reff_fb || null,
                reff_order: req.reff_order || null,
                reff_rcp: req.reff_rcp ? req.reff_rcp : kode,
                cabang_id: ws.cabang_id,
                pemasok_id: req.pemasok_id || null,
                gudang_id: req.gudang_id,
                narasi: req.description,
                receivedby: user.id,
                received_at: req.received_at || null
            })

            await trxTerimaBarang.save(trx)

        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...\n'+JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(attach){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `FAK-SUPP-${randURL}.${attach.extname}`
            var uriLampiran = '/upload/'+aliasName
            await attach.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = new LogistikTerimaBarangAttach()
            lampiranFile.fill({
                logterima_id: trxTerimaBarang.id,
                filetype: attach.extname,
                size: attach.size,
                url: uriLampiran
            })
            try {
                await lampiranFile.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
                }
            }
        }

        for (const obj of req.items) {
            const trxTerimaBarangItem = new TrxTerimaBarangItem()
            try {
                trxTerimaBarangItem.fill({
                    trx_terima: trxTerimaBarang.id,
                    barang_id: obj.barang_id,
                    description: obj.description,
                    qty: obj.qty
                })
                await trxTerimaBarangItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save items \n'+ JSON.stringify(error)
                }
            }

            /* TAMBAH BARANG KE GUDANG PERSEDIAAN */
            if(req.isPemasok === 'Y'){
                if(req.pemasok_id){
                    const keuPurchasingRequestItems = await KeuPurchasingRequestItems.query().where( w => {
                        w.where('qty', obj.qty)
                        w.where('barang_id', obj.barang_id)
                        w.where('pemasok_id', req.pemasok_id)
                        w.where('purchasing_id', req.reff_order)
                    }).last()
                    
                    keuPurchasingRequestItems.merge({has_received: 'Y'})
                    try {
                        await keuPurchasingRequestItems.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed update items purchasing order \n'+ JSON.stringify(error)
                        }
                    }
                }

                const addBarang = new BarangLokasi()
                try {
                    addBarang.fill({
                        terimabrg_id: trxTerimaBarangItem.id,
                        barang_id: obj.barang_id,
                        cabang_id: ws.cabang_id,
                        gudang_id: req.gudang_id,
                        qty_hand: obj.qty,
                        createdby: user.id,
                    })
                    await addBarang.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save items \n'+ JSON.stringify(error)
                    }
                }
            }
        }

        
        await trx.commit()

        if(req.reff_order){
            const itemz = (await KeuPurchasingRequestItems.query().where('purchasing_id', req.reff_order).fetch()).toJSON()
            const receivedCompleated = itemz.filter(f => (f.has_received === 'N' && f.aktif === 'Y'))
            if(receivedCompleated.length <= 0){
                const keuPurchasingRequest = await KeuPurchasingRequest.query().where('id', req.reff_order).last()
                keuPurchasingRequest.merge({status: 'finish'})
                try {
                    await keuPurchasingRequest.save()
                } catch (error) {
                    return {
                        success: false,
                        message: 'Failed update status purchasing request... \n'+ JSON.stringify(error)
                    }
                }
            }
        }
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = (
            await TrxTerimaBarang
            .query()
            .with('purchasing')
            .with('pemasok')
            .with('gudang')
            .with('items')
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async PRINT (params) {
        const data = (
            await TrxTerimaBarang
            .query()
            .with('purchasing')
            .with('pemasok')
            .with('gudang')
            .with('penerima')
            .with('items', w => {
                w.with('barang')
            })
            .where('id', params.id)
            .last()
        ).toJSON()
        console.log(data);
        return data
    }

    async DELETE (params) {
        const trx = await DB.beginTransaction()
        const logTerimaBarang = await TrxTerimaBarang.query().where('id', params.id).last()

        /* KEMBALIKAN STATUS REQUEST ORDER */
        if(logTerimaBarang.reff_order){
            const reqOrder = await KeuPurchasingRequest.query().where('id', logTerimaBarang.reff_order).last()
            try {
                reqOrder.merge({status: 'approved'})
                await reqOrder.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update purchasing request \n'+ JSON.stringify(error)
                }
            }
    
            /* KEMBALIKAN STATUS REQUEST ORDER */
            const reqOrderItem = (await KeuPurchasingRequestItems.query().where('purchasing_id', reqOrder.id).fetch()).toJSON()
            for (const obj of reqOrderItem) {
                const reqOrderItemUpdate = await KeuPurchasingRequestItems.query().where('id', obj.id).last()
                try {
                    reqOrderItemUpdate.merge({has_received: 'N'})
                    await reqOrderItemUpdate.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update purchasing request items \n'+ JSON.stringify(error)
                    }
                }
            }
        }

        /* DELETE DATA LOGISTIK TERIMA BARANG */
        try {
            await logTerimaBarang.delete(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed delete data terima barang \n'+ JSON.stringify(error)
            }
        }

        await trx.commit()
        return {
            success: true,
            messsage: 'Success save data...'
        }
    }
}

module.exports = new terimaBarang()

