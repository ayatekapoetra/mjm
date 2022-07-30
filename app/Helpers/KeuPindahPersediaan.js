'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Gudang = use("App/Models/master/Gudang")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const KeuPindahPersediaan = use("App/Models/transaksi/KeuPindahPersediaan")
const KeuPindahPersediaanItem = use("App/Models/transaksi/KeuPindahPersediaanItem")
const KeuPindahPersediaanAttach = use("App/Models/transaksi/KeuPindahPersediaanAttach")

class pindahPersediaan {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data
        if(req.keyword){
            data = (
                await KeuPindahPersediaan
                .query()
                .with('cabang')
                .with('gudangFrom')
                .with('gudangTo')
                .with('items')
                .with('author')
                .where( w => {
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
                await KeuPindahPersediaan
                .query()
                .with('cabang')
                .with('gudangFrom')
                .with('gudangTo')
                .with('items')
                .with('author')
                .orderBy('trx_date', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
        }

        // console.log(data);
        return data
    }

    async POST (req, user, attach) {
        const trx = await DB.beginTransaction()

        /** INSERT TRX ANTAR GUDANG **/
        const keuPindahPersediaan = new KeuPindahPersediaan()
        try {
            keuPindahPersediaan.fill({
                created_by: user.id,
                kode: req.kode,
                trx_date: req.trx_date,
                gudang_src: req.gudang_src,
                gudang_target: req.gudang_target,
                narasi: req.narasi || 'No Descriptions'
            })
            await keuPindahPersediaan.save(trx)
            console.log('insert master pemindahan persediaan');
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data transfer gudang '+ JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(attach){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `SEND-${randURL}.${attach.extname}`
            var uriLampiran = '/upload/'+aliasName
            await attach.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            if (!attach.moved()) {
                return attach.error()
            }

            const lampiranFile = new KeuPindahPersediaanAttach()
            lampiranFile.fill({
                pindah_id: keuPindahPersediaan.id,
                filetype: attach.extname,
                size: attach.size,
                url: uriLampiran
            })
            try {
                await lampiranFile.save(trx)
                console.log('insert attachment files pemindahan persediaan');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
                }
            }
        }

        for (const obj of req.items) {

            let cabangAsal
            let cabangTujuan

            const trxTransferItem = new KeuPindahPersediaanItem()
            try {
                trxTransferItem.fill({
                    pindah_id: keuPindahPersediaan.id,
                    barang_id: obj.barang_id,
                    satuan: obj.satuan,
                    qty: obj.qty
                })

                await trxTransferItem.save(trx)
                console.log('insert pemindahan persediaan items');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
                }
            }

            try {
                const barangLokasiKredit = new BarangLokasi()
                cabangAsal = (await Gudang.query().with('cabang').where('id', req.gudang_src).last())?.toJSON()
                barangLokasiKredit.fill({
                    pindah_id: trxTransferItem.id,
                    cabang_id: cabangAsal.cabang.id || null,
                    gudang_id: req.gudang_src,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty) * (-1),
                    createdby: user.id
                })

                await barangLokasiKredit.save(trx)
                console.log('insert kredit pemindahan persediaan lokasi');
                const barangLokasiDebit = new BarangLokasi()
                cabangTujuan = (await Gudang.query().with('cabang').where('id', req.gudang_target).last())?.toJSON()
                barangLokasiDebit.fill({
                    pindah_id: trxTransferItem.id,
                    cabang_id: cabangTujuan.cabang.id || null,
                    gudang_id: req.gudang_target,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty),
                    createdby: user.id
                })

                await barangLokasiDebit.save(trx)
                console.log('insert debit pemindahan persediaan lokasi');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
                }
            }

            // INSERT TRX JURNAL
            if(cabangAsal.cabang.id != cabangTujuan.cabang.id){
                // HITUNG RATA-RATA HARGA BELI BARANG
                const hargaBeli = await HargaBeli.query().where( w => {
                    w.where('barang_id', obj.barang_id)
                }).getAvg('harga_beli') || 0

                const trxJurnalKredit = new TrxJurnal()
                trxJurnalKredit.fill({
                    createdby: user.id,
                    cabang_id: cabangAsal.cabang.id,
                    coa_id: '11001',
                    reff: req.kode,
                    narasi: '['+req.kode+'] Pemindahan persediaan',
                    trx_date: req.trx_date,
                    nilai: (hargaBeli * parseFloat(obj.qty)) * -1,
                    dk: 'd',
                    pindahbrg_id: trxTransferItem.id,
                })

                try {
                    await trxJurnalKredit.save(trx)
                    console.log('insert jurnal kredit pemindahan persediaan');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save jurnal persediaan kredit '
                    }
                }

