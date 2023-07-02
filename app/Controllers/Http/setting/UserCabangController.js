'use strict'

const DB = use('Database')
const moment = require('moment')
require('moment/locale/id')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const VUser = use("App/Models/VUser")
const Cabang = use("App/Models/master/Cabang")
const UsrCabang = use("App/Models/UsrCabang")
moment.locale('id');

class UserCabangController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            const userList = (await VUser.query().where('aktif', 'Y').fetch()).toJSON()
            const cabang = (await Cabang.query().where('aktif', 'Y').fetch()).toJSON()
            return view.render('setting.user-cabang.index', {
                menu: sideMenu,
                user: userList,
                cabang: cabang
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
            await UsrCabang.
            query().
            with('user').
            with('cabang').
            where( w => {
                if(req.user_id){
                    w.where('user_id', req.user_id)
                }
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
            }).orderBy('created_at', 'desc').
            paginate(halaman, limit)
        ).toJSON()

        console.log(data);
        
        return view.render('setting.user-cabang.list', { list: data })
    }

    async create ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const userList = (await VUser.query().where('aktif', 'Y').fetch()).toJSON()
        const cabang = (await Cabang.query().where('aktif', 'Y').fetch()).toJSON()

        return view.render('setting.user-cabang.create', { userList, cabang })
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = (
            await UsrCabang.query().where('id', params.id).last()
        ).toJSON()

        let arrUser = (await VUser.query().where('aktif', 'Y').fetch()).toJSON()
        arrUser = arrUser.map( v => v.id === data.user_id ? {...v, selected: "selected"} : {...v, selected: ""})
        let arrCabang = (await Cabang.query().where('aktif', 'Y').fetch()).toJSON()
        arrCabang = arrCabang.map( v => v.id === data.cabang_id ? {...v, selected: "selected"} : {...v, selected: ""})

        return view.render('setting.user-cabang.show', { 
            data: data,
            arrUser: arrUser,
            arrCabang: arrCabang
        })
    }

    async store ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        if (!req.user_id) {
            return {
                success: false,
                message: "User masih kosong..."
            }
        }
        if (!req.cabang_id) {
            return {
                success: false,
                message: "Cabang masih kosong..."
            }
        }

        let usrCabang = await UsrCabang.query().where( w => {
            w.where('user_id', req.user_id)
            w.where('cabang_id', req.cabang_id)
        }).last()

        if(usrCabang){
            return {
                success: false,
                message: "User dengan cabang yg anda pilih sudah ada..."
            }
        }

        
        try {
            usrCabang = new UsrCabang()
            usrCabang.fill({
                user_id: req.user_id,
                cabang_id: req.cabang_id,
                aktif: 'N'
            })
            await usrCabang.save()
            return {
                success: true,
                message: "Berhasil ditambahkan..."
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: "Gagal ditambahkan..."
            }
        }
    }

    async update ( { auth, params, request, view } ) {
        const req = request.all()
        console.log(params);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        if (!req.user_id) {
            return {
                success: false,
                message: "User masih kosong..."
            }
        }
        if (!req.cabang_id) {
            return {
                success: false,
                message: "Cabang masih kosong..."
            }
        }

        
        let usrCabang = await UsrCabang.query().where( w => {
            w.where('user_id', req.user_id)
            w.where('cabang_id', req.cabang_id)
        }).last()

        if(usrCabang){
            return {
                success: false,
                message: "User dengan cabang yg anda pilih sudah ada..."
            }
        }

        let updCabang = await UsrCabang.query().where('id', params.id).last()
        updCabang.merge({
            user_id: req.user_id,
            cabang_id: req.cabang_id,
            aktif: updCabang.aktif
        })

        try {
            await updCabang.save()
            return {
                success: true,
                message: 'Success update user cabang...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed update user cabang...\n'+error
            }
        }
    }

    async destroy ( { auth, params, request, view } ) {
        const req = request.all()
        console.log(params);
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const usrCabang = await UsrCabang.query().where('id', params.id).last()
        
        try {
            await usrCabang.delete()
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed remove user cabang...\n'+error
            }
        }


        if(usrCabang.aktif === 'Y'){
            const newExsist = await UsrCabang.query().where( w => {
                w.where('user_id',  usrCabang.user_id)
            }).first()


            if(newExsist){
                try {
                    newExsist.merge({aktif: 'Y'})
                    await newExsist.save()
                } catch (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: 'Failed aktif user cabang...\n'+error
                    }
                }
            }
        }
        

        return {
            success: true,
            message: 'Success remove user cabang...'
        }
    }
}

module.exports = UserCabangController

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