'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuHapusPersediaanAttach extends Model {
    static get table(){
        return 'keu_hapus_persediaan_attach'
    }

    hapusPersediaan () {
        return this.belongsTo("App/Models/transaksi/KeuHapusPersediaan", "hapus_id", "id")
    }

}

module.exports = KeuHapusPersediaanAttach
