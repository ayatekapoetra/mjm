'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HargaBeli extends Model {
    static get table(){
        return 'harga_belis'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }
}

module.exports = HargaBeli
