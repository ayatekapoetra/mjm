'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxHapusPersediaan extends Model {
    static get table(){
        return 'trx_hapus_persediaans'
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }
    
    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }
    
    coaKredit () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_kredit", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "created_by", "id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxHapusPersediaanItem", "id", "hapus_id")
    }
}

module.exports = TrxHapusPersediaan
