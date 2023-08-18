'use strict'

const DB = use('Database')

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const DefCoa = use("App/Models/DefCoa")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const AccCoa = use("App/Models/akunting/AccCoa")
const HargaBeli = use("App/Models/master/HargaBeli")
const OrdPelanggan = use("App/Models/operational/OpsPelangganOrder")
const LampiranFile = use("App/Models/transaksi/KeuFakturPembelianAttach")
const KeuFakturPenjualan = use("App/Models/transaksi/KeuFakturPenjualan")

class fakturBeli {
    async LIST (req, user) {
        console.log(req);
        const ws = await initFunc.WORKSPACE(user)
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);

        let data = (await KeuFakturPenjualan
            .query()
            .with('files')
            .with('cabang')
            .with('pelanggan')
            .with('gudang')
            .with('author', a => a.with('profile'))
            .where( w => {
                w.where('cabang_id', user.cabang_id)
                w.where('aktif', 'Y')
                if(req.pelanggan_id){
                    w.where('pelanggan_id', req.pelanggan_id)
                }
                if(req.gudang_id){
                    w.where('gudang_id', req.gudang_id)
                }
                if(req.kode_){
                    w.where('kode', 'like', `%${req.kode_}%`)
                }
                if(req.duedate_begin && req.duedate_end){
                    w.where('due_date', '>=', moment(req.duedate_begin).format('YYYY-MM-DD'))
                    w.where('due_date', '<=', moment(req.duedate_end).format('YYYY-MM-DD'))
                }
            })
            .orderBy('created_at', 'desc')
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

        const orderPelanggan = await OrdPelanggan.query().where('id', req.reff_inv).last()

        if(!orderPelanggan){
            return {
                success: false,
                message: 'Kode invoices tdk ditemukan...'
            }
        }
        
        const fakturPenjualan = new KeuFakturPenjualan()
        fakturPenjualan.fill({
            cabang_id: req.cabang_id, 
            gudang_id: req.gudang_id, 
            pelanggan_id: req.pelanggan_id, 
            reff_inv: req.reff_inv, 
            kode: orderPelanggan.kdpesanan,
            nilai_bayar:  parseFloat(req.nilai_bayar),
            trx_date: req.trx_date,
            due_date: req.due_date, 
            createdby: user.id,
        })
        try {
            await fakturPenjualan.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data faktur pembelian...'+JSON.stringify(error)
            }
        }

        // if(filex){
        //     if(filex._files?.length > 1){
        //         for (const [i, objFile] of (filex._files).entries()) {
        //             const randURL = moment().format('YYYYMMDDHHmmss') + '-' + i
        //             const aliasName = `FB-${randURL}.${objFile.extname}`
        //             var uriLampiran = '/upload/'+aliasName
        //             await objFile.move(Helpers.publicPath(`upload`), {
        //                 name: aliasName,
        //                 overwrite: true,
        //             })
    
        //             if (!objFile.moved()) {
        //                 return objFile.error()
        //             }
    
        //             const lampiranFile = new LampiranFile()
        //             lampiranFile.fill({
        //                 fakturbeli_id: trxFakturBeli.id,
        //                 size: objFile.size,
        //                 filetype: objFile.extname,
        //                 url: uriLampiran
        //             })
    
        //             try {
        //                 await lampiranFile.save(trx)
        //             } catch (error) {
        //                 console.log(error);
        //                 await trx.rollback()
        //                 return {
        //                     success: false,
        //                     message: 'Failed save data attachment...'+JSON.stringify(error)
        //                 }
        //             }
        //         }
        //     }else{
        //         const randURL = moment().format('YYYYMMDDHHmmss') + '-0'
        //         const aliasName = `FB-${randURL}.${filex.extname}`
        //         var uriLampiran = '/upload/'+aliasName
        //         await filex.move(Helpers.publicPath(`upload`), {
        //             name: aliasName,
        //             overwrite: true,
        //         })

        //         if (!filex.moved()) {
        //             return filex.error()
        //         }

        //         const lampiranFile = new LampiranFile()
        //         lampiranFile.fill({
        //             fakturbeli_id: trxFakturBeli.id,
        //             size: filex.size,
        //             filetype: filex.extname,
        //             url: uriLampiran
        //         })

        //         try {
        //             await lampiranFile.save(trx)
        //         } catch (error) {
        //             console.log(error);
        //             await trx.rollback()
        //             return {
        //                 success: false,
        //                 message: 'Failed save data attachment...'+JSON.stringify(error)
        //             }
        //         }
        //     }

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

                    // INSERT LABA DITAHAN
                    const trxJurnalDiscLabaDitahan = new TrxJurnal()
                    trxJurnalDiscLabaDitahan.fill({
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
                        await trxJurnalDiscLabaDitahan.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save data trx jurnal discount...'+JSON.stringify(error)
                        }
                    }
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
        console.log("XCXCXCX", params);
        const dataPenjualan = await KeuFakturPenjualan.query().where('id', params.id).last()
        dataPenjualan.merge({aktif: 'N'})
        try {
            await dataPenjualan.save()
            return {
                success: true,
                message: "Success delete data..."
            }
        } catch (error) {
            return {
                success: false,
                message: "Failed delete data..."
            }
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