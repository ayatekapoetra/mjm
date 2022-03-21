'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxFakturBeli extends Model {
    static get table(){
        return 'trx_faktur_belis'
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/User", "createdby", "id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxFakturBeliItem", "id", "fakturbeli_id")
    }

    files () {
        return this.hasOne("App/Models/LampiranFile", "id", "fb_id")
    }
}

module.exports = TrxFakturBeli
