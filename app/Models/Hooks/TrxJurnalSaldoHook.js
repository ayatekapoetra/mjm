'use strict'

const moment = require("moment")
const DB = use('Database')
const initFunc = use("App/Helpers/initFunc")
const AccCoa = use("App/Models/akunting/AccCoa")
const TrxJurnal = use("App/Models/transaksi/TrxJurnal")

const TrxJurnalSaldoHook = exports = module.exports = {}

TrxJurnalSaldoHook.setSaldo = async (jurnal) => {
    // let jurnalDate = moment(jurnal.trx_date).format('YYMMDDHHmmssSSS')
    // jurnal.urut = `${jurnalDate}`

    const akun = await AccCoa.query().where('id', jurnal.coa_id).last()

    let sumDebit = await TrxJurnal.query().where( w => {
        w.where('dk', 'd')
        w.where('aktif', 'Y')
        w.where('coa_id', jurnal.coa_id)
        w.where('urut', '<', jurnal.urut)
    }).getSum('nilai') || 0

    console.log('DEBIT', sumDebit);

    let sumKredit = await TrxJurnal.query().where( w => {
        w.where('dk', 'k')
        w.where('aktif', 'Y')
        w.where('coa_id', jurnal.coa_id)
        w.where('urut', '<', jurnal.urut)
    }).getSum('nilai') || 0

    console.log('KREDIT', sumKredit);

    if(jurnal.dk === 'd'){
        jurnal.debit = jurnal.nilai
    }else{
        jurnal.kredit = jurnal.nilai
    }

    // if(akun.dk === 'd'){
    //     var total = jurnal.dk === 'd' ? ((sumDebit - sumKredit) + jurnal.nilai):((sumDebit - sumKredit) - jurnal.nilai)
    //     jurnal.saldo = total
    //     // jurnal.saldo = (sumDebit - sumKredit)
    // }else{
    //     var total = jurnal.dk === 'd' ? ((sumDebit - sumKredit) + jurnal.nilai):((sumDebit - sumKredit) - jurnal.nilai)
    //     jurnal.saldo = total
    //     // jurnal.saldo = (sumKredit - sumDebit)
    // }
}

