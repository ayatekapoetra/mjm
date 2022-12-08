'use strict'

const version = '1.0'
const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
const initMenu = use("App/Helpers/_sidebar")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const LogTerimaBarangHelpers = use("App/Helpers/LogTerimaBarang")
const KeuPurchasingRequest = use("App/Models/transaksi/KeuPurchasingRequest")
const KeuPurchasingRequestItems = use("App/Models/transaksi/KeuPurchasingRequestItems")

class ApiTerimaBarangController {
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
            const data = await LogTerimaBarangHelpers.LIST(req, user)
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

    async show ( { auth, params, response } ) {
        let durasi
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

        try {
            const data = await LogTerimaBarangHelpers.SHOW(params)
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

    async store ( { auth, request, response } ){
        const req = request.all()
        console.log(req);
        let durasi
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

        if(req.pemasok_id){
            req.isPemasok = 'Y'
            const purchasingReq = (
                await KeuPurchasingRequest.query().where( w => {
                    w.where('id', req.reff_order)
                    w.where('status', 'approved')
                }).last()
            )?.toJSON()

            if(!purchasingReq){
                return response.status(403).json({
                    diagnostic: {
                        ver: version,
                        error: true,
                        message: 'kode purchasing request tidak ditemukan atau sudah tidak berlaku...'
                    }
                })
            }else{
                const requestItems = (await KeuPurchasingRequestItems.query().where('purchasing_id', req.reff_order).fetch()).toJSON()
                if(requestItems.length != req.items.length){
                    return response.status(403).json({
                        diagnostic: {
                            ver: version,
                            error: true,
                            message: 'Jumlah items belum sesuai dengan purchasing request items...'
                        }
                    })
                }

                for (const obj of requestItems) {
                    let listBarang = req.items.map( v => parseInt(v.barang_id))
                    if(!listBarang.includes(obj.barang_id)){
                        return response.status(403).json({
                            diagnostic: {
                                ver: version,
                                error: true,
                                message: 'Items barang tidak sesuai dengan purchasing request items...'
                            }
                        })
                    }
                }

                for (const obj of req.items) {
                    const barang = await Barang.query().where('id', obj.barang_id).last()
                    const checkQty = (await KeuPurchasingRequestItems.query().where( w => {
                        w.where('purchasing_id', req.reff_order)
                        w.where('qty', obj.qty)
                    }).last())?.toJSON()

                    if(!checkQty){
                        return response.status(403).json({
                            diagnostic: {
                                ver: version,
                                error: true,
                                message: 'Quantity items barang ['+barang.nama+'] tidak sesuai dengan purchasing request items...'
                            }
                        })
                    }
                }
            }
        }

        const data = await LogTerimaBarangHelpers.POST(req, user)
        
        return data
    }

    async storePhoto ( { auth, params, response } ){
        let durasi
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

        const data = await KeuPurchasingOrderHelpers.REJECT(params, user)
        if(data.success){
            durasi = await initFunc.durasi(t0)
            return response.status(200).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: false
                },
                data: data
            })
        }else{
            durasi = await initFunc.durasi(t0)
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: true
                },
                data: data.message
            })
        }
    }
}

module.exports = ApiTerimaBarangController

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