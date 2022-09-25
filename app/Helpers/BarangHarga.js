'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const HargaBeli = use("App/Models/master/HargaBeli")
const HargaJual = use("App/Models/master/HargaJual")
const BarangHarga = use("App/Models/VBarangHarga")

class masterBarang {
    async LIST (req, user) {
        const limit = req.limit || 100;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.WORKSPACE(user)
        try {
            console.log(req);
            const hargaBeli = (
                await HargaBeli
                .query()
                .with('barang')
                .with('gudang')
                .where( w => {
                    w.where('cabang_id', ws.cabang_id)
                    if(req.barang_id && req.tipe === 'hargaBeli'){
                        w.where('barang_id', req.barang_id)
                    }
                    if(req.gudang_id && req.tipe === 'hargaBeli'){
                        w.where('gudang_id', req.gudang_id)
                    }
                    if(req.periode && req.tipe === 'hargaBeli'){
                        w.where('periode', req.periode)
                    }
                    if(req.narasi && req.tipe === 'hargaBeli'){
                        w.where('narasi', 'like', `%${req.narasi}%`)
                    }
                })
                .orderBy('periode', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
    
            const hargaJual = (
                await HargaJual
                .query()
                .with('barang')
                .with('gudang')
                .where( w => {
                    w.where('cabang_id', ws.cabang_id)
                    if(req.barang_id && req.tipe === 'hargaJual'){
                        w.where('barang_id', req.barang_id)
                    }
                    if(req.gudang_id && req.tipe === 'hargaJual'){
                        w.where('gudang_id', req.gudang_id)
                    }
                    if(req.periode && req.tipe === 'hargaJual'){
                        w.where('periode', req.periode)
                    }
                    if(req.narasi && req.tipe === 'hargaJual'){
                        w.where('narasi', 'like', `%${req.narasi}%`)
                    }
                })
                .orderBy('periode', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
    
            return {
                hargaBeli: hargaBeli,
                hargaJual: hargaJual
            }
        } catch (error) {
            console.log(error);
            return
        }
    }

    async POST (req, user) {
        const ws = await initFunc.WORKSPACE(user)
        const trx = await DB.beginTransaction()

        if(!req.barang_id){
            return {
                success: false,
                message: 'Barang harus ditentukan... '
            }
        }
        
        if(req.harga_beli && parseFloat(req.harga_beli) > 0){
            const hargaBeli = new HargaBeli()
            hargaBeli.fill({
                barang_id: req.barang_id,
                cabang_id: ws.cabang_id,
                gudang_id: req.gudang_id || null,
                periode: moment(req.periode).format('YYYY-MM'),
                narasi: req.narasi,
                harga_beli: req.harga_beli,
                created_by: user.id
            })
    
            try {
                await hargaBeli.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save harga beli '+ JSON.stringify(error)
                }
            }
        }

        if(req.harga_jual && parseFloat(req.harga_jual) > 0){
            const hargaJual = new HargaJual()
            hargaJual.fill({
                barang_id: req.barang_id,
                cabang_id: ws.cabang_id,
                gudang_id: req.gudang_id || null,
                periode: moment(req.periode).format('YYYY-MM'),
                narasi: req.narasi,
                harga_jual: req.harga_jual,
                created_by: user.id
            })
    
            try {
                await hargaJual.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save harga jual '+ JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params, req) {
        let data
        if(req.type === 'hargaBeli'){
            data = (
                await HargaBeli
                .query()
                .with('barang')
                .with('gudang')
                .where('id', params.id)
                .last()
            ).toJSON()
            
        }else{
            data = (
                await HargaJual
                .query()
                .with('barang')
                .with('gudang')
                .where('id', params.id)
                .last()
            ).toJSON()
        }
        console.log('SHOW :::', data);
        return data
    }

    async UPDATE (params, req) {
        const trx = await DB.beginTransaction()

        if (req.type === 'hargaBeli') {
            const hargaBeli = await HargaBeli.query().where('id', params.id).last()
            hargaBeli.merge({
                barang_id: req.barang_id,
                gudang_id: req.gudang_id,
                periode: req.periode || moment().format('YYYY-MM'),
                narasi: req.narasi,
                harga_beli: req.harga_beli
            })
            try {
                await hargaBeli.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save harga barang '+ JSON.stringify(error)
                }
            }
        } else {
            const hargaJual = await HargaJual.query().where('id', params.id).last()
            hargaJual.merge({
                barang_id: req.barang_id,
                gudang_id: req.gudang_id,
                periode: req.periode || moment().format('YYYY-MM'),
                narasi: req.narasi,
                harga_jual: req.harga_jual
            })
            try {
                await hargaJual.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save harga barang '+ JSON.stringify(error)
                }
            }
        }


        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params) {
        console.log(params);
        if(params.tipe === 'hargaBeli'){
            try {
                await HargaBeli.query().where('id', params.id).delete()
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
        if(params.tipe === 'hargaJual'){
            try {
                await HargaJual.query().where('id', params.id).delete()
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
}

module.exports = new masterBarang()