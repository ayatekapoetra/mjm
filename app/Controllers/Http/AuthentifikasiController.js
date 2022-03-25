'use strict'

const Token = use("App/Models/Token")
const initMenu = use("App/Helpers/_sidebar")

class AuthentifikasiController {
    async index ( { view } ) {
        return view.render('login')
    }

    async login ( { auth, request, response, view } ) {
        const req = request.all()
        try {
            const usr = await auth.attempt(req.username, req.password)
            // console.log('SUCCESS LOGIN...', usr);
            response.redirect('/')
        } catch (error) {
            console.log(error)
            response.redirect('/login')
        }
    }

    async profile ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const sideMenu = await initMenu.SIDEBAR(user.id)
        return view.render('profile', {
            menu: sideMenu
        })
    }

    async loggingOut ({auth, response}) {
        const usr = await auth.getUser()
        await Token.query().where('user_id', usr.id).delete()
        await auth.logout()
        return response.redirect('/login')
    }
}

module.exports = AuthentifikasiController

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