'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LogTerimaBarang extends Model {
    static get table(){
        return 'log_terima_barangs'
    }

    purchasing () {
        return this.belongsTo("App/Models/transaksi/KeuPurchasingRequest", "reff_order", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    gudang () {
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    penerima () {
        return this.belongsTo("App/Models/VUser", "receivedby", "id")
    }

    files () {
        return this.hasOne("App/Models/logistik/LogistikTerimaBarangAttach", "id", "logterima_id")
    }

    items () {
        return this.hasMany("App/Models/logistik/LogistikTerimaBarangItem", "id", "trx_terima")
    }
}

module.exports = LogTerimaBarang
