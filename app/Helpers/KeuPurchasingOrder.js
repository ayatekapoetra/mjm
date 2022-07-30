'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const logoPath = Helpers.publicPath('logo.png')
const BarangLokasi = use("App/Models/BarangLokasi")
const Image64Helpers = use("App/Helpers/_encodingImages")
const KeuPurchasingRequest = use("App/Models/transaksi/KeuPurchasingRequest")
const KeuPurchasingRequestItems = use("App/Models/transaksi/KeuPurchasingRequestItems")
const KeuPurchasingRequestAttach = use("App/Models/transaksi/KeuPurchasingRequestAttach")

class PurchaseReq {
    async LIST (req, user) {
        console.log('LIST ::', req);
        const ws = await initFunc.WORKSPACE(user)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data

        try {
            
            if(req.keyword){
                data = await KeuPurchasingRequest.query()
                .with('cabang')
                .with('gudang')
                .with('author')
                .with('items', a => {
                    a.with('barang')
                    a.with('pemasok')
                })
                .where( w => {
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.gudang_id){
                        w.where('gudang_id', req.gudang_id)
                    }
                    if(req.status){
                        w.where('status', req.status)
                    }
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.date_begin && req.date_end){
                        w.where('date', '>=', req.date_begin)
                        w.where('date', '<=', req.date_end)
                    }
                })
                .orderBy('kode', 'desc')
                .paginate(halaman, limit)
            }else{
                data = await KeuPurchasingRequest.query()
                    .with('cabang')
                    .with('gudang')
                    .with('author')
                    .with('items', a => {
                        a.with('barang')
                        a.with('pemasok')
                    })
                    .where( w => {
                        w.where('cabang_id', ws.cabang_id)
                    })
                    .orderBy('kode', 'desc')
                    .paginate(halaman, limit)
            }

