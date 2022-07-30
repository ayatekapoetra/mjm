'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPindahPersediaanAttach extends Model {
    static get table(){
        return 'keu_pindah_persediaan_attach'
    }

    pindahPersediaan () {
        return this.belongsTo("App/Models/transaksi/KeuPindahPersediaan", "pindah_id", "id")
    }
}

module.exports = KeuPindahPersediaanAttach
