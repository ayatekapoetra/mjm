'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const SysOption = use("App/Models/SysOption")

class settingOption {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        try {
            data = (
                await SysOption
                .query()
                .where( w => {
                    w.where('status', 'Y')
                    if(req.group){
                        w.where('group', `like`, `%${req.group}%`)
                    }
                    if(req.teks){
                        w.where('teks', `like`, `%${req.teks}%`)
                    }
                    if(req.nilai){
                        w.where('nilai', `like`, `%${req.nilai}%`)
                    }
                })
                .orderBy([{column: 'group'}, {column: 'urut'}])
                .paginate(halaman, limit)
            ).toJSON()
        } catch (error) {
            console.log(error);
        }

        return data
    }

    async POST (req, user, filex) {
        const trx = await DB.beginTransaction()
        
        const sysOption = new SysOption()
        sysOption.fill({
            group: (req.group).toLowerCase(),
            teks: req.teks,
            nilai: (req.nilai).toLowerCase(),
            urut: req.urut
        })

        try {
            await sysOption.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save cabang '+ JSON.stringify(error)
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
            await SysOption
            .query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        console.log(req);
        const sysOption = await SysOption.query().where('id', params.id).last()
        sysOption.merge({
            group: (req.group).toLowerCase(),
            teks: req.teks,
            nilai: (req.nilai).toLowerCase(),
            urut: req.urut
        })

        try {
            await sysOption.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save cabang '+ JSON.stringify(error)
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
            await SysOption.query().where('id', params.id).delete()
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

module.exports = new settingOption()