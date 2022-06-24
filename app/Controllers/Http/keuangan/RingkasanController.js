'use strict'

const _ = require('underscore')
const User = use("App/Models/User")
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const AccCoa = use("App/Models/akunting/AccCoa")
const UsrWorkspace = use("App/Models/UsrWorkspace")

class RingkasanController {
    async index ( { auth, view } ) {
        console.log('xxxx');
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan._ringkasan.index', {
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

        let data = await initFunc.RINGKASAN(user)

        // console.log(JSON.stringify(data, null, 2))
        return view.render('keuangan._ringkasan.list', data)
    }

    async sumValues ( { request } ) {
        const req = request.all()
        req.cabang_id = req.cabang_id != '' ? req.cabang_id : null
        const data = await initFunc.GET_TOTAL_VALUE_AKUN(req.cabang_id, req.kode, req.rangeAwal, req.rangeAkhir)
        return data
    }

    async profitLoss ( { request } ) {
        const req = request.all()
        const { cabang_id, rangeAwal, rangeAkhir } = req
        const data = await initFunc.GET_PNL(cabang_id, rangeAwal, rangeAkhir)
        // console.log(data);
        return data
    }
}

module.exports = RingkasanController

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
