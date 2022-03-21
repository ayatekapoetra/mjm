'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxJurnalSaldo extends Model {
    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_id", "id")
    }

    jurnal () {
        return this.belongsTo("App/Models/transaksi/TrxJurnal", "jurnal_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "createdby", "id")
    }
}

module.exports = TrxJurnalSaldo
