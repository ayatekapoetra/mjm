'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class TrxTransferKasBank extends Model {
    static get table(){
        return 'keu_transfer_kasbanks'
    }

    cabang () {
        return this.belongsTo("App/Models/master/Cabang", "cabang_id", "id")
    }

    bankSrc () {
        return this.belongsTo("App/Models/akunting/Bank", "bank_src", "id")
    }

    kasSrc () {
        return this.belongsTo("App/Models/akunting/Kas", "kas_src", "id")
    }
    
    bankTarget () {
        return this.belongsTo("App/Models/akunting/Bank", "bank_target", "id")
    }

    kasTarget () {
        return this.belongsTo("App/Models/akunting/Kas", "kas_target", "id")
    }

    coaScr () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_src_id", "id")
    }
    
    coaTarget () {
        return this.belongsTo("App/Models/akunting/AccCoa", "coa_target_id", "id")
    }

    createdby () {
        return this.belongsTo("App/Models/VUser", "author", "id")
    }

    files () {
        return this.hasMany("App/Models/transaksi/KeuTransferKasBankAttach", "id", "transfer_id")
    }
}

module.exports = TrxTransferKasBank
