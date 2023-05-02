'use strict'

const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const BarangHelpers = use("App/Helpers/Barang")

class BarangController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('master.barang.index', {
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

        const data = await BarangHelpers.LIST(req, user)
        console.log(data);
        return view.render('master.barang.list', { list: data })
    }
    
    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        // const kode = await initFunc.GEN_KODE_BARANG()
        // console.log(kode);
        return view.render('master.barang.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image'],
            size: '10mb',
            extnames: ['png', 'gif', 'jpg', 'jpeg', 'pdf']
        }
        const attchment = request.file('photo', validateFile)
        const data = await BarangHelpers.POST(req, user, attchment)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BarangHelpers.SHOW(params)

        return view.render('master.barang.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image'],
            size: '10mb',
            extnames: ['png', 'gif', 'jpg', 'jpeg', 'pdf']
        }

        console.log(req);
        const attchment = request.file('photo', validateFile)
        const data = await BarangHelpers.UPDATE(params, req, user, attchment)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await BarangHelpers.DELETE(params)

        return data
    }
}

module.exports = BarangController

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