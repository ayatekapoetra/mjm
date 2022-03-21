'use strict'

const initMenu = use("App/Helpers/_sidebar")
const GudangHelpers = use("App/Helpers/Gudang")

class GudangController {
    async index ( { auth, request, view } ) {
        const req = request.all()
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('master.gudang.index', {
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

        const data = await GudangHelpers.LIST(req, user)
        // console.log(data);
        return view.render('master.gudang.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        return view.render('master.gudang.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await GudangHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await GudangHelpers.SHOW(params)

        return view.render('master.gudang.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await GudangHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await GudangHelpers.DELETE(params)

        return data
    }
}

module.exports = GudangController


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