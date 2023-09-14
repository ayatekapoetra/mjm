'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
moment.locale('ID')
const initMenu = use("App/Helpers/_sidebar")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")

class BukuBesarController {
    async index ( { auth, view } ) {
        let usr
        try {
            usr = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(usr.id)

            const coa = (await AccCoa.query().fetch()).toJSON()
            let data = _.groupBy(coa, 'coa_tipe_nm')
            data = Object.keys(data).map(key => {
                return {
                    tipe: key,
                    items: data[key]
                }
            })
            return view.render('report.buku-besar.index', {
                menu: sideMenu,
                akun: data
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

        console.log(req);

        let data = (
            await TrxJurnal.query().where( w => {
                w.where('aktif', 'Y')
                w.where('coa_id', req.coa_id)
                w.where('trx_date', '>=', req.beginDate)
                w.where('trx_date', '<=', req.finishDate)
            }).orderBy('trx_date', 'asc').fetch()
        ).toJSON()

        data = data.map( v => ({
            ...v, 
            tanggal: moment(v.trx_date).format('dddd, DD MMMM YYYY'),
            nilai_rp: (v.nilai)?.toLocaleString('ID'),
            saldo_rp: (v.saldo).toLocaleString('ID')
        }))

        console.log(data);

        return view.render('report.buku-besar.list', {
            list: data
        })
    }
}

module.exports = BukuBesarController

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
