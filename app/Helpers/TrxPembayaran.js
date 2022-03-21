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
const TrxBank = use("App/Models/transaksi/TrxBank")
const TrxKases = use("App/Models/transaksi/TrxKase")
const HargaJual = use("App/Models/master/HargaJual")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxFakturBeli = use("App/Models/transaksi/TrxFakturBeli")
const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
const TrxPembayaran = use("App/Models/transaksi/TrxPembayaran")
const TrxPembayaranItem = use("App/Models/transaksi/TrxPembayaranItem")
const TrxFakturBeliBayar = use("App/Models/transaksi/TrxFakturBeliBayar")

class pembayaran {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const data = (
            await TrxPembayaran.query()
            .with('bisnis')
            .with('pemasok')
            .with('pelanggan')
            .with('coa')
            .with('user')
            .with('files')
            .with('items')
            .where(
                w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    if(req.pemasok_id){
                        w.where('pemasok_id', req.pemasok_id)
                    }
                    if(req.pelanggan_id){
                        w.where('pelanggan_id', req.pelanggan_id)
                    }
                    if(req.coa_kredit){
                        w.where('coa_kredit', req.coa_kredit)
                    }
                    if(req.narasi){
                        w.where('narasi', 'like', `%${req.narasi}%`)
                    }
                }
            ).paginate(halaman, limit)
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
        
        async function GET_DATA_TRXBELI(id){
            const data = await TrxFakturBeli.query().with('pemasok').where('id', id).last()
            return data
        }

