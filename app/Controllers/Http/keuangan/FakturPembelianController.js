'use strict'

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const logoPath = Helpers.publicPath('logo.png')
const AccCoa = use("App/Models/akunting/AccCoa")
const Image64Helpers = use("App/Helpers/_encodingImages")
const KeuFakturPembelianHelpers = use("App/Helpers/KeuFakturBeli")

class FakturPembelianController {
    async index ( { auth, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('keuangan.faktur-pembelian.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        // const data = await KeuFakturPembelianHelpers.LIST(req, user)
        // console.log(data);
        return view.render('keuangan.faktur-pembelian.list')
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        return view.render('keuangan.faktur-pembelian.create')
    }

    async store ( { auth, request } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }
        const attchment = request.file('lampiran', validateFile)

        const req = request.all()
        req.data = JSON.parse(req.dataForm)
        console.log(req);
        console.log(attchment);
        const data = await KeuFakturPembelianHelpers.POST(req, user, attchment)
        return data

    }

    async addItem ( { view } ) {
        const coa = (await AccCoa.query().fetch()).toJSON()
        let data = _.groupBy(coa, 'coa_tipe_nm')
        data = Object.keys(data).map(key => {
            return {
                tipe: key,
                items: data[key]
            }
        })
        return view.render('components.items.faktur-beli.item-details', {akun : data})
    }
}

module.exports = FakturPembelianController

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