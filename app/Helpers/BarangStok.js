'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const VBarang = use("App/Models/VBarangStok")

class barangStok {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        // const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await VBarang
                .query()
                .where( w => {
                    if(req.gudang_id){
                        w.where('gudang_id', req.gudang_id)
                    }
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.kd_barang){
                        w.where('kd_barang', 'like', `%${req.kd_barang}%`)
                    }
                })
                .orderBy('kd_barang')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await VBarang
                .query()
                .orderBy('kd_barang')
                .paginate(halaman, limit)
            ).toJSON()
        }

        

        console.log(data);
        return data
    }

    

    async SHOW (params) {
        console.log(params);
        const data = (
            await VBarang
            .query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    
}

module.exports = new barangStok()