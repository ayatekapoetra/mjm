'use strict'

const initMenu = use("App/Helpers/_sidebar")
const TempatBarangHelpers = use("App/Helpers/TempatBarang")

class PenempatanBarangController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('setting.penempatan-barang.index', {
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

        const data = await TempatBarangHelpers.LIST(req, user)
        return view.render('setting.penempatan-barang.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        return view.render('setting.penempatan-barang.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log(req);
        if(!req.cabang_id){
            return {
                success: false,
                message: "Cabang belum di tentukan..."
            }
        }
        if(!req.gudang_id){
            return {
                success: false,
                message: "Gudang belum di tentukan..."
            }
        }
        if(!req.rack_id){
            return {
                success: false,
                message: "Rak barang belum di tentukan..."
            }
        }
        if(!req.bin_id){
            return {
                success: false,
                message: "Bin barang belum di tentukan..."
            }
        }
        if(!req.barang_id){
            return {
                success: false,
                message: "Barang belum di tentukan..."
            }
        }

        const data = await TempatBarangHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await TempatBarangHelpers.SHOW(params)

        return view.render('setting.penempatan-barang.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        if(!req.cabang_id){
            return {
                success: false,
                message: "Cabang belum di tentukan..."
            }
        }
        if(!req.gudang_id){
            return {
                success: false,
                message: "Gudang belum di tentukan..."
            }
        }
        if(!req.rack_id){
            return {
                success: false,
                message: "Rak barang belum di tentukan..."
            }
        }
        if(!req.bin_id){
            return {
                success: false,
                message: "Bin barang belum di tentukan..."
            }
        }
        if(!req.barang_id){
            return {
                success: false,
                message: "Barang belum di tentukan..."
            }
        }
        const data = await TempatBarangHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await TempatBarangHelpers.DELETE(params)

        return data
    }
}

module.exports = PenempatanBarangController

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