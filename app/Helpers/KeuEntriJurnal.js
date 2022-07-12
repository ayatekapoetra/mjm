'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const Kas = use("App/Models/akunting/Kas")
const Bank = use("App/Models/akunting/Bank")
const initFunc = use("App/Helpers/initFunc")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxKas = use("App/Models/transaksi/TrxKase")
const TrxBank = use("App/Models/transaksi/TrxBank")
const BarangLokasi = use("App/Models/BarangLokasi")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const KeuEntriJurnal = use("App/Models/transaksi/KeuEntriJurnal")
const KeuEntriJurnalItem = use("App/Models/transaksi/KeuEntriJurnalItem")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")
const OpsPelangganBayar = use("App/Models/operational/OpsPelangganBayar")
const KeuEntriJurnalAttach = use("App/Models/transaksi/KeuEntriJurnalAttach")

class entriJurnal {

    async LIST (req, user) {
        const ws = await initFunc.WORKSPACE(user)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const isPusat = ['administrator', 'developer', 'keuangan'].includes(user.usertype)
        let data = (
            await KeuEntriJurnal
            .query()
            .with('attach')
            .with('cabang')
            .with('createdby')
            .with('items')
            .where( w => {
                if(!isPusat){
                    w.where('cabang_id', ws.cabang_id)
                }
            })
            .orderBy('trx_date', 'desc')
            .paginate(halaman, limit)
        ).toJSON()
        // console.log(JSON.stringify(data, null, 2));
        return data
    }

    async POST (req, user, filex) {
        console.log(req);
        const ws = await initFunc.WORKSPACE(user)
        const trx = await DB.beginTransaction()
        req.cabang_id = ws.cabang_id

        const sumDebit = req.items.reduce((a, b) => { return a + parseFloat(b.debit) }, 0)
        const sumKredit = req.items.reduce((a, b) => { return a + parseFloat(b.kredit) }, 0)

        /** INSERT TRX JURNAL ADJUSTMENT **/
        const keuEntriJurnal = new KeuEntriJurnal()
        keuEntriJurnal.fill({
            cabang_id: ws.cabang_id,
            author: user.id,
            trx_date: req.trx_date,
            narasi: req.narasi,
            debit: sumDebit,
            kredit: sumKredit
        })

        try {
            await keuEntriJurnal.save(trx)
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save jurnal penyesuaian '+ JSON.stringify(error)
            }
        }

        for (const obj of req.items) {
            const keuEntriJurnalItem = new KeuEntriJurnalItem()
            keuEntriJurnalItem.fill({
                sesuai_id: keuEntriJurnal.id,
                faktur_id: obj.faktur_id || null,
                order_id: obj.order_id || null,
                cabang_id: ws.cabang_id,
                gudang_id: obj.gudang_id || null,
                barang_id: obj.barang_id || null,
                coa_id: obj.coa_id,
                qty: obj.qty || null,
                narasi: req.narasi,
                d: obj.debit,
                k: obj.kredit,
                status: parseFloat(obj.debit) != parseFloat(obj.kredit) ? 'Tidak Sesuai' : 'Sesuai'
            })

            try {
                await keuEntriJurnalItem.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save jurnal penyesuaian items \n'+ JSON.stringify(error)
                }
            }

            /* JIKA AKUN PERSEDIAAN */
            if(obj.barang_id){
                const gudang = (await Gudang.query().with('cabang').where('id', obj.gudang_id).last())?.toJSON()
                const cabang = gudang.cabang
                req.cabang_id = cabang.id
                if(obj.isStok != 'Y'){
                    const barangLokasi = new BarangLokasi()
                    barangLokasi.fill({
                        sesuai_item_id: keuEntriJurnalItem.id,
                        createdby: user.id,
                        cabang_id: cabang.id,
                        gudang_id: obj.gudang_id,
                        barang_id: obj.barang_id,
                        qty_hand: parseFloat(obj.debit) >= parseFloat(obj.kredit) ? parseFloat(obj.qty) : (parseFloat(obj.qty) * -1)
                    })
    
                    try {
                        await barangLokasi.save(trx)
                    } catch (error) {
                        console.log(error);
                        return {
                            success: false,
                            message: 'Failed save jumlah barang pada gudang \n'+ JSON.stringify(error)
                        }
                    }
                }
    
                
            }

            /* JIKA AKUN PIUTANG DAGANG */
            let bayarID
            if(obj.pelanggan_id){
                let paid_trx = parseFloat(obj.debit) - parseFloat(obj.kredit)
                
                // FIND INVOICES
                const order = await OpsPelangganOrder.query().where('id', obj.order_id).last()
                req.cabang_id = order.cabang_id
                let status = order.grandtot_trx > paid_trx ? 'dp':'lunas'

                order.merge({
                    paid_trx: order.paid_trx + paid_trx,
                    sisa_trx: order.sisa_trx - paid_trx,
                    status: status
                })

                try {
                    await order.save(trx)
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed update sisa order \n'+ JSON.stringify(error)
                    }
                }

