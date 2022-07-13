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

Route.get('/', 'HomeController.index')
Route.on('/kebijakan-privasi').render('privasi')
// Route.post('/workspace', 'HomeController.workspace').as('auth.workspace')
Route.get('/login', 'AuthentifikasiController.index')
Route.post('/login', 'AuthentifikasiController.login')
Route.get('/logout', 'AuthentifikasiController.loggingOut').as('auth.logout')
Route.get('/profile', 'AuthentifikasiController.profile').as('auth.profile')
Route.post('/profile/update-password', 'AuthentifikasiController.updatePassword').as('auth.updatePassword')
Route.post('/profile/update-workspace', 'AuthentifikasiController.updateWorkspace').as('auth.updateWorkspace')

/* NOTIFICATION */
Route.get('/notification', 'NotificationController.index').as('notification')
Route.get('/notification/list', 'NotificationController.list').as('notification.list')
Route.post('/notification/:id/update', 'NotificationController.update').as('notification.update')
Route.post('/notification/:id/delete', 'NotificationController.delete').as('notification.delete')

/*
*   ROUTING AJAX OPTIONS
*/
Route.group(() => {
    
    /* COA */
    Route.get('/coa', 'CoaAjaxController.listCoaName').as('ajax.set.coa')
    Route.get('/select-coa', 'CoaAjaxController.selectCoa').as('ajax.set.selectCoa')
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
    Route.get('/options/kas', 'OptionsAjaxController.listKas').as('ajax.set.listKas')
    Route.get('/options/bank', 'OptionsAjaxController.listBank').as('ajax.set.listBank')
    Route.get('/options/coa-subgroup', 'OptionsAjaxController.coaSubGroup').as('ajax.set.coaSubGroup')
    Route.get('/options/bisnis', 'OptionsAjaxController.bisnis').as('ajax.set.bisnis')
    Route.get('/options/cabang', 'OptionsAjaxController.cabang').as('ajax.set.cabang')
    Route.get('/options/cabang/:id/show', 'OptionsAjaxController.cabangShow').as('ajax.set.cabangShow')
    Route.get('/options/workspace', 'OptionsAjaxController.workspace').as('ajax.set.workspace')
    Route.get('/options/notification', 'OptionsAjaxController.notification').as('ajax.set.notification')
    Route.get('/options/gudang', 'OptionsAjaxController.gudang').as('ajax.set.gudang')
    Route.get('/options/department', 'OptionsAjaxController.department').as('ajax.set.department')
    Route.get('/options/rack', 'OptionsAjaxController.rack').as('ajax.set.rack')
    Route.get('/options/barang', 'OptionsAjaxController.barang').as('ajax.set.barang')
    Route.get('/options/barang-brand', 'OptionsAjaxController.barangBrand').as('ajax.set.barangBrand')
    Route.get('/options/barang-kategori', 'OptionsAjaxController.barangKategori').as('ajax.set.barangKategori')
    Route.get('/options/barang-subkategori', 'OptionsAjaxController.barangSubKategori').as('ajax.set.barangSubKategori')
    Route.get('/options/barang-qualitas', 'OptionsAjaxController.barangQualitas').as('ajax.set.barangQualitas')
    Route.get('/options/barang/show/:id', 'OptionsAjaxController.barangID').as('ajax.set.barangID')
    Route.get('/options/jasa', 'OptionsAjaxController.jasa').as('ajax.set.jasa')
    Route.get('/options/jasa/show/:id', 'OptionsAjaxController.jasaID').as('ajax.set.jasaID')
    Route.get('/options/equipment/show/:id', 'OptionsAjaxController.equipmentID').as('ajax.set.equipmentID')
    Route.get('/options/pemasok', 'OptionsAjaxController.pemasok').as('ajax.set.pemasok')
    Route.get('/options/pelanggan', 'OptionsAjaxController.pelanggan').as('ajax.set.pelanggan')
    Route.get('/options/pelanggan/:id', 'OptionsAjaxController.pelangganID').as('ajax.set.pelangganID')
    Route.get('/options/karyawan', 'OptionsAjaxController.karyawan').as('ajax.set.karyawan')
    Route.get('/options/karyawan/:id', 'OptionsAjaxController.karyawanID').as('ajax.set.karyawanID')
    Route.get('/options/gaji', 'OptionsAjaxController.gaji').as('ajax.set.gaji')
    Route.get('/options/component-gaji', 'OptionsAjaxController.componentGaji').as('ajax.set.componentGaji')
    Route.get('/options/faktur-beli', 'OptionsAjaxController.fakturBeli').as('ajax.set.fakturBeli')
    Route.get('/options/faktur-jual', 'OptionsAjaxController.fakturJual').as('ajax.set.fakturJual')
    Route.get('/options/barang/harga-jual', 'OptionsAjaxController.hargaJualBarang').as('ajax.set.hargaJualBarang')

}).prefix('ajax').namespace('ajax')

