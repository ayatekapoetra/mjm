'use strict'

const DB = use('Database')
const { parse } = require('@adonisjs/ace/lib/commander')
const moment = require('moment')
const Banks = use("App/Models/master/Bank")
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxBank = use("App/Models/transaksi/TrxBank")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxJurnalSaldo = use("App/Models/transaksi/TrxJurnalSaldo")

class Bank {

    async LIST (user) {
        const ws = await initFunc.GET_WORKSPACE(user.id)
        const data = (
            await Banks.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', ws.bisnis_id)
            }).fetch()
        ).toJSON()
        return data
    }

    async POST (req, user) {
        const trx = await DB.beginTransaction()
        const coa = await initFunc.GET_COA_ID(req.bisnis_id, req.kode)
        const data = {
            createdby: user.id,
            kode: req.kode,
            coa_id: coa.id,
            initial: req.initial,
            rekening: req.rekening,
            name: req.name,
            bisnis_id: req.bisnis_id,
            saldo_net: req.saldo_rill,
            saldo_rill: req.saldo_rill
        }
        
        const saldoAkun = await initFunc.GET_SALDO_AWAL(data)
        let saldo = saldoAkun?.saldo || 0

        const saldoAwal = parseFloat(saldo) + parseFloat(req.saldo_rill)
        try {
            const xbank = new Banks()
            xbank.fill(data)
            await xbank.save(trx)

            let trxJurnal = await TrxJurnal.query().where( w => {
                w.where('trx_date', moment().format('YYYY-MM-DD'))
                w.where('narasi', 'saldo awal bank')
                w.where('bisnis_id', req.bisnis_id)
                w.where('bank_id', xbank.id)
                w.where('coa_id', coa.id)
                w.where('is_delay', 'N')
            }).last()

            const trxBank = new TrxBank()
            trxBank.fill({
                bank_id: xbank.id,
                trx_date: new Date(),
                saldo_net: req.saldo_rill,
                saldo_rill: req.saldo_rill,
                desc: 'saldo awal bank'
            })
            await trxBank.save(trx)

            if(trxJurnal){
                trxJurnal.merge({
                    createdby: user.id,
                    bank_id: xbank.id,
                    bisnis_id: req.bisnis_id,
                    coa_id: coa.id,
                    kode: req.kode,
                    narasi: 'saldo awal bank',
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
                    bank_id: xbank.id,
                    bisnis_id: req.bisnis_id,
                    coa_id: coa.id,
                    kode: req.kode,
                    narasi: 'saldo awal bank',
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
            narasi: 'Tambah modal akun Bank',
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
        const banks = (
            await Banks.query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return banks
    }

    async DETAILS (params) {
        let data = (await Banks.query().with('bisnis').where('id', params.id).last()).toJSON()
        const trxBank = (
            await TrxBank.query()
            .with('bayar')
            .with('terima')
            .with('adjust')
            .with('transferBank')
            .where( w => {
                w.where('bank_id', params.id)
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
            items: trxBank
        }
    }

    async UPDATE (params, req, user) {

        /**
         * Update saldo bank akan menambahkan nilai baru ke table saldo awal jika
         * tanggal transaksi nya berbeda.
         * tujuan untuk mengakumulasi jumlah setiap saldo awal di setiap akun
         * pada setiap bulan nya
         * **/


        const dbx = await DB.beginTransaction()

        const coa = await initFunc.GET_COA_ID(req.bisnis_id, req.kode)
        req.coa_id = coa.id

        const coa_bank = await AccCoa.query(dbx).where('id', req.coa_id).last()

        try {
            const sumtrxKasesRill = await TrxBank.query().where('bank_id', params.id).getSum('saldo_rill')
            const sumtrxKasesNet = await TrxBank.query().where('bank_id', params.id).getSum('saldo_net')

            const trxBank = new TrxBank()
            trxBank.fill({
                bank_id: params.id,
                trx_date: new Date(),
                saldo_net: (parseFloat(req.saldo_rill) - (parseFloat(sumtrxKasesNet) || 0)),
                saldo_rill: (parseFloat(req.saldo_rill) - (parseFloat(sumtrxKasesRill) || 0)),
                desc: 'saldo awal bank'
            })
            await trxBank.save(dbx)

            let trxJurnal = await TrxJurnal.query().where( w => {
                w.where('trx_date', '>=', moment().startOf('day').format('YYYY-MM-DD'))
                w.where('trx_date', '<=', moment().endOf('day').format('YYYY-MM-DD'))
                w.where('narasi', 'saldo awal bank')
                w.where('bisnis_id', req.bisnis_id)
                w.where('bank_id', params.id)
                w.where('coa_id', req.coa_id)
                w.where('is_delay', 'N')
            }).last()

            if(trxJurnal){
                trxJurnal.merge({
                    createdby: user.id,
                    bank_id: params.id,
                    bisnis_id: req.bisnis_id,
                    coa_id: req.coa_id,
                    kode: coa_bank.kode,
                    narasi: 'saldo awal bank',
                    trx_date: moment().format('YYYY-MM-DD'),
                    nilai: parseFloat(req.saldo_rill),
                    dk: coa_bank.dk,
                    is_delay: 'N'
                })
                await trxJurnal.save(dbx)
            }else{
                trxJurnal = new TrxJurnal()
                trxJurnal.fill({
                    createdby: user.id,
                    bank_id: params.id,
                    bisnis_id: req.bisnis_id,
                    coa_id: req.coa_id,
                    kode: coa_bank.kode,
                    narasi: 'saldo awal bank',
                    trx_date: moment().format('YYYY-MM-DD'),
                    nilai: req.saldo_rill,
                    dk: coa_bank.dk,
                    is_delay: 'N'
                })
                await trxJurnal.save(dbx)
            }

            await dbx.commit()

            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            console.log(error);
            await dbx.rollback()
            return {
                success: false,
                message: 'Failed save data... \n'+JSON.stringify(error)
            }
        }

    }
}

module.exports = new Bank()