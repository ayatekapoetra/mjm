'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const Jasa = use("App/Models/master/Jasa")
const initFunc = use("App/Helpers/initFunc")
const SysConfig = use("App/Models/SysConfig")
const VBarangStok = use("App/Models/VBarangStok")
const BarangLokasi = use("App/Models/BarangLokasi")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")
const OpsPelangganOrderItem = use("App/Models/operational/OpsPelangganOrderItem")
const OpsPelangganOrderService = use("App/Models/operational/OpsPelangganOrderService")

class orderPelanggan {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        // const ws = await initFunc.GET_WORKSPACE(user.id)
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
                .where('status', '!=', 'lunas')
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }
        return data
    }

    async SHOW (params) {
        console.log('xxxx');
        const data = (
            await OpsPelangganOrder.query()
            .with('cabang')
            .with('pelanggan')
            .with('author')
            .with('items', b => b.with('barang'))
            .with('jasa', j => j.with('jasa'))
            .where('id', params.id).last()
            ).toJSON()

        return data
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)

        const taxDefault = (await SysConfig.query().select('pajak').last()).toJSON()
        const sumBarang = req.items.reduce((a, b) => {return a + (parseFloat(b.qty) * parseFloat(b.hargaJual))}, 0)
        const sumJasa = req.jasa.reduce((a, b) => {return a + (parseFloat(b.qty) * parseFloat(b.biaya))}, 0)
        const totalTransaksi = parseFloat(sumBarang) + parseFloat(sumJasa)
        // const pajak_rp = (totalTransaksi * parseFloat(taxDefault.pajak)) / 100

        const order = new OpsPelangganOrder()
        order.fill({
            kdpesanan: req.kode,
            cabang_id: ws.cabang_id,
            pelanggan_id: req.pelanggan_id,
            date: req.date,
            narasi: req.narasi,
            tot_order: sumBarang,
            tot_service: sumJasa,
            total_trx: totalTransaksi,
            grandtot_trx: totalTransaksi,
            sisa_trx: totalTransaksi,
            createdby: user.id,
            status: 'pending',
        })

        try {
            await order.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save Order \n'+ JSON.stringify(error)
            }
        }
        
        for (const obj of req.items) {
            const itemBarang = new OpsPelangganOrderItem()
            itemBarang.fill({
                order_id: order.id,
                gudang_id: req.gudang_id,
                barang_id: obj.barang_id,
                qty: obj.qty,
                harga: obj.hargaJual,
                total: parseFloat(obj.qty) * parseFloat(obj.hargaJual)
            })
            try {
                await itemBarang.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Order Barang'+ JSON.stringify(error)
                }
            }

            /* CHECK JUMLAH BARANG & LOKASI BARANG */
            try {
                const barangStok = await VBarangStok.query().where( w => {
                    w.where('id', obj.barang_id)
                    w.where('cabang_id', ws.cabang_id)
                    w.where('gudang_id', req.gudang_id)
                }).last()

                /* JIKA TIDAK DITEMUKAN BARANGNYA */
                if(!barangStok){
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Barang tidak ditemukan di gudang ini...'
                    }
                }

                /* JIKA TIDAK CUKUP STOK BARANGNYA */
                if(barangStok.brg_hand < parseInt(obj.qty)){
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Jumlah Barang tidak cukup di gudang ini...'
                    }
                }
                
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'xxx..'+JSON.stringify(error)
                }
            }

            const barangLokasi = new BarangLokasi()
            barangLokasi.fill({
                trx_inv: itemBarang.id,
                barang_id: obj.barang_id,
                gudang_id: req.gudang_id,
                cabang_id: ws.cabang_id,
                qty_del: parseInt(obj.qty),
                qty_hand: 0,
                qty_own: 0,
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

        for (const obj of req.jasa) {
            
            const biayaJasa = new OpsPelangganOrderService()
            biayaJasa.fill({
                order_id: order.id,
                jasa_id: obj.jasa_id,
                qty: obj.qty,
                harga: obj.biaya,
                total: parseFloat(obj.qty) * parseFloat(obj.biaya)
            })
            try {
                await biayaJasa.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Order Jasa'+ JSON.stringify(error)
                }
                
            }
        }


        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)

        const trxBarang = TotFields(req.items, 'totalJual')
        const trxJasa = TotFields(req.jasa, 'totalBiaya')
        const trxTotal = TotFields(req.items, 'totalJual') + TotFields(req.jasa, 'totalBiaya')

        const order = await OpsPelangganOrder.query().where( w => {
            w.where('id', params.id)
            w.where('status', 'pending')
        }).last()

        if(!order){
            return {
                success: false,
                message: 'Data status tidak memungkinkan untuk dilakukan update oleh Customer Service...'
            }
        }

        order.merge({
            pelanggan_id: req.pelanggan_id,
            date: req.date,
            narasi: req.narasi,
            tot_order: trxBarang,
            tot_service: trxJasa,
            total_trx: trxTotal,
            grandtot_trx: trxTotal,
            sisa_trx: trxTotal,
            createdby: user.id,
            status: 'pending',
        })

        try {
            await order.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save Order \n'+ JSON.stringify(error)
            }
        }

        /* VALIDASI ORDER BARANG */

        for (const obj of req.items) {

            /* CHECK JUMLAH BARANG & LOKASI BARANG */
            const barangStok = await VBarangStok.query().where( w => {
                w.where('id', obj.barang_id)
                w.where('gudang_id', req.gudang_id)
            }).last()

            /* JIKA TIDAK DITEMUKAN BARANGNYA */
            if(!barangStok){
                await trx.rollback()
                return {
                    success: false,
                    message: 'Barang tidak ditemukan di gudang ini...'
                }
            }

            /* JIKA TIDAK CUKUP STOK BARANGNYA */
            if(barangStok.brg_hand < parseInt(obj.qty)){
                await trx.rollback()
                return {
                    success: false,
                    message: 'Jumlah Barang tidak cukup di gudang ini...'
                }
            }
        }

        /* UPDATE ORDER BARANG */

        await DB.table('ord_pelanggan_items').where('order_id', params.id).delete()

        for (const obj of req.items) {

            const opsPelangganOrderItem = new OpsPelangganOrderItem()
            opsPelangganOrderItem.fill({
                order_id: params.id,
                gudang_id: req.gudang_id,
                barang_id: obj.barang_id,
                qty: obj.qty,
                harga: obj.hargaJual,
                total: parseFloat(obj.qty) * parseFloat(obj.hargaJual)
            })

            try {
                await opsPelangganOrderItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Order Barang \n'+ JSON.stringify(error)
                }
            }

            const barangLokasi = new BarangLokasi()
            barangLokasi.fill({
                trx_inv: opsPelangganOrderItem.id,
                barang_id: obj.barang_id,
                gudang_id: req.gudang_id,
                cabang_id: ws.cabang_id,
                qty_del: parseInt(obj.qty),
                qty_hand: 0,
                qty_own: 0,
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

        /* UPDATE ORDER JASA */

        await DB.table('ord_pelanggan_services').where('order_id', params.id).delete()

        for (const obj of req.jasa) {

            const opsPelangganOrderJasa = new OpsPelangganOrderService()
            opsPelangganOrderJasa.fill({
                order_id: params.id,
                jasa_id: obj.jasa_id,
                qty: obj.qty,
                harga: obj.biaya,
                total: parseFloat(obj.qty) * parseFloat(obj.biaya)
            })

            try {
                await opsPelangganOrderJasa.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Order Barang \n'+ JSON.stringify(error)
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
            await OpsPelangganOrder.query().where('id', params.id).delete()
            return {
                success: true,
                message: 'Success delete data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed delete data...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new orderPelanggan()

function TotFields(arr, values){
    if (values) {
        return arr.reduce((a, b) => { return a + parseFloat(b[values])}, 0)
    } else {
        return arr.reduce((a, b) => { return a + parseFloat(b)}, 0)
    }
}