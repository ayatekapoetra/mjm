'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const AccCoa = use("App/Models/akunting/AccCoa")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const LampiranFile = use("App/Models/transaksi/KeuFakturPembelianAttach")
const KeuFakturPembelian = use("App/Models/transaksi/KeuFakturPembelian")
const KeuPurchasingRequest = use("App/Models/transaksi/KeuPurchasingRequest")
const KeuFakturPembelianItem = use("App/Models/transaksi/KeuFakturPembelianItem")

class fakturBeli {
    async LIST (req, user) {
        const ws = await initFunc.WORKSPACE(user)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);

        let data = (await KeuFakturPembelian
            .query()
            .with('files')
            .with('cabang')
            .with('pemasok')
            .with('gudang')
            .with('author', a => a.with('profile'))
            .with('items')
            .where( w => {
                w.where('cabang_id', user.cabang_id)
            })
            .orderBy('trx_date', 'desc')
            .paginate(halaman, limit)
        ).toJSON()
        
        return data
    }

    async POST (req, user, filex) {
        console.log(req);
        const trx = await DB.beginTransaction()
        const keuPurchasingRequest = await KeuPurchasingRequest.query().where('kode', req.kode).last()
        
        const trxFakturBeli = new KeuFakturPembelian()
        trxFakturBeli.fill({
            cabang_id: req.cabang_id, 
            gudang_id: req.gudang_id, 
            pemasok_id: req.pemasok_id, 
            reff_order: keuPurchasingRequest?.id || null, 
            kode: req.kode || null, 
            grandtot: parseFloat(req.itemsTotal) + parseFloat(req.ppn_rp), 
            sisa: parseFloat(req.itemsTotal) + parseFloat(req.ppn_rp),
            ppn: req.ppn || 0,
            ppn_rp: req.ppn_rp,
            trx_date: req.date_faktur,
            due_date: req.due_date, 
            createdby: user.id,
        })
        try {
            await trxFakturBeli.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data faktur pembelian...'+JSON.stringify(error)
            }
        }
        console.log('end KeuFakturPembelian');

        if(filex){
            for (const [i, objFile] of (filex._files).entries()) {
                const randURL = moment().format('YYYYMMDDHHmmss') + '-' + i
                const aliasName = `FB-${randURL}.${objFile.extname}`
                var uriLampiran = '/upload/'+aliasName
                await objFile.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })

                if (!objFile.moved()) {
                    return objFile.error()
                }

                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    fakturbeli_id: trxFakturBeli.id,
                    size: objFile.size,
                    filetype: objFile.extname,
                    url: uriLampiran
                })

                try {
                    await lampiranFile.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data attachment...'+JSON.stringify(error)
                    }
                }
            }
            console.log('end lampiranFile');
        }

        const defCoaPajak = (await DefCoa.query().where('group', 'faktur-pembelian-pajak').fetch()).toJSON()
        for (const val of defCoaPajak) {
            const trxJurnalTax = new TrxJurnal()
            trxJurnalTax.fill({
                createdby: user.id,
                cabang_id: req.cabang_id, 
                trx_beli: trxFakturBeli.id,
                coa_id: val.coa_id,
                reff: req.kode,
                narasi: `[ ${req.kode} ] ${val.description}`,
                trx_date: req.date_faktur || new Date(),
                nilai: req.ppn_rp || 0,
                dk: val.tipe,
                is_delay: 'N'
            })
            try {
                await trxJurnalTax.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data trx jurnal pajak...'+JSON.stringify(error)
                }
            }
            console.log('end faktur-pembelian-pajak');
        }

        for (const obj of req.data.items) {
            // console.log(obj);
            if(obj.coa_id){
                const barang = await Barang.query().where('id', obj.barang_id).last()

                const trxFakturBeliItem = new KeuFakturPembelianItem()
                trxFakturBeliItem.fill({
                    fakturbeli_id: trxFakturBeli.id,
                    barang_id: obj.barang_id || null,
                    coa_id: obj.coa_id || null,
                    qty: obj.qty,
                    discount: obj.discount_rp,
                    stn: barang.satuan,
                    harga_stn: obj.harga_stn,
                    subtotal: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.discount_rp)
                })

                try {
                    await trxFakturBeliItem.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data faktur pembelian item...'+JSON.stringify(error)
                    }
                }
                console.log('end trxFakturBeliItem');

                /** INSERT DATA TRX-JURNAL **/
                const defCoa = (await DefCoa.query().where('group', 'faktur-pembelian').fetch()).toJSON()

                for (const val of defCoa) {
                    const trxJurnalFB = new TrxJurnal()
                    trxJurnalFB.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id, 
                        trx_beli: trxFakturBeli.id,
                        coa_id: val.coa_id,
                        reff: req.kode,
                        narasi: `[ ${req.kode} ] ${barang.nama}`,
                        trx_date: req.date_faktur || new Date(),
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                        dk: val.tipe,
                        is_delay: 'N'
                    })

                    try {
                        await trxJurnalFB.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data trx jurnal...'+JSON.stringify(error)
                        }
                    }
                    console.log('end trxJurnal', req.ppn_rp);
                }

                const defCoaDiscount = (await DefCoa.query().where('group', 'faktur-pembelian-discount-barang').fetch()).toJSON()
                for (const val of defCoaDiscount) {
                    const trxJurnalDisc = new TrxJurnal()
                    trxJurnalDisc.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id, 
                        trx_beli: trxFakturBeli.id,
                        coa_id: val.coa_id,
                        reff: req.kode,
                        narasi: `[ ${req.kode} ] ${val.description}`,
                        trx_date: req.date_faktur || new Date(),
                        nilai: parseFloat(obj.discount_rp),
                        dk: val.tipe,
                        is_delay: 'N'
                    })

                    try {
                        await trxJurnalDisc.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data trx jurnal discount...'+JSON.stringify(error)
                        }
                    }
                    console.log('end faktur-pembelian-discount-barang');
                }

                if(obj.barang_id){
                    /** INSERT HARGA BELI BARU **/
                    let hrgBeli = await HargaBeli.query().where( w => {
                        w.where('barang_id', obj.barang_id)
                        w.where('harga_beli', obj.harga_stn)
                        w.where('periode', moment().format('YYYY-MM'))
                    }).last()

                    if(!hrgBeli){
                        hrgBeli = new HargaBeli()
                        hrgBeli.fill({
                            barang_id: obj.barang_id,
                            cabang_id: req.cabang_id,
                            gudang_id: req.gudang_id,
                            trxbeli_item: trxFakturBeliItem.id,
                            periode: moment().format('YYYY-MM'),
                            narasi: req.kode,
                            harga_beli: parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                            created_by: user.id
                        })
                        try {
                            await hrgBeli.save(trx)
                        } catch (error) {
                            console.log(error);
                            await trx.rollback()
                            return {
                                success: false,
                                message: 'Failed save data harga beli...'+JSON.stringify(error)
                            }
                        }
                    }
                    console.log('end hrgBeli');
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = (
            await TrxFakturBeli
                .query()
                .with('files')
                .with('bisnis')
                .with('cabang')
                .with('pemasok')
                .with('gudang')
                .with('author', a => a.with('profile'))
                .with('items')
                .where('id', params.id)
                .last()
        ).toJSON()

        return data
    }

    async PRINT (params) {
        const data = (
            await TrxFakturBeli
                .query()
                .with('files')
                .with('bisnis')
                .with('cabang')
                .with('pemasok')
                .with('gudang')
                .with('author', a => a.with('profile'))
                .with('items', w => {
                    w.with('barang')
                })
                .where('id', params.id)
                .last()
        ).toJSON()
        return data
    }

    async UPDATE ( params, req, user, filex ) {
        const trx = await DB.beginTransaction()
        const initCoa = await initFunc.DEF_COA(user.id)
        const ws = await initFunc.GET_WORKSPACE(user.id)
        try {

            const trxFakturBeli = await TrxFakturBeli.query().where('id', params.id).last()
            trxFakturBeli.merge({
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id, 
                gudang_id: req.gudang_id, 
                pemasok_id: req.pemasok_id, 
                // reff_ro: req.reff_ro, 
                kode: req.kode, 
                total: req.total, 
                sisa: req.total,
                date_faktur: req.date_faktur, 
                due_date: req.due_date, 
                title: req.title
            })
            await trxFakturBeli.save(trx)
            /** DELETE ITEM IF NO LONGER EXSIST **/
            let arrItemNew = req.items.map(el => el.id)
            arrItemNew = arrItemNew.filter(el => el != undefined)
            
            const trxFakturBeliItem_old = (
                await TrxFakturBeliItem
                .query()
                .where('fakturbeli_id', params.id)
                .fetch()
            ).toJSON()
            let arrItemOld = trxFakturBeliItem_old.map(el => `${el.id}`)
            
            let arrItemDelete = _.difference(arrItemOld, arrItemNew)
            
            for (const id of arrItemDelete) {
                const trxFakturBeliItem_del = await TrxFakturBeliItem.query().where('id', id).last()
                await trxFakturBeliItem_del.delete(trx)
            }
            
            await TrxFakturBeliItem.query(trx).where('fakturbeli_id', params.id).delete()
            for (const obj of req.items) {
                
                const trxFakturBeliItemNew = new TrxFakturBeliItem()
                    trxFakturBeliItemNew.fill({
                        fakturbeli_id: params.id,
                        barang_id: obj.barang_id || null,
                        coa_id: obj.coa_id || null,
                        equipment_id: obj.equipment_id || null,
                        qty: obj.qty,
                        stn: obj.satuan,
                        harga_stn: obj.harga_stn,
                        subtotal: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                    })
                await trxFakturBeliItemNew.save(trx)
            }

            /** DELETE EXSISTING DATA JURNAL **/
            await TrxJurnal.query(trx).where('trx_beli', params.id).delete()
            for (const obj of req.items) {
                
                /** UPDATE DATA TRX-JURNAL **/
                let coaDebit = await AccCoa.query().where('id', obj.coa_id).last()

                
                /** INSERT DATA JURNAL ASSET**/
                const trxJurnal_new = new TrxJurnal()
                trxJurnal_new.fill({
                    createdby: user.id,
                    bisnis_id: ws.bisnis_id, 
                    cabang_id: req.cabang_id, 
                    trx_beli: params.id,
                    coa_id: obj.coa_id,
                    kode: coaDebit.kode,
                    reff: trxFakturBeli.reff_ro || null,
                    kode_faktur: req.kode,
                    narasi: obj.description,
                    trx_date: req.date_faktur,
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                    dk: 'd',
                    is_delay: 'N'
                })
                
                await trxJurnal_new.save(trx)

                /** INSERT DATA JURNAL HUTANG DAGANG **/
                const coaHutang = await AccCoa.query().where('kode', '200.1.1').last()
                const trxJurnal_new_hutang = new TrxJurnal()
                trxJurnal_new_hutang.fill({
                    createdby: user.id,
                    bisnis_id: ws.bisnis_id, 
                    cabang_id: req.cabang_id, 
                    trx_beli: params.id,
                    coa_id: coaHutang.id,
                    kode: coaHutang.kode,
                    reff: trxFakturBeli.reff_ro || null,
                    kode_faktur: req.kode,
                    narasi: obj.description,
                    trx_date: req.date_faktur,
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                    dk: 'k',
                    is_delay: 'N'
                })
                
                await trxJurnal_new_hutang.save(trx)
            }

            /** DELETE EXSISTING DATA **/
            await BarangLokasi.query(trx).where('trx_fb', params.id).delete()
            for (const obj of req.items) {
                /** INSERT STOK PERSEDIAAN JIKA ITEM BERUPA BARANG **/
                if(obj.barang_id){
                    const pr_id = await TrxOrderBeli.query().where('kode', trxFakturBeli.reff_ro).last()
                    const barangLokasi_new = new BarangLokasi()
                    barangLokasi_new.fill({
                        ro_id: pr_id?.id || null,
                        trx_fb: params.id,
                        bisnis_id: ws.bisnis_id, 
                        cabang_id: req.cabang_id,
                        gudang_id: req.gudang_id,
                        barang_id: obj.barang_id,
                        qty_rec: obj.qty,
                        createdby: user.id
                    })
                    
                    await barangLokasi_new.save(trx)
                }
            }

            /** DELETE EXSISTING HARGA BELI **/
            await HargaBeli.query(trx).where('trx_fb', params.id).delete()
            for (const obj of req.items) {
                /** INSERT STOK PERSEDIAAN JIKA ITEM BERUPA BARANG **/
                if(obj.barang_id){
                    
                    const hargaBeli_new = new HargaBeli()
                    hargaBeli_new.fill({
                        trx_fb: params.id,
                        bisnis_id: ws.bisnis_id, 
                        barang_id: obj.barang_id,
                        periode: moment(req.date_faktur).format('YYYY-MM'),
                        harga_beli: obj.harga_stn,
                        created_by: user.id
                    })
                    
                    await hargaBeli_new.save(trx)
                }
            }

            /** JIKA ADA ATTACHMENT **/
            if(filex){
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `FB-${randURL}.${filex.extname}`
                var uriLampiran = '/upload/'+aliasName
                await filex.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })
    
                const lampiranFile = await LampiranFile.query().where('fb_id', params.id).last()
                if(lampiranFile){
                    lampiranFile.merge({
                        datatype: filex.extname,
                        url: uriLampiran
                    })
                    await lampiranFile.save(trx)
                }else{
                    const lampiranFile_new = new LampiranFile()
                    lampiranFile_new.fill({
                        fb_id: params.id,
                        datatype: filex.extname,
                        url: uriLampiran
                    })
                    await lampiranFile_new.save(trx)
                }
            }
            await trx.commit()
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new fakturBeli()