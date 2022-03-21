'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTerimaBarangItem extends Model {
    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }
}

module.exports = TrxTerimaBarangItem
