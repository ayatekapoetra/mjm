'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Equipment = use("App/Models/master/Equipment")

class masterEquipment {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await Equipment
                .query()
                .with('bisnis')
                .with('cabang')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.nama){
                        w.where('nama', 'like', `%${req.nama}%`)
                    }
                    if(req.identity){
                        w.where('identity', 'like', `%${req.identity}%`)
                    }
                    if(req.model){
                        w.where('model', 'like', `%${req.model}%`)
                    }
                    if(req.group){
                        w.where('group', req.group)
                    }
                    if(req.tipe){
                        w.where('tipe', req.tipe)
                    }
                    if(req.manufaktur){
                        w.where('manufaktur', req.manufaktur)
                    }
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await Equipment
                .query()
                .with('bisnis')
                .with('cabang')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async POST (req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        /** JIKA PHOTO DITEMUKAN **/
        let avatar
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `UNIT-${randURL}.${filex.extname}`
            avatar = 'images/equipments/'+aliasName
            await filex.move(Helpers.publicPath(`images/equipments`), {
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
        
        const equipment = new Equipment()
        equipment.fill({
            bisnis_id: ws.bisnis_id,
            kode: req.kode,
            nama: req.nama,
            model: req.model || null,
            identity: req.identity || null,
            group: req.group || null,
            tipe: req.tipe || null,
            manufaktur: req.manufaktur,
            createdby: user.id,
            coa_in: req.coa_in,
            coa_out: req.coa_out,
            photo: avatar
        })

        try {
            await equipment.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pelanggan '+ JSON.stringify(error)
            }
        }
        // console.log(equipment.toJSON());
        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = (
            await Equipment
            .query()
            .with('bisnis')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()
        // console.log(req);

        let avatar
        if(filex){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `UNIT-${randURL}.${filex.extname}`
            avatar = 'images/equipments/'+aliasName
            await filex.move(Helpers.publicPath(`images/equipments`), {
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
        const equipment = await Equipment.query().where('id', params.id).last()
        equipment.merge({
            bisnis_id: ws.bisnis_id,
            kode: req.kode,
            nama: req.nama,
            model: req.model || null,
            identity: req.identity || null,
            group: req.group || null,
            tipe: req.tipe || null,
            manufaktur: req.manufaktur,
            createdby: user.id,
            coa_in: req.coa_in,
            coa_out: req.coa_out,
            photo: avatar || null
        })

        // console.log(equipment.toJSON());
        try {
            await equipment.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save pelanggan '+ JSON.stringify(error)
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
            await Equipment.query().where('id', params.id).delete()
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

module.exports = new masterEquipment()