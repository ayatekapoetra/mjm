'use strict'

const DB = use('Database')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const moment = require('moment')
const KasBankHelpers = use("App/Helpers/KasBank")


class KasBankController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan.kas-bank.index', {
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
        
        const data = await KasBankHelpers.LIST(req, user)
        console.log('req', data);
        switch (req.type) {
            case 'kas':
                return view.render('components.kas-bank.table-kas', { list: data })
            case 'bank':
                return view.render('components.kas-bank.table-bank', { list: data })
            default:
                return view.render('keuangan.kas-bank.list', { list: data })
        }
    }

    async createKas ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const cabang = await initFunc.WORKSPACE(user)
        return view.render('keuangan.kas-bank.create-kas', {formName: 'form-create-kas'})
    }

    async createBank ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const cabang = await initFunc.WORKSPACE(user)
        return view.render('keuangan.kas-bank.create-bank', {formName: 'form-create-bank'})
    }

    async showKas ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KasBankHelpers.SHOW_KAS(params)
        return view.render('keuangan.kas-bank.show-kas', {formName: 'form-update-kas', data: data})
    }

    async showBank ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        console.log(params);
        const data = await KasBankHelpers.SHOW_BANK(params)
        return view.render('keuangan.kas-bank.show-bank', {formName: 'form-update-bank', data: data})
    }

    async storeKas ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KasBankHelpers.POST_KAS(req, user)
        return data
    }

    async storeBank ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KasBankHelpers.POST_BANK(req, user)
        return data
    }

    async updateKas ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KasBankHelpers.UPDATE_KAS(params, req, user)
        return data
    }

    async updateBank ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await KasBankHelpers.UPDATE_BANK(params, req, user)
        return data
    }
}

module.exports = KasBankController


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