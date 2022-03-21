'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxBank extends Model {
    static get table(){
        return 'trx_banks'
    }

    bank () {
        return this.belongsTo("App/Models/master/Bank", "bank_id", "id")
    }

    terima () {
        return this.belongsTo("App/Models/transaksi/TrxTandaTerima", "tt_id", "id")
    }

    bayar () {
        return this.belongsTo("App/Models/transaksi/TrxPembayaran", "bb_id", "id")
    }

    adjust () {
        return this.belongsTo("App/Models/transaksi/TrxJurnalAdjust", "ja_id", "id")
    }

    transferBank () {
        return this.belongsTo("App/Models/transaksi/TrxTransferKasBank", "trf_id", "id")
    }

}

module.exports = TrxBank
