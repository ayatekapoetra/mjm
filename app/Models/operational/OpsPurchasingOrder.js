'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OpsPurchasingOrder extends Model {
    static get table(){
        return 'trx_request_orders'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    items () {
        return this.hasMany("App/Models/operational/OpsPurchasingOrderItem", "id", "order_id")
    }
}

module.exports = OpsPurchasingOrder