                const bayar = new OpsPelangganBayar()
                bayar.fill({
                    order_id: order.id,
                    cabang_id: req.cabang_id,
                    no_invoice: order.kdpesanan,
                    no_kwitansi: moment().format('YYYYMMDD') + '.JAD' + keuEntriJurnalItem.id,
                    date_paid: req.trx_date,
                    metode_paid: 'jurnal penyesuaian',
                    paid_trx: paid_trx,
                    createdby: user.id,
                    is_delay: 'N'
                })

                try {
                    await bayar.save(trx)
                    bayarID = bayar.id
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed save pembayaran \n'+ JSON.stringify(error)
                    }
                }
            }

            /* JIKA AKUN HUTANG DAGANG */
            // if(obj.pemasok_id){

            // }

            /* JIKA AKUN KAS */
            if(obj.kas_id){
                const kas = await Kas.query().where('id', obj.kas_id).last()
                req.cabang_id = kas.cabang_id

                const trxKas = new TrxKas()
                trxKas.fill({
                    trx_date: req.trx_date,
                    kas_id: obj.kas_id,
                    ja_id: keuEntriJurnalItem.id,
                    saldo_rill: parseFloat(obj.debit) - parseFloat(obj.kredit),
                    desc: '[ ' +moment().format('YYYYMMDD') + '.JAD' + keuEntriJurnalItem.id+ ' ] Kas Jurnal Penyesuaian',
                })

                try {
                    await trxKas.save(trx)
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed save TrxKas \n'+ JSON.stringify(error)
                    }
                }
            }

            /* JIKA AKUN BANK */
            if(obj.bank_id){
                const bank = await Bank.query().where('id', obj.bank_id).last()
                req.cabang_id = bank.cabang_id
                
                const trxBank = new TrxBank()
                trxBank.fill({
                    trx_date: req.trx_date,
                    bank_id: obj.bank_id,
                    mutasi: moment().format('YYYYMMDD') + '.JAD' + keuEntriJurnalItem.id,
                    ja_id: keuEntriJurnalItem.id,
                    saldo_net: parseFloat(obj.debit) - parseFloat(obj.kredit),
                    desc: '[ ' +moment().format('YYYYMMDD') + '.JAD' + keuEntriJurnalItem.id+ ' ] Bank Jurnal Penyesuaian',
                })

                try {
                    await trxBank.save(trx)
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed save TrxKas \n'+ JSON.stringify(error)
                    }
                }
            }

            /* JIKA AKUN HUTANG DAGANG */
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                kas_id: obj.kas_id || null,
                bank_id: obj.bank_id || null,
                coa_id: obj.coa_id,
                reff: moment().format('YYYYMMDD') + '.JAD' + keuEntriJurnalItem.id,
                narasi: '[ ' +moment().format('YYYYMMDD') + '.JAD' + keuEntriJurnalItem.id+ ' ] Persediaan Jurnal Penyesuaian',
                trx_date: req.trx_date,
                nilai: obj.debit,
                trx_jual: obj.order_id || null,
                trx_paid: bayarID || null,
                dk: 'd',
                sesuai_item_id: keuEntriJurnalItem.id
            })

            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save trxjurnal debit \n'+ JSON.stringify(error)
                }
            }
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                kas_id: obj.kas_id || null,
                bank_id: obj.bank_id || null,
                coa_id: obj.coa_id,
                reff: moment().format('YYYYMMDD') + 'JAD' + keuEntriJurnalItem.id,
                narasi: '[ ' +moment().format('YYYYMMDD') + '.JAD' + keuEntriJurnalItem.id+ ' ] Persediaan Jurnal Penyesuaian',
                trx_date: req.trx_date,
                nilai: obj.kredit,
                trx_jual: obj.order_id || null,
                trx_paid: bayarID || null,
                dk: 'k',
                sesuai_item_id: keuEntriJurnalItem.id
            })

            try {
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed save trxjurnal kredit \n'+ JSON.stringify(error)
                }
            }
            

        }
        
        
        if(filex){
            if(filex.attach?.length > 1){
                console.log('multi file');
                for (const [i, obj] of (filex.attach).entries()) {
                    const randURL = moment().format('YYYYMMDDHHmmss') + '-' + i
                    const aliasName = `J-SESUAI-${randURL}.${obj.extname}`
                    var uriLampiran = '/upload/'+aliasName
                    await obj.move(Helpers.publicPath(`upload`), {
                        name: aliasName,
                        overwrite: true,
                    })

                    const lampiranFile = new KeuEntriJurnalAttach()
                    lampiranFile.fill({
                        sesuai_id: keuEntriJurnal.id,
                        filetype: obj.extname,
                        size: obj.size,
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
            }else{
                console.log('single file');
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `J-SESUAI-${randURL}.${filex.extname}`
                var uriLampiran = '/upload/'+aliasName
                await filex.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })
    
                const lampiranFile = new KeuEntriJurnalAttach()
                lampiranFile.fill({
                    sesuai_id: keuEntriJurnal.id,
                    filetype: filex.extname,
                    size: filex.size,
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