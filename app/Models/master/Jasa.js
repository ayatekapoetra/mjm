'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Rack extends Model {
    static get table(){
        return 'mas_jasas'
    }
}

module.exports = Rack
