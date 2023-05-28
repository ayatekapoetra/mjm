'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
// const BarangLokasi = use("App/Models/BarangLokasi")
const TrxBank = use("App/Models/transaksi/TrxBank")
const TrxKases = use("App/Models/transaksi/TrxKase")
// const HargaJual = use("App/Models/master/HargaJual")
// const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const KeuPembayaran = use("App/Models/transaksi/KeuPembayaran")
const TrxFakturBeli = use("App/Models/transaksi/KeuFakturPembelian")
const LampiranFile = use("App/Models/transaksi/KeuPembayaranAttach")
const TrxFakturPelanggan = use("App/Models/operational/OpsPelangganBayar")
const OrderPelanggan = use("App/Models/operational/OpsPelangganOrder")
const KeuPembayaranItem = use("App/Models/transaksi/KeuPembayaranItem")
// const TrxFakturBeliBayar = use("App/Models/transaksi/TrxFakturBeliBayar")

class pembayaran {
    async LIST (req) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const data = (
            await KeuPembayaran.query()
            .with('coaKredit')
            .with('createdby')
            .with('items', i => i.where('aktif', 'Y'))
            .with('files', f => f.where('aktif', 'Y'))
            .where(
                w => {
                    w.where('aktif', 'Y')
                    if(req.coa_kredit){
                        w.where('coa_kredit', req.coa_kredit)
                    }
                    if(req.narasi){
                        w.where('narasi', 'like', `%${req.narasi}%`)
                    }
                }
            ).orderBy('trx_date', 'desc').paginate(halaman, limit)
        ).toJSON()
        
