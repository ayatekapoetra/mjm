'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPurchasingRequest extends Model {
    static get table(){
        return 'keu_request_orders'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "createdby", "id")
    }

    approved () {
        return this.belongsTo("App/Models/VUser", "approvedby", "id")
    }

    attach () {
        return this.hasMany("App/Models/transaksi/KeuPurchasingRequestAttach", "id", "purchasing_id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/KeuPurchasingRequestItems", "id", "purchasing_id")
    }
}

module.exports = KeuPurchasingRequest
