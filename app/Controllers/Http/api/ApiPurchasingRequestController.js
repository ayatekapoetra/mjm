'use strict'

const version = '1.0'
const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const KeuPurchasingOrderHelpers = use("App/Helpers/KeuPurchasingOrder")

class ApiPurchasingRequestController {
    async index ({request, auth, response}) {
        let durasi
        var t0 = performance.now()
        var req = request.all()

        const user = await userValidate(auth)
        console.log(user);
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        try {
            const data = await KeuPurchasingOrderHelpers.LIST(req, user)
            durasi = await initFunc.durasi(t0)
            return response.status(200).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: false
                },
                data: data
            })
        } catch (error) {
            durasi = await initFunc.durasi(t0)
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: true
                },
                data: error
            })
        }
    }

    async show ( { auth, params, response } ) {
        let durasi
        var t0 = performance.now()

        const user = await userValidate(auth)
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        try {
            const data = await KeuPurchasingOrderHelpers.SHOW(params)
            durasi = await initFunc.durasi(t0)
            return response.status(200).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: false
                },
                data: data
            })
        } catch (error) {
            durasi = await initFunc.durasi(t0)
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: true
                },
                data: error
            })
        }
    }

    async approveStore ( { auth, params, view } ){
        const user = await userValidate(auth)

        if(!user){
            return view.render('401')
        }

        const data = await KeuPurchasingOrderHelpers.APPROVE(params, user)
        return data
    }

    async rejectStore ( { auth, params, view } ){
        const user = await userValidate(auth)

        if(!user){
            return view.render('401')
        }

        const data = await KeuPurchasingOrderHelpers.REJECT(params, user)
        return data
    }
}

module.exports = ApiPurchasingRequestController

async function userValidate(auth){
    let user
    try {
        user = await auth.authenticator('jwt').getUser()
        return user
    } catch (error) {
        console.log(error);
        return null
    }
}