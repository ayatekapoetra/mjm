'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPembayaran extends Model {
    static get table(){
        return 'keu_pembayarans'
    }

    coaKredit () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_kredit", "id")
    }

    pemasok () {
        return this.belongsTo("App/Models/master/Pemasok", "pemasok_id", "id")
    }

    pelanggan () {
        return this.belongsTo("App/Models/master/Pelanggan", "pelanggan_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    createdby () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }

    items () {
        return this.hasMany("App/Models/transaksi/KeuPembayaranItem", "id", "keubayar_id")
    }

    files () {
        return this.hasMany("App/Models/transaksi/KeuPembayaranAttach", "id", "keubayar_id")
    }
}

module.exports = KeuPembayaran
