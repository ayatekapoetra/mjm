'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const BisnisUnit = use("App/Models/BisnisUnit")
const LampiranFile = use("App/Models/LampiranFile")
const BarangLokasi = use("App/Models/BarangLokasi")
const TrxOrderBeli = use("App/Models/transaksi/TrxOrderBeli")
const TrxTerimaBarang = use("App/Models/transaksi/TrxTerimaBarang")
const TrxOrderBeliItem = use("App/Models/transaksi/TrxOrderBeliItem")
const TrxTerimaBarangItem = use("App/Models/transaksi/TrxTerimaBarangItem")

class terimaBarang {
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
                w.where('bisnis_id', ws.bisnis_id)
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
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const kode = await initFunc.GEN_KODE_TERIMA_BRG(ws.bisnis_id)

        try {
            const trxTerimaBarang = new TrxTerimaBarang()
            trxTerimaBarang.fill({
                bisnis_id: ws.bisnis_id,
                ro_id: req.ro_id,
                reff_fb: req.reff_fb || null,
                reff_ro: req.reff_ro || null,
                reff_rcp: req.reff_rcp ? req.reff_rcp : kode,
                pemasok_id: req.pemasok_id || null,
                gudang_id: req.gudang_id,
                narasi: req.narasi,
                received_at: req.received_at || null
            })

            await trxTerimaBarang.save()

            
            for (const obj of req.items) {
                const trxTerimaBarangItem = new TrxTerimaBarangItem()
                trxTerimaBarangItem.fill({
                    trx_terima: trxTerimaBarang.id,
                    barang_id: obj.barang_id,
                    description: obj.description,
                    qty: obj.qty
                })

                await trxTerimaBarangItem.save()
            }
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

    async SHOW (params) {
        const data = (
            await TrxTerimaBarang
            .query()
            .with('items')
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async PRINT (params) {
        const data = (
            await TrxTerimaBarang
            .query()
            .with('bisnis')
            .with('pemasok')
            .with('gudang')
            .with('items', w => {
                w.with('barang')
            })
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async UPDATE (params, req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()
        const trxTerimaBarang = await TrxTerimaBarang.query(trx).where('id', params.id).last()
        try {
            trxTerimaBarang.merge({
                receivedby: user.id,
                received_at: req.received_at,
                reff_rcp: req.reff_rcp,
                narasi: req.description
            })
            await trxTerimaBarang.save(trx)
            console.log('trxTerimaBarang ::', trxTerimaBarang.toJSON());
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                messsage: 'Failed save terima barang...'+JSON.stringify(error)
            }
        }

        for (const obj of req.items) {
            const barangLokasi = await BarangLokasi.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('ro_id', trxTerimaBarang.ro_id)
                w.where('gudang_id', req.gudang_id)
                w.where('barang_id', obj.barang_id)
                w.where('qty_rec', obj.qty)
            }).last()

            console.log(barangLokasi.toJSON());
            if(!barangLokasi){
                await trx.rollback()
                return {
                    success: false,
                    messsage: 'Terima barang item tdk ditemukan purchasing ordernya...'
                }
            }

            const newBarangLokasi = new BarangLokasi()
            newBarangLokasi.fill({
                ro_id: trxTerimaBarang.ro_id,
                bisnis_id: ws.bisnis_id,
                cabang_id: barangLokasi.cabang_id,
                gudang_id: barangLokasi.gudang_id,
                barang_id: barangLokasi.barang_id,
                qty_hand: parseInt(obj.qty),
                qty_rec: parseInt(obj.qty) * (-1),
                createdby: user.id
            })
            try {
                await newBarangLokasi.save(trx)
                console.log('newBarangLokasi ::', newBarangLokasi.toJSON());
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    messsage: 'Failed save terima barang...'+JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            messsage: 'Success save data...'
        }
    }
}

module.exports = new terimaBarang()