/*
*   ROUTING MASTER
*/
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

    /* MASTER BRANDS */
    Route.get('/brands', 'BrandsController.index').as('mas.brands')
    Route.post('/brands', 'BrandsController.store').as('mas.brands.store').middleware('C')
    Route.get('/brands/list', 'BrandsController.list').as('mas.brands.list').middleware('R')
    Route.get('/brands/create', 'BrandsController.create').as('mas.brands.create').middleware('C')
    Route.get('/brands/:id/show', 'BrandsController.show').as('mas.brands.show').middleware('U')
    Route.post('/brands/:id/update', 'BrandsController.update').as('mas.brands.update').middleware('U')
    Route.delete('/brands/:id/destroy', 'BrandsController.destroy').as('mas.brands.destroy').middleware('D')

    /* MASTER KATEGORI */
    Route.get('/kategori', 'CategoryController.index').as('mas.kategori')
    Route.post('/kategori', 'CategoryController.store').as('mas.kategori.store').middleware('C')
    Route.get('/kategori/list', 'CategoryController.list').as('mas.kategori.list').middleware('R')
    Route.get('/kategori/create', 'CategoryController.create').as('mas.kategori.create').middleware('C')
    Route.get('/kategori/:id/show', 'CategoryController.show').as('mas.kategori.show').middleware('U')
    Route.post('/kategori/:id/update', 'CategoryController.update').as('mas.kategori.update').middleware('U')
    Route.delete('/kategori/:id/destroy', 'CategoryController.destroy').as('mas.kategori.destroy').middleware('D')

    /* MASTER SUB KATEGORI */
    Route.get('/sub-kategori', 'SubCategoryController.index').as('mas.sub-kategori')
    Route.post('/sub-kategori', 'SubCategoryController.store').as('mas.sub-kategori.store').middleware('C')
    Route.get('/sub-kategori/list', 'SubCategoryController.list').as('mas.sub-kategori.list').middleware('R')
    Route.get('/sub-kategori/create', 'SubCategoryController.create').as('mas.sub-kategori.create').middleware('C')
    Route.get('/sub-kategori/:id/show', 'SubCategoryController.show').as('mas.sub-kategori.show').middleware('U')
    Route.post('/sub-kategori/:id/update', 'SubCategoryController.update').as('mas.sub-kategori.update').middleware('U')
    Route.delete('/sub-kategori/:id/destroy', 'SubCategoryController.destroy').as('mas.sub-kategori.destroy').middleware('D')

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
    Route.delete('/barang-harga/:id/destroy/:tipe', 'BarangHargaController.destroy').as('mas.barang-harga.destroy').middleware('D')

    /* MASTER JASA */
    Route.get('/jasa', 'JasaController.index').as('mas.jasa')
    Route.post('/jasa', 'JasaController.store').as('mas.jasa.store').middleware('C')
    Route.get('/jasa/list', 'JasaController.list').as('mas.jasa.list').middleware('R')
    Route.get('/jasa/create', 'JasaController.create').as('mas.jasa.create').middleware('C')
    Route.get('/jasa/:id/show', 'JasaController.show').as('mas.jasa.show').middleware('U')
    Route.post('/jasa/:id/update', 'JasaController.update').as('mas.jasa.update').middleware('U')
    Route.delete('/jasa/:id/destroy', 'JasaController.destroy').as('mas.jasa.destroy').middleware('D')

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