                const trxJurnalDebit = new TrxJurnal()
                trxJurnalDebit.fill({
                    createdby: user.id,
                    cabang_id: cabangTujuan.cabang.id,
                    coa_id: '11001',
                    reff: req.kode,
                    narasi: '['+req.kode+'] Pemindahan persediaan',
                    trx_date: req.trx_date,
                    nilai: (hargaBeli * parseFloat(obj.qty)),
                    dk: 'd',
                    pindahbrg_id: trxTransferItem.id,
                })
                try {
                    await trxJurnalDebit.save(trx)
                    console.log('insert jurnal debit pemindahan persediaan');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save jurnal persediaan debit '
                    }
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
            await KeuPindahPersediaan
                .query()
                .with('cabang')
                .with('gudangFrom')
                .with('gudangTo')
                .with('items', w => {
                    w.with('barang')
                    w.where('aktif', 'Y')
                })
                .with('author')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user, attach) {
        const trx = await DB.beginTransaction()

        /** INSERT TRX ANTAR GUDANG **/
        const keuPindahPersediaan = await KeuPindahPersediaan.query().where('id', params.id).last()
        try {
            keuPindahPersediaan.merge({
                created_by: user.id,
                trx_date: req.trx_date,
                gudang_src: req.gudang_src,
                gudang_target: req.gudang_target,
                narasi: req.narasi || 'No Descriptions'
            })
            await keuPindahPersediaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data transfer gudang '+ JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(attach){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `SEND-${randURL}.${attach.extname}`
            var uriLampiran = '/upload/'+aliasName
            await attach.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            if (!attach.moved()) {
                return attach.error()
            }

            const lampiranFile = await KeuPindahPersediaanAttach.query().where('pindah_id', params.id).last()
            lampiranFile.merge({
                pindah_id: keuPindahPersediaan.id,
                filetype: attach.extname,
                size: attach.size,
                url: uriLampiran
            })
            try {
                await lampiranFile.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer Kas & Bank '+ JSON.stringify(error)
                }
            }
        }

        // UPDATE ITEMS BARANG STATUS 'N'
        await DB.table('keu_pindah_persediaan_items').where('pindah_id', params.id).update({ aktif: 'N'})
        
        const itemBarang = (await KeuPindahPersediaanItem.query().where('pindah_id', params.id).fetch()).toJSON()
        for (const val of itemBarang) {
            await BarangLokasi.query().where('pindah_id', val.id).delete()
            await DB.table('trx_jurnals').where('pindahbrg_id', val.id).update({ aktif: 'N'})
        }
        
        for (const obj of req.items) {

            let cabangAsal
            let cabangTujuan

            const trxTransferItem = new KeuPindahPersediaanItem()
            trxTransferItem.fill({
                pindah_id: keuPindahPersediaan.id,
                barang_id: obj.barang_id,
                satuan: obj.satuan,
                qty: obj.qty
            })

            try {
                await trxTransferItem.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
                }
            }


            try {

                const barangLokasiKredit = new BarangLokasi()
                cabangAsal = (await Gudang.query().with('cabang').where('id', req.gudang_src).last())?.toJSON()
                barangLokasiKredit.fill({
                    pindah_id: trxTransferItem.id,
                    cabang_id: cabangAsal.cabang.id || null,
                    gudang_id: req.gudang_src,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty) * (-1),
                    createdby: user.id
                })

                await barangLokasiKredit.save(trx)

                const barangLokasiDebit = new BarangLokasi()
                cabangTujuan = (await Gudang.query().with('cabang').where('id', req.gudang_target).last())?.toJSON()
                barangLokasiDebit.fill({
                    pindah_id: trxTransferItem.id,
                    cabang_id: cabangTujuan.cabang.id || null,
                    gudang_id: req.gudang_target,
                    barang_id: obj.barang_id,
                    qty_hand: parseInt(obj.qty),
                    createdby: user.id
                })

                await barangLokasiDebit.save(trx)

            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data transfer barang '
                }
            }

            if(cabangAsal.cabang.id != cabangTujuan.cabang.id){
                // HITUNG RATA-RATA HARGA BELI BARANG
                const hargaBeli = await HargaBeli.query().where( w => {
                    w.where('barang_id', obj.barang_id)
                }).getAvg('harga_beli') || 0

                const trxJurnalKredit = new TrxJurnal()
                trxJurnalKredit.fill({
                    createdby: user.id,
                    cabang_id: cabangAsal.cabang.id,
                    coa_id: '11001',
                    reff: req.kode,
                    narasi: '['+req.kode+'] Pemindahan Persediaan',
                    trx_date: req.trx_date,
                    nilai: (hargaBeli * parseFloat(obj.qty)) * -1,
                    dk: 'd',
                    pindahbrg_id: trxTransferItem.id,
                })

                try {
                    await trxJurnalKredit.save(trx)
                    console.log('insert jurnal kredit pemindahan persediaan');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save jurnal persediaan kredit '
                    }
                }

                const trxJurnalDebit = new TrxJurnal()
                trxJurnalDebit.fill({
                    createdby: user.id,
                    cabang_id: cabangTujuan.cabang.id,
                    coa_id: '11001',
                    reff: req.kode,
                    narasi: '['+req.kode+'] Pemindahan Persediaan',
                    trx_date: req.trx_date,
                    nilai: (hargaBeli * parseFloat(obj.qty)),
                    dk: 'd',
                    pindahbrg_id: trxTransferItem.id,
                })
                try {
                    await trxJurnalDebit.save(trx)
                    console.log('insert jurnal debit pemindahan persediaan');
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save jurnal persediaan debit '
                    }
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
            await KeuPindahPersediaan.query().where('id', params.id).delete()
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

    async PRINT (params) {
        const data = (
            await KeuPindahPersediaan
                .query()
                .with('cabang')
                .with('gudangFrom')
                .with('gudangTo')
                .with('items', w => {
                    w.with('barang')
                    w.where('aktif', 'Y')
                })
                .with('author')
            .where('id', params.id)
            .last()
        ).toJSON()
        
        return data
    }
}

module.exports = new pindahPersediaan()