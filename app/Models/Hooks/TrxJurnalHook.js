'use strict'

const moment = require("moment")
const DB = use('Database')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")

const TrxJurnalHook = exports = module.exports = {}

TrxJurnalHook.setUrut = async (jurnal) => {
    let jurnalDate = moment(jurnal.trx_date).format('YYMMDD')
    let jurnalTime = moment().format('HHmmssSSS')
    jurnal.urut = `${jurnalDate}${jurnalTime}`
    
}