/*
*   ROUTING AKUNTING
*/
Route.group(() => {
    
    /* RINGKASAN */
    Route.get('/ringkasan', 'RingkasanController.index').as('acc.ringkasan').middleware('R')
    Route.get('/ringkasan/list', 'RingkasanController.list').as('acc.ringkasan.list').middleware('R')
    Route.get('/ringkasan/sum-values', 'RingkasanController.sumValues').as('acc.ringkasan.sumvalues')
    Route.get('/ringkasan/profit-loss', 'RingkasanController.profitLoss').as('acc.ringkasan.profitLoss')

    /* SALDO AWAL */
    Route.get('/saldo-awal', 'SaldoAwalController.index').as('acc.saldo-awal').middleware('R')
    Route.post('/saldo-awal', 'SaldoAwalController.store').as('acc.saldo-awal.store').middleware('C')
    Route.get('/saldo-awal/list', 'SaldoAwalController.list').as('acc.saldo-awal.list').middleware('R')
    Route.get('/saldo-awal/create', 'SaldoAwalController.create').as('acc.saldo-awal.create').middleware('C')
    Route.get('/saldo-awal/:id/show', 'SaldoAwalController.show').as('acc.saldo-awal.show').middleware('U')
    Route.post('/saldo-awal/:id/update', 'SaldoAwalController.update').as('acc.saldo-awal.show').middleware('U')

    /* BANK & KAS AKUN */
    Route.get('/kas-bank', 'KasBankController.index').as('acc.kas-bank').middleware('R')
    Route.get('/kas-bank/list', 'KasBankController.list').as('acc.kas-bank.list').middleware('R')
    Route.post('/kas-bank/kas', 'KasBankController.storeKas').as('acc.kas-bank.storeKas').middleware('C')
    Route.post('/kas-bank/bank', 'KasBankController.storeBank').as('acc.kas-bank.storeBank').middleware('C')
    Route.get('/kas-bank/kas/create', 'KasBankController.createKas').as('acc.kas-bank.createKas').middleware('C')
    Route.get('/kas-bank/bank/create', 'KasBankController.createBank').as('acc.kas-bank.createBank').middleware('C')
    Route.get('/kas-bank/kas/:id/show', 'KasBankController.showKas').as('acc.kas-bank.showKas').middleware('U')
    Route.get('/kas-bank/kas/:id/details', 'KasBankController.detailsKas').as('acc.kas-bank.detailsKas').middleware('R')
    Route.post('/kas-bank/kas/:id/update', 'KasBankController.updateKas').as('acc.kas-bank.updateKas').middleware('U')
    Route.get('/kas-bank/bank/:id/show', 'KasBankController.showBank').as('acc.kas-bank.showBank').middleware('U')
    Route.get('/kas-bank/bank/:id/details', 'KasBankController.detailsBank').as('acc.kas-bank.detailsBank').middleware('R')
    Route.post('/kas-bank/bank/:id/update', 'KasBankController.updateBank').as('acc.kas-bank.updateBank').middleware('U')

    /* PURCHASE REQUISITION */
    Route.get('/purchasing-request', 'PurchasingRequestController.index').as('acc.purchasing-request').middleware('R')
    Route.post('/purchasing-request', 'PurchasingRequestController.store').as('acc.purchasing-request.store').middleware('C')
    Route.get('/purchasing-request/list', 'PurchasingRequestController.list').as('acc.purchasing-request.list').middleware('R')
    Route.get('/purchasing-request/create', 'PurchasingRequestController.create').as('acc.purchasing-request.create').middleware('C')
    Route.get('/purchasing-request/:id/show', 'PurchasingRequestController.show').as('acc.purchasing-request.show').middleware('U')
    Route.post('/purchasing-request/:id/update', 'PurchasingRequestController.update').as('acc.purchasing-request.update').middleware('U')
    Route.get('/purchasing-request/:id/view', 'PurchasingRequestController.view').as('acc.purchasing-request.view').middleware('R')
    // Route.post('/purchasing-request/:id/validate', 'PurchasingRequestController.validateStore').as('acc.validate.store').middleware('U')
    Route.get('/purchasing-request/:id/approve', 'PurchasingRequestController.approve').as('acc.approve').middleware('U')
    Route.post('/purchasing-request/:id/approve', 'PurchasingRequestController.approveStore').as('acc.approve.store').middleware('U')
    Route.get('/purchasing-request/create/add-item', 'PurchasingRequestController.addItem').as('acc.add-item')
    // Route.post('/purchasing-request/show/:id/remove-item', 'PurchasingRequestController.removeItem').as('acc.remove-item')

    /* FAKTUR BELI */
    Route.get('/faktur-beli', 'FakturBeliController.index').as('acc.faktur-beli').middleware('R')
    Route.post('/faktur-beli', 'FakturBeliController.store').as('acc.faktur-beli.store').middleware('C')
    Route.get('/faktur-beli/list', 'FakturBeliController.list').as('acc.faktur-beli.list').middleware('R')
    Route.get('/faktur-beli/create', 'FakturBeliController.create').as('acc.faktur-beli.create').middleware('C')
    Route.get('/faktur-beli/:id/show', 'FakturBeliController.show').as('acc.faktur-beli.show').middleware('U')
    Route.get('/faktur-beli/:id/print', 'FakturBeliController.print').as('acc.faktur-beli.print').middleware('R')
    Route.post('/faktur-beli/:id/update', 'FakturBeliController.update').as('acc.faktur-beli.update').middleware('U')
    Route.get('/faktur-beli/create/add-item', 'FakturBeliController.addItem').as('acc.faktur-beli.addItem')

    /* FAKTUR JUAL */
    Route.get('/faktur-jual', 'FakturJualController.index').as('acc.faktur-jual').middleware('R')
    Route.post('/faktur-jual', 'FakturJualController.store').as('acc.faktur-jual.store').middleware('C')
    Route.get('/faktur-jual/list', 'FakturJualController.list').as('acc.faktur-jual.list').middleware('R')
    Route.get('/faktur-jual/create', 'FakturJualController.create').as('acc.faktur-jual.create').middleware('C')
    Route.get('/faktur-jual/:id/view', 'FakturJualController.view').as('acc.faktur-jual.view').middleware('R')
    Route.get('/faktur-jual/:id/print', 'FakturJualController.print').as('acc.faktur-jual.print').middleware('R')
    Route.get('/faktur-jual/:id/show', 'FakturJualController.show').as('acc.faktur-jual.show').middleware('U')
    Route.post('/faktur-jual/:id/update', 'FakturJualController.update').as('acc.faktur-jual.update').middleware('U')
    Route.delete('/faktur-jual/:id/destroy', 'FakturJualController.destroy').as('acc.faktur-jual.destroy').middleware('D')
    Route.get('/faktur-jual/create/add-item', 'FakturJualController.addItem').as('acc.faktur-jual.addItem')
    
    /* PENERIMAAN BARANG */
    Route.get('/terima-barang', 'TerimaBarangController.index').as('acc.terima-barang').middleware('R')
    Route.post('/terima-barang', 'TerimaBarangController.store').as('acc.terima-barang.store').middleware('C')
    Route.get('/terima-barang/list', 'TerimaBarangController.list').as('acc.terima-barang.list').middleware('R')
    Route.get('/terima-barang/create', 'TerimaBarangController.create').as('acc.terima-barang.create').middleware('C')
    Route.get('/terima-barang/:id/show', 'TerimaBarangController.show').as('acc.terima-barang.show').middleware('U')
    Route.get('/terima-barang/:id/print', 'TerimaBarangController.print').as('acc.terima-barang.print').middleware('R')
    Route.get('/terima-barang/:id/terima', 'TerimaBarangController.terima').as('acc.terima-barang.terima').middleware('R')
    Route.post('/terima-barang/:id/update', 'TerimaBarangController.update').as('acc.terima-barang.update').middleware('U')
    Route.get('/terima-barang/create/add-item', 'TerimaBarangController.addItem').as('acc.terima-barang.addItem')

    /* PERSEDIAAN BARANG */
    Route.get('/persediaan-barang', 'PersediaanBarangController.index').as('acc.persediaan-barang').middleware('R')
    Route.post('/persediaan-barang', 'PersediaanBarangController.store').as('acc.persediaan-barang.store').middleware('C')
    Route.get('/persediaan-barang/list', 'PersediaanBarangController.list').as('acc.persediaan-barang.list').middleware('R')
    Route.get('/persediaan-barang/create', 'PersediaanBarangController.create').as('acc.persediaan-barang.create').middleware('C')
    Route.get('/persediaan-barang/:id/show', 'PersediaanBarangController.show').as('acc.persediaan-barang.show').middleware('U')
    Route.get('/persediaan-barang/:id/history-harga', 'PersediaanBarangController.historyHarga').as('acc.persediaan-barang.historyHarga').middleware('R')
    Route.post('/persediaan-barang/:id/update', 'PersediaanBarangController.update').as('acc.persediaan-barang.show').middleware('U')
    Route.get('/persediaan-barang/create/add-item', 'PersediaanBarangController.addItem').as('acc.persediaan-barang.addItem')

    /* PENGHAPUSAN PERSEDIAAN BARANG */
    Route.get('/hapus-persediaan', 'HapusPersediaanController.index').as('acc.hapus-persediaan').middleware('R')
    Route.post('/hapus-persediaan', 'HapusPersediaanController.store').as('acc.hapus-persediaan.store').middleware('C')
    Route.get('/hapus-persediaan/list', 'HapusPersediaanController.list').as('acc.hapus-persediaan.list').middleware('R')
    Route.get('/hapus-persediaan/create', 'HapusPersediaanController.create').as('acc.hapus-persediaan.create').middleware('C')
    Route.get('/hapus-persediaan/:id/show', 'HapusPersediaanController.show').as('acc.hapus-persediaan.show').middleware('U')
    Route.get('/hapus-persediaan/:id/print', 'HapusPersediaanController.print').as('acc.hapus-persediaan.print').middleware('R')
    Route.get('/hapus-persediaan/:id/terima', 'HapusPersediaanController.terima').as('acc.hapus-persediaan.terima').middleware('R')
    Route.post('/hapus-persediaan/:id/update', 'HapusPersediaanController.update').as('acc.hapus-persediaan.update').middleware('U')
    Route.delete('/hapus-persediaan/:id/destroy', 'HapusPersediaanController.destroy').as('acc.hapus-persediaan.destroy').middleware('D')
    Route.get('/hapus-persediaan/create/add-item', 'HapusPersediaanController.addItem').as('acc.hapus-persediaan.addItem')

    /* TANDA TERIMA */
    Route.get('/tanda-terima', 'TandaTerimaController.index').as('acc.tanda-terima').middleware('R')
    Route.post('/tanda-terima', 'TandaTerimaController.store').as('acc.tanda-terima.store').middleware('C')
    Route.get('/tanda-terima/list', 'TandaTerimaController.list').as('acc.tanda-terima.list').middleware('R')
    Route.get('/tanda-terima/create', 'TandaTerimaController.create').as('acc.tanda-terima.create').middleware('C')
    Route.get('/tanda-terima/search', 'TandaTerimaController.searchFaktur').as('acc.tanda-terima.searchFaktur').middleware('R')
    Route.get('/tanda-terima/searchItems', 'TandaTerimaController.searchItems').as('acc.tanda-terima.searchItems').middleware('R')
    Route.get('/tanda-terima/:id/show', 'TandaTerimaController.show').as('acc.tanda-terima.show').middleware('U')
    Route.get('/tanda-terima/:id/print', 'TandaTerimaController.print').as('acc.tanda-terima.print').middleware('R')
    Route.post('/tanda-terima/:id/update', 'TandaTerimaController.update').as('acc.tanda-terima.update').middleware('U')
    Route.delete('/tanda-terima/:id/destroy', 'TandaTerimaController.destroy').as('acc.tanda-terima.destroy').middleware('D')
    Route.get('/tanda-terima/create/add-item', 'TandaTerimaController.addItem').as('acc.tanda-terima.addItem')

    /* PEMBAYARAN */
    Route.get('/pembayaran', 'PembayaranController.index').as('acc.pembayaran').middleware('R')
    Route.post('/pembayaran', 'PembayaranController.store').as('acc.pembayaran.store').middleware('C')
    Route.get('/pembayaran/list', 'PembayaranController.list').as('acc.pembayaran.list').middleware('R')
    Route.get('/pembayaran/create', 'PembayaranController.create').as('acc.pembayaran.create').middleware('C')
    Route.get('/pembayaran/search', 'PembayaranController.searchFaktur').as('acc.pembayaran.searchFaktur').middleware('R')
    Route.get('/pembayaran/searchItems', 'PembayaranController.searchItems').as('acc.pembayaran.searchItems').middleware('R')
    Route.get('/pembayaran/:id/show', 'PembayaranController.show').as('acc.pembayaran.show').middleware('U')
    Route.get('/pembayaran/:id/print', 'PembayaranController.print').as('acc.pembayaran.print').middleware('R')
    Route.post('/pembayaran/:id/update', 'PembayaranController.update').as('acc.pembayaran.update').middleware('U')
    Route.delete('/pembayaran/:id/destroy', 'PembayaranController.destroy').as('acc.pembayaran.destroy').middleware('D')
    Route.get('/pembayaran/create/add-item', 'PembayaranController.addItem').as('acc.pembayaran.addItem')

    /* ENTRI JURNAL */
    Route.get('/entri-jurnal', 'EntriJurnalController.index').as('acc.entri-jurnal').middleware('R')
    Route.post('/entri-jurnal', 'EntriJurnalController.store').as('acc.entri-jurnal.store').middleware('C')
    Route.get('/entri-jurnal/list', 'EntriJurnalController.list').as('acc.entri-jurnal.list').middleware('R')
    Route.get('/entri-jurnal/create', 'EntriJurnalController.create').as('acc.entri-jurnal.create').middleware('C')
    Route.get('/entri-jurnal/search', 'EntriJurnalController.searchFaktur').as('acc.entri-jurnal.searchFaktur').middleware('R')
    Route.get('/entri-jurnal/searchItems', 'EntriJurnalController.searchItems').as('acc.entri-jurnal.searchItems').middleware('R')
    Route.get('/entri-jurnal/:id/show', 'EntriJurnalController.show').as('acc.entri-jurnal.show').middleware('U')
    Route.post('/entri-jurnal/:id/update', 'EntriJurnalController.update').as('acc.entri-jurnal.update').middleware('U')
    Route.delete('/entri-jurnal/:id/destroy', 'EntriJurnalController.destroy').as('acc.entri-jurnal.destroy').middleware('D')
    Route.get('/entri-jurnal/create/add-item', 'EntriJurnalController.addItem').as('acc.entri-jurnal.addItem')
    Route.get('/entri-jurnal/create/select-gudang', 'EntriJurnalController.selectGudang').as('acc.entri-jurnal.selectGudang')
    Route.get('/entri-jurnal/create/:coa/select-relation', 'EntriJurnalController.selectRelation').as('acc.entri-jurnal.selectRelation')
    Route.get('/entri-jurnal/create/:pemasok/select-faktur', 'EntriJurnalController.selectFaktur').as('acc.entri-jurnal.selectFaktur')
    Route.get('/entri-jurnal/create/:pelanggan/select-invoice', 'EntriJurnalController.selectInvoice').as('acc.entri-jurnal.selectInvoice')

    /* TRANSFER AKUN KAS & BANK */
    Route.get('/transfer-kasbank', 'TransferKasBankController.index').as('acc.transfer-kasbank').middleware('R')
    Route.post('/transfer-kasbank', 'TransferKasBankController.store').as('acc.transfer-kasbank.store').middleware('C')
    Route.get('/transfer-kasbank/list', 'TransferKasBankController.list').as('acc.transfer-kasbank.list').middleware('R')
    Route.get('/transfer-kasbank/create', 'TransferKasBankController.create').as('acc.transfer-kasbank.create').middleware('C')
    Route.get('/transfer-kasbank/:id/show', 'TransferKasBankController.show').as('acc.transfer-kasbank.show').middleware('U')
    Route.get('/transfer-kasbank/:id/print', 'TransferKasBankController.print').as('acc.transfer-kasbank.print').middleware('R')
    Route.post('/transfer-kasbank/:id/update', 'TransferKasBankController.update').as('acc.transfer-kasbank.update').middleware('U')
    Route.delete('/transfer-kasbank/:id/destroy', 'TransferKasBankController.destroy').as('acc.transfer-kasbank.destroy').middleware('D')

    /* PINDAH PERSEDIAAN BARANG */
    Route.get('/transfer-persediaan', 'TransferPersediaanController.index').as('acc.transfer-persediaan').middleware('R')
    Route.post('/transfer-persediaan', 'TransferPersediaanController.store').as('acc.transfer-persediaan.store').middleware('C')
    Route.get('/transfer-persediaan/list', 'TransferPersediaanController.list').as('acc.transfer-persediaan.list').middleware('R')
    Route.get('/transfer-persediaan/create', 'TransferPersediaanController.create').as('acc.transfer-persediaan.create').middleware('C')
    Route.get('/transfer-persediaan/:id/show', 'TransferPersediaanController.show').as('acc.transfer-persediaan.show').middleware('U')
    Route.get('/transfer-persediaan/:id/print', 'TransferPersediaanController.print').as('acc.transfer-persediaan.print').middleware('R')
    Route.post('/transfer-persediaan/:id/update', 'TransferPersediaanController.update').as('acc.transfer-persediaan.update').middleware('U')
    Route.delete('/transfer-persediaan/:id/destroy', 'TransferPersediaanController.destroy').as('acc.transfer-kasbank.destroy').middleware('D')
    Route.get('/transfer-persediaan/create/add-item', 'TransferPersediaanController.addItem').as('acc.transfer-persediaan.addItem')

}).prefix('acc').namespace('keuangan')

