'use strict'

const _ = require('underscore')
const moment = require('moment')
require('moment/locale/id')
const VUser = use("App/Models/VUser")
const UsrMenu = use("App/Models/UsrMenu")
const SysMenu = use("App/Models/SysMenu")
const Jasa = use("App/Models/master/Jasa")
const Gaji = use("App/Models/master/Gaji")
const Rack = use("App/Models/master/Rack")
const Bank = use("App/Models/akunting/Bank")
const Kas = use("App/Models/akunting/Kas")
const initFunc = use("App/Helpers/initFunc")
const UsrCabang = use("App/Models/UsrCabang")
const SysOption = use("App/Models/SysOption")
const Cabang = use("App/Models/master/Cabang")
const Gudang = use("App/Models/master/Gudang")
const Barang = use("App/Models/master/Barang")
const SysSubmenu = use("App/Models/SysSubmenu")
const Pemasok = use("App/Models/master/Pemasok")
const AccCoa = use("App/Models/akunting/AccCoa")
const Karyawan = use("App/Models/master/Karyawan")
const UsrWorkspace = use("App/Models/UsrWorkspace")
const Notification = use("App/Models/Notification")
const Equipment = use("App/Models/master/Equipment")
const Pelanggan = use("App/Models/master/Pelanggan")
const Department = use("App/Models/master/Department")
const BarangBrand = use("App/Models/master/BarangBrand")
const AccCoaTipe = use("App/Models/akunting/AccCoaTipe")
const HargaRental = use("App/Models/master/HargaRental")
const AccCoaGroup = use("App/Models/akunting/AccCoaGroup")
const AccCoaSubGroup = use("App/Models/akunting/AccCoaSubGroup")
const HargaJualBarang = use("App/Models/master/HargaJual")
const GajiComponent = use("App/Models/master/GajiComponent")
// const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
const BarangQualities = use("App/Models/master/BarangQualities")
const BarangCategories = use("App/Models/master/BarangCategories")
const LogTerimaBarang = use("App/Models/logistik/LogistikTerimaBarang")
const BarangSubCategories = use("App/Models/master/BarangSubCategories")
const KeuFakturPembelian = use("App/Models/transaksi/KeuFakturPembelian")
const KeuPurchasingRequest = use("App/Models/transaksi/KeuPurchasingRequest")
const KeuPurchasingRequestItems = use("App/Models/transaksi/KeuPurchasingRequestItems")

// const jsonData = use("App/Helpers/JSON/barang_sewas")

moment.locale('id');

class OptionsAjaxController {
    async index ( { request } ) {
        const req = request.all()
        let options = (
                await SysOption.query().where( w => {
                w.where('group', req.group)
                w.where('status', 'Y')
            }).orderBy('urut', 'desc')
            .fetch()
        ).toJSON()

        // options = options.map(obj => obj.nilai === req.selected ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        if(req.selected){
            options = options.map(el => el.nilai === req.selected ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            options.unshift({nilai: '', teks: 'Pilih', selected: 'selected'})
        }
        
        return options

    }

    async mainmenu ( { request } ) {
        const req = request.all()
        let menu = (
                await SysMenu.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('urut', 'asc')
            .fetch()
        ).toJSON()

        menu = menu.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        
        return menu

    }

