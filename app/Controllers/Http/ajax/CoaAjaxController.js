'use strict'

const Kas = use("App/Models/akunting/Kas")
const Bank = use("App/Models/akunting/Bank")
const initFunc = use("App/Helpers/initFunc")
const Barang = use("App/Models/master/Barang")
const Gudang = use("App/Models/master/Gudang")
const Pelanggan = use("App/Models/master/Pelanggan")
const Pemasok = use("App/Models/master/Pemasok")
const AccCoa = use("App/Models/akunting/AccCoa")
// const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
// const TrxFakturBeli = use("App/Models/transaksi/TrxFakturBeli")
const UsrWorkspace = use("App/Models/UsrWorkspace")

class CoaAjaxController {

    /** LIST COA **/
    async listCoaName ( { request } ) {
        var req = request.all()
        let data = (
            await AccCoa
            .query()
            .orderBy('urut', 'asc')
            .fetch()
        ).toJSON()

        
        data = data.map(elm => elm.id == parseInt(req.selected) ? {...elm, selected: 'selected'} : {...elm, selected: ''})
        
        return data
    }

    /** LIST COA BANK **/
    async listBank ( { request } ) {
        // 100.1.1.1.2
        var req = request.all()
        let data = (
            await AccCoa.query().where( w => {
                if(req.cabang_id){
                    w.where('bisnis_id', req.cabang_id)
                }
                w.where('is_akun', 'A')
                w.where('id', 'like', '111%')
            }).fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            // data = [...data, {id: '', coa_name: 'Pilih', selected: 'selected'}]
            data.unshift({id: '', coa_name: 'Pilih', selected: 'selected'})
        }

        return data
    }

