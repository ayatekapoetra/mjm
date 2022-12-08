'use strict'

const VUser = use("App/Models/VUser")
const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")
const PelangganHelpers = use("App/Helpers/Pelanggan")
const version = '1.0'

class ApiPelangganController {
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
            const data = await PelangganHelpers.LIST(req)
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
            const data = await PelangganHelpers.SHOW(params)
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

    async showByKode ( { auth, params, response } ) {
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
            const data = await PelangganHelpers.SHOW_BY_KODE(params)
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
    
}

module.exports = ApiPelangganController

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