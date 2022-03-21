'use strict'

const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const PelangganHelpers = use("App/Helpers/Pelanggan")

class PelangganController {
    async index ( { auth, request, view } ) {
        const req = request.all()
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('master.pelanggan.index', {
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

        await initFunc.INSERT_LABATAHAN(user)
        const data = await PelangganHelpers.LIST(req, user)
        return view.render('master.pelanggan.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        return view.render('master.pelanggan.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await PelangganHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PelangganHelpers.SHOW(params)

        return view.render('master.pelanggan.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PelangganHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PelangganHelpers.DELETE(params)

        return data
    }
}

module.exports = PelangganController

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