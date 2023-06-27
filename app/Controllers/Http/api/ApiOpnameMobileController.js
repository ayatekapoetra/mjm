'use strict'

const DB = use('Database')
const _ = use("underscore")
const moment = use("moment")
moment.locale('ID')
const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const LogistikStokOpnameItemApps = use("App/Models/logistik/LogistikStokOpnameItemApps")
const version = '1.0'

class ApiOpnameMobileController {
    async userScan ( { auth, request, response } ) {
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

        const data = (
            await LogistikStokOpnameItemApps.query().where( w => {
                w.where('createdby', user.id)
            }).orderBy('kode', 'desc').fetch()
        ).toJSON()

        let grpResult = []
        for (const val of data) {
            const barang = (await Barang.query().where('id', val.barang_id).last())?.toJSON()
            grpResult.push({
                ...val,
                barang: barang
            })
        }
        
        grpResult = _.groupBy(grpResult, 'kode')
        grpResult = Object.keys(grpResult).map(key => {
            return {
                kode: key,
                items: grpResult[key]
            }
        })

        console.log(JSON.stringify(grpResult, null, 2));


        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false
            },
            data: grpResult
        })
    }

    async post ( { auth, request, response } ) {
        let durasi
        var t0 = performance.now()
        var req = request.raw()
        req = JSON.parse(req)

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

        const trx = await DB.beginTransaction()
        for (const v of req) {
            const itemsOpname = new LogistikStokOpnameItemApps()
            itemsOpname.fill({
                kode: v.so,
                barang_id: v.id,
                nm_barang: v.nama,
                stn: v.stn,
                qty_opname: v.qty || 1,
                narasi: "",
                devices: v.devices,
                createdby: user.id,
            })
            try {
                await itemsOpname.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Stokopname Items...'
                }
            }
        }

        await trx.commit()

        const resData = (
            await LogistikStokOpnameItemApps.query().where( w => {
                w.where('createdby', user.id)
                w.where('kode', req[0].so)
            }).fetch()
        ).toJSON()
        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false
            },
            data: resData
        })
    }
}

module.exports = ApiOpnameMobileController

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