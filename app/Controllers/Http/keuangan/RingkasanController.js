'use strict'

const _ = require('underscore')
const User = use("App/Models/User")
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const AccCoa = use("App/Models/akunting/AccCoa")
// const UsrWorkspace = use("App/Models/UsrWorkspace")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")

class RingkasanController {
    async index ( { auth, view } ) {
        let usr
        await initFunc.UPDATE_JURNAL_DELAY()
        await initFunc.SUM_PEMBAYARAN_PELANGGAN()
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)
            return view.render('keuangan._ringkasan.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        const req = request.all()
        const user = await userValidate(auth)
        
        if(!user){
            return view.render('401')
        }

        let data = await initFunc.RINGKASAN(user)
        

        console.log(req);
        for (let nrc of data.neraca) {
            var firstCode = parseInt(nrc.kode)
            var lastCode = firstCode + 9999

            const sumDebit = await TrxJurnal.query().where( w => {
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                if(req.rangeAwal && req.rangeAkhir){
                    w.where('trx_date', '>=', req.rangeAwal)
                    w.where('trx_date', '<=', req.rangeAkhir)
                }
                w.where('is_delay', 'N')
                w.where('aktif', 'Y')
                w.where('dk', 'd')
                w.where('coa_id', '>=', firstCode)
                w.where('coa_id', '<=', lastCode)
            }).getSum('nilai')

            const sumKredit = await TrxJurnal.query().where( w => {
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                if(req.rangeAwal && req.rangeAkhir){
                    w.where('trx_date', '>=', req.rangeAwal)
                    w.where('trx_date', '<=', req.rangeAkhir)
                }
                w.where('is_delay', 'N')
                w.where('aktif', 'Y')
                w.where('dk', 'k')
                w.where('coa_id', '>=', firstCode)
                w.where('coa_id', '<=', lastCode)
            }).getSum('nilai')

            if(nrc.dk === 'd'){
                nrc.total = (sumDebit - sumKredit).toLocaleString('id')
            }else{
                nrc.total = (sumKredit - sumDebit).toLocaleString('id')
            }

            // Looping Group Neraca
            for (let grp of nrc.group) {
                const sumDebitGrp = await TrxJurnal.query().where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.rangeAwal && req.rangeAkhir){
                        w.where('trx_date', '>=', req.rangeAwal)
                        w.where('trx_date', '<=', req.rangeAkhir)
                    }
                    w.where('is_delay', 'N')
                    w.where('aktif', 'Y')
                    w.where('dk', 'd')
                    w.where('coa_id', 'like', `${grp.kode}%`)
                }).getSum('nilai')
    
