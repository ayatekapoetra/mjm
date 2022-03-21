'use strict'

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const BisnisUnit = use("App/Models/BisnisUnit")
const Pemasok = use("App/Models/master/Pemasok")
const BarangLokasi = use("App/Models/BarangLokasi")
const LampiranFile = use("App/Models/LampiranFile")
const TrxOrderBeli = use("App/Models/transaksi/TrxOrderBeli")
const TrxFakturBeliHelpers = use("App/Helpers/TrxFakturBeli")
const TrxTerimaBarangHelpers = use("App/Helpers/TrxTerimaBarang")
const TrxOrderBeliItem = use("App/Models/transaksi/TrxOrderBeliItem")

class PurchaseReq {
    async LIST (req, ws) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        if(req.keyword){
            data = await TrxOrderBeli.query()
            .with('files')
            .with('bisnis')
            .with('cabang')
            .with('gudang')
            .with('items', a => {
                a.with('barang')
                a.with('pemasok')
                a.with('equipment')
                a.with('userValidate')
                a.with('userApprove')
            })
            .where( w => {
                w.where('bisnis_id', ws.bisnis_id)
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
            })
            .orderBy('kode', 'desc')
            .paginate(halaman, limit)
        }else{
            data = await TrxOrderBeli.query()
                .with('files')
                .with('bisnis')
                .with('cabang')
                .with('gudang')
                .with('items', a => {
                    a.with('barang')
                    a.with('pemasok')
                    a.with('equipment')
                    a.with('userValidate')
                    a.with('userApprove')
                })
                .where('bisnis_id', ws.bisnis_id)
                .orderBy('kode', 'desc')
                .paginate(halaman, limit)
        }
       
