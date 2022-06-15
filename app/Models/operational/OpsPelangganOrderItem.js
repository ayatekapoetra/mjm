'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OpsPelangganOrderItem extends Model {
    static get table(){
        return 'ord_pelanggan_items'
    }

    order () {
        return this.belongsTo("App/Models/operational/OpsPelangganOrder", "order_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }
}

module.exports = OpsPelangganOrderItem
