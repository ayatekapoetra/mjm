'use strict'

const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const moment = require('moment')
const TrxOrderBeliHelpers = use("App/Helpers/TrxOrderBeli")

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

        const data = await TrxOrderBeliHelpers.LIST(req, user)
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        return view.render('keuangan.purchasing-request.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const kode = await initFunc.GEN_KODE_PR()
        return view.render('keuangan.purchasing-request.create', { kode_PR: kode })
    }

    async store ( { auth, request } ){
        let req = request.all()
        req = JSON.parse(req.data)
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        console.log(req);
        const data = await TrxOrderBeliHelpers.POST(req, user)
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