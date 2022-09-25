'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuHapusPersediaan extends Model {
    static get table(){
        return 'keu_hapus_persediaan'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }
    
    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "createdby", "id")
    }

    files () {
        return this.hasOne("App/Models/transaksi/KeuHapusPersediaanAttach", "id", "hapus_id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/KeuHapusPersediaanItem", "id", "hapus_id")
    }

}

module.exports = KeuHapusPersediaan
