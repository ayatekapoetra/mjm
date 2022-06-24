'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class DefCoa extends Model {
    static get table(){
        return 'def_coas'
    }
}

module.exports = DefCoa
