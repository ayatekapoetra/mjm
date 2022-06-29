'use strict'

const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const PrivilagesHelpers = use("App/Helpers/Privilages")

class UserPrivilageController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const workdir = await initFunc.WORKSPACE(usr)
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('setting.user-privilages.index', {
                menu: sideMenu,
                workdir: workdir
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        const req = request.all()
        console.log(req);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        // await initFunc.INSERT_LABATAHAN(user)
        const data = await PrivilagesHelpers.LIST(req, user)
        // console.log(data);
        return view.render('setting.user-privilages.list', { list: data})
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        const ws = await initFunc.WORKSPACE(user)
        if(!user){
            return view.render('401')
        }

        return view.render('setting.user-privilages.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        // console.log('REQ :::', req);
        const data = await PrivilagesHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PrivilagesHelpers.SHOW(params)

        console.log(data);
        return view.render('setting.user-privilages.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await PrivilagesHelpers.UPDATE(params, req, user)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await PrivilagesHelpers.DELETE(params)

        return data
    }
}

module.exports = UserPrivilageController

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