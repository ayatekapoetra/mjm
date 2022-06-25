'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Cabang = use("App/Models/master/Cabang")

class masterCabang {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        if(req.keyword){
            data = (
                await Cabang
                .query()
                .with('gudang', r => r.with('rack', b => b.with('bin')))
                .where( w => {
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.nama){
                        w.where('nama', 'like', `%${req.nama}%`)
                    }
                    if(req.email){
                        w.where('email', 'like', `%${req.email}%`)
                    }
                    if(req.alamat){
                        w.where('alamat', 'like', `%${req.alamat}%`)
                    }
                    if(req.phone){
                        w.where('phone', req.phone)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Cabang
                .query()
                .with('gudang', r => r.with('rack', b => b.with('bin')))
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
        
        const cabang = new Cabang()
        cabang.fill({
            kode: req.kode,
            nama: req.nama,
            tipe: req.tipe,
            phone: req.phone || null,
            email: req.email || null,
            alamat: req.alamat || null,
            createdby: user.id
        })

        try {
            await cabang.save(trx)
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
            await Cabang
            .query()
            .with('gudang', r => r.with('rack', b => b.with('bin')))
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        // console.log(req);
        const cabang = await Cabang.query().where('id', params.id).last()
        cabang.merge({
            kode: req.kode,
            nama: req.nama,
            tipe: req.tipe,
            phone: req.phone,
            email: req.email,
            alamat: req.alamat,
            createdby: user.id
        })

        try {
            await cabang.save(trx)
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
            await Cabang.query().where('id', params.id).delete()
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

module.exports = new masterCabang()