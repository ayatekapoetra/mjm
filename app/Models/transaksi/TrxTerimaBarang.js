'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTerimaBarang extends Model {
    reqOrder () {
        return this.belongsTo("App/Models/transaksi/TrxOrderBeli", "ro_id", "id")
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxTerimaBarangItem", "id", "trx_terima")
    }
}

module.exports = TrxTerimaBarang
