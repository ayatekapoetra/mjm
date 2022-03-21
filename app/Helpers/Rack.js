'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Rack = use("App/Models/master/Rack")
const BarangRack = use("App/Models/BarangRack")

class masterRack {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        try {
            data = (
                await Rack
                .query()
                .with('cabang')
                .with('gudang')
                .where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.gudang_id){
                        w.where('gudang_id', req.gudang_id)
                    }
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.nama){
                        w.where('nama', 'like', `%${req.nama}%`)
                    }
                    if(req.keterangan){
                        w.where('keterangan', 'like', `%${req.keterangan}%`)
                    }
                })
                .orderBy('kode', 'asc')
                .paginate(halaman, limit)
            ).toJSON()
        } catch (error) {
            console.log(error);
        }

        return data
    }

    async POST (req, user, filex) {
        const trx = await DB.beginTransaction()
        
        const rack = new Rack()
        rack.fill({
            cabang_id: req.cabang_id,
            gudang_id: req.gudang_id,
            kode: req.kode,
            nama: req.nama,
            keterangan: req.keterangan || null,
            user_id: user.id
        })

        try {
            await rack.save(trx)
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
            await Rack
            .query()
            .with('cabang')
            .with('gudang')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        console.log(req);
        const rack = await Rack.query().where('id', params.id).last()
        rack.merge({
            cabang_id: req.cabang_id,
            gudang_id: req.gudang_id,
            kode: req.kode,
            nama: req.nama,
            keterangan: req.keterangan,
            user_id: user.id
        })

        try {
            await rack.save(trx)
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

module.exports = new masterRack()