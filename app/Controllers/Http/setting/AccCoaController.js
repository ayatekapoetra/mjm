'use strict'

const DB = use('Database')
const _ = require('underscore')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const AccCoaTipe = use("App/Models/akunting/AccCoaTipe")
const AccCoaGroup = use("App/Models/akunting/AccCoaGroup")

class AccCoaController {
    async index ({ auth, view }) {
        let usr = await auth.getUser()

        const sideMenu = await initMenu.SIDEBAR(usr.id)
        let data = await initFunc.RINGKASAN(usr)
        return view.render(
            'setting.akunting.coa.index', {
                data: data,
                menu: sideMenu
        })
    }

    async createGroup ({ request, view }) {
        let req = request.all()
        return view.render(
            'components.coa.add-coa', { data: 'G', form: 'form-create-group' })
    }

    async createAkun ({ request, view }) {
        let req = request.all()
        return view.render(
            'components.coa.add-coa', { data: 'A', form: 'form-create-akun' })
    }

    async storeGroup ( { auth, request } ) {
        let usr
        const req = request.all()
        let resp = {
            success: false,
            message: 'You not authenticated...'
        }

        try {
            usr = await auth.getUser()
        } catch (error) {
            return resp
        }
        
        try {
            let last = await AccCoaGroup.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('coa_tipe', req.coa_tipe)
            }).orderBy('kode', 'desc').last()
            
            let kode
            if(last){
                const str = (last.kode).replace(`${last.coa_tipe}00.`, '')
                kode = `${last.coa_tipe}00.${parseInt(str) + 1}`
            }else{
                kode = `${last?.coa_tipe || req.coa_tipe}00.1`
            }
            // console.log(kode);

            const data = {
                coa_tipe: req.coa_tipe,
                grp_name: req.name,
                kode: kode,
                urut: last?.urut + 1 || 1
            }
            
            const accCoaGroup = new AccCoaGroup()
            accCoaGroup.fill(data)
            await accCoaGroup.save()

            resp.success = true
            resp.message = "Success create data..."
            return resp
        } catch (error) {
            console.log(error);
            resp.message = 'Failed create data...'
            return resp
        }
    }

    async storeAkun ( { auth, request } ) {
        let usr
        const req = request.all()
        let resp = {
            success: false,
            message: 'You not authenticated...'
        }
        
        try {
            usr = await auth.getUser()
        } catch (error) {
            return resp
        }
        
        const tipe = await AccCoaTipe.query().where('id', req.coa_tipe).last()
        const coa = await AccCoa.query().where( w => {
            w.where('coa_tipe', req.coa_tipe)
            if(req.coa_grp){
                w.where('coa_grp', req.coa_grp)
            }
        }).orderBy('kode', 'desc').last()

        let kode
        if(coa){
            let str = coa.toJSON().kode
            let arr = str.split('.')
            const lastItem = arr[arr.length - 1]
            if (arr.length === 3) {
                kode = `${arr[0]}.${arr[1]}.${parseInt(lastItem) + 1}`
            } else {
                kode = `${arr[0]}.${parseInt(lastItem) + 1}`
            }
        }else{
            kode = `${tipe.kode}.1`
        }

        try {

            const data = {
                coa_tipe: req.coa_tipe,
                coa_grp: req.coa_grp,
                level_grp: req.coa_grp ? 3 : 2,
                coa_name: req.name,
                alias: req.alias,
                dk: tipe.dk,
                kode: kode,
                urut: coa?.urut + 1 || 1
            }
            
            const accCoa = new AccCoa()
            accCoa.fill(data)
            await accCoa.save()

            resp.success = true
            resp.message = "Success create data..."
            return resp
        } catch (error) {
            console.log(error);
            resp.message = 'Failed create data...'
            return resp
        }
    }

    async showAkun ( { auth, params, view } ) {
        let data = await AccCoa.query().where('id', params.id).last()
        console.log(data.toJSON());
        return view.render(
            'components.coa.upd-coa', {
                tipe: 'A',
                form: 'form-update-akun',
                data: data.toJSON()
        })
    }

    async showGroup ( { auth, params, view } ) {
        let data = await AccCoaGroup.query().where('id', params.id).last()
        // console.log(data.toJSON());
        return view.render(
            'components.coa.upd-coa', {
                tipe: 'G',
                form: 'form-update-group',
                data: data.toJSON()
        })
    }

    async updateAkun ( { auth, params, request } ) {
        const id = params.id
        const req = request.all()
        const usr = await auth.getUser()
        const trx = await DB.beginTransaction()

        // console.log(usr);
        let resp = {
            success: false,
            message: 'You not authenticated...'
        }

        const tipe = await AccCoaTipe.query().where('id', req.coa_tipe).last()
        const coa = await AccCoa.query().where( w => {
            w.where('coa_tipe', req.coa_tipe)
            if(req.coa_grp){
                w.where('coa_grp', req.coa_grp)
            }
        }).orderBy('kode', 'desc').last()

        let kode
        if(coa){
            let str = coa.toJSON().kode
            let arr = str.split('.')
            const lastItem = arr[arr.length - 1]
            if (arr.length === 3) {
                kode = `${arr[0]}.${arr[1]}.${parseInt(lastItem) + 1}`
            } else {
                kode = `${arr[0]}.${parseInt(lastItem) + 1}`
            }
        }else{
            kode = `${tipe.kode}.1`
        }
        
        const updData = await AccCoa.query().where('id', params.id).last()
        if (updData.is_remove === 'N' && usr.usertype != 'developer') {
            return {
                success: false,
                message: 'Akun tdk dapat diubah...'
            }
        }

        updData.merge({
            coa_tipe: req.coa_tipe,
            coa_grp: req.coa_grp,
            coa_name: req.name,
            dk: tipe.dk,
            is_akun: 'A',
            level_grp: req.coa_grp ? 3 : 2,
            alias: req.alias,
            createdby: usr.id,
            // kode: kode,
            urut: coa?.urut + 1 || 1
        })

        try {
            await updData.save(trx)
            await DB.table('trx_jurnals').where('coa_id', params.id).update('kode', kode)
        } catch (error) {
            await trx.rollback()
            console.log(error);
            resp.message = 'Failed update data...'
            return resp
        }


        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async updateGroup ( { auth, params, request } ) {
        const id = params.id
        const req = request.all()
        const usr = await auth.getUser()
        const trx = await DB.beginTransaction()
        // const kode = await initFunc.GEN_KODE_COA(req)

        // console.log(kode);
        let resp = {
            success: false,
            message: 'You not authenticated...'
        }

        const tipe = await AccCoaTipe.query().where('id', req.coa_tipe).last()
        const coa = await AccCoaGroup.query().where( w => {
            w.where('coa_tipe', req.coa_tipe)
        }).orderBy('kode', 'desc').last()

        let kode
        if(coa){
            let str = coa.toJSON().kode
            let arr = str.split('.')
            const lastItem = arr[arr.length - 1]
            kode = `${arr[0]}.${parseInt(lastItem) + 1}`
        }else{
            kode = `${tipe.kode}.1`
        }
        
        const updData = await AccCoaGroup.query().where('id', params.id).last()
        
        updData.merge({
            coa_tipe: req.coa_tipe,
            grp_name: req.name,
            kode: kode,
            urut: coa?.urut + 1 || 1
        })

        try {
            await updData.save(trx)
        } catch (error) {
            await trx.rollback()
            console.log(error);
            resp.message = 'Failed update data...'
            return resp
        }


        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async destroy ( { auth, params, request } ) {
        const id = params.id
        const req = request.only(['tipe'])
        const usr = await auth.getUser()
        const trx = await DB.beginTransaction()

        try {
            if(req.tipe === 'G'){
                await AccCoaGroup.query().where('id', params.id).delete(trx)
            }else{
                const akun = await AccCoa.query().where('id', params.id).last()
                if(akun.is_remove === 'N'){
                    return {
                        success: false,
                        message: 'Akun tdk dapat di hapus...'
                    }
                }
                await AccCoa.query().where('id', params.id).delete(trx)
            }
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data...'
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }
}

module.exports = AccCoaController