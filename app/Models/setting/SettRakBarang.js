'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SettRakBarang extends Model {
    static get table(){
        return 'set_barang_rak'
    }

    cabang(){
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang(){
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    bin(){
        return this.belongsTo("App/Models/master/Bin", "bin_id", "id")
    }

    rack(){
        return this.belongsTo("App/Models/master/Rack", "rack_id", "id")
    }

    barang(){
        return this.belongsTo("App/Models/master/Barang", "barang_id", "id")
    }
}

module.exports = SettRakBarang
