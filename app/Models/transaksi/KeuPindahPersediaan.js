'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class KeuPindahPersediaan extends Model {
    static get table(){
        return 'keu_pindah_persediaans'
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
        return this.hasMany("App/Models/transaksi/KeuPindahPersediaanItem", "id", "pindah_id")
    }

}

module.exports = KeuPindahPersediaan
