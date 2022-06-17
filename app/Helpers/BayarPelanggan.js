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
const OpsPelangganBayar = use("App/Models/operational/OpsPelangganBayar")

class bayarPelanggan {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        // const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await OpsPelangganBayar
                .query()
                .with('cabang')
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
                await OpsPelangganBayar
                .query()
                .with('cabang')
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }
        console.log('LIST :::', data);
        return data
    }

    async SHOW (params) {
        const data = (
            await OpsPelangganBayar.query()
            .with('cabang')
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
        const pajak_rp = (totalTransaksi * parseFloat(taxDefault.pajak)) / 100

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
            pajak_trx: pajak_rp,
            grandtot_trx: totalTransaksi + pajak_rp,
            sisa_trx: totalTransaksi + pajak_rp,
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
                message: 'Failed save Order '+ JSON.stringify(error)
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
                        message: 'Barang tidak ditemukan gudang ini...'
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
                qty_hand: parseInt(obj.qty) * -1,
                qty_own: parseInt(obj.qty) * -1,
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
        // console.log(req);
        const jasa = await Jasa.query().where('id', params.id).last()
        jasa.merge({
            cabang_id: req.cabang_id,
            kode: req.kode,
            nama: req.nama,
            narasi: req.narasi || '',
            biaya: req.biaya,
            createdby: user.id
        })

        try {
            await jasa.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save cabang '+ JSON.stringify(error)
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
            await Jasa.query().where('id', params.id).delete()
            return {
                success: true,
                message: 'Success delete data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Success delete data...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new bayarPelanggan()