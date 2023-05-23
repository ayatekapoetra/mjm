'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const SettBarang = use("App/Models/setting/SettRakBarang")

class settingOption {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        try {
            data = (
                await SettBarang
                .query()
                .with("barang", i => {
                    i.with('brand')
                    i.with('qualitas')
                    i.with('kategori')
                    i.with('subkategori')
                })
                .with("cabang")
                .with("gudang")
                .with("rack")
                .with("bin")
                .where( w => {
                    w.where('aktif', 'Y')
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.gudang_id){
                        w.where('gudang_id', req.gudang_id)
                    }
                    if(req.rack_id){
                        w.where('rack_id', req.rack_id)
                    }
                    if(req.bin_id){
                        w.where('bin_id', req.bin_id)
                    }
                    if(req.barang_id){
                        w.where('barang_id', req.barang_id)
                    }
                })
                // .orderBy([{column: 'group'}, {column: 'urut'}])
                .paginate(halaman, limit)
            ).toJSON()
        } catch (error) {
            console.log(error);
        }

        return data
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        
        const settBarang = new SettBarang()
        settBarang.fill({
            barang_id: req.barang_id,
            cabang_id: req.cabang_id,
            gudang_id: req.gudang_id,
            rack_id: req.rack_id,
            bin_id: req.bin_id,
            createdby: user.id
        })

        try {
            await settBarang.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save setting penempatan barang '+ JSON.stringify(error)
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
            await SettBarang
            .query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        console.log(req);
        const settBarang = await SettBarang.query().where('id', params.id).last()
        settBarang.merge({
            barang_id: req.barang_id,
            cabang_id: req.cabang_id,
            gudang_id: req.gudang_id,
            rack_id: req.rack_id,
            bin_id: req.bin_id,
            createdby: user.id
        })

        try {
            await settBarang.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save setting penempatan barang '+ JSON.stringify(error)
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params) {
        const settBarang = await SettBarang.query().where('id', params.id).last()
        try {
            settBarang.merge({aktif: "N"})
            await settBarang.save()
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

module.exports = new settingOption()