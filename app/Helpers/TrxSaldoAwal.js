'use strict'

const DB = use('Database')
const _ = require('underscore')
const moment = require('moment')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxJurnalSaldo = use("App/Models/transaksi/TrxJurnalSaldo")

class saldoAwalAkun {
    async LIST (req, user) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const ws = await initFunc.GET_WORKSPACE(user.id)
        let data
        if(req.keyword){
            data = (
                await TrxJurnalSaldo
                .query()
                .with('bisnis')
                .with('author')
                .with('jurnal')
                .with('coa')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                    if(req.kode){
                        w.where('kode', 'like', `%${req.kode}%`)
                    }
                    if(req.serial){
                        w.where('serial', 'like', `%${req.serial}%`)
                    }
                    if(req.num_part){
                        w.where('num_part', 'like', `%${req.num_part}%`)
                    }
                    if(req.nama){
                        w.where('nama', 'like', `%${req.nama}%`)
                    }
                    if(req.satuan){
                        w.where('satuan', req.satuan)
                    }
                })
                .orderBy([{ column: 'date_trx', order: 'desc' }, { column: 'id', order: 'desc' }])
                .paginate(halaman, limit)
            ).toJSON()
        }else{
            data = (
                await TrxJurnalSaldo
                .query()
                .with('bisnis')
                .with('author')
                .with('jurnal')
                .with('coa')
                .where( w => {
                    w.where('bisnis_id', ws.bisnis_id)
                })
                .orderBy([{ column: 'date_trx', order: 'desc' }, { column: 'id', order: 'desc' }])
                .paginate(halaman, limit)
            ).toJSON()
        }

        return data
    }

    async POST (req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()

        async function GET_COA_BY_KODE(kode){
            const data = (await AccCoa.query().where( w => {
                w.where('bisnis_id', ws.bisnis_id)
                w.where('kode', kode)
            }).last()).toJSON()
            return data
        }

        async function GET_COA_BY_ID(id){
            const data = (await AccCoa.query().where('id', id).last()).toJSON()
            return data
        }
        
        const kodeDebit = await GET_COA_BY_ID(req.coa_id)
        const trxJurnalDebit = new TrxJurnal()
        trxJurnalDebit.fill({
            createdby: user.id,
            bisnis_id: ws.bisnis_id,
            cabang_id: req.cabang_id,
            coa_id: req.coa_id,
            kode: kodeDebit.kode,
            trx_date: req.date_trx,
            narasi: req.narasi || '',
            nilai: req.saldo,
            dk: kodeDebit.dk,
            is_delay: 'N'
        })
        try {
            await trxJurnalDebit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal debit '+ JSON.stringify(error)
            }
        }

        const kodeKredit = await GET_COA_BY_KODE('300.1')
        const trxJurnalKredit = new TrxJurnal()
        trxJurnalKredit.fill({
            createdby: user.id,
            bisnis_id: ws.bisnis_id,
            cabang_id: req.cabang_id,
            coa_id: kodeKredit.id,
            kode: kodeKredit.kode,
            trx_date: req.date_trx,
            narasi: req.narasi || '',
            nilai: req.saldo,
            dk: kodeKredit.dk,
            is_delay: 'N'
        })
        try {
            await trxJurnalKredit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save trx jurnal kredit '+ JSON.stringify(error)
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
        // console.log(kodeDebit);
        // console.log(kodeKredit);
    }

    async SHOW (params) {
        const data = (
            await Cabang
            .query()
            .with('bisnis')
            .where('id', params.id)
            .last()
        ).toJSON()
        return data
    }

    async UPDATE (params, req, user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const trx = await DB.beginTransaction()
        // console.log(req);
        const cabang = await Cabang.query().where('id', params.id).last()
        cabang.merge({
            bisnis_id: req.bisnis_id,
            kode: req.kode,
            nama: req.nama,
            tipe: req.tipe,
            phone: req.phone,
            email: req.email,
            alamat: req.alamat,
            createdby: user.id
        })

        try {
            await cabang.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save cabang '+ JSON.stringify(error)
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
            await Cabang.query().where('id', params.id).delete()
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

module.exports = new saldoAwalAkun()