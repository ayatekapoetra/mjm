'use strict'

const initMenu = use("App/Helpers/_sidebar")
// const initFunc = use("App/Helpers/initFunc")
const CabangHelpers = use("App/Helpers/Cabang")

class CabangController {
    async index ( { auth, request, view } ) {
        const req = request.all()
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('master.cabang.index', {
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

        const data = await CabangHelpers.LIST(req, user)
        console.log(data);
        return view.render('master.cabang.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        return view.render('master.cabang.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await CabangHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await CabangHelpers.SHOW(params)

        return view.render('master.cabang.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await CabangHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await CabangHelpers.DELETE(params)

        return data
    }
}

module.exports = CabangController

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