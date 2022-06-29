'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const AccCoa = use("App/Models/akunting/AccCoa")
const VBarangStok = use("App/Models/VBarangStok")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaJual = use("App/Models/master/HargaJual")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const BarangCategories = use("App/Models/master/BarangCategories")

class persediaanBarang {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.WORKSPACE(user)
        let barangStok = (
            await VBarangStok
                .query()
                .with('barang', a => {
                    a.with('brand')
                    a.with('kategori')
                    a.with('qualitas')
                    a.with('subkategori')
                })
                .where( w => {
                    if(!['administrator', 'developer', 'keuangan'].includes(user.usertype)){
                        w.where('cabang_id', ws.cabang_id)
                    }
                })
                .orderBy('nm_barang', 'asc')
                .paginate(halaman, limit)
        ).toJSON()

        return barangStok

        // let arrData = []

        // for (let obj of barang.data) {
        //     const hrgJual = (
        //         await HargaJual.query().where( w => {
        //             w.where('bisnis_id', ws.bisnis_id)
        //             w.where('barang_id', obj.id)
        //         }).orderBy('periode', 'asc')
        //         .fetch()
        //     ).toJSON()

        //     const hrgBeli = (
        //         await HargaBeli.query().where( w => {
        //             w.where('bisnis_id', ws.bisnis_id)
        //             w.where('barang_id', obj.id)
        //         }).orderBy('periode', 'asc')
        //         .fetch()
        //     ).toJSON()

        //     let avgBeli = []
        //     for (const num of hrgBeli) {
        //         avgBeli.push(num.harga_beli)
        //     }

        //     const lokasi = (
        //         await BarangLokasi.query().where( w => {
        //             w.where('bisnis_id', ws.bisnis_id)
        //             w.where('barang_id', obj.id)
        //         }).orderBy('created_at', 'asc')
        //         .fetch()
        //     ).toJSON()
            
        //     let tot = []
        //     for (const val of lokasi) {
        //         tot.push({qty_hand: val.qty_hand, qty_rec: val.qty_rec, qty_del: val.qty_del, qty_own: val.qty_own})
        //     }
        //     var _avgBeli = avgBeli.reduce((a, b) => { return a + parseInt(b) }, 0)
        //     var _hand = tot.reduce((a, b) => { return a + parseInt(b.qty_hand) }, 0)
        //     var _rec = tot.reduce((a, b) => { return a + parseInt(b.qty_rec) }, 0)
        //     var _del = tot.reduce((a, b) => { return a + parseInt(b.qty_del) }, 0)
        //     var _own = (parseInt(_hand) + parseInt(_rec)) - parseInt(_del)
        //     obj = {
        //         ...obj, 
        //         avgBeli: _avgBeli/(hrgBeli?.length || 1),
        //         qty_hand: _hand,
        //         qty_rec: _rec,
        //         qty_del: _del,
        //         qty_own: _own,
        //         hrgJual, 
        //         hrgBeli, 
        //         lokasi
        //     }
        //     arrData.push(obj)
        // }

