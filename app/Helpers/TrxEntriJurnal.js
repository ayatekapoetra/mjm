'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const Gudang = use("App/Models/master/Gudang")
const BarangLokasi = use("App/Models/BarangLokasi")
const LampiranFile = use("App/Models/LampiranFile")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxFakturBeli = use("App/Models/transaksi/TrxFakturBeli")
const TrxTerimaBarangHelpers = use("App/Helpers/TrxTerimaBarang")
const TrxJurnalAdjust = use("App/Models/transaksi/TrxJurnalAdjust")
const TrxJurnalAdjustItem = use("App/Models/transaksi/TrxJurnalAdjustItem")
const TrxFakturBeliItem = use("App/Models/transaksi/TrxFakturBeliItem")

class entriJurnal {

    async LIST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);

        let data = (
            await TrxJurnalAdjust
            .query()
            .with('files')
            .with('createdby')
            .with('items')
            .where( w => {
                w.where('bisnis_id', ws.bisnis_id)
            })
            .orderBy('trx_date', 'desc')
            .paginate(halaman, limit)
        ).toJSON()
        return data
    }

    async POST (req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        async function GET_DATA_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }

        async function GET_CABANG(id){
            const data = await Gudang.query().where('id', id).last()
            return data
        }

        

        var totDebit = req.items.reduce((a, b) => { return a + parseFloat(b.d) }, 0)
        var totKredit = req.items.reduce((a, b) => { return a + parseFloat(b.k) }, 0)
        var debit = 0
        var kredit = 0

        if(totDebit > totKredit){
            var debit = totDebit - totKredit
        }else if(totDebit < totKredit){
            var kredit = totKredit - totDebit
        }

        /** INSERT TRX JURNAL ADJUSTMENT **/
        const trxJurnalAdjust = new TrxJurnalAdjust()
        trxJurnalAdjust.fill({
            bisnis_id: ws.bisnis_id,
            author: user.id,
            trx_date: req.trx_date,
            reff: req.reff || null,
            debit: debit,
            kredit: kredit
        })

        try {
            await trxJurnalAdjust.save(trx)
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save jurnal penyesuaian '+ JSON.stringify(error)
            }
        }

        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `JA-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName

            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = new LampiranFile()
            lampiranFile.fill({
                ja_id: trxJurnalAdjust.id,
                datatype: filex.extname,
                url: uriLampiran
            })

            try {
                await lampiranFile.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save files '+ JSON.stringify(error)
                }
            }
        }

        for (const obj of req.items) {
            var coa = await GET_DATA_COA(obj.coa_id)
            let gudang = await GET_CABANG(obj.gudang_id)

            /** INSERT TRX JURNAL ADJUSTMENT ITEMS **/
            const trxJurnalAdjustItem = new TrxJurnalAdjustItem()
            trxJurnalAdjustItem.fill({
                d: obj.d,
                k: obj.k,
                kode: coa.kode,
                coa_id: obj.coa_id,
                narasi: obj.narasi,
                trx_adjust: trxJurnalAdjust.id,
                trx_beli: obj.trx_beli || null,
                trx_jual: obj.trx_jual || null,
                gudang_id: obj.gudang_id || null,
                barang_id: obj.barang_id || null,
                cabang_id: gudang?.cabang_id || null,
            })
            try {
                await trxJurnalAdjustItem.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save jurnal penyesuaian items '+ JSON.stringify(error)
                }
            }

            /** INSERT TRX JURNAL DEBIT **/
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                trx_adjust: trxJurnalAdjust.id,
                trx_date: req.trx_date,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                trx_beli: obj.trx_beli || null,
                trx_jual: obj.trx_jual || null,
                coa_id: obj.coa_id,
                kode: coa.kode,
                nilai: obj.d,
                dk: 'd',
                reff: obj.reff || null,
                narasi: obj.narasi,
            })
            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save jurnal debit '+ JSON.stringify(error)
                }
            }

            /** INSERT TRX JURNAL KREDIT **/
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                trx_adjust: trxJurnalAdjust.id,
                trx_date: req.trx_date,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                trx_beli: obj.trx_beli || null,
                trx_jual: obj.trx_jual || null,
                coa_id: obj.coa_id,
                kode: coa.kode,
                nilai: obj.k,
                dk: 'k',
                reff: obj.reff || null,
                narasi: obj.narasi,
            })

            try {
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save jurnal kredit '+ JSON.stringify(error)
                }
            }

            /** JIKA QTY/JUMLAH DITEMUKAN **/
            if(obj.qty > 0 && obj.gudang_id && obj.barang_id){
                const tambahBarang = new BarangLokasi()
                tambahBarang.fill({
                    trx_adj: trxJurnalAdjust.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: gudang?.cabang_id || null,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    qty_hand: obj.qty,
                    qty_rec: 0,
                    qty_del: 0,
                    createdby: user.id
                })
                try {
                    await tambahBarang.save(trx)
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed save jumlah persediaan '+ JSON.stringify(error)
                    }
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
            await TrxJurnalAdjust
            .query()
            .with('createdby')
            .with('items')
            .where('id', params.id)
            .last()
        ).toJSON()

        // console.log(data);
        return data
    }

    async UPDATE (params, req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        async function GET_DATA_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }

        async function GET_CABANG(id){
            const data = await Gudang.query().where('id', id).last()
            return data
        }

        var totDebit = req.items.reduce((a, b) => { return a + parseFloat(b.d) }, 0)
        var totKredit = req.items.reduce((a, b) => { return a + parseFloat(b.k) }, 0)
        var debit = 0
        var kredit = 0

        if(totDebit > totKredit){
            var debit = totDebit - totKredit
        }else if(totDebit < totKredit){
            var kredit = totKredit - totDebit
        }

        /** UPDATE TRX JURNAL ADJUSTMENT **/
        const trxJurnalAdjust = await TrxJurnalAdjust.query().where('id', params.id).last()
        trxJurnalAdjust.merge({
            bisnis_id: ws.bisnis_id,
            author: user.id,
            trx_date: req.trx_date,
            reff: req.reff || null,
            debit: debit,
            kredit: kredit
        })

        try {
            await trxJurnalAdjust.save(trx)
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save jurnal penyesuaian '+ JSON.stringify(error)
            }
        }
        
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `JA-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName

            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            let lampiranFile = await LampiranFile.query().where('ja_id', params.id).last()
            // console.log('-----------', lampiranFile);
            if(lampiranFile){
                lampiranFile.merge({
                    datatype: filex.extname,
                    url: uriLampiran
                })
            }else{
                lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    ja_id: params.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })
            }
            try {
                await lampiranFile.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save files '+ JSON.stringify(error)
                }
            }
        }

        

        /** DELETE JURNAL PENYESUAIAN ITEM **/
        await TrxJurnalAdjustItem.query(trx).where('trx_adjust', params.id).delete()

        /** DELETE JURNAL ITEM **/
        await TrxJurnal.query(trx).where('trx_adjust', params.id).delete()

        /** DELETE LOKASI BARANG ITEM **/
        await BarangLokasi.query(trx).where('trx_adj', params.id).delete()

        /** INSERT JURNAL PENYESUAIAN ITEM **/
        for (const obj of req.items) {
            var coa = await GET_DATA_COA(obj.coa_id)
            let gudang = await GET_CABANG(obj.gudang_id)

            /** INSERT TRX JURNAL ADJUSTMENT ITEMS **/
            const trxJurnalAdjustItem = new TrxJurnalAdjustItem()
            trxJurnalAdjustItem.fill({
                d: obj.d,
                k: obj.k,
                kode: coa.kode,
                coa_id: obj.coa_id,
                narasi: obj.narasi,
                trx_adjust: trxJurnalAdjust.id,
                trx_beli: obj.trx_beli || null,
                trx_jual: obj.trx_jual || null,
                gudang_id: obj.gudang_id || null,
                barang_id: obj.barang_id || null,
                qty: obj.qty || 0,
                cabang_id: gudang?.cabang_id || null,
            })
            try {
                await trxJurnalAdjustItem.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save jurnal penyesuaian items '+ JSON.stringify(error)
                }
            }

            /** INSERT TRX JURNAL DEBIT **/
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                trx_adjust: trxJurnalAdjust.id,
                trx_date: req.trx_date,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                trx_beli: obj.trx_beli || null,
                trx_jual: obj.trx_jual || null,
                coa_id: obj.coa_id,
                kode: coa.kode,
                nilai: obj.d,
                dk: 'd',
                reff: obj.reff || null,
                narasi: obj.narasi,
            })
            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save jurnal debit '+ JSON.stringify(error)
                }
            }

            /** INSERT TRX JURNAL KREDIT **/
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                trx_adjust: trxJurnalAdjust.id,
                trx_date: req.trx_date,
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                trx_beli: obj.trx_beli || null,
                trx_jual: obj.trx_jual || null,
                coa_id: obj.coa_id,
                kode: coa.kode,
                nilai: obj.k,
                dk: 'k',
                reff: obj.reff || null,
                narasi: obj.narasi,
            })

            try {
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save jurnal kredit '+ JSON.stringify(error)
                }
            }

            /** JIKA QTY/JUMLAH DITEMUKAN **/
            if(obj.gudang_id && obj.barang_id){
                const tambahBarang = new BarangLokasi()
                tambahBarang.fill({
                    trx_adj: trxJurnalAdjust.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: gudang?.cabang_id || null,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    qty_hand: obj.qty,
                    qty_rec: 0,
                    qty_del: 0,
                    createdby: user.id
                })
                try {
                    await tambahBarang.save(trx)
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed save jumlah persediaan '+ JSON.stringify(error)
                    }
                }
            }
        }
        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }
    async DELETE (params) {
        try {
            await TrxJurnalAdjust.query().where('id', params.id).delete()
            return {
                success: true,
                message: 'Success delete data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed delete data '+ JSON.stringify(error)
            }
        }
    }
}

module.exports = new entriJurnal()