'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxBank = use("App/Models/transaksi/TrxBank")
const TrxKases = use("App/Models/transaksi/TrxKase")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const KeuPenerimaan = use("App/Models/transaksi/KeuPenerimaan")
const TrxFakturBeli = use("App/Models/transaksi/KeuFakturPembelian")
const LampiranFile = use("App/Models/transaksi/KeuPenerimaanAttach")
const OrderPelanggan = use("App/Models/operational/OpsPelangganOrder")
const KeuPenerimaanItem = use("App/Models/transaksi/KeuPenerimaanItem")
const TrxFakturPelanggan = use("App/Models/operational/OpsPelangganBayar")
// const TrxFakturBeliBayar = use("App/Models/transaksi/TrxFakturBeliBayar")

class pembayaran {
    async LIST (req) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const data = (
            await KeuPenerimaan.query()
            .with('coaDebit')
            .with('createdby')
            .with('items', i => i.where('aktif', 'Y'))
            .with('files', f => f.where('aktif', 'Y'))
            .where(
                w => {
                    w.where('aktif', 'Y')
                    if(req.coa_debit){
                        w.where('coa_debit', req.coa_debit)
                    }
                    if(req.narasi){
                        w.where('narasi', 'like', `%${req.narasi}%`)
                    }
                }
            ).orderBy([
                {column: 'id', order: 'desc'},
                {column: 'trx_date', order: 'desc'}
            ]).paginate(halaman, limit)
        ).toJSON()
        
