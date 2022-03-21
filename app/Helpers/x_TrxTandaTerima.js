'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const LampiranFile = use("App/Models/LampiranFile")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaJual = use("App/Models/master/HargaJual")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
const TrxTandaTerima = use("App/Models/transaksi/TrxTandaTerima")
const TrxTandaTerimaItem = use("App/Models/transaksi/TrxTandaTerimaItem")
const TrxFakturJualBayar = use("App/Models/transaksi/TrxFakturJualBayar")

class tandaTerima {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const data = (
            await TrxTandaTerima.query()
            .with('user')
            .with('bisnis')
            .with('pelanggan')
            .with('pemasok')
            .with('coa')
            .with('files')
            .with('paid')
            .with('items')
            .where(
                w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    if(req.pelanggan_id){
                        w.where('pelanggan_id', req.pelanggan_id)
                    }
                    if(req.pemasok_id){
                        w.where('pemasok_id', req.pemasok_id)
                    }
                    if(req.other_debitur){
                        w.where('other_debitur', req.other_debitur)
                    }
                    if(req.paidby){
                        w.where('paidby', req.paidby)
                    }
                    if(req.reff){
                        w.where('reff', req.reff)
                    }
                }
            ).paginate(halaman, limit)
        ).toJSON()

        return data
    }

    async POST (req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()
        
        /** INSERT TANDA TERIMA **/
        const trxTandaTerima = new TrxTandaTerima()
        const coaDb = await AccCoa.query().where('id', req.coa_debit).last()
        try {
            const fj = await TrxFakturJual.query().where('no_faktur', req.reff).last()
            trxTandaTerima.fill({
                bisnis_id: ws.bisnis_id,
                pelanggan_id: req.cust_id || null,
                pemasok_id: req.pemasok_id || null,
                reff_fj: fj?.id || null,
                other_debitur: req.other,
                coa_debit: req.coa_debit,
                coa_kode: coaDb.kode,
                narasi: req.narasi,
                title: req.title,
                trx_date: req.trx_date,
                reff: req.reff,
                paidby: req.paidby,
                author: user.id
            })
            await trxTandaTerima.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save tanda terima '+ JSON.stringify(error)
            }
        }

        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `TT-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName
            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = new LampiranFile()
            lampiranFile.fill({
                tt_id: trxTandaTerima.id,
                datatype: filex.extname,
                url: uriLampiran
            })

            await lampiranFile.save(trx)
        }


        /** INSERT TANDA TERIMA ITEMS **/
        for (const obj of req.items) {
            let coaKr = await AccCoa.query().where('id', obj.coa_kredit).last()
            try {
                const trxTandaTerimaItem = new TrxTandaTerimaItem()
                trxTandaTerimaItem.fill({
                    trx_terimaid: trxTandaTerima.id,
                    barang_id: obj.barang_id || null,
                    equipment_id: obj.equipment_id || null,
                    narasi: obj.narasi || '',
                    coa_kredit: obj.coa_kredit,
                    coa_kode: coaKr.kode,
                    qty: obj.qty,
                    harga_stn: obj.harga_stn,
                    harga_pot: obj.harga_pot,
                    harga_total: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                })
                await trxTandaTerimaItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save tanda terima items '+ JSON.stringify(error)
                }
            }
        }

        /** AKUMULASI TOTAL BAYAR DAN TOTAL POTONGAN **/
        const totBayar = req.items.reduce((a, b) => { return a + ((parseFloat(b.qty) * parseFloat(b.harga_stn)) - parseFloat(b.harga_pot)) }, 0)
        const totPotongan = req.items.reduce((a, b) => { return a + b.harga_pot }, 0)

        /** INSERT PEMBAYARAN **/
        const kwitansi = await initFunc.GEN_KODE_BAYAR(user.id)
        let trxFakturJual = await TrxFakturJual.query().where('no_faktur', req.reff).last()
        try {
            const trxFakturJualBayar = new TrxFakturJualBayar()
            trxFakturJualBayar.fill({
                bisnis_id: ws.bisnis_id,
                trx_jual: trxFakturJual?.id || null,
                tt_id: trxTandaTerima.id,
                no_faktur: req.reff,
                no_paid: kwitansi,
                date_paid: req.trx_date,
                tipe_paid: req.tipe_paid,
                nilai_paid: totBayar,
                narasi: req.narasi,
            })
            await trxFakturJualBayar.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data pembayaran '+ JSON.stringify(error)
            }
        }

        /** INSERT JURNAL DEBIT **/
        try {
            const trxJurnalDb = new TrxJurnal()
            trxJurnalDb.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                tt_id: trxTandaTerima.id,
                coa_id: req.coa_debit,
                kode: coaDb.kode,
                kode_faktur: req.reff || null,
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: totBayar,
                dk: 'd'
            })
            await trxJurnalDb.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save jurnal debit '+ JSON.stringify(error)
            }
        }

        /** INSERT JURNAL KREDIT **/

        for (const obj of req.items) {
            let coaKr = await AccCoa.query().where('id', obj.coa_kredit).last()
            const dataKr = {
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                tt_id: trxTandaTerima.id,
                coa_id: obj.coa_kredit,
                kode: coaKr.kode,
                kode_faktur: req.reff || null,
                narasi: obj.narasi,
                trx_date: req.trx_date,
                nilai: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                dk: 'k'
            }
            try {
                const trxJurnalKr = new TrxJurnal()
                trxJurnalKr.fill(dataKr)
                await trxJurnalKr.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save jurnal kredit '+ JSON.stringify(error)
                }
            }
        }

        /** INSERT JURNAL PENDAPATAN SEWA ATAU PEJUALAN BARANG **/
        const kode_sewa = await initFunc.DEF_COA(user.id)

        
        /** CHECK JIKA REFF DITEMUKAN PADA TRX FAKTUR JUAL **/
        // const trxFakturJual = await TrxFakturJual.query().where('no_faktur', req.reff).last()
        if(trxFakturJual){
            for (const obj of req.items) {
                try {

                    let tipePendapatan
                    if(obj.equipment_id){
                        tipePendapatan = kode_sewa.kode_pendapatansewa
                    }else if(obj.barang_id){
                        tipePendapatan = kode_sewa.kode_jualbarang
                    }else{
                        tipePendapatan = kode_sewa.kode_pendapatansewa
                    }

                    const coaPendapatan = await AccCoa.query().where('kode', tipePendapatan).last()
                    const trxJurnalPendapatan = new TrxJurnal()
                    trxJurnalPendapatan.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id,
                        tt_id: trxTandaTerima.id,
                        coa_id: coaPendapatan.id,
                        kode: coaPendapatan.kode,
                        kode_faktur: req.reff,
                        narasi: obj.narasi,
                        trx_date: req.trx_date,
                        nilai: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                        dk: 'k'
                    })
                    await trxJurnalPendapatan.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save jurnal pendapatan '+ JSON.stringify(error)
                    }
                }
            }
        }

        await trx.commit()

        /** INSERT LABA DITAHAN **/
        try {
            await initFunc.INSERT_LABATAHAN(user)
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data laba ditahan...'
            }
        }
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = 
        (await TrxTandaTerima.query()
        .with('user')
        .with('bisnis')
        .with('pelanggan')
        .with('pemasok')
        .with('coa')
        .with('files')
        .with('paid')
        .with('items')
        .where('id', params.id)
        .last()).toJSON()

        console.log(data);
        return data
    }

    async UPDATE (params, req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        console.log(params, req);

        /** JIKA LAMPIRAN FILE DITEMUKAN **/
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `TT-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName
            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = await LampiranFile.query().where('tt_id', params.id).last()
            if(lampiranFile){
                lampiranFile.merge({
                    // tt_id: params.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })
                await lampiranFile.save(trx)
            }else{
                const newLampiran = new LampiranFile()
                newLampiran.fill({
                    tt_id: params.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })
                await newLampiran.save(trx)
            }
        }

        async function GET_KODE_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data.kode
        }


        /** UPDATE TANDA TERIMA **/
        let trxTandaTerima = 
            await TrxTandaTerima
            .query()
            .with('items')
            .where('id', params.id)
            .last()
        try {
            const kode = await GET_KODE_COA(req.coa_debit)
            const data = {
                pelanggan_id: req.cust_id || null,
                pemasok_id: req.pemasok_id || null,
                paidby: req.paidby,
                other_debitur: req.other,
                coa_debit: req.coa_debit,
                title: req.title,
                narasi: req.narasi,
                trx_date: req.trx_date,
                reff: req.reff,
                coa_kode: kode
            }
            trxTandaTerima.merge(data)
            await trxTandaTerima.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed update tanda terima '+ JSON.stringify(error)
            }
        }

        /** DELETE TANDA TERIMA ITEMS YANG ADA **/
        await TrxTandaTerimaItem.query(trx).where('trx_terimaid', params.id).delete()

        /** INSERT TANDA TERIMA ITEMS YANG ADA **/
        for (const obj of req.items) {
            const trxTandaTerimaItem = new TrxTandaTerimaItem()
            let kodex
            if(obj.id){
                kodex = await GET_KODE_COA(obj.id)
            }
            trxTandaTerimaItem.fill({
                trx_terimaid: params.id,
                barang_id: obj.barang_id || null,
                gudang_id: obj.gudang_id || null,
                cabang_id: obj.cabang_id || null,
                equipment_id: obj.equipment_id || null,
                coa_kredit: obj.coa_kredit,
                coa_kode: kodex,
                narasi: obj.narasi,
                qty: obj.qty,
                harga_stn: obj.harga_stn,
                harga_pot: obj.harga_pot,
                harga_total: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                author: user.id
            })
            try {
                await trxTandaTerimaItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update tanda terima items '+ JSON.stringify(error)
                }
            }
        }

        /** DELETE PEMBAYARAN **/
        await TrxFakturJualBayar.query(trx).where('tt_id', params.id).delete()

        /** GENERATE KODE PEMBAYARAN **/
        const kwitansi = await initFunc.GEN_KODE_BAYAR(user.id)

        /** INSERT PEMBAYARAN BARU **/
        for (const obj of req.items) {
            const trx_jualx = await TrxFakturJual.query().where('no_faktur', req.reff).last()
            const trxFakturJualBayar = new TrxFakturJualBayar()
            trxFakturJualBayar.fill({
                bisnis_id: ws.bisnis_id,
                tt_id: params.id,
                trx_jual: trx_jualx?.id || null,
                no_faktur: req.reff || '',
                no_paid: kwitansi,
                date_paid: req.trx_date,
                tipe_paid: req.tipe_paid,
                nilai_paid: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                narasi: obj.narasi
            })
            try {
                await trxFakturJualBayar.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update pembayaran tanda terima '+ JSON.stringify(error)
                }
            }
        }

        /** CARI ID FAKTUR JUAL **/
        let trx_jual
        if(req.reff){
            trx_jual = await TrxFakturJual.query().where('no_faktur', req.reff).last()
        }

        /** DELETE JURNAL **/
        await TrxJurnal.query(trx).where(
            w => {
                w.where('tt_id', params.id)
                w.where('bisnis_id', ws.bisnis_id)
            }
        ).delete()
        
        /** INSERT JURNAL DEBIT **/
        const arrTotalDb = req.items.reduce((a, b) => { return a + ((parseFloat(b.qty) * parseFloat(b.harga_stn)) - parseFloat(b.harga_pot)) }, 0)
        var coa_db = await GET_KODE_COA(req.coa_debit)

        const trxJurnalDb = new TrxJurnal()
        trxJurnalDb.fill({
            createdby: user.id,
            bisnis_id: ws.bisnis_id,
            trx_jual: trx_jual?.id || null,
            tt_id: params.id,
            coa_id: req.coa_debit,
            kode: coa_db,
            kode_faktur: req.reff || null,
            narasi: req.narasi,
            trx_date: req.trx_date,
            nilai: arrTotalDb,
            dk: 'd'
        })

        try {
            await trxJurnalDb.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save jurnal debit '+ JSON.stringify(error)
            }
        }

        /** INSERT JURNAL KREDIT **/
        for (const obj of req.items) {
            var code_kr = await GET_KODE_COA(obj.coa_kredit)
            const trxJurnalKr = new TrxJurnal()
            trxJurnalKr.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                trx_jual: trx_jual?.id || null,
                tt_id: params.id,
                coa_id: obj.coa_kredit,
                kode: code_kr,
                kode_faktur: req.reff || null,
                narasi: obj.narasi || '',
                trx_date: req.trx_date,
                nilai: obj.subtotal,
                dk: 'k'
            })
            await trxJurnalKr.save(trx)
        }

        /** INSERT JURNAL PENDAPATAN SEWA ATAU PEJUALAN BARANG **/
        const initCoa = await initFunc.DEF_COA(user.id)

        
        /** CHECK JIKA REFF DITEMUKAN PADA TRX FAKTUR JUAL **/
        // const trxFakturJual = await TrxFakturJual.query().where('no_faktur', req.reff).last()
        if(trx_jual){
            for (const obj of req.items) {
                try {

                    let tipePendapatan
                    if(obj.equipment_id){
                        tipePendapatan = initCoa.kode_pendapatansewa
                    }else if(obj.barang_id){
                        tipePendapatan = initCoa.kode_jualbarang
                    }else{
                        tipePendapatan = initCoa.kode_pendapatansewa
                    }

                    const coaPendapatan = await AccCoa.query().where('kode', tipePendapatan).last()

                    const trxJurnalPendapatan = new TrxJurnal()
                    trxJurnalPendapatan.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id,
                        tt_id: params.id,
                        coa_id: coaPendapatan.id,
                        kode: coaPendapatan.kode,
                        kode_faktur: req.reff,
                        narasi: obj.narasi,
                        trx_date: req.trx_date,
                        nilai: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                        dk: 'k'
                    })
                    await trxJurnalPendapatan.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save jurnal pendapatan '+ JSON.stringify(error)
                    }
                }
            }
        }

        await trx.commit()

        /** INSERT LABA DITAHAN **/
        try {
            await initFunc.INSERT_LABATAHAN(user)
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data laba ditahan...'
            }
        }
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params) {
        try {
            await TrxTandaTerima.query().where('id', params.id).delete()
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed delete data...'
            }
        }
    }

    async HISTORY_HARGA(params){
        const beli = (
            await HargaBeli.query().where( w => {
                w.where('barang_id', params.id)
                w.where('periode', 'like', `${moment().format("YYYY")}%`)
            }).orderBy('periode', 'desc')
            .fetch()
        ).toJSON()

        const jual = (
            await HargaJual.query().where( w => {
                w.where('barang_id', params.id)
                w.where('periode', 'like', `${moment().format("YYYY")}%`)
            }).orderBy('periode', 'desc')
            .fetch()
        ).toJSON()

        return {
            beli, 
            jual
        }
    }
}

module.exports = new tandaTerima()