'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Karyawan = use("App/Models/master/Karyawan")

class masterGudang {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await Karyawan
                .query()
                .with('cabang')
                .with('dept')
                .where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.department_id){
                        w.where('department_id', req.department_id)
                    }
                    if(req.sts_karyawan){
                        w.where('sts_karyawan', req.sts_karyawan)
                    }
                    if(req.phone){
                        w.where('phone', 'like', `%${req.phone}%`)
                    }
                    if(req.nama){
                        w.where('nama', 'like', `%${req.nama}%`)
                    }
                    if(req.is_internal){
                        w.where('is_internal', req.is_internal)
                    }
                    if(req.start_date && req.end_date){
                        w.where('tgl_gabung', '>=', req.start_date)
                        w.where('tgl_gabung', '<=', req.end_date)
                    }
                })
                .orderBy('nik', 'asc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Karyawan
                .query()
                .with('bisnis')
                .with('cabang')
                .with('dept')
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
        const nik = await initFunc.GEN_NIK_KARYAWAN(req)
        const karyawan = new Karyawan()
        karyawan.fill({
            cabang_id: req.cabang_id,
            department_id: req.department_id,
            nik: nik,
            nama: req.nama,
            jenkel: req.jenkel,
            email: req.email,
            phone: req.phone,
            t4_lahir: req.t4_lahir,
            tgl_lahir: req.tgl_lahir,
            tgl_gabung: req.tgl_gabung,
            tgl_expired: req.tgl_expired,
            sts_karyawan: req.sts_karyawan,
            sts_nikah: req.sts_nikah,
            alamat: req.alamat,
            user_id: user.id
        })

        try {
            await karyawan.save(trx)
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
            await Karyawan
            .query()
            .with('bisnis')
            .with('cabang')
            .with('dept')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        const nik = await initFunc.GEN_NIK_KARYAWAN(req)
        const karyawan = await Karyawan.query().where('id', params.id).last()
        karyawan.merge({
            cabang_id: req.cabang_id,
            department_id: req.department_id,
            nik: nik,
            nama: req.nama,
            jenkel: req.jenkel,
            email: req.email,
            phone: req.phone,
            t4_lahir: req.t4_lahir,
            tgl_lahir: req.tgl_lahir,
            tgl_gabung: req.tgl_gabung,
            tgl_expired: req.tgl_expired,
            sts_karyawan: req.sts_karyawan,
            sts_nikah: req.sts_nikah,
            alamat: req.alamat,
            user_id: user.id
        })

        try {
            await karyawan.save(trx)
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
            await Karyawan.query().where('id', params.id).delete()
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