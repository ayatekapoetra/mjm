'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BarangRack extends Model {
    // piv_rack () {
    //     return this
    //       .belongsToMany('App/Models/master/Barang')
    //       .pivotTable('mas_rack_mas_barang')
    // }

    // piv_barang () {
    //     return this
    //       .belongsToMany('App/Models/master/Rack')
    //       .pivotTable('mas_rack_mas_barang')
    // }
}

module.exports = BarangRack
