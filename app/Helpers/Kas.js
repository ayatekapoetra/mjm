'use strict'

const DB = use('Database')
const moment = require('moment')
const { where } = require('underscore')
const Kass = use("App/Models/master/Kas")
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxKases = use("App/Models/transaksi/TrxKase")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxJurnalSaldo = use("App/Models/transaksi/TrxJurnalSaldo")

class Bank {

    async LIST (user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const data = (
            await Kass.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', ws.bisnis_id)
            }).fetch()
        ).toJSON()
        return data
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        const coa = await initFunc.GET_COA_ID(req.bisnis_id, req.kode)
        // const coa_bank = await AccCoa.query(trx).where('id', coa.id).last()
        
        req.coa_id = coa.id

        try {
            const kass = new Kass()
            kass.fill({
                createdby: user.id,
                coa_id: coa.id,
                bisnis_id: req.bisnis_id,
                kode: req.kode,
                name: req.name,
                saldo_rill: req.saldo_rill,
                aktif: 'Y'
            })
            await kass.save(trx)
            
            const trxKases = new TrxKases()
            trxKases.fill({
                kas_id: kass.id,
                trx_date: new Date(),
                saldo_rill: req.saldo_rill,
                desc: 'saldo awal kas',
                aktif: 'Y'
            })
            await trxKases.save(trx)
            

            let trxJurnal = await TrxJurnal.query(trx).where( w => {
                w.where('trx_date', moment().format('YYYY-MM-DD'))
                w.where('narasi', 'saldo awal kas')
                w.where('bisnis_id', req.bisnis_id)
                w.where('kas_id', kass.id)
                w.where('coa_id', coa.id)
                w.where('is_delay', 'N')
            }).last()

            if(trxJurnal){
                trxJurnal.merge({
                    createdby: user.id,
                    bisnis_id: req.bisnis_id,
                    kas_id: kass.id,
                    coa_id: coa.id,
                    kode: req.kode,
                    narasi: 'saldo awal kas',
                    trx_date: moment().format('YYYY-MM-DD'),
                    nilai: req.saldo_rill,
                    dk: coa.dk,
                    is_delay: 'N'
                })
                await trxJurnal.save(trx)
            }else{
                trxJurnal = new TrxJurnal()
                trxJurnal.fill({
                    createdby: user.id,
                    bisnis_id: req.bisnis_id,
                    kas_id: kass.id,
                    coa_id: coa.id,
                    kode: req.kode,
                    narasi: 'saldo awal kas',
                    trx_date: moment().format('YYYY-MM-DD'),
                    nilai: req.saldo_rill,
                    dk: coa.dk,
                    is_delay: 'N'
                })
                await trxJurnal.save(trx)
            }
            
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data... \n'+JSON.stringify(error)
            }
        }

        /** TRX JURNAL KREDIT PADA MODAL **/
        async function GET_DATA_COA_ID(kode){
            const data = await AccCoa.query().where( w => {
                w.where('kode', kode)
                w.where('bisnis_id', req.bisnis_id)
            }).last()
            return data
        }
        const coaKredit = await GET_DATA_COA_ID('300.1')

        const trxJurnalKredit = new TrxJurnal()
        trxJurnalKredit.fill({
            createdby: user.id,
            bisnis_id: req.bisnis_id, 
            coa_id: coaKredit.id,
            kode: coaKredit.kode,
            narasi: 'Tambah modal akun Kas',
            trx_date: new Date(),
            nilai: req.saldo_rill,
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
        await trx.commit()

        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const kas = (
            await Kass.query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return kas
    }

    async DETAILS (params) {
        let data = (await Kass.query().with('bisnis').where('id', params.id).last()).toJSON()
        const trxKases = (
            await TrxKases.query()
            .with('bayar')
            .with('terima')
            .with('adjust')
            .with('transferKas')
            .where( w => {
                w.where('kas_id', params.id)
                w.where('trx_date', '>=', moment().startOf('year').format('YYYY-MM-DD'))
                w.where('trx_date', '<=', moment().endOf('year').format('YYYY-MM-DD'))
            })
            .orderBy('trx_date', 'desc').fetch()
        ).toJSON()
        return {
            ...data,
            periode: [
                moment().startOf('year').format('DD-MM-YYYY'), 
                moment().endOf('year').format('DD-MM-YYYY')
            ],
            items: trxKases
        }
    }

    async UPDATE (params, req, user) {
        const trx = await DB.beginTransaction()
        
        let kass = await Kass.query().where('id', params.id).last()

        const coa_kas = await AccCoa.query(trx).where('id', kass.coa_id).last()
        
        const sumtrxKases = await TrxKases.query().where('kas_id', params.id).getSum('saldo_rill')
        
        try {
            // kass.merge({
            //     id: kass.id,
            //     createdby: user.id,
            //     coa_id: coa_kas.id,
            //     name: req.name,
            //     bisnis_id: req.bisnis_id,
            //     saldo_rill: req.saldo_rill
            // })
            // await kass.save(trx)
            
            const trxKases = new TrxKases()
            trxKases.fill({
                kas_id: params.id,
                trx_date: new Date(),
                desc: 'update kas',
                saldo_rill: (parseFloat(req.saldo_rill) - (parseFloat(sumtrxKases) || 0))
            })
            await trxKases.save(trx)
            
            
            let trxJurnal = await TrxJurnal.query().where( w => {
                w.where('trx_date', moment().format('YYYY-MM-DD'))
                w.where('narasi', 'saldo awal kas')
                w.where('bisnis_id', req.bisnis_id)
                w.where('kas_id', params.id)
                w.where('coa_id', coa_kas.id)
                w.where('is_delay', 'N')
            }).last()

            if(trxJurnal){
                trxJurnal.merge({
                    createdby: user.id,
                    bisnis_id: req.bisnis_id,
                    kas_id: params.id,
                    coa_id: coa_kas.id,
                    kode: coa_kas.kode,
                    narasi: 'saldo awal kas',
                    trx_date: moment().format('YYYY-MM-DD'),
                    nilai: req.saldo_rill,
                    dk: coa_kas.dk,
                    is_delay: 'N'
                })

                await trxJurnal.save(trx)
                
            }else{
                trxJurnal = new TrxJurnal()
                trxJurnal.fill({
                    createdby: user.id,
                    bisnis_id: req.bisnis_id,
                    kas_id: params.id,
                    coa_id: coa_kas.id,
                    kode: coa_kas.kode,
                    narasi: 'saldo awal kas',
                    trx_date: moment().format('YYYY-MM-DD'),
                    nilai: req.saldo_rill,
                    dk: coa_kas.dk,
                    is_delay: 'N'
                })
                await trxJurnal.save(trx)
            }

        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save data... \n'+JSON.stringify(error)
            }
        }

        /** TRX JURNAL KREDIT PADA MODAL **/
        async function GET_DATA_COA_ID(kode){
            const data = await AccCoa.query().where( w => {
                w.where('kode', kode)
                w.where('bisnis_id', req.bisnis_id)
            }).last()
            return data
        }
        const coaKredit = await GET_DATA_COA_ID('300.1')

        const trxJurnalKredit = new TrxJurnal()
        trxJurnalKredit.fill({
            createdby: user.id,
            bisnis_id: req.bisnis_id, 
            coa_id: coaKredit.id,
            kode: coaKredit.kode,
            narasi: 'Tambah modal akun Kas',
            trx_date: new Date(),
            nilai: req.saldo_rill,
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
        await trx.commit()

        return {
            success: true,
            message: 'Success save data...'
        }
    }
}

module.exports = new Bank()