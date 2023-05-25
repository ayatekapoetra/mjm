'use strict'

const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const Kas = use("App/Models/akunting/Kas")
const Bank = use("App/Models/akunting/Bank")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const Pemasok = use("App/Models/master/Pemasok")
const AccCoa = use("App/Models/akunting/AccCoa")
const Pelanggan = use("App/Models/master/Pelanggan")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")

class GrafikAjaxController {
    async omzet ( { auth, request } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        if(!req.omzetCabang){
            req.omzetCabang = user.cabang_id
        }
        if(!req.omzetStart){
            req.omzetStart = moment().startOf('month').format('YYYY-MM-DD')
        }
        if(!req.omzetEnd){
            req.omzetEnd = moment().endOf('month').format('YYYY-MM-DD')
        }

        let data = []
        const OrderPelanggan = (
                await OpsPelangganOrder.query()
                .with('cabang')
                .where( w => {
                    w.where('cabang_id', req.omzetCabang)
                    w.where('date', '>=', req.omzetStart)
                    w.where('date', '<=', req.omzetEnd)
                }).fetch()
            ).toJSON()
        

        data = OrderPelanggan.map(obj => {
            return {
                ...obj,
                kd_cabang: obj.cabang.kode,
                nm_cabang: obj.cabang.nama,
                tglFilter: moment(obj.date).format('DD MMM')
            }
        })

        let dataGroupCabang = _.groupBy(data, 'kd_cabang')
        dataGroupCabang = Object.keys(dataGroupCabang).map(key => {
            return {
                kode: key,
                items: dataGroupCabang[key]
            }
        })

        
        let dataChart = []

        for (const obj of dataGroupCabang) {
            let group = _.groupBy(obj.items, 'tglFilter')
            Object.keys(group).map(key => {
                dataChart.push({
                    kode: obj.kode,
                    tgl: key,
                    total: group[key].reduce((a, b) => { return a + b.grandtot_trx }, 0)
                })
            })
        }
        return dataChart
    }

    async hutangPiutang ( { auth, request } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        if(!req.hpCabang){
            req.hpCabang = user.cabang_id
        }
        if(!req.hpStart){
            req.hpStart = moment().startOf('month').format('YYYY-MM-DD')
        }
        if(!req.hpEnd){
            req.hpEnd = moment().endOf('month').format('YYYY-MM-DD')
        }

        console.log('REQ :::', req);
        const dataHutangKre = await TrxJurnal.query().where( w => {
            w.where('dk', 'k')
            w.where('coa_id', '21005')
            w.where('cabang_id', req.hpCabang)
            w.where('trx_date', '>=', req.hpStart)
            w.where('trx_date', '<=', req.hpEnd)
            w.where('aktif', 'Y')
        }).getSum('nilai') || 0
        const dataHutangDeb = await TrxJurnal.query().where( w => {
            w.where('dk', 'd')
            w.where('coa_id', '21005')
            w.where('cabang_id', req.hpCabang)
            w.where('trx_date', '>=', req.hpStart)
            w.where('trx_date', '<=', req.hpEnd)
            w.where('aktif', 'Y')
        }).getSum('nilai') || 0
        let totHutang = dataHutangKre - dataHutangDeb

        const dataPiutangKre = await TrxJurnal.query().where( w => {
            w.where('dk', 'k')
            w.where('coa_id', '11005')
            w.where('cabang_id', req.hpCabang)
            w.where('trx_date', '>=', req.hpStart)
            w.where('trx_date', '<=', req.hpEnd)
            w.where('aktif', 'Y')
        }).getSum('nilai') || 0
        const dataPiutangDeb = await TrxJurnal.query().where( w => {
            w.where('dk', 'd')
            w.where('coa_id', '11005')
            w.where('cabang_id', req.hpCabang)
            w.where('trx_date', '>=', req.hpStart)
            w.where('trx_date', '<=', req.hpEnd)
            w.where('aktif', 'Y')
        }).getSum('nilai') || 0

        let totPiutang = dataPiutangDeb - dataPiutangKre
        return [
            {label: "Piutang Dagang", value: totPiutang, labelColor: '#FFF'},
            {label: "Hutang Dagang", value: totHutang, labelColor: '#FFF'},
        ]
    }
}

module.exports = GrafikAjaxController


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
