'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OpsPelangganOrder extends Model {
    static get table(){
        return 'ord_pelanggan'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "createdby", "id")
    }

    items () {
        return this.hasMany("App/Models/operational/OpsPelangganOrderItem", "id", "order_id")
    }

    jasa () {
        return this.hasMany("App/Models/operational/OpsPelangganOrderService", "id", "order_id")
    }
}

module.exports = OpsPelangganOrder
