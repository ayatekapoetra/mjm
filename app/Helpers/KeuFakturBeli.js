'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const AccCoa = use("App/Models/akunting/AccCoa")
const BarangLokasi = use("App/Models/BarangLokasi")
const HargaBeli = use("App/Models/master/HargaBeli")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const LampiranFile = use("App/Models/transaksi/KeuFakturPembelianAttach")
const KeuFakturPembelian = use("App/Models/transaksi/KeuFakturPembelian")
const KeuPurchasingRequest = use("App/Models/transaksi/KeuPurchasingRequest")
const KeuFakturPembelianItem = use("App/Models/transaksi/KeuFakturPembelianItem")

class fakturBeli {
    async LIST (req, user) {
        const ws = await initFunc.WORKSPACE(user)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);

        let data = (await KeuFakturPembelian
            .query()
            .with('files')
            .with('cabang')
            .with('pemasok')
            .with('gudang')
            .with('author', a => a.with('profile'))
            .with('items', i => i.where('aktif', 'Y'))
            .where( w => {
                w.where('cabang_id', user.cabang_id)
                w.where('aktif', 'Y')
            })
            .orderBy('date_faktur', 'desc')
            .paginate(halaman, limit)
        ).toJSON()
        
        return data
    }

    async SHOW (params){
        const data = await KeuFakturPembelian.query()
        .with('cabang')
        .with('pemasok')
        .with('gudang')
        .with('author', a => a.with('profile'))
        .with('items', i => i.where('aktif', 'Y'))
        .where( w => {
            w.where('id', params.id)
        })
        .last()

        return data.toJSON()
    }

    async POST (req, user, filex) {
        const trx = await DB.beginTransaction()
        
        const trxFakturBeli = new KeuFakturPembelian()
        trxFakturBeli.fill({
            cabang_id: req.cabang_id, 
            gudang_id: req.gudang_id, 
            pemasok_id: req.pemasok_id, 
            reff_order: req.reff_order || null, 
            kode: req.kode || null, 
            total:  parseFloat(req.itemsTotal),
            grandtot: parseFloat(req.itemsTotal) + parseFloat(req.ppn_rp), 
            sisa: parseFloat(req.itemsTotal) + parseFloat(req.ppn_rp),
            ppn: req.ppn || 0,
            ppn_rp: req.ppn_rp,
            date_faktur: req.date_faktur,
            due_date: req.due_date, 
            createdby: user.id,
        })
        try {
            await trxFakturBeli.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data faktur pembelian...'+JSON.stringify(error)
            }
        }
        console.log('end KeuFakturPembelian');

        if(filex){
            for (const [i, objFile] of (filex._files).entries()) {
                const randURL = moment().format('YYYYMMDDHHmmss') + '-' + i
                const aliasName = `FB-${randURL}.${objFile.extname}`
                var uriLampiran = '/upload/'+aliasName
                await objFile.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })

                if (!objFile.moved()) {
                    return objFile.error()
                }

                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    fakturbeli_id: trxFakturBeli.id,
                    size: objFile.size,
                    filetype: objFile.extname,
                    url: uriLampiran
                })

                try {
                    await lampiranFile.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data attachment...'+JSON.stringify(error)
                    }
                }
            }
            console.log('end lampiranFile');
        }

        const defCoaPajak = (await DefCoa.query().where('group', 'faktur-pembelian-pajak').fetch()).toJSON()
        for (const val of defCoaPajak) {
            const trxJurnalTax = new TrxJurnal()
            trxJurnalTax.fill({
                createdby: user.id,
                cabang_id: req.cabang_id, 
                fakturbeli_id: trxFakturBeli.id,
                coa_id: val.coa_id,
                reff: req.kode,
                narasi: `[ ${req.kode} ] ${val.description}`,
                trx_date: req.date_faktur || new Date(),
                nilai: req.ppn_rp || 0,
                dk: val.tipe,
                is_delay: 'N'
            })
            try {
                await trxJurnalTax.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data trx jurnal pajak...'+JSON.stringify(error)
                }
            }
            console.log('end faktur-pembelian-pajak');
        }

        for (const obj of req.data.items) {
            // console.log(obj);
            if(obj.coa_id){
                const barang = await Barang.query().where('id', obj.barang_id).last()

                const trxFakturBeliItem = new KeuFakturPembelianItem()
                trxFakturBeliItem.fill({
                    fakturbeli_id: trxFakturBeli.id,
                    barang_id: obj.barang_id || null,
                    coa_id: obj.coa_id || null,
                    qty: obj.qty,
                    type_discount: obj.type_discount,
                    discount: obj.discount_rp,
                    stn: barang.satuan,
                    harga_stn: obj.harga_stn,
                    subtotal: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.discount_rp)
                })

                try {
                    await trxFakturBeliItem.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data faktur pembelian item...'+JSON.stringify(error)
                    }
                }
                console.log('end trxFakturBeliItem');

                /** INSERT DATA DEBIT FAKTUR PEMBALIAN TRX-JURNAL **/
                const trxJurnalDEBIT = new TrxJurnal()
                trxJurnalDEBIT.fill({
                    createdby: user.id,
                    cabang_id: req.cabang_id, 
                    barang_id: obj.barang_id,
                    fakturbeli_id: trxFakturBeli.id,
                    fakturbeli_item: trxFakturBeliItem.id,
                    coa_id: obj.coa_id,
                    reff: req.kode,
                    narasi: `[ ${req.kode} ] ${barang.nama}`,
                    trx_date: req.date_faktur || new Date(),
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                    dk: 'd',
                    is_delay: 'N'
                })

                try {
                    await trxJurnalDEBIT.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data debit trx jurnal...\n'+JSON.stringify(error)
                    }
                }
                console.log('end trxJurnal Debit');

                /** INSERT DATA HUTANG DAGANG TRX-JURNAL **/
                const defCoa = (await DefCoa.query().where('group', 'faktur-pembelian').fetch()).toJSON()
                console.log('Jurnal Faktur Pembelian :::', defCoa);
                for (const val of defCoa) {
                    const trxJurnalFB = new TrxJurnal()
                    trxJurnalFB.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id,
                        barang_id: obj.barang_id,
                        fakturbeli_id: trxFakturBeli.id,
                        fakturbeli_item: trxFakturBeliItem.id,
                        coa_id: val.coa_id,
                        reff: req.kode,
                        narasi: `[ ${req.kode} ] ${barang.nama}`,
                        trx_date: req.date_faktur || new Date(),
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                        dk: val.tipe,
                        is_delay: 'N'
                    })

                    try {
                        await trxJurnalFB.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data trx jurnal...'+JSON.stringify(error)
                        }
                    }
                    console.log('end trxJurnal Kredit', req.ppn_rp);
                }

                const defCoaDiscount = (await DefCoa.query().where('group', 'faktur-pembelian-discount-barang').fetch()).toJSON()
                for (const val of defCoaDiscount) {
                    const trxJurnalDisc = new TrxJurnal()
                    trxJurnalDisc.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id, 
                        barang_id: obj.barang_id,
                        fakturbeli_id: trxFakturBeli.id,
                        fakturbeli_item: trxFakturBeliItem.id,
                        coa_id: val.coa_id,
                        reff: req.kode,
                        narasi: `[ ${req.kode} ] ${val.description}`,
                        trx_date: req.date_faktur || new Date(),
                        nilai: parseFloat(obj.discount_rp),
                        dk: val.tipe,
                        is_delay: 'N'
                    })

                    try {
                        await trxJurnalDisc.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data trx jurnal discount...'+JSON.stringify(error)
                        }
                    }
                    console.log('end faktur-pembelian-discount-barang');
                }
                
                if(obj.barang_id){
                    /** INSERT HARGA BELI BARU **/
                    let hrgBeli = await HargaBeli.query().where( w => {
                        w.where('barang_id', obj.barang_id)
                        w.where('harga_beli', obj.harga_stn)
                        w.where('periode', moment().format('YYYY-MM'))
                    }).last()

                    if(!hrgBeli){
                        hrgBeli = new HargaBeli()
                        hrgBeli.fill({
                            barang_id: obj.barang_id,
                            cabang_id: req.cabang_id,
                            gudang_id: req.gudang_id,
                            fakturbeli_item: trxFakturBeliItem.id,
                            periode: moment().format('YYYY-MM'),
                            narasi: req.kode,
                            harga_beli: parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                            created_by: user.id
                        })
                        try {
                            await hrgBeli.save(trx)
                        } catch (error) {
                            console.log(error);
                            await trx.rollback()
                            return {
                                success: false,
                                message: 'Failed save data harga beli...'+JSON.stringify(error)
                            }
                        }
                    }
                    console.log('end hrgBeli');
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async UPDATE ( params, req, user, filex ) {
        const trx = await DB.beginTransaction()
        const currentData = await KeuFakturPembelian.query().where('id', params.id).last()
        
        /* UPDATE DATA FAKTUR PEMBELIAN */
        try {
            currentData.merge({
                cabang_id: req.cabang_id,
                pemasok_id: req.pemasok_id,
                gudang_id: req.gudang_id,
                reff_order: req.reff_order || null,
                kode: req.kode || null,
                total: req.itemsTotal,
                grandtot: parseFloat(req.itemsTotal) + parseFloat(req.ppn_rp), 
                sisa: parseFloat(req.itemsTotal) + parseFloat(req.ppn_rp),
                ppn: req.ppn || 0,
                ppn_rp: req.ppn_rp,
                date_faktur: req.date_faktur,
                due_date: req.due_date, 
                createdby: user.id
            })
            await currentData.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data...'
            }
        }

        /* REPLACE ATTACHMENT FILES */
        if(filex){

            await DB.table('keu_faktur_pembelian_attach').where('fakturbeli_id', params.id).update('aktif', 'N')

            for (const [i, objFile] of (filex._files).entries()) {
                const randURL = moment().format('YYYYMMDDHHmmss') + '-' + i
                const aliasName = `FB-${randURL}.${objFile.extname}`
                var uriLampiran = '/upload/'+aliasName
                await objFile.move(Helpers.publicPath(`upload`), {
                    name: aliasName,
                    overwrite: true,
                })

                if (!objFile.moved()) {
                    return objFile.error()
                }

                const lampiranFile = new LampiranFile()
                lampiranFile.fill({
                    fakturbeli_id: params.id,
                    size: objFile.size,
                    filetype: objFile.extname,
                    url: uriLampiran
                })

                try {
                    await lampiranFile.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data attachment...'+JSON.stringify(error)
                    }
                }
            }
            console.log('end lampiranFile');
        }

        /* UPDATE PAJAK FAKTUR PEMBELIAN */
        await DB.table('trx_jurnals').where('fakturbeli_id', params.id).update('aktif', 'N')
        const defCoaPajak = (await DefCoa.query().where('group', 'faktur-pembelian-pajak').fetch()).toJSON()
        for (const val of defCoaPajak) {
            const trxJurnalTax = new TrxJurnal()
            trxJurnalTax.fill({
                createdby: user.id,
                cabang_id: req.cabang_id, 
                fakturbeli_id: params.id,
                coa_id: val.coa_id,
                reff: req.kode,
                narasi: `[ ${req.kode} ] ${val.description}`,
                trx_date: req.date_faktur || new Date(),
                nilai: req.ppn_rp || 0,
                dk: val.tipe,
                is_delay: 'N'
            })
            try {
                await trxJurnalTax.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save data trx jurnal pajak...'+JSON.stringify(error)
                }
            }
            console.log('end faktur-pembelian-pajak');
        }

        /* UPDATE DETAIL ITEMS FAKTUR PEMBELIAN */
        await DB.table('keu_faktur_pembelian_items').where('fakturbeli_id', params.id).update('aktif', 'N')
        for (const obj of req.data.items) {

            if(obj.coa_id){
                const barang = await Barang.query().where('id', obj.barang_id).last()

                const trxFakturBeliItem = new KeuFakturPembelianItem()
                trxFakturBeliItem.fill({
                    fakturbeli_id: params.id,
                    barang_id: obj.barang_id || null,
                    coa_id: obj.coa_id || null,
                    qty: obj.qty,
                    type_discount: obj.type_discount,
                    discount: obj.discount_rp,
                    stn: barang.satuan,
                    harga_stn: obj.harga_stn,
                    subtotal: (parseFloat(obj.qty) * parseFloat(obj.harga_stn)) - parseFloat(obj.discount_rp)
                })

                try {
                    await trxFakturBeliItem.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data faktur pembelian item...'+JSON.stringify(error)
                    }
                }
                console.log('end trxFakturBeliItem');

                /** INSERT DATA DEBIT FAKTUR PEMBALIAN TRX-JURNAL **/
                const trxJurnalDEBIT = new TrxJurnal()
                trxJurnalDEBIT.fill({
                    createdby: user.id,
                    cabang_id: req.cabang_id, 
                    fakturbeli_id: params.id,
                    fakturbeli_item: trxFakturBeliItem.id,
                    coa_id: obj.coa_id,
                    reff: req.kode,
                    narasi: `[ ${req.kode} ] ${barang.nama}`,
                    trx_date: req.date_faktur || new Date(),
                    nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                    dk: 'd',
                    is_delay: 'N'
                })

                try {
                    await trxJurnalDEBIT.save(trx)
                } catch (error) {
                    console.log(error);
                    await trx.rollback()
                    return {
                        success: false,
                        message: 'Failed save data debit trx jurnal...\n'+JSON.stringify(error)
                    }
                }
                console.log('end trxJurnal Debit');

                /** INSERT DATA HUTANG DAGANG TRX-JURNAL **/
                const defCoa = (await DefCoa.query().where('group', 'faktur-pembelian').fetch()).toJSON()
                console.log('Jurnal Faktur Pembelian :::', defCoa);
                for (const val of defCoa) {
                    const trxJurnalFB = new TrxJurnal()
                    trxJurnalFB.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id, 
                        fakturbeli_id: params.id,
                        fakturbeli_item: trxFakturBeliItem.id,
                        coa_id: val.coa_id,
                        reff: req.kode,
                        narasi: `[ ${req.kode} ] ${barang.nama}`,
                        trx_date: req.date_faktur || new Date(),
                        nilai: parseFloat(obj.qty) * parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                        dk: val.tipe,
                        is_delay: 'N'
                    })

                    try {
                        await trxJurnalFB.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data trx jurnal...'+JSON.stringify(error)
                        }
                    }
                    console.log('end trxJurnal Kredit', req.ppn_rp);
                }

                const defCoaDiscount = (await DefCoa.query().where('group', 'faktur-pembelian-discount-barang').fetch()).toJSON()
                for (const val of defCoaDiscount) {
                    const trxJurnalDisc = new TrxJurnal()
                    trxJurnalDisc.fill({
                        createdby: user.id,
                        cabang_id: req.cabang_id, 
                        fakturbeli_id: params.id,
                        fakturbeli_item: trxFakturBeliItem.id,
                        coa_id: val.coa_id,
                        reff: req.kode,
                        narasi: `[ ${req.kode} ] ${val.description}`,
                        trx_date: req.date_faktur || new Date(),
                        nilai: parseFloat(obj.discount_rp),
                        dk: val.tipe,
                        is_delay: 'N'
                    })

                    try {
                        await trxJurnalDisc.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data trx jurnal discount...'+JSON.stringify(error)
                        }
                    }
                    console.log('end faktur-pembelian-discount-barang');
                }
                
                /* DELETE EXSISTING DATA HARGA BELI */
                const currentItems = (await KeuFakturPembelianItem.query().where('fakturbeli_id', params.id).fetch()).toJSON()
                for (const val of currentItems) {
                    await HargaBeli.query().where('fakturbeli_item', val.id).delete(trx)
                }

                if(obj.barang_id){
                    /** INSERT HARGA BELI BARU **/
                    let hrgBeli = await HargaBeli.query().where( w => {
                        w.where('barang_id', obj.barang_id)
                        w.where('harga_beli', obj.harga_stn)
                        w.where('periode', moment().format('YYYY-MM'))
                    }).last()

                    if(!hrgBeli){
                        hrgBeli = new HargaBeli()
                        hrgBeli.fill({
                            barang_id: obj.barang_id,
                            cabang_id: req.cabang_id,
                            gudang_id: req.gudang_id,
                            fakturbeli_item: trxFakturBeliItem.id,
                            periode: moment().format('YYYY-MM'),
                            narasi: req.kode,
                            harga_beli: parseFloat(obj.harga_stn) - parseFloat(obj.discount_rp),
                            created_by: user.id
                        })
                        try {
                            await hrgBeli.save(trx)
                        } catch (error) {
                            console.log(error);
                            await trx.rollback()
                            return {
                                success: false,
                                message: 'Failed save data harga beli...'+JSON.stringify(error)
                            }
                        }
                    }
                    console.log('end hrgBeli');
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
            await DB.table('keu_faktur_pembelians').where('id', params.id).update('aktif', 'N')
            await DB.table('keu_faktur_pembelian_items').where('fakturbeli_id', params.id).update('aktif', 'N')
            await DB.table('keu_faktur_pembelian_attach').where('fakturbeli_id', params.id).update('aktif', 'N')
            await DB.table('trx_jurnals').where('fakturbeli_id', params.id).update('aktif', 'N')
        } catch (error) {
            console.log(error);
            return {
                success: false,
                message: 'Failed delete data...'
            }
        }
        

        const items = (await KeuFakturPembelianItem.query().where('fakturbeli_id', params.id).fetch()).toJSON()
        for (const obj of items) {
            try {
                await HargaBeli.query().where('fakturbeli_item', obj.id).delete()
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Failed delete data...'
                }
            }
        }

        return {
            success: true,
            message: "Success delete data..."
        }
    }

    async PRINT (params) {
        const data = (
            await KeuFakturPembelian.query()
            .with('cabang')
            .with('pemasok')
            .with('gudang')
            .with('author', a => a.with('profile'))
            .with('items', i => {
                i.with('coa')
                i.with('barang')
                i.where('aktif', 'Y')
            })
            .where( w => {
                w.where('id', params.id)
            })
            .last()).toJSON()
        return data
    }
}

module.exports = new fakturBeli()