        return data
    }

    async POST (req, user, attach) {
        const trx = await DB.beginTransaction()
        
        /** INSERT keuPenerimaan **/
        const keuPenerimaan = new KeuPenerimaan()
        try {
            keuPenerimaan.fill({
                author: user.id,
                cabang_id: req.cabang_id,
                coa_debit: req.coa_debit,
                reff: req.reff || null,
                trx_date: req.trx_date,
                delay_trx: req.due_date,
                is_delay: req.is_delay,
                penerima: req.penerima || null,
                paidby: req.paidby,
                total: req.subtotal,
                narasi: req.narasi || 'tanpa keterangan'
            })
            await keuPenerimaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pembayaran '+ JSON.stringify(error)
            }
        }


        /** JIKA DITEMUKAN FILE ATACHMENT **/
        if(attach){
            console.log('attach ::', attach);
            if(attach._files?.length > 1){
                for (const [i, objFile] of (attach._files).entries()) {
                    const randURL = moment().format('YYYYMMDDHHmmss') + '-' + i
                    const aliasName = `KEU-BAYAR-${randURL}.${objFile.extname}`
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
                        keuterima_id: keuPenerimaan.id,
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
            }else{
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `KEU-BAYAR-${randURL}.${attach.extname}`
                var uriLampiran = '/upload/'+aliasName
                await attach.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })
    
                if (!attach.moved()) {
                    return attach.error()
                }
    
                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    keuterima_id: keuPenerimaan.id,
                    size: attach.size,
                    filetype: attach.extname,
                    url: uriLampiran
                })
    
                try {
                    await lampiranFile.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data attachment...'
                    }
                }
            }
        }

        /** INSERT TRX JURNAL KREDIT **/
        const coaDebit = await AccCoa.query().where('id', req.coa_debit).last()
        try {
            const jurnalDebit = new TrxJurnal()
            jurnalDebit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                keuterima_id: keuPenerimaan.id,
                coa_id: req.coa_debit,
                reff: req.reff,
                narasi: `[ ${req.reff} ] ${req.narasi || coaDebit.coa_name}`,
                trx_date: req.trx_date,
                delay_date: req.due_date,
                nilai: req.subtotal,
                is_delay: req.is_delay,
                dk: 'd'
            })
            await jurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
            }
        }

        /** INSERT MUTASI KAS ATAU BANK **/
        if(req.bank_id){
            const trxBank = new TrxBank()

            if(req.is_delay == 'Y'){
                var saldo_net = 0
                var setor_tunda = req.subtotal
            }else{
                var saldo_net = req.subtotal
                var setor_tunda = 0
            }
            
            trxBank.fill({
                trx_date: req.trx_date,
                mutasi: req.reff,
                bank_id: req.bank_id,
                keuterima_id: keuPenerimaan.id,
                saldo_net: saldo_net,
                setor_tunda: setor_tunda,
                desc: `[ ${req.reff} ] Penerimaan Pembayaran`,
            })

            try {
                await trxBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi debit bank '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_id){
            const trxKas = new TrxKases()
            
            trxKas.fill({
                trx_date: req.trx_date,
                kas_id: req.kas_id,
                keuterima_id: keuPenerimaan.id,
                saldo_rill: req.subtotal,
                desc: `[ ${req.reff} ] Penerimaan Pembayaran`,
            })

            try {
                await trxKas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi debit kas '+ JSON.stringify(error)
                }
            }
        }

        /** INSERT keuPenerimaan ITEMS **/
        for (const obj of req.items) {
            /* INSERT ITEMS PEMBAYARAN */
            const keuPenerimaanItem = new KeuPenerimaanItem()
            try {
                const data = {
                    keuterima_id: keuPenerimaan.id,
                    cabang_id: req.cabang_id,
                    trx_beli: obj.trx_beli || null,
                    trx_jual: obj.trx_jual || null,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    pemasok_id: obj.pemasok_id || null,
                    pelanggan_id: obj.pelanggan_id || null,
                    coa_kredit: obj.coa_kredit,
                    qty: obj.qty,
                    harga_stn: obj.harga_stn,
                    harga_total: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                }

                keuPenerimaanItem.fill(data)
                await keuPenerimaanItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save penerimaan item '+ JSON.stringify(error)
                }
            }

            /* INSERT ITEMS JURNAL PEMBAYARAN */
            const coaKredit = await AccCoa.query().where('id', obj.coa_kredit).last()

            req.keterangan = `[ ${req.reff} ] ${coaKredit.coa_name}`

            if(obj.trx_jual){
                const reffJual = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                var reff_kode = reffJual.kdpesanan
                req.keterangan = `[ ${reff_kode} ] ${coaKredit.coa_name}`
            }
            if(obj.trx_beli){
                const reffBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                var reff_kode = reffBeli.kode
                req.keterangan = `[ ${reff_kode} ] ${coaKredit.coa_name}`
            }

            const jurnalKredit = new TrxJurnal()
            try {
                jurnalKredit.fill({
                    createdby: user.id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    trx_jual: obj.trx_jual || null,
                    fakturbeli_id: obj.trx_beli || null,
                    keuterima_id: keuPenerimaan.id,
                    keuterimaitem_id: keuPenerimaanItem.id,
                    coa_id: obj.coa_kredit,
                    reff: req.reff,
                    narasi: req.keterangan,
                    trx_date: req.trx_date,
                    delay_date: req.due_date,
                    is_delay: req.is_delay,
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                    dk: 'k'
                })
                await jurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx jurnal kredit '+ JSON.stringify(error)
                }
            }

            // JIKA AKUN PENDAPATAN ATAU BIAYA INSERT LABA DITAHAN
            if(parseInt(obj.coa_kredit) > 40000){
                const jurnalKreditEquitas = new TrxJurnal()
                try {
                    jurnalKreditEquitas.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: obj.trx_jual || null,
                        fakturbeli_id: obj.trx_beli || null,
                        keuterima_id: keuPenerimaan.id,
                        keuterimaitem_id: keuPenerimaanItem.id,
                        coa_id: 30003,
                        reff: req.reff,
                        narasi: req.keterangan,
                        trx_date: req.trx_date,
                        delay_date: req.due_date,
                        is_delay: req.is_delay,
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        dk: 'k'
                    })
                    await jurnalKreditEquitas.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save trx jurnal LABA DITAHAN '+ JSON.stringify(error)
                    }
                }
            }

            
            // if(obj.trx_beli){
            //     /** UPDATE SISA PEMBAYARAN FAKTUR PEMBELIAN **/
            //     let trxFakturBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
            //     let totalPembelian = parseFloat(trxFakturBeli.sisa) - (parseFloat(obj.qty) * parseFloat(obj.harga_stn))
            //     try {
            //         trxFakturBeli.merge({
            //             sisa: totalPembelian,
            //             sts_paid: trxFakturBeli.sisa - totalPembelian > 0 ? 'bersisa':'lunas'
            //         })

            //         await trxFakturBeli.save(trx)
            //     } catch (error) {
            //         console.log(error);
            //         await trx.rollback()
            //         return {
            //             success: false,
            //             message: 'Failed update sisa transaksi faktur pembelian '+ JSON.stringify(error)
            //         }
            //     }
            // }

            /** INSERT PEMBAYARAN PELANGGAN **/
            if(obj.trx_jual){
                const order = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                const pelangganBayar = new TrxFakturPelanggan()
                pelangganBayar.fill({
                    order_id: obj.trx_jual,
                    cabang_id: req.cabang_id,
                    no_invoice: order.kdpesanan,
                    no_kwitansi: req.reff,
                    date_paid: moment(req.trx_date).format('YYYY-MM-DD HH:mm'),
                    delay_date: req.is_delay == true ? req.due_date : req.trx_date,
                    metode_paid: req.kas_id ? 'tunai':'transfer',
                    kas_id: req.kas_id || null,
                    bank_id: req.bank_id || null,
                    paid_trx: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    narasi: 'Pembayaran pada invoices '+order.kdpesanan,
                    createdby: user.id,
                    is_delay: req.is_delay
                })

                try {
                    await pelangganBayar.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed insert pembayaran '+ JSON.stringify(error)
                    }
                }

                const orderData = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                orderData.merge({
                    sisa_trx: order.sisa_trx - (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    paid_trx: orderData.paid_trx + (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    status: orderData.paid_trx - (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) > 0 ? 'dp':'lunas'
                })

                try {
                    await orderData.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update kelebihan pembayaran pada table order pelanggan '
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

    async UPDATE (params, req, user, attach) {
        const trx = await DB.beginTransaction()
        const keuPenerimaan = await KeuPenerimaan.query().where('id', params.id).last()

        keuPenerimaan.merge({
            author: user.id,
            cabang_id: req.cabang_id,
            coa_debit: req.coa_debit,
            reff: req.reff || null,
            trx_date: req.trx_date,
            delay_trx: req.due_date,
            is_delay: req.is_delay,
            penerima: req.penerima || null,
            paidby: req.paidby,
            total: req.subtotal,
            narasi: req.narasi || 'tanpa keterangan'
        })

        try {
            await keuPenerimaan.save(trx)
            // console.log('update penerimaaan OK');
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pembayaran '+ JSON.stringify(error)
            }
        }

        /** UPDATE TRX JURNAL **/
        const arr_jurnal = (await TrxJurnal.query().where('keuterima_id', params.id).fetch()).toJSON()
        for (const val of arr_jurnal) {
            try {
                const updJurnal = await TrxJurnal.query().where('id', val.id).last()
                updJurnal.merge({aktif: 'N'})
                await updJurnal.save(trx)
                // await DB.table('trx_jurnals').where('keuterima_id', params.id).update({aktif: 'N'})
            } catch (error) {
                console.log(error);
                await trx.rollback()
            }
            
        }

        /** INSERT TRX JURNAL KREDIT **/
        const coaDebit = await AccCoa.query().where('id', req.coa_debit).last()
        try {
            const jurnalDebit = new TrxJurnal()
            jurnalDebit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                keuterima_id: params.id,
                coa_id: req.coa_debit,
                reff: req.reff,
                narasi: `[ ${req.reff} ] ${req.narasi || coaDebit.coa_name}`,
                trx_date: req.trx_date,
                delay_date: req.due_date,
                nilai: req.subtotal,
                is_delay: req.is_delay,
                dk: 'd'
            })
            await jurnalDebit.save(trx)
            // console.log('update jurnal debit OK');
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit '+ JSON.stringify(error)
            }
        }

        /** INSERT MUTASI KAS ATAU BANK **/
        if(req.bank_id){
            try {
                const updTrxBank = await TrxBank.query().where('keuterima_id', params.id).last()
                updTrxBank.merge({aktif: 'N'})
                await updTrxBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
            }
            
            const trxBank = new TrxBank()
            if(req.is_delay){
                var saldo_net = 0
                var setor_tunda = req.subtotal
            }else{
                var saldo_net = req.subtotal
                var setor_tunda = 0
            }
            
            trxBank.fill({
                trx_date: req.trx_date,
                mutasi: req.reff,
                bank_id: req.bank_id,
                keuterima_id: params.id,
                saldo_net: saldo_net,
                setor_tunda: setor_tunda,
                desc: `[ ${req.reff} ] Pembayaran Akun Faktur`,
            })
            
            try {
                await trxBank.save(trx)
                // console.log('add trx bank OK');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi kredit bank '+ JSON.stringify(error)
                }
            }
        }

        // console.log(req);
        
        if(req.kas_id){
            // DELETE DATA KAS
            const delKas = await TrxKases.query().where('keuterima_id', params.id).last()
            delKas.merge({aktif: "N"})
            try {
                await delKas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi kredit kas '+ JSON.stringify(error)
                }
            }

            // INSERT NEW DATA KAS
            const trxKas = new TrxKases()
            
            trxKas.fill({
                trx_date: req.trx_date,
                kas_id: req.kas_id,
                keuterima_id: params.id,
                saldo_rill: req.subtotal,
                desc: `[ ${req.reff} ] Pembayaran Akun Faktur`,
            })
            
            try {
                await trxKas.save(trx)
                // console.log('add trx kas OK');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi kredit kas '+ JSON.stringify(error)
                }
            }
        }
        
        
        if(attach){
            // console.log('attach update ::', attach._files);
            await DB.table('keu_penerimaan_attach').where('keuterima_id', params.id).update({aktif: 'N'})
            if(attach._files?.length > 1){
                for (const [i, objFile] of (attach._files).entries()) {
                    const randURL = moment().format('YYYYMMDDHHmmss') + '-' + i
                    const aliasName = `KEU-BAYAR-${randURL}.${objFile.extname}`
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
                        keuterima_id: params.id,
                        size: objFile.size,
                        filetype: objFile.extname,
                        url: uriLampiran
                    })
        
                    try {
                        await lampiranFile.save(trx)
                        // console.log('add file lampiran OK');
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data attachment...'+JSON.stringify(error)
                        }
                    }
                }
            }else{
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `KEU-BAYAR-${randURL}.${attach.extname}`
                var uriLampiran = '/upload/'+aliasName
                await attach.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })
    
                if (!attach.moved()) {
                    return attach.error()
                }
    
                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    keuterima_id: params.id,
                    size: attach.size,
                    filetype: attach.extname,
                    url: uriLampiran
                })
    
                try {
                    await lampiranFile.save(trx)
                    // console.log('add file lampiran OK');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data attachment...'+JSON.stringify(error)
                    }
                }
            }
        }

        await DB.table('keu_penerimaan_items').where('keuterima_id', params.id).update({aktif: 'N'})

        /** INSERT keuPenerimaan ITEMS **/
        for (const obj of req.items) {
            /* INSERT ITEMS PEMBAYARAN */
            const keuPenerimaanItem = new KeuPenerimaanItem()
            try {
                const data = {
                    keuterima_id: params.id,
                    cabang_id: req.cabang_id,
                    trx_beli: obj.trx_beli || null,
                    trx_jual: obj.trx_jual || null,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    pemasok_id: obj.pemasok_id || null,
                    pelanggan_id: obj.pelanggan_id || null,
                    coa_kredit: obj.coa_kredit,
                    qty: obj.qty,
                    harga_stn: obj.harga_stn,
                    description: obj.description,
                    harga_total: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                }

                keuPenerimaanItem.fill(data)
                await keuPenerimaanItem.save(trx)
                // console.log('add penerimaan items OK');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save pembayaran item '+ JSON.stringify(error)
                }
            }

            /* INSERT ITEMS JURNAL PENERIMAAN */
            const coaKredit = await AccCoa.query().where('id', obj.coa_kredit).last()

            req.keterangan = `[ ${req.reff} ] ${coaKredit.coa_name}`

            if(obj.trx_jual){
                const reffJual = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                var reff_kode = reffJual.kdpesanan
                req.keterangan = `[ ${reff_kode} ] ${coaKredit.coa_name}`
            }
            if(obj.trx_beli){
                const reffBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                var reff_kode = reffBeli.kode
                req.keterangan = `[ ${reff_kode} ] ${coaKredit.coa_name}`
            }

            const jurnalKredit = new TrxJurnal()
            try {
                jurnalKredit.fill({
                    createdby: user.id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    trx_jual: obj.trx_jual || null,
                    fakturbeli_id: obj.trx_beli || null,
                    keuterima_id: params.id,
                    keuterimaitem_id: keuPenerimaanItem.id,
                    coa_id: obj.coa_kredit,
                    reff: req.reff,
                    narasi: req.keterangan,
                    trx_date: req.trx_date,
                    delay_date: req.due_date,
                    is_delay: req.is_delay,
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                    dk: 'k'
                })
                await jurnalKredit.save(trx)
                // console.log('add jurnal kredit OK');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
                }
            }

            // JIKA AKUN PENDAPATAN ATAU BIAYA
            if(parseInt(obj.coa_kredit) > 40000){
                const jurnalKreditEquitas = new TrxJurnal()
                try {
                    jurnalKreditEquitas.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: obj.trx_jual || null,
                        fakturbeli_id: obj.trx_beli || null,
                        keuterima_id: params.id,
                        keuterimaitem_id: keuPenerimaanItem.id,
                        coa_id: 30003,
                        reff: req.reff,
                        narasi: req.keterangan,
                        trx_date: req.trx_date,
                        delay_date: req.due_date,
                        is_delay: req.is_delay,
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        dk: 'k'
                    })
                    await jurnalKreditEquitas.save(trx)
                    // console.log('add jurnal kredit OK');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
                    }
                }
            }

            if(obj.trx_jual){
                const order = await OrderPelanggan.query().where('id', obj.trx_jual).last()

                await DB.table('pay_pelanggan').where( w => {
                    w.where('no_kwitansi', req.reff)
                    w.where('order_id', obj.trx_jual)
                }).update('aktif', 'N')
                
                const pelangganBayar = new TrxFakturPelanggan()
                pelangganBayar.fill({
                    order_id: obj.trx_jual,
                    cabang_id: req.cabang_id,
                    no_invoice: order.kdpesanan,
                    no_kwitansi: req.reff,
                    date_paid: moment(req.trx_date).format('YYYY-MM-DD HH:mm'),
                    delay_date: req.is_delay == true ? req.due_date : req.trx_date,
                    metode_paid: req.kas_id ? 'tunai':'transfer',
                    kas_id: req.kas_id || null,
                    bank_id: req.bank_id || null,
                    paid_trx: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    narasi: 'Pembayaran pada invoices '+order.kdpesanan,
                    createdby: user.id,
                    is_delay: req.is_delay
                })

                try {
                    await pelangganBayar.save(trx)
                    // console.log('add pembayaran pelanggan OK');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed insert pembayaran '+ JSON.stringify(error)
                    }
                }

                const orderData = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                orderData.merge({
                    sisa_trx: order.sisa_trx - (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    paid_trx: orderData.paid_trx + (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    status: orderData.paid_trx - (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) > 0 ? 'dp':'lunas'
                })

                try {
                    await orderData.save(trx)
                    // console.log('update invoice pelanggan OK');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update kelebihan pembayaran pada table order pelanggan '
                    }
                }
            }
            
            if(obj.trx_beli){
                /** UPDATE SISA PEMBAYARAN FAKTUR PEMBELIAN **/
                const fakturPembalian = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                const akunHutangDagang = await DefCoa.query().where( w => {
                    w.where('group', 'faktur-pembelian')
                    w.where('description', 'Hutang Dagang')
                }).last()
                const totBayarHutang = await TrxJurnal.query().where( w => {
                    w.where('coa_id', akunHutangDagang.coa_id)
                    w.where('fakturbeli_id', obj.trx_beli)
                    w.where('keubayar_id', params.id)
                    w.where('aktif', 'Y')
                }).getSum('nilai') || 0

                let totalPembelian = parseFloat(fakturPembalian.grandtot) - (totBayarHutang)
                try {
                    fakturPembalian.merge({
                        sisa: totalPembelian,
                        sts_paid: fakturPembalian.grandtot - totalPembelian > 0 ? 'bersisa':'lunas'
                    })

                    await fakturPembalian.save(trx)
                    // console.log('update faktur pembelian OK');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update sisa transaksi faktur pembelian '+ JSON.stringify(error)
                    }
                }
            }

            /** KASUS FAKTUR PELANGGAN BAYAR DI PUSAT **/
            if(obj.trx_jual){
                const order = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                /** UPADTE PEMBAYARAN SEBELUMNYA **/
                
                await DB.table('pay_pelanggan').where( w => {
                    w.where('no_kwitansi', req.reff)
                }).update('aktif', 'N')

                const pelangganBayar = new TrxFakturPelanggan()
                pelangganBayar.fill({
                    order_id: obj.trx_jual,
                    cabang_id: req.cabang_id,
                    no_invoice: order.kdpesanan,
                    no_kwitansi: req.reff,
                    date_paid: req.trx_date,
                    delay_date: req.is_delay == true ? req.due_date : req.trx_date,
                    metode_paid: 'Pembayaran Keuangan Pusat',
                    kas_id: req.kas_id || null,
                    bank_id: req.bank_id || null,
                    paid_trx: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    narasi: 'Penerimaan pembayaran oleh keuangan pusat dengan kode pesanan : '+order.kdpesanan,
                    createdby: user.id,
                    is_delay: req.is_delay
                })

                try {
                    await pelangganBayar.save(trx)
                    // console.log('add pembayaran pelanggan OK');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed insert kelebihan pembayaran '+ JSON.stringify(error)
                    }
                }

                const sumPelangganBayar = await TrxFakturPelanggan.query().where( w => {
                    w.where('order_id', obj.trx_jual)
                    w.where('aktif', 'Y')
                }).getSum('paid_trx') || 0

                const orderData = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                orderData.merge({
                    sisa_trx: (orderData.grandtot_trx) - (sumPelangganBayar + (parseFloat(obj.qty) * parseFloat(obj.harga_stn))),
                    paid_trx: sumPelangganBayar + (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    status: orderData.grandtot_trx - (sumPelangganBayar + (parseFloat(obj.qty) * parseFloat(obj.harga_stn))) > 0 ? 'dp':'lunas'
                })

                try {
                    await orderData.save(trx)
                    // console.log('update pembayaran pelanggan OK');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update penerimaan pembayaran pada table order pelanggan '
                    }
                }
            }
        }

        await trx.commit()
        console.log('all success...');
        return {
            success: true,
            message: 'Success save pembayaran '
        }
    }

    async SHOW (params) {
        const data = (
            await KeuPenerimaan.query()
            .with('coaDebit')
            .with('createdby')
            .with('items', i => i.where('aktif', 'Y'))
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async SHOWITEMS (params) {
        const data = (
            await KeuPenerimaan.query()
            .with('coaDebit')
            .with('createdby')
            .with('items', i => i.where('aktif', 'Y'))
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async PRINT (params) {
        const data = (
            await KeuPenerimaan.query()
            .with('cabang')
            .with('coaDebit')
            .with('createdby')
            .with('items', i => {
                i.with('coaKredit')
                i.with('barang')
                i.with('gudang')
                i.with('pemasok')
                i.with('pelanggan')
                i.with('trxPembelian')
                i.with('trxPenjualan')
                i.where('aktif', 'Y')
            })
            .where('id', params.id)
            .last()
        ).toJSON()
        
        return data
    }

    async DELETE (params) {
        const data = (await KeuPenerimaan.query().with('items').where('id', params.id).last()).toJSON()
        try {
            const keuTandaterima = await KeuPenerimaan.query().where('id', params.id).last()
            keuTandaterima.merge({aktif: 'N'})
            await keuTandaterima.save()
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data keu_pembayarans...'
            }
        }

        try {
            await DB.table('keu_penerimaan_items').where('keuterima_id', params.id).update({aktif: 'N'})
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data keu_pembayaran_items...'
            }
        }

        try {
            await DB.table('keu_penerimaan_attach').where('keuterima_id', params.id).update({aktif: 'N'})
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data keu_pembayaran_attach...'
            }
        }

        try {
            await DB.table('trx_jurnals').where('keuterima_id', params.id).update({aktif: 'N'})
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data trx_jurnals...'
            }
        }

        try {
            await DB.table('trx_banks').where('keuterima_id', params.id).update({aktif: 'N'})
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data pay_pelanggan...'
            }
        }

        try {
            await DB.table('trx_kases').where('keuterima_id', params.id).update({aktif: 'N'})
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data pay_pelanggan...'
            }
        }

        try {
            await DB.table('pay_pelanggan').where('no_kwitansi', data.reff).update({aktif: 'N'})
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data pay_pelanggan...'
            }
        }

        for (const obj of data.items) {
            if(obj.trx_beli){
                try {
                    await DB.table('keu_faktur_pembelians').where('id', obj.trx_beli).update({aktif: 'N'})
                } catch (error) {
                    console.log(error)
                    return {
                        success: false,
                        message: 'Failed delete data keu_faktur_pembelians...'
                    }
                }
            }

            if(obj.trx_jual){
                try {
                    await DB.table('pay_pelanggan').where( w => {
                        w.where('order_id', obj.trx_jual)
                        w.where('no_kwitansi', data.reff)
                    }).update({aktif: 'N'})

                } catch (error) {
                    console.log(error)
                    return {
                        success: false,
                        message: 'Failed delete data pay_pelanggan...'
                    }
                }
            }
        }

        return {
            success: true,
            message: 'Success delete data...'
        }
    }
}

module.exports = new pembayaran()