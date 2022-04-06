'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Brand = use("App/Models/master/Brand")

class masterRack {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        try {
            data = (
                await Brand
                .query()
                .where( w => {
                    if(req.kode){
                        w.where('kode', req.kode)
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
        
        const brand = new Brand()
        brand.fill({
            kode: req.kode,
            nama: req.nama,
            keterangan: req.keterangan
        })

        try {
            await brand.save(trx)
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
            await Brand
            .query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        console.log(req);
        const brand = await Brand.query().where('id', params.id).last()
        brand.merge({
            kode: req.kode,
            nama: req.nama,
            keterangan: req.keterangan
        })

        try {
            await brand.save(trx)
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
            await Brand.query().where('id', params.id).delete()
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