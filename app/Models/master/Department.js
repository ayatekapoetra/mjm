'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Department extends Model {
    static get table(){
        return 'mas_departments'
    }
}

module.exports = Department