                const sumKreditGrp = await TrxJurnal.query().where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.rangeAwal && req.rangeAkhir){
                        w.where('trx_date', '>=', req.rangeAwal)
                        w.where('trx_date', '<=', req.rangeAkhir)
                    }
                    w.where('is_delay', 'N')
                    w.where('aktif', 'Y')
                    w.where('dk', 'k')
                    w.where('coa_id', 'like', `${grp.kode}%`)
                }).getSum('nilai')
    
                if(nrc.dk === 'd'){
                    grp.total = (sumDebitGrp - sumKreditGrp).toLocaleString('id')
                }else{
                    grp.total = (sumKreditGrp - sumDebitGrp).toLocaleString('id')
                }

                // Looping SubGroup
                for (let sub of grp.subgroup) {
                    const sumDebitSubGrp = await TrxJurnal.query().where( w => {
                        if(req.cabang_id){
                            w.where('cabang_id', req.cabang_id)
                        }
                        if(req.rangeAwal && req.rangeAkhir){
                            w.where('trx_date', '>=', req.rangeAwal)
                            w.where('trx_date', '<=', req.rangeAkhir)
                        }
                        w.where('is_delay', 'N')
                        w.where('aktif', 'Y')
                        w.where('dk', 'd')
                        w.where('coa_id', 'like', `${sub.kode}%`)
                    }).getSum('nilai')
        
                    const sumKreditSubGrp = await TrxJurnal.query().where( w => {
                        if(req.cabang_id){
                            w.where('cabang_id', req.cabang_id)
                        }
                        if(req.rangeAwal && req.rangeAkhir){
                            w.where('trx_date', '>=', req.rangeAwal)
                            w.where('trx_date', '<=', req.rangeAkhir)
                        }
                        w.where('is_delay', 'N')
                        w.where('aktif', 'Y')
                        w.where('dk', 'k')
                        w.where('coa_id', 'like', `${sub.kode}%`)
                    }).getSum('nilai')
        
                    if(nrc.dk === 'd'){
                        sub.total = (sumDebitSubGrp - sumKreditSubGrp).toLocaleString('id')
                    }else{
                        sub.total = (sumKreditSubGrp - sumDebitSubGrp).toLocaleString('id')
                    }
                }
            }
        }

        for (let lbr of data.labarugi) {
            var firstCode = parseInt(lbr.kode)
            var lastCode = firstCode + 9999

            const sumDebit = await TrxJurnal.query().where( w => {
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                if(req.rangeAwal && req.rangeAkhir){
                    w.where('trx_date', '>=', req.rangeAwal)
                    w.where('trx_date', '<=', req.rangeAkhir)
                }
                w.where('is_delay', 'N')
                w.where('aktif', 'Y')
                w.where('dk', 'd')
                w.where('coa_id', '>=', firstCode)
                w.where('coa_id', '<=', lastCode)
            }).getSum('nilai')

            const sumKredit = await TrxJurnal.query().where( w => {
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                if(req.rangeAwal && req.rangeAkhir){
                    w.where('trx_date', '>=', req.rangeAwal)
                    w.where('trx_date', '<=', req.rangeAkhir)
                }
                w.where('is_delay', 'N')
                w.where('aktif', 'Y')
                w.where('dk', 'k')
                w.where('coa_id', '>=', firstCode)
                w.where('coa_id', '<=', lastCode)
            }).getSum('nilai')

            if(lbr.dk === 'd'){
                lbr.total = (sumDebit - sumKredit).toLocaleString('id')
            }else{
                lbr.total = (sumKredit - sumDebit).toLocaleString('id')
            }

            // Looping Group LabaRugi
            for (let grp of lbr.group) {
                const sumDebitGrp = await TrxJurnal.query().where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.rangeAwal && req.rangeAkhir){
                        w.where('trx_date', '>=', req.rangeAwal)
                        w.where('trx_date', '<=', req.rangeAkhir)
                    }
                    w.where('is_delay', 'N')
                    w.where('aktif', 'Y')
                    w.where('dk', 'd')
                    w.where('coa_id', 'like', `${grp.kode}%`)
                }).getSum('nilai')
    
                const sumKreditGrp = await TrxJurnal.query().where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.rangeAwal && req.rangeAkhir){
                        w.where('trx_date', '>=', req.rangeAwal)
                        w.where('trx_date', '<=', req.rangeAkhir)
                    }
                    w.where('is_delay', 'N')
                    w.where('aktif', 'Y')
                    w.where('dk', 'k')
                    w.where('coa_id', 'like', `${grp.kode}%`)
                }).getSum('nilai')
    
                if(lbr.dk === 'd'){
                    grp.total = (sumDebitGrp - sumKreditGrp).toLocaleString('id')
                }else{
                    grp.total = (sumKreditGrp - sumDebitGrp).toLocaleString('id')
                }

                // Looping SubGroup
                for (let sub of grp.subgroup) {
                    const sumDebitSubGrp = await TrxJurnal.query().where( w => {
                        if(req.cabang_id){
                            w.where('cabang_id', req.cabang_id)
                        }
                        if(req.rangeAwal && req.rangeAkhir){
                            w.where('trx_date', '>=', req.rangeAwal)
                            w.where('trx_date', '<=', req.rangeAkhir)
                        }
                        w.where('is_delay', 'N')
                        w.where('aktif', 'Y')
                        w.where('dk', 'd')
                        w.where('coa_id', 'like', `${sub.kode}%`)
                    }).getSum('nilai')
        
                    const sumKreditSubGrp = await TrxJurnal.query().where( w => {
                        if(req.cabang_id){
                            w.where('cabang_id', req.cabang_id)
                        }
                        if(req.rangeAwal && req.rangeAkhir){
                            w.where('trx_date', '>=', req.rangeAwal)
                            w.where('trx_date', '<=', req.rangeAkhir)
                        }
                        w.where('is_delay', 'N')
                        w.where('aktif', 'Y')
                        w.where('dk', 'k')
                        w.where('coa_id', 'like', `${sub.kode}%`)
                    }).getSum('nilai')
        
                    if(lbr.dk === 'd'){
                        sub.total = (sumDebitSubGrp - sumKreditSubGrp).toLocaleString('id')
                    }else{
                        sub.total = (sumKreditSubGrp - sumDebitSubGrp).toLocaleString('id')
                    }
                }
            }
        }

        return view.render('keuangan._ringkasan.list', data)
    }

    async sumValues ( { request } ) {
        const req = request.all()
        req.cabang_id = req.cabang_id != '' ? req.cabang_id : null
        const data = await initFunc.GET_TOTAL_VALUE_AKUN(req.cabang_id, req.kode, req.rangeAwal, req.rangeAkhir)
        return data
    }

    async profitLoss ( { request } ) {
        const req = request.all()
        const { cabang_id, rangeAwal, rangeAkhir } = req
        const data = await initFunc.GET_PNL(cabang_id, rangeAwal, rangeAkhir)
        // console.log(data);
        return data
    }

    async listDetails ( { request, view } ) {
        const req = request.all()
        console.log(req);
        const data = (
            await TrxJurnal.query().with('coa').where( w => {
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                if(req.rangeAwal && req.rangeAkhir){
                    w.where('trx_date', '>=', req.rangeAwal)
                    w.where('trx_date', '<=', req.rangeAkhir)
                }
                w.where('coa_id', 'like', `${req.kode}%`)
                w.where('nilai', '<>', 0)
                w.where('aktif', 'Y')
            }).orderBy([
                {column: 'trx_date', order: 'asc'},
                {column: 'coa_id', order: 'asc'}
            ]).fetch()
        ).toJSON()

        console.log(data);

        return view.render('keuangan._ringkasan.list-details', {list: data})
    }
}

module.exports = RingkasanController

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
