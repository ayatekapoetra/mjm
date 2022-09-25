'use strict'

const Helpers = use('Helpers')
const _ = require('underscore')
const moment = require('moment')
const { parse } = require('@adonisjs/ace/lib/commander')
const initFunc = use("App/Helpers/initFunc")
const initMenu = use("App/Helpers/_sidebar")
const Barang = use("App/Models/master/Barang")
const AccCoa = use("App/Models/akunting/AccCoa")
const logoPath = Helpers.publicPath('logo.png')
const Image64Helpers = use("App/Helpers/_encodingImages")
const HapusPersediaanHelpers = use("App/Helpers/KeuHapusPersediaan")
const KeuHapusPersediaanItem = use("App/Models/transaksi/KeuHapusPersediaanItem")

class HapusPersediaanController {
    async index ( { auth, request, view } ) {
        let user
        try {
            user = await auth.getUser()
            const sideMenu = await initMenu.SIDEBAR(user.id)
            return view.render('keuangan.hapus-persediaan.index', {
                menu: sideMenu
            })
        } catch (error) {
            console.log(error);
            return view.render('401')
        }
    }

    async list ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const data = await HapusPersediaanHelpers.LIST(req)
        return view.render('keuangan.hapus-persediaan.list', {list: data})
    }

    async create ( { auth, request, view } ) {
        let req = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const cabang = await initFunc.WORKSPACE(user)
        const kode = await initFunc.GEN_KODE_HAPUS_PERSEDIAAN()
        const coaGrouping = (await AccCoa.query().where('aktif', 'Y').fetch()).toJSON()
        let coa = _.groupBy(coaGrouping, 'coa_tipe_nm')
        coa = Object.keys(coa).map(key => {
            return {
                nama : key,
                items: coa[key]
            }
        })
        return view.render('keuangan.hapus-persediaan.create', { 
            ws: cabang.cabang_id, 
            kode: kode,
            coa: coa
        })
    }

    async show ( { auth, params, view } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        
        const data = await HapusPersediaanHelpers.SHOW(params)

        let coaGrouping = (await AccCoa.query().where('aktif', 'Y').fetch()).toJSON()
        coaGrouping = coaGrouping.map(el => el.id == data.coa_id ? {...el, selected: 'selected'}:{...el, selected: ''})
        let coa = _.groupBy(coaGrouping, 'coa_tipe_nm')
        coa = Object.keys(coa).map(key => {
            return {
                nama : key,
                items: coa[key]
            }
        })


        return view.render('keuangan.hapus-persediaan.show', { 
            coa: coa,
            data: data
        })
    }

    async addItem ( { auth } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        let barang = (await Barang.query().with('kategori').where('aktif', 'Y').fetch()).toJSON()
        barang = barang.map( val => {
            return {
                ...val,
                nm_kategori: val.kategori.nama
            }
        })
        barang = _.groupBy(barang, 'nm_kategori')
        barang = Object.keys(barang).map(key => {
            return {
                kategori: key,
                item: barang[key]
            }
        })
        
        var HTML = '<tr class="item-rows">'+
        '    <td style="vertical-align: middle;">'+
        '        <h3 class="urut-rows"></h3>'+
        '    </td>'+
        '    <td class="b-all">'+
        '        <div class="row">'+
        '            <div class="col-md-10">'+
        '                <div class="form-group">'+
        '                    <label for="">Items Barang</label>'+
        '                    <select class="form-control item-data-details" name="barang_id" data-values="">'+
        '                       <option value="">Pilih Persediaan Barang...</option>'+
                                barang.map( v => '<optgroup label="Kategori '+v.kategori+'">'+v.item?.map( b => '<option value="'+b.id+'">['+b.num_part+'] '+b.kode+' - '+b.nama+'</option>')+'</optgroup>')+
        '                    </select>'+
        '                </div>'+
        '            </div>'+
        '            <div class="col-md-2">'+
        '                <div class="form-group">'+
        '                    <label for="">Qty <span class="text-danger">*</span></label>'+
        '                    <input type="number" class="form-control item-data-details item-details" name="qty" value="1" required>'+
        '                </div>'+
        '            </div>'+
        '        </div>'+
        '    </td>'+
        '    <td class="text-center">'+
        '        <button type="button" class="btn btn-danger btn-circle m-t-30 bt-remove-item">'+
        '            <i class="fa fa-trash"></i>'+
        '        </button>'+
        '    </td>'+
        '</tr>'+
        '<script>'+
        '    $(function(){'+
        '        $("select").select2()'+
        '    })'+
        '</script>';
        return HTML
    }

    async showItems ( { params } ) {
        const hapusItems = (await KeuHapusPersediaanItem.query().where( w => {
            w.where('hapus_id', params.id)
            w.where('aktif', 'Y')
        }).fetch()).toJSON()

        let barang = (await Barang.query().with('kategori').where('aktif', 'Y').fetch()).toJSON()
        barang = barang.map( val => {
            return {
                ...val,
                nm_kategori: val.kategori.nama
            }
        })
        barang = _.groupBy(barang, 'nm_kategori')
        barang = Object.keys(barang).map(key => {
            return {
                kategori: key,
                item: barang[key]
            }
        })
        const arrHTML = hapusItems.map( (itm, i) => 
        '<tr class="item-rows">'+
        '    <td style="vertical-align: middle;">'+
        '        <h3 class="urut-rows">'+(i+1)+'</h3>'+
        '    </td>'+
        '    <td class="b-all">'+
        '        <div class="row">'+
        '            <div class="col-md-10">'+
        '                <div class="form-group">'+
        '                    <label for="">Items Barang</label>'+
        '                    <select class="form-control item-data-details" name="barang_id" data-values="">'+
        '                       <option value="">Pilih Persediaan Barang...</option>'+
                                barang.map( v => '<optgroup label="Kategori '+v.kategori+'">'+v.item?.map( b => '<option value="'+b.id+'" '+(itm.barang_id == b.id ? "selected":"")+' >['+b.num_part+'] '+b.kode+' - '+b.nama+'</option>')+'</optgroup>')+
        '                    </select>'+
        '                </div>'+
        '            </div>'+
        '            <div class="col-md-2">'+
        '                <div class="form-group">'+
        '                    <label for="">Qty <span class="text-danger">*</span></label>'+
        '                    <input type="number" class="form-control item-data-details item-details" name="qty" value="'+itm.qty+'" required>'+
        '                </div>'+
        '            </div>'+
        '        </div>'+
        '    </td>'+
        '    <td class="text-center">'+
        '        <button type="button" class="btn btn-danger btn-circle m-t-30 bt-remove-item">'+
        '            <i class="fa fa-trash"></i>'+
        '        </button>'+
        '    </td>'+
        '</tr>'+
        '<script>'+
        '    $(function(){'+
        '        $("select").select2()'+
        '    })'+
        '</script>');
        return arrHTML
    }

    async store ( { auth, request } ) {
        const reqx = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const req = JSON.parse(reqx.dataForm)
        req.isKurangi = req.isKurangi == 'Y' ? true:false
        req.isStok = req.isKurangi
        req.reff = req.reff ? req.reff : await initFunc.GEN_KODE_HAPUS_PERSEDIAAN()

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }

        const attach = request.file('photo', validateFile)

        const data = await HapusPersediaanHelpers.POST(req, user, attach)
        return data
    }

    async update ( { auth, params, request } ) {
        const reqx = request.all()
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }

        const req = JSON.parse(reqx.dataForm)
        req.isKurangi = req.isKurangi == 'Y' ? true:false
        req.isStok = req.isKurangi

        const validateFile = {
            types: ['image', 'application'],
            size: '10mb',
            extnames: ['png', 'bmp', 'jpg', 'jpeg', 'pdf', 'xls', 'xlsx', 'doc', 'docx']
        }

        const attach = request.file('photo', validateFile)

        const data = await HapusPersediaanHelpers.UPDATE(params, req, user, attach)
        return data
    }

    async destroy ( { auth, params } ) {
        const user = await userValidate(auth)
        if(!user){
            return view.render('401')
        }
        const data = await HapusPersediaanHelpers.DELETE(params)
        return data
    }
}

module.exports = HapusPersediaanController

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