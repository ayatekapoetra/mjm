'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxKase extends Model {
    static get table(){
        return 'trx_kases'
    }

    kas () {
        return this.belongsTo("App/Models/master/Kas", "kas_id", "id")
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

    transferKas () {
        return this.belongsTo("App/Models/transaksi/TrxTransferKasBank", "trf_id", "id")
    }
}

module.exports = TrxKase