/*
*   ROUTING OPERATIONAL
*/
Route.group(() => {
    /* ORDER PELANGGAN */
    Route.get('/entry-order', 'OrderPelangganController.index').as('ops.entry-order').middleware('R')
    Route.post('/entry-order', 'OrderPelangganController.store').as('ops.entry-order.store').middleware('C')
    Route.get('/entry-order/list', 'OrderPelangganController.list').as('ops.entry-order.list').middleware('R')
    Route.get('/entry-order/create', 'OrderPelangganController.create').as('ops.entry-order.create').middleware('C')
    Route.get('/entry-order/create-items', 'OrderPelangganController.createItems').as('ops.entry-order.createItems').middleware('C')
    Route.get('/entry-order/create-jasa', 'OrderPelangganController.createJasa').as('ops.entry-order.createJasa').middleware('C')
    Route.get('/entry-order/:id/inv', 'OrderPelangganController.invoice').as('ops.entry-order.invoice').middleware('R')
    Route.get('/entry-order/:id/show', 'OrderPelangganController.show').as('ops.entry-order.show').middleware('R')
    Route.post('/entry-order/:id/update', 'OrderPelangganController.update').as('ops.entry-order.update').middleware('U')
    Route.delete('/entry-order/:id/destroy', 'OrderPelangganController.destroy').as('ops.entry-order.destroy').middleware('D')

    /* PEMBAYARAN PELANGGAN */
    Route.get('/entry-pembayaran', 'PembayaranPelangganController.index').as('ops.entry-pembayaran').middleware('R')
    Route.post('/entry-pembayaran', 'PembayaranPelangganController.store').as('ops.entry-pembayaran.store').middleware('C')
    Route.post('/entry-pembayaran/multipayment', 'PembayaranPelangganController.multiPayment').as('ops.entry-pembayaran.multiPayment').middleware('C')
    Route.get('/entry-pembayaran/list-order', 'PembayaranPelangganController.listOrder').as('ops.entry-pembayaran.listOrder').middleware('R')
    Route.get('/entry-pembayaran/create', 'PembayaranPelangganController.create').as('ops.entry-pembayaran.create').middleware('C')
    Route.get('/entry-pembayaran/:id/invoicing', 'PembayaranPelangganController.invoicing').as('ops.entry-pembayaran.invoicing').middleware('U')
    Route.post('/entry-pembayaran/:id/invoicing', 'PembayaranPelangganController.invoicingStore').as('ops.entry-pembayaran.invoicing').middleware('U')
    Route.get('/entry-pembayaran/:id/paid', 'PembayaranPelangganController.payment').as('ops.entry-pembayaran.payment').middleware('R')
    Route.get('/entry-pembayaran/:id/show', 'PembayaranPelangganController.show').as('ops.entry-pembayaran.show').middleware('U')
    Route.post('/entry-pembayaran/:id/update', 'PembayaranPelangganController.update').as('ops.entry-pembayaran.update').middleware('U')
    Route.get('/entry-pembayaran/:id/list-bayar', 'PembayaranPelangganController.listBayar').as('ops.entry-pembayaran.listBayar').middleware('R')
    Route.get('/entry-pembayaran/:id/print-invoice', 'PembayaranPelangganController.printInvoice').as('ops.entry-pembayaran.printInvoice').middleware('R')
    Route.get('/entry-pembayaran/:id/print-kwitansi', 'PembayaranPelangganController.printKwitansi').as('ops.entry-pembayaran.printKwitansi').middleware('R')
    Route.get('/entry-pembayaran/:id/pending-payment', 'PembayaranPelangganController.pendingPayment').as('ops.entry-pembayaran.pendingPayment').middleware('R')
    Route.delete('/entry-pembayaran/:id/destroy', 'PembayaranPelangganController.destroy').as('ops.entry-pembayaran.destroy').middleware('D')
}).prefix('operational').namespace('operational')

