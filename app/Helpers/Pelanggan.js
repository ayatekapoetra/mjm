'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Pelanggan = use("App/Models/master/Pelanggan")

class masterPelanggan {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await Pelanggan
                .query()
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
                    if(req.phone){
                        w.where('phone', 'like', `%${req.phone}%`)
                    }
                    if(req.alamat_kirim){
                        w.where('alamat_kirim', 'like', `%${req.alamat_kirim}%`)
                    }
                    if(req.alamat_tagih){
                        w.where('alamat_tagih', 'like', `%${req.alamat_tagih}%`)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Pelanggan
                .query()
                .with('bisnis')
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
        const kode = await initFunc.GEN_KODE_PELANGGAN('post')
        
        const pelanggan = new Pelanggan()
        pelanggan.fill({
            kode: kode,
            nama: req.nama,
            phone: req.phone || null,
            email: req.email || null,
            alamat_tagih: req.alamat_tagih || null,
            alamat_kirim: req.alamat_kirim || null,
            limit_pagu: req.limit_pagu,
            user_id: user.id
        })

        try {
            await pelanggan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pelanggan '+ JSON.stringify(error)
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
            await Pelanggan
            .query()
            .with('bisnis')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        const kode = await initFunc.GEN_KODE_PELANGGAN('post')
        // console.log(req);
        const pelanggan = await Pelanggan.query().where('id', params.id).last()
        pelanggan.merge({
            kode: kode,
            nama: req.nama,
            phone: req.phone || null,
            email: req.email || null,
            alamat_tagih: req.alamat_tagih || null,
            alamat_kirim: req.alamat_kirim || null,
            limit_pagu: req.limit_pagu,
            user_id: user.id
        })

        try {
            await pelanggan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pelanggan '+ JSON.stringify(error)
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
            await Pelanggan.query().where('id', params.id).delete()
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

module.exports = new masterPelanggan()