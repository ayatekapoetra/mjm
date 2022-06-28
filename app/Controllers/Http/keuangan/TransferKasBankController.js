'use strict'

const DB = use('Database')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const moment = require('moment')
const KasBankHelpers = use("App/Helpers/KasBank")

class TransferKasBankController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan.pindah-kasbank.index', {
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
        
        const data = await KasBankHelpers.LIST(req, user)
        console.log('req', data);
    }
}

module.exports = TransferKasBankController
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