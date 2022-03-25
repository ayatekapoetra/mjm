'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Route.on('/').render('welcome')
Route.get('/', 'HomeController.index')
// Route.post('/workspace', 'HomeController.workspace').as('auth.workspace')
Route.get('/login', 'AuthentifikasiController.index')
Route.post('/login', 'AuthentifikasiController.login')
Route.get('/logout', 'AuthentifikasiController.loggingOut').as('auth.logout')
Route.get('/profile', 'AuthentifikasiController.profile').as('auth.profile')

Route.group(() => {
    
    /* COA */
    Route.get('/coa', 'CoaAjaxController.listCoaName').as('ajax.set.coa')
    Route.get('/coa/by-id', 'CoaAjaxController.coaById').as('ajax.set.coa.id')
    Route.get('/coa/by-kode', 'CoaAjaxController.coaByKode').as('ajax.set.coa.kode')
    Route.get('/coa/by-aset', 'CoaAjaxController.coaAset').as('ajax.set.coa.coaAset')
    Route.get('/coa/kas-bank', 'CoaAjaxController.coaKasBank').as('ajax.set.coa.coaKasBank')
    Route.get('/coa/saldo-awal', 'CoaAjaxController.saldoAwal').as('ajax.set.coa.saldoAwal')
    Route.get('/coa/biaya', 'CoaAjaxController.biaya').as('ajax.set.coa.biaya')
    Route.get('/coa/check-transaksi', 'CoaAjaxController.checkFaktur').as('ajax.set.checkFaktur')
    Route.get('/coa/faktur-pemasok', 'CoaAjaxController.fakturPemasok').as('ajax.set.fakturPemasok')
    Route.get('/coa/faktur-pelanggan', 'CoaAjaxController.fakturPelanggan').as('ajax.set.fakturPelanggan')
    Route.get('/coa/faktur-gudang', 'CoaAjaxController.fakturGudang').as('ajax.set.fakturGudang')
    Route.get('/coa/option', 'CoaAjaxController.coaHTML').as('ajax.set.coaHTML')

    /* BANK */
    Route.get('/bank', 'CoaAjaxController.listBank').as('ajax.set.bank')
    Route.get('/isbank', 'CoaAjaxController.isBank').as('ajax.set.isBank')
    Route.get('/isbankOut', 'CoaAjaxController.isBankOut').as('ajax.set.isBankOut')
    Route.get('/isbankIn', 'CoaAjaxController.isBankIn').as('ajax.set.isBankIn')

    /* KAS */
    Route.get('/kas', 'CoaAjaxController.listKas').as('ajax.set.kas')

    /* PENYESUAIAN KAS ATAU BANK TERHADAP JURNAL */
    Route.get('/update-kas-bank', 'CoaAjaxController.penyesuaianKas').as('ajax.set.kas')

    /* OPTIONS */
    Route.get('/options', 'OptionsAjaxController.index').as('ajax.set.option')
    Route.get('/options/menu', 'OptionsAjaxController.menu').as('ajax.set.menu')
    Route.get('/options/mainmenu', 'OptionsAjaxController.mainmenu').as('ajax.set.mainmenu')
    Route.get('/options/submenu', 'OptionsAjaxController.submenu').as('ajax.set.submenu')
    Route.get('/options/routex', 'OptionsAjaxController.routex').as('ajax.set.users')
    Route.get('/options/users', 'OptionsAjaxController.users').as('ajax.set.users')
    Route.get('/options/coa', 'OptionsAjaxController.coa').as('ajax.set.coa')
    Route.get('/options/coa-kode', 'OptionsAjaxController.coaKode').as('ajax.set.coaKode')
    Route.get('/options/coa-tipe', 'OptionsAjaxController.coaKategori').as('ajax.set.coaKategori')
    Route.get('/options/coa-group', 'OptionsAjaxController.coaGroup').as('ajax.set.coaGroup')
    Route.get('/options/bisnis', 'OptionsAjaxController.bisnis').as('ajax.set.bisnis')
    Route.get('/options/cabang', 'OptionsAjaxController.cabang').as('ajax.set.cabang')
    Route.get('/options/gudang', 'OptionsAjaxController.gudang').as('ajax.set.gudang')
    Route.get('/options/department', 'OptionsAjaxController.department').as('ajax.set.department')
    Route.get('/options/rack', 'OptionsAjaxController.rack').as('ajax.set.rack')
    Route.get('/options/barang', 'OptionsAjaxController.barang').as('ajax.set.barang')
    Route.get('/options/barang-brand', 'OptionsAjaxController.barangBrand').as('ajax.set.barangBrand')
    Route.get('/options/barang-kategori', 'OptionsAjaxController.barangKategori').as('ajax.set.barangKategori')
    Route.get('/options/barang-qualitas', 'OptionsAjaxController.barangQualitas').as('ajax.set.barangQualitas')
    Route.get('/options/barang/show/:id', 'OptionsAjaxController.barangID').as('ajax.set.barangID')
    Route.get('/options/equipment', 'OptionsAjaxController.equipment').as('ajax.set.equipment')
    Route.get('/options/equipment/show/:id', 'OptionsAjaxController.equipmentID').as('ajax.set.equipmentID')
    Route.get('/options/pemasok', 'OptionsAjaxController.pemasok').as('ajax.set.pemasok')
    Route.get('/options/pelanggan', 'OptionsAjaxController.pelanggan').as('ajax.set.pelanggan')
    Route.get('/options/karyawan', 'OptionsAjaxController.karyawan').as('ajax.set.karyawan')
    Route.get('/options/gaji', 'OptionsAjaxController.gaji').as('ajax.set.gaji')
    Route.get('/options/component-gaji', 'OptionsAjaxController.componentGaji').as('ajax.set.componentGaji')
    Route.get('/options/faktur-beli', 'OptionsAjaxController.fakturBeli').as('ajax.set.fakturBeli')
    Route.get('/options/faktur-jual', 'OptionsAjaxController.fakturJual').as('ajax.set.fakturJual')
    Route.get('/options/equipment/harga-rental', 'OptionsAjaxController.hargaRental').as('ajax.set.hargaRental')
    Route.get('/options/barang/harga-jual', 'OptionsAjaxController.hargaJualBarang').as('ajax.set.hargaJualBarang')

}).prefix('ajax').namespace('ajax')


