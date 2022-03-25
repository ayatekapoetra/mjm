'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rack extends Model {
    static get table(){
        return 'mas_bins'
    }

    cabang(){
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    gudang(){
        return this.belongsTo("App/Models/master/Gudang", "gudang_id", "id")
    }

    rack(){
        return this.belongsTo("App/Models/master/Rack", "rack_id", "id")
    }
}

module.exports = Rack
