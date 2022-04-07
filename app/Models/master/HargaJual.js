'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HargaJual extends Model {
    static get table(){
        return 'harga_juals'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }
}

module.exports = HargaJual
