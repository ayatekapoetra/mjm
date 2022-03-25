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
        const limit = req.limit || 25;
        // const limit = 5;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await BarangHarga
                .query()
                .where( w => {
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.serial){
                        w.where('serial', 'like', `%${req.serial}%`)
                    }
                    if(req.num_part){
                        w.where('num_part', 'like', `%${req.num_part}%`)
                    }
                    if(req.nama){
                        w.where('nama', 'like', `%${req.nama}%`)
                    }
                    if(req.satuan){
                        w.where('satuan', req.satuan)
                    }
                })
                .orderBy('nama', 'asc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await BarangHarga
                .query()
                .where( w => {
                    w.where('aktif', 'Y')
                })
                .orderBy('nama', 'asc')
                .paginate(halaman, limit)
            ).toJSON()
        }
        // console.log(data);
        return data
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        
        const hargaBeli = new HargaBeli()
        hargaBeli.fill({
            barang_id: req.barang_id,
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

        const hargaJual = new HargaJual()
        hargaJual.fill({
            barang_id: req.barang_id,
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

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = (
            await Barang
            .query()
            .with('hargaJual')
            .with('hargaBeli')
            .where('id', params.id)
            .last()
        ).toJSON()
        console.log(data);
        return data
    }

    // async UPDATE (params, req, user, filex) {
    //     const ws = await initFunc.GET_WORKSPACE(user.id)
    //     const trx = await DB.beginTransaction()

    //     /** JIKA PHOTO DITEMUKAN **/
    //     let photoBarang
    //     if(filex){
    //         const randURL = moment().format('YYYYMMDDHHmmss')
    //         const aliasName = `BRG-${randURL}.${filex.extname}`
    //         photoBarang = 'images/barang/'+aliasName
    //         await filex.move(Helpers.publicPath(`images/barang`), {
    //             name: aliasName,
    //             overwrite: true,
    //         })

    //         if (!filex.moved()) {
    //             return {
    //                 success: false,
    //                 message: 'Failed upload photo image...'+ profilePic.error()
    //             }
    //         }
    //     }

    //     const barang = await Barang.query().where('id', params.id).last()
    //     barang.merge({
    //         bisnis_id: ws.bisnis_id,
    //         serial: req.serial,
    //         num_part: req.num_part,
    //         nama: req.nama,
    //         satuan: req.satuan,
    //         min_stok: req.min_stok,
    //         createdby: user.id,
    //         photo: photoBarang || null,
    //         coa_in: req.coa_in || null,
    //         coa_out: req.coa_out || null
    //     })

    //     try {
    //         await barang.save(trx)
    //     } catch (error) {
    //         console.log(error);
    //         await trx.rollback()
    //         return {
    //             success: false,
    //             message: 'Failed save barang '+ JSON.stringify(error)
    //         }
    //     }

    //     await trx.commit()
    //     return {
    //         success: true,
    //         message: 'Success save data...'
    //     }
    // }

    async DELETE (params, req) {
        console.log(params);
        console.log(req);
        if(req.tipe === 'beli'){
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
        if(req.tipe === 'jual'){
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