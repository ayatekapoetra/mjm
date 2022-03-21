'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Equipment = use("App/Models/master/Equipment")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const LampiranFile = use("App/Models/LampiranFile")
const BarangLokasi = use("App/Models/BarangLokasi")
const TrxBank = use("App/Models/transaksi/TrxBank")
const TrxKases = use("App/Models/transaksi/TrxKase")
const HargaJual = use("App/Models/master/HargaJual")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
const TrxFakturJualItem = use("App/Models/transaksi/TrxFakturJualItem")
const TrxFakturBeli = use("App/Models/transaksi/TrxFakturBeli")
const TrxFakturBeliItem = use("App/Models/transaksi/TrxFakturBeliItem")
const TrxTandaTerima = use("App/Models/transaksi/TrxTandaTerima")
const TrxTandaTerimaItem = use("App/Models/transaksi/TrxTandaTerimaItem")
const TrxFakturJualBayar = use("App/Models/transaksi/TrxFakturJualBayar")

class tandaTerima {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data = (
            await TrxTandaTerima.query()
            .with('user')
            .with('bisnis')
            .with('pelanggan')
            .with('pemasok')
            .with('coa')
            .with('files')
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

        let result = []
        for (let item of data.data) {
            let sumItems = item.items.reduce((a, b) => { return a + b.harga_total }, 0)
            item = {...item, sum_total: sumItems}
            result.push(item)
        }
        data = {...data, data: result}
        return data
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
        .with('items', a => a.with('paid'))
        .where('id', params.id)
        .last()).toJSON()

