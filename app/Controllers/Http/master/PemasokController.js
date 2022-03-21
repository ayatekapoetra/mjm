'use strict'

const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const PemasokHelpers = use("App/Helpers/Pemasok")

class PemasokController {
    async index ( { auth, request, view } ) {
        const req = request.all()
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('master.pemasok.index', {
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

        const data = await PemasokHelpers.LIST(req, user)
        console.log(data);
        return view.render('master.pemasok.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        return view.render('master.pemasok.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await PemasokHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PemasokHelpers.SHOW(params)

        return view.render('master.pemasok.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PemasokHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PemasokHelpers.DELETE(params)

        return data
    }
}

module.exports = PemasokController


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