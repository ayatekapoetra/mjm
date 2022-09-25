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
const KeuFakturPembelian = use("App/Models/transaksi/KeuFakturPembelian")
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
            .with('items', w => w.where('aktif', 'Y'))
            .where( w => {
                w.where('aktif', 'Y')
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
        const ws = await initFunc.WORKSPACE(user)
        const trx = await DB.beginTransaction()
        req.cabang_id = ws.cabang_id

        const sumDebit = req.items.reduce((a, b) => { return a + parseFloat(b.debit) }, 0)
        const sumKredit = req.items.reduce((a, b) => { return a + parseFloat(b.kredit) }, 0)
        const kode = await initFunc.GEN_KODE_JURNAL_PENYESUAIAN()

        /** INSERT TRX JURNAL ADJUSTMENT **/
        const keuEntriJurnal = new KeuEntriJurnal()
        keuEntriJurnal.fill({
            cabang_id: ws.cabang_id,
            reff: kode,
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
                kode: kode,
                pemasok_id: obj.pemasok_id || null,
                faktur_id: obj.faktur_id || null,
                pelanggan_id: obj.pelanggan_id || null,
                order_id: obj.order_id || null,
                cabang_id: ws.cabang_id,
                gudang_id: obj.gudang_id || null,
                barang_id: obj.barang_id || null,
                sync_stok: obj.sync_stok || null,
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
                if(obj.sync_stok != 'N'){
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
                let paid_trx = parseFloat(obj.kredit) - parseFloat(obj.debit)
                
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
                    no_kwitansi: kode,
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
            if(obj.pemasok_id){
                const keuFakturPembelian = await KeuFakturPembelian.query().where('id', obj.faktur_id).last()
                var nilaiHutang = parseFloat(obj.debit) - parseFloat(obj.kredit)
                keuFakturPembelian.merge({
                    sisa: keuFakturPembelian.grandtot - nilaiHutang,
                    sts_paid: (keuFakturPembelian.grandtot - nilaiHutang) != 0 ? 'bersisa':'lunas'
                })

                try {
                    await keuFakturPembelian.save(trx)
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed update sisa Hutang dagang \n'+ JSON.stringify(error)
                    }
                }
            }

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
                    desc: '[ ' +kode+ ' ] Kas Jurnal Penyesuaian',
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
                    mutasi: kode,
                    ja_id: keuEntriJurnalItem.id,
                    saldo_net: parseFloat(obj.debit) - parseFloat(obj.kredit),
                    desc: '[ ' +kode+ ' ] Bank Jurnal Penyesuaian',
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
                trx_jual: obj.order_id || null,
                fakturbeli_id: obj.faktur_id || null,
                coa_id: obj.coa_id,
                reff: kode,
                narasi: '[ ' +kode+ ' ] Persediaan Jurnal Penyesuaian',
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
                trx_jual: obj.order_id || null,
                fakturbeli_id: obj.faktur_id || null,
                coa_id: obj.coa_id,
                reff: kode,
                narasi: '[ ' +kode+ ' ] Persediaan Jurnal Penyesuaian',
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
            await KeuEntriJurnal
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
        req = req.dataForm
        const trx = await DB.beginTransaction()
        const kode = await initFunc.GEN_KODE_JURNAL_PENYESUAIAN()

        /**
         * START ROLLBACK ALL DATA
         * **/

        const oldKeuEntriJurnal = await KeuEntriJurnal.query().where('id', params.id).last()
        try {
            oldKeuEntriJurnal.merge({aktif: 'N'})
            await oldKeuEntriJurnal.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message:'Gagal Rollback Master Jurnal Penyesuaian...'
            }
        }

        // INACTIVE STATUS AKTIF ITEMS
        const items = (await KeuEntriJurnalItem.query().where( w => {
            w.where('sesuai_id', params.id)
            w.where('aktif', 'Y')
        }).fetch()).toJSON()

        for (const val of items) {
            const updItems = await KeuEntriJurnalItem.query().where('id', val.id).last()
            try {
                updItems.merge({aktif: 'N'})
                await updItems.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message:'Gagal Rollback Items Jurnal Penyesuaian...'
                }
            }

            const trxJurnalDebit = await TrxJurnal.query().where( w => {
                w.where('sesuai_item_id', val.id)
                w.where('dk', 'd')
            }).last()

            try {
                trxJurnalDebit.merge({aktif: 'N'})
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message:'Gagal Rollback TRX Jurnal Penyesuaian debit...'
                }
            }

            const trxJurnalKredit = await TrxJurnal.query().where( w => {
                w.where('sesuai_item_id', val.id)
                w.where('dk', 'k')
            }).last()

            try {
                trxJurnalKredit.merge({aktif: 'N'})
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message:'Gagal Rollback TRX Jurnal Penyesuaian kredit...'
                }
            }

            if(val.barang_id){
                if(val.sync_stok === 'Y'){
                    try {
                        await BarangLokasi.query().where('sesuai_item_id', val.id).delete()
                    } catch (error) {
                        console.log(error);
                        return {
                            success: false,
                            message: 'Failed delete jumlah barang pada gudang \n'+ JSON.stringify(error)
                        }
                    }
                }
            }

            // CARI PEMBAYARAN ORDER PELANGGAN
            const bayarPelanggan = (await OpsPelangganBayar.query().where( w => {
                w.where('order_id', val.order_id)
            }).fetch()).toJSON()

            for (const elm of bayarPelanggan) {
                const updBayar = await OpsPelangganBayar.query().where('id', elm.id).last()
                try {
                    updBayar.merge({aktif: 'N'})
                    await updBayar.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message:'Gagal Rollback Pembayaran Pelanggan Jurnal Penyesuaian...'
                    }
                }
            }

            // CARI TRANSAKSI BANK
            const trxBank = (await TrxBank.query().where('ja_id', val.id).fetch()).toJSON()
            for (const elm of trxBank) {
                const updTrxBank = await TrxBank.query().where('id', elm.id).last()
                try {
                    updTrxBank.merge({aktif: 'N'})
                    await updTrxBank.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message:'Gagal Rollback TRX BANK pada Jurnal Penyesuaian...'
                    }
                }
            }

            // CARI TRANSAKSI KAS
            const trxKas = (await TrxKas.query().where('ja_id', val.id).fetch()).toJSON()
            for (const elm of trxKas) {
                const updTrxKas = await TrxKas.query().where('id', elm.id).last()
                try {
                    updTrxKas.merge({aktif: 'N'})
                    await updTrxKas.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message:'Gagal Rollback TRX KAS pada Jurnal Penyesuaian...'
                    }
                }
            }
        }

        /**
         ***** END ROLLBACK ALL DATA
         * **/

        req.cabang_id = user.cabang_id
        
        const sumDebit = req.items.reduce((a, b) => { return a + parseFloat(b.debit) }, 0)
        const sumKredit = req.items.reduce((a, b) => { return a + parseFloat(b.kredit) }, 0)

        /** UPDATE TRX JURNAL ADJUSTMENT **/
        const newKeuEntriJurnal = new KeuEntriJurnal()
        newKeuEntriJurnal.merge({
            cabang_id: req.cabang_id,
            reff: kode,
            author: user.id,
            trx_date: req.trx_date,
            narasi: req.narasi,
            debit: sumDebit,
            kredit: sumKredit
        })

        try {
            await newKeuEntriJurnal.save(trx)
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
                sesuai_id: newKeuEntriJurnal.id,
                kode: kode,
                pemasok_id: obj.pemasok_id || null,
                faktur_id: obj.faktur_id || null,
                pelanggan_id: obj.pelanggan_id || null,
                order_id: obj.order_id || null,
                cabang_id: user.cabang_id,
                gudang_id: obj.gudang_id || null,
                barang_id: obj.barang_id || null,
                sync_stok: obj.sync_stok || null,
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
                if(obj.sync_stok != 'N'){
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
                let paid_trx = parseFloat(obj.kredit) - parseFloat(obj.debit)
                
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
                    no_kwitansi: kode,
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
            if(obj.pemasok_id){
                const keuFakturPembelian = await KeuFakturPembelian.query().where('id', obj.faktur_id).last()
                var nilaiHutang = parseFloat(obj.debit) - parseFloat(obj.kredit)
                keuFakturPembelian.merge({
                    sisa: keuFakturPembelian.grandtot - nilaiHutang,
                    sts_paid: (keuFakturPembelian.grandtot - nilaiHutang) != 0 ? 'bersisa':'lunas'
                })

                try {
                    await keuFakturPembelian.save(trx)
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed update sisa Hutang dagang \n'+ JSON.stringify(error)
                    }
                }
            }

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
                    desc: '[ ' +kode+ ' ] Kas Jurnal Penyesuaian',
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
                    mutasi: kode,
                    ja_id: keuEntriJurnalItem.id,
                    saldo_net: parseFloat(obj.debit) - parseFloat(obj.kredit),
                    desc: '[ ' +kode+ ' ] Bank Jurnal Penyesuaian',
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
                trx_jual: obj.order_id || null,
                fakturbeli_id: obj.faktur_id || null,
                coa_id: obj.coa_id,
                reff: kode,
                narasi: '[ ' +kode+ ' ] Persediaan Jurnal Penyesuaian',
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
                trx_jual: obj.order_id || null,
                fakturbeli_id: obj.faktur_id || null,
                coa_id: obj.coa_id,
                reff: kode,
                narasi: '[ ' +kode+ ' ] Persediaan Jurnal Penyesuaian',
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
    async DELETE (params) {
        const trx = await DB.beginTransaction()

        /**
         * START ROLLBACK ALL DATA
         * **/

        const oldKeuEntriJurnal = await KeuEntriJurnal.query().where('id', params.id).last()
        try {
            oldKeuEntriJurnal.merge({aktif: 'N'})
            await oldKeuEntriJurnal.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message:'Gagal Rollback Master Jurnal Penyesuaian...'
            }
        }

        // INACTIVE STATUS AKTIF ITEMS
        const items = (await KeuEntriJurnalItem.query().where( w => {
            w.where('sesuai_id', params.id)
            w.where('aktif', 'Y')
        }).fetch()).toJSON()

        for (const val of items) {

            await BarangLokasi.query().where('sesuai_item_id', val.id).delete()

            const updItems = await KeuEntriJurnalItem.query().where('id', val.id).last()
            try {
                updItems.merge({aktif: 'N'})
                await updItems.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message:'Gagal Rollback Items Jurnal Penyesuaian...'
                }
            }

            const trxJurnalDebit = await TrxJurnal.query().where( w => {
                w.where('sesuai_item_id', val.id)
                w.where('dk', 'd')
            }).last()

            try {
                trxJurnalDebit.merge({aktif: 'N'})
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message:'Gagal Rollback TRX Jurnal Penyesuaian debit...'
                }
            }

            const trxJurnalKredit = await TrxJurnal.query().where( w => {
                w.where('sesuai_item_id', val.id)
                w.where('dk', 'k')
            }).last()

            try {
                trxJurnalKredit.merge({aktif: 'N'})
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message:'Gagal Rollback TRX Jurnal Penyesuaian kredit...'
                }
            }

            // CARI & ROLLBACK PEMBAYARAN ORDER PELANGGAN
            const bayarPelanggan = (await OpsPelangganBayar.query().where( w => {
                w.where('order_id', val.order_id)
            }).fetch()).toJSON()

            for (const elm of bayarPelanggan) {
                const updBayar = await OpsPelangganBayar.query().where('id', elm.id).last()
                try {
                    updBayar.merge({aktif: 'N'})
                    await updBayar.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message:'Gagal Rollback Pembayaran Pelanggan Jurnal Penyesuaian...'
                    }
                }
            }

            // CARI & ROLLBACK PEMBAYARAN FAKTUR PEMASOK
            if(val.faktur_id){
                const fakturPemasok = (await TrxJurnal.query().where( w => {
                    w.where('sesuai_item_id', params.id)
                    w.where('fakturbeli_id', val.faktur_id)
                }).fetch()).toJSON()
    
                const valueDebitFaktur =  fakturPemasok.filter( d => d.dk == 'd').reduce((a, b) => { return a + b.nilai }, 0)
                const valueKreditFaktur =  fakturPemasok.filter( k => k.dk == 'k').reduce((a, b) => { return a + b.nilai }, 0)
    
                const valueRollbackFaktur = valueDebitFaktur - valueKreditFaktur
                const fakturBeli = await KeuFakturPembelian.query().where('id', val.faktur_id).last()
                try {
                    fakturBeli.merge({
                        sisa: fakturBeli.sisa + valueRollbackFaktur,
                        sts_paid: (fakturBeli.sisa + valueRollbackFaktur) != 0 ? 'bersisa':'lunas'
                    })
                    await fakturBeli.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message:'Gagal Rollback KeuFakturPembelian pada Jurnal Penyesuaian...'
                    }
                }
            }

            // CARI TRANSAKSI BANK
            const trxBank = (await TrxBank.query().where('ja_id', val.id).fetch()).toJSON()
            for (const elm of trxBank) {
                const updTrxBank = await TrxBank.query().where('id', elm.id).last()
                try {
                    updTrxBank.merge({aktif: 'N'})
                    await updTrxBank.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message:'Gagal Rollback TRX BANK pada Jurnal Penyesuaian...'
                    }
                }
            }

            // CARI TRANSAKSI KAS
            const trxKas = (await TrxKas.query().where('ja_id', val.id).fetch()).toJSON()
            for (const elm of trxKas) {
                const updTrxKas = await TrxKas.query().where('id', elm.id).last()
                try {
                    updTrxKas.merge({aktif: 'N'})
                    await updTrxKas.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message:'Gagal Rollback TRX KAS pada Jurnal Penyesuaian...'
                    }
                }
            }
        }

        /**
         ***** END ROLLBACK ALL DATA
         * 
         * **/

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }
}

module.exports = new entriJurnal()