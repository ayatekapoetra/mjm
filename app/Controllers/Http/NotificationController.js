'use strict'

const DB = use('Database')
const moment = require('moment')
require('moment/locale/id')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const Notification = use("App/Models/Notification")
moment.locale('id');

class NotificationController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('notification.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        const req = request.all()
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
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
            paginate(halaman, limit)
        ).toJSON()

        let notif = data.data
        notif = notif.map(obj => {
            return {
                ...obj,
                date: moment(obj.created_at).format('DD MMMM YYYY'),
                datetime: moment(obj.created_at, 'YYYYMMDD HH:mm').fromNow()
            }
        })
        data.data = notif
        // console.log(data);
        return view.render('notification.list', { list: data })
    }

    async update ( { auth, params, request } ) {
        const req = request.all()
        console.log(params);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        const notif = await Notification.query().where('id', params.id).last()
        notif.merge({
            status: req.status === 'unread' ? 'read':'unread'
        })

        try {
            await notif.save()
            return {
                success: true,
                message: 'Success update notification...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed update notification...\n'+error
            }
        }
    }

    async delete ( { auth, params, request } ) {
        const req = request.all()
        console.log(params);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        const notif = await Notification.query().where('id', params.id).last()
        notif.merge({
            status: 'removed',
            deleted_at: new Date()
        })

        try {
            await notif.save()
            return {
                success: true,
                message: 'Success remove notification...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed remove notification...\n'+error
            }
        }
    }
}

module.exports = NotificationController

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