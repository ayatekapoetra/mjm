'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const BarangLokasi = use("App/Models/BarangLokasi")

class masterBarang {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        // const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await Barang
                .query()
                .with('brand')
                .with('kategori')
                .with('subkategori')
                .with('qualitas')
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
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Barang
                .query()
                .with('brand')
                .with('kategori')
                .with('subkategori')
                .with('qualitas')
                .where( w => {
                    w.where('aktif', 'Y')
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async LIST_API (req) {
        const data = (
            await Barang
            .query()
            .with('brand')
            .with('kategori')
            .with('subkategori')
            .with('qualitas')
            .where( w => {
                if(req.keyword){
                    w.where('kode', 'like', `%${req.keyword}%`)
                    w.orWhere('num_part', 'like', `%${req.keyword}%`)
                    w.orWhere('nama', 'like', `%${req.keyword}%`)
                }
            }).orderBy('kode', 'asc').fetch()
        )?.toJSON()
        return data
    }

    async POST (req, user, filex) {
        const trx = await DB.beginTransaction()

        /** JIKA PHOTO DITEMUKAN **/
        let photoBarang
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `BRG-${randURL}.${filex.extname}`
            photoBarang = 'images/barang/'+aliasName
            await filex.move(Helpers.publicPath(`images/barang`), {
                name: aliasName,
                overwrite: true,
            })

            if (!filex.moved()) {
                return {
                    success: false,
                    message: 'Failed upload photo image... \n'+filex.error().message
                }
            }
        }

        const kode = await initFunc.GEN_KODE_BARANG(req, 'post')
        const barang = new Barang()
        barang.fill({
            kode: kode,
            num_part: req.num_part,
            kategori_id: req.kategori_id || null,
            subkategori_id: req.subkategori_id || null,
            brand_id: req.brand_id,
            qualitas_id: req.qualitas_id,
            nama: req.nama,
            satuan: req.satuan,
            min_stok: req.min_stok,
            user_id: user.id,
            photo: photoBarang || null,
            coa_in: req.coa_in || null,
            coa_out: req.coa_out || null
        })

        try {
            await barang.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save barang '+ JSON.stringify(error)
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
            .with('brand')
            .with('kategori')
            .with('subkategori')
            .with('qualitas')
            .with('coaIn')
            .with('coaOut')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async SHOW_BY_KODE (params) {
        let data = (
            await Barang
            .query()
            .with('brand')
            .with('kategori')
            .with('subkategori')
            .with('qualitas')
            .with('coaIn')
            .with('coaOut')
            .where('kode', params.kode)
            .last()
        ).toJSON()

        // console.log(user);

        // let stok = (await BarangLokasi.query().where('barang_id', data.id).fetch()).toJSON()
        // console.log(stok);
        return data
    }

    async UPDATE (params, req, user, filex) {
        const trx = await DB.beginTransaction()

        /** JIKA PHOTO DITEMUKAN **/
        let photoBarang
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `BRG-${randURL}.${filex.extname}`
            photoBarang = 'images/barang/'+aliasName
            await filex.move(Helpers.publicPath(`images/barang`), {
                name: aliasName,
                overwrite: true,
            })

            if (!filex.moved()) {
                console.log(filex.error());
                return {
                    success: false,
                    message: 'Failed upload photo image... \n'+filex.error().message
                }
            }
        }

        const kode = await initFunc.GEN_KODE_BARANG(req, 'update')
        const barang = await Barang.query().where('id', params.id).last()
        barang.merge({
            kode: kode,
            num_part: req.num_part,
            kategori_id: req.kategori_id,
            subkategori_id: req.subkategori_id || null,
            brand_id: req.brand_id,
            qualitas_id: req.qualitas_id,
            nama: req.nama,
            satuan: req.satuan,
            min_stok: req.min_stok,
            user_id: user.id,
            photo: photoBarang || null,
            coa_in: req.coa_in || null,
            coa_out: req.coa_out || null
        })

        try {
            await barang.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save barang '+ JSON.stringify(error)
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
            await Barang.query().where('id', params.id).delete()
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

module.exports = new masterBarang()