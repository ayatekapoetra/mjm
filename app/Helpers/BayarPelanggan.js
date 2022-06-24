'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const Kas = use("App/Models/akunting/Kas")
const Bank = use("App/Models/akunting/Bank")
const TrxBank = use("App/Models/transaksi/TrxBank")
const TrxKas = use("App/Models/transaksi/TrxKase")
const Jasa = use("App/Models/master/Jasa")
const initFunc = use("App/Helpers/initFunc")
const SysConfig = use("App/Models/SysConfig")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const VBarangStok = use("App/Models/VBarangStok")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const OpsPelangganBayar = use("App/Models/operational/OpsPelangganBayar")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")
const OpsPelangganOrderItem = use("App/Models/operational/OpsPelangganOrderItem")

class bayarPelanggan {
    async LIST (params) {
        const data = (
            await OpsPelangganBayar
            .query()
            .with('cabang')
            .with('bank')
            .with('kas')
            .where('order_id', params.id)
            .orderBy('created_at', 'desc')
            .paginate()
        ).toJSON()
        return data
    }

    async LIST_ORDER (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        if(req.keyword){
            data = (
                await OpsPelangganOrder
                .query()
                .with('cabang')
                .with('pelanggan')
                .where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.status){
                        w.where('nama', 'like', `%${req.status}%`)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await OpsPelangganOrder
                .query()
                .with('cabang')
                .with('pelanggan')
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }
        return data
    }

    async SHOW (params) {
        const data = (
            await OpsPelangganBayar.query()
            .with('cabang')
            .with('author')
            .where('id', params.id).last()
            ).toJSON()

        return data
    }

    async INVOICING (params, req, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)

        /* START UPDATE ORDER PELANGGAN */
        const orderTrx = await OpsPelangganOrder.query().where('id', params.id).last()

        let totdisc_rp = 0
        
        if(req.potongan_type === 'rupiah'){
            req.barangdisc_rp = parseFloat(req.barangdisc)
            req.jasadisc_rp = parseFloat(req.jasadisc)
            totdisc_rp = parseFloat(req.barangdisc) + parseFloat(req.jasadisc)
        }else{
            var hrgBarang = orderTrx.tot_order
            var hrgJasa = orderTrx.tot_service
            req.barangdisc_rp = hrgBarang * (parseFloat(req.barangdisc)/100)
            req.jasadisc_rp = hrgJasa * (parseFloat(req.jasadisc)/100)
            totdisc_rp = parseFloat(req.barangdisc_rp) + parseFloat(req.jasadisc_rp)
        }
        
        let pajak_rp = (orderTrx.total_trx - totdisc_rp) * parseFloat(req.pajak)
        req.grandtot_trx = (orderTrx.total_trx - totdisc_rp) + pajak_rp

        orderTrx.merge({
            narasi: req.narasi,
            barangdisc_rp: req.barangdisc_rp,
            jasadisc_rp: req.jasadisc_rp,
            totdisc_rp: totdisc_rp,
            ppn: parseFloat(req.pajak) * 100,
            pajak_trx: pajak_rp,
            grandtot_trx: req.grandtot_trx,
            sisa_trx: req.grandtot_trx,
            status: 'ready'
        })

        try {
            await orderTrx.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed generate invoice \n'+ JSON.stringify(error)
            }
        }
        /* END UPDATE ORDER PELANGGAN */

        /* START INSERT JURNAL POTONGAN */
        const arrPotonganCoa = (await DefCoa.query().where({group: 'invoicing-discount', tipe: 'd'}).fetch())?.toJSON()
        for (const akun of arrPotonganCoa) {
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                cabang_id: ws.cabang_id,
                trx_jual: params.id,
                coa_id: akun.coa_id,
                reff: orderTrx.kdpesanan,
                narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description,
                trx_date: req.date,
                nilai: totdisc_rp,
                createdby: user.id,
                dk: 'd'
            })
            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }
        /* END INSERT JURNAL POTONGAN */

        /* START INSERT JURNAL PAJAK */
        const arrPajakCoa = (await DefCoa.query().where({group: 'invoicing-pajak', tipe: 'k'}).fetch())?.toJSON()
        for (const akun of arrPajakCoa) {
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                cabang_id: ws.cabang_id,
                trx_jual: params.id,
                coa_id: akun.coa_id,
                reff: orderTrx.kdpesanan,
                narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description,
                trx_date: req.date,
                nilai: pajak_rp,
                createdby: user.id,
                dk: 'k'
            })
            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }
        /* END INSERT JURNAL PAJAK */

        /* START INSERT JURNAL PENDAPATAN BARANG */
        const arrPendapatanBarangCoa = (await DefCoa.query().where({group: 'invoicing-barang'}).fetch())?.toJSON()
        for (const akun of arrPendapatanBarangCoa) {
            const trxJurnalPendapatanBarang = new TrxJurnal()
            trxJurnalPendapatanBarang.fill({
                cabang_id: ws.cabang_id,
                trx_jual: params.id,
                coa_id: akun.coa_id,
                reff: orderTrx.kdpesanan,
                narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description,
                trx_date: req.date,
                nilai: orderTrx.tot_order - parseFloat(req.barangdisc_rp),
                dk: akun.tipe,
                createdby: user.id
            })
            try {
                await trxJurnalPendapatanBarang.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }
        /* END INSERT JURNAL PENDAPATAN BARANG */

        /* START INSERT JURNAL PENDAPATAN JASA */
        const arrPendapatanJasaCoa = (await DefCoa.query().where({group: 'invoicing-jasa'}).fetch())?.toJSON()
        for (const akun of arrPendapatanJasaCoa) {
            const trxJurnalPendapatanJasa = new TrxJurnal()
            trxJurnalPendapatanJasa.fill({
                cabang_id: ws.cabang_id,
                trx_jual: params.id,
                coa_id: akun.coa_id,
                reff: orderTrx.kdpesanan,
                narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description,
                trx_date: req.date,
                nilai: orderTrx.tot_service - parseFloat(req.jasadisc_rp),
                dk: akun.tipe,
                createdby: user.id
            })
            try {
                await trxJurnalPendapatanJasa.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }
        /* END INSERT JURNAL PENDAPATAN JASA */

        /* START INSERT JURNAL PIUTANG DAGANG */
        const arrPiutangCoa = (await DefCoa.query().where({group: 'invoicing-piutang'}).fetch())?.toJSON()
        for (const akun of arrPiutangCoa) {
            const trxJurnalPiutang = new TrxJurnal()
            trxJurnalPiutang.fill({
                cabang_id: ws.cabang_id,
                trx_jual: params.id,
                coa_id: akun.coa_id,
                reff: orderTrx.kdpesanan,
                narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description,
                trx_date: req.date,
                nilai: orderTrx.grandtot_trx,
                dk: akun.tipe,
                createdby: user.id
            })
            try {
                await trxJurnalPiutang.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal piutang \n'+ JSON.stringify(error)
                }
            }
        }
        /* END INSERT JURNAL PIUTANG DAGANG */

        /* 
            START INSERT JURNAL HPP BARANG & PERSEDIAAN BARANG
            System mencari harga beli barang berdasarkan barang_id nya
            kemudian di kali dengan jumlah quantity barang pada order pelanggan
        */

        const orderItemTrx = (
                await OpsPelangganOrderItem
                    .query()
                    .where('order_id', params.id)
                    .fetch()
                )?.toJSON()
                
        for (const brg of orderItemTrx) {
            const barang = await Barang.query().where('id', brg.barang_id).last()
            const gudang = await Gudang.query().where('id', brg.gudang_id).last()
            const checkHarga = await HargaBeli.query().where( w => { 
                w.where('barang_id', brg.barang_id) 
                w.where('gudang_id', brg.gudang_id) 
            }).last()

            if(!checkHarga){
                return {
                    success: false,
                    message: 'Harga Barang \n[ ' + barang.nama + ' ] \ntidak ditemukan pada gudang \n' + gudang.nama
                }
            }

            const arrHppCoa = (await DefCoa.query().where({group: 'invoicing-hpp'}).fetch()).toJSON()
            
            for (const akun of arrHppCoa) {
                const hargaBeli = await HargaBeli.query().where('barang_id', brg.barang_id).getAvg('harga_beli') || 0
    
                const trxJurnalHppDebit = new TrxJurnal()
                trxJurnalHppDebit.fill({
                    cabang_id: ws.cabang_id,
                    trx_jual: params.id,
                    coa_id: akun.coa_id,
                    reff: orderTrx.kdpesanan,
                    narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description + ' ' + barang.nama,
                    trx_date: req.date,
                    nilai: hargaBeli * brg.qty,
                    dk: akun.tipe,
                    createdby: user.id
                })
                try {
                    await trxJurnalHppDebit.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed jurnal Hpp & Persediaan Barang \n'+ JSON.stringify(error)
                    }
                }
            }

            const barangLokasi = new BarangLokasi()
            barangLokasi.fill({
                trx_inv: brg.id,
                barang_id: brg.barang_id,
                gudang_id: brg.gudang_id,
                cabang_id: ws.cabang_id,
                qty_del: parseFloat(brg.qty),
                createdby: user.id
            })

            try {
                await barangLokasi.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Gagal mempengaruhi stok barang...\n'+JSON.stringify(error)
                }
            }
        }
        /* END INSERT JURNAL HPP BARANG */


        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)
        
        /* FIRST PAYMENT UPDATE STOK BARANG */
        const lenBayar = await OpsPelangganBayar.query().where('order_id', req.inv_id).last()
        if(!lenBayar){
            const listBarang = (await OpsPelangganOrderItem.query().where('order_id', req.inv_id).fetch()).toJSON()
            // console.log(listBarang);
            for (const brg of listBarang) {
                const barangLokasi = new BarangLokasi()
                barangLokasi.fill({
                    trx_inv: brg.id,
                    barang_id: brg.barang_id,
                    gudang_id: brg.gudang_id,
                    cabang_id: ws.cabang_id,
                    qty_del: parseFloat(brg.qty) * -1,
                    qty_hand: parseFloat(brg.qty) * -1,
                    createdby: user.id
                })
                try {
                    await barangLokasi.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update stok \n'+ JSON.stringify(error)
                    }
                }
            }
        }/* FIRST PAYMENT UPDATE STOK BARANG */

        const kodeKwitansi = await initFunc.GEN_KODE_KWITANSI(user)
        const orderData = await OpsPelangganOrder.query().where('id', req.inv_id).last()
        
        const opsPelangganBayar = new OpsPelangganBayar()
        opsPelangganBayar.fill({
            order_id: orderData.id,
            cabang_id: ws.cabang_id,
            no_invoice: orderData.kdpesanan,
            no_kwitansi: kodeKwitansi,
            coa_id: req.coa_id,
            date_paid: req.date,
            metode_paid: req.metode_paid,
            kas_id: req.kas_id,
            bank_id: req.bank_id,
            paid_trx: req.paid_trx,
            narasi: req.narasi,
            createdby: user.id,
            is_delay: req.isDelay ? 'Y':'N'
        })

        try {
            await opsPelangganBayar.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save payment \n'+ JSON.stringify(error)
            }
        }

        const sumPaid = await OpsPelangganBayar.query().where( w => {
            w.where('order_id', req.inv_id)
            w.where('aktif', 'Y')
        }).getSum('paid_trx') || 0

        const opsPelangganOrder = await OpsPelangganOrder.query().where('id', req.inv_id).last()
        let status = (sumPaid + parseFloat(req.paid_trx)) <  orderData.grandtot_trx ? 'dp':'lunas'
        opsPelangganOrder.merge({
            paid_trx: sumPaid + parseFloat(req.paid_trx),
            sisa_trx: orderData.sisa_trx - parseFloat(req.paid_trx),
            status: status
        })

        try {
            await opsPelangganOrder.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed update nilai order \n'+ JSON.stringify(error)
            }
        }

        /* START INSERT DATA JURNAL KAS & BANK */
        if(req.kas_id){
            const akun = await AccCoa.query().where('id', req.coa_id).last()
            const trxJurnalKas = new TrxJurnal()
            trxJurnalKas.fill({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                kas_id: req.kas_id,
                coa_id: req.coa_id,
                reff: kodeKwitansi,
                narasi: '[ '+orderData.kdpesanan+' ] ' + 'pada ' + akun.coa_name,
                trx_date: req.date,
                nilai: req.paid_trx,
                dk: akun.dk,
                trx_paid: opsPelangganBayar.id,
                trx_jual: opsPelangganOrder.id,
            })
            try {
                await trxJurnalKas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal kas \n'+ JSON.stringify(error)
                }
            }

            /* START INSERT TRX KAS */
            const trxKas = new TrxKas()
            trxKas.fill({
                trx_date: req.date,
                kas_id: req.kas_id,
                paid_id: opsPelangganBayar.id,
                saldo_rill: req.paid_trx,
                desc: kodeKwitansi
            })
            try {
                await trxKas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed insert detail saldo kas \n'+ JSON.stringify(error)
                }
            }/* END INSERT TRX KAS */

            /* START UPDATE SALDO KAS */
            const kas = await Kas.query().where('id', req.kas_id).last()
            kas.merge({
                saldo_rill: kas.saldo_rill + parseFloat(req.paid_trx)
            })

            try {
                await kas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update saldo kas \n'+ JSON.stringify(error)
                }
            }/* END UPDATE SALDO KAS */
        }

        if(req.bank_id){
            const akun = await AccCoa.query().where('id', req.coa_id).last()
            const trxJurnalBank = new TrxJurnal()
            trxJurnalBank.fill({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                bank_id: req.bank_id,
                coa_id: req.coa_id,
                reff: kodeKwitansi,
                narasi: '[ '+orderData.kdpesanan+' ] ' + 'pada ' + akun.coa_name,
                trx_date: req.date,
                nilai: req.paid_trx,
                dk: akun.dk,
                trx_paid: opsPelangganBayar.id,
                trx_jual: opsPelangganOrder.id,
                is_delay: req.isDelay ? 'Y':'N',
                delay_date: req.isDelay ? req.delay_date : null
            })
            try {
                await trxJurnalBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal bank \n'+ JSON.stringify(error)
                }
            }

            /* START INSERT TRX BANK */
            const trxBank = new TrxBank()
            trxBank.fill({
                paid_id: opsPelangganBayar.id,
                bank_id: req.bank_id,
                trx_date: moment(req.date).format('YYYY-MM-DD'),
                saldo_net: req.isDelay ? 0 : req.paid_trx,
                setor_tunda: req.isDelay ? req.paid_trx : 0,
                desc: kodeKwitansi
            })
            try {
                await trxBank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed insert details saldo trxbank \n'+ JSON.stringify(error)
                }
            } /* END INSERT TRX BANK */

            /* START UPDATE SALDO BANK */
            const bank = await Bank.query().where('id', req.bank_id).last()
            if(req.isDelay){
                bank.merge({
                    setor_tunda: bank.setor_tunda + parseFloat(req.paid_trx),
                    saldo_rill: (bank.saldo_net + (bank.setor_tunda) + parseFloat(req.paid_trx)) - bank.tarik_tunda
                })
            }else{
                bank.merge({
                    saldo_net: bank.saldo_net + parseFloat(req.paid_trx),
                    saldo_rill: (bank.saldo_net + (bank.setor_tunda + parseFloat(req.paid_trx))) - bank.tarik_tunda
                })
            }

            try {
                await bank.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update saldo bank \n'+ JSON.stringify(error)
                }
            }/* END UPDATE SALDO BANK */
            
        }/* END INSERT DATA JURNAL KAS & BANK */

        const arrPiutangDagangCoa = (await DefCoa.query().where({group: 'paid-invoice'}).fetch()).toJSON()
        console.log('arrPiutangDagangCoa ::::::', arrPiutangDagangCoa);
        
        for (const val of arrPiutangDagangCoa) {
            const akun = await AccCoa.query().where('id', val.coa_id).last()
            const trxJurnalPiutang = new TrxJurnal()
            trxJurnalPiutang.fill({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                coa_id: val.coa_id,
                reff: kodeKwitansi,
                narasi: '[ '+orderData.kdpesanan+' ] ' + 'pada ' + akun.coa_name,
                trx_date: req.date,
                nilai: req.paid_trx,
                dk: val.tipe,
                trx_paid: opsPelangganBayar.id,
                trx_jual: opsPelangganOrder.id,
            })
            try {
                await trxJurnalPiutang.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal bank \n'+ JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)
        
        const paidment = await OpsPelangganBayar.query().where('id', params.id).last()
        const order = await OpsPelangganOrder.query().where('id', paidment.order_id).last()
        let status = (order.sisa_trx + paidment.paid_trx) === order.grandtot_trx ? 'ready':'dp'
        
        
        order.merge({
            paid_trx: order.paid_trx - paidment.paid_trx,
            sisa_trx: order.sisa_trx + paidment.paid_trx,
            status: status
        })
        
        try {
            await order.save(trx)
        } catch (error) {
            await trx.rollback()
            return {
                success: false,
                message: 'Failed recalculated data order...'
            }
        }

        /* RETURN STOK */
        const isLastPayment = await OpsPelangganBayar.query().where('order_id', paidment.order_id).getCount()
        if(isLastPayment <= 1){
            const listBarang = (await OpsPelangganOrderItem.query().where('order_id', paidment.order_id).fetch()).toJSON()
            // console.log(listBarang);
            for (const brg of listBarang) {
                const barangLokasi = new BarangLokasi()
                barangLokasi.fill({
                    trx_inv: brg.id,
                    barang_id: brg.barang_id,
                    gudang_id: brg.gudang_id,
                    cabang_id: ws.cabang_id,
                    qty_del: parseFloat(brg.qty),
                    qty_hand: parseFloat(brg.qty),
                    createdby: user.id
                })
                try {
                    await barangLokasi.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed update stok \n'+ JSON.stringify(error)
                    }
                }
            }
        }/* RETURN STOK */

        /* PENGEMBALIAN SALDO */ 
        if(paidment.kas_id){
            const kas = await Kas.query().where('id', paidment.kas_id).last()
            kas.merge({
                saldo_rill: kas.saldo_rill - paidment.paid_trx
            })
            try {
                await kas.save(trx)
            } catch (error) {
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed returning saldo kas...'
                }
            }
        }

        if(paidment.bank_id){
            const bank = await Bank.query().where('id', paidment.bank_id).last()
            if(paidment.is_delay === 'N'){
                bank.merge({
                    saldo_net: bank.saldo_net - paidment.paid_trx,
                    saldo_rill: bank.saldo_rill - paidment.paid_trx
                })
            }
            
            if(paidment.is_delay === 'Y'){
                bank.merge({
                    setor_tunda: bank.setor_tunda - paidment.paid_trx,
                    saldo_rill: bank.saldo_rill - paidment.paid_trx
                })
            }

            try {
                await bank.save(trx)
            } catch (error) {
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed returning saldo Bank...'
                }
            }
        }

        const delPaiyment = await OpsPelangganBayar.query().where('id', params.id).last()
        try {
            await delPaiyment.delete(trx)
        } catch (error) {
            await trx.rollback()
            return {
                success: false,
                message: 'Failed delete data...'+JSON.stringify(error)
            }
        }

        


        await trx.commit()
        return {
            success: true,
            message: 'Success delete data...'
        }
    }
}

module.exports = new bayarPelanggan()

