'use strict'

const DB = use('Database')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const moment = require('moment')
const PersediaanBarangHelpers = use("App/Helpers/PersediaanBarang")

class PersediaanBarangController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan.persediaan-barang.index', {
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

        const data = await PersediaanBarangHelpers.LIST(req, user)
        return view.render('keuangan.persediaan-barang.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const kode = await initFunc.GEN_KODE_PR()
        return view.render('keuangan.persediaan-barang.create', { kode_PR: kode })
    }

    async approve ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        try {
            const doc = await DB.from('sys_config_documents').where( w => {
                w.where('document_type', 'purchasing order')
                w.where('user_id', user.id)
            }).last()
            if (!doc) {
                return view.render('unauthorized')
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Error sys_config_documents...'
            }
        }
        const data = await PersediaanBarangHelpers.SHOW(params)
        return view.render('keuangan.persediaan-barang.approve', { data: data })
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PersediaanBarangHelpers.SHOW(params)
        return view.render('keuangan.persediaan-barang.show', { data: data })
    }

    async store ( { auth, request } ){
        let req = request.all()
        req = JSON.parse(req.data)
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log(req);
        const data = await PersediaanBarangHelpers.POST(req, user)
        return data
    }

    async approveStore ( { auth, params, request, view } ){
        let req = request.all()
        req = JSON.parse(req.data)
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log(req);
        const data = await PersediaanBarangHelpers.APPROVE(params, req, user)
        return data
    }

    async addItem ( { view } ) {
        return view.render('components.items.purchasing-order.item-details')
    }
}

module.exports = PersediaanBarangController

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