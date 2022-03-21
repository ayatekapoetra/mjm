'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BarangQualities extends Model {
    static get table(){
        return 'barang_qualities'
    }
}

module.exports = BarangQualities