        // return {...barang, data: arrData}
    }

    async POST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        async function GET_DATA_COA(id){
            const data = await AccCoa.query().where('id', id).last()
            return data
        }

        async function GET_DATA_COA_ID(kode){
            const data = await AccCoa.query().where( w => {
                w.where('kode', kode)
                w.where('bisnis_id', ws.bisnis_id)
            }).last()
            return data
        }

        /** INSERT HARGA BELI **/
        try {
            const hargaBeli = new HargaBeli()
            hargaBeli.fill({
                bisnis_id: ws.bisnis_id,
                barang_id: req.barang_id,
                periode: moment().format('YYYY-MM'),
                narasi: req.narasi,
                harga_beli: req.harga_beli
            })
            await hargaBeli.save(trx)
        } catch (error) {
            console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    messsage: 'Failed save data harga beli...'+JSON.stringify(error)
                }
        }

        /** INSERT HARGA JUAL **/
        try {
            const hargaJual = new HargaJual()
            hargaJual.fill({
                bisnis_id: ws.bisnis_id,
                barang_id: req.barang_id,
                periode: moment().format('YYYY-MM'),
                narasi: req.narasi,
                harga_jual: req.harga_jual
            })
            await hargaJual.save(trx)
        } catch (error) {
            console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    messsage: 'Failed save data harga beli...'+JSON.stringify(error)
                }
        }

        /** INSERT LOKASI BARANG **/
        for (const obj of req.items) {
            const cabang = await Gudang.query().where('id', obj.gudang_id).last()
            try {
                const barangLokasi = new BarangLokasi()
                barangLokasi.fill({
                    bisnis_id: ws.bisnis_id,
                    cabang_id: cabang.cabang_id,
                    gudang_id: obj.gudang_id,
                    barang_id: req.barang_id,
                    qty_hand: obj.qty,
                    qty_own: obj.qty,
                    createdby: user.id
                })
                await barangLokasi.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    messsage: 'Failed save data lokasi...'+JSON.stringify(error)
                }
            }
        }

        const barang = await Barang.query().where('id', req.barang_id).last()

        /** TRX JURNAL DEBIT PADA PERSEDIAAN **/
        const coaDebit = await GET_DATA_COA(barang.coa_in)

        for (const obj of req.items) {
            const cabang = await Gudang.query().where('id', obj.gudang_id).last()
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: cabang.cabang_id, 
                coa_id: barang.coa_in,
                kode: coaDebit.kode,
                narasi: 'Tambah persediaan barang',
                trx_date: new Date(),
                nilai: parseFloat(obj.qty) * parseFloat(req.harga_beli),
                dk: 'd',
                is_delay: 'N'
            })
            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    messsage: 'Failed save data jurnal debit...'+JSON.stringify(error)
                }
            }
        }

        /** TRX JURNAL KREDIT PADA MODAL **/
        const coaKredit = await GET_DATA_COA_ID('300.1')

        for (const obj of req.items) {
            const cabang = await Gudang.query().where('id', obj.gudang_id).last()
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: cabang.cabang_id, 
                coa_id: coaKredit.id,
                kode: coaKredit.kode,
                narasi: 'Tambah modal barang',
                trx_date: new Date(),
                nilai: parseFloat(obj.qty) * parseFloat(req.harga_beli),
                dk: 'k',
                is_delay: 'N'
            })
            try {
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    messsage: 'Failed save data jurnal kredit...'+JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        
        const barangLokasi = (
            await BarangLokasi.query()
            .where('barang_id', params.id)
            .fetch()
        ).toJSON()

        let grpGudang = _.groupBy(barangLokasi, 'gudang_id')
        grpGudang = Object.keys(grpGudang).map(key => {
            return {
                gudang_id: key,
                items: grpGudang[key]
            }
        })

        let summaryQty = []
        for (let obj of grpGudang) {
            const gudang = (await Gudang.query().with('cabang').where('id', obj.gudang_id).last()).toJSON()

            for (const val of obj.items) {
                const hargaBeli = await HargaBeli.query().where('barang_id', val.barang_id).last() || 0
                const hargaJual = await HargaJual.query().where('barang_id', val.barang_id).last() || 0
                obj.harga_beli = hargaBeli.harga_beli
                obj.harga_jual = hargaJual.harga_jual
            }

            let grpBarang = _.groupBy(obj.items, 'barang_id')
            grpBarang = Object.keys(grpBarang).map(key => {
                var _onhand = grpBarang[key].reduce((a, b) => { return a + parseInt(b.qty_hand) }, 0)
                var _onrec = grpBarang[key].reduce((a, b) => { return a + parseInt(b.qty_rec) }, 0)
                var _ondel = grpBarang[key].reduce((a, b) => { return a + parseInt(b.qty_del) }, 0)
                var _own = (parseInt(_onhand) + parseInt(_onrec)) - parseInt(_ondel)
                return {
                    barang_id: key,
                    harga_jual: obj.harga_jual,
                    harga_beli: obj.harga_beli,
                    qty_hand: _onhand,
                    qty_rec: _onrec,
                    qty_del: _ondel,
                    qty_own: _own
                }
            })

            summaryQty.push({
                gudang_id: obj.gudang_id,
                kd_gudang: gudang.kode,
                nm_gudang: gudang.nama,
                details: grpBarang[0]
            })
        }

        return summaryQty
    }

    async HISTORY_HARGA(params){
        const beli = (
            await HargaBeli.query().where( w => {
                w.where('barang_id', params.id)
                w.where('periode', 'like', `${moment().format("YYYY")}%`)
            }).orderBy('periode', 'desc')
            .fetch()
        ).toJSON()

        const jual = (
            await HargaJual.query().where( w => {
                w.where('barang_id', params.id)
                w.where('periode', 'like', `${moment().format("YYYY")}%`)
            }).orderBy('periode', 'desc')
            .fetch()
        ).toJSON()

        return {
            beli, 
            jual
        }
    }
}

module.exports = new persediaanBarang()