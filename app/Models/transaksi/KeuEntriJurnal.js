'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuEntriJurnal extends Model {
    static get table(){
        return 'keu_jurnal_penyesuaian'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    createdby () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }

    attach () {
        return this.hasMany("App/Models/transaksi/KeuEntriJurnalAttach", "id", "sesuai_id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/KeuEntriJurnalItem", "id", "sesuai_id")
    }
}

module.exports = KeuEntriJurnal
