'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxJurnalAdjust extends Model {
    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    createdby () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }

    files () {
        return this.hasOne("App/Models/LampiranFile", "id", "ja_id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxJurnalAdjustItem", "id", "trx_adjust")
    }
}

module.exports = TrxJurnalAdjust
