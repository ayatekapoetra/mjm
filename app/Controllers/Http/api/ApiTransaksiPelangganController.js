'use strict'

const version = '1.0'
const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const OrderPelangganHelpers = use("App/Helpers/OrdPelanggan")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")

class ApiTransaksiPelangganController {
    async index ({request, auth, response}) {
        let durasi
        var t0 = performance.now()
        var req = request.all()

        const user = await userValidate(auth)
        console.log(user);
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        try {
            let data = (
                await OpsPelangganOrder.query()
                .where( w => {
                    w.where('aktif', 'Y')
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.pelanggan_id){
                        w.where('pelanggan_id', req.pelanggan_id)
                    }
                    if(req.status){
                        w.where('status', req.status)
                    }
                    if(req.start_date && req.end_date){
                        w.where('date', '>=', moment(req.start_date).format('YYYY-MM-DD HH:mm'))
                        w.where('date', '<=', moment(req.end_date).format('YYYY-MM-DD HH:mm'))
                    }
                }).fetch()
            ).toJSON()
            
            data = _.groupBy(data, 'status')
            data = Object.keys(data).map(key => {
                return {
                    status: key,
                    length: data[key].length,
                    total_trx: data[key].reduce((a, b) => { return a + b.grandtot_trx }, 0),
                    sisa_trx: data[key].reduce((a, b) => { return a + b.sisa_trx }, 0),
                    items: data[key]
                }
            })

            durasi = await initFunc.durasi(t0)
            return response.status(200).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: false
                },
                data: data
            })
        } catch (error) {
            durasi = await initFunc.durasi(t0)
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: true
                },
                data: error
            })
        }
    }
}

module.exports = ApiTransaksiPelangganController

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