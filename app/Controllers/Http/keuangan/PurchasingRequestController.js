'use strict'

const DB = use('Database')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const moment = require('moment')
const KeuPurchasingOrderHelpers = use("App/Helpers/KeuPurchasingOrder")

class PurchasingRequestController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan.purchasing-request.index', {
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

        const data = await KeuPurchasingOrderHelpers.LIST(req, user)
        return view.render('keuangan.purchasing-request.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const kode = await initFunc.GEN_KODE_PR(user)
        return view.render('keuangan.purchasing-request.create', { kode_PR: kode })
    }

    async view ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KeuPurchasingOrderHelpers.SHOW(params)
        return view.render('keuangan.purchasing-request.view', { data: data })
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
        const data = await KeuPurchasingOrderHelpers.SHOW(params)
        return view.render('keuangan.purchasing-request.approve', { data: data })
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuPurchasingOrderHelpers.SHOW(params)
        return view.render('keuangan.purchasing-request.show', { data: data })
    }

    async store ( { auth, request } ){
        let req = request.all()
        req = JSON.parse(req.data)
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log(req);
        if(!req.cabang_id){
            return {
                success: false,
                message: 'Tentukan cabang lebih dulu...'
            }
        }
        if(!req.gudang_id){
            return {
                success: false,
                message: 'Tentukan gudang lebih dulu...'
            }
        }
        if(!req.priority){
            return {
                success: false,
                message: 'Tentukan prioritas lebih dulu...'
            }
        }
        if(!req.date){
            return {
                success: false,
                message: 'Tentukan tanggal lebih dulu...'
            }
        }

        for (const [i, obj] of (req.items).entries()) {
            var urut = i + 1
            if(!obj.barang_id){
                return {
                    success: false,
                    message: 'Barang pada list ke-'+urut+' harus ditentukan...'
                }
            }
            if(!obj.qty || obj.qty <= 0){
                return {
                    success: false,
                    message: 'Jumlah barang pada list ke-'+urut+' harus lebih dari kosong...'
                }
            }
        }
        
        const data = await KeuPurchasingOrderHelpers.POST(req, user)
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
        const data = await KeuPurchasingOrderHelpers.APPROVE(params, req, user)
        return data
    }

    async addItem ( { view } ) {
        return view.render('components.items.purchasing-order.item-details')
    }
}

module.exports = PurchasingRequestController

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