/*
*   ROUTING SETTING
*/
Route.group(() => {

    /** SETTING COA AKUN **/
    Route.get('/coa', 'AccCoaController.index').as('set.coa').middleware('R')
    Route.post('/coa-akun', 'AccCoaController.storeAkun').as('set.coa.storeAkun').middleware('C')
    Route.post('/coa-group', 'AccCoaController.storeGroup').as('set.coa.storeGroup').middleware('C')
    Route.get('/coa/create-akun', 'AccCoaController.createAkun').as('set.coa.createAkun').middleware('C')
    Route.get('/coa/create-group', 'AccCoaController.createGroup').as('set.coa.createGroup').middleware('C')
    Route.get('/coa/:id/show-akun', 'AccCoaController.showAkun').as('set.coa.showAkun').middleware('R')
    Route.get('/coa/:id/show-group', 'AccCoaController.showGroup').as('set.coa.showGroup').middleware('R')
    Route.get('/coa/:id/show-subgroup', 'AccCoaController.showSubGroup').as('set.coa.showSubGroup').middleware('R')
    Route.post('/coa/:id/update-akun', 'AccCoaController.updateAkun').as('set.coa.updateAkun').middleware('U')
    Route.post('/coa/:id/update-group', 'AccCoaController.updateGroup').as('set.coa.updateGroup').middleware('U')
    Route.post('/coa/:id/update-subgroup', 'AccCoaController.updateSubGroup').as('set.coa.updateSubGroup').middleware('U')
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

/*
*   ROUTING SETTING
*/
Route.group(() => {

    /** LOGIN **/
    Route.get('/signinx', 'ApiAuthController.signinx')

    Route.post('/signin', 'ApiAuthController.signin')

    /** BARANG **/
    Route.get('/barang', 'ApiBarangController.index')
    Route.get('/barang/:id/show', 'ApiBarangController.show')
    Route.get('/barang/:kode/show-kode', 'ApiBarangController.showByKode')

    /** BARANG BRAND **/
    Route.get('/barang-brand', 'ApiBarangBrandController.index')
    Route.get('/barang-brand/:id/show', 'ApiBarangBrandController.show')

    /** BARANG CATEGORY **/
    Route.get('/barang-kategori', 'ApiBarangCategoryController.index')
    Route.get('/barang-kategori/:id/show', 'ApiBarangCategoryController.show')

    /** BARANG SUB CATEGORY **/
    Route.get('/barang-subkategori', 'ApiBarangSubCategoryController.index')
    Route.get('/barang-subkategori/:id/show', 'ApiBarangSubCategoryController.show')

    /** BARANG QUALITAS **/
    Route.get('/barang-qualitas', 'ApiBarangQualitasController.index')
    Route.get('/barang-qualitas/:id/show', 'ApiBarangQualitasController.show')

    /** BARANG STOCK **/
    Route.get('/barang-stok', 'ApiBarangStockController.index')
    Route.get('/barang-stok/:id/show', 'ApiBarangStockController.show')

    /** CABANG **/
    Route.get('/cabang', 'ApiCabangController.index')
    Route.get('/cabang/:id/show', 'ApiCabangController.show')

    /** GUDANG **/
    Route.get('/gudang', 'ApiGudangController.index')
    Route.get('/gudang/:id/show', 'ApiGudangController.show')

    /** RAK **/
    Route.get('/rak', 'ApiRakController.index')
    Route.get('/rak/:id/show', 'ApiRakController.show')

    /** BIN **/
    Route.get('/bin', 'ApiBinController.index')
    Route.get('/bin/:id/show', 'ApiBinController.show')

}).prefix('api-v1').namespace('api')