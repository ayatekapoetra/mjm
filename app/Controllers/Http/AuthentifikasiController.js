'use strict'

const Hash = use('Hash')
const User = use("App/Models/User")
const Token = use("App/Models/Token")
const initMenu = use("App/Helpers/_sidebar")
const Cabang = use("App/Models/master/Cabang")
const UsrCabang = use("App/Models/UsrCabang")

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
        let usrCabang = (
            await UsrCabang.query()
            .where( w => {
                w.where('user_id', user.id)
            }).fetch()
        ).toJSON()

        let arrCabang = []
        for (const obj of usrCabang) {
            const cabang = await Cabang.query().where('id', obj.cabang_id).last()
            arrCabang.push({
                ...obj,
                nm_cabang: cabang.nama,
                kd_cabang: cabang.kode,
                selected: obj.aktif === 'Y' ? 'selected':''
            })
        }
        console.log(arrCabang);

        return view.render('profile', {
            menu: sideMenu,
            arrCabang: arrCabang
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

    async updateWorkspace ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)

        if(!user){
            return {
                success: false,
                message: 'not authorized...'
            }
        }

        try {
            await UsrCabang.query().where('user_id', user.id).update({ aktif: 'N' })
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Workspace gagal dipindahkan....'
            }
        }

        try {
            const usrCabang = await UsrCabang.query().where({user_id: user.id, cabang_id: req.cabang_id}).last()
            console.log(usrCabang.toJSON());
            usrCabang.merge({aktif: 'Y'})
            await usrCabang.save()
            return {
                success: true,
                message: 'Workspace berhasil dipindahkan....'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Workspace gagal dipindahkan....'
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