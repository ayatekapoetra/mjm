'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxFakturJualBayar extends Model {
    fakturJual () {
        return this.belongsTo("App/Models/transaksi/TrxFakturJual", "trx_jual", "id")
    }

    tandaTerima () {
        return this.belongsTo("App/Models/transaksi/TrxTandaTerima", "tt_id", "id")
    }
}

module.exports = TrxFakturJualBayar
