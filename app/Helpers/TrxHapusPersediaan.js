'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const AccCoa = use("App/Models/akunting/AccCoa")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxHapusPersediaan = use("App/Models/transaksi/TrxHapusPersediaan")
const TrxHapusPersediaanItem = use("App/Models/transaksi/TrxHapusPersediaanItem")

class transferKasBank {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await TrxHapusPersediaan
                .query()
                .with('bisnis')
                .with('cabang')
                .with('gudang')
                .with('items')
                .with('author')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.date_begin && req.date_end){
                        w.where('trx_date', '>=', req.date_begin)
                        w.where('trx_date', '<=', req.date_end)
                    }
                })
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await TrxHapusPersediaan
                .query()
                .with('bisnis')
                .with('cabang')
                .with('gudang')
                .with('items')
                .with('author')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                })
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        console.log(data);
        return data
    }

    async POST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        if(!req.trx_date){
            return {
                success: false,
                message: 'Tanggal Transaksi tidak boleh kosong...'
            }
        }
        if(!req.gudang_id){
            return {
                success: false,
                message: 'Gudang tidak boleh kosong...'
            }
        }

        for (const [i, obj] of (req.items).entries()) {
            console.log(i);
            if(!obj.barang_id){
                return {
                    success: false,
                    message: 'Item Barang urutan ke-'+(i+1)+' tidak boleh kosong...'
                }
            }
            if(parseInt(obj.qty) <= 0){
                return {
                    success: false,
                    message: 'Item Jumlah urutan ke-'+(i+1)+' tidak boleh kosong...'
                }
            }
        }

        /** GET AKUN BIAYA **/
        async function GET_AKUN_BIAYA(){
            const data = (await AccCoa.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('id', req.coa_debit)
            }).last()).toJSON()
            return data
        }
        /** GET AKUN PERSEDIAAN BARANG **/
        async function GET_AKUN_PERSEDIAAN(){
            const barang = await Barang.query().where('bisnis_id', ws.bisnis_id).first()
            const data = (await AccCoa.query().where( w => {
                w.where('id', barang.coa_in)
            }).last()).toJSON()
            return data
        }

        async function GET_AVG_HARGA_BARANG(){
            let sum = []
            for (const obj of req.items) {
                const harga = await HargaBeli.query().where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    w.where('barang_id', obj.barang_id)
                }).getAvg('harga_beli') || 0
                sum.push(parseFloat(harga) * parseFloat(obj.qty))
            }
            sum = sum.reduce((a, b) => { return parseFloat(a) + parseFloat(b) }, 0)
            return sum
        }

        
        /** INSERT TRX PENGHAPUSAN PERSEDIAAN **/
        const coaKredit = await GET_AKUN_PERSEDIAAN()
        const coaDedit = await GET_AKUN_BIAYA()
        const avg_harga = await GET_AVG_HARGA_BARANG() || 0

        const trxHapusPersediaan = new TrxHapusPersediaan()
        try {
            trxHapusPersediaan.fill({
                created_by: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                gudang_id: req.gudang_id || null,
                services_id: req.services_id || null,
                trx_date: req.trx_date,
                coa_debit: coaDedit.id,
                coa_kode: coaDedit.kode,
                nilai: avg_harga,
                narasi: req.narasi
            })
            await trxHapusPersediaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data penghapusan persediaan '+ JSON.stringify(error)
            }
        }

        /** TRX JURNAL DEBIT **/
        try {
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id,
                hpb_id: trxHapusPersediaan.id,
                coa_id: coaDedit.id,
                kode: coaDedit.kode,
                reff: req.reff || 'Hapus Persediaan',
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: avg_harga,
                dk: 'd',
                is_delay: 'N'
            })
            await trxJurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data jurnal debit '+ JSON.stringify(error)
            }
        }

        /** INSERT ITEMS PENGHAPUSAN PERSEDIAAN **/
        for (const obj of req.items) {
            const avgHargaBeli = await HargaBeli.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('barang_id', obj.barang_id)
            }).getAvg('harga_beli') || 0
            const trxHapusPersediaanItem = new TrxHapusPersediaanItem()
            trxHapusPersediaanItem.fill({
                hapus_id: trxHapusPersediaan.id,
                barang_id: obj.barang_id,
                equipment_id: obj.equipment_id,
                coa_kredit: coaKredit.id,
                coa_kode: coaKredit.kode,
                qty: obj.qty,
                avg_harga: parseFloat(avgHargaBeli) * parseFloat(obj.qty)
            })
            try {
                await trxHapusPersediaanItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data items '+ JSON.stringify(error)
                }
            }
        }

        /** TRX JURNAL KREDIT ITEMS **/
        for (const obj of req.items) {
            const avgHargaBeli = await HargaBeli.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('barang_id', obj.barang_id)
            }).getAvg('harga_beli') || 0

            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id,
                hpb_id: trxHapusPersediaan.id,
                coa_id: coaKredit.id,
                kode: coaKredit.kode,
                reff: req.reff || 'Hapus Persediaan',
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: parseFloat(avgHargaBeli) * parseFloat(obj.qty),
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
                    message: 'Failed save data jurnal kredit '+ JSON.stringify(error)
                }
            }
        }

        for (const obj of req.items) {
            const barangLokasi = new BarangLokasi()
            barangLokasi.fill({
                hpb_id: trxHapusPersediaan.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id,
                gudang_id: req.gudang_id,
                barang_id: obj.barang_id,
                createdby: user.id,
                qty_hand: parseFloat(obj.qty) * (-1)
            })
            try {
                await barangLokasi.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed calculate stok persedian '+ JSON.stringify(error)
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
        const data = (
            await TrxHapusPersediaan
                .query()
                .with('bisnis')
                .with('cabang')
                .with('gudang')
                .with('items')
                .with('author')
                .with('items', w => {
                    w.with('barang')
                    w.with('equipment')
                })
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        if(!req.trx_date){
            return {
                success: false,
                message: 'Tanggal Transaksi tidak boleh kosong...'
            }
        }
        if(!req.gudang_id){
            return {
                success: false,
                message: 'Gudang tidak boleh kosong...'
            }
        }

        for (const [i, obj] of (req.items).entries()) {
            console.log(i);
            if(!obj.barang_id){
                return {
                    success: false,
                    message: 'Item Barang urutan ke-'+(i+1)+' tidak boleh kosong...'
                }
            }
            if(parseInt(obj.qty) <= 0){
                return {
                    success: false,
                    message: 'Item Jumlah urutan ke-'+(i+1)+' tidak boleh kosong...'
                }
            }
        }

        /** GET AKUN BIAYA **/
        async function GET_AKUN_BIAYA(){
            const data = (await AccCoa.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('id', req.coa_debit)
            }).last()).toJSON()
            return data
        }
        /** GET AKUN PERSEDIAAN BARANG **/
        async function GET_AKUN_PERSEDIAAN(){
            const barang = await Barang.query().where('bisnis_id', ws.bisnis_id).first()
            const data = (await AccCoa.query().where( w => {
                w.where('id', barang.coa_in)
            }).last()).toJSON()
            return data
        }

        async function GET_AVG_HARGA_BARANG(){
            let sum = []
            for (const obj of req.items) {
                const harga = await HargaBeli.query().where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    w.where('barang_id', obj.barang_id)
                }).getAvg('harga_beli') || 0
                sum.push(parseFloat(harga) * parseFloat(obj.qty))
            }
            sum = sum.reduce((a, b) => { return parseFloat(a) + parseFloat(b) }, 0)
            return sum
        }

        
        /** INSERT TRX PENGHAPUSAN PERSEDIAAN **/
        const coaKredit = await GET_AKUN_PERSEDIAAN()
        const coaDedit = await GET_AKUN_BIAYA()
        const avg_harga = await GET_AVG_HARGA_BARANG() || 0

        const trxHapusPersediaan = await TrxHapusPersediaan.query().where('id', params.id).last()
        try {
            trxHapusPersediaan.merge({
                created_by: user.id,
                bisnis_id: ws.bisnis_id,
                cabang_id: req.cabang_id || null,
                gudang_id: req.gudang_id || null,
                services_id: req.services_id || null,
                trx_date: req.trx_date,
                coa_debit: coaDedit.id,
                coa_kode: coaDedit.kode,
                nilai: avg_harga,
                narasi: req.narasi
            })
            await trxHapusPersediaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data penghapusan persediaan '+ JSON.stringify(error)
            }
        }

        /** DELETE OLD DATA **/
        await TrxJurnal.query().where('hpb_id', params.id).delete()
        await BarangLokasi.query().where('hpb_id', params.id).delete()
        await TrxHapusPersediaanItem.query().where('hapus_id', params.id).delete()

        /** TRX JURNAL DEBIT **/
        try {
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id,
                hpb_id: params.id,
                coa_id: coaDedit.id,
                kode: coaDedit.kode,
                reff: req.reff || 'Hapus Persediaan',
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: avg_harga,
                dk: 'd',
                is_delay: 'N'
            })
            await trxJurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data jurnal debit '+ JSON.stringify(error)
            }
        }

        /** INSERT ITEMS PENGHAPUSAN PERSEDIAAN **/
        for (const obj of req.items) {
            const avgHargaBeli = await HargaBeli.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('barang_id', obj.barang_id)
            }).getAvg('harga_beli') || 0
            const trxHapusPersediaanItem = new TrxHapusPersediaanItem()
            trxHapusPersediaanItem.fill({
                hapus_id: params.id,
                barang_id: obj.barang_id,
                equipment_id: obj.equipment_id,
                coa_kredit: coaKredit.id,
                coa_kode: coaKredit.kode,
                qty: obj.qty,
                avg_harga: parseFloat(avgHargaBeli) * parseFloat(obj.qty)
            })
            try {
                await trxHapusPersediaanItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data items '+ JSON.stringify(error)
                }
            }
        }

        /** TRX JURNAL KREDIT ITEMS **/
        for (const obj of req.items) {
            const avgHargaBeli = await HargaBeli.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('barang_id', obj.barang_id)
            }).getAvg('harga_beli') || 0

            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                createdby: user.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id,
                hpb_id: params.id,
                coa_id: coaKredit.id,
                kode: coaKredit.kode,
                reff: req.reff || 'Hapus Persediaan',
                narasi: req.narasi,
                trx_date: req.trx_date,
                nilai: parseFloat(avgHargaBeli) * parseFloat(obj.qty),
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
                    message: 'Failed save data jurnal kredit '+ JSON.stringify(error)
                }
            }
        }

        for (const obj of req.items) {
            const barangLokasi = new BarangLokasi()
            barangLokasi.fill({
                hpb_id: params.id,
                bisnis_id: ws.bisnis_id, 
                cabang_id: req.cabang_id,
                gudang_id: req.gudang_id,
                barang_id: obj.barang_id,
                createdby: user.id,
                qty_hand: parseFloat(obj.qty) * (-1)
            })
            try {
                await barangLokasi.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed calculate stok persedian '+ JSON.stringify(error)
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params) {
        try {
            await TrxHapusPersediaan.query().where('id', params.id).delete()
            return {
                success: true,
                message: 'Success delete data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Success delete data...'+JSON.stringify(error)
            }
        }
    }
}

module.exports = new transferKasBank()