Route.group(() => {

    /* MASTER USER */
    Route.get('/users', 'UserController.index').as('mas.users')
    Route.post('/users', 'UserController.store').as('mas.users.store').middleware('C')
    Route.get('/users/list', 'UserController.list').as('mas.users.list').middleware('R')
    Route.get('/users/create', 'UserController.create').as('mas.users.create').middleware('C')
    Route.get('/users/:id/show', 'UserController.show').as('mas.users.show').middleware('U')
    Route.post('/users/:id/update', 'UserController.update').as('mas.users.update').middleware('U')
    Route.post('/users/:id/destroy', 'UserController.destroy').as('mas.users.destroy').middleware('D')

    /* MASTER KARYAWAN */
    Route.get('/karyawan', 'KaryawanController.index').as('mas.karyawan')
    Route.post('/karyawan', 'KaryawanController.store').as('mas.karyawan.store').middleware('C')
    Route.get('/karyawan/list', 'KaryawanController.list').as('mas.karyawan.list').middleware('R')
    Route.get('/karyawan/create', 'KaryawanController.create').as('mas.karyawan.create').middleware('C')
    Route.get('/karyawan/:id/show', 'KaryawanController.show').as('mas.karyawan.show').middleware('U')
    Route.post('/karyawan/:id/update', 'KaryawanController.update').as('mas.karyawan.update').middleware('U')
    Route.delete('/karyawan/:id/destroy', 'KaryawanController.destroy').as('mas.karyawan.destroy').middleware('D')

    /* MASTER CABANG */
    Route.get('/cabang', 'CabangController.index').as('mas.cabang')
    Route.post('/cabang', 'CabangController.store').as('mas.cabang.store').middleware('C')
    Route.get('/cabang/list', 'CabangController.list').as('mas.cabang.list').middleware('R')
    Route.get('/cabang/create', 'CabangController.create').as('mas.cabang.create').middleware('C')
    Route.get('/cabang/:id/show', 'CabangController.show').as('mas.cabang.show').middleware('U')
    Route.post('/cabang/:id/update', 'CabangController.update').as('mas.cabang.update').middleware('U')
    Route.delete('/cabang/:id/destroy', 'CabangController.destroy').as('mas.cabang.destroy').middleware('D')

    /* MASTER GUDANG */
    Route.get('/gudang', 'GudangController.index').as('mas.gudang')
    Route.post('/gudang', 'GudangController.store').as('mas.gudang.store').middleware('C')
    Route.get('/gudang/list', 'GudangController.list').as('mas.gudang.list').middleware('R')
    Route.get('/gudang/create', 'GudangController.create').as('mas.gudang.create').middleware('C')
    Route.get('/gudang/:id/show', 'GudangController.show').as('mas.gudang.show').middleware('U')
    Route.post('/gudang/:id/update', 'GudangController.update').as('mas.gudang.update').middleware('U')
    Route.delete('/gudang/:id/destroy', 'GudangController.destroy').as('mas.gudang.destroy').middleware('D')

    /* MASTER RACK */
    Route.get('/rack', 'RackController.index').as('mas.rack')
    Route.post('/rack', 'RackController.store').as('mas.rack.store').middleware('C')
    Route.get('/rack/list', 'RackController.list').as('mas.rack.list').middleware('R')
    Route.get('/rack/create', 'RackController.create').as('mas.rack.create').middleware('C')
    Route.get('/rack/:id/show', 'RackController.show').as('mas.rack.show').middleware('U')
    Route.post('/rack/:id/update', 'RackController.update').as('mas.rack.update').middleware('U')
    Route.delete('/rack/:id/destroy', 'RackController.destroy').as('mas.rack.destroy').middleware('D')

    /* MASTER BIN */
    Route.get('/bin', 'BinController.index').as('mas.bin')
    Route.post('/bin', 'BinController.store').as('mas.bin.store').middleware('C')
    Route.get('/bin/list', 'BinController.list').as('mas.bin.list').middleware('R')
    Route.get('/bin/create', 'BinController.create').as('mas.bin.create').middleware('C')
    Route.get('/bin/:id/show', 'BinController.show').as('mas.bin.show').middleware('U')
    Route.post('/bin/:id/update', 'BinController.update').as('mas.bin.update').middleware('U')
    Route.delete('/bin/:id/destroy', 'BinController.destroy').as('mas.bin.destroy').middleware('D')

    /* MASTER BARANG */
    Route.get('/barang', 'BarangController.index').as('mas.barang')
    Route.post('/barang', 'BarangController.store').as('mas.barang.store').middleware('C')
    Route.get('/barang/list', 'BarangController.list').as('mas.barang.list').middleware('R')
    Route.get('/barang/create', 'BarangController.create').as('mas.barang.create').middleware('C')
    Route.get('/barang/:id/show', 'BarangController.show').as('mas.barang.show').middleware('U')
    Route.post('/barang/:id/update', 'BarangController.update').as('mas.barang.update').middleware('U')
    Route.delete('/barang/:id/destroy', 'BarangController.destroy').as('mas.barang.destroy').middleware('D')

    /* MASTER BARANG HARGA */
    Route.get('/barang-harga', 'BarangHargaController.index').as('mas.barang-harga')
    Route.post('/barang-harga', 'BarangHargaController.store').as('mas.barang-harga.store').middleware('C')
    Route.get('/barang-harga/list', 'BarangHargaController.list').as('mas.barang-harga.list').middleware('R')
    Route.get('/barang-harga/create', 'BarangHargaController.create').as('mas.barang-harga.create').middleware('C')
    Route.get('/barang-harga/:id/show', 'BarangHargaController.show').as('mas.barang-harga.show').middleware('U')
    Route.post('/barang-harga/:id/update', 'BarangHargaController.update').as('mas.barang-harga.update').middleware('U')
    Route.delete('/barang-harga/:id/destroy', 'BarangHargaController.destroy').as('mas.barang-harga.destroy').middleware('D')

    /* MASTER PEMASOK */
    Route.get('/pemasok', 'PemasokController.index').as('mas.pemasok')
    Route.post('/pemasok', 'PemasokController.store').as('mas.pemasok.store').middleware('C')
    Route.get('/pemasok/list', 'PemasokController.list').as('mas.pemasok.list').middleware('R')
    Route.get('/pemasok/create', 'PemasokController.create').as('mas.pemasok.create').middleware('C')
    Route.get('/pemasok/:id/show', 'PemasokController.show').as('mas.pemasok.show').middleware('U')
    Route.post('/pemasok/:id/update', 'PemasokController.update').as('mas.pemasok.update').middleware('U')
    Route.delete('/pemasok/:id/destroy', 'PemasokController.destroy').as('mas.pemasok.destroy').middleware('D')

    /* MASTER PELANGGAN */
    Route.get('/pelanggan', 'PelangganController.index').as('mas.pelanggan')
    Route.post('/pelanggan', 'PelangganController.store').as('mas.pelanggan.store').middleware('C')
    Route.get('/pelanggan/list', 'PelangganController.list').as('mas.pelanggan.list').middleware('R')
    Route.get('/pelanggan/create', 'PelangganController.create').as('mas.pelanggan.create').middleware('C')
    Route.get('/pelanggan/:id/show', 'PelangganController.show').as('mas.pelanggan.show').middleware('U')
    Route.post('/pelanggan/:id/update', 'PelangganController.update').as('mas.pelanggan.update').middleware('U')
    Route.delete('/pelanggan/:id/destroy', 'PelangganController.destroy').as('mas.pelanggan.destroy').middleware('D')


}).prefix('master').namespace('master')

Route.group(() => {

    /** SETTING COA AKUN **/
    Route.get('/coa', 'AccCoaController.index').as('set.coa').middleware('R')
    Route.post('/coa-akun', 'AccCoaController.storeAkun').as('set.coa.storeAkun').middleware('C')
    Route.post('/coa-group', 'AccCoaController.storeGroup').as('set.coa.storeGroup').middleware('C')
    Route.get('/coa/create-akun', 'AccCoaController.createAkun').as('set.coa.createAkun').middleware('C')
    Route.get('/coa/create-group', 'AccCoaController.createGroup').as('set.coa.createGroup').middleware('C')
    Route.get('/coa/:id/show-akun', 'AccCoaController.showAkun').as('set.coa.showAkun').middleware('R')
    Route.get('/coa/:id/show-group', 'AccCoaController.showGroup').as('set.coa.showGroup').middleware('R')
    Route.post('/coa/:id/update-akun', 'AccCoaController.updateAkun').as('set.coa.updateAkun').middleware('U')
    Route.post('/coa/:id/update-group', 'AccCoaController.updateGroup').as('set.coa.updateGroup').middleware('U')
    Route.delete('/coa/:id/destroy', 'AccCoaController.destroy').as('set.coa.destroy').middleware('D')

    /** SETTING USER PRIVILAGES **/
    Route.get('/users-privilages', 'UserPrivilageController.index').as('set.users-privilages').middleware('R')
    Route.post('/users-privilages', 'UserPrivilageController.store').as('set.users-privilages.store').middleware('C')
    Route.get('/users-privilages/list', 'UserPrivilageController.list').as('set.users-privilages.list').middleware('R')
    Route.get('/users-privilages/create', 'UserPrivilageController.create').as('set.users-privilages.create').middleware('C')
    Route.get('/users-privilages/:id/show', 'UserPrivilageController.show').as('set.users-privilages.show').middleware('U')
    Route.post('/users-privilages/:id/update', 'UserPrivilageController.update').as('set.users-privilages.update').middleware('U')
    Route.delete('/users-privilages/:id/destroy', 'UserPrivilageController.destroy').as('set.users-privilages.destroy').middleware('D')

    /** SETTING USER MENU **/
    Route.get('/users-menu', 'UserMenuController.index').as('set.users-menu').middleware('R')
    Route.post('/users-menu', 'UserMenuController.store').as('set.users-menu.store').middleware('C')
    Route.get('/users-menu/list', 'UserMenuController.list').as('set.users-menu.list').middleware('R')
    Route.get('/users-menu/create', 'UserMenuController.create').as('set.users-menu.create').middleware('C')
    Route.get('/users-menu/:id/show', 'UserMenuController.show').as('set.users-menu.show').middleware('U')
    Route.post('/users-menu/:id/update', 'UserMenuController.update').as('set.users-menu.update').middleware('U')
    Route.delete('/users-menu/:id/destroy', 'UserMenuController.destroy').as('set.users-menu.destroy').middleware('D')

    /** SETTING OPTIONS **/
    Route.get('/options', 'OptionController.index').as('set.options').middleware('R')
    Route.post('/options', 'OptionController.store').as('set.options.store').middleware('C')
    Route.get('/options/list', 'OptionController.list').as('set.options.list').middleware('R')
    Route.get('/options/create', 'OptionController.create').as('set.options.create').middleware('C')
    Route.get('/options/:id/show', 'OptionController.show').as('set.options.show').middleware('U')
    Route.post('/options/:id/update', 'OptionController.update').as('set.options.update').middleware('U')
    Route.delete('/options/:id/destroy', 'OptionController.destroy').as('set.options.destroy').middleware('D')

}).prefix('setting').namespace('setting').middleware(['MM'])