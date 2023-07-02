'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const User = use("App/Models/User")
const VUser = use("App/Models/VUser")
const initFunc = use("App/Helpers/initFunc")
const UsrCabang = use("App/Models/UsrCabang")
const UsrProfile = use("App/Models/UsrProfile")

const UsrWorkspace = use("App/Models/UsrWorkspace")
const UsrBisnisUnit = use("App/Models/UsrBisnisUnit")

class masterUsers {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        console.log(req);
        let data
        if(req.keyword){
            data = (
                await VUser
                .query()
                .where( w => {
                    if(req.username){
                        w.where('username', 'like', `%${req.username}%`)
                    }
                    if(req.email){
                        w.where('email', 'like', `%${req.email}%`)
                    }
                    if(req.nama_lengkap){
                        w.where('nama_lengkap', 'like', `%${req.nama_lengkap}%`)
                    }
                    if(req.handphone){
                        w.where('handphone', 'like', `%${req.handphone}%`)
                    }
                    if(req.alamat){
                        w.where('alamat', 'like', `%${req.alamat}%`)
                    }
                    if(req.usertype){
                        w.where('jenkel', req.jenkel)
                    }
                })
                .orderBy('username', 'asc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await VUser
                .query()
                .where( w => {
                    w.where('aktif', 'Y')
                })
                .orderBy('username', 'asc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async POST (req, user, filex) {
        const trx = await DB.beginTransaction()

        if(!req.username){
            return {
                success: false,
                message: 'Username harus ditentukan... '
            } 
        }

        /** JIKA PHOTO DITEMUKAN **/
        let avatar
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `USR-${randURL}.${filex.extname}`
            avatar = 'avatar/'+aliasName
            await filex.move(Helpers.publicPath(`avatar`), {
                name: aliasName,
                overwrite: true,
            })

            if (!filex.moved()) {
                return {
                    success: false,
                    message: 'Failed upload photo image...'+ profilePic.error()
                }
            }
        }

        const checkUsername = await User.query().where('username', req.username).last()

        if(checkUsername){
            return {
                success: false,
                message: 'Username telah terdaftar... '
            } 
        }

        const checkEmail = await User.query().where('email', req.email).last()
        if(checkEmail){
            return {
                success: false,
                message: 'Email telah terdaftar... '
            } 
        }

        const newuser = new User()
        newuser.fill({
            username: req.username,
            email: req.email,
            password: 'mjm123',
            usertype: req.usertype
        })

        try {
            await newuser.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save user '+ JSON.stringify(error)
            }
        }


        const profile = new UsrProfile()
        profile.fill({
            user_id: newuser.id,
            nama_lengkap: req.nama_lengkap,
            handphone: req.handphone,
            telephone: (req.telephone).replace(/[^0-9]/g, '') || null,
            alamat: req.alamat,
            jenkel: req.jenkel,
            avatar: avatar || null
        })
        try {
            await profile.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save user '+ JSON.stringify(error)
            }
        }

        const usrCabang = await UsrCabang.query().where( w => {
            w.where('user_id', newuser.id)
            w.where('cabang_id', req.cabang_id)
        }).last()

        if(!usrCabang){
            const userCabang = new UsrCabang()
            userCabang.fill({
                user_id: newuser.id,
                cabang_id: req.cabang_id,
                aktif: 'Y'
            })
            try {
                await userCabang.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save user '+ JSON.stringify(error)
                }
            }
        }


        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = (
            await VUser
            .query()
            .with('profile')
            .where('id', params.id)
            .last()
        ).toJSON()
        console.log(data);
        return data
    }

    async UPDATE (params, req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        /** JIKA PHOTO DITEMUKAN **/
        let avatar
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `USR-${randURL}.${filex.extname}`
            avatar = 'avatar/'+aliasName
            await filex.move(Helpers.publicPath(`avatar`), {
                name: aliasName,
                overwrite: true,
            })

            if (!filex.moved()) {
                return {
                    success: false,
                    message: 'Failed upload photo image...'+ profilePic.error()
                }
            }
        }

        const checkUsername = await User.query().where(
            w => {
                w.where('username', req.username)
            }
        ).andWhereNot('id', params.id).last()
        if(checkUsername){
            return {
                success: false,
                message: 'Username telah terdaftar... '
            } 
        }

        const checkEmail = await User.query().where('email', req.email).andWhereNot('id', params.id).last()
        if(checkEmail){
            return {
                success: false,
                message: 'Email telah terdaftar... '
            } 
        }

        const newuser = await User.query().where('id', params.id).last()
        newuser.merge({
            username: req.username,
            email: req.email,
            password: 'mjm123',
            usertype: req.usertype
        })

        try {
            await newuser.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save user '+ JSON.stringify(error)
            }
        }


        const profile = await UsrProfile.query().where('user_id', params.id).last()
        profile.merge({
            user_id: newuser.id,
            nama_lengkap: req.nama_lengkap,
            handphone: req.handphone,
            telephone: (req.telephone).replace(/[^0-9]/g, '') || null,
            alamat: req.alamat,
            jenkel: req.jenkel,
            avatar: avatar || null
        })
        try {
            await profile.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save user '+ JSON.stringify(error)
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params) {
        try {
            const user = await User.query().where('id', params.id).last()
            user.merge({aktif: 'N'})
            await user.save()
            return {
                success: true,
                message: 'Success delete data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Success delete data...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new masterUsers()