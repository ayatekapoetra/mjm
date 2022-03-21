'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTandaTerima extends Model {
    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_debit", "id")
    }

    user () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }

    files () {
        return this.hasOne("App/Models/LampiranFile", "id", "tt_id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxTandaTerimaItem", "id", "trx_terimaid")
    }

    // paid () {
    //     return this.hasOne("App/Models/transaksi/TrxFakturJualBayar", "id", "tt_id")
    // }
}

module.exports = TrxTandaTerima
