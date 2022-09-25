'use strict'

const DB = use('Database')
const Helpers = use('Helpers')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const BarangLokasi = use("App/Models/BarangLokasi")
const Opname = use("App/Models/logistik/LogistikStokOpname")
const OpnameItems = use("App/Models/logistik/LogistikStokOpnameItem")
const OpnameSummary = use("App/Models/logistik/LogistikStokOpnameSummary")

class stokOpname {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.WORKSPACE(user)
        try {
            const data = (
                await Opname
                .query()
                .with('cabang')
                .with('gudang')
                .with('author')
                .with('items')
                .where( w => {
                    w.where('aktif', 'Y')
                    if(req.kode_opname){
                        w.where('kode_opname', 'like', `${req.kode_opname}%`)
                    }
                    if(req.keterangan){
                        w.where('keterangan', 'like', `%${req.keterangan}%`)
                    }
                    if(req.cabang_id){
                        w.where('cabang_id', req.cabang_id)
                    }
                    if(req.gudang_id){
                        w.where('gudang_id', req.gudang_id)
                    }
                })
                .orderBy('created_at', 'desc')
                .paginate(halaman, limit)
            ).toJSON()
    
            return data
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async SHOW (params) {
        const data = (
            await Opname
            .query()
            .with('cabang')
            .with('gudang')
            .with('author')
            .with('items', w => w.where('aktif', 'Y'))
            .where('id', params.id)
            .last()
        ).toJSON()

        return data
    }

    async SUMMARY (params) {
        const data = (
            await OpnameSummary
            .query()
            .with('cabang')
            .with('gudang')
            .with('barang')
            .with('createdby')
            .where('opname_id', params.id)
            .fetch()
        ).toJSON()

        return data
    }

    async PRINT (params) {
        const data = (
            await OpnameSummary
            .query()
            .with('cabang')
            .with('gudang')
            .with('createdby')
            .with('barang')
            .where('opname_id', params.id)
            .fetch()
        ).toJSON()
        console.log(data);
        return data
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        req.kode_opname = await initFunc.GEN_KODE_OPNAME(user.cabang_id)
        console.log(req);
        
        const opname = new Opname()
        opname.fill({
            cabang_id: user.cabang_id,
            gudang_id: req.gudang_id,
            kode_opname: req.kode_opname,
            date_opname: req.date_opname,
            keterangan: req.keterangan || '',
            createdby: user.id
        })

        try {
            await opname.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save Stokopname...'
            }
        }

        for (const obj of req.items) {
            const barang = (await Barang.query().where('id', obj.barang_id).last()).toJSON()
            const opnameItems = new OpnameItems()
            opnameItems.fill({
                opname_id: opname.id,
                barang_id: obj.barang_id || null,
                nm_barang: barang?.nama || null,
                stn: barang?.satuan || null,
                qty_opname: obj.qty,
                narasi: obj.description,
                createdby: user.id
            })

            try {
                await opnameItems.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Stokopname Items...'
                }
            }
        }

        let arrItems = req.items.map(el => ({...el, qty_opname: el.qty}))

        let barangList = (await Barang.query().where('aktif', 'Y').fetch()).toJSON()
        for (const el of barangList) {
            arrItems.push({
                ...el,
                opname_id: opname.id,
                date_opname: req.date_opname,
                kode: req.kode_opname,
                cabang_id: user.cabang_id,
                gudang_id: req.gudang_id,
                barang_id: el.id,
                qty_opname: 0,
                qty_onhand: 0,
                variences: 0,
                description: '',
                author: user.id
            })
        }
        
        var grpTotBarang = [];
        arrItems.reduce(function(res, value) {
        if (!res[parseInt(value.barang_id)]) {
            res[parseInt(value.barang_id)] = { 
                opname_id: opname.id,
                date_opname: req.date_opname,
                kode: req.kode_opname,
                cabang_id: user.cabang_id,
                gudang_id: req.gudang_id,
                barang_id: parseInt(value.barang_id), 
                qty_opname: 0, 
                description: value.description 
            };
            grpTotBarang.push(res[parseInt(value.barang_id)])
        }
        (res[parseInt(value.barang_id)].qty_opname) += parseFloat(value.qty_opname);
        return res;
        }, {});

        grpTotBarang = grpTotBarang.sort((a, b) => a.barang_id - b.barang_id)

        // console.log(grpTotBarang);
        
        for (const obj of grpTotBarang) {
            
            const onHandStok = await BarangLokasi.query().where( w => {
                w.where('id', obj.barang_id)
                w.where('gudang_id', obj.gudang_id)
                w.where('cabang_id', obj.cabang_id)
            }).getSum('qty_hand') || 0

            const stokOpname = new OpnameSummary()
            stokOpname.fill({
                ...obj,
                qty_onhand: onHandStok,
                variences: parseFloat(obj.qty_opname) - parseFloat(onHandStok),
                author: user.id
            })

            try {
                await stokOpname.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save summary stokopname items...'
                }
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async UPDATE (params, req, user) {
        console.log(params);
        console.log(req);
        const trx = await DB.beginTransaction()
        const _opname = await Opname.query().where('id', params.id).last()
        req.kode_opname = _opname.kode_opname
        /* UPADTE AKTIF DATA MENJADI TDK AKTIF */
        try {
            _opname.merge({aktif: 'N'})
            await _opname.save(trx)
        } catch (error) {
            await trx.rollback()
            return {
                success: false,
                message: 'Failed update data stokopname...'
            }
        }

        const _opnameItems = (await OpnameItems.query().where('opname_id', params.id).fetch()).toJSON()
        for (const obj of _opnameItems) {
            const updOpnameItems = await OpnameItems.query().where('id', obj.id).last()
            updOpnameItems.merge({aktif: 'N'})
            try {
                await updOpnameItems.save(trx)
            } catch (error) {
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data stokopname items...'
                }
            }
        }

        const _opnameSummary = (await OpnameSummary.query().where('opname_id', params.id).fetch()).toJSON()
        for (const obj of _opnameSummary) {
            const updOpnameSummary = await OpnameSummary.query().where('id', obj.id).last()
            updOpnameSummary.merge({aktif: 'N'})
            try {
                await updOpnameSummary.save(trx)
            } catch (error) {
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data stokopname summary...'
                }
            }
        }

