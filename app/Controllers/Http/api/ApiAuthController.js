'use strict'

const VUser = use("App/Models/VUser")
const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")

class ApiAuthController {
    async signinx ({request, auth, response}) {
        var t0 = performance.now()
        let durasi = await initFunc.durasi(t0)
        return {
            success: true,
            message: 'okeeeeyyyyy,,,,,,'+durasi
        }
    }

    async signin ({request, auth, response}) {
        var t0 = performance.now()
        const { username, password } = request.all()
        let durasi
        try {
            const token = await auth.authenticator('jwt').newRefreshToken().attempt(username, password)
            const usr = await VUser.findBy('username', username)
            durasi = await initFunc.durasi(t0)
            return response.status(201).json({
                diagnostic: {
                    times: durasi, 
                    error: false,
                },
                data: token,
                user: usr.toJSON()
            })
        } catch (error) {
            console.log(error);
            durasi = await initFunc.durasi(t0)
            return response.status(404).json({
                diagnostic: {
                    times: durasi, 
                    error: true,
                    message: error.message
                },
                data: null
            })
        }
    }
}

module.exports = ApiAuthController
