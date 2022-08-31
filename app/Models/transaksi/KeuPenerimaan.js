'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPenerimaan extends Model {
    static get table(){
        return 'keu_penerimaans'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    coaDebit () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_debit", "id")
    }

    createdby () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }
    
    items () {
        return this.hasMany("App/Models/transaksi/KeuPenerimaanItem", "id", "keuterima_id")
    }
    
    files () {
        return this.hasMany("App/Models/transaksi/KeuPenerimaanAttach", "id", "keuterima_id")
    }
}

module.exports = KeuPenerimaan
