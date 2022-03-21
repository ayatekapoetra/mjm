'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Pemasok = use("App/Models/master/Pemasok")

class masterPemasok {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await Pemasok
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
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Pemasok
                .query()
                .with('cabang')
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async POST (req, user, filex) {
        const trx = await DB.beginTransaction()
        
        const kode = await initFunc.GEN_KODE_PEMASOK('post')
        const pemasok = new Pemasok()
        pemasok.fill({
            cabang_id: req.cabang_id,
            kode: kode,
            nama: req.nama,
            phone: req.phone || null,
            email: req.email || null,
            alamat: req.alamat || null,
            user_id: user.id
        })

        try {
            await pemasok.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pemasok '+ JSON.stringify(error)
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
            await Pemasok
            .query()
            .with('cabang')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()

        const kode = await initFunc.GEN_KODE_PEMASOK('update')
        // console.log(req);
        const pemasok = await Pemasok.query().where('id', params.id).last()
        pemasok.merge({
            cabang_id: req.cabang_id,
            kode: kode,
            nama: req.nama,
            phone: req.phone,
            email: req.email,
            alamat: req.alamat,
            user_id: user.id
        })

        try {
            await pemasok.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pemasok '+ JSON.stringify(error)
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
            await Pemasok.query().where('id', params.id).delete()
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

module.exports = new masterPemasok()