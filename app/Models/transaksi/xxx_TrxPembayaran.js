'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxPembayaran extends Model {
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
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_kredit", "id")
    }

    user () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }

    files () {
        return this.hasOne("App/Models/LampiranFile", "id", "bb_id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxPembayaranItem", "id", "paid_id")
    }
}

module.exports = TrxPembayaran
