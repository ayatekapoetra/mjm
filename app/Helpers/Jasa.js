'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Jasa = use("App/Models/master/Jasa")

class masterJasa {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        // const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await Jasa
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
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Jasa
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

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        
        const jasa = new Jasa()
        jasa.fill({
            cabang_id: req.cabang_id,
            kode: req.kode,
            nama: req.nama,
            narasi: req.narasi || '',
            biaya: req.biaya || 0.00,
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

    async SHOW (params) {
        const data = (
            await Jasa
            .query()
            .with('cabang')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
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

module.exports = new masterJasa()