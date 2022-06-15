'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OpsPelangganOrderService extends Model {
    static get table(){
        return 'ord_pelanggan_items'
    }

    order () {
        return this.belongsTo("App/Models/operational/OpsPelangganOrder", "order_id", "id")
    }

    jasa () {
        return this.belongsTo("App/Models/master/Jasa", "jasa_id", "id")
    }
}

module.exports = OpsPelangganOrderService
