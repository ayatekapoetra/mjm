'use strict'

const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const BarangHelpers = use("App/Helpers/Barang")

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
        return view.render('logistik.stok-opname.list')
    }

    async create ( { auth, view } ) {
        return view.render('logistik.stok-opname.create')
    }

    async addItem ( { view } ) {
        const req = {}
        req.limit = 10000
        const { data } = await BarangHelpers.LIST(req)
        return view.render('logistik.stok-opname.item-details', {barang: data})
    }
}

module.exports = StokOpnameController