    async isBank ( { request, view } ) {
        var req = request.all()
        let bank = (
            await Bank.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', req.bisnis_id)
                w.where('coa_id', req.coa_id)
            }).fetch()
        ).toJSON()
        
        let kas = (
            await Kas.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', req.bisnis_id)
                w.where('coa_id', req.coa_id)
            }).fetch()
        ).toJSON()

        if(bank.length > 0){
            return view.render('components.option-bank', {list: bank})
        }else if(kas.length > 0){
            return view.render('components.option-kas', {list: kas})
        }else{
            return view.render('components.option-bank')
        }
    }

    async isBankOut ( { request, view } ) {
        var req = request.all()
        let bank = (
            await Bank.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', req.bisnis_id)
                w.where('coa_id', req.coa_id)
            }).fetch()
        ).toJSON()
        
        let kas = (
            await Kas.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', req.bisnis_id)
                w.where('coa_id', req.coa_id)
            }).fetch()
        ).toJSON()

        if(bank.length > 0){
            return view.render('components.option-bank-out', {list: bank})
        }else if(kas.length > 0){
            return view.render('components.option-kas-out', {list: kas})
        }else{
            return view.render('components.option-bank-out')
        }
    }

    async isBankIn ( { request, view } ) {
        var req = request.all()
        let bank = (
            await Bank.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', req.bisnis_id)
                w.where('coa_id', req.coa_id)
            }).fetch()
        ).toJSON()
        
        let kas = (
            await Kas.query().where( w => {
                w.where('aktif', 'Y')
                w.where('bisnis_id', req.bisnis_id)
                w.where('coa_id', req.coa_id)
            }).fetch()
        ).toJSON()

        if(bank.length > 0){
            return view.render('components.option-bank-in', {list: bank})
        }else if(kas.length > 0){
            return view.render('components.option-kas-in', {list: kas})
        }else{
            return view.render('components.option-bank-in')
        }
    }

    async checkFaktur ( { request, view } ) {
        var req = request.all()
        const coa = await AccCoa.query().where( w => {
            if(req.selected){
                w.where('id', req.selected)
            }
            w.where('bisnis_id', req.bisnis_id)
        }).last()
        console.log('checkFaktur ::', req);
        switch (coa.kode) {
            case '100.3':
                let gudang = (await Gudang.query().where( w => {
                    w.where('bisnis_id', req.bisnis_id)
                }).fetch()).toJSON()
                gudang = gudang.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
                return view.render('components.option-gudang', { list: gudang })
            case '100.4':
                let pelanggan = (await Pelanggan.query().where( w => {
                    w.where('bisnis_id', req.bisnis_id)
                }).fetch()).toJSON()
                pelanggan = pelanggan.map(el => el.id === parseInt(req.pelanggan_id) ? {...el, selected: 'selected'} : {...el, selected: ''})
                return view.render('components.option-pelanggan', { list: pelanggan })
            case '200.1.1':
                let pemasok = (await Pemasok.query().where( w => {
                    w.where('bisnis_id', req.bisnis_id)
                }).fetch()).toJSON()
                pemasok = pemasok.map(el => el.id === parseInt(req.pemasok_id) ? {...el, selected: 'selected'} : {...el, selected: ''})
                return view.render('components.option-pemasok', { list: pemasok })
        }
    }

    async fakturPelanggan ( { request, view } ) {
        var req = request.all()
        const fakturJual = (
            await TrxFakturJual.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('cust_id', req.pelanggan_id)
                w.where('status', 'bersisa')
            }).fetch()
        ).toJSON()

        return view.render('components.option-faktur-jual', {
            list: fakturJual
        })
    }

    async fakturPemasok ( { request, view } ) {
        var req = request.all()
        const fakturBeli = (
            await TrxFakturBeli.query().where( w => {
                w.where('pemasok_id', req.pemasok_id)
                w.where('bisnis_id', req.bisnis_id)
                w.where('sts_paid', 'bersisa')
                w.whereNotNull('due_date')
            }).fetch()
        ).toJSON()

        return view.render('components.option-faktur-beli', {
            list: fakturBeli
        })
    }

    async fakturGudang ( { request, view } ) {
        var req = request.all()
        // const gudang = (
        //     await Gudang.query()
        //     .where('bisnis_id', req.bisnis_id)
        //     .fetch()
        // ).toJSON()

        const barang = await Barang.query().where('id', req.selected).last()

        return barang
    }

    async coaHTML ( { request, view } ) {
        var req = request.all()
        let coa = (
            await AccCoa.query().with('group')
            .where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.whereNotIn('kode', ['100.1.1', '100.1.2'])
            }).fetch()
        ).toJSON()

        coa = coa.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})

        return view.render('components.option-coa', {
            list: coa,
            field: 'coa_kredit'
        })
    }

    /** LIST COA KAS **/
    async listKas ( { request } ) {
        // 100.1.1.1.1
        var req = request.all()
        let data = (
            await AccCoa.query().where( w => {
                if(req.cabang_id){
                    w.where('cabang_id', req.cabang_id)
                }
                w.where('is_akun', 'A')
                w.where('id', 'like', '112%')
            }).fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', coa_name: 'Pilih', selected: 'selected'})
        }

        return data
    }

    async coaById ({ request }) {
        const req = request.only(['id'])

        let data = await AccCoa.query().where( w => {
                w.where('id', req.id)
            }).last()

        console.log(data);
        if(data){
            return data.toJSON()
        }else{
            return null
        }
    }

    async coaByKode ({ request }) {
        const req = request.only(['bisnis_id', 'kode'])

        let data = (
            await AccCoa.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('kode', req.kode)
            }).last() || {}
        ).toJSON()

        return data
    }

    async coaAset ({ request }) {
        const req = request.only(['bisnis_id', 'kode', 'selected'])

        let data = (
            await AccCoa.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('kode', 'like', `100.%`)
                w.where('is_akun', 'A')
            }).fetch() || []
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})
        return data
    }

    async coaKasBank ({ request }) {
        const req = request.only(['bisnis_id', 'selected'])

        let data = (
            await AccCoa.query()
            .where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('is_akun', 'A')
                w.whereIn('kode', ['100.1.1', '100.1.2'])
            })
            .fetch() || []
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})
        return data
    }

    async saldoAwal ({ request }) {
        const req = request.only(['bisnis_id', 'selected'])

        let data = (
            await AccCoa.query()
            .where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('is_akun', 'A')
                w.where('coa_tipe', '<=', 3)
                w.whereNotIn('kode', ['100.1.1', '100.1.2'])
            })
            .fetch() || []
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})
        return data
    }

    async biaya ({ request }) {
        const req = request.only(['bisnis_id', 'selected'])

        let data = (
            await AccCoa.query()
            .where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('is_akun', 'A')
                w.where('coa_tipe', 5)
            })
            .fetch() || []
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})
        return data
    }
}

module.exports = CoaAjaxController
