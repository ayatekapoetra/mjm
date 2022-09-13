'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const BarangHelpers = use("App/Helpers/Barang")
const LogStokOpnameHelpers = use("App/Helpers/LogStokOpname")

class StokOpnameController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('logistik.stok-opname.index', {
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
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.LIST(req, user)
        return view.render('logistik.stok-opname.list', {list: data})
    }

    async create ( { auth, view } ) {
        return view.render('logistik.stok-opname.create')
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }
        const data = await LogStokOpnameHelpers.SHOW(params)
        return view.render('logistik.stok-opname.show', {data: data})
    }

    async showSummary ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }
        let data = await LogStokOpnameHelpers.SUMMARY(params)
        data = data.map( v => {
            return {
                ...v,
                date_opname: moment(v.date_opname).format('dddd, DD-MM-YYYY')
            }
        })
        console.log(data);
        return view.render('logistik.stok-opname.item-summary', {data: data})
    }
    
    async addItem ( { view } ) {
        const req = {}
        req.limit = 10000
        const { data } = await BarangHelpers.LIST(req)
        return view.render('logistik.stok-opname.item-details', {barang: data})
    }

    async store ( { auth, request, view } ) {
        let req = request.all()
        req = JSON.parse(req.dataForm)
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.POST(req, user)
        return data
    }

    async update ( { auth, params, request, view } ) {
        let req = request.all()
        req = JSON.parse(req.dataForm)
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return {
                success: false,
                message: 'Not authorized....'
            }
        }

        const data = await LogStokOpnameHelpers.DELETE(params)
        return data
    }

}

module.exports = StokOpnameController

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