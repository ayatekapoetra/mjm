'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxOrderBeliItem extends Model {
    static get table(){
        return 'trx_request_orders_items'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    equipment () {
        return this.belongsTo("App/Models/master/Equipment", "equipment_id", "id")
    }

    userValidate () {
        return this.belongsTo("App/Models/User", "user_validated", "id")
    }

    userApprove () {
        return this.belongsTo("App/Models/User", "user_approved", "id")
    }
}

module.exports = TrxOrderBeliItem