        return data
    }

    async POST (req, user, attach) {
        console.log(req);
        const trx = await DB.beginTransaction()
        
        /** INSERT TRXPEMBAYARAN **/
        const trxPembayaran = new KeuPembayaran()
        try {
            trxPembayaran.fill({
                author: user.id,
                cabang_id: req.cabang_id,
                coa_kredit: req.coa_kredit,
                reff: req.reff || null,
                trx_date: req.trx_date,
                delay_trx: req.due_date,
                is_delay: req.is_delay,
                penerima: req.penerima || null,
                paidby: req.paidby,
                total: req.subtotal,
                narasi: req.narasi || ' '
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
        if(attach){
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
                        keubayar_id: trxPembayaran.id,
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
                    keubayar_id: trxPembayaran.id,
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
        const coaKredit = await AccCoa.query().where('id', req.coa_kredit).last()
        try {
            const jurnalKredit = new TrxJurnal()
            jurnalKredit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                keubayar_id: trxPembayaran.id,
                coa_id: req.coa_kredit,
                reff: req.reff,
                narasi: `[ ${req.reff} ] ${req.narasi || coaKredit.coa_name}`,
                trx_date: req.trx_date,
                delay_date: req.due_date,
                nilai: req.subtotal,
                is_delay: req.is_delay,
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

        /** INSERT MUTASI KAS ATAU BANK **/
        if(req.bank_id){
            const trxBank = new TrxBank()

            if(req.is_delay){
                var saldo_net = 0
                var tarik_tunda = req.subtotal
            }else{
                var saldo_net = req.subtotal
                var tarik_tunda = 0
            }
            
            trxBank.fill({
                trx_date: req.trx_date,
                mutasi: req.reff,
                bank_id: req.bank_id,
                keubayar_id: trxPembayaran.id,
                saldo_net: saldo_net,
                tarik_tunda: tarik_tunda,
                desc: `[ ${req.reff} ] ${req.narasi || 'Pembayaran pada Bank'}`,
            })

            try {
                await trxBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi kredit bank '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_id){
            const trxKas = new TrxKases()
            
            trxKas.fill({
                trx_date: req.trx_date,
                kas_id: req.kas_id,
                keubayar_id: trxPembayaran.id,
                saldo_rill: req.subtotal,
                desc: `[ ${req.reff} ] ${req.narasi || 'Pembayaran pada Kas'}`,
            })

            try {
                await trxKas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi kredit kas '+ JSON.stringify(error)
                }
            }
        }

        /** INSERT TRXPEMBAYARAN ITEMS **/
        for (const obj of req.items) {
            /* INSERT ITEMS PEMBAYARAN */
            const trxPembayaranItem = new KeuPembayaranItem()
            try {
                const data = {
                    keubayar_id: trxPembayaran.id,
                    cabang_id: req.cabang_id,
                    trx_beli: obj.trx_beli || null,
                    trx_jual: obj.trx_jual || null,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    pemasok_id: obj.pemasok_id || null,
                    pelanggan_id: obj.pelanggan_id || null,
                    coa_debit: obj.coa_debit,
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

            /* INSERT ITEMS JURNAL PEMBAYARAN */
            var nilaiBayar = parseFloat(obj.qty) * parseFloat(obj.harga_stn)
            const coaDebit = await AccCoa.query().where('id', obj.coa_debit).last()
            if(obj.trx_jual){
                const reffJual = await OrderPelanggan.query().where('id', req.trx_jual).last()
                var reff_kode = reffJual.kdpesanan
            }

            if(obj.trx_beli){
                const reffBeli = await TrxFakturBeli.query().where('id', req.trx_beli).last()
                var reff_kode = reffBeli.kode
                /**
                 * JIKA HUTANG DAGANG MEMILIKI PAJAK PPN
                 * **/
            }
            
            const jurnalDebit = new TrxJurnal()
            try {
                jurnalDebit.fill({
                    createdby: user.id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    trx_jual: obj.trx_jual || null,
                    fakturbeli_id: obj.trx_beli || null,
                    keubayar_id: trxPembayaran.id,
                    keubayaritem_id: trxPembayaranItem.id,
                    coa_id: obj.coa_debit,
                    reff: req.reff,
                    narasi: `[ ${reff_kode || req.reff} ] ${coaDebit.coa_name}`,
                    trx_date: req.trx_date,
                    delay_date: req.due_date,
                    is_delay: req.is_delay,
                    nilai: nilaiBayar,
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

            if(parseInt(obj.coa_debit) > 40000){
                const jurnalDebitEquiptas = new TrxJurnal()
                try {
                    jurnalDebitEquiptas.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: obj.trx_jual || null,
                        fakturbeli_id: obj.trx_beli || null,
                        keubayar_id: params.id,
                        keubayaritem_id: trxPembayaranItem.id,
                        coa_id: 30003,
                        reff: req.reff,
                        narasi: `[ ${reff_kode || req.reff} ] ${coaDebit.coa_name}`,
                        trx_date: req.trx_date,
                        delay_date: req.due_date,
                        is_delay: req.is_delay,
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        dk: 'd'
                    })
                    await jurnalDebitEquiptas.save(trx)
                    console.log('jurnalDebitEquiptas.save(trx)');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
                    }
                }

            }

            
            if(obj.trx_beli){
                /** UPDATE SISA PEMBAYARAN FAKTUR PEMBELIAN **/
                let trxFakturBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                let totalPembelian = parseFloat(trxFakturBeli.sisa) - (parseFloat(obj.qty) * parseFloat(obj.harga_stn))
                try {
                    trxFakturBeli.merge({
                        sisa: totalPembelian,
                        sts_paid: trxFakturBeli.sisa - totalPembelian > 0 ? 'bersisa':'lunas'
                    })

                    await trxFakturBeli.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update sisa transaksi faktur pembelian '+ JSON.stringify(error)
                    }
                }
            }

            /** KASUS KELEBIHAN PEMBAYARAN **/
            if(obj.trx_jual){
                const order = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                const pelangganBayar = new TrxFakturPelanggan()
                pelangganBayar.fill({
                    order_id: obj.trx_jual,
                    cabang_id: req.cabang_id,
                    no_invoice: order.kdpesanan,
                    no_kwitansi: req.reff,
                    date_paid: req.trx_date,
                    delay_date: req.is_delay == true ? req.due_date : req.trx_date,
                    metode_paid: 'Kelebihan pembayaran',
                    kas_id: req.kas_id || null,
                    bank_id: req.bank_id || null,
                    paid_trx: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    narasi: 'Kelebihan pembayaran pada invoices '+order.kdpesanan,
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
                        message: 'Failed insert kelebihan pembayaran '+ JSON.stringify(error)
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
        const keuPembayaran = await KeuPembayaran.query().where('id', params.id).last()

        keuPembayaran.merge({
            author: user.id,
            cabang_id: req.cabang_id,
            coa_kredit: req.coa_kredit,
            reff: req.reff,
            trx_date: req.trx_date,
            is_delay: req.is_delay,
            penerima: req.penerima,
            paidby: req.paidby,
            narasi: req.narasi,
            total: req.subtotal
        })

        try {
            await keuPembayaran.save(trx)
            console.log('keuPembayaran.save(trx)');
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pembayaran '+ JSON.stringify(error)
            }
        }

        /** UPDATE TRX JURNAL **/
        await DB.table('trx_jurnals').where('keubayar_id', params.id).update('aktif', 'N')

        /** INSERT TRX JURNAL KREDIT **/
        const coaKredit = await AccCoa.query().where('id', req.coa_kredit).last()
        try {
            const jurnalKredit = new TrxJurnal()
            jurnalKredit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                bank_id: req.bank_id || null,
                kas_id: req.kas_id || null,
                keubayar_id: params.id,
                coa_id: req.coa_kredit,
                reff: req.reff,
                narasi: `[ ${req.reff} ] ${req.narasi || coaKredit.coa_name}`,
                trx_date: req.trx_date,
                delay_date: req.due_date,
                nilai: req.subtotal,
                is_delay: req.is_delay,
                dk: 'k'
            })
            await jurnalKredit.save(trx)
            console.log('jurnalKredit.save(trx)');
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
            const updTrxBank = await TrxBank.query().where( w => {
                w.where('keubayar_id', params.id)
                w.where('aktif', 'Y')
            }).last()
            try {
                updTrxBank.merge({aktif: 'N'})
                await updTrxBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
            }

            const trxBank = new TrxBank()
            if(req.is_delay){
                var saldo_net = 0
                var tarik_tunda = req.subtotal
            }else{
                var saldo_net = req.subtotal
                var tarik_tunda = 0
            }
            
            trxBank.fill({
                trx_date: req.trx_date,
                mutasi: req.reff,
                bank_id: req.bank_id,
                keubayar_id: params.id,
                saldo_net: saldo_net,
                tarik_tunda: tarik_tunda,
                desc: `[ ${req.reff} ] ${req.narasi || 'Upd Pembayaran pada Bank'}`,
            })

            try {
                await trxBank.save(trx)
                console.log('trxBank.save(trx)');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save mutasi kredit bank '+ JSON.stringify(error)
                }
            }
        }

        if(req.kas_id){

            const updKas = await TrxKases.query().where( w => {
                w.where('keubayar_id', params.id)
                w.where('kas_id', req.kas_id)
                w.where('aktif', 'Y')
            }).last()

            try {
                updKas.merge({aktif: 'N'})
                await updKas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed delete mutasi kredit kas '+ JSON.stringify(error)
                }
            }
            const trxKas = new TrxKases()
            
            trxKas.fill({
                trx_date: req.trx_date,
                kas_id: req.kas_id,
                keubayar_id: params.id,
                saldo_rill: req.subtotal,
                desc: `[ ${req.reff} ] ${req.narasi || 'Upd Pembayaran pada Kas'}`,
            })

            try {
                await trxKas.save(trx)
                console.log('trxKas.save(trx)');
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
            await DB.table('keu_pembayaran_attach').where('keubayar_id', params.id).update({aktif: 'N'})
            if(attach._files.length > 1){
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
                        keubayar_id: params.id,
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
                await objFile.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })
    
                if (!attach.moved()) {
                    return attach.error()
                }
    
                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    keubayar_id: params.id,
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
                        message: 'Failed save data attachment...'+JSON.stringify(error)
                    }
                }
            }
        }

        await DB.table('keu_pembayaran_items').where('keubayar_id', params.id).update({aktif: 'N'})

        /** INSERT TRXPEMBAYARAN ITEMS **/
        for (const obj of req.items) {
            /* INSERT ITEMS PEMBAYARAN */
            const trxPembayaranItem = new KeuPembayaranItem()
            try {
                const data = {
                    keubayar_id: params.id,
                    cabang_id: req.cabang_id,
                    trx_beli: obj.trx_beli || null,
                    trx_jual: obj.trx_jual || null,
                    barang_id: obj.barang_id || null,
                    gudang_id: obj.gudang_id || null,
                    pemasok_id: obj.pemasok_id || null,
                    pelanggan_id: obj.pelanggan_id || null,
                    coa_debit: obj.coa_debit,
                    qty: obj.qty,
                    harga_stn: obj.harga_stn,
                    harga_total: parseFloat(obj.qty) * parseFloat(obj.harga_stn)
                }

                trxPembayaranItem.fill(data)
                await trxPembayaranItem.save(trx)
                console.log('trxPembayaranItem.save(trx)');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save pembayaran item '+ JSON.stringify(error)
                }
            }

            /* INSERT ITEMS JURNAL PEMBAYARAN */
            const coaDebit = await AccCoa.query().where('id', obj.coa_debit).last()
            if(obj.trx_jual){
                const reffJual = await OrderPelanggan.query().where('id', req.trx_jual).last()
                var reff_kode = reffJual.kdpesanan
            }
            if(obj.trx_beli){
                const reffBeli = await TrxFakturBeli.query().where('id', req.trx_beli).last()
                var reff_kode = reffBeli.kode
            }

            const jurnalDebit = new TrxJurnal()
            try {
                jurnalDebit.fill({
                    createdby: user.id,
                    cabang_id: req.cabang_id,
                    bank_id: req.bank_id || null,
                    kas_id: req.kas_id || null,
                    trx_jual: obj.trx_jual || null,
                    fakturbeli_id: obj.trx_beli || null,
                    keubayar_id: params.id,
                    keubayaritem_id: trxPembayaranItem.id,
                    coa_id: obj.coa_debit,
                    reff: req.reff,
                    narasi: `[ ${reff_kode || req.reff} ] ${coaDebit.coa_name}`,
                    trx_date: req.trx_date,
                    delay_date: req.due_date,
                    is_delay: req.is_delay,
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                    dk: 'd'
                })
                await jurnalDebit.save(trx)
                console.log('jurnalDebit.save(trx)');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
                }
            }

            if(parseInt(obj.coa_debit) > 40000){
                const jurnalDebitEquiptas = new TrxJurnal()
                try {
                    jurnalDebitEquiptas.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: obj.trx_jual || null,
                        fakturbeli_id: obj.trx_beli || null,
                        keubayar_id: params.id,
                        keubayaritem_id: trxPembayaranItem.id,
                        coa_id: 30003,
                        reff: req.reff,
                        narasi: `[ ${reff_kode || req.reff} ] ${coaDebit.coa_name}`,
                        trx_date: req.trx_date,
                        delay_date: req.due_date,
                        is_delay: req.is_delay,
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        dk: 'd'
                    })
                    await jurnalDebitEquiptas.save(trx)
                    console.log('jurnalDebitEquiptas.save(trx)');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
                    }
                }

            }

            
            if(obj.trx_beli){
                /** UPDATE SISA PEMBAYARAN FAKTUR PEMBELIAN **/
                const trxFakturBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                const sumPembayaran = await KeuPembayaranItem.query().where( w => {
                    w.where('keubayar_id', params.id)
                    w.where('trx_beli', obj.trx_beli)
                    w.where('aktif', 'Y')
                }).getSum('harga_total') || 0

                let totalPembelian = parseFloat(trxFakturBeli.grandtot) - ((parseFloat(obj.qty) * parseFloat(obj.harga_stn)) + sumPembayaran)
                try {
                    trxFakturBeli.merge({
                        sisa: totalPembelian,
                        sts_paid: trxFakturBeli.grandtot - totalPembelian > 0 ? 'bersisa':'lunas'
                    })

                    await trxFakturBeli.save(trx)
                    console.log('trxFakturBeli.save(trx)');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update sisa transaksi faktur pembelian '+ JSON.stringify(error)
                    }
                }
            }

            /** KASUS KELEBIHAN PEMBAYARAN **/
            if(obj.trx_jual){
                const order = await OrderPelanggan.query().where('id', obj.trx_jual).last()
                /** UPADTE PEMBAYARAN SEBELUMNYA **/
                
                await DB.table('pay_pelanggan').where( w => {
                    w.where('no_kwitansi', req.reff)
                }).update({aktif: 'N'})

                const pelangganBayar = new TrxFakturPelanggan()
                pelangganBayar.fill({
                    order_id: obj.trx_jual,
                    cabang_id: req.cabang_id,
                    no_invoice: order.kdpesanan,
                    no_kwitansi: req.reff,
                    date_paid: req.trx_date,
                    delay_date: req.is_delay == true ? req.due_date : req.trx_date,
                    metode_paid: 'Kelebihan pembayaran',
                    kas_id: req.kas_id || null,
                    bank_id: req.bank_id || null,
                    paid_trx: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)),
                    narasi: 'Kelebihan pembayaran pada invoices '+order.kdpesanan,
                    createdby: user.id,
                    is_delay: req.is_delay
                })

                try {
                    await pelangganBayar.save(trx)
                    console.log('pelangganBayar.save(trx)');
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
                    console.log('orderData.save(trx)');
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
            message: 'Success save pembayaran '
        }
    }

    async SHOW (params) {
        const data = (
            await KeuPembayaran.query()
            .with('coaKredit')
            .with('createdby')
            .with('items', i => i.where('aktif', 'Y'))
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async SHOWITEMS (params) {
        const data = (
            await KeuPembayaran.query()
            .with('coaKredit')
            .with('createdby')
            .with('items', i => i.where('aktif', 'Y'))
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async PRINT (params) {
        const data = (
            await KeuPembayaran.query()
            .with('cabang')
            .with('coaKredit')
            .with('createdby')
            .with('items', i => {
                i.with('coaDebit')
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
        console.log(params);
        const trx = await DB.beginTransaction()
        const data = (await KeuPembayaran.query().with('items').where('id', params.id).last()).toJSON()
        try {
            // await DB.table('keu_pembayarans').where('id', params.id).update({aktif: 'N'})
            const delBayar = await KeuPembayaran.query().where('id', params.id).last()
            delBayar.merge({aktif: 'N'})
            await delBayar.save(trx)
        } catch (error) {
            console.log(error)
            await trx.rollback()
            return {
                success: false,
                message: 'Failed delete data keu_pembayarans...'
            }
        }

        const itemBayar = (await KeuPembayaranItem.query().where('keubayar_id', params.id).fetch()).toJSON()
        for (const val of itemBayar) {
            const delItems = await KeuPembayaranItem.query().where('id', val.id).last()
            try {
                delItems.merge({aktif: 'N'})
                await delItems.save(trx)
            } catch (error) {
                console.log(error)
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed delete data keu_pembayaran_items...'
                }
            }
        }

        try {
            await DB.table('keu_pembayaran_attach').where('keubayar_id', params.id).update({aktif: 'N'})
        } catch (error) {
            console.log(error)
            return {
                success: false,
                message: 'Failed delete data keu_pembayaran_attach...'
            }
        }

        const delJurnal = (await TrxJurnal.query().where('keubayar_id', params.id).fetch()).toJSON()
        for (const val of delJurnal) {
            const delTrxJurnal = await TrxJurnal.query().where('id', val.id).last()
            try {
                // await DB.table('trx_jurnals').where('keubayar_id', params.id).update({aktif: 'N'})
                delTrxJurnal.merge({aktif: 'N'})
                await delTrxJurnal.save(trx)
            } catch (error) {
                console.log(error)
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed delete data trx_jurnals...'
                }
            }
        }

        const trxPelangganBayar = (await TrxFakturPelanggan.query().where( w => {
            w.where('no_kwitansi', data.reff)
            w.where('aktif', 'Y')
        }).fetch()).toJSON()
        for (const val of trxPelangganBayar) {
            const delBayar = await TrxFakturPelanggan.query().where('id', val.id).last()
            try {
                // await DB.table('pay_pelanggan').where('no_kwitansi', data.reff).update({aktif: 'N'})
                delBayar.merge({aktif: 'N'})
                await delBayar.save(trx)
            } catch (error) {
                console.log(error)
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed delete data pay_pelanggan...'
                }
            }
        }

        /** JIKA PEMBAYARAN MELALUI KAS **/
        const dataKas = (
            await TrxKases.query().where( w => {
                w.where('keubayar_id', params.id)
                w.where('kas_id', data.coa_kredit)
            }).fetch()
        ).toJSON()

        for (const val of dataKas) {
            const delKas = await TrxKases.query().where('id', val.id).last()
            try {
                // await DB.table('trx_kases').where( w => {
                //     w.where('keubayar_id', params.id)
                //     w.where('kas_id', data.coa_kredit)
                // }).update({aktif: 'N'})
                delKas.merge({aktif: 'N'})
                await delKas.save(trx)
            } catch (error) {
                console.log(error)
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed delete data pay_pelanggan...'
                }
            }
        }

         /** JIKA PEMBAYARAN MELALUI BANK **/
         const dataBank = (
            await TrxBank.query().where( w => {
                w.where('keubayar_id', params.id)
                w.where('bank_id', data.coa_kredit)
            }).fetch()
        ).toJSON()
        for (const val of dataBank) {
            try {
                //    await DB.table('trx_banks').where( w => {
                //        w.where('keubayar_id', params.id)
                //        w.where('bank_id', data.coa_kredit)
                //    }).update({aktif: 'N'})
                const delBank = await TrxBank.query().where('id', val.id).last()
                delBank.merge({aktif: 'N'})
                await delBank.save(trx)
           } catch (error) {
               console.log(error)
               await trx.rollback()
               return {
                   success: false,
                   message: 'Failed delete data pay_pelanggan...'
               }
           }
        }

        for (const obj of data.items) {
            if(obj.trx_beli){
                const sumItemBeli = await KeuPembayaranItem.query().where( w => {
                    w.where('trx_beli', obj.trx_beli)
                    w.where('aktif', 'Y')
                }).getSum('harga_total') || 0
                const trxFakturBeli = await TrxFakturBeli.query().where('id', obj.trx_beli).last()
                var sisa = trxFakturBeli.grandtot - sumItemBeli
                console.log('SISA :::', sisa);
                try {
                    trxFakturBeli.merge({
                        sisa: sisa,
                        sts_paid: sisa != 0 ? 'bersisa':'lunas'
                    })
                    await trxFakturBeli.save(trx)
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

        await trx.commit()
        return {
            success: true,
            message: 'Success delete data...'
        }
    }
}

module.exports = new pembayaran()