        // console.log(data);
        return data
    }

    async PRINT (params) {
        const data = 
        (await TrxTandaTerima.query()
        .with('user')
        .with('bisnis')
        .with('pelanggan')
        .with('pemasok')
        .with('coa')
        .with('files')
        .with('items', a => {
            a.with('coa')
            a.with('pelanggan')
            a.with('paid')
        })
        .where('id', params.id)
        .last()).toJSON()

        // console.log(data);
        return data
    }

    async POST (req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()
        let trx_jual = null
        let trx_beli = null
        
        /** HITUNG TOTAL HARGA ITEMS **/
        const sumTotal = req.items.reduce((a, b) => { return a + (parseFloat(b.qty) * parseFloat(b.harga_stn)) }, 0)

        /** DEFINE COA **/
        async function GET_DATA_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }
        
        async function GET_DATA_TRXJUAL(id){
            const data = await TrxFakturJual.query().with('pelanggan').where('id', id).last()
            return data
        }

        async function GET_DATA_TRXBELI(id){
            const data = await TrxFakturBeli.query().with('pemasok').where('id', id).last()
            return data
        }

        // console.log(req);
        /** INSERT TANDA TERIMA **/
        const trxTandaTerima = new TrxTandaTerima()
        const coaDb = await GET_DATA_COA(req.coa_debit)
        try {
            trxTandaTerima.fill({
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id,
                pelanggan_id: req.cust_id || null,
                pemasok_id: req.pemasok_id || null,
                paidby: req.paidby,
                penerima: req.penerima,
                coa_debit: req.coa_debit,
                coa_kode: coaDb.kode,
                narasi: req.narasi,
                title: req.title,
                trx_date: req.trx_date,
                delay_trx: req.delay_trx || new Date(),
                is_delay: req.is_delay,
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

        console.log('TANDA TERIMA ::', trxTandaTerima.toJSON());

        /** INSERT JURNAL DEBIT **/
        try {
            const trxJurnalDb = new TrxJurnal()
            trxJurnalDb.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id,
                tt_id: trxTandaTerima.id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                coa_id: req.coa_debit,
                kode: coaDb.kode,
                kode_faktur: req.reff || null,
                narasi: req.narasi,
                trx_date: req.trx_date,
                is_delay: req.is_delay,
                nilai: sumTotal,
                dk: 'd'
            })
            await trxJurnalDb.save(trx)
            console.log('JURNAL DEBIT ::', trxJurnalDb.toJSON());
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save jurnal debit '+ JSON.stringify(error)
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

        /** INSERT HISTORY TRX KASBANK **/
        if(req.bank_id){
            const trxBank = new TrxBank()
            let trxData = {
                bank_id: req.bank_id,
                tt_id: trxTandaTerima.id,
                trx_date: req.trx_date
            }
            trxData = req.is_delay != 'Y' ? {...trxData, saldo_net: sumTotal} : {...trxData, setor_tunda: sumTotal}
            try {
                trxBank.fill(trxData)
                await trxBank.save(trx)
                console.log('TRX BANK ::', trxBank.toJSON());
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data Kas Bank '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_id){
            const trxKases = new TrxKases()
            try {
                trxKases.fill({
                    kas_id: req.kas_id,
                    trx_date: req.trx_date,
                    tt_id: trxTandaTerima.id,
                    saldo_rill: sumTotal
                })
                await trxKases.save(trx)
                console.log('TRX KAS ::', trxKases.toJSON());
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data Kas Bank '+ JSON.stringify(error)
                }
            }
        }

        /** INSERT TANDA TERIMA ITEMS **/
        for (const obj of req.items) {
            let coaKr = await GET_DATA_COA(obj.coa_kredit)
            const trxTandaTerimaItem = new TrxTandaTerimaItem()
            var harga_total = (parseFloat(obj.qty) * parseFloat(obj.harga_stn))
            try {
                trxTandaTerimaItem.fill({
                    trx_terimaid: trxTandaTerima.id,
                    barang_id: obj.barang_id || null,
                    trx_jual: obj.trx_jual || null,
                    trx_beli: obj.trx_beli || null,
                    equipment_id: obj.equipment_id || null,
                    narasi: obj.narasi || '',
                    coa_kredit: obj.coa_kredit,
                    coa_kode: coaKr.kode,
                    qty: obj.qty,
                    harga_stn: obj.harga_stn,
                    // harga_pot: obj.harga_pot || 0,
                    harga_total: harga_total,
                })
                await trxTandaTerimaItem.save(trx)
                console.log('TRX TANDA TERIMA ITEM ::', trxTandaTerimaItem.toJSON());
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save tanda terima items '+ JSON.stringify(error)
                }
            }

            /** INSERT PEMBAYARAN **/
            if(obj.trx_jual){
                trx_jual = obj.trx_jual ? await GET_DATA_TRXJUAL(obj.trx_jual) : null
                const kwitansi = await initFunc.GEN_KODE_TERIMA(user.id)
                try {
                    const trxFakturJualBayar = new TrxFakturJualBayar()
                    trxFakturJualBayar.fill({
                        bisnis_id: ws.bisnis_id,
                        trx_jual: trx_jual?.id || null,
                        tti_id: trxTandaTerimaItem.id,
                        no_faktur: trx_jual?.no_faktur || null,
                        no_paid: kwitansi,
                        date_paid: req.trx_date,
                        tipe_paid: req.tipe_paid,
                        nilai_paid: harga_total,
                        narasi: req.narasi,
                    })
                    await trxFakturJualBayar.save(trx)
                    console.log('TRX FAKTUR JUAL BAYAR ::', trxFakturJualBayar.toJSON());
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data pembayaran '+ JSON.stringify(error)
                    }
                }
            }

            /** INSERT JURNAL KREDIT **/
            try {
                trx_beli = obj.trx_beli ? await GET_DATA_TRXBELI(obj.trx_beli) : null
                trx_jual = obj.trx_jual ? await GET_DATA_TRXJUAL(obj.trx_jual) : null
                let coaKr = await GET_DATA_COA(obj.coa_kredit)
                const dataKr = {
                    createdby: user.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    trx_jual: trx_jual?.id || null,
                    trx_beli: trx_beli?.id || null,
                    tt_id: trxTandaTerima.id,
                    coa_id: obj.coa_kredit,
                    kode: coaKr.kode,
                    kode_faktur: trx_jual?.no_faktur || null,
                    narasi: obj.narasi,
                    trx_date: req.trx_date,
                    is_delay: req.is_delay,
                    nilai: harga_total,
                    dk: 'k'
                }
                try {
                    const trxJurnalKr = new TrxJurnal()
                    trxJurnalKr.fill(dataKr)
                    await trxJurnalKr.save(trx)
                    console.log('TRX JURNAL KREDIT ::', trxJurnalKr.toJSON());
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save jurnal kredit '+ JSON.stringify(error)
                    }
                }
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save jurnal kredit '+ JSON.stringify(error)
                }
            }
            
            
            
            // /** INSERT JURNAL PENDAPATAN SEWA ATAU PEJUALAN BARANG **/
            // let kodePendapatan
            // let barangCoa
            // let equipmentCoa
            // let coa_out
            // let trxJurnalPendapatan
            // try {
            //     /** CHECK JIKA REFF DITEMUKAN PADA TRX FAKTUR JUAL **/
            //     let harga_total = (parseFloat(obj.qty) * parseFloat(obj.harga_stn))
            //     if(obj.barang_id){
            //         barangCoa = await Barang.query().where('id', obj.barang_id).last()
            //         coa_out = barangCoa.coa_out
            //         kodePendapatan = await GET_DATA_COA(coa_out)
            //         trxJurnalPendapatan = new TrxJurnal()
            //         trxJurnalPendapatan.fill({
            //             createdby: user.id,
            //             bisnis_id: ws.bisnis_id,
            //             cabang_id: req.cabang_id,
            //             bank_id: req.bank_id || null,
            //             kas_id: req.kas_id || null,
            //             tt_id: trxTandaTerima.id,
            //             coa_id: coa_out,
            //             kode: kodePendapatan.kode,
            //             kode_faktur: req.reff,
            //             narasi: obj.narasi,
            //             trx_date: req.trx_date,
            //             nilai: harga_total,
            //             dk: 'k'
            //         })
            //         await trxJurnalPendapatan.save(trx)
            //         console.log('TRX JURNAL PENDAPATAN ::', trxJurnalPendapatan.toJSON());
            //     }
            //     if(obj.trx_jual){
            //         const jualItem = await TrxFakturJualItem.query().where('trx_jual', obj.trx_jual).first()
            //         let cekItem = jualItem.equipment_id ? true : false
            //         if(cekItem){
            //             equipmentCoa = await Equipment.query().where('id', jualItem.equipment_id).last()
            //             coa_out = equipmentCoa.coa_out
            //             kodePendapatan = await GET_DATA_COA(coa_out)
            //         }else{
            //             barangCoa = await Barang.query().where('id', jualItem.barang_id).last()
            //             coa_out = barangCoa.coa_out
            //             kodePendapatan = await GET_DATA_COA(coa_out)
            //         }
            //         trxJurnalPendapatan = new TrxJurnal()
            //         trxJurnalPendapatan.fill({
            //             createdby: user.id,
            //             bisnis_id: ws.bisnis_id,
            //             cabang_id: req.cabang_id,
            //             bank_id: req.bank_id || null,
            //             kas_id: req.kas_id || null,
            //             tt_id: trxTandaTerima.id,
            //             coa_id: coa_out,
            //             kode: kodePendapatan.kode,
            //             kode_faktur: req.reff,
            //             narasi: obj.narasi,
            //             trx_date: req.trx_date,
            //             nilai: harga_total,
            //             dk: 'k'
            //         })
            //         await trxJurnalPendapatan.save(trx)
            //         console.log('TRX JURNAL PENDAPATAN ::', trxJurnalPendapatan.toJSON());
            //     }

            //     if(obj.trx_beli){
            //         const beliItem = await TrxFakturBeliItem.query().where('fakturbeli_id', obj.trx_beli).first()
            //         let cekItem = beliItem.barang_id ? true : false
            //         if(cekItem){
            //             barangCoa = await Barang.query().where('id', beliItem.barang_id).last()
            //             coa_out = barangCoa.coa_out
            //             kodePendapatan = await GET_DATA_COA(coa_out)
            //         }
            //         trxJurnalPendapatan = new TrxJurnal()
            //         trxJurnalPendapatan.fill({
            //             createdby: user.id,
            //             bisnis_id: ws.bisnis_id,
            //             cabang_id: req.cabang_id,
            //             bank_id: req.bank_id || null,
            //             kas_id: req.kas_id || null,
            //             tt_id: trxTandaTerima.id,
            //             coa_id: coa_out,
            //             kode: kodePendapatan.kode,
            //             kode_faktur: req.reff,
            //             narasi: obj.narasi,
            //             trx_date: req.trx_date,
            //             nilai: harga_total,
            //             dk: 'k'
            //         })
            //         await trxJurnalPendapatan.save(trx)
            //         console.log('TRX JURNAL PENDAPATAN ::', trxJurnalPendapatan.toJSON());
            //     }
            //     // trxJurnalPendapatan = new TrxJurnal()
            //     // trxJurnalPendapatan.fill({
            //     //     createdby: user.id,
            //     //     bisnis_id: ws.bisnis_id,
            //     //     cabang_id: req.cabang_id,
            //     //     bank_id: req.bank_id || null,
            //     //     kas_id: req.kas_id || null,
            //     //     tt_id: trxTandaTerima.id,
            //     //     coa_id: coa_out,
            //     //     kode: kodePendapatan.kode,
            //     //     kode_faktur: req.reff,
            //     //     narasi: obj.narasi,
            //     //     trx_date: req.trx_date,
            //     //     nilai: harga_total,
            //     //     dk: 'k'
            //     // })
            //     // await trxJurnalPendapatan.save(trx)
            //     // console.log('TRX JURNAL PENDAPATAN ::', trxJurnalPendapatan.toJSON());
            // } catch (error) {
            //     console.log(error);
            //     await trx.rollback()
            //     return {
            //         success: false,
            //         message: 'Failed save jurnal pendapatan '+ JSON.stringify(error)
            //     }
            // }
        } /** END LOOP **/

        
        await trx.commit()

        // /** INSERT LABA DITAHAN **/
        // try {
        //     await initFunc.INSERT_LABATAHAN(user)
        // } catch (error) {
        //     console.log(error);
        //     return {
        //         success: false,
        //         message: 'Failed save data laba ditahan...'
        //     }
        // }
        
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async UPDATE (params, req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        /** HITUNG TOTAL HARGA ITEMS **/
        const sumTotal = req.items.reduce((a, b) => { return a + (parseFloat(b.qty) * parseFloat(b.harga_stn)) }, 0)

        async function GET_KODE_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }

        async function GET_DATA_TRXJUAL(id){
            const data = await TrxFakturJual.query().with('pelanggan').where('id', id).last()
            return data
        }

        async function GET_DATA_TRXBELI(id){
            const data = await TrxFakturBeli.query().with('pemasok').where('id', id).last()
            return data
        }
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

        

        /** UPDATE TANDA TERIMA **/
        let trxTandaTerima = 
            await TrxTandaTerima
            .query()
            .with('items')
            .where('id', params.id)
            .last()
        const coaDb = await GET_KODE_COA(req.coa_debit)
        try {
            const data = {
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id,
                pelanggan_id: req.cust_id || null,
                pemasok_id: req.pemasok_id || null,
                paidby: req.paidby,
                penerima: req.penerima,
                coa_debit: req.coa_debit,
                coa_kode: coaDb.kode,
                narasi: req.narasi,
                title: req.title,
                trx_date: req.trx_date,
                delay_trx: req.delay_trx,
                is_delay: req.is_delay,
                reff: req.reff,
                paidby: req.paidby,
                author: user.id
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

        await TrxBank.query().where('tt_id', params.id).delete()
        await TrxKases.query().where('tt_id', params.id).delete()

        /** INSERT HISTORY TRX KASBANK **/
        if(req.bank_id){
            const trxBank = new TrxBank()
            let trxData = {
                bank_id: req.bank_id,
                tt_id: params.id,
                trx_date: req.trx_date
            }
            trxData = req.is_delay != 'Y' ? {...trxData, saldo_net: sumTotal} : {...trxData, setor_tunda: sumTotal}
            try {
                trxBank.fill(trxData)
                await trxBank.save(trx)
                console.log('TRX BANK ::', trxBank.toJSON());
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data Kas Bank '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_id){
            const trxKases = new TrxKases()
            try {
                trxKases.fill({
                    kas_id: req.kas_id,
                    trx_date: req.trx_date,
                    tt_id: params.id,
                    saldo_rill: sumTotal
                })
                await trxKases.save(trx)
                console.log('TRX KAS ::', trxKases.toJSON());
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data Kas Bank '+ JSON.stringify(error)
                }
            }
        }

        /** DELETE TANDA TERIMA ITEMS YANG ADA **/
        await TrxJurnal.query(trx).where('tt_id', params.id).delete()

        /** INSERT JURNAL DEBIT **/
        try {
            const trxJurnalDb = new TrxJurnal()
            trxJurnalDb.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                bisnis_id: ws.bisnis_id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                tt_id: params.id,
                coa_id: req.coa_debit,
                kode: coaDb.kode,
                kode_faktur: req.reff || null,
                narasi: req.narasi,
                trx_date: req.trx_date,
                is_delay: req.is_delay,
                nilai: sumTotal,
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

        /** DELETE TANDA TERIMA ITEMS YANG ADA **/
        await TrxTandaTerimaItem.query(trx).where('trx_terimaid', params.id).delete()

        /** INSERT TANDA TERIMA ITEMS YANG ADA **/
        for (const obj of req.items) {
            let coaKr = await GET_KODE_COA(obj.coa_kredit)
            const trxTandaTerimaItem = new TrxTandaTerimaItem()
            trxTandaTerimaItem.fill({
                trx_terimaid: params.id,
                trx_jual: obj.trx_jual || null,
                trx_beli: obj.trx_beli || null,
                barang_id: obj.barang_id || null,
                gudang_id: obj.gudang_id || null,
                cabang_id: obj.cabang_id || null,
                equipment_id: obj.equipment_id || null,
                coa_kredit: obj.coa_kredit,
                coa_kode: coaKr.kode,
                narasi: obj.narasi,
                qty: obj.qty,
                harga_stn: obj.harga_stn,
                harga_pot: obj.harga_pot || 0,
                harga_total: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
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

            /** INSERT PEMBAYARAN **/
            const noFaktur = await GET_DATA_TRXJUAL(obj.trx_jual)
            const trxFakturJualBayar = new TrxFakturJualBayar()
            trxFakturJualBayar.fill({
                bisnis_id: ws.bisnis_id,
                tti_id: trxTandaTerimaItem.id,
                trx_jual: obj.trx_jual || null,
                no_faktur: noFaktur?.no_faktur || '',
                no_paid: req.kwitansi,
                date_paid: req.trx_date,
                tipe_paid: req.tipe_paid,
                nilai_paid: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
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

            /** INSERT JURNAL KREDIT **/
            let trx_beli = null
            let trx_jual = null
            var harga_total = (parseFloat(obj.qty) * parseFloat(obj.harga_stn))
            try {
                trx_beli = obj.trx_beli ? await GET_DATA_TRXBELI(obj.trx_beli) : null
                trx_jual = obj.trx_jual ? await GET_DATA_TRXJUAL(obj.trx_jual) : null
                let coaKr = await GET_KODE_COA(obj.coa_kredit)
                const dataKr = {
                    createdby: user.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    trx_jual: trx_jual?.id || null,
                    trx_beli: trx_beli?.id || null,
                    tt_id: trxTandaTerima.id,
                    coa_id: obj.coa_kredit,
                    kode: coaKr.kode,
                    kode_faktur: trx_jual?.no_faktur || null,
                    narasi: obj.narasi,
                    trx_date: req.trx_date,
                    is_delay: req.is_delay,
                    nilai: harga_total,
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
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save jurnal kredit '+ JSON.stringify(error)
                }
            }
            // /** INSERT JURNAL PENDAPATAN SEWA ATAU PEJUALAN BARANG **/
            // let kodePendapatan
            // let barangCoa
            // let equipmentCoa
            // let coa_out
            // let trxJurnalPendapatan
            // try {
            //     /** CHECK JIKA REFF DITEMUKAN PADA TRX FAKTUR JUAL **/
            //     let harga_total = (parseFloat(obj.qty) * parseFloat(obj.harga_stn))
            //     if(obj.barang_id){
            //         barangCoa = await Barang.query().where('id', obj.barang_id).last()
            //         coa_out = barangCoa.coa_out
            //         kodePendapatan = await GET_DATA_COA(coa_out)
            //     }
            //     if(obj.trx_jual){
            //         const jualItem = await TrxFakturJualItem.query().where('trx_jual', obj.trx_jual).first()
            //         let cekItem = jualItem.equipment_id ? true : false
            //         if(cekItem){
            //             equipmentCoa = await Equipment.query().where('id', jualItem.equipment_id).last()
            //             coa_out = equipmentCoa.coa_out
            //             kodePendapatan = await GET_DATA_COA(coa_out)
            //         }else{
            //             barangCoa = await Barang.query().where('id', jualItem.barang_id).last()
            //             coa_out = barangCoa.coa_out
            //             kodePendapatan = await GET_DATA_COA(coa_out)
            //         }
            //     }
            //     trxJurnalPendapatan = new TrxJurnal()
            //     trxJurnalPendapatan.fill({
            //         createdby: user.id,
            //         bisnis_id: ws.bisnis_id,
            //         cabang_id: req.cabang_id,
            //         bank_id: req.bank_id || null,
            //         kas_id: req.kas_id || null,
            //         tt_id: trxTandaTerima.id,
            //         coa_id: coa_out,
            //         kode: kodePendapatan.kode,
            //         kode_faktur: req.reff,
            //         narasi: obj.narasi,
            //         trx_date: req.trx_date,
            //         nilai: harga_total,
            //         dk: 'k'
            //     })
            //     await trxJurnalPendapatan.save(trx)
            //     console.log('TRX JURNAL PENDAPATAN ::', trxJurnalPendapatan.toJSON());
            // } catch (error) {
            //     console.log(error);
            //     await trx.rollback()
            //     return {
            //         success: false,
            //         message: 'Failed save jurnal pendapatan '+ JSON.stringify(error)
            //     }
            // }
            // const kode_sewa = await initFunc.DEF_COA(user.id)
            
            // try {
    
            //     let tipePendapatan
            //     if(obj.trx_jual){
            //         tipePendapatan = kode_sewa.kode_pendapatansewa
            //     }else if(obj.barang_id){
            //         tipePendapatan = kode_sewa.kode_jualbarang
            //     }else{
            //         tipePendapatan = kode_sewa.kode_jualbarang
            //     }
    
            //     const coaPendapatan = await AccCoa.query().where('kode', tipePendapatan).last()
            //     const trxJurnalPendapatan = new TrxJurnal()
            //     trxJurnalPendapatan.fill({
            //         createdby: user.id,
            //         bisnis_id: ws.bisnis_id,
            //         tt_id: trxTandaTerima.id,
            //         coa_id: coaPendapatan.id,
            //         kode: coaPendapatan.kode,
            //         kode_faktur: req.reff,
            //         narasi: obj.narasi,
            //         trx_date: req.trx_date,
            //         nilai: harga_total,
            //         dk: 'k'
            //     })
            //     await trxJurnalPendapatan.save(trx)
            // } catch (error) {
            //     console.log(error);
            //     await trx.rollback()
            //     return {
            //         success: false,
            //         message: 'Failed save jurnal pendapatan '+ JSON.stringify(error)
            //     }
            // }

        } /** END LOOP **/

        await trx.commit()

        // /** INSERT LABA DITAHAN **/
        // try {
        //     await initFunc.INSERT_LABATAHAN(user)
        // } catch (error) {
        //     console.log(error);
        //     return {
        //         success: false,
        //         message: 'Failed save data laba ditahan...'
        //     }
        // }

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