'use strict'

const _ = require('underscore')
const VUser = use("App/Models/VUser")
const UsrMenu = use("App/Models/UsrMenu")
const SysMenu = use("App/Models/SysMenu")
const Gaji = use("App/Models/master/Gaji")
const Rack = use("App/Models/master/Rack")
const SysOption = use("App/Models/SysOption")
const Cabang = use("App/Models/master/Cabang")
const Gudang = use("App/Models/master/Gudang")
const Barang = use("App/Models/master/Barang")
const SysSubmenu = use("App/Models/SysSubmenu")
const BisnisUnit = use("App/Models/BisnisUnit")
const Pemasok = use("App/Models/master/Pemasok")
const AccCoa = use("App/Models/akunting/AccCoa")
const Karyawan = use("App/Models/master/Karyawan")
const UsrWorkspace = use("App/Models/UsrWorkspace")
const Equipment = use("App/Models/master/Equipment")
const Pelanggan = use("App/Models/master/Pelanggan")
const Department = use("App/Models/master/Department")
const BarangBrand = use("App/Models/master/BarangBrand")
const AccCoaTipe = use("App/Models/akunting/AccCoaTipe")
const HargaRental = use("App/Models/master/HargaRental")
const AccCoaGroup = use("App/Models/akunting/AccCoaGroup")
const HargaJualBarang = use("App/Models/master/HargaJual")
const GajiComponent = use("App/Models/master/GajiComponent")
const TrxFakturBeli = use("App/Models/transaksi/TrxFakturBeli")
const TrxFakturJual = use("App/Models/transaksi/TrxFakturJual")
const BarangQualities = use("App/Models/master/BarangQualities")
const BarangCategories = use("App/Models/master/BarangCategories")

// const jsonData = use("App/Helpers/JSON/barang_sewas")

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

        options = options.map(obj => obj.nilai === req.selected ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        
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
                    w.where('bisnis_id', req.bisnis_id)
                    if(req.coa_tipe){
                        w.where('coa_tipe', req.coa_tipe)
                    }
                }).orderBy('urut', 'asc').fetch()
            ).toJSON()
        } catch (error) {
            console.log(error);
        }

        data = data.map(obj => obj.kode === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

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

    async cabang ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        let data = (
                await Cabang.query().where( w => {
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

    async gudang ( { request } ) {
        const req = request.all()
        req.selected = req.selected === 'null' ? null : req.selected
        console.log('GUDANG REQ :::', req);
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
        console.log('GUDANG OPT ::', data);
        return data
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
        data.push({id: '', kode: 'x', num_part: '', nama: 'Pilih', selected: 'selected'})
        return data
    }

    async barangID ( { params } ) {
        console.log('PARAMS ::', params);
        let data = (
                await Barang.query().where( w => {
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

        if(req.selected)
        data = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : el)
        else
        data.push({id: '', kode: 'x', nama: 'Pilih', selected: 'selected'})
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
        let data = (
                await Pemasok.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        
        return data
    }

    async pelanggan ( { request } ) {
        const req = request.all()
        let data = (
                await Pelanggan.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

        return data
    }

    async karyawan ( { request } ) {
        const req = request.all()
        let data = (
                await Karyawan.query().where( w => {
                w.where('bisnis_id', req.bisnis_id)
                if(req.section){
                    w.where('section', req.section)
                }
                w.where('aktif', 'Y')
            }).orderBy('nama', 'asc')
            .fetch()
        ).toJSON()

        data = data.map(obj => obj.id === parseInt(req.selected) ? {...obj, selected: 'selected'} : {...obj, selected: ''})

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
                    await TrxFakturBeli.query()
                    .with('pemasok')
                    .where( w => {
                    w.where('bisnis_id', req.bisnis_id)
                    w.where('sts_paid', 'bersisa')
                }).orderBy('due_date', 'asc')
                .fetch() 
            ).toJSON() 
            return data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
            
        } catch (error) {
            return []
        }
    }

    async fakturJual ( { request } ) {
        const req = request.all()
        try {
            let data = (
                    await TrxFakturJual.query()
                    .with('pelanggan')
                    .where( w => {
                    w.where('bisnis_id', req.bisnis_id)
                    w.where('status', 'bersisa')
                })
                .fetch() 
            ).toJSON() 
            const result = data.map(el => el.id === parseInt(req.selected) ? {...el, selected: 'selected'} : {...el, selected: ''})
            console.log(req);
            return result
            
        } catch (error) {
            return []
        }
    }
}

module.exports = OptionsAjaxController
