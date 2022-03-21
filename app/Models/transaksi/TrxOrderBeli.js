'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxOrderBeli extends Model {
    static get table(){
        return 'trx_request_orders'
    }

    files () {
        return this.hasOne("App/Models/LampiranFile", "id", "ro_id")
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxOrderBeliItem", "id", "ro_id")
    }
}

module.exports = TrxOrderBeli
