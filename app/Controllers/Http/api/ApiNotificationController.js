'use strict'

const DB = use('Database')
const moment = require('moment')
require('moment/locale/id')
moment.locale('id');
const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")
const Notification = use("App/Models/Notification")
const version = '1.0'

class ApiNotificationController {
    async index ( { auth, request, response } ) {
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

        const data = (
            await Notification.
            query().
            with('pengirim').
            where( w => {
                w.where('receiver', user.id)
                w.whereNull('deleted_at')
            }).
            orderBy('created_at', 'desc').
            fetch()
        ).toJSON()

        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false
            },
            data: data
        })
    }

    async count ( { auth, response } ) {
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
        
        const data = (
            await Notification.
            query().
            with('pengirim').
            where( w => {
                w.where('receiver', user.id)
                w.whereNull('deleted_at')
            }).
            orderBy('created_at', 'desc').
            fetch()
        ).toJSON()

        // return data.length
        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false
            },
            data: data.length
        })
    }

    async delete ( { auth, params, response } ) {
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
        
        const notif = await Notification.query().where('id', params.id).last()
        notif.merge({
            status: 'removed',
            deleted_at: new Date()
        })

        try {
            await notif.save()
        } catch (error) {
            console.log(error);
            durasi = await initFunc.durasi(t0)
            return response.status(200).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: true,
                    message: error
                },
                data: null
            })
        }

        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false
            },
            data: notif.toJSON()
        })
    }
}

module.exports = ApiNotificationController

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