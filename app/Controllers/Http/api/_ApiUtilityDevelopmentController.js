'use strict'

const DB = use('Database')
const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const BarangBrand = use("App/Models/master/BarangBrand")
const BarangCategories = use("App/Models/master/BarangCategories")
const BarangSubCategories = use("App/Models/master/BarangSubCategories")
const BarangQualities = use("App/Models/master/BarangQualities")
const version = '1.0'

const json = require('../../../Helpers/JSON/mjm-barang.json')

class _ApiUtilityDevelopmentController {
    // api-v1/insert-barang?token=ayatekapoetra-kenzie-kaivan
    async batchBarang ({request}) {
        let durasi
        var t0 = performance.now()
        var req = request.all()

        // const trx = await DB.beginTransaction()

        // if(req.token === 'ayatekapoetra-kenzie-kaivan'){
        //     var id = 1
        //     for (const obj of json) {
        //         // var kode = await initFunc.GEN_KODE_BARANG(obj, 'post')
        //         // var str = kode.substr(0, 12)
        //         // var lenBarang = (await Barang.query( w => {
        //         //     w.where('kategori_id', obj.kategori_id)
        //         //     w.where('subkategori_id', obj.subkategori_id)
        //         //     w.where('brand_id', obj.brand_id)
        //         //     w.where('qualitas_id', obj.qualitas_id)
        //         // }).fetch()).toJSON()
        //         // console.log(lenBarang.length + 1);
        //         // var urut = lenBarang.length + 1

        //         // var prefix = '0'.repeat(4 - `${urut}`.length)
        //         // const barang = new Barang()
        //         // barang.fill({
        //         //     id: id,
        //         //     kode: str + prefix + urut,
        //         //     num_part: obj.num_part || '',
        //         //     kategori_id: obj.kategori_id || null,
        //         //     subkategori_id: obj.subkategori_id || null,
        //         //     brand_id: obj.brand_id,
        //         //     qualitas_id: obj.qualitas_id,
        //         //     nama: obj.nama_barang || 'Unknow??',
        //         //     satuan: obj.satuan,
        //         //     min_stok: obj.min_stok,
        //         //     user_id: 1,
        //         //     photo: null,
        //         //     coa_in: 11001,
        //         //     coa_out: 40001
        //         // })

        //         // try {
        //         //     await barang.save()
        //         // } catch (error) {
        //         //     console.log(error);
        //         //     // await trx.rollback()
        //         //     return {
        //         //         success: false,
        //         //         message: 'Failed save barang '+ JSON.stringify(error)
        //         //     }
        //         // }
        //         // id = id + 1
        //     }
        //     // await trx.commit()
        //     return {
        //         success: true,
        //         message: 'Success save data...'
        //     }
        // }

        
    }
    
}

module.exports = _ApiUtilityDevelopmentController

async function userValidate(auth){
    let user
    try {
        user = await auth.authenticator('jwt').getUser()
        return user
    } catch (error) {
        console.log(error);
        return null
    }
}