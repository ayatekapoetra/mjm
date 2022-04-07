'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OpsPurchasingOrder extends Model {
    static get table(){
        return 'trx_request_orders_items'
    }

    order () {
        return this.belongsTo("App/Models/operational/OpsPurchasingOrder", "order_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    userValidate () {
        return this.belongsTo("App/Models/User", "user_validated", "id")
    }

    userApprove () {
        return this.belongsTo("App/Models/User", "user_approved", "id")
    }
}

module.exports = OpsPurchasingOrder
