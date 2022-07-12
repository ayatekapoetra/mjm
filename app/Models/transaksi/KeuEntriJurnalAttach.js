'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuEntriJurnalAttach extends Model {
    static get table(){
        return 'keu_jurnal_penyesuaian_attach'
    }
    
    sesuai () {
        return this.belongsTo("App/Models/transaksi/KeuEntriJurnal", "sesuai_id", "id")
    }
}

module.exports = KeuEntriJurnalAttach
