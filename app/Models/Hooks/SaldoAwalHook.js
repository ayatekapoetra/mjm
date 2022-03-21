'use strict'

const moment = require('moment')
const Coa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")
const TrxJurnalSaldo = use("App/Models/transaksi/TrxJurnalSaldo")

const SaldoAwalHook = exports = module.exports = {}

SaldoAwalHook.hitungSaldo = async (trxJurnal) => {
    /**
     * HANDLE BY MYSQL TRIGGER
     * **/ 

}
