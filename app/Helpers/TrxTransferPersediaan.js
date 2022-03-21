'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const BarangLokasi = use("App/Models/BarangLokasi")
const TrxTransferPersediaan = use("App/Models/transaksi/TrxTransferPersediaan")
const TrxTransferPersediaanItem = use("App/Models/transaksi/TrxTransferPersediaanItem")

class transferKasBank {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await TrxTransferPersediaan
                .query()
                .with('bisnis')
                .with('cabang')
                .with('gudangFrom')
                .with('gudangTo')
                .with('items')
                .with('author')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.date_begin && req.date_end){
                        w.where('trx_date', '>=', req.date_begin)
                        w.where('trx_date', '<=', req.date_end)
                    }
                })
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await TrxTransferPersediaan
                .query()
                .with('bisnis')
                .with('cabang')
                .with('gudangFrom')
                .with('gudangTo')
                .with('items')
                .with('author')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                })
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        console.log(data);
        return data
    }

    async POST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        
        if(!req.trx_date){
            return {
                success: false,
                message: 'Tanggal Transaksi tidak boleh kosong...'
            }
        }

        if(!req.gudang_src){
            return {
                success: false,
                message: 'Gudang sumber barang harus di isi...'
            }
        }

        if(!req.gudang_target){
            return {
                success: false,
                message: 'Gudang tujuan barang harus di isi...'
            }
        }

        /** INSERT TRX ANTAR GUDANG **/
        const trxTransferPersediaan = new TrxTransferPersediaan()
        try {
            trxTransferPersediaan.fill({
                created_by: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                trx_date: req.trx_date,
                gudang_src: req.gudang_src,
                gudang_target: req.gudang_target,
                narasi: req.narasi
            })
            await trxTransferPersediaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data transfer gudang '+ JSON.stringify(error)
            }
        }

        for (const obj of req.items) {
            const trxTransferItem = new TrxTransferPersediaanItem()
            try {
                trxTransferItem.fill({
                    pindah_id: trxTransferPersediaan.id,
                    barang_id: obj.barang_id,
                    satuan: obj.satuan,
                    qty: obj.qty
                })

                await trxTransferItem.save(trx)

                const barangLokasiKredit = new BarangLokasi()
                barangLokasiKredit.fill({
                    trf_id: trxTransferItem.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id || null,
                    gudang_id: req.gudang_src,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty) * (-1),
                    createdby: user.id
                })

                await barangLokasiKredit.save(trx)

                const barangLokasiDebit = new BarangLokasi()
                barangLokasiDebit.fill({
                    trf_id: trxTransferItem.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id || null,
                    gudang_id: req.gudang_target,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty),
                    createdby: user.id
                })

                await barangLokasiDebit.save(trx)

            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
                }
            }

            try {
                await trxTransferItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
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
            await TrxTransferPersediaan
                .query()
                .with('bisnis')
                .with('cabang')
                .with('gudangFrom')
                .with('gudangTo')
                .with('items', w => w.with('barang'))
                .with('author')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        
        if(!req.trx_date){
            return {
                success: false,
                message: 'Tanggal Transaksi tidak boleh kosong...'
            }
        }

        if(!req.gudang_src){
            return {
                success: false,
                message: 'Gudang sumber barang harus di isi...'
            }
        }

        if(!req.gudang_target){
            return {
                success: false,
                message: 'Gudang tujuan barang harus di isi...'
            }
        }

        /** INSERT TRX ANTAR GUDANG **/
        const trxTransferPersediaan = await TrxTransferPersediaan.query().where('id', params.id).last()
        try {
            trxTransferPersediaan.merge({
                created_by: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                trx_date: req.trx_date,
                gudang_src: req.gudang_src,
                gudang_target: req.gudang_target,
                narasi: req.narasi
            })
            await trxTransferPersediaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data transfer gudang '+ JSON.stringify(error)
            }
        }

        await TrxTransferPersediaanItem.query().where('pindah_id', params.id).delete()

        for (const obj of req.items) {
            const trxTransferItem = new TrxTransferPersediaanItem()
            try {
                trxTransferItem.fill({
                    pindah_id: params.id,
                    barang_id: obj.barang_id,
                    satuan: obj.satuan,
                    qty: obj.qty
                })

                await trxTransferItem.save(trx)

                const barangLokasiKredit = new BarangLokasi()
                barangLokasiKredit.fill({
                    trf_id: trxTransferItem.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id || null,
                    gudang_id: req.gudang_src,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty) * (-1),
                    createdby: user.id
                })

                await barangLokasiKredit.save(trx)

                const barangLokasiDebit = new BarangLokasi()
                barangLokasiDebit.fill({
                    trf_id: trxTransferItem.id,
                    bisnis_id: ws.bisnis_id,
                    cabang_id: req.cabang_id || null,
                    gudang_id: req.gudang_target,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty),
                    createdby: user.id
                })

                await barangLokasiDebit.save(trx)

            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
                }
            }

            try {
                await trxTransferItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
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
            await TrxTransferPersediaan.query().where('id', params.id).delete()
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

module.exports = new transferKasBank()