'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rack extends Model {
    static get table(){
        return 'mas_racks'
    }

    cabang(){
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang(){
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    bin(){
        return this.hasMany("App/Models/master/Bin", "id", "rack_id")
    }
}

module.exports = Rack
