'use strict'

const Hash = use('Hash')
const Token = use("App/Models/Token")
const User = use("App/Models/User")
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

    async updatePassword ( { auth, request } ) {
        const { username, oldpass, passkey, retypepass } = request.all()
        const user = await userValidate(auth)

        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }

        const validOldPassword = await Hash.verify(oldpass, user.password)
        if (!validOldPassword) {
            return {
                success: false,
                message: 'invalid old password...'
            }
        }

        if (passkey.length <= 5) {
            return {
                success: false,
                message: 'Password must more than 5 characters.... '
            }
        }

        if(passkey != retypepass){
            return {
                success: false,
                message: 'Password mismatch...'
            }
        }

        try {
            const user = await User.query().where('username', username).last()
            user.merge({
                password: passkey
            })
            await user.save()
            await Token.query().where('user_id', user.id).delete()
            await auth.logout()
            return {
                success: true,
                message: 'Password already updated....'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: error
            }
        }
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