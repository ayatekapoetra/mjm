'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const BarangLokasi = use("App/Models/BarangLokasi")
const TrxOrderBeli = use("App/Models/transaksi/TrxOrderBeli")
// const TrxTerimaBarang = use("App/Models/transaksi/TrxTerimaBarang")
const TrxOrderBeliItem = use("App/Models/transaksi/TrxOrderBeliItem")
// const TrxTerimaBarangItem = use("App/Models/transaksi/TrxTerimaBarangItem")

class stok {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const data = (
            await TrxTerimaBarang
            .query()
            .with('pemasok')
            .with('gudang')
            .with('reqOrder', a => a.with('files'))
            .where( w => {
                if(req.reff_ro){
                    w.where('reff_ro', 'like', `${req.reff_ro}%`)
                }
                if(req.reff_rcp){
                    w.where('reff_ro', 'like', `${req.reff_rcp}%`)
                }
                if(req.narasi){
                    w.where('reff_ro', 'like', `${req.narasi}%`)
                }
                if(req.pemasok_id){
                    w.where('reff_ro', req.pemasok_id)
                }
                if(req.gudang_id){
                    w.where('reff_ro', req.gudang_id)
                }
            })
            .orderBy('created_at', 'desc')
            .paginate(halaman, limit)
        ).toJSON()

        return data
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.GET_WORKSPACE(user.id)

        try {
            const isReqOrder = await TrxOrderBeli.query().where( w => {
                w.where('gudang_id', req.gudang_id)
                w.where('kode', req.kode)
            }).last()
            
            if(isReqOrder){
                
                for (const obj of req.items) {
                    
                    const itemOrder = await TrxOrderBeliItem.query().where( w => {
                        w.where('ro_id', isReqOrder.id)
                        // w.where('bisnis_id', ws.bisnis_id)
                        // w.where('gudang_id', req.gudang_id)
                        w.where('barang_id', obj.barang_id)
                    }).last()

                    console.log('cccc', itemOrder.toJSON());

                    /** GET INITIAL QTY BARANG **/
                    let barang = await BarangLokasi.query().where( w => {
                        w.where('ro_id', isReqOrder.id)
                        w.where('bisnis_id', ws.bisnis_id)
                        w.where('gudang_id', req.gudang_id)
                        w.where('barang_id', obj.barang_id)
                    }).last()

                    /** UPDATE DATA BARANG **/
                    if(itemOrder){
                        const newQtyOnHand = parseFloat(barang.qty_hand) + parseFloat(barang.qty_rec)
                        const newQtyReceived = parseFloat(barang.qty_rec) - parseFloat(obj.qty)
                        const newQtyOwn = parseFloat(newQtyOnHand) - parseFloat(newQtyReceived)
                        const newData = {
                            qty_hand: newQtyOnHand,
                            qty_rec: newQtyReceived,
                            qty_own: newQtyOwn,
                            createdby: user.id
                        }
                        try {
                            barang.merge(newData)
                            await barang.save(trx)
                        } catch (error) {
                            await trx.rollback()
                            const brg = await Barang.find(obj.barang_id)
                            return {
                                success: false,
                                message: 'Jumlah barang ' + brg.nama + ' tidak sesuai pesanan...'
                            }
                        }
                    }else{
                        await trx.rollback()
                        const brg = await Barang.find(obj.barang_id)
                        return {
                            success: false,
                            message: 'Item barang ' + brg.nama + ' tidak dipesanan...'
                        }
                    }
                }
            }else{
                /** TAMBAH JUMLAH BARANG PADA LOKASI PENYIMPANAN **/
                for (const obj of req.items) {
                    const gudang = await Gudang.query().with('cabang').where('id', req.gudang_id).last()
                    // console.log(gudang.toJSON());
                    const newBarang = new BarangLokasi()
                    newBarang.fill({
                        bisnis_id: ws.bisnis_id,
                        cabang_id: gudang.cabang_id,
                        gudang_id: req.gudang_id,
                        barang_id: obj.barang_id,
                        qty_hand: obj.qty,
                        qty_rec: 0,
                        qty_own: obj.qty,
                        createdby: user.id
                    })
                    try {
                        await newBarang.save(trx)
                    } catch (error) {
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save barang '+JSON.stringify(error)
                        }
                    }
                }
            }

            await trx.commit()
            return {
                success: true,
                message: 'Success save data...'
            }
            
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed operation...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new stok()