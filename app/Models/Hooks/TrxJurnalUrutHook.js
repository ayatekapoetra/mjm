'use strict'

const moment = require("moment")
const DB = use('Database')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")

const TrxJurnalUrutHook = exports = module.exports = {}

TrxJurnalUrutHook.setUrut = async (jurnal) => {
    let jurnalDate = moment(jurnal.trx_date).format('YYMMDD')
    let jurnalTime = moment().format('HHmmssSSS')
    jurnal.urut = `${jurnalDate}${jurnalTime}`

    // SALDO
    // const lastSaldoDebit = await TrxJurnal.query().where( w => {
    //     w.where('aktif', 'Y')
    //     w.where('coa_id', jurnal.coa_id)
    //     w.where('urut', '<', jurnal.urut)
    // }).last()

    if(jurnal.dk === 'd'){
        jurnal.debit = jurnal.nilai
        // if (lastSaldoDebit) {
        //     jurnal.saldo = (lastSaldoDebit.saldo + parseFloat(jurnal.nilai))
        // }else{
        //     jurnal.saldo = parseFloat(jurnal.nilai)
        // }
    }else{
        jurnal.kredit = jurnal.nilai
        // if (lastSaldoDebit) {
        //     jurnal.saldo = (lastSaldoDebit.saldo - parseFloat(jurnal.nilai))
        // }else{
        //     jurnal.saldo = parseFloat(jurnal.nilai)
        // }
    }
}

