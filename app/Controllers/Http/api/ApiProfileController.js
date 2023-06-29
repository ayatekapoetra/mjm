'use strict'

const VUser = use("App/Models/VUser")
const UsrProfile = use("App/Models/UsrProfile")
const UsrCabang = use("App/Models/UsrCabang")
const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")
const version = '1.0'

class ApiProfileController {
    async myprofile ({auth, response}) {
        let durasi
        var t0 = performance.now()
        const user = await userValidate(auth)
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        const userCabang = (
            await UsrCabang.query().with('cabang').where( w => {
                w.where('user_id', user.id)
            }).fetch()
        )?.toJSON()
        
        try {
            const profile = (
                await UsrProfile.query()
                .with('user')
                .where('user_id', user.id)
                .last()
            )?.toJSON()

            durasi = await initFunc.durasi(t0)
            return response.status(200).json({
                diagnostic: {
                    times: durasi, 
                    error: false,
                },
                data: {...profile, workspace: userCabang}
            })
            
        } catch (error) {
            console.log(error);
            durasi = await initFunc.durasi(t0)
            return response.status(201).json({
                diagnostic: {
                    times: durasi, 
                    error: true,
                },
                data: []
            })
        }
    }

    async changeWorkSpace ( { auth, params, response } ) {
        let durasi
        var t0 = performance.now()
        const user = await userValidate(auth)
        if(!user){
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'not authorized...'
                }
            })
        }

        console.log(params);
        const array = (await UsrCabang.query().where('user_id', user.id).fetch()).toJSON()
        for (const val of array) {
            const nonAktif = await UsrCabang.query().where('id', val.id).last()
            nonAktif.merge({aktif: 'N'})
            await nonAktif.save()
        }

        const updAktif = await UsrCabang.query().where( w => {
            w.where('user_id', user.id)
            w.where('cabang_id', params.cabang_id)
        }).last()

        try {
            updAktif.merge({aktif: "Y"})
            await updAktif.save()
            return response.status(201).json({
                diagnostic: {
                    ver: version,
                    error: false,
                },
                data: updAktif.toJSON()
            })
        } catch (error) {
            return response.status(500).json({
                diagnostic: {
                    ver: version,
                    error: true,
                    message: 'failed change workspace user...'
                },
                data: null
            })
        }

    }
}

module.exports = ApiProfileController

async function userValidate(auth){
    let user
    try {
        user = await auth.authenticator('jwt').getUser()
        return user
    } catch (error) {
        console.log(error);
        return null
    }
}