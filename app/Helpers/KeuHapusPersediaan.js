'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Gudang = use("App/Models/master/Gudang")
const Barang = use("App/Models/master/Barang")
const AccCoa = use("App/Models/akunting/AccCoa")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const KeuHapusPersediaan = use("App/Models/transaksi/KeuHapusPersediaan")
const KeuHapusPersediaanItem = use("App/Models/transaksi/KeuHapusPersediaanItem")
const KeuHapusPersediaanAttach = use("App/Models/transaksi/KeuHapusPersediaanAttach")

class hapusPersediaan {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const data = (
            await KeuHapusPersediaan
            .query()
            .with('cabang')
            .with('gudang')
            .with('items')
            .with('author')
            .with('files')
            .where( w => {
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                if(req.gudang_id){
                    w.where('gudang_id', req.gudang_id)
                }
                if(req.date_begin && req.date_end){
                    w.where('trx_date', '>=', req.date_begin)
                    w.where('trx_date', '<=', req.date_end)
                }
                w.where('aktif', 'Y')
            })
            .orderBy('trx_date', 'desc')
            .paginate(halaman, limit)
        ).toJSON()
        

        console.log(data);
        return data
    }

    async POST (req, user, attach) {
        const trx = await DB.beginTransaction()
        /** INSERT TRX ANTAR GUDANG **/
        const keuHapusPersediaan = new KeuHapusPersediaan()
        try {
            keuHapusPersediaan.fill({
                createdby: user.id,
                reff: req.reff,
                coa_id: req.coa_id,
                trx_date: req.trx_date,
                cabang_id: req.cabang_id,
                gudang_id: req.gudang_id,
                isStok: req.isKurangi ? 'Y':'N',
                keterangan: req.keterangan || 'No Descriptions'
            })
            await keuHapusPersediaan.save(trx)
            console.log('insert master hapus persediaan');
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data hapus persediaan gudang '+ JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(attach){
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `REM-${randURL}.${attach.extname}`
            var uriLampiran = '/upload/'+aliasName
            await attach.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            if (!attach.moved()) {
                return attach.error()
            }

            const lampiranFile = new KeuHapusPersediaanAttach()
            lampiranFile.fill({
                hapus_id: keuHapusPersediaan.id,
                filetype: attach.extname,
                size: attach.size,
                url: uriLampiran
            })
            try {
                await lampiranFile.save(trx)
                console.log('insert attachment files hapus persediaan');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data lampiran hapus persediaan '+ JSON.stringify(error)
                }
            }
        }

        for (const obj of req.items) {

            const trxHapusItem = new KeuHapusPersediaanItem()
            try {
                trxHapusItem.fill({
                    hapus_id: keuHapusPersediaan.id,
                    gudang_id: req.gudang_id,
                    barang_id: obj.barang_id,
                    qty: obj.qty
                })

                await trxHapusItem.save(trx)
                console.log('insert hapus persediaan items');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data hapus persediaan items '
                }
            }

            /**
             * KURANGI STOK PERSEDIAAN JIKA DIPILIH
             * **/
            if(req.isKurangi){
                const barangLokasi = new BarangLokasi()
                barangLokasi.fill({
                    hpb_id: trxHapusItem.id,
                    cabang_id: req.cabang_id,
                    gudang_id: req.gudang_id,
                    barang_id: obj.barang_id,
                    qty_hand: parseFloat(obj.qty) * -1,
                    createdby: user.id
                })
                try {
                    await barangLokasi.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed effected data stok persediaan barang items '
                    }
                }
            }

            /**
             * CARI HARGA BELI RATA-RATA BARANG
             * **/

            const hargaBeli = await HargaBeli.query().where( w => {
                w.where('barang_id', obj.barang_id)
                w.where('periode', 'like', `${moment(req.trx_date).startOf('year').format('YYYY')}%`)
            }).getAvg('harga_beli') || 0

            /**
             * INSERT TRX_JURNAL DEBIT
             * **/
            const akun = await AccCoa.query().where('id', req.coa_id).last()
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                coa_id: req.coa_id,
                reff: req.reff,
                narasi: `[ ${req.reff} ] ${req.keterangan || 'Penghapusan persediaan terhadap akun '+ akun.coa_name}`,
                trx_date: req.trx_date,
                dk: 'd',
                is_delay: 'N',
                barang_id: obj.barang_id,
                hapusbrg_id: keuHapusPersediaan.id,
                hapusbrg_item: trxHapusItem.id,
                nilai: hargaBeli //Jumlah rata2 harga beli barang
            })

            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data jurnal debit hapus persediaan...'
                }
            }

            /**
             * INSERT TRX_JURNAL KREDIT
             * **/
            const barang = await Barang.query().where('id', obj.barang_id).last()
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                coa_id: barang.coa_in,
                reff: req.reff,
                narasi: `[ ${req.reff} ] ${req.keterangan || 'Penghapusan persediaan terhadap akun '+ akun.coa_name}`,
                trx_date: req.trx_date,
                dk: 'k',
                is_delay: 'N',
                barang_id: obj.barang_id,
                hapusbrg_id: keuHapusPersediaan.id,
                hapusbrg_item: trxHapusItem.id,
                nilai: hargaBeli //Jumlah rata2 harga beli barang
            })

            try {
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data jurnal kredit hapus persediaan...'
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
            await KeuHapusPersediaan
            .query()
            .with('cabang')
            .with('gudang')
            .with('author')
            .with('files')
            .with('items', w => {
                w.with('barang')
                w.where('aktif', 'Y')
            })
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user, attach) {
        const trx = await DB.beginTransaction()

        /** UPDATE TRX ANTAR GUDANG **/
        const keuHapusPersediaan = await KeuHapusPersediaan.query().where('id', params.id).last()
        try {
            keuHapusPersediaan.merge({
                createdby: user.id,
                coa_id: req.coa_id,
                trx_date: req.trx_date,
                cabang_id: req.cabang_id,
                gudang_id: req.gudang_id,
                isStok: req.isKurangi ? 'Y':'N',
                keterangan: req.keterangan || 'No Descriptions'
            })
            await keuHapusPersediaan.save(trx)
            console.log('insert master hapus persediaan');
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data hapus persediaan gudang '+ JSON.stringify(error)
            }
        }

        /** INSERT LAMPIRAN FILE **/
        if(attach){
            await DB.table('keu_hapus_persediaan_attach').where('hapus_id', params.id).delete()
            const randURL = moment().format('YYYYMMDDHHmmss')
            const aliasName = `REM-${randURL}.${attach.extname}`
            var uriLampiran = '/upload/'+aliasName
            await attach.move(Helpers.publicPath(`upload`), {
                name: aliasName,
                overwrite: true,
            })

            if (!attach.moved()) {
                return attach.error()
            }

            const lampiranFile = new KeuHapusPersediaanAttach()
            lampiranFile.fill({
                hapus_id: keuHapusPersediaan.id,
                filetype: attach.extname,
                size: attach.size,
                url: uriLampiran
            })
            try {
                await lampiranFile.save(trx)
                console.log('insert attachment files hapus persediaan');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data lampiran hapus persediaan '+ JSON.stringify(error)
                }
            }
        }

        /**
         * UPDATE DATA HAPUS PERSEDIAAN DAN ITEMS NYA
         * **/
        await DB.table('keu_hapus_persediaan_items').where('hapus_id', params.id).update('aktif', 'N')
        await DB.table('trx_jurnals').where('hapusbrg_id', params.id).update('aktif', 'N')

        /**
         * HAPUS DATA BARANG LOKASI
         * **/
        const keuHapusPersediaanItem = (await KeuHapusPersediaanItem.query().where('hapus_id', params.id).fetch()).toJSON()
        for (const val of keuHapusPersediaanItem) {
            await BarangLokasi.query().where('hpb_id', val.id).delete()
        }

        /**
         * INSERT DATA BARU PENGHAPUSAN ITEMS
         * **/ 
        for (const obj of req.items) {

            const trxHapusItem = new KeuHapusPersediaanItem()
            try {
                trxHapusItem.fill({
                    hapus_id: keuHapusPersediaan.id,
                    gudang_id: req.gudang_id,
                    barang_id: obj.barang_id,
                    qty: obj.qty
                })

                await trxHapusItem.save(trx)
                console.log('insert hapus persediaan items');
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data hapus persediaan items '
                }
            }

            /**
             * KURANGI STOK PERSEDIAAN JIKA DIPILIH
             * **/
            if(req.isKurangi){
                const barangLokasi = new BarangLokasi()
                barangLokasi.fill({
                    hpb_id: trxHapusItem.id,
                    cabang_id: req.cabang_id,
                    gudang_id: req.gudang_id,
                    barang_id: obj.barang_id,
                    qty_hand: parseFloat(obj.qty) * -1,
                    createdby: user.id
                })
                try {
                    await barangLokasi.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed effected data stok persediaan barang items '
                    }
                }
            }

            /**
             * CARI HARGA BELI RATA-RATA BARANG
             * **/

            const hargaBeli = await HargaBeli.query().where( w => {
                w.where('barang_id', obj.barang_id)
                w.where('periode', 'like', `${moment(req.trx_date).startOf('year').format('YYYY')}%`)
            }).getAvg('harga_beli') || 0

            /**
             * INSERT TRX_JURNAL DEBIT
             * **/
            const akun = await AccCoa.query().where('id', req.coa_id).last()
            const trxJurnalDebit = new TrxJurnal()
            trxJurnalDebit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                coa_id: req.coa_id,
                reff: keuHapusPersediaan.reff,
                narasi: `[ ${keuHapusPersediaan.reff} ] ${req.keterangan || 'Penghapusan persediaan terhadap akun '+ akun.coa_name}`,
                trx_date: req.trx_date,
                dk: 'd',
                is_delay: 'N',
                barang_id: obj.barang_id,
                hapusbrg_id: keuHapusPersediaan.id,
                hapusbrg_item: trxHapusItem.id,
                nilai: hargaBeli //Jumlah rata2 harga beli barang
            })

            try {
                await trxJurnalDebit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data jurnal debit hapus persediaan...'
                }
            }

            /**
             * INSERT TRX_JURNAL KREDIT
             * **/
            const barang = await Barang.query().where('id', obj.barang_id).last()
            const trxJurnalKredit = new TrxJurnal()
            trxJurnalKredit.fill({
                createdby: user.id,
                cabang_id: req.cabang_id,
                coa_id: barang.coa_in,
                reff: keuHapusPersediaan.reff,
                narasi: `[ ${keuHapusPersediaan.reff} ] ${req.keterangan || 'Penghapusan persediaan terhadap akun '+ akun.coa_name}`,
                trx_date: req.trx_date,
                dk: 'k',
                is_delay: 'N',
                barang_id: obj.barang_id,
                hapusbrg_id: keuHapusPersediaan.id,
                hapusbrg_item: trxHapusItem.id,
                nilai: hargaBeli //Jumlah rata2 harga beli barang
            })

            try {
                await trxJurnalKredit.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data jurnal kredit hapus persediaan...'
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
        const trx = await DB.beginTransaction()
        const keuHapusPersediaan = await KeuHapusPersediaan.query().where('id', params.id).last()
        keuHapusPersediaan.merge({aktif: 'N'})
        try {
            await keuHapusPersediaan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Success delete data...'+JSON.stringify(error)
            }
        }

        const hapusItems = (await KeuHapusPersediaanItem.query().where( w => {
            w.where('hapus_id', params.id)
            w.where('aktif', 'Y')
        }).fetch()).toJSON()

        for (const val of hapusItems) {
            const removeItems = await KeuHapusPersediaanItem.query().where('id', val.id).last()
            removeItems.merge({aktif: 'N'})
            try {
                await removeItems.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed remove data hapus persediaan items...'
                }
            }

            
            const stokLokasi = await BarangLokasi.query().where( w => {
                w.where('barang_id', val.barang_id)
                w.where('hpb_id', val.id)
            }).last()

            if(stokLokasi){
                try {
                    await stokLokasi.delete(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed remove data stok lokasi barang...'
                    }
                }
            }
        }

        try {
            await TrxJurnal.query().where('hapusbrg_id', params.id).update({aktif: 'N'})
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Success delete data...'+JSON.stringify(error)
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success delete data...'
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

module.exports = new hapusPersediaan()