'use strict'

const initMenu = use("App/Helpers/_sidebar")
const moment = require('moment')
const BarangHargaHelpers = use("App/Helpers/BarangHarga")

class BarangHargaController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('master.barang-harga.index', {
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

        const data = await BarangHargaHelpers.LIST(req, user)
        switch (req.type) {
            case 'hargajual':
                return view.render('components.barang-harga.table-harga-jual', { list: data })
            case 'hargabeli':
                return view.render('components.barang-harga.table-harga-beli', { list: data })
            default:
                return view.render('master.barang-harga.list', { list: data })
        }
    }
    
    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        return view.render('master.barang-harga.create', {periode: moment().format('YYYY-MM')})
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        const data = await BarangHargaHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        console.log(req);
        const data = await BarangHargaHelpers.SHOW(params, req)

        return view.render('master.barang-harga.show', { data: data, type: req.type })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BarangHargaHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BarangHargaHelpers.DELETE(params)

        return data
    }
}

module.exports = BarangHargaController

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