        if(data){
            return data.toJSON()
        }else{
            return null
        }
    }

    async POST (req, user, filex) {
        const {cabang_id, gudang_id, description, date_ro, items} = req
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const kode = await initFunc.GEN_KODE_PR(ws.bisnis_id)

        try {
            const trxOrderBeli = new TrxOrderBeli()
            trxOrderBeli.fill({
                bisnis_id: ws.bisnis_id,
                kode: kode,
                cabang_id: cabang_id,
                gudang_id: gudang_id,
                date_ro: date_ro,
                description: description,
                createdby: user.id
            })

            await trxOrderBeli.save()

            for (const obj of items) {
                const trxOrderBeliItem = new TrxOrderBeliItem()
                trxOrderBeliItem.fill({
                    ro_id: trxOrderBeli.id,
                    barang_id: obj.barang_id,
                    stn: obj.satuan,
                    qty_req: obj.qty,
                    prioritas: obj.prioritas,
                    equipment_id: obj.equipment_id ? obj.equipment_id : null,
                    description: obj.description
                })

                await trxOrderBeliItem.save()
            }

            if(filex){
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `RO-${randURL}.${filex.extname}`
                var uriLampiran = '/upload/'+aliasName
                await filex.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })

                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    ro_id: trxOrderBeli.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })

                await lampiranFile.save()
            }
            
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

    async EDIT (params, req, user, filex) {
        const {cabang_id, gudang_id, description, date_ro, items} = req

        try {
            let trxOrderBeli = await TrxOrderBeli.query().where('id', params.id).last()
            trxOrderBeli.merge({
                cabang_id: cabang_id,
                gudang_id: gudang_id,
                date_ro: date_ro,
                description: description,
                createdby: user.id
            })

            await trxOrderBeli.save()

            /** CARI ITEMS BARANG **/
            let arrItems = (
                await TrxOrderBeliItem
                    .query()
                    .where('ro_id', trxOrderBeli.id)
                    .fetch()
            ).toJSON()

            for (const obj of arrItems) {
                let eksistData = await TrxOrderBeliItem.query().where('id', obj.id).last()
                await eksistData.delete()
            }

            for (const obj of items) {
                const trxOrderBeliItem = new TrxOrderBeliItem()
                trxOrderBeliItem.fill({
                    ro_id: trxOrderBeli.id,
                    barang_id: obj.barang_id,
                    stn: obj.satuan,
                    qty_req: obj.qty,
                    prioritas: obj.prioritas,
                    equipment_id: obj.equipment_id ? obj.equipment_id : null,
                    description: obj.description
                })

                await trxOrderBeliItem.save()
            }

            if(filex){
                /** DELETE LAMPIRAN **/
                let eksistLampiran = await LampiranFile.query().where('ro_id', params.id).last()
                if(eksistLampiran){
                await eksistLampiran.delete()
            }
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `RO-${randURL}.${filex.extname}`
                var uriLampiran = '/upload/'+aliasName
                await filex.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })

                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    ro_id: trxOrderBeli.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })

                await lampiranFile.save()
            }
            
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

    async SHOW (params) {
        const data = await TrxOrderBeli.query()
        .with('files')
        .with('bisnis')
        .with('cabang')
        .with('gudang')
        .with('items', a => {
            a.with('barang')
            a.with('pemasok')
            a.with('equipment')
            a.with('userApprove', b => b.with('profile'))
            a.with('userValidate', b => b.with('profile'))
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
        let trxOrderBeli
        let trxOrderBeliItem
        try {
            for (const obj of req.items.items) {
                let dataItem
                if(req.action === 'validated'){
                    dataItem = {
                        barang_id: obj.barang_id,
                        description: obj.description,
                        equipment_id: obj.equipment_id || null,
                        pemasok_id: obj.pemasok_id,
                        metode: obj.metode,
                        prioritas: obj.prioritas,
                        qty_req: obj.qty_req,
                        qty_acc: obj.qty_acc,
                        stn: obj.satuan,
                        user_validated: user.id,
                        date_validated: new Date()
                    }

                    trxOrderBeliItem = await TrxOrderBeliItem.query().where('id', obj.id).last()
                    trxOrderBeliItem.merge(dataItem)
                    await trxOrderBeliItem.save()

                    trxOrderBeli = await TrxOrderBeli.query().where('id', params.id).last()
                    trxOrderBeli.merge({
                        description: req.items.description,
                        date_ro: req.items.date_ro,
                        cabang_id: req.items.cabang_id,
                        gudang_id: req.items.gudang_id,
                        status: 'approved'
                    })
    
                    await trxOrderBeli.save()
    
                }else if(req.action === 'approved'){
                    dataItem = {
                        barang_id: obj.barang_id,
                        description: obj.description,
                        equipment_id: obj.equipment_id || null,
                        pemasok_id: obj.pemasok_id,
                        metode: obj.metode,
                        prioritas: obj.prioritas,
                        qty_req: obj.qty_req,
                        qty_acc: obj.qty_acc,
                        stn: obj.satuan,
                        user_validated: user.id,
                        user_approved: user.id,
                        date_validated: new Date(),
                        date_approved: new Date()
                    }

                    trxOrderBeliItem = await TrxOrderBeliItem.query().where('id', obj.id).last()
                    trxOrderBeliItem.merge(dataItem)
                    await trxOrderBeliItem.save()

                    trxOrderBeli = await TrxOrderBeli.query().where('id', params.id).last()
                    trxOrderBeli.merge({
                        description: req.items.description,
                        date_ro: req.items.date_ro,
                        cabang_id: req.items.cabang_id,
                        gudang_id: req.items.gudang_id,
                        status: 'finish'
                    })

                    await trxOrderBeli.save()
                }
                
            }

            const tempFaktur = (
                await TrxOrderBeli
                .query()
                .with('items')
                .where('id', params.id)
                .last()
            ).toJSON()


            /** JIKA STATUS FINISH
             * INSERT DATA KE FAKTUR PEMBELIAN JIKA METODE KREDIT
             * ATAU INSERT DATA KE PENERIMAAN BARANG JIKA METODE TUNAI **/

            if(tempFaktur.status === 'finish'){
                /** GROUP DATA DENGAN METODE **/
                let itemKredit = (
                    await TrxOrderBeliItem.query().where( w => {
                        w.where('ro_id', tempFaktur.id)
                        w.where('metode', 'kredit')
                    }).fetch()
                ).toJSON()
    
                let itemTunai = (
                    await TrxOrderBeliItem.query().where( w => {
                        w.where('ro_id', tempFaktur.id)
                        w.where('metode', 'tunai')
                    }).fetch()
                ).toJSON()

                /** GROUPING PEMASOK METODE KREDIT **/
                if(itemKredit.length > 0){
                    let groupPemasok = _.groupBy(itemKredit, 'pemasok_id')
                    groupPemasok = Object.keys(groupPemasok).map(key => {
                        return {
                            pemasok_id: key,
                            items: groupPemasok[key]
                        }
                    })
    
                    
                    for (const obj of groupPemasok) {
                        let items = []
                        for (const elm of obj.items) {
                            const barang = await Barang.query().where('id', elm.barang_id).last()
                            items.push({
                                barang_id: elm.barang_id,
                                equipment_id: elm.equipment_id,
                                coa_id: barang.coa_in,
                                qty: elm.qty_acc,
                                stn: elm.stn,
                                harga_stn: 0.00,
                                subtotal: 0.00
                            })
                        }
    
                        let data = {
                            bisnis_id: tempFaktur.bisnis_id,
                            cabang_id: tempFaktur.cabang_id,
                            gudang_id: tempFaktur.gudang_id,
                            pemasok_id: obj.pemasok_id,
                            reff_ro: tempFaktur.kode,
                            items: items
                        }
                        console.log('====================================');
                        console.log(data);
                        console.log('====================================');
                        await TrxFakturBeliHelpers.POST(data, user)
                    }

                }
    
                /** GROUPING PEMASOK METODE TUNAI **/
                if(itemTunai.length > 0){
                    let groupPemasok = _.groupBy(itemTunai, 'pemasok_id')
                    groupPemasok = Object.keys(groupPemasok).map(key => {
                        return {
                            pemasok_id: key,
                            items: groupPemasok[key]
                        }
                    })
    
                    for (const obj of groupPemasok) {
                        let items = []
                        for (const elm of obj.items) {
                            items.push({
                                barang_id: elm.barang_id,
                                description: null,
                                qty: elm.qty_acc
                            })

                            /** INSERT BARANG SESUAI LOKASI **/
                            const barangLokasi = new BarangLokasi()
                            barangLokasi.fill({
                                ro_id: params.id,
                                bisnis_id: tempFaktur.bisnis_id,
                                cabang_id: tempFaktur.cabang_id,
                                gudang_id: tempFaktur.gudang_id,
                                barang_id: elm.barang_id,
                                qty_rec: elm.qty_acc,
                                createdby: user.id
                            })
                            await barangLokasi.save()
                        }
                        /** GENERATE KODE TERIMA BARANG **/
                        const kode_rcp = await initFunc.GEN_KODE_TERIMA_BRG(tempFaktur.bisnis_id)
                        let data = {
                            ro_id: params.id,
                            bisnis_id: tempFaktur.bisnis_id,
                            reff_fb: null,
                            reff_ro: tempFaktur.kode,
                            reff_rcp: kode_rcp,
                            pemasok_id: obj.pemasok_id,
                            gudang_id: tempFaktur.gudang_id,
                            narasi: null,
                            items: items
                        }
                        
                        await TrxTerimaBarangHelpers.POST(data, user)
                    }
                }

                
            }

            
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

    async DELETE (params) {
        
    }
}

module.exports = new PurchaseReq()