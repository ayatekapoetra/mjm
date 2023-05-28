'use strict'

const _ = require('underscore')
const moment = require('moment')
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
        let req = request.all()
        const user = await userValidate(auth)

        if(!user){
            return view.render('401')
        }

        console.log("REQ-RINGKASAN", req);

        // INSERT LABA DITAHAN
        // const listJurnal = (await TrxJurnal.query().where( w =>{
        //     w.where('coa_id', '>', 40000)
        //     w.where('aktif', 'Y')
        // }).fetch()).toJSON()

        // for (let item of listJurnal) {
        //     console.log(item);
        //     const labaditahan = new TrxJurnal()
        //     labaditahan.fill({
        //         ...item,
        //         id: null,
        //         coa_id: 30003
        //     })
        //     try {
        //         await labaditahan.save()
        //         console.log("SAVE", labaditahan.toJSON());
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }


        let data = await initFunc.RINGKASAN(user)

        for (let nrc of data.neraca) {
            var firstCode = parseInt(nrc.kode)
            var lastCode = firstCode + 9999

            // LOOPING AKUN TYPE
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
            }).getSum('nilai') || 0

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
            }).getSum('nilai') || 0

            if(nrc.dk === 'd'){
                nrc.total = (sumDebit - sumKredit).toLocaleString('id')
            }else{
                nrc.total = (sumKredit - sumDebit).toLocaleString('id')
            }

            // LOOPING AKUN GROUP
            if(nrc.group.length > 0){
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
                    }).getSum('nilai') || 0
        
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
                    }).getSum('nilai') || 0
        
                    if(nrc.dk === 'd'){
                        grp.total = (sumDebitGrp - sumKreditGrp).toLocaleString('id')
                    }else{
                        grp.total = (sumKreditGrp - sumDebitGrp).toLocaleString('id')
                    }

                    if (grp.akun.length > 0) {

                        // LOOPING AKUN DALAM GROUP
                        for (let akun of grp.akun) {
                            const sumDebitGrpAkun = await TrxJurnal.query().where( w => {
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
                                w.where('coa_id', 'like', `${akun.kode}%`)
                            }).getSum('nilai') || 0
                
                            const sumKreditGrpAkun = await TrxJurnal.query().where( w => {
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
                                w.where('coa_id', 'like', `${akun.kode}%`)
                            }).getSum('nilai') || 0
                
                            if(nrc.dk === 'd'){
                                akun.total = (sumDebitGrpAkun - sumKreditGrpAkun).toLocaleString('id')
                            }else{
                                akun.total = (sumKreditGrpAkun - sumDebitGrpAkun).toLocaleString('id')
                            }
                        }
                    }
    
                    // LOOPING AKUN SUBGROUP
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
                        }).getSum('nilai') || 0
            
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
                        }).getSum('nilai') || 0
            
                        if(nrc.dk === 'd'){
                            sub.total = (sumDebitSubGrp - sumKreditSubGrp).toLocaleString('id')
                        }else{
                            sub.total = (sumKreditSubGrp - sumDebitSubGrp).toLocaleString('id')
                        }

                        if(sub.akun.length > 0){

                            // LOOPING AKUN DALAM SUBGROUP
                            for (let akun of sub.akun) {
                                const sumDebitSubGrpAkun = await TrxJurnal.query().where( w => {
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
                                    w.where('coa_id', 'like', `${akun.kode}`)
                                }).getSum('nilai') || 0
                    
                                const sumKreditSubGrpAkun = await TrxJurnal.query().where( w => {
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
                                    w.where('coa_id', 'like', `${akun.kode}`)
                                }).getSum('nilai') || 0
                    
                                if(nrc.dk === 'd'){
                                    akun.total = (sumDebitSubGrpAkun - sumKreditSubGrpAkun).toLocaleString('id')
                                }else{
                                    akun.total = (sumKreditSubGrpAkun - sumDebitSubGrpAkun).toLocaleString('id')
                                }
                            }
                        }
                    }
                }
            }else{
                // LOOPING AKUN DALAM AKUN TYPE
                for (let coa of nrc.akun) {
                    const sumDebitAkun = await TrxJurnal.query().where( w => {
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
                        w.where('coa_id', 'like', `${coa.kode}`)
                    }).getSum('nilai') || 0
        
                    const sumKreditAkun = await TrxJurnal.query().where( w => {
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
                        w.where('coa_id', 'like', `${coa.kode}`)
                    }).getSum('nilai') || 0
        
                    if(nrc.dk === 'd'){
                        coa.total = (sumDebitAkun - sumKreditAkun).toLocaleString('id')
                    }else{
                        coa.total = (sumKreditAkun - sumDebitAkun).toLocaleString('id')
                    }
                }
            }
        }

        req.rangeAwal = req.rangeAwal ||  moment().startOf('year').format('YYYY-MM-DD')
        req.rangeAkhir = req.rangeAkhir || moment().endOf('year').format('YYYY-MM-DD')
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

            if (lbr.group.length > 0) {

                // Looping Group LabaRugi
                for (let grp of lbr.group) {
                    // console.log(grp);
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
                    
                    if(grp.akun?.length > 0){
                        for (let akun of grp.akun) {
                            const sumDebitGrpAkun = await TrxJurnal.query().where( w => {
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
                                w.where('coa_id', 'like', `${akun.kode}`)
                            }).getSum('nilai') || 0
                
                            const sumKreditGrpAkun = await TrxJurnal.query().where( w => {
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
                                w.where('coa_id', 'like', `${akun.kode}`)
                            }).getSum('nilai') || 0
                
                            if(akun.dk === 'd'){
                                akun.total = (sumDebitGrpAkun - sumKreditGrpAkun).toLocaleString('id')
                            }else{
                                akun.total = (sumKreditGrpAkun - sumDebitGrpAkun).toLocaleString('id')
                            }
                        }
                    }
                }
            }else{
                for (let coa of lbr.akun) {
                    
                    const sumDebitAkun = await TrxJurnal.query().where( w => {
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
                        w.where('coa_id', 'like', `${coa.kode}`)
                    }).getSum('nilai') || 0
        
                    const sumKreditAkun = await TrxJurnal.query().where( w => {
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
                        w.where('coa_id', 'like', `${coa.kode}`)
                    }).getSum('nilai') || 0
        
                    if(coa.dk === 'd'){
                        coa.total = (sumDebitAkun - sumKreditAkun).toLocaleString('id')
                    }else{
                        coa.total = (sumKreditAkun - sumDebitAkun).toLocaleString('id')
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
                w.where('coa_id', 'like', `${req.kode}%`)
                w.where('nilai', '!=', 0)
                w.where('aktif', 'Y')
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                if(req.rangeAwal && req.rangeAkhir){
                    w.where('trx_date', '>=', req.rangeAwal)
                    w.where('trx_date', '<=', req.rangeAkhir)
                }
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
