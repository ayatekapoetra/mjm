'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuHapusPersediaanItem extends Model {
    static get table(){
        return 'keu_hapus_persediaan_items'
    }
    
    hapusPersediaan () {
        return this.belongsTo("App/Models/transaksi/KeuHapusPersediaan", "hapus_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }

}

module.exports = KeuHapusPersediaanItem
