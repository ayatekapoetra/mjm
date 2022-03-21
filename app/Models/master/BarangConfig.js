'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BarangConfig extends Model {
    static get table(){
        return 'barang_config'
    }
}

module.exports = BarangConfig
