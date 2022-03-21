'use strict'

const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const UsermenuHelpers = use("App/Helpers/UserMenu")

class UserMenuController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const workdir = await initFunc.GET_WORKSPACE(usr.id)
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('setting.user-menus.index', {
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
        // console.log(req);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await UsermenuHelpers.LIST(req, user)
        // console.log(data);
        return view.render('setting.user-menus.list', { list: data})
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        const ws = await initFunc.GET_WORKSPACE(user.id)
        if(!user){
            return view.render('401')
        }

        return view.render('setting.user-menus.create')
    }

    async store ( { auth, request, view } ) {
        const req = request.except(['csrf_token', '_csrf', 'submit'])
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await UsermenuHelpers.POST(req, user)
        return data
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await UsermenuHelpers.SHOW(params)

        return view.render('setting.user-menus.show', { data: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.except(['csrf_token', '_csrf', 'submit'])
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await UsermenuHelpers.UPDATE(params, req)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await UsermenuHelpers.DELETE(params)

        return data
    }
}

module.exports = UserMenuController

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