    async submenu ( { request } ) {
        const req = request.all()
        let submenu = (
                await SysSubmenu.query().with('menu').where( w => {
                w.where('aktif', 'Y')
                if(req.menu_id){
                    w.where('menu_id', req.menu_id)
                }
            }).orderBy('urut', 'asc')
            .fetch()
        ).toJSON()

        submenu = submenu.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})
        
        console.log('submenu :::', req);
        return submenu

    }



    async menu ( { request, view } ) {
        const req = request.all()
        const user = await VUser.query().where('id', req.id).last()
        const bisnisunit = await UsrWorkspace.query().where('user_id', user.id).last()
        
        let menuAkses = []
        const usrMenu = (
            await UsrMenu.query()
            .with('user')
            .with('menu')
            .with('submenu')
            .where( w => {
                w.where('user_id', req.id)
                w.where('aktif', 'Y')
            })
            .fetch()
        ).toJSON()
        
        let groupingMenu = _.groupBy(usrMenu, 'menu_id')
        groupingMenu = Object.keys(groupingMenu).map( key => {
          return {
            menu_id: key,
            submenu: groupingMenu[key].map( obj => {
              return {
                bisnis_id: bisnisunit.id,
                submenu_id: obj.submenu.id,
                name: obj.submenu.name,
                icon: obj.submenu.icon,
                uri: obj.submenu.uri,
                urut: obj.submenu.urut,
                kode: obj.submenu.kode
              }
            })
          }
        })

        for (const val of groupingMenu) {
          const menu = await SysMenu.query().where('id', val.menu_id).last()
  
          menuAkses.push({
            ...val,
            name: menu.name,
            icon: menu.icon,
            uri: menu.uri,
            urut: menu.urut,
            kode: menu.kode
          })
        }

        return view.render('components._sidebar.list', {data: menuAkses,user: user.toJSON()})
    }

    async routex ( { request } ) {
        const req = request.all()
        let data = (
                await SysSubmenu.query()
                .with('menu')
                .where( w => {
                w.where('aktif', 'Y')
            }).orderBy('menu_id', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => (obj.alias).split('/')[1] === req.selected ? {...obj, id: (obj.alias).split('/')[1], selected: 'selected'} : {...obj, id: (obj.alias).split('/')[1], selected: ''})
        
        return data

    }

    async users ( { request } ) {
        const req = request.all()
        let data = (
                await VUser.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama_lengkap', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        
        return data

    }

    async notification ( { auth, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return
        }
        const countMessage = await Notification.
            query().
            with('pengirim').
            where( w => {
                w.where('status', 'unread')
                w.where('receiver', user.id)
            }).
            orderBy('created_at', 'desc').
            getCount()

        const notif = (
            await Notification.
            query().
            with('pengirim').
            where( w => {
                w.where('status', 'unread')
                w.where('receiver', user.id)
            }).
            orderBy('created_at', 'desc').
            limit(5).
            fetch()
        ).toJSON()

        let data = notif.map(el => {
            return {
                ...el,
                created_at: moment(el.created_at, "YYYYMMDD HH:mm").fromNow()
            }
        })
        // console.log(data);
        return view.render('components.notification.list', {list: data, count: countMessage})
    }

    async notificationCount ( { auth } ) {
        const user = await userValidate(auth)
        if(!user){
            return
        }
        const countMessage = await Notification.
            query().
            with('pengirim').
            where( w => {
                w.where('status', 'unread')
                w.where('receiver', user.id)
            }).
            orderBy('created_at', 'desc').
            getCount()
        // console.log(data);
        return countMessage
    }

    async coa ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await AccCoa.query()
                .where( w => {
                w.where('is_akun', 'A')
                w.where('aktif', 'Y')
            }).orderBy('kode', 'desc')
            .fetch()
        ).toJSON()

        if(req.selected)
        data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
        data.push({id: '', kode: '', coa_name: 'Pilih', selected: 'selected'})
        
        return data

    }

    async coaKode ( { request } ) {
        const req = request.all()
        let data = (
                await AccCoa.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('is_akun', 'A')
                w.where('aktif', 'Y')
            }).orderBy('kode', 'desc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.kode === req.selected ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        
        return data

    }

    async coaKategori ( { request } ) {
        const req = request.all()
        console.log(req);
        let data
        try {
            data = (
                await AccCoaTipe.query().orderBy('urut', 'asc').fetch()
            ).toJSON()
        } catch (error) {
            console.log(error);
        }

        data = data.map(obj => obj.kode === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        return data
    }

    async coaGroup ( { request } ) {
        const req = request.all()
        console.log(req);
        let data
        try {
            data = (
                await AccCoaGroup.query().with('tipe').where( w => {
                    if(req.coa_tipe){
                        w.where('coa_tipe', req.coa_tipe)
                    }
                }).orderBy('urut', 'asc').fetch()
            ).toJSON()
        } catch (error) {
            console.log(error);
        }

        data = data?.map(obj => obj.kode === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''}) || []

        return data
    }

    async coaSubGroup ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await AccCoaSubGroup.query().where( w => {
                    if(req.coa_group){
                        w.where('coa_group', req.coa_group)
                    }
                w.where('aktif', 'Y')
            }).orderBy('coa_group', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', kode: 'x', subgrp_name: 'Pilih', selected: 'selected'})
        }
        
        return data
    }

    async coaNastingList ( { request, view } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected

        let coaAkun = (await AccCoa.query().orderBy('id', 'asc').fetch()).toJSON()
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'bank' )
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'kas' )

        if(req.selected){
            coaAkun = coaAkun.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            coaAkun.unshift({id: '', coa_tipe_nm: 'Akun Debit', coa_name: 'Pilih...', selected: 'selected'})
        }
        
        let data = _.groupBy(coaAkun, 'coa_tipe_nm')
        data = Object.keys(data).map(key => {
            return {
                tipe: key,
                items: data[key]
            }
        })

        return coaAkun
    }

    /** LIST KAS **/
    async listKas ( { auth, request } ) {
        var req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return
        }

        var pusat = ['administrator', 'developer', 'keuangan'].includes(user.usertype)

        let data
        if(pusat){
            data = (
                await Kas.query().where( w => {
                    if(req.keyword){
                        w.where('name', 'like', `%${req.keyword}%`)
                    }
                }).orderBy('coa_id', 'desc').fetch()
            ).toJSON()
        }else{
            const ws = await initFunc.WORKSPACE(user)
            data = (
                await Kas.query().where( w => {
                    w.where('cabang_id', ws.cabang_id)
                    if(req.keyword){
                        w.where('name', 'like', `%${req.keyword}%`)
                    }
                }).orderBy('coa_id', 'desc').fetch()
            ).toJSON()
        }


        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', name: 'Pilih', selected: 'selected'})
        }

        return data
    }

    /** LIST BANK **/
    async listBank ( { auth, request } ) {
        var req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return
        }

        var pusat = ['administrator', 'developer', 'keuangan'].includes(user.usertype)
        let data
        if(pusat){
            data = (
                await Bank.query().where( w => {
                    w.where('aktif', 'Y')
                }).fetch()
            ).toJSON()
        }else{
            const ws = await initFunc.WORKSPACE(user)
            data = (
                await Bank.query().where( w => {
                    w.where('cabang_id', ws.cabang_id)
                }).fetch()
            ).toJSON()
        }

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', name: 'Pilih', selected: 'selected'})
        }

        return data
    }

    // async bisnis ( { request } ) {
    //     const req = request.all()
    //     let data = (
    //             await BisnisUnit.query().orderBy('initial', 'asc')
    //         .fetch()
    //     ).toJSON()

    //     data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        
    //     return data

    // }

    async cabang ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        const ws = await initFunc.WORKSPACE(user)
        req.selected = req.selected === 'null' ? null : req.selected

        var pusat = ['administrator', 'developer', 'keuangan'].includes(user.usertype)
        let data = (
                await Cabang.query().where( w => {
                    if(!pusat){
                        w.where('cabang_id', ws.cabang_id)
                    }
                w.where('aktif', 'Y')
            }).orderBy('tipe', 'desc')
            .fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
        }
        
        return data

    }

    async cabangShow ( { params } ) {
        let data = (
            await Cabang
                .query()
                .where('id', params.id)
                .orderBy('tipe', 'desc')
                .last()
        ).toJSON()
        return data

    }

    async workspace ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await UsrCabang.query().with('cabang').where( w => {
                w.where('user_id', req.user_id)
            }).orderBy('cabang_id', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => {
            return {
                cabang_id: obj.cabang_id,
                user_id: obj.user_id,
                kode: obj.cabang?.kode,
                nama: obj.cabang?.nama
            }
        })

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
        }
        
        return data

    }

    async gudang ( { request } ) {
        const req = request.all()
        if(!req.selected || req.selected === 'null' || req.selected === 'nullundefined'){
            req.selected = null
        }

        let data = (
                await Gudang.query().where( w => {
                    if (req.cabang_id) {
                        w.where('cabang_id', req.cabang_id)
                    }
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            if (!req.cabang_id) {
                data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
            }else{
                data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: ''})
            }
        }
        return data
    }

    async gudangGroupCabang ( { request } ) {
        const req = request.all()
        if(!req.selected || req.selected === 'null' || req.selected === 'nullundefined'){
            req.selected = null
        }

        let data = (
                await Gudang.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        data = _.groupBy(data, 'cabang_id')
        data = Object.keys(data).map(key => {
            return {
                cabang_id: key,
                items: data[key]
            }
        })

        let result = []
        for (const obj of data) {
            const cabang = await Cabang.query().where('id', obj.cabang_id).last()
            result.push({
                cabang_id: obj.cabang_id,
                nm_cabang: cabang.nama,
                items: obj.items?.map(val => val.id === parseInt(req.selected) ? {...val, selected: 'selected'}:{...val, selected: ''})
            })
        }
        
        return result
    }

    async department ( { request } ) {
        const req = request.all()
        let data = (
                await Department.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('name', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', kode: '', nama: 'Pilih', selected: 'selected'})
        }
        return data
    }

    async rack ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await Rack.query().where( w => {
                    if (req.gudang_id) {
                        w.where('gudang_id', req.gudang_id)
                    }
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected)
        data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
        data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
        return data
    }

    async barang ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await Barang.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected)
        data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
        data.unshift({id: '', kode: 'x', num_part: 'x', nama: 'Pilih', selected: 'selected'})
        return data
    }

    async barangID ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return
        }
        
        const ws = await initFunc.WORKSPACE(user)
        let data = (
                await Barang.query()
                .with('brand')
                .with('qualitas')
                .with('kategori')
                .with('subkategori')
                .with('hargaJual')
                .with('hargaBeli')
                .with('coaIn')
                .with('coaOut')
                .where( w => {
                    w.where('id', params.id)
                    w.where('aktif', 'Y')
                }).orderBy('nama', 'asc')
            .last()
        ).toJSON()

       return data
    }

    async jasa ( { auth, request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected

        const user = await userValidate(auth)
        if(!user){
            return
        }
        
        const ws = await initFunc.WORKSPACE(user)
        let data = (
                await Jasa.query().where( w => {
                w.where('cabang_id', ws.cabang_id)
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected)
        data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
        data.unshift({id: '', kode: 'x', num_part: 'x', nama: 'Pilih', selected: 'selected'})
        return data
    }

    async jasaID ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return
        }
        
        const ws = await initFunc.WORKSPACE(user)
        let data = (
                await Jasa.query()
                .with('cabang')
                .where( w => {
                    w.where('cabang_id', ws.cabang_id)
                    w.where('id', params.id)
                    w.where('aktif', 'Y')
                }).orderBy('nama', 'asc')
            .last()
        ).toJSON()

       return data
    }

    async barangBrand ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await BarangBrand.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected)
        data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
        data.push({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
        return data
    }

    async barangKategori ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await BarangCategories.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: ''})
        }
        return data
    }

    async barangSubKategori ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await BarangSubCategories.query().where( w => {
                    if (req.kategori_id) {
                        w.where('kategori_id', req.kategori_id)
                    }
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected){
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
        }else{
            if (!req.kategori_id) {
                data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
            }else{
                data.unshift({id: '', kode: 'x', nama: 'Pilih', selected: ''})
            }
        }
        return data
    }
    
    async barangQualitas ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await BarangQualities.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected)
        data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
        data.push({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
       return data
    }

    async equipment ( { request } ) {
        const req = request.all()
        let data = (
                await Equipment.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

       return data
    }

    async equipmentID ( { params } ) {
        console.log('equipmentID ::', params);
        let data
        try {
            data = (
                await Equipment.query().where( w => {
                        w.where('id', params.id)
                    w.where('aktif', 'Y')
                }).orderBy('nama', 'asc')
                .last()
            ).toJSON()
            
        } catch (error) {
            console.log(error);
        }

       return data
    }

    async pemasok ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        console.log('PEMASOK ::', req);
        let data = (
                await Pemasok.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected)
            data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
            data.unshift({id: '', kode: 'x', num_part: 'x', nama: 'Pilih', selected: 'selected'})
        return data
    }

    async pelanggan ( { request } ) {
        const req = request.all()
        let data = (
                await Pelanggan.query().where( w => {
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        if(req.selected)
            data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})
        else
            data.unshift({id: '', kode: 'x', num_part: 'x', nama: 'Pilih', selected: 'selected'})
        return data
    }

    async pelangganID ( { params } ) {
        let data = (
                await Pelanggan.query().where( w => {
                w.where('id', params.id)
            }).last()
        ).toJSON()

        return data
    }

    async karyawan ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        req.section = req.section === 'null' ? null : req.selected
        let data = (
                await Karyawan.query().with('dept').where( w => {
                if(req.section){
                    w.where('section', req.department_id)
                }
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        return data
    }

    async karyawanID ( { params } ) {
        let data = (
                await Karyawan.query().with('dept').where('id', params.id).last()
        ).toJSON()

        return data
    }

    async gaji ( { request } ) {
        const req = request.all()
        let data = (
                await Gaji.query().where( w => {
                    if(req.tipe){
                        w.where('tipe', req.tipe)
                    }
                w.where('aktif', 'Y')
            }).orderBy('urut', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        return data
    }

    async componentGaji ( { request } ) {
        const req = request.all()
        let data = (
                await GajiComponent.query().where( w => {
                    if(req.karyawan_id){
                        w.where('karyawan_id', req.karyawan_id)
                    }
                    if(req.component_id){
                        w.where('component_id', req.component_id)
                    }
            }).orderBy('karyawan_id', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        return data
    }

    async hargaRental ( { request } ) {
        const req = request.all()
        try {
            let data = (
                    await HargaRental.query().where( w => {
                    w.where('bisnis_id', req.bisnis_id)
                    w.where('equipment_id', req.equipment_id)
                }).orderBy('periode', 'desc')
                .first() 
            ).toJSON() 
            return data
            
        } catch (error) {
            return {equipment_id: req.equipment_id, bisnis_id: req.bisnis_id, harga: 0}
        }
    }

    async hargaJualBarang ( { request } ) {
        const req = request.all()
        try {
            let data = (
                    await HargaJualBarang.query().where( w => {
                    w.where('bisnis_id', req.bisnis_id)
                    w.where('barang_id', req.barang_id)
                }).orderBy('periode', 'desc')
                .first() 
            ).toJSON() 
            return data
            
        } catch (error) {
            return {barang_id: req.barang_id, bisnis_id: req.bisnis_id, harga_jual: 0}
        }
    }

    async fakturBeli ( { request } ) {
        const req = request.all()
        
        try {
            let data = (
                    await KeuFakturPembelian.query()
                    .with('pemasok')
                    .where( w => {
                    w.where('sts_paid', 'bersisa')
                    w.where('aktif', 'Y')
                }).orderBy('due_date', 'asc')
                .fetch() 
            ).toJSON() 
            
            return data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
            
        } catch (error) {
            console.log('error fakturBeli :::', error);
            return []
        }
    }

    async fakturBeliID ( { params } ) {
        try {
            let data = (
                await KeuFakturPembelian.query()
                    .with('pemasok')
                    .where('id', params.id)
                .last() 
            ).toJSON() 
            
            return data
            
        } catch (error) {
            console.log('error fakturBeli :::', error);
            return []
        }
    }

    async purchasingOrder ( { auth, request } ) {
        const req = request.all()
        console.log('REG ::', req);
        const user = await userValidate(auth)
        if(!user){
            return
        }

        let data = (await KeuPurchasingRequest.query().where( w => {
            if(user.cabang_id){
                w.where('cabang_id', user.cabang_id)
            }
            w.where('status', 'approved')
        }).fetch()).toJSON()

        if(req.purchasing_id){
            data = data.map(el => el.id === parseInt(req.purchasing_id) ? {...el, name: `[${el.kode}] ${el.narasi}`, selected: 'selected'}:{...el, name: `[${el.kode}] ${el.narasi}`, selected: ''})
        }else{
            data = data.map(el => ({...el, name: `[${el.kode}] ${el.narasi}`, selected: ''}))
            data.unshift({id: '', name: 'Pilih...', selected: 'selected'})
        }

        console.log(data);
        return data
    }

    async purchasingOrderID ( { request, params } ) {
        const req = request.all()
        console.log('params :::', params);
        console.log(req);
        let data = (
            await KeuPurchasingRequest.query()
            .with('items', w => w.where('pemasok_id', req.pemasok_id))
            .where('id', params.id)
            .last()
        ).toJSON()
        console.log('data ::', data);
        // data.items = data.items.filter(obj => obj.pemasok_id == req.pemasok_id)
        const barang = (await Barang.query().where('aktif', 'Y').fetch()).toJSON()

        let coaAkun = (await AccCoa.query().orderBy('id', 'asc').fetch()).toJSON()
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'bank' )
        coaAkun = coaAkun.filter( el => (el.coa_subgrp_nm)?.toLowerCase() != 'kas' )

        let dataCoa = _.groupBy(coaAkun, 'coa_tipe_nm')
        dataCoa = Object.keys(dataCoa).map(key => {
            return {
                tipe: key,
                items: dataCoa[key]
            }
        })
        const items = data.items.map(el => { 
            var itemsHTML = 
                `<tr class="item-rows">
                <td>
                    <h3 class="urut-rows"></h3>
                    <input type="hidden" class="" name="id" value="{{data.id ? data.id : ''}}">   
                </td>
                <td class="b-all">
                    <div class="row">
                        <div class="col-md-6">
                            <label for="">Barang</label>                
                            <div class="input-group">
                                <span class="input-group-btn">
                                    <button class="btn btn-danger bt-remove-item" type="button">
                                        <i class="fa fa-trash"></i>
                                    </button>
                                </span>
                                <select class="form-control item-data-details selectBarang" name="barang_id" data-values="${el.barang_id}">
                                    <option value="">Pilih...</option>
                                    ${barang.map(b => '<option value="'+b.id+'" '+(el.barang_id == b.id ? "selected":" ")+'>[ '+b.num_part+ ' ] '+b.nama+'</option>')}
                                </select>
                                <span class="input-group-addon satuan">${el.stn}</span>
                            </div>
                        </div>
                        <div class="col-md-2">            
                            <div class="form-group">                
                                <label for="">Qty <span class="text-danger">*</span></label>                
                                <input type="number" class="form-control text-right item-data-details item-details" name="qty" id="" value="${el.qty}" required>
                            </div>        
                        </div>
                        <div class="col-md-4">            
                            <div class="form-group">                
                                <label for="">Harga Stn <span class="text-danger">*</span></label>                
                                <input type="number" class="form-control item-data-details item-details" name="harga_stn" id="" value="0" required>
                            </div>        
                        </div>
                        <div class="col-md-2">            
                            <label for="">Discount <span><small>Rupiah</small></span></label>                
                            <div class="input-group">
                                <input type="number" class="form-control item-data-details item-details" name="discount" id="" value="0">
                                <input type="hidden" class="form-control item-data-details item-details" name="type-discount" value="rupiah">
                                <span class="input-group-addon" name="icon-discount">Rp.</span>
                            </div>   
                        </div>
                        <div class="col-md-4">            
                            <div class="form-group">                
                                <label for="">Harga Total</label>                
                                <input type="number" class="form-control text-right item-data-details item-details" name="subtotal" id="" value="0" readonly>
                            </div>        
                        </div>
                        <div class="col-md-6">            
                            <div class="form-group">                
                                <label for="">Akun</label>                
                                <select class="form-control item-data-details selectCoa" name="coa_id" data-values="" id="">
                                    <option value="">Pilih...</option>
                                    ${dataCoa.map( grp => '<optgroup label="'+grp.tipe+'">'+grp.items.map( val => '<option value="'+val.id+'" '+(val.id == '11001' ? "selected":" ")+'>'+val.coa_name+'</option>')+'</optgroup>')}
                                </select>
                            </div>        
                        </div>
                    </div>
                </td>
            </tr>
            <script>
                $(function(){
                    var body = $('body')
                    body.find('select[name="coa_id"]').select2()
                })
            </script>`
            return itemsHTML
        })

        return {
            data: data,
            itemsHTML: items
        }
    }

    async purchasingOrderList ( { auth, request } ) {
        const req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return
        }

        let data = (await KeuPurchasingRequest.query().where( w => {
            if(user.cabang_id){
                w.where('cabang_id', user.cabang_id)
                w.where('status', '!=', 'finish')
            }
        }).fetch()).toJSON()

        if(req.purchasing_id){
            data = data.map(el => el.id === parseInt(req.purchasing_id) ? {...el, name: `[${el.kode}] ${el.narasi}`, selected: 'selected'}:{...el, name: `[${el.kode}] ${el.narasi}`, selected: ''})
        }else{
            data = data.map(el => ({...el, name: `[${el.kode}] ${el.narasi}`, selected: ''}))
            data.unshift({id: '', name: 'Pilih...', selected: 'selected'})
        }

        return data
    }

    async purchasingOrderDetails ( { auth, request, view } ) {
        const req = request.all()
        console.log(req);
        const user = await userValidate(auth)
        if(!user){
            return
        }

        let data = (await KeuPurchasingRequest.query()
        .with('items', i => {
            i.where('pemasok_id', req.pemasok_id)
            i.where('has_received', 'N')
            i.where('aktif', 'Y')
        })
        .where( w => {
            w.where('id', req.order_id)
            w.where('gudang_id', req.gudang_id)
        }).last()).toJSON()

        console.log(data);
        return view.render('logistik.terima-barang.items-purchasing-order', {list: data})
    }

    // async fakturJual ( { request } ) {
    //     const req = request.all()
    //     try {
    //         let data = (
    //                 await TrxFakturJual.query()
    //                 .with('pelanggan')
    //                 .where( w => {
    //                 w.where('bisnis_id', req.bisnis_id)
    //                 w.where('status', 'bersisa')
    //             })
    //             .fetch() 
    //         ).toJSON() 
    //         const result = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
    //         console.log(req);
    //         return result
            
    //     } catch (error) {
    //         return []
    //     }
    // }
}

module.exports = OptionsAjaxController

async function userValidate(auth){
    let user
    try {
        user = await auth.getUser()
        return user
    } catch (error) {
        console.log(error);
        return null
    }
}
