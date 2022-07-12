'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuEntriJurnalItem extends Model {
    static get table(){
        return 'keu_jurnal_penyesuaian_items'
    }
    
    sesuai () {
        return this.belongsTo("App/Models/transaksi/KeuEntriJurnal", "sesuai_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    barang () {
        return this.belongsTo("App/Models/master/Gudang", "barang_id", "id")
    }

    beli () {
        return this.belongsTo("App/Models/transaksi/TrxFakturBeli", "trx_beli", "id")
    }

    jual () {
        return this.belongsTo("App/Models/operational/OpsPelangganOrder", "order_id", "id")
    }

    coa () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_id", "id")
    }
}

module.exports = KeuEntriJurnalItem
