'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rack extends Model {
    static get table(){
        return 'barang_brands'
    }
}

module.exports = Rack
