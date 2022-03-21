'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxPembayaranItem extends Model {
    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_debit", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    paid () {
        return this.hasOne("App/Models/transaksi/TrxFakturBeliBayar", "id", "bbi_id")
    }
}

module.exports = TrxPembayaranItem
