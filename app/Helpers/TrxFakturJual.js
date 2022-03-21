'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const initFunc = use("App/Helpers/initFunc")
const Gudang = use("App/Models/master/Gudang")
const Barang = use("App/Models/master/Barang")
const AccCoa = use("App/Models/akunting/AccCoa")
const BarangLokasi = use("App/Models/BarangLokasi")
const LampiranFile = use("App/Models/LampiranFile")
const Equipment = use("App/Models/master/Equipment")
const HargaBeli = use("App/Models/master/HargaBeli")
const HargaJual = use("App/Models/master/HargaJual")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
const TrxTerimaBarangHelpers = use("App/Helpers/TrxTerimaBarang")
const TrxFakturJualItem = use("App/Models/transaksi/TrxFakturJualItem")

class fakturJual {

    async UPDATE_EXPIRED() {
        const date = new Date()
        const dataLate = (await TrxFakturJual.query().where( w => {
            w.where('date_due', '<=', date)
        }).fetch()).toJSON()

        const dataOnSchedule = (await TrxFakturJual.query().where( w => {
            w.where('date_due', '>=', date)
        }).fetch()).toJSON()

        if(dataLate.length > 0){
            for (const obj of dataLate) {
                const upd = await TrxFakturJual.query().where('id', obj.id).last()
                upd.merge({expired: 'Y'})
                await upd.save()
            }
        }

        if(dataOnSchedule.length > 0){
            for (const obj of dataOnSchedule) {
                const upd = await TrxFakturJual.query().where('id', obj.id).last()
                upd.merge({expired: 'N'})
                await upd.save()
            }
        }
    }

