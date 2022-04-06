'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BarangCategories extends Model {
    static get table(){
        return 'barang_subcategories'
    }

    kategori(){
        return this.belongsTo("App/Models/master/BarangCategories", "kategori_id", "id")
    }
}

module.exports = BarangCategories
