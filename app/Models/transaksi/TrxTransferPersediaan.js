'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTransferPersediaan extends Model {
    static get table(){
        return 'trx_transfer_persediaans'
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }
    
    gudangFrom () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_src", "id")
    }

    gudangTo () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_target", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "created_by", "id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxTransferPersediaanItem", "id", "pindah_id")
    }

}

module.exports = TrxTransferPersediaan
