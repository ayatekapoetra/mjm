'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const BarangLokasi = use("App/Models/BarangLokasi")
const Opname = use("App/Models/logistik/LogistikStokOpname")
const OpnameItems = use("App/Models/logistik/LogistikStokOpnameItem")

class stokOpname {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.WORKSPACE(user)
        try {
            const data = (
                await Opname
                .query()
                .with('cabang')
                .with('gudang')
                .with('items')
                .where( w => {
                    w.where('aktif', 'Y')
                    if(req.kode_opname){
                        w.where('kode_opname', 'like', `${req.kode_opname}%`)
                    }
                    if(req.keterangan){
                        w.where('keterangan', 'like', `%${req.keterangan}%`)
                    }
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.gudang_id){
                        w.where('gudang_id', req.gudang_id)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
    
            return data
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async POST (req, user, attach) {
        const trx = await DB.beginTransaction()
        const ws = await initFunc.WORKSPACE(user)
        const kode = await initFunc.GEN_KODE_TERIMA_BRG(user.cabang_id)
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = (
            await TrxTerimaBarang
            .query()
            .with('cabang')
            .with('gudang')
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
            .with('cabang')
            .with('gudang')
            .with('items', w => {
                w.with('barang')
            })
            .where('id', params.id)
            .last()
        ).toJSON()
        console.log(data);
        return data
    }

    async DELETE (params) {
        const trx = await DB.beginTransaction()
        
        return {
            success: true,
            messsage: 'Success save data...'
        }
    }
}

module.exports = new stokOpname()