        /** INSERT TRXPEMBAYARAN **/
        let sumTotal = req.items.reduce((a, b) => { return a + (parseFloat(b.qty) * parseFloat(b.harga_stn)) }, 0)
        let trxPembayaran = new TrxPembayaran()
        try {
            var coaKr = await GET_DATA_COA(req.coa_kredit)
            trxPembayaran.fill({
                author: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id,
                pemasok_id: req.pemasok_id || null,
                pelanggan_id: req.pelanggan_id || null,
                coa_kredit: coaKr.id,
                coa_kode: coaKr.kode,
                reff: req.reff || null,
                trx_date: req.trx_date,
                delay_trx: req.delay_trx,
                is_delay: req.is_delay,
                penerima: req.penerima || null,
                total: sumTotal,
                title: req.title,
                paidby: req.paidby,
                narasi: req.narasi
            })
            await trxPembayaran.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pembayaran '+ JSON.stringify(error)
            }
        }
        /** JIKA DITEMUKAN FILE ATACHMENT **/
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `BB-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName
            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = new LampiranFile()
            lampiranFile.fill({
                bb_id: trxPembayaran.id,
                datatype: filex.extname,
                url: uriLampiran
            })

            await lampiranFile.save(trx)
        }

        /** INSERT TRXPEMBAYARAN ITEMS **/
        for (const obj of req.items) {
            const trxPembayaranItem = new TrxPembayaranItem()
            try {
                var coaDb = await GET_DATA_COA(obj.coa_debit)
                const data = {
                    paid_id: trxPembayaran.id,
                    cabang_id: req.cabang_id,
                    trx_beli: obj.trx_beli || null,
                    trx_jual: obj.trx_jual || null,
                    narasi: obj.narasi,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    pemasok_id: obj.pemasok_id || null,
                    pelanggan_id: obj.pelanggan_id || null,
                    coa_debit: obj.coa_debit,
                    coa_kode: coaDb.kode,
                    qty: obj.qty,
                    harga_stn: obj.harga_stn,
                    harga_total: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                }
                trxPembayaranItem.fill(data)
                await trxPembayaranItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save pembayaran item '+ JSON.stringify(error)
                }
            }
            
            if(obj.trx_beli){
                try {
                    /** INSERT TRX FAKTUR BELI BAYAR **/
                    var kodePaid = await initFunc.GEN_KODE_PAID_OUT(user.id)
                    var trx_fakturbeli = await GET_DATA_TRXBELI(obj.trx_beli)
                    
                    let trxFakturBeliBayar = new TrxFakturBeliBayar()
                    trxFakturBeliBayar.fill({
                        bisnis_id: ws.bisnis_id,
                        bbi_id: trxPembayaranItem.id,
                        trx_beli: obj.trx_beli || null,
                        no_faktur: trx_fakturbeli?.kode || null,
                        no_paid: kodePaid,
                        date_paid: req.trx_date,
                        tipe_paid: req.tipe_paid,
                        narasi: obj.narasi,
                        nilai_paid: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                    })

                    await trxFakturBeliBayar.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save trx faktur beli bayar '+ JSON.stringify(error)
                    }
                }
            }

            /** UPDATE SISA TRX PEMBELIAN **/
            if(obj.trx_beli){
                const trxFakturBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                var bayar = parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                var sts_trx = parseFloat(trxFakturBeli.total) >= (parseFloat(trxFakturBeli.sisa) - parseFloat(bayar)) ? 'bersisa' : 'lunas'
                try {
                    trxFakturBeli.merge({
                        sisa: trxFakturBeli.sisa - bayar,
                        sts_paid: sts_trx
                    })
                    await trxFakturBeli.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update sisa trx faktur beli '+ JSON.stringify(error)
                    }
                }
            }
        }
        
        /** INSERT TRX JURNAL KREDIT **/
        var totBayar = req.items.reduce((a, b) => { return a + (parseFloat(b.qty) * parseFloat(b.harga_stn)) }, 0)
        try {
            var coaKr = await GET_DATA_COA(req.coa_kredit)
            const jurnalKr = new TrxJurnal()
            jurnalKr.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                bisnis_id: ws.bisnis_id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                bb_id: trxPembayaran.id,
                coa_id: req.coa_kredit,
                kode: coaKr.kode,
                kode_faktur: req.reff || null,
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: totBayar,
                is_delay: req.is_delay,
                dk: 'k'
            })
            await jurnalKr.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit '+ JSON.stringify(error)
            }
        }
        
        /** JIKA KREDIT DI BANK MAKA UPDATE BANK **/
        if(req.bank_id){
            const trxBank = new TrxBank()
            let dataBank = {
                bank_id: req.bank_id,
                trx_date: req.trx_date,
                bb_id: trxPembayaran.id,
                desc: req.narasi
            }
            dataBank = req.is_delay === 'N' ? {...dataBank, saldo_net: parseFloat(sumTotal) * -1} : {...dataBank, tarik_tunda: parseFloat(sumTotal) * -1}
            trxBank.fill(dataBank)
            try {
                await trxBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx bank '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_id){
            const trxKases = new TrxKases()
            let dataKases = {
                kas_id: req.kas_id,
                trx_date: req.trx_date,
                bb_id: trxPembayaran.id,
                desc: req.narasi,
                saldo_rill: sumTotal
            }
            trxKases.fill(dataKases)
            try {
                await trxKases.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx Kases '+ JSON.stringify(error)
                }
            }
        }
        
        /** INSERT TRX JURNAL DEBIT **/
        for (const obj of req.items) {
            var coaDb = await GET_DATA_COA(obj.coa_debit)
            try {
                const jurnalDb = new TrxJurnal()
                jurnalDb.fill({
                    createdby: user.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    trx_jual: obj.trx_jual || null,
                    trx_beli: obj.trx_beli || null,
                    bb_id: trxPembayaran.id,
                    coa_id: obj.coa_debit,
                    kode: coaDb.kode,
                    kode_faktur: req.reff || null,
                    narasi: obj.narasi,
                    trx_date: req.trx_date,
                    is_delay: req.is_delay,
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                    dk: 'd'
                })
                await jurnalDb.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
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
            await TrxPembayaran.query()
            .with('bisnis')
            .with('pemasok')
            .with('pelanggan')
            .with('coa')
            .with('user')
            .with('files')
            .with('items', i => i.with('paid'))
            .where('id', params.id)
            .last()
        ).toJSON()
        
        data.no_paid = data.items[0].paid?.no_paid || ''
        data.tipe_paid = data.items[0].paid?.tipe_paid || ''
        return data
    }

    async PRINT (params) {
        const data = (
            await TrxPembayaran.query()
            .with('bisnis')
            .with('pemasok')
            .with('pelanggan')
            .with('coa')
            .with('user')
            .with('files')
            .with('items', i => {
                i.with('paid')
                i.with('coa')
                i.with('pemasok')
                i.with('pelanggan')
            })
            .where('id', params.id)
            .last()
        ).toJSON()
        
        data.no_paid = data.items[0].paid?.no_paid || ''
        data.tipe_paid = data.items[0].paid?.tipe_paid || ''
        return data
    }

    async UPDATE (params, req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        /** HITUNG TOTAL HARGA ITEMS **/
        const sumTotal = req.items.reduce((a, b) => { return a + (parseFloat(b.qty) * parseFloat(b.harga_stn)) }, 0)

        async function OLD_DATA(){
            const data = await TrxPembayaran.query().where('id', params.id).last()
            return data
        }

        async function GET_DATA_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }
        
        async function GET_DATA_TRXBELI(id){
            const data = await TrxFakturBeli.query().with('pemasok').where('id', id).last()
            return data
        }

        /** JIKA DITEMUKAN FILE ATACHMENT **/
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `BB-${randURL}.${filex.extname}`
            var uriLampiran = '/upload/'+aliasName
            await filex.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            const lampiranFile = new LampiranFile()
            lampiranFile.fill({
                bb_id: params.id,
                datatype: filex.extname,
                url: uriLampiran
            })

            await lampiranFile.save(trx)
        }

        /** UPDATE TRX PEMBAYARAN **/
        const trxPembayaran = await TrxPembayaran.query().where('id', params.id).last()
        var coaKr = await GET_DATA_COA(req.coa_kredit)
        trxPembayaran.merge({
            author: user.id,
            bisnis_id: ws.bisnis_id,
            cabang_id: req.cabang_id,
            pemasok_id: req.pemasok_id || null,
            pelanggan_id: req.pelanggan_id || null,
            coa_kredit: coaKr.id,
            coa_kode: coaKr.kode,
            reff: req.reff || null,
            trx_date: req.trx_date,
            delay_trx: req.delay_trx,
            is_delay: req.is_delay,
            penerima: req.penerima || null,
            total: sumTotal,
            title: req.title,
            paidby: req.paidby,
            narasi: req.narasi
        })
        try {
            await trxPembayaran.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pembayaran '+ JSON.stringify(error)
            }
        }

        /** JIKA KREDIT DI BANK MAKA UPDATE BANK **/
        if(req.bank_id){
            await TrxBank.query().where('bb_id', params.id).delete()
            const trxBank = new TrxBank()
            let dataBank = {
                bank_id: req.bank_id,
                trx_date: req.trx_date,
                bb_id: trxPembayaran.id,
                desc: req.narasi
            }
            dataBank = req.is_delay === 'N' ? {...dataBank, saldo_net: parseFloat(sumTotal) * -1} : {...dataBank, tarik_tunda: parseFloat(sumTotal) * -1}
            trxBank.fill(dataBank)
            try {
                await trxBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx bank '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_id){
            await TrxKases.query().where('bb_id', params.id).delete()
            const trxKases = new TrxKases()
            let dataKases = {
                kas_id: req.kas_id,
                trx_date: req.trx_date,
                bb_id: trxPembayaran.id,
                desc: req.narasi,
                saldo_rill: sumTotal
            }
            trxKases.fill(dataKases)
            try {
                await trxKases.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx Kases '+ JSON.stringify(error)
                }
            }
        }

        /** DELETE PEMBAYARAN ITEMS **/
        await TrxPembayaranItem.query(trx).where('paid_id', params.id).delete()

        /** INSERT PEMBAYARAN ITEMS **/
        for (const obj of req.items) {
            const trxPembayaranItem = new TrxPembayaranItem()
            try {
                var coaDb = await GET_DATA_COA(obj.coa_debit)
                const data = {
                    paid_id: trxPembayaran.id,
                    cabang_id: req.cabang_id,
                    trx_beli: obj.trx_beli || null,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    pemasok_id: obj.pemasok_id || null,
                    pelanggan_id: obj.pelanggan_id || null,
                    coa_debit: obj.coa_debit,
                    coa_kode: coaDb.kode,
                    qty: obj.qty,
                    harga_stn: obj.harga_stn,
                    harga_total: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                }
                trxPembayaranItem.fill(data)
                await trxPembayaranItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save pembayaran item '+ JSON.stringify(error)
                }
            }

            if(obj.trx_beli){
                try {
                    /** INSERT TRX FAKTUR BELI BAYAR **/
                    var kodePaid = await initFunc.GEN_KODE_PAID_OUT(user.id)
                    var trx_fakturbeli = await GET_DATA_TRXBELI(obj.trx_beli)
                    
                    let trxFakturBeliBayar = new TrxFakturBeliBayar()
                    trxFakturBeliBayar.fill({
                        bisnis_id: ws.bisnis_id,
                        bbi_id: trxPembayaranItem.id,
                        trx_beli: obj.trx_beli || null,
                        no_faktur: trx_fakturbeli?.kode || null,
                        no_paid: kodePaid,
                        date_paid: req.trx_date,
                        tipe_paid: req.tipe_paid,
                        narasi: obj.narasi,
                        nilai_paid: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                    })

                    await trxFakturBeliBayar.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save trx faktur beli bayar '+ JSON.stringify(error)
                    }
                }

                /** UPDATE SISA TRX PEMBELIAN **/
                const trxFakturBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                var bayar = parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                var sts_trx = parseFloat(trxFakturBeli.total) >= (parseFloat(trxFakturBeli.sisa) - parseFloat(bayar)) ? 'bersisa' : 'lunas'
                try {
                    trxFakturBeli.merge({
                        sisa: trxFakturBeli.sisa - bayar,
                        sts_paid: sts_trx
                    })
                    await trxFakturBeli.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update sisa trx faktur beli '+ JSON.stringify(error)
                    }
                }
            }
        }


        /** DELETE TRX JURNAL **/
        await TrxJurnal.query(trx).where('bb_id', params.id).delete()

        /** INSERT TRX JURNAL KREDIT **/
        try {
            var coaKr = await GET_DATA_COA(req.coa_kredit)
            const jurnalKr = new TrxJurnal()
            jurnalKr.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                bb_id: params.id,
                coa_id: req.coa_kredit,
                kode: coaKr.kode,
                kode_faktur: req.reff || null,
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: sumTotal,
                is_delay: req.is_delay,
                dk: 'k'
            })
            await jurnalKr.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit '+ JSON.stringify(error)
            }
        }

        /** INSERT TRX JURNAL DEBIT **/
        for (const obj of req.items) {
            var coaDb = await GET_DATA_COA(obj.coa_debit)
            try {
                const jurnalDb = new TrxJurnal()
                jurnalDb.fill({
                    createdby: user.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    bb_id: params.id,
                    coa_id: obj.coa_debit,
                    kode: coaDb.kode,
                    kode_faktur: req.reff || null,
                    narasi: obj.narasi,
                    trx_date: req.trx_date,
                    is_delay: req.is_delay,
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                    dk: 'd'
                })
                await jurnalDb.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }
}

module.exports = new pembayaran()