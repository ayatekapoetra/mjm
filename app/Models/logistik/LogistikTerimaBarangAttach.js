'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class LogTerimaBarang extends Model {
    static get table(){
        return 'log_terima_barangs_attach'
    }

    logterima () {
        return this.belongsTo("App/Models/logistik/LogTerimaBarang", "logterima_id", "id")
    }
}

module.exports = LogTerimaBarang
