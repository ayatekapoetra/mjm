'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VBarangStok extends Model {
    static get table(){
        return 'v_barang_stok'
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "id", "id")
    }
}

module.exports = VBarangStok
