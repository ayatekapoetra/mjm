'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Karyawan extends Model {
    static get table(){
        return 'mas_karyawans'
    }

    bisnis () {
        return this.belongsTo("App/Models/BisnisUnit", "bisnis_id", "id")
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    dept () {
        return this.belongsTo("App/Models/master/Department", "department_id", "id")
    }
}


module.exports = Karyawan