            if(data){
                return data.toJSON()
            }else{
                return null
            }
        } catch (error) {
            console.log(error);
        }
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        const kode = await initFunc.GEN_KODE_PR(user)
        
        const trxOrderBeli = new KeuPurchasingRequest()
        trxOrderBeli.fill({
            kode: kode,
            cabang_id: req.cabang_id,
            gudang_id: req.gudang_id,
            date: req.date,
            narasi: req.narasi,
            createdby: user.id,
            priority: req.priority
        })
        try {
            await trxOrderBeli.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data '+ JSON.stringify(error)
            }
        }
        
        for (const obj of req.items) {
            const barang = await Barang.query().where('id', obj.barang_id).last()
            const trxOrderBeliItem = new KeuPurchasingRequestItems()
            trxOrderBeliItem.fill({
                purchasing_id: trxOrderBeli.id,
                barang_id: obj.barang_id,
                pemasok_id: obj.pemasok_id,
                metode: obj.metode,
                qty: obj.qty,
                stn: barang.satuan,
            })
            try {
                await trxOrderBeliItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save details '+ JSON.stringify(error)
                }
            }
        }

        // SEND NOTIFICATION REQUEST APPROVAL DOCUMENT
        let arrUserTipe = ['administrator', 'keuangan', 'direktur', 'logistik']
        await initFunc.SEND_NOTIFICATION(
            user, 
            arrUserTipe, 
            {
                header: "New Purchasing Request",
                title: kode,
                link: '/acc/purchasing-request',
                content: user.nama_lengkap + " meminta persetujuan untuk order barang dengan kode Purchasing "+kode,
            }
        )
        
        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async APPROVE (params, user) {
        const trx = await DB.beginTransaction()
        
        const trxOrderBeli = await KeuPurchasingRequest.query().where('id', params.id).last()
        trxOrderBeli.merge({
            status: 'approved',
            approvedby: user.id,
            approved_at: new Date()
        })
        try {
            await trxOrderBeli.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data '+ JSON.stringify(error)
            }
        }

        // SEND NOTIFICATION REQUEST APPROVAL DOCUMENT
        let arrUserTipe = trxOrderBeli.createdby
        await initFunc.SEND_NOTIFICATION(
            user, 
            arrUserTipe, 
            {
                header: "Approved Purchasing Request",
                title: trxOrderBeli.kode,
                link: '/acc/purchasing-request',
                content: user.nama_lengkap + " menyetujui untuk order barang dengan kode Purchasing "+trxOrderBeli.kode,
            }
        )
        
        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async REJECT (params, user) {
        const trx = await DB.beginTransaction()
        
        const trxOrderBeli = await KeuPurchasingRequest.query().where('id', params.id).last()
        trxOrderBeli.merge({
            status: 'reject',
            approvedby: user.id,
            approved_at: new Date()
        })
        try {
            await trxOrderBeli.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data '+ JSON.stringify(error)
            }
        }

        // SEND NOTIFICATION REQUEST APPROVAL DOCUMENT
        let arrUserTipe = trxOrderBeli.createdby
        await initFunc.SEND_NOTIFICATION(
            user, 
            arrUserTipe, 
            {
                header: "Reject Purchasing Request",
                title: trxOrderBeli.kode,
                link: '/acc/purchasing-request',
                content: user.nama_lengkap + " menolak permohonan order barang anda dengan kode Purchasing "+trxOrderBeli.kode,
            }
        )
        
        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = await KeuPurchasingRequest.query()
        .with('cabang')
        .with('gudang')
        .with('approved')
        .with('items', a => {
            a.with('barang')
            a.with('pemasok')
            a.where('aktif', 'Y')
        })
        .where('id', params.id)
        .last()
        if(data){
            // console.log(data.toJSON());
            return data.toJSON()
        }else{
            return null
        }
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        await DB.table('keu_request_orders_items').where('purchasing_id', params.id).update({ aktif: 'N' })

        const trxOrderBeli = await KeuPurchasingRequest.query().where('id', params.id).last()
        trxOrderBeli.merge({
            priority: req.priority,
            date: req.date,
            cabang_id: req.cabang_id,
            gudang_id: req.gudang_id,
            narasi: req.narasi
        })

        try {
            await trxOrderBeli.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data '+ JSON.stringify(error)
            }
        }

        for (const obj of req.items) {
            const barang = await Barang.query().where('id', obj.barang_id).last()
            const trxOrderBeliItem = new KeuPurchasingRequestItems()
            trxOrderBeliItem.fill({
                purchasing_id: trxOrderBeli.id,
                barang_id: obj.barang_id,
                qty: obj.qty,
                stn: barang.satuan,
                pemasok_id: obj.pemasok_id,
                metode: obj.metode,
            })
            try {
                await trxOrderBeliItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save details '+ JSON.stringify(error)
                }
            }
        }

        // SEND NOTIFICATION REQUEST APPROVAL DOCUMENT
        let arrUserTipe = ['administrator', 'developer', 'keuangan', 'direktur', 'logistik']
        await initFunc.SEND_NOTIFICATION(
            user, 
            arrUserTipe, 
            {
                header: "Edit Purchasing Request",
                title: trxOrderBeli.kode,
                link: '/acc/purchasing-request',
                content: user.nama_lengkap + " melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing "+trxOrderBeli.kode,
            }
        )
        
        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
        
    }

    async PRINT (params) {
        let data = (
        await KeuPurchasingRequest.query()
        .with('cabang')
        .with('gudang')
        .with('approved')
        .with('items', a => {
            a.with('barang')
            a.with('pemasok')
            a.where('aktif', 'Y')
        })
        .where('id', params.id)
        .last()).toJSON()
        
        
        let result = _.groupBy(data.items, 'pemasok_id')
        result = Object.keys(result).map(key => {
            return {
                pemasok_id: key,
                date: data.date,
                approved_at: data.approved_at,
                kode: data.kode + '/' + key,
                narasi: data.narasi,
                cabang: data.cabang,
                gudang: data.gudang,
                approved: data.approved,
                priority: data.priority,
                items: result[key]
            }
        })
        // console.log(JSON.stringify(result, null, 2));
        return result
    }
}

module.exports = new PurchaseReq()