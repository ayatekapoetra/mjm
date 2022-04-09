'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Gudang = use("App/Models/master/Gudang")
const BarangRack = use("App/Models/BarangRack")

class masterGudang {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await Gudang
                .query()
                .with('cabang')
                .where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.nama){
                        w.where('nama', 'like', `%${req.nama}%`)
                    }
                    if(req.email){
                        w.where('email', 'like', `%${req.email}%`)
                    }
                    if(req.phone){
                        w.where('phone', 'like', `%${req.phone}%`)
                    }
                    if(req.alamat){
                        w.where('alamat', 'like', `%${req.alamat}%`)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Gudang
                .query()
                .with('cabang')
                .where( w => {
                    w.where('aktif', 'Y')
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async POST (req, user, filex) {
        const trx = await DB.beginTransaction()
        
        const gudang = new Gudang()
        gudang.fill({
            cabang_id: req.cabang_id,
            kode: req.kode,
            nama: req.nama,
            phone: req.phone || null,
            email: req.email || null,
            alamat: req.alamat || null,
            createdby: user.id
        })

        try {
            await gudang.save(trx)
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

    async SHOW (params) {
        const data = (
            await Gudang
            .query()
            .with('bisnis')
            .with('cabang')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        // console.log(req);
        const gudang = await Gudang.query().where('id', params.id).last()
        gudang.merge({
            cabang_id: req.cabang_id,
            kode: req.kode,
            nama: req.nama,
            phone: req.phone,
            email: req.email,
            alamat: req.alamat,
            createdby: user.id
        })

        try {
            await gudang.save(trx)
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
            await Gudang.query().where('id', params.id).delete()
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

module.exports = new masterGudang()