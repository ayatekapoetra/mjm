'use strict'

const DB = use('Database')
const moment = require('moment')
const { where } = require('underscore')
const Kass = use("App/Models/akunting/Kas")
const Bank = use("App/Models/akunting/Bank")
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxKases = use("App/Models/transaksi/TrxKase")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxJurnalSaldo = use("App/Models/transaksi/TrxJurnalSaldo")

class keuKasBank {

    async LIST (req) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        const kas = (
            await Kass.query()
            .with('cabang')
            .where( w => {
                w.where('aktif', 'Y')
            }).paginate(halaman, limit)
        ).toJSON()

        const bank = (
            await Bank.query()
            .with('cabang')
            .where( w => {
                w.where('aktif', 'Y')
            }).paginate(halaman, limit)
        ).toJSON()

        return {
            kas: kas,
            bank: bank
        }
    }

    async POST_KAS (req, user) {
        const trx = await DB.beginTransaction()
        const masKas = new Kass()
        masKas.fill({
            id: req.coa_id,
            createdby: user.id,
            coa_id: req.coa_id,
            cabang_id: req.cabang_id,
            kode: req.coa_id,
            name: req.nama,
            saldo_rill: 0,
            aktif: 'Y'
        })
        
        try {
            await masKas.save(trx)
        } catch (error) {
            await trx.rollback()
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...\n'+JSON.stringify(error)
            }
        }
        
        await trx.commit()

        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async POST_BANK (req, user) {
        const trx = await DB.beginTransaction()
        const masBank = new Bank()
        masBank.fill({
            id: req.coa_id,
            createdby: user.id,
            coa_id: req.coa_id,
            cabang_id: req.cabang_id,
            kode: req.coa_id,
            initial: req.initial,
            name: req.nama,
            rekening: req.rekening,
            saldo_net: 0,
            setor_tunda: 0,
            tarik_tunda: 0,
            saldo_rill: 0,
            aktif: 'Y'
        })
        
        try {
            await masBank.save(trx)
        } catch (error) {
            await trx.rollback()
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...\n'+JSON.stringify(error)
            }
        }

        await trx.commit()

        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW_KAS (params) {
        const kas = (
            await Kass.query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return kas
    }

    async SHOW_BANK (params) {
        const bank = (
            await Bank.query()
            .where('id', params.id)
            .last()
        ).toJSON()
        return bank
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

    async UPDATE_KAS (params, req, user) {
        const trx = await DB.beginTransaction()
        const kas = await Kass.query().where('id', params.id).last()
        
        kas.merge({
            createdby: user.id,
            coa_id: req.coa_id,
            cabang_id: req.cabang_id,
            kode: req.coa_id,
            name: req.nama,
            aktif: 'Y'
        })

        try {
            await kas.save(trx)
        } catch (error) {
            await trx.rollback()
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...\n'+JSON.stringify(error)
            }
        }
        await trx.commit()

        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async UPDATE_BANK (params, req, user) {
        const trx = await DB.beginTransaction()
        const bank = await Bank.query().where('id', params.id).last()
        
        bank.merge({
            createdby: user.id,
            coa_id: req.coa_id,
            cabang_id: req.cabang_id,
            kode: req.coa_id,
            initial: req.initial,
            name: req.nama,
            rekening: req.rekening,
            aktif: 'Y'
        })

        try {
            await bank.save(trx)
        } catch (error) {
            await trx.rollback()
            console.log(error);
            return {
                success: false,
                message: 'Failed save data...\n'+JSON.stringify(error)
            }
        }
        await trx.commit()

        return {
            success: true,
            message: 'Success save data...'
        }
    }
}

module.exports = new keuKasBank()