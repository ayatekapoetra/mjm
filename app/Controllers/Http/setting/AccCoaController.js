'use strict'

const DB = use('Database')
const _ = require('underscore')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const AccCoaTipe = use("App/Models/akunting/AccCoaTipe")
const AccCoaGroup = use("App/Models/akunting/AccCoaGroup")
const AccCoaSubGroup = use("App/Models/akunting/AccCoaSubGroup")

class AccCoaController {
    async index ({ auth, view }) {
        let usr = await auth.getUser()

        const sideMenu = await initMenu.SIDEBAR(usr.id)
        let data = await initFunc.RINGKASAN(usr)
        // return data
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

        console.log(req);

        if(!req.coa_group){
            const kode = await AccCoaGroup.query().where('coa_tipe', req.coa_tipe).orderBy('id', 'desc').last()
            let strKode = kode ? parseInt(kode.kode) + 1 : (parseInt(`${req.coa_tipe}0`)) + 1
            const accCoaGroup = new AccCoaGroup()
            accCoaGroup.fill({
                id: strKode,
                coa_tipe: req.coa_tipe,
                kode: strKode,
                grp_name: req.name,
                urut: kode?.urut + 1 || 1
            })
            try {
                await accCoaGroup.save()
                return {
                    success: true,
                    message: 'Success create group...'
                }
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed create group...'
                }
            }
        }

        if(!req.coa_subgrp && req.coa_group){
            const kode = await AccCoaSubGroup.query().where( w => {
                w.where('coa_tipe', req.coa_tipe)
                w.where('coa_group', req.coa_group)
            }).orderBy('id', 'desc').last()
            let strKode = kode ? parseInt(kode.kode) + 1 : (parseInt(`${req.coa_group}0`)) + 1
            const accCoaSubGroup = new AccCoaSubGroup()
            accCoaSubGroup.fill({
                id: strKode,
                coa_tipe: req.coa_tipe,
                coa_group: req.coa_group,
                kode: strKode,
                subgrp_name: req.name,
                urut: kode?.urut + 1 || 1
            })
            try {
                await accCoaSubGroup.save()
                return {
                    success: true,
                    message: 'Success create group...'
                }
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed create group...'
                }
            }
        }
    }

    async storeAkun ( { auth, request } ) {
        let usr
        const req = request.all()
        
        try {
            usr = await auth.getUser()
        } catch (error) {
            return resp
        }

        const prefixTipe = (await AccCoaTipe.query().where('id', req.coa_tipe).last())?.toJSON() || null
        const prefixGroup = (await AccCoaGroup.query().where('id', req.coa_group).last())?.toJSON() || null
        const prefixSubGroup = (await AccCoaSubGroup.query().where('id', req.coa_subgrp).last())?.toJSON() || null

        let que
        let kode
        if(req.coa_subgrp){
            console.log('KODE SUB GROUP');
            que = await AccCoa.query().where(w => {
                w.where('coa_subgrp', req.coa_subgrp)
                w.where('coa_grp', req.coa_group)
                w.where('coa_tipe', req.coa_tipe)
            }).last()

            if(!que){
                var str = (await AccCoaSubGroup.query().where('id', req.coa_subgrp).last())?.toJSON().kode
                console.log('STR :::', str);
                console.log('KODE SUB GROUP', parseInt(str + '0'.repeat(2)) + 1);
                kode = parseInt(str + '0'.repeat(2)) + 1
            }else{
                kode = parseInt(que.id) + 1
                console.log('QUE :::', parseInt(que.id) + 1);
            }
        }else if(req.coa_group){
            console.log('KODE GROUP');
            que = await AccCoa.query().where(w => {
                w.where('coa_grp', req.coa_group)
                w.whereNull('coa_subgrp')
            }).last()

            if(!que){
                var str = (await AccCoaGroup.query().where('id', req.coa_group).last())?.toJSON().kode
                kode = parseInt(str + '0'.repeat(3)) + 1
                console.log('KODE SUB GROUP', kode);
            }else{
                kode = parseInt(que.id) + 1
                console.log('QUE :::', kode);
            }
        }else{
            try {
                que = await AccCoa.query().where(w => {
                    w.where('coa_tipe', req.coa_tipe)
                    w.whereNull('coa_grp')
                }).last()
                if(!que){
                    var str = (await AccCoaTipe.query().where('id', req.coa_tipe).last())?.toJSON().kode
                    kode = parseInt(str) + 1
                    // console.log('KODE TIPE', kode);
                }else{
                    kode = parseInt(que.id) + 1
                    // console.log('QUE :::', kode);
                }
                
            } catch (error) {
                console.log(error);
            }
        }

        const GET_SORT = await AccCoa.query().where('coa_tipe', req.coa_tipe).orderBy('urut', 'desc').last()
        
        try {
            
            const data = {
                id: kode,
                coa_tipe: req.coa_tipe,
                coa_tipe_nm: prefixTipe.name,
                coa_grp: req.coa_group || null,
                coa_grp_nm: prefixGroup?.grp_name || null,
                coa_subgrp: req.coa_subgrp || null,
                coa_subgrp_nm: prefixSubGroup?.subgrp_name || null,
                coa_name: req.name,
                alias: req.alias,
                dk: prefixTipe.dk,
                kode: kode,
                urut: GET_SORT?.urut||0 + 1
            }
            
            const accCoa = new AccCoa()
            accCoa.fill(data)
            await accCoa.save()
            return {
                success: true,
                message: "Success create data..."
            }
        } catch (error) {
            console.log(error);
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

    async showSubGroup ( { auth, params, view } ) {
        let data = await AccCoaSubGroup.query().where('id', params.id).last()
        // console.log(data.toJSON());
        return view.render(
            'components.coa.upd-coa', {
                tipe: 'SG',
                form: 'form-update-subgroup',
                data: data.toJSON()
        })
    }

    async updateAkun ( { auth, params, request } ) {
        const req = request.all()
        const usr = await auth.getUser()
        // const trx = await DB.beginTransaction()

        console.log(req);

        let kode

        if(!req.coa_subgrp){
            let str
            if(!req.coa_grp){
                const akunGroup = await AccCoa.query().where( w => {
                    w.where('coa_tipe', req.coa_tipe)
                    w.whereNull('coa_grp')
                    w.whereNull('coa_subgrp')
                }).orderBy('id', 'desc').last()
                
                if(akunGroup){
                    kode = akunGroup.id + 1
                }else{
                    str = req.coa_tipe + '0'.repeat(5 - (req.coa_tipe).length)
                    kode = parseInt(str) + 1
                }
            }else{
                const xakunGroup = await AccCoa.query().where( w => {
                    w.where('coa_tipe', req.coa_tipe)
                    w.where('coa_grp', req.coa_grp)
                    w.whereNull('coa_subgrp')
                }).orderBy('id', 'desc').last()
                
                if(xakunGroup){
                    kode = xakunGroup.id + 1
                }else{
                    str = req.coa_grp + '0'.repeat(5 - (req.coa_grp).length)
                    kode = parseInt(str) + 1
                }
            }
        }else{
            const xxakunGroup = await AccCoa.query().where( w => {
                w.where('coa_tipe', req.coa_tipe)
                w.where('coa_grp', req.coa_grp)
                w.where('coa_subgrp', req.coa_subgrp)
            }).orderBy('id', 'desc').last()
            if(xxakunGroup){
                kode = xxakunGroup.id + 1
            }else{
                str = req.coa_subgrp + '0'.repeat(5 - (req.coa_subgrp).length)
                kode = parseInt(str) + 1
            }
        }
        console.log(kode);

        const accCoaTipe = await AccCoaTipe.query().where('id', req.coa_tipe).last()
        const accCoaSubGroup = await AccCoaSubGroup.query().where('id', req.coa_subgrp).last()
        const accCoaGroup = await AccCoaGroup.query().where('id', req.coa_grp).last()
        
        const URUT = await AccCoa.query().where('coa_tipe', req.coa_tipe).orderBy('id', 'desc').last()

        try {
            await DB
            .table('acc_coas')
            .where('id', params.id)
            .update({
                id: kode,
                coa_tipe: accCoaTipe.id,
                coa_tipe_nm: accCoaTipe.name,
                coa_grp: req.coa_grp,
                coa_grp_nm: accCoaGroup?.grp_name || null,
                coa_subgrp: req.coa_subgrp,
                coa_subgrp_nm: accCoaSubGroup?.subgrp_name || null,
                coa_name: req.name,
                dk: accCoaTipe.dk,
                is_akun: 'A',
                alias: req.alias,
                createdby: usr.id,
                kode: kode,
                urut: URUT?.urut + 1 || 1
            })
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: JSON.stringify(error)
            }
        }

        return {
            success: true,
            message: 'Success update akun...'
        }
    }

    async updateGroup ( { auth, params, request } ) {
        let kode
        let URUT
        const req = request.all()
        const user = await userValidate(auth)
        const trx = await DB.beginTransaction()
        if(!user){
            return {
                success: false,
                message: 'You not authenticated...'
            }
        }

        console.log(req);
        console.log(params.id);

        if(!req.coa_tipe){
            return {
                success: false,
                message: 'Kategori blum ditentukan...'
            }
        }

        if(!req.coa_grp){
            const accGroup = await AccCoaGroup.query().where('coa_tipe', req.coa_tipe).orderBy('id', 'desc').last()
            URUT = await AccCoaGroup.query().where('coa_tipe', req.coa_tipe).getCount()
            kode = (parseInt(accGroup?.id)) + 1 || (`${req.coa_tipe}1`)

            const _accGroup = new AccCoaGroup()
            _accGroup.fill({
                id: kode,
                coa_tipe: req.coa_tipe,
                grp_name: req.name,
                kode: kode,
                urut: URUT + 1
            })

            try {
                await _accGroup.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'ERR AccCoaGroup: '+JSON.stringify(error)
                }
            }
            
        }else{
            const accSubGroup = await AccCoaSubGroup.query().where('coa_group', req.coa_grp).orderBy('id', 'desc').last()
            URUT = await AccCoaSubGroup.query().where('coa_group', req.coa_grp).getCount()
            kode = (parseInt(accSubGroup?.id)) + 1 || (`${req.coa_grp}1`)

            const _accSubGroup = new AccCoaSubGroup()
            _accSubGroup.fill({
                id: kode,
                coa_tipe: req.coa_tipe,
                coa_group: req.coa_grp,
                subgrp_name: req.name,
                kode: kode,
                urut: URUT + 1
            })

            try {
                await _accSubGroup.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'ERR AccCoaSubGroup: '+JSON.stringify(error)
                }
            }
        }

        console.log('KODE :::', kode);

        if(req.tipe === 'SG'){
            await AccCoaSubGroup.query(trx).where('id', params.id).delete()
        }else{
            await AccCoaGroup.query(trx).where('id', params.id).delete()
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async updateSubGroup ( { auth, params, request } ) {
        let kode
        let URUT
        const req = request.all()
        const user = await userValidate(auth)
        const trx = await DB.beginTransaction()
        if(!user){
            return {
                success: false,
                message: 'You not authenticated...'
            }
        }

        console.log(req);
        console.log(params.id);

        if(!req.coa_tipe){
            return {
                success: false,
                message: 'Kategori blum ditentukan...'
            }
        }

        if(!req.coa_grp){
            const accGroup = await AccCoaGroup.query().where('coa_tipe', req.coa_tipe).orderBy('id', 'desc').last()
            URUT = await AccCoaGroup.query().where('coa_tipe', req.coa_tipe).getCount()
            kode = (parseInt(accGroup?.id)) + 1 || (`${req.coa_tipe}1`)

            const _accGroup = new AccCoaGroup()
            _accGroup.fill({
                id: kode,
                coa_tipe: req.coa_tipe,
                grp_name: req.name,
                kode: kode,
                urut: URUT + 1
            })

            try {
                await _accGroup.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'ERR AccCoaGroup: '+JSON.stringify(error)
                }
            }
            
        }else{
            const accSubGroup = await AccCoaSubGroup.query().where('coa_group', req.coa_grp).orderBy('id', 'desc').last()
            URUT = await AccCoaSubGroup.query().where('coa_group', req.coa_grp).getCount()
            kode = (parseInt(accSubGroup?.id)) + 1 || (`${req.coa_grp}1`)

            const _accSubGroup = new AccCoaSubGroup()
            _accSubGroup.fill({
                id: kode,
                coa_tipe: req.coa_tipe,
                coa_group: req.coa_grp,
                subgrp_name: req.name,
                kode: kode,
                urut: URUT + 1
            })

            try {
                await _accSubGroup.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'ERR AccCoaSubGroup: '+JSON.stringify(error)
                }
            }
        }

        console.log('KODE :::', kode);

        if(req.tipe === 'SG'){
            await AccCoaSubGroup.query(trx).where('id', params.id).delete()
        }else{
            await AccCoaGroup.query(trx).where('id', params.id).delete()
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
            }else if(req.tipe === 'SG'){
                await AccCoaSubGroup.query().where('id', params.id).delete(trx)
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