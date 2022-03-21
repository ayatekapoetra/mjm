'use strict'

const DB = use('Database')
const BisnisUnit = use("App/Models/BisnisUnit")
const AccCoa = use("App/Models/akunting/AccCoa")
const jsonCoa = use("App/Helpers/JSON/init_AccCoas")
const UsrBisnisUnit = use("App/Models/UsrBisnisUnit")
const jsonCoaGroup = use("App/Helpers/JSON/init_CoaGrp")
const AccCoaGroup = use("App/Models/akunting/AccCoaGroup")

class Bisnis {
    async LIST (req) {
        const limit = req.limit || 25;
        const halaman = req.page === undefined ? 1 : parseInt(req.page);
        let data = await BisnisUnit.query().paginate(halaman, limit)
        if(data){
            return data.toJSON()
        }else{
            return null
        }
    }

    async POST (req, usr) {
        const trx = await DB.beginTransaction()
        if((req.initial).length > 4){
            return {
                success: false,
                message: 'Initial bisnis tdk boleh lebih dari 4 karakter'
            }
        }
        req.initial = ((req.initial).replace(/\s/g, '')).toUpperCase()

        const bisnis = new BisnisUnit()

        try {
            bisnis.fill(req)
            await bisnis.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save Bisnis Unit '+ JSON.stringify(error)
            }
        }

        

        for (const obj of jsonCoaGroup.RECORDS) {
            const accCoaGroup = new AccCoaGroup()
            try {
                accCoaGroup.fill({...obj, bisnis_id: bisnis.id})
                await accCoaGroup.save(trx)

                var akunGrp = jsonCoa.RECORDS.filter(elm => (elm.kode).includes(obj.kode))

                for (const item of akunGrp) {
                    const accCoa = new AccCoa()
                    if (akunGrp.length > 0) {
                        accCoa.fill({...item, bisnis_id: bisnis.id, coa_grp: accCoaGroup.id})
                    }
                    try {
                        await accCoa.save(trx)
                    } catch (error) {
                        console.log(error);
                        await trx.rollback()
                        return {
                            success: false,
                            message: 'Failed save Akun '
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Akun Group '
                }
            }
        }

        var akun = jsonCoa.RECORDS.filter(elm => parseInt(elm.coa_tipe) >= 3)

        for (const item of akun) {
            const accCoa = new AccCoa()
            accCoa.fill({...item, bisnis_id: bisnis.id})
            try {
                await accCoa.save(trx)
            } catch (error) {
                console.log(error);
                await trx.rollback()
                return {
                    success: false,
                    message: 'Failed save Akun '
                }
            }
        }

        try {
            const usrBisnisUnit = new UsrBisnisUnit()
            usrBisnisUnit.fill({
                user_id: usr.id,
                bisnis_unit_id: bisnis.id
            })
            await usrBisnisUnit.save(trx)
        } catch (error) {
            console.log(error);
            await trx.rollback()
            return {
                success: false,
                message: 'Failed save User Bisnis Unit '
            }
        }

        await trx.commit()
        return {
            success: true,
            message: 'Success save data...'
        }
    }

    async SHOW (params) {
        const data = await BisnisUnit.query().where('id', params.id).last()
        if(data){
            return data.toJSON()
        }else{
            return null
        }
    }

    async UPDATE (params, req) {
        let result = {}

        if((req.initial).length > 4){
            return {
                success: false,
                message: 'Initial bisnis tdk boleh lebih dari 4 karakter'
            }
        }

        req.initial = ((req.initial).replace(/\s/g, '')).toUpperCase()

        let bisnisUnit = await BisnisUnit.query().where('id', params.id).last()

        try {
            bisnisUnit.merge(req)
            await bisnisUnit.save()
            result.success = true
            result.message = 'Success save data...'
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed save data...'+ JSON.stringify(error)
            }
        }
    }

    async DELETE (params) {
        let result = {}
        let bisnisUnit = await BisnisUnit.query().where('id', params.id).last()
        try {
            await bisnisUnit.delete()
            result.success = true
            result.message = 'Success save data...'
            return {
                success: true,
                message: 'Success save data...'
            }
        } catch (error) {
            return {
                success: false,
                message: 'Failed save data...'+ JSON.stringify(error)
            }
        }
    }
}

module.exports = new Bisnis()