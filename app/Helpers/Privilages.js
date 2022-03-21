'use strict'

const DB = use('Database')
const initFunc = use("App/Helpers/initFunc")
const UsrPrivilage = use("App/Models/UsrPrivilage")
const VPrivilage = use("App/Models/VPrivilage")

class settingPrivilages {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data = (await VPrivilage.query().where(
            w => {
                w.where('aktif', 'Y')
                if(req.usertype){
                    w.where('usertype', req.usertype)
                }
                if(req.nama_lengkap){
                    w.where('nama_lengkap', req.nama_lengkap)
                }
                if(req.konten){
                    w.where('konten', req.konten)
                }
            }
        ).paginate(halaman, limit)).toJSON()
        return data
    }

    async POST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        

        const checkUsername = await VPrivilage.query().where(
            w => {
                w.where('user_id', req.user_id)
                w.where('konten', req.konten)
            }
        ).last()
        if(checkUsername){
            return {
                success: false,
                message: 'Username telah terdaftar... '
            } 
        }

        const newakses = new UsrPrivilage()
        newakses.fill({
            user_id: req.user_id,
            konten: req.konten,
            createdby: user.id,
            create: req.create ? "Y" : null,
            read: req.read ? "Y" : null,
            update: req.update ? "Y" : null,
            delete: req.delete ? "Y" : null
        })

        try {
            await newakses.save(trx)
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

    async SHOW (params) {
        const data = (
            await VPrivilage
            .query()
            .where('id', params.id)
            .last()
        ).toJSON()
        // console.log(data);
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()

        const newakses = await UsrPrivilage.query().where('id', params.id).last()
        newakses.merge({
            user_id: req.user_id,
            konten: req.konten,
            createdby: user.id,
            create: req.create ? "Y" : null,
            read: req.read ? "Y" : null,
            update: req.update ? "Y" : null,
            delete: req.delete ? "Y" : null
        })

        try {
            await newakses.save(trx)
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
        // console.log(params);
        try {
            await UsrPrivilage.query().where('id', params.id).delete()
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

module.exports = new settingPrivilages()