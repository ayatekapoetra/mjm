'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const BarangLokasi = use("App/Models/BarangLokasi")
const LampiranFile = use("App/Models/LampiranFile")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxOrderBeli = use("App/Models/transaksi/TrxOrderBeli")
const TrxFakturBeli = use("App/Models/transaksi/TrxFakturBeli")
const TrxTerimaBarangHelpers = use("App/Helpers/TrxTerimaBarang")
const TrxFakturBeliItem = use("App/Models/transaksi/TrxFakturBeliItem")

class fakturBeli {
    async LIST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);

        let data = (await TrxFakturBeli
            .query()
            .with('files')
            .with('bisnis')
            .with('cabang')
            .with('pemasok')
            .with('gudang')
            .with('author', a => a.with('profile'))
            .with('items')
            .where( w => {
                w.where('bisnis_id', ws.bisnis_id)
            })
            .orderBy('date_faktur', 'desc')
            .paginate(halaman, limit)
        ).toJSON()
        
        return data
    }

    async POST (req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()
        const {
            bisnis_id, 
            cabang_id, 
            gudang_id, 
            pemasok_id, 
            reff_ro, 
            kode, 
            total, 
            date_faktur, 
            due_date, 
            title, 
            items
        } = req

        try {
            const trxFakturBeli = new TrxFakturBeli()
            trxFakturBeli.fill({
                bisnis_id: ws.bisnis_id, 
                cabang_id: cabang_id, 
                gudang_id: gudang_id, 
                pemasok_id: pemasok_id, 
                reff_ro: reff_ro, 
                kode: kode, 
                total: total, 
                sisa: total,
                date_faktur: date_faktur, 
                due_date: due_date, 
                title: title,
                createdby: user.id,
            })
            await trxFakturBeli.save(trx)

            if(filex){
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `FB-${randURL}.${filex.extname}`
                var uriLampiran = '/upload/'+aliasName
                await filex.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })

                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    fb_id: trxFakturBeli.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })

                await lampiranFile.save(trx)
            }

            for (const obj of req.items) {
                
                /** CHECK COA IS EXSIST **/
                let coaDebit
                let coaKredit

                if(obj.coa_id){

                    /** INSERT DATA TRX-JURNAL DEBIT **/
                    coaDebit = await AccCoa.query().where('id', obj.coa_id).last()

                    const trxJurnalDebit = new TrxJurnal()
                    trxJurnalDebit.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id, 
                        trx_beli: trxFakturBeli.id,
                        coa_id: obj.coa_id,
                        kode: coaDebit.kode,
                        reff: reff_ro,
                        kode_faktur: kode,
                        narasi: obj.description,
                        trx_date: date_faktur || new Date(),
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        dk: 'd',
                        // dk: coa.dk,
                        is_delay: 'N'
                    })

                    await trxJurnalDebit.save(trx)

                    // if(){

                    // }
                    /** INSERT DATA TRX-JURNAL KREDIT HUTANG DAGANG **/
                    coaKredit = await AccCoa.query().where( w => {
                        w.where('kode', '200.1.1')
                        w.where('bisnis_id', ws.bisnis_id)
                    }).last()

                    const trxJurnalKredit = new TrxJurnal()
                    trxJurnalKredit.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id, 
                        trx_beli: trxFakturBeli.id,
                        coa_id: coaKredit.id,
                        kode: coaKredit.kode,
                        reff: reff_ro,
                        kode_faktur: kode,
                        narasi: obj.description,
                        trx_date: date_faktur || new Date(),
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        dk: 'k',
                        // dk: coa.dk,
                        is_delay: 'N'
                    })

                    await trxJurnalKredit.save(trx)

                    /** INSERT STOK PERSEDIAAN JIKA ITEM BERUPA BARANG **/
                    if(obj.barang_id){
                        const pr_id = await TrxOrderBeli.query().where('kode', reff_ro).last()
                        const barangLokasi = new BarangLokasi()
                        barangLokasi.fill({
                            ro_id: pr_id?.id || null,
                            trx_fb: trxFakturBeli.id,
                            bisnis_id: ws.bisnis_id, 
                            cabang_id: cabang_id,
                            gudang_id: gudang_id,
                            barang_id: obj.barang_id,
                            qty_rec: obj.qty,
                            createdby: user.id
                        })
    
                        await barangLokasi.save(trx)

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
                                bisnis_id: ws.bisnis_id, 
                                gudang_id: gudang_id,
                                trx_fb: trxFakturBeli.id,
                                periode: moment().format('YYYY-MM'),
                                narasi: req.kode,
                                harga_beli: parseFloat(obj.harga_stn),
                                created_by: user.id
                            })
                            await hrgBeli.save(trx)
                        }
                    }
                }

                coaDebit = await AccCoa.query().where('id', obj.coa_id).last()

                const trxFakturBeliItem = new TrxFakturBeliItem()
                trxFakturBeliItem.fill({
                    fakturbeli_id: trxFakturBeli.id,
                    barang_id: obj.barang_id || null,
                    coa_id: obj.coa_id || null,
                    kode_coa: coaDebit?.kode || null,
                    equipment_id: obj.equipment_id || null,
                    description: obj.description,
                    qty: obj.qty,
                    stn: obj.satuan,
                    harga_stn: obj.harga_stn,
                    subtotal: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                })

                await trxFakturBeliItem.save(trx)

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