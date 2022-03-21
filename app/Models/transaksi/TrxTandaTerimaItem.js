'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTandaTerimaItem extends Model {
    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_kredit", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    paid () {
        return this.hasOne("App/Models/transaksi/TrxFakturJualBayar", "id", "tti_id")
    }
}

module.exports = TrxTandaTerimaItem