    async LIST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);

        await this.UPDATE_EXPIRED()
        let data = (await TrxFakturJual
            .query()
            .with('files')
            .with('bisnis')
            .with('pelanggan')
            .with('author')
            .with('items')
            .where( w => {
                w.where('bisnis_id', ws.bisnis_id)
            })
            .orderBy('date_trx', 'desc')
            .paginate(halaman, limit)
        ).toJSON()
        
        return data
    }

    async POST (req, user, filex) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const kodeJual = await initFunc.GEN_FAKTUR_JUAL(user.id)
        const trx = await DB.beginTransaction()

        let totharga = req.items.reduce((a, b) => { 
            return a + (parseFloat(b.qty) * parseFloat(b.harga_stn))
        }, 0)

        
        let totpotongan = req.items.reduce((a, b) => { return a + parseFloat(b.harga_pot) }, 0)
        let grandtotal = parseFloat(totharga) - parseFloat(totpotongan)
        // console.log('grandtotal ::', grandtotal);
        try {
            const trxFakturJual = new TrxFakturJual()
            trxFakturJual.fill({
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id, 
                cust_id: req.cust_id, 
                date_trx: req.date_trx,
                date_due: req.date_due, 
                reff: req.reff, 
                no_order: req.no_order, 
                no_faktur: req.no_faktur, 
                totharga: totharga, 
                totpot: req.totpot,
                grandtotal: grandtotal, 
                sisa: grandtotal,
                bayar: '0.00',
                narasi: req.narasi,
                title: req.title,
                createdby: user.id,
            })

            await trxFakturJual.save(trx)

            /** INSERT JURNAL PIUTANG DAGANG **/
            let _piutang = await DefCoa.query().where('bisnis_id', ws.bisnis_id).last()
            let coa_piutang = await AccCoa.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('kode', '100.4')
            }).last()

            const trxJurnalPiutang = new TrxJurnal()
            trxJurnalPiutang.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id, 
                trx_jual: trxFakturJual.id,
                coa_id: coa_piutang.id,
                kode: coa_piutang.kode,
                reff: req.reff,
                kode_faktur: kodeJual,
                narasi: req.narasi,
                trx_date: req.date_trx,
                nilai: grandtotal,
                dk: coa_piutang.dk,
                is_delay: 'N'
            })

            await trxJurnalPiutang.save(trx)

            if(filex){
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `FJ-${randURL}.${filex.extname}`
                var uriLampiran = '/upload/'+aliasName
                await filex.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })

                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    fj_id: trxFakturJual.id,
                    datatype: filex.extname,
                    url: uriLampiran
                })

                await lampiranFile.save(trx)
            }

            for (const obj of req.items) {
                
                /** CHECK COA IS EXSIST **/
                let coa

                if(obj.coa_id){

                    /** INSERT DATA TRX-JURNAL **/
                    coa = await AccCoa.query().where('id', obj.coa_id).last()

                    /** INSERT ITEMS JUAL **/
                    let brg
                    if(obj.barang_id){
                        brg = await Barang.query().where('id', obj.barang_id).last()
                    }
                    const trxFakturJualItem = new TrxFakturJualItem()
                    trxFakturJualItem.fill({
                        trx_jual: trxFakturJual.id,
                        barang_id: obj.barang_id || null,
                        equipment_id: obj.equipment_id || null,
                        gudang_id: obj.gudang_id || null,
                        coa_id: obj.coa_id || null,
                        kode_coa: coa.kode || null,
                        qty: obj.qty,
                        satuan: brg?.satuan || null,
                        harga_stn: obj.harga_stn,
                        harga_tot: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        harga_pot: obj.harga_pot,
                        subtotal: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot)
                    })
    
                    await trxFakturJualItem.save(trx)

                    /** INSERT STOK PERSEDIAAN JIKA ITEM BERUPA BARANG **/
                    if(obj.barang_id){
                        try {
                            const gudCab = (await Gudang.query().with('cabang').where('id', obj.gudang_id).last()).toJSON()
                            const barangLokasi = new BarangLokasi()
                            barangLokasi.fill({
                                trx_fj: trxFakturJual.id,
                                bisnis_id: ws.bisnis_id, 
                                cabang_id: gudCab.cabang.id || null,
                                gudang_id: obj.gudang_id,
                                barang_id: obj.barang_id,
                                qty_hand: parseFloat(obj.qty) * (-1),
                                qty_own: parseFloat(obj.qty) * (-1),
                                qty_del: parseFloat(obj.qty) * (1),
                                createdby: user.id
                            })
        
                            await barangLokasi.save(trx)
                            
                        } catch (error) {
                            console.log(error);
                            return {
                                success: false,
                                message: 'Terjadi masalah saat update stok barang '+ JSON.stringify(error)
                            }
                        }
                        

                        try {
                            /** TAMBAH HARGA JUAL BARANG **/
                            const hargaJual = new HargaJual()
                            hargaJual.fill({
                                trx_fj: trxFakturJual.id,
                                bisnis_id: ws.bisnis_id,
                                gudang_id: obj.gudang_id,
                                barang_id: obj.barang_id,
                                periode: moment(req.date_trx).format('YYYY-MM'),
                                harga_jual: obj.harga_stn,
                                created_by: user.id
                            })
                            
                            await hargaJual.save(trx)
                        } catch (error) {
                            console.log(error);
                            return {
                                success: false,
                                message: 'Terjadi masalah saat insert harga jual '+ JSON.stringify(error)
                            }
                        }
                    }
                    
                }
            }

            async function GET_COA_KODE(coa_id){
                const coa = await AccCoa.query().where('id', coa_id).last()
                return coa
            }

            /** INSERT JURNAL PENDAPATAN **/
            for (const obj of req.items) {
                let trxJurnalPendapatan
                if(obj.barang_id){
                    const barang = await Barang.query().where('id', obj.barang_id).last()
                    const coaKode = await GET_COA_KODE(barang.coa_out)
                    trxJurnalPendapatan = new TrxJurnal()
                    trxJurnalPendapatan.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: trxFakturJual.id,
                        coa_id: barang.coa_out,
                        kode: coaKode.kode,
                        kode_faktur: kodeJual,
                        narasi: obj.narasi,
                        trx_date: req.date_trx,
                        nilai: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                        dk: 'k'
                    })
                    try {
                        await trxJurnalPendapatan.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        throw new Error(JSON.stringify(error))
                    }
                }

                if(obj.equipment_id){
                    const equipment = await Equipment.query().where('id', obj.equipment_id).last()
                    const coaKode = await GET_COA_KODE(equipment.coa_out)
                    trxJurnalPendapatan = new TrxJurnal()
                    trxJurnalPendapatan.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: trxFakturJual.id,
                        coa_id: equipment.coa_out,
                        kode: coaKode.kode,
                        kode_faktur: kodeJual,
                        narasi: obj.narasi,
                        trx_date: req.date_trx,
                        nilai: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                        dk: 'k'
                    })
                    try {
                        await trxJurnalPendapatan.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        throw new Error(JSON.stringify(error))
                    }
                }
            }

            await trx.commit()
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data...'+JSON.stringify(error)
            }
        }
    }

    async SHOW (params) {
        const data = (
            await TrxFakturJual
                .query()
                .with('files')
                .with('bisnis')
                .with('pelanggan')
                .with('author')
                .with('items', a => {
                    a.with('equipment')
                    a.with('barang')
                    a.with('gudang')
                    a.with('coa')
                })
                .where('id', params.id)
                .last()
        ).toJSON()

        return data
    }

    async PRINT (params) {
        const data = (
            await TrxFakturJual
                .query()
                .with('files')
                .with('bisnis')
                .with('pelanggan')
                .with('author')
                .with('items', a => {
                    a.with('equipment')
                    a.with('barang')
                    a.with('gudang')
                    a.with('coa')
                })
                .where('id', params.id)
                .last()
        ).toJSON()
        return data
    }

    async UPDATE ( params, req, user, filex ) {
        const { id } = params
        const trx = await DB.beginTransaction()
        const initCoa = await initFunc.DEF_COA(user.id)
        const ws = await initFunc.GET_WORKSPACE(user.id)

        let totharga = req.items.reduce((a, b) => { 
            return a + (parseFloat(b.qty) * parseFloat(b.harga_stn))
        }, 0)
        let totpotongan = req.items.reduce((a, b) => { return a + parseFloat(b.harga_pot) }, 0)
        let grandtotal = parseFloat(totharga) - parseFloat(totpotongan)

        /** IF FILE UPLOAD EXSIST **/
        try {
            if(filex){
                const randURL = moment().format('YYYYMMDDHHmmss')
                const aliasName = `FB-${randURL}.${filex.extname}`
                var uriLampiran = '/upload/'+aliasName
                await filex.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })
    
                let lampiranFile = await LampiranFile.query().where('fj_id', params.id).last()
                if(lampiranFile){
                    lampiranFile.merge({
                        datatype: filex.extname,
                        url: uriLampiran
                    })
                }else{
                    lampiranFile = new LampiranFile()
                    lampiranFile.fill({
                        fj_id: params.id,
                        datatype: filex.extname,
                        url: uriLampiran
                    })
                }
                await lampiranFile.save(trx)
            }
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                messsage: 'Failed save attachment...'+JSON.stringify(error)
            }
        }

        /** UPDATE FAKTUR JUAL **/
        try {
            const trxFakturJual = await TrxFakturJual.query().where('id', params.id).last()
            trxFakturJual.merge({
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id, 
                cust_id: req.cust_id, 
                date_trx: req.date_trx,
                date_due: req.date_due, 
                reff: req.reff, 
                no_order: req.no_order, 
                no_faktur: req.no_faktur, 
                totharga: totharga, 
                totpot: req.totpot, 
                grandtotal: grandtotal, 
                sisa: grandtotal,
                narasi: req.narasi,
                title: req.title,
                createdby: user.id,
            })
            await trxFakturJual.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                messsage: 'Failed save faktur jual...'+JSON.stringify(error)
            }
        }

        /** UPDATE FAKTUR JUAL ITEMS **/
        try {
            await TrxFakturJualItem.query(trx).where('trx_jual', params.id).delete()

            const coa = await AccCoa.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('kode', initCoa.kode_piutangdagang)
            }).last()

            for (const obj of req.items) {
                /** UPDATE FAKTUR JUAL ITEMS JIKA EQUIPMENT **/
                if(obj.equipment_id){
                    const itemsEquipment = new TrxFakturJualItem()
                    itemsEquipment.fill({
                        trx_jual: params.id,
                        equipment_id: obj.equipment_id || null,
                        coa_id: obj.coa_id || null,
                        kode_coa: coa.kode || null,
                        qty: obj.qty,
                        harga_stn: obj.harga_stn,
                        harga_tot: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        harga_pot: obj.harga_pot,
                        subtotal: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot)
                    })
                    await itemsEquipment.save(trx)
                }

                /** UPDATE FAKTUR JUAL ITEMS JIKA BARANG **/
                if(obj.barang_id){
                    const brg = await Barang.query(trx).where('id', obj.barang_id).last()
                    const itemsBarang = new TrxFakturJualItem()
                    itemsBarang.fill({
                        trx_jual: params.id,
                        barang_id: obj.barang_id || null,
                        gudang_id: obj.gudang_id || null,
                        coa_id: obj.coa_id || null,
                        kode_coa: coa.kode || null,
                        qty: obj.qty,
                        satuan: brg.satuan,
                        harga_stn: obj.harga_stn,
                        harga_tot: parseFloat(obj.qty) * parseFloat(obj.harga_stn),
                        harga_pot: obj.harga_pot,
                        subtotal: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot)
                    })
                    await itemsBarang.save(trx)

                    /** DELETE STOK BARANG **/
                    await BarangLokasi.query().where( w => {
                        w.where('trx_fj', params.id)
                        w.where('barang_id', obj.barang_id)
                    }).delete()

                    const barangLokasi = new BarangLokasi()
                    barangLokasi.fill({
                        trx_fj: params.id,
                        bisnis_id: ws.bisnis_id, 
                        cabang_id: req.cabang_id || null,
                        gudang_id: obj.gudang_id,
                        barang_id: obj.barang_id,
                        qty_hand: parseFloat(obj.qty) * (-1),
                        qty_own: parseFloat(obj.qty) * (-1),
                        qty_del: parseFloat(obj.qty) * (1),
                        createdby: user.id
                    })

                    await barangLokasi.save(trx)

                    try {
                        /** TAMBAH HARGA JUAL BARANG **/
                        const hargaJual = new HargaJual()
                        hargaJual.fill({
                            trx_fj: params.id,
                            bisnis_id: ws.bisnis_id, 
                            gudang_id: obj.gudang_id,
                            barang_id: obj.barang_id,
                            periode: moment(req.date_trx).format('YYYY-MM'),
                            harga_jual: obj.harga_stn,
                            created_by: user.id
                        })
                        
                        await hargaJual.save(trx)
                    } catch (error) {
                        console.log(error);
                        return {
                            success: false,
                            message: 'Terjadi masalah saat insert harga jual '+ JSON.stringify(error)
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                messsage: 'Failed save faktur jual items atau update stok...'+JSON.stringify(error)
            }
        }

        /** INSERT TRXJURNAL **/
        try {
            await TrxJurnal.query(trx).where('trx_jual', params.id).delete()
            
            /** INSERT JURNAL PIUTANG DAGANG **/
            let _piutang = await DefCoa.query(trx).where('bisnis_id', ws.bisnis_id).last()
            let coa_piutang = await AccCoa.query(trx).where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('kode', _piutang.kode_piutangdagang)
            }).last()

            const trxJurnalPiutang = new TrxJurnal()
            trxJurnalPiutang.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id, 
                trx_jual: params.id,
                coa_id: coa_piutang.id,
                kode: coa_piutang.kode,
                reff: req.reff,
                kode_faktur: req.no_faktur,
                narasi: req.narasi,
                trx_date: req.date_trx,
                nilai: grandtotal,
                dk: coa_piutang.dk,
                is_delay: 'N'
            })
            await trxJurnalPiutang.save(trx)
            
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                messsage: 'Failed save Jurnal...'+JSON.stringify(error)
            }
        }

        try {

            async function GET_COA_KODE(coa_id){
                const coa = await AccCoa.query().where('id', coa_id).last()
                return coa
            }

            /** INSERT JURNAL PENDAPATAN **/
            for (const obj of req.items) {
                let trxJurnalPendapatan
                if(obj.barang_id){
                    const barang = await Barang.query().where('id', obj.barang_id).last()
                    const coaKode = await GET_COA_KODE(barang.coa_out)
                    trxJurnalPendapatan = new TrxJurnal()
                    trxJurnalPendapatan.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: params.id,
                        coa_id: barang.coa_out,
                        kode: coaKode.kode,
                        kode_faktur: req.no_faktur,
                        narasi: obj.narasi,
                        trx_date: req.date_trx,
                        nilai: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                        dk: 'k'
                    })
                    try {
                        await trxJurnalPendapatan.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        throw new Error(JSON.stringify(error))
                    }
                }

                if(obj.equipment_id){
                    const equipment = await Equipment.query().where('id', obj.equipment_id).last()
                    const coaKode = await GET_COA_KODE(equipment.coa_out)
                    trxJurnalPendapatan = new TrxJurnal()
                    trxJurnalPendapatan.fill({
                        createdby: user.id,
                        bisnis_id: ws.bisnis_id,
                        cabang_id: req.cabang_id,
                        bank_id: req.bank_id || null,
                        kas_id: req.kas_id || null,
                        trx_jual: params.id,
                        coa_id: equipment.coa_out,
                        kode: coaKode.kode,
                        kode_faktur: req.no_faktur,
                        narasi: obj.narasi,
                        trx_date: req.date_trx,
                        nilai: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.harga_pot),
                        dk: 'k'
                    })
                    try {
                        await trxJurnalPendapatan.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        throw new Error(JSON.stringify(error))
                    }
                }
            }
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                messsage: 'Failed save Jurnal Pendapatan...'+JSON.stringify(error)
            }
        }

        await trx.commit()
        return {
            success: true,
            messsage: 'Success save data...'
        }
    }

    async FIND_FAKTUR (req) {
        try {
            const data = await TrxFakturJual.query().with('items').where('no_faktur', req.no_faktur).last()
            return {
                success: true,
                data: data.toJSON(),
                message: 'find data success...'
            }
        } catch (error) {
            return {
                success: false,
                data: null,
                message: 'find data failed...'
            }
        }
    }

    async FIND_FAKTUR_ITEM (req) {
        try {
            const data = await TrxFakturJualItem.query().where('id', req.id).last()
            return data.toJSON()
        } catch (error) {
            return null
        }
    }

    async DELETE (params) {
        try {
            await TrxFakturJual.query().where('id', params.id).delete()
            return {
                success: true,
                message: 'Delete data success...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Delete data failed...'
            }
        }
    }
}

module.exports = new fakturJual()