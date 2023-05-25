'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const Kas = use("App/Models/akunting/Kas")
const Bank = use("App/Models/akunting/Bank")
const Jasa = use("App/Models/master/Jasa")
const initFunc = use("App/Helpers/initFunc")
const SysConfig = use("App/Models/SysConfig")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const VBarangStok = use("App/Models/VBarangStok")
const TrxKas = use("App/Models/transaksi/TrxKase")
const TrxBank = use("App/Models/transaksi/TrxBank")
const BarangLokasi = use("App/Models/BarangLokasi")
const Pelanggan = use("App/Models/master/Pelanggan")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const KeuPenerimaan = use("App/Models/transaksi/KeuPenerimaan")
const KeuPenerimaanItem = use("App/Models/transaksi/KeuPenerimaanItem")
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
            .where( w => {
                w.where('order_id', params.id)
                w.where('aktif', 'Y')
            })
            .orderBy('created_at', 'desc')
            .paginate()
        ).toJSON()
        return data
    }

    async LIST_ORDER (req, user) {
        console.log(req);
        const limit = req.limit || 25;
        const ws = await initFunc.WORKSPACE(user)
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        if(req.keyword){
            data = (
                await OpsPelangganOrder
                .query()
                .with('cabang')
                .with('pelanggan')
                .with('payment')
                .where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.pelanggan_id){
                        w.where('pelanggan_id', req.pelanggan_id)
                    }
                    if(req.status){
                        w.where('status', req.status)
                    }
                    if (req.beginDate && req.endDate) {
                        w.where('date', '>=', moment(req.beginDate).startOf('day').format('YYYY-MM-DD HH:mm'))
                        w.where('date', '<=', moment(req.endDate).endOf('day').format('YYYY-MM-DD HH:mm'))
                    }
                    w.where('kdpesanan', 'like', `%${req.keyword}%`)
                    w.orWhere('narasi', 'like', `%${req.keyword}%`)
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
                .with('payment', w => w.where('aktif', 'Y'))
                .where( w => {
                    if(!['administrator', 'developer', 'keuangan'].includes(user.usertype)){
                        w.where('cabang_id', ws.cabang_id)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }
        console.log("<LIST-ORDER>", data);
        return data
    }
    async PENDING_PAYMENT (params){
        const data = (await OpsPelangganOrder.query().where( w => {
            w.where('pelanggan_id', params.id)
            w.whereIn('status', ['ready', 'dp'])
        }).fetch()).toJSON()
        return data.map(obj => {
            return {
                ...obj,
                date: moment(obj.date).format('DD-MM-YYYY'),
                times: moment(obj.date).format('HH:mm'),
            }
        })
    }

    async SHOW (params) {
        const data = (
            await OpsPelangganBayar.query()
            .with('cabang')
            .with('author')
            .with('order', d => {
                d.with('jasa', j => j.with('jasa'))
                d.with('items', i => i.with('barang'))
            })
            .where('id', params.id).last()
            ).toJSON()

        return data
    }

    async KWITANSI (params) {
        const data = (
            await OpsPelangganBayar.query()
            .with('cabang')
            .with('author')
            .with('order', d => {
                d.with('pelanggan')
                d.with('items')
                d.with('jasa')
            })
            .where('id', params.id).last()
            ).toJSON()

        return data
    }

    async INVOICING_ROLLBACK (params, user){
        const trx = await DB.beginTransaction()

        const checkPembayaran = (await OpsPelangganBayar.query().where( w => {
            w.where('order_id', params.id)
            w.where('aktif', 'Y')
        }).fetch()).toJSON()

        console.log(checkPembayaran);

        if(checkPembayaran.length > 0){
            return {
                success: false,
                message: 'Data gagal untuk rollback, ditemukan '+checkPembayaran.length+' data pembayaran pelanggan yang sah...'
            }
        }

        const orderTrx = await OpsPelangganOrder.query().where('id', params.id).last()
        orderTrx.merge({
            barangdisc_rp: 0,
            jasadisc_rp: 0,
            totdisc_rp: 0,
            ppn: 0,
            pajak_trx: 0,
            status: 'pending'
        })

        /**
         * ROLLBACK DATA INVOICING PELANGGAN
         * **/
        try {
            await orderTrx.save(trx)
            console.log('orderTrx :::', orderTrx.toJSON())
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed generate invoice \n'+ JSON.stringify(error)
            }
        }/* END ROLLBACK DATA INVOICING PELANGGAN */

        /**
         * UPDATE TRX-JURNAL STATUS TIDAK AKTIF
         * **/
        const trxJurnalRollBack = (await TrxJurnal.query().where('trx_jual', params.id).fetch()).toJSON()
        for (const val of trxJurnalRollBack) {
            const trxJurnal = await TrxJurnal.query().where('id', val.id).last()
            trxJurnal.merge({aktif: 'N'})
            try {
                await trxJurnal.save(trx)
            } catch (error) {
                onsole.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed rollback jurnal invoice \n'+ JSON.stringify(error)
                }
            }
        }/* END ROLLBACK JURNAL INVOICING PELANGGAN */

        /**
         * ROLLBACK ITEM BARANG ORDER PADA BARANG LOKASI
         * **/
        const listBarangOrder = (
            await OpsPelangganOrderItem.query().where( w => {
                w.where('order_id', params.id)
                w.where('aktif', 'Y')
            }).fetch()
        ).toJSON()

        for (const brg of listBarangOrder) {
            const barangLokasi = new BarangLokasi()
            barangLokasi.fill({
                trx_inv: brg.id,
                barang_id: brg.barang_id,
                gudang_id: brg.gudang_id,
                cabang_id: orderTrx.cabang_id,
                qty_hand: parseFloat(brg.qty),
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

        /* SEND NOTIFICATION */
        let arrUserTipe = ['administrator', 'developer', 'keuangan']
        await initFunc.SEND_NOTIFICATION(
            user, 
            arrUserTipe, 
            {
                header: "Invoicing",
                title: orderTrx.kdpesanan,
                link: '/operational/entry-pembayaran',
                content: user.nama_lengkap + " telah melakukan ROLLBACK data invoices dengan kode "+orderTrx.kdpesanan,
            }
        )

        await trx.commit()
        return {
            success: true,
            message: 'Success rollback data...'
        }
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
            type_discount: req.potongan_type,
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
            console.log('orderTrx :::', orderTrx.toJSON())
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed generate invoice \n'+ JSON.stringify(error)
            }
        }/* END UPDATE ORDER PELANGGAN */

        /* START INSERT JURNAL POTONGAN BARANG */
        const arrPotonganBarangCoa = (await DefCoa.query().where({group: 'invoicing-discount-barang'}).fetch())?.toJSON()
        for (const akun of arrPotonganBarangCoa) {
            const invoicingDiscountBarang = new TrxJurnal()
            invoicingDiscountBarang.fill({
                cabang_id: ws.cabang_id,
                trx_jual: params.id,
                coa_id: akun.coa_id,
                reff: orderTrx.kdpesanan,
                narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description,
                trx_date: req.date,
                nilai: req.barangdisc_rp,
                createdby: user.id,
                dk: akun.tipe
            })
            try {
                await invoicingDiscountBarang.save(trx)
                console.log('invoicingDiscountBarang :::', invoicingDiscountBarang.toJSON())
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }/* END INSERT JURNAL POTONGAN BARANG */

        /* START INSERT JURNAL POTONGAN JASA */
        const arrPotonganJasaCoa = (await DefCoa.query().where({group: 'invoicing-discount-jasa'}).fetch())?.toJSON()
        for (const akun of arrPotonganJasaCoa) {
            const invoicingDiscountJasa = new TrxJurnal()
            invoicingDiscountJasa.fill({
                cabang_id: ws.cabang_id,
                trx_jual: params.id,
                coa_id: akun.coa_id,
                reff: orderTrx.kdpesanan,
                narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description,
                trx_date: req.date,
                nilai: req.jasadisc_rp,
                createdby: user.id,
                dk: akun.tipe
            })
            try {
                await invoicingDiscountJasa.save(trx)
                console.log('invoicingDiscountJasa :::', invoicingDiscountJasa.toJSON())
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }/* END INSERT JURNAL POTONGAN JASA */

        /* START INSERT JURNAL PAJAK */
        const arrPajakCoa = (await DefCoa.query().where({group: 'invoicing-pajak', tipe: 'k'}).fetch())?.toJSON()
        for (const akun of arrPajakCoa) {
            const invoicingPajak = new TrxJurnal()
            invoicingPajak.fill({
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
                await invoicingPajak.save(trx)
                console.log('invoicingPajak :::', invoicingPajak.toJSON())
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }/* END INSERT JURNAL PAJAK */

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
                nilai: orderTrx.tot_order,
                dk: akun.tipe,
                createdby: user.id
            })
            try {
                await trxJurnalPendapatanBarang.save(trx)
                console.log('await trxJurnalPendapatanBarang.save(trx)');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        }/* END INSERT JURNAL PENDAPATAN BARANG */

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
                nilai: orderTrx.tot_service,
                dk: akun.tipe,
                createdby: user.id
            })
            try {
                await trxJurnalPendapatanJasa.save(trx)
                console.log('await trxJurnalPendapatanJasa.save(trx)');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed jurnal debit \n'+ JSON.stringify(error)
                }
            }
        } /* END INSERT JURNAL PENDAPATAN JASA */

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
                console.log('await trxJurnalPiutang.save(trx)');
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
                
        /** LOOPING ITEMS **/
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
                console.log('HPP :::: ', barang.nama);
                const hargaBeli = await HargaBeli.query().where('barang_id', brg.barang_id).getAvg('harga_beli') || 0
    
                const trxJurnalHppDebit = new TrxJurnal()
                trxJurnalHppDebit.fill({
                    cabang_id: ws.cabang_id,
                    trx_jual: params.id,
                    coa_id: akun.coa_id,
                    barang_id: barang.id,
                    reff: orderTrx.kdpesanan,
                    narasi: '[ '+orderTrx.kdpesanan+' ] ' + akun.description + ' ' + barang.nama,
                    trx_date: req.date,
                    nilai: hargaBeli * brg.qty,
                    dk: akun.tipe,
                    createdby: user.id
                })
                try {
                    await trxJurnalHppDebit.save(trx)
                    console.log('await trxJurnalHppDebit.save(trx)');
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
                qty_hand: parseFloat(brg.qty) * -1,
                qty_del: parseFloat(brg.qty) * -1,
                createdby: user.id
            })

            try {
                await barangLokasi.save(trx)
                console.log('await barangLokasi.save(trx)');
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

        /* SEND NOTIFICATION */
        let arrUserTipe = ['administrator', 'developer', 'keuangan']
        await initFunc.SEND_NOTIFICATION(
            user, 
            arrUserTipe, 
            {
                header: "Invoicing",
                title: orderTrx.kdpesanan,
                link: '/operational/entry-pembayaran',
                content: user.nama_lengkap + " telah membuat invoice dengan kode "+orderTrx.kdpesanan,
            }
        )

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)
        const uniqKey = req.uniqKey || moment().format('DDMMYYHHmmss')

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
            delay_date: req.isDelay ? req.delay_date : req.date,
            metode_paid: req.metode_paid,
            kas_id: req.kas_id,
            bank_id: req.bank_id,
            paid_trx: parseFloat(req.paid_trx) - (parseFloat(req.akun_nilai) || 0),
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
            paid_trx: sumPaid + (parseFloat(req.paid_trx) - (parseFloat(req.akun_nilai) || 0)),
            sisa_trx: orderData.sisa_trx - (parseFloat(req.paid_trx) - (parseFloat(req.akun_nilai) || 0)),
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

        /* START INSERT DATA JURNAL KAS ATAU BANK */
        if(req.kas_id){
            const akun = await AccCoa.query().where('id', req.coa_id).last()
            const trxJurnalKas = new TrxJurnal()
            trxJurnalKas.fill({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                kas_id: req.kas_id,
                coa_id: req.coa_id,
                reff: kodeKwitansi,
                narasi: '[ '+orderData.kdpesanan+' ] ' + 'Pembayaran pada Kas ' + akun.coa_name,
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
                narasi: '[ '+orderData.kdpesanan+' ] ' + 'Pembayaran pada Bank ' + akun.coa_name,
                trx_date: req.date,
                nilai: (parseFloat(req.paid_trx) - (parseFloat(req.akun_nilai) || 0)),
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
                mutasi: uniqKey,
                trx_date: moment(req.date).format('YYYY-MM-DD'),
                saldo_net: req.isDelay ? 0 : (parseFloat(req.paid_trx) - (parseFloat(req.akun_nilai) || 0)),
                setor_tunda: req.isDelay ? (parseFloat(req.paid_trx) - (parseFloat(req.akun_nilai) || 0)) : 0,
                desc: 'Pembayaran ' + orderData.kdpesanan
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
            
        }/* END INSERT DATA JURNAL KAS ATAU BANK */

        if(req.akun){
            const coa = await AccCoa.query().where('id', req.akun).last()
            const additionalAkunJurnal = new TrxJurnal()
            additionalAkunJurnal.fill({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                bank_id: req.bank_id,
                coa_id: req.akun,
                reff: kodeKwitansi,
                narasi: '[ '+orderData.kdpesanan+' ] ' + 'Pembayaran additional ' + coa.coa_name,
                trx_date: req.date,
                nilai: req.akun_nilai,
                dk: coa.dk,
                trx_jual: opsPelangganOrder.id,
                trx_paid: opsPelangganBayar.id
            })

            try {
                await additionalAkunJurnal.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed insert additional akun \n'+ JSON.stringify(error)
                }
            }
        }

        
        /* START INSERT PIUTANG DAGANG */
        const arrPiutangDagangCoa = (await DefCoa.query().where({group: 'paid-invoice'}).fetch()).toJSON()
        for (const val of arrPiutangDagangCoa) {
            const akun = await AccCoa.query().where('id', val.coa_id).last()
            const trxJurnalPiutang = new TrxJurnal()
            trxJurnalPiutang.fill({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                coa_id: val.coa_id,
                reff: orderData.kdpesanan,
                narasi: '[ '+kodeKwitansi +' ] ' + 'Pembayaran pada ' + akun.coa_name,
                trx_date: req.date,
                nilai: (parseFloat(req.paid_trx) - (parseFloat(req.akun_nilai) || 0)),
                dk: val.tipe,
                is_delay: req.isDelay ? 'Y':'N',
                trx_paid: opsPelangganBayar.id,
                trx_jual: opsPelangganOrder.id,
                delay_date: req.isDelay ? req.delay_date : null
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

        /** INSERT DATA PADA PENERIMAAN KEUANGAN **/
        const keuPenerimaan = new KeuPenerimaan()
        try {
            keuPenerimaan.fill({
                author: user.id,
                cabang_id: ws.cabang_id,
                coa_debit: req.coa_id,
                trx_jual: orderData.id,
                bayar_id: opsPelangganBayar.id,
                reff: kodeKwitansi || null,
                trx_date: req.date,
                delay_trx: req.delay_date,
                is_delay: req.isDelay ? 'Y':'N',
                penerima: user.nama_lengkap,
                paidby: 'pelanggan',
                total: req.paid_trx,
                narasi: 'Penerimaan Cabang'
            })
            await keuPenerimaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed insert penerimaan keuangan \n'+ JSON.stringify(error)
            }
        }

        const keuPenerimaanItem = new KeuPenerimaanItem()
        try {
            keuPenerimaanItem.fill({
                keuterima_id: keuPenerimaan.id,
                cabang_id: ws.cabang_id,
                trx_jual: orderData.id,
                pelanggan_id: orderData.pelanggan_id,
                coa_kredit: '11005',
                description: 'Penerimaan Kasir ' + kodeKwitansi,
                qty: 1,
                harga_stn: req.paid_trx,
                harga_total: req.paid_trx,
            })
            await keuPenerimaanItem.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed insert penerimaan keuangan item \n'+ JSON.stringify(error)
            }
        }
        /* SEND NOTIFICATION */
        let arrUserTipe = ['administrator', 'developer', 'keuangan']
        await initFunc.SEND_NOTIFICATION(
            user, 
            arrUserTipe, 
            {
                header: "Pembayaran Pelanggan",
                title: kodeKwitansi,
                link: '/operational/entry-pembayaran',
                content: user.nama_lengkap + " developer telah melakukan input pembayaran dengan kode "+kodeKwitansi,
            }
        )

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async UPDATE (params, req, user) {
        console.log(params);
        console.log(req);

        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)
        const dataBayarOld = (await OpsPelangganBayar.query().with('order').where('id', params.id).last()).toJSON()

        const updBayar = await OpsPelangganBayar.query().where('id', params.id).last()
        updBayar.merge({
            coa_id: req.coa_id,
            date_paid: req.date,
            delay_date: req.isDelay ? req.delay_date : req.date,
            metode_paid: req.metode_paid,
            kas_id: req.kas_id,
            bank_id: req.bank_id,
            paid_trx: req.paid_trx,
            add_coa: req.akun || null,
            adm_bank: req.akun_nilai || null,
            narasi: req.narasi,
            createdby: user.id,
            is_delay: req.isDelay ? 'Y':'N'
        })
        console.log("<RESULT-UPD_BAYAR>", updBayar.toJSON());
        try {
            await updBayar.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed update pembayaran \n'+ JSON.stringify(error)
            }
        }

        /* UPDATE SISA PEMBAYARAN ORDER PELANGGAN */
        const dataOrderPelanggan = await OpsPelangganOrder.query().where('id', dataBayarOld.order_id).last()
        let sisa = (dataOrderPelanggan.sisa_trx + dataBayarOld.paid_trx) - parseFloat(req.paid_trx)
        let sumBayar = (dataOrderPelanggan.paid_trx - dataBayarOld.paid_trx) + parseFloat(req.paid_trx)
        let totalBelanja = dataOrderPelanggan.grandtot_trx
        if(sumBayar == 0){
            var status = 'ready'
        }else if(sumBayar >=  totalBelanja){
            var status = 'lunas'
        }else if(sumBayar < totalBelanja){
            var status = 'dp'
        }else{
            var status = 'batal'
        }
        
        try {
            dataOrderPelanggan.merge({
                sisa_trx: sisa,
                paid_trx: sumBayar,
                status: status
            })
            await dataOrderPelanggan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed rollback sisa bayar order pelanggan \n'+ JSON.stringify(error)
            }
        }

        /* START INSERT PIUTANG DAGANG */
        const arrPiutangDagangCoa = (await DefCoa.query().where({group: 'paid-invoice'}).fetch()).toJSON()
        for (const val of arrPiutangDagangCoa) {
            const akun = await AccCoa.query().where('id', val.coa_id).last()
            const trxJurnalPiutang = await TrxJurnal.query().where( w => {
                w.where('trx_jual', dataBayarOld.order_id)
                w.where('trx_paid', params.id)
                w.where('coa_id', val.coa_id)
            }).last()

            trxJurnalPiutang.merge({
                coa_id: val.coa_id,
                reff: dataBayarOld.no_kwitansi,
                narasi: '[ '+dataBayarOld.no_invoice+' ] ' + 'Pembayaran pada ' + akun.coa_name,
                trx_date: req.date,
                nilai: req.paid_trx,
                dk: val.tipe,
                is_delay: req.isDelay ? 'Y':'N',
                trx_paid: params.id,
                trx_jual: dataBayarOld.order_id,
                delay_date: req.isDelay ? req.delay_date : null
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

        if(dataBayarOld.kas_id){
            const trxKas = await TrxKas.query().where('paid_id', dataBayarOld.id).last()
            trxKas.merge({aktif: 'N'})
            try {
                await trxKas.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed delete mutasi kas \n'+ JSON.stringify(error)
                }
            }
        }

        /* START INSERT DATA JURNAL KAS & BANK */
        if(req.kas_id){
            const akun = await AccCoa.query().where('id', req.coa_id).last()
            const trxJurnalKas = await TrxJurnal.query().where( w => {
                w.where('trx_jual', updBayar.order_id)
                w.where('trx_paid', params.id)
                w.where('kas_id', dataBayarOld.kas_id)
            }).last()

            trxJurnalKas.merge({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                kas_id: req.kas_id,
                coa_id: req.coa_id,
                reff: updBayar.no_kwitansi,
                narasi: '[ '+dataBayarOld.no_invoice+' ] ' + 'update Pembayaran pada Kas ' + akun.coa_name,
                trx_date: req.date,
                nilai: req.paid_trx,
                dk: akun.dk,
                trx_paid: params.id
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

            /* START UPADATE TRX KAS */
            const sumPaidOnKas = await TrxKas.query().where( w => {
                w.where('aktif', 'Y')
                w.where('paid_id', '!=', dataBayarOld.id)
            }).getSum('saldo_rill') || 0

            const trxKas = new TrxKas()
            trxKas.fill({
                trx_date: req.date,
                kas_id: req.kas_id,
                paid_id: params.id,
                saldo_rill: parseFloat(req.paid_trx) + sumPaidOnKas,
                desc: 'Pembayaran ' + dataBayarOld.no_kwitansi
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
                saldo_rill: sumPaidOnKas + parseFloat(req.paid_trx)
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

        if(dataBayarOld.bank_id){
            const trxBank = await TrxBank.query().where( w => {
                w.where('paid_id', dataBayarOld.id)
                w.where('bank_id', dataBayarOld.bank_id)
            }).last()

            trxBank.merge({aktif: 'N'})
            try {
                await trxBank.save()
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed delete mutasi kas \n'+ JSON.stringify(error)
                }
            }
        }

        if(req.bank_id){
            const akun = await AccCoa.query().where('id', req.coa_id).last()
            const trxJurnalBank = await TrxJurnal.query().where( w => {
                w.where('trx_jual', updBayar.order_id)
                w.where('trx_paid', params.id)
                w.where('bank_id', dataBayarOld.bank_id)
            }).last()


            trxJurnalBank.merge({
                createdby: user.id,
                bank_id: req.bank_id,
                coa_id: req.coa_id,
                reff: dataBayarOld.no_kwitansi,
                narasi: '[ '+dataBayarOld.no_invoice+' ] ' + 'update Pembayaran pada Bank ' + akun.coa_name,
                trx_date: req.date,
                nilai: req.paid_trx,
                dk: akun.dk,
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
                paid_id: params.id,
                bank_id: req.bank_id,
                mutasi: dataBayarOld.no_kwitansi,
                trx_date: moment(req.date).format('YYYY-MM-DD'),
                saldo_net: req.isDelay ? 0 : parseFloat(req.paid_trx),
                setor_tunda: req.isDelay ? parseFloat(req.paid_trx) : 0,
                desc: 'Update Pembayaran ' + dataBayarOld.no_invoice
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
            
        }/* END INSERT DATA JURNAL KAS & BANK */

        /* ADITIONAL AKUN */
        if(req.akun){
            const coa = await AccCoa.query().where('id', req.akun).last()
            const additionalAkunJurnal = new TrxJurnal()
            additionalAkunJurnal.fill({
                cabang_id: ws.cabang_id,
                createdby: user.id,
                bank_id: req.bank_id,
                coa_id: req.akun,
                reff: dataBayarOld.no_kwitansi,
                narasi: '[ '+dataBayarOld.no_invoice+' ] ' + 'update additional pada ' + coa.coa_name,
                trx_date: req.date,
                nilai: req.akun_nilai,
                dk: coa.dk,
                trx_jual: dataBayarOld.order_id,
                trx_paid: params.id
            })

            try {
                await additionalAkunJurnal.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed insert additional akun \n'+ JSON.stringify(error)
                }
            }
        }

        await DB.table('keu_penerimaans').where('bayar_id', updBayar.id).update('aktif', 'N')

        /** INSERT DATA PADA PENERIMAAN KEUANGAN **/
        const keuPenerimaan = new KeuPenerimaan()
        try {
            keuPenerimaan.fill({
                author: user.id,
                cabang_id: ws.cabang_id,
                coa_debit: req.coa_id,
                trx_jual: dataOrderPelanggan.id,
                bayar_id: dataBayarOld.id,
                reff: dataBayarOld.no_kwitansi || null,
                trx_date: req.date,
                delay_trx: req.delay_date,
                is_delay: req.isDelay ? 'Y':'N',
                penerima: user.nama_lengkap,
                paidby: 'pelanggan',
                total: req.paid_trx,
                narasi: 'Penerimaan Cabang'
            })
            await keuPenerimaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed insert penerimaan keuangan \n'+ JSON.stringify(error)
            }
        }

        const keuPenerimaanItem = new KeuPenerimaanItem()
        try {
            keuPenerimaanItem.fill({
                keuterima_id: keuPenerimaan.id,
                cabang_id: ws.cabang_id,
                trx_jual: dataOrderPelanggan.id,
                pelanggan_id: dataOrderPelanggan.pelanggan_id,
                coa_kredit: '11005',
                description: 'Penerimaan Kasir ' + dataBayarOld.no_kwitansi,
                qty: 1,
                harga_stn: req.paid_trx,
                harga_total: req.paid_trx,
            })
            await keuPenerimaanItem.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed insert penerimaan keuangan item \n'+ JSON.stringify(error)
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success update pembayaran....'
        }
    }

    async DELETE (params, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)
        
        const paidment = await OpsPelangganBayar.query().where('id', params.id).last()
        const order = await OpsPelangganOrder.query().where('id', paidment.order_id).last()
        let kembaliRp = order.sisa_trx + paidment.paid_trx
        let status = kembaliRp === order.grandtot_trx ? 'ready':'dp'
        
        console.log("<STATUS NYA>", status);
        
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

        // /* RETURN STOK */
        // const isLastPayment = await OpsPelangganBayar.query().where( w => {
        //     w.where('order_id', paidment.order_id)
        //     w.where('aktif', 'Y')
        // }).getCount()
        // if(isLastPayment <= 1){
        //     const listBarang = (await OpsPelangganOrderItem.query().where('order_id', paidment.order_id).fetch()).toJSON()
        //     // console.log(listBarang);
        //     for (const brg of listBarang) {
        //         const barangLokasi = new BarangLokasi()
        //         barangLokasi.fill({
        //             trx_inv: brg.id,
        //             barang_id: brg.barang_id,
        //             gudang_id: brg.gudang_id,
        //             cabang_id: ws.cabang_id,
        //             qty_del: parseFloat(brg.qty),
        //             qty_hand: parseFloat(brg.qty),
        //             createdby: user.id
        //         })
        //         try {
        //             await barangLokasi.save(trx)
        //         } catch (error) {
        //             console.log(error);
        //             await trx.rollback()
        //             return {
        //                 success: false,
        //                 message: 'Failed update stok \n'+ JSON.stringify(error)
        //             }
        //         }
        //     }
        // }/* RETURN STOK */

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
            delPaiyment.merge({aktif: "N"})
            await delPaiyment.save(trx)
        } catch (error) {
            await trx.rollback()
            return {
                success: false,
                message: 'Failed delete data...'+JSON.stringify(error)
            }
        }

        const trxJurnal = (await TrxJurnal.query().where('trx_paid', params.id).fetch()).toJSON()
        for (const val of trxJurnal) {
            const updJurnal = await TrxJurnal.query().where('id', val.id).last()
            try {
                updJurnal.merge({aktif: "N"})
                await updJurnal.save(trx)
            } catch (error) {
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed rollback data jurnal...'
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

module.exports = new bayarPelanggan()

