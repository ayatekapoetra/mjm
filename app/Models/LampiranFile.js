'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LampiranFile extends Model {
    files () {
        return this.belongsTo("App/Models/transaksi/TrxOrderBeli", "ro_id", "id")
    }

    fbfiles () {
        return this.belongsTo("App/Models/transaksi/TrxFakturBeli", "fb_id", "id")
    }

    fjfiles () {
        return this.belongsTo("App/Models/transaksi/TrxFakturJual", "fj_id", "id")
    }
}

module.exports = LampiranFile
