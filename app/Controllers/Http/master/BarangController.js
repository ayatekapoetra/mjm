'use strict'

const DB = use('Database')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const BarangHelpers = use("App/Helpers/Barang")

// const BarangJson = use("App/Helpers/JSON/persediaan072023")
const Barang = use("App/Models/master/Barang")
const HargaBeli = use("App/Models/master/HargaBeli")
const HargaJual = use("App/Models/master/HargaJual")
const BarangLokasi = use("App/Models/BarangLokasi")

class BarangController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('master.barang.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        // console.log(BarangJson);
        // const trx = await DB.beginTransaction()
        // for (const v of BarangJson) {
        //     // INSERT BARANG
        //     var kode = await initFunc.GEN_KODE_BARANG(v, 'post')
        //     console.log("ID : ", v.id);
        //     console.log("KODE : ", kode);
        //     const persediaan = new Barang()
        //     persediaan.fill({
        //         id: v.id,
        //         kode: kode,
        //         kategori_id: v.kategori_id || null,
        //         subkategori_id: v.subkategori_id || null,
        //         brand_id: v.brand_id || null,
        //         qualitas_id: v.qualitas_id || null,
        //         num_part: v.num_part || null,
        //         nama: v.nama_barang || '',
        //         satuan: v.satuan || null,
        //         min_stok: v.min_stok || 0,
        //         user_id: 1,
        //         created_at: new Date(),
        //     })
        //     try {
        //         await persediaan.save()
        //     } catch (error) {
        //         console.log(error);
        //         await trx.rollback()
        //         return {
        //             success: false,
        //             message: 'Failed save barang '+ JSON.stringify(error)
        //         }
        //     }

        //     // INSERT STOK LOKASI
        //     const stok = new BarangLokasi()
        //     stok.fill({
        //         cabang_id: 1,
        //         gudang_id: 1,
        //         barang_id: persediaan.id,
        //         qty_hand: v.aktual_Stok ? parseFloat(v.aktual_Stok) : 0,
        //         qty_own: v.aktual_Stok ? parseFloat(v.aktual_Stok) : 0,
        //         createdby: 1,
        //         created_at: new Date(),
        //     })

        //     try {
        //         await stok.save(trx)
        //     } catch (error) {
        //         console.log(error);
        //         await trx.rollback()
        //         return {
        //             success: false,
        //             message: 'Failed save stok '+ JSON.stringify(error)
        //         }
        //     }

        //     // INSERT HARGA BELI
        //     const hargaBeli = new HargaBeli()
        //     hargaBeli.fill({
        //         cabang_id: 1,
        //         gudang_id: 1,
        //         barang_id: persediaan.id,
        //         periode: "2023-07",
        //         narasi: "UPLOAD DATA",
        //         harga_beli: v.harga_beli ? parseFloat(v.harga_beli) : 0,
        //         created_by: 1,
        //         created_at: new Date(),
        //     })

        //     try {
        //         await hargaBeli.save(trx)
        //     } catch (error) {
        //         console.log(error);
        //         await trx.rollback()
        //         return {
        //             success: false,
        //             message: 'Failed save harga beli '+ JSON.stringify(error)
        //         }
        //     }

        //     // INSERT HARGA JUAL
        //     const hargaJual = new HargaJual()
        //     hargaJual.fill({
        //         cabang_id: 1,
        //         gudang_id: 1,
        //         barang_id: persediaan.id,
        //         periode: "2023-07",
        //         narasi: "UPLOAD DATA",
        //         harga_jual: v.harga_jual ? parseFloat(v.harga_jual) : 0,
        //         created_by: 1,
        //         created_at: new Date(),
        //     })

        //     try {
        //         await hargaJual.save(trx)
        //     } catch (error) {
        //         console.log(error);
        //         await trx.rollback()
        //         return {
        //             success: false,
        //             message: 'Failed save harga jual '+ JSON.stringify(error)
        //         }
        //     }
        // }

        // await trx.commit()
        const data = await BarangHelpers.LIST(req, user)

        return view.render('master.barang.list', { list: data })
    }
    
    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        // const kode = await initFunc.GEN_KODE_BARANG()
        // console.log(kode);
        return view.render('master.barang.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image'],
            size: '10mb',
            extnames: ['png', 'gif', 'jpg', 'jpeg', 'pdf']
        }
        const attchment = request.file('photo', validateFile)
        const data = await BarangHelpers.POST(req, user, attchment)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BarangHelpers.SHOW(params)

        return view.render('master.barang.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image'],
            size: '10mb',
            extnames: ['png', 'gif', 'jpg', 'jpeg', 'pdf']
        }

        console.log(req);
        const attchment = request.file('photo', validateFile)
        const data = await BarangHelpers.UPDATE(params, req, user, attchment)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BarangHelpers.DELETE(params)

        return data
    }
}

module.exports = BarangController

async function userValidate(auth){
    let user
    try {
        user = await auth.getUser()
        return user
    } catch (error) {
        console.log(error);
        return null
    }
}