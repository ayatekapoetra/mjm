'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Kas extends Model {
    static get table(){
        return 'mas_kas'
    }
    
    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }
}

module.exports = Kas
