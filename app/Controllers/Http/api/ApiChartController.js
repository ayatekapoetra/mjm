'use strict'

const _ = use("underscore")
const moment = use("moment")
moment.locale('ID')
const { performance } = require('perf_hooks')
const initFunc = use("App/Helpers/initFunc")
const OpsPelangganOrder = use("App/Models/operational/OpsPelangganOrder")
const version = '1.0'

class ApiChartController {
    async monthlySales ( { auth, request, response } ) {
        let durasi
        var t0 = performance.now()
        var req = request.all()

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

        var startDate = moment(req.startDate);
        var endDate = moment(req.endDate);
        var arrBulan = [];

        if (startDate < endDate){
            var date = startDate.startOf('month');

            while (date < endDate.endOf('month')) {
                arrBulan.push(date.format('YYYY-MM'));
                date.add(1,'month');
            }
        }

        console.log(arrBulan.map( v => moment(v).format('MMMYY')));

        let dataTotal = []
        try {
            for (const obj of arrBulan) {
                const data = 
                await OpsPelangganOrder.query().where( w => {
                    w.where('aktif', 'Y')
                    w.where('date', '>=', moment(obj).startOf('M').format('YYYY-MM-DD'))
                    w.where('date', '<=', moment(obj).endOf('M').format('YYYY-MM-DD'))
                    w.where('cabang_id', user.cabang_id)
                }).getSum('grandtot_trx') || 0
                
                dataTotal.push(data)
            }
        } catch (error) {
            console.log(error);
            durasi = await initFunc.durasi(t0)
            return response.status(403).json({
                diagnostic: {
                    ver: version,
                    times: durasi, 
                    error: true
                },
                data: error
            })
        }

        durasi = await initFunc.durasi(t0)
        return response.status(200).json({
            diagnostic: {
                ver: version,
                times: durasi, 
                error: false
            },
            data: {
                labels: arrBulan.map( v => moment(v).format('MMM')),
                legend: ['Sales/Month'],
                datasets: {
                    data: dataTotal
                }
            }
        })
    }
}

module.exports = ApiChartController

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