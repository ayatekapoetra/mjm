'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPindahPersediaanItem extends Model {
    static get table(){
        return 'keu_pindah_persediaan_items'
    }

    PindahPersediaan () {
        return this.belongsTo("App/Models/transaksi/KeuPindahPersediaan", "pindah_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }
}

module.exports = KeuPindahPersediaanItem
