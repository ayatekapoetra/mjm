'use strict'

const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const moment = require('moment')
const KeuTransferAntarKasBankHelpers = use("App/Helpers/KeuTransferAntarKasBank")

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
        
        const data = await KeuTransferAntarKasBankHelpers.LIST(req, user)
        console.log('req', data);
        return view.render('keuangan.pindah-kasbank.list', {list: data})
    }

    async create ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        return view.render('keuangan.pindah-kasbank.create')
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        const data = await KeuTransferAntarKasBankHelpers.SHOW(params)
        console.log(data);
        return view.render('keuangan.pindah-kasbank.show', {data: data})
    }

    async store ( { auth, request } ) {
        const req = request.all()

        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const validateFile = {
            types: ['image'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf']
        }

        if(req.trx_date != req.delay_out){
            req.isDelayOut = 'Y'
        }else{
            req.isDelayOut = 'N'
        }

        if(req.trx_date != req.delay_in){
            req.isDelayIn = 'Y'
        }else{
            req.isDelayIn = 'N'
        }


        const attchment = request.file('photo', validateFile)
        const data = await KeuTransferAntarKasBankHelpers.POST(req, user, attchment)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await KeuTransferAntarKasBankHelpers.DELETE(params)
        return data
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