'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class VBarangHarga extends Model {
    static get table(){
        return 'v_barang_harga'
    }
}

module.exports = VBarangHarga
