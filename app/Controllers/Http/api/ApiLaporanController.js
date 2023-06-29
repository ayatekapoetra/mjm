'use strict'

const _ = require("underscore")
const moment = require("moment")
const VUser = use("App/Models/VUser")
const UsrProfile = use("App/Models/UsrProfile")
const Cabang = use("App/Models/master/Cabang")
const UsrCabang = use("App/Models/UsrCabang")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const Sales = use("App/Models/operational/OpsPelangganBayar")
const Order = use("App/Models/operational/OpsPelangganOrder")
const BarangSold = use("App/Models/operational/OpsPelangganOrderItem")

const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")
const version = '1.0'

class ApiLaporanController {
    async labarugi ({auth, request, response}) {
        let durasi
        let req = request.all()
        var t0 = performance.now()
        const user = await userValidate(auth)
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        req.startDate = req.startDate || moment().startOf('M').format("YYYY-MM-DD")
        req.endDate = req.endDate || moment().endOf('M').format("YYYY-MM-DD")
        

        // AKUN PENDAPATAN
        let pendapatan = []
        const akunPendapatan = (
            await AccCoa.query().where( w => {
                w.where('coa_tipe', 4)
            }).fetch()
        ).toJSON()

        for (const val of akunPendapatan) {
            const trxJurnalKredit = await TrxJurnal.query().where( w => {
                w.where('dk', 'k')
                w.where('aktif', 'Y')
                w.where('is_delay', 'N')
                w.where('coa_id', val.id)
                w.where('trx_date', '>=', req.startDate)
                w.where('trx_date', '<=', req.endDate)
            }).getSum('nilai') || 0
            const trxJurnalDebit = await TrxJurnal.query().where( w => {
                w.where('dk', 'd')
                w.where('aktif', 'Y')
                w.where('is_delay', 'N')
                w.where('coa_id', val.id)
                w.where('trx_date', '>=', req.startDate)
                w.where('trx_date', '<=', req.endDate)
            }).getSum('nilai') || 0
            pendapatan.push({
                ...val,
                kredit: trxJurnalKredit,
                debit: trxJurnalDebit,
                total: trxJurnalKredit - trxJurnalDebit
            })
        }

        // AKUN BIAYA & BEBAN
        let biaya = []
        const akunBiaya = (
            await AccCoa.query().where( w => {
                w.where('coa_tipe', 5)
            }).fetch()
        ).toJSON()
        for (const val of akunBiaya) {
            const trxJurnalKredit = await TrxJurnal.query().where( w => {
                w.where('dk', 'k')
                w.where('aktif', 'Y')
                w.where('is_delay', 'N')
                w.where('coa_id', val.id)
                w.where('trx_date', '>=', req.startDate)
                w.where('trx_date', '<=', req.endDate)
            }).getSum('nilai') || 0
            const trxJurnalDebit = await TrxJurnal.query().where( w => {
                w.where('dk', 'd')
                w.where('aktif', 'Y')
                w.where('is_delay', 'N')
                w.where('coa_id', val.id)
                w.where('trx_date', '>=', req.startDate)
                w.where('trx_date', '<=', req.endDate)
            }).getSum('nilai') || 0
            biaya.push({
                ...val,
                kredit: trxJurnalKredit,
                debit: trxJurnalDebit,
                total: trxJurnalDebit - trxJurnalKredit
            })
        }

        let groupBiaya = _.groupBy(biaya, 'coa_grp_nm')
        groupBiaya = Object.keys(groupBiaya).map(key => {
            return {
                group: key,
                group_id: groupBiaya[key][0].coa_grp,
                groupTot: groupBiaya[key].reduce((a, b) => {
                    return a + b.total
                }, 0),
                items: groupBiaya[key]
            }
        })

        console.log(groupBiaya);

        const totalPendapatan = pendapatan.reduce((a, b) => { return a + b.total }, 0)
        const totalBiaya = groupBiaya.reduce((a, b) => { return a + b.groupTot }, 0)
        const isProfit = totalPendapatan > totalBiaya ? true:false

        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false,
            },
            data: {
                totalPendapatan: totalPendapatan,
                totalBiaya: totalBiaya,
                pendapatan: pendapatan,
                biaya: groupBiaya,
                isProfit: isProfit
            }
        })
    }

    async salesharian ( { auth, request, response } ) {
        let durasi
        let req = request.all()
        var t0 = performance.now()
        const user = await userValidate(auth)
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        req.startDate = req.startDate || moment().startOf('day').format("YYYY-MM-DD HH:mm")
        req.endDate = req.endDate || moment().endOf('day').format("YYYY-MM-DD HH:mm")

        const userCabang = (
            await UsrCabang.query().where('user_id', user.id).fetch()
        ).toJSON()

        let data = []
        for (const val of userCabang) {
            const cabang = await Cabang.query().where('id', val.cabang_id).last()
            const salesHarian = (
                await Sales.query().where( w => {
                    w.where('date_paid', '>=', req.startDate)
                    w.where('date_paid', '<=', req.endDate)
                    w.where('cabang_id', val.cabang_id)
                    w.where('aktif', 'Y')
                }).fetch()
            )?.toJSON()

            data.push({
                cabang_id: val.cabang_id,
                nm_cabang: cabang.nama,
                items: salesHarian
            })
        }
        
        // console.log(data);
        let arrData = data?.map( i => {
            var total = i.items.reduce((a, b) => { return a + b.paid_trx }, 0)
            var tunai = i.items.filter(v => v.metode_paid === 'tunai')
            var non_tunai = i.items.filter(v => v.metode_paid != 'tunai')
            var valTunai = tunai.reduce((a, b) => { return a + b.paid_trx }, 0)
            var valNonTunai = non_tunai.reduce((a, b) => { return a + b.paid_trx }, 0)
            return {
                ...i,
                persenTunai: (valTunai/total) || 0,
                persenNonTunai: (valNonTunai/total) || 0,
                tunai: valTunai,
                non_tunai: valNonTunai,
                total: total,
                items: i.items?.map( j => {
                    return {
                        id: j.id,
                        datetime: j.date_paid || null,
                        metode: j.metode_paid || null,
                        kwitansi: j.no_kwitansi || null,
                        nilai: j.paid_trx || 0,
                    }
                })
            }
        })

        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false,
            },
            data: arrData
        })

    }

    async topbarang ( { auth, request, response } ) {
        let durasi
        let req = request.all()
        var t0 = performance.now()
        const user = await userValidate(auth)
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        const userCabang = (
            await UsrCabang.query().where( w => {
                w.where('user_id', user.id)
                // w.where('aktif', 'Y')
            }).fetch()
        )?.toJSON()

        req.startDate = req.startDate || moment().startOf('day').format("YYYY-MM-DD HH:mm")
        req.endDate = req.endDate || moment().endOf('day').format("YYYY-MM-DD HH:mm")

        let data = []
        for (const cab of userCabang) {
            const cabang = await Cabang.query().where('id', cab.cabang_id).last()
            const order = (
                await Order.query().where( w => {
                    w.where('aktif', 'Y')
                    w.where('cabang_id', cab.cabang_id)
                    w.where('date', '>=', req.startDate)
                    w.where('date', '<=', req.endDate)
                }).fetch()
            )?.toJSON()
            
            console.log(order);
            for (const item of order) {
                const top = (
                    await BarangSold.query()
                    .with('gudang')
                    .with('barang')
                    .where( w => {
                        w.where('aktif', 'Y')
                        w.where('order_id', item.id)
                    }).fetch()
                )?.toJSON()
                for (const v of top) {
                    data.push({
                        cabang_id: cab.cabang_id,
                        nm_cabang: cabang.nama,
                        barang_id: v?.barang?.id,
                        nm_barang: v?.barang?.nama,
                        stn: v?.barang?.satuan,
                        qty: v.qty
                    })
                }
            }
        }

        
        data = _.groupBy(data, 'nm_cabang')
        data = Object.keys(data).map(key => {
            var dataItem = data[key]
            dataItem = _.groupBy(dataItem, 'nm_barang')
            return {
                nm_cabang: key,
                cabang_id: data[key][0].cabang_id,
                items: Object.keys(dataItem).map(obj => {
                    return {
                        nama: obj,
                        id: dataItem[obj][0].barang_id,
                        stn: dataItem[obj][0].stn,
                        totQty: dataItem[obj].reduce((a,b) => { return a + b.qty }, 0),
                        items: dataItem[obj]
                    }
                })
            }
        })

        data = data?.map( v => {
            var topItem = (v.items).sort((a, b) => { return b.totQty - a.totQty }).slice(0, 10)
            return {
                ...v,
                sumItems: topItem.reduce((a, b) => { return a + b.totQty }, 0),
                items: topItem
            }
        })

        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false,
            },
            data: data
        })
    }
}

module.exports = ApiLaporanController

async function userValidate(auth){
    let user
    try {
        user = await auth.authenticator('jwt').getUser()
        return user
    } catch (error) {
        console.log(error);
        return null
    }
}