'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Barang extends Model {
    static get table(){
        return 'mas_barangs'
    }

    brand () {
        return this.belongsTo("App/Models/master/BarangBrand", "brand_id", "id")
    }

    kategori () {
        return this.belongsTo("App/Models/master/BarangCategories", "kategori_id", "id")
    }

    subkategori () {
        return this.belongsTo("App/Models/master/BarangSubCategories", "subkategori_id", "id")
    }

    qualitas () {
        return this.belongsTo("App/Models/master/BarangQualities", "qualitas_id", "id")
    }

    coaIn () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_in", "id")
    }

    coaOut () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_out", "id")
    }

    hargaJual () {
        return this.hasOne("App/Models/master/HargaJual", "id", "barang_id")
    }

    hargaBeli () {
        return this.hasMany("App/Models/master/HargaBeli", "id", "barang_id")
    }
}

module.exports = Barang
