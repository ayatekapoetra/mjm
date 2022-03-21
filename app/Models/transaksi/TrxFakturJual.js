'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxFakturJual extends Model {
    static get table(){
        return 'trx_faktur_juals'
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    author () {
        return this.belongsTo("App/Models/VUser", "createdby", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "cust_id", "id")
    }

    files () {
        return this.hasOne("App/Models/LampiranFile", "id", "fj_id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/TrxFakturJualItem", "id", "trx_jual")
    }

    payment () {
        return this.hasMany("App/Models/transaksi/TrxFakturJualBayar", "id", "trx_jual")
    }
}

module.exports = TrxFakturJual