        /**
         * INSERT ULANG DATA STOK OPNAME
         * INSERT ULANG DATA STOK OPNAME ITEMS
         * INSERT ULANG DATA STOK OPNAME SUMMARY
         * **/

        const opname = new Opname()
        opname.fill({
            cabang_id: user.cabang_id,
            gudang_id: req.gudang_id,
            kode_opname: req.kode_opname,
            date_opname: req.date_opname,
            keterangan: req.keterangan || '',
            createdby: user.id
        })
 
        try {
            await opname.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save Stokopname...'
            }
        }

        for (const obj of req.items) {
            const barang = (await Barang.query().where('id', obj.barang_id).last()).toJSON()
            const opnameItems = new OpnameItems()
            opnameItems.fill({
                opname_id: opname.id,
                barang_id: obj.barang_id || null,
                nm_barang: barang?.nama || null,
                stn: barang?.satuan || null,
                qty_opname: obj.qty,
                narasi: obj.description,
                createdby: user.id
            })

            try {
                await opnameItems.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Stokopname Items...'
                }
            }
        }
        let arrItems = req.items.map(el => ({...el, qty_opname: el.qty}))

        let barangList = (await Barang.query().where('aktif', 'Y').fetch()).toJSON()
        for (const el of barangList) {
            arrItems.push({
                ...el,
                opname_id: opname.id,
                date_opname: req.date_opname,
                kode: req.kode_opname,
                cabang_id: user.cabang_id,
                gudang_id: req.gudang_id,
                barang_id: el.id,
                qty_opname: 0,
                qty_onhand: 0,
                variences: 0,
                description: '',
                author: user.id
            })
        }
        
        var grpTotBarang = [];
        arrItems.reduce(function(res, value) {
        if (!res[parseInt(value.barang_id)]) {
            res[parseInt(value.barang_id)] = { 
                opname_id: opname.id,
                date_opname: req.date_opname,
                kode: req.kode_opname,
                cabang_id: user.cabang_id,
                gudang_id: req.gudang_id,
                barang_id: parseInt(value.barang_id), 
                qty_opname: 0, 
                description: value.description 
            };
            grpTotBarang.push(res[parseInt(value.barang_id)])
        }
        (res[parseInt(value.barang_id)].qty_opname) += parseFloat(value.qty_opname);
        return res;
        }, {});

        grpTotBarang = grpTotBarang.sort((a, b) => a.barang_id - b.barang_id)
        
        for (const obj of grpTotBarang) {
            
            const onHandStok = await BarangLokasi.query().where( w => {
                w.where('id', obj.barang_id)
                w.where('gudang_id', obj.gudang_id)
                w.where('cabang_id', obj.cabang_id)
            }).getSum('qty_hand') || 0

            const stokOpname = new OpnameSummary()
            stokOpname.fill({
                ...obj,
                qty_onhand: onHandStok,
                variences: parseFloat(obj.qty_opname) - parseFloat(onHandStok),
                author: user.id
            })

            try {
                await stokOpname.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save summary stokopname items...'
                }
            }
        }

        /**
         * END
         * END
         * END
         * **/

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async DELETE (params) {
        const trx = await DB.beginTransaction()
        const _opname = await Opname.query().where('id', params.id).last()
        try {
            _opname.merge({aktif: 'N'})
            await _opname.save(trx)
        } catch (error) {
            await trx.rollback()
            return {
                success: false,
                message: 'Failed update data stokopname...'
            }
        }

        const _opnameItems = (await OpnameItems.query().where('opname_id', params.id).fetch()).toJSON()
        for (const obj of _opnameItems) {
            const updOpnameItems = await OpnameItems.query().where('id', obj.id).last()
            updOpnameItems.merge({aktif: 'N'})
            try {
                await updOpnameItems.save(trx)
            } catch (error) {
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data stokopname items...'
                }
            }
        }

        const _opnameSummary = (await OpnameSummary.query().where('opname_id', params.id).fetch()).toJSON()
        for (const obj of _opnameSummary) {
            const updOpnameSummary = await OpnameSummary.query().where('id', obj.id).last()
            updOpnameSummary.merge({aktif: 'N'})
            try {
                await updOpnameSummary.save(trx)
            } catch (error) {
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed update data stokopname summary...'
                }
            }
        }
        await trx.commit()
        return {
            success: true,
            messsage: 'Success save data...'
        }
    }
}

module.exports = new stokOpname()

