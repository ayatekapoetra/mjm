/*
 Navicat Premium Data Transfer

 Source Server         : Makkuraga
 Source Server Type    : MySQL
 Source Server Version : 50737
 Source Host           : 103.31.39.139:3306
 Source Schema         : mjm_v1

 Target Server Type    : MySQL
 Target Server Version : 50737
 File Encoding         : 65001

 Date: 26/12/2022 11:46:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for acc_coa_group
-- ----------------------------
DROP TABLE IF EXISTS `acc_coa_group`;
CREATE TABLE `acc_coa_group` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `coa_tipe` int(10) DEFAULT NULL,
  `grp_name` varchar(255) DEFAULT NULL,
  `kode` varchar(100) NOT NULL,
  `urut` int(2) NOT NULL,
  `total` float(15,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `tipex` (`coa_tipe`) USING BTREE,
  KEY `grp_name` (`grp_name`) USING BTREE,
  CONSTRAINT `tipex` FOREIGN KEY (`coa_tipe`) REFERENCES `acc_coa_tipe` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of acc_coa_group
-- ----------------------------
BEGIN;
INSERT INTO `acc_coa_group` VALUES (11, 1, 'Aset Lancar', '11', 1, 0.00, '2022-02-18 12:03:36', '2022-02-18 12:03:36');
INSERT INTO `acc_coa_group` VALUES (12, 1, 'Aset Tetap', '12', 2, 0.00, '2022-02-18 12:03:36', '2022-02-18 12:03:36');
INSERT INTO `acc_coa_group` VALUES (21, 2, 'Jangka Pendek', '21', 3, 0.00, '2022-02-18 12:03:36', '2022-02-18 12:03:36');
INSERT INTO `acc_coa_group` VALUES (22, 2, 'Jangka Panjang', '22', 4, 0.00, '2022-02-18 12:03:36', '2022-02-18 12:03:36');
INSERT INTO `acc_coa_group` VALUES (51, 5, 'HPP Sparepart', '51', 1, 0.00, '2022-06-20 11:24:52', '2022-06-20 11:24:52');
INSERT INTO `acc_coa_group` VALUES (52, 5, 'HPP Jasa Service', '52', 2, 0.00, '2022-05-19 14:01:10', '2022-05-19 14:01:10');
INSERT INTO `acc_coa_group` VALUES (53, 5, 'Beban Penjualan', '53', 3, 0.00, '2022-06-20 11:31:52', '2022-06-20 11:31:52');
INSERT INTO `acc_coa_group` VALUES (54, 5, 'Biaya Administrasi', '54', 4, 0.00, '2022-06-20 11:32:16', '2022-06-20 11:32:16');
INSERT INTO `acc_coa_group` VALUES (55, 5, 'Biaya Operational', '55', 5, 0.00, '2022-06-20 11:32:35', '2022-06-20 11:32:35');
INSERT INTO `acc_coa_group` VALUES (56, 5, 'Biaya Umum', '56', 6, 0.00, '2022-06-20 11:32:50', '2022-06-20 11:32:50');
COMMIT;

-- ----------------------------
-- Table structure for acc_coa_subgroup
-- ----------------------------
DROP TABLE IF EXISTS `acc_coa_subgroup`;
CREATE TABLE `acc_coa_subgroup` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `coa_tipe` int(10) DEFAULT NULL,
  `coa_group` int(10) DEFAULT NULL,
  `subgrp_name` varchar(255) DEFAULT NULL,
  `kode` varchar(100) NOT NULL,
  `urut` int(2) NOT NULL,
  `total` float(15,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `tipex` (`coa_tipe`) USING BTREE,
  KEY `acc_coa_subgroup_ibfk_coa_group` (`coa_group`) USING BTREE,
  CONSTRAINT `acc_coa_subgroup_ibfk_coa_group` FOREIGN KEY (`coa_group`) REFERENCES `acc_coa_group` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `acc_coa_subgroup_ibfk_coa_tipe` FOREIGN KEY (`coa_tipe`) REFERENCES `acc_coa_tipe` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of acc_coa_subgroup
-- ----------------------------
BEGIN;
INSERT INTO `acc_coa_subgroup` VALUES (111, 1, 11, 'Bank', '111', 1, 0.00, 'Y', '2022-05-15 21:42:35', '2022-05-15 21:42:38');
INSERT INTO `acc_coa_subgroup` VALUES (112, 1, 11, 'Kas', '112', 2, 0.00, 'Y', '2022-05-15 20:07:38', '2022-05-15 20:07:41');
INSERT INTO `acc_coa_subgroup` VALUES (113, 1, 11, 'Piutang Karyawan', '113', 3, 0.00, 'Y', '2022-05-15 20:12:44', '2022-05-15 20:12:47');
COMMIT;

-- ----------------------------
-- Table structure for acc_coa_tipe
-- ----------------------------
DROP TABLE IF EXISTS `acc_coa_tipe`;
CREATE TABLE `acc_coa_tipe` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `dk` enum('d','k') DEFAULT NULL,
  `kode` varchar(100) NOT NULL,
  `urut` int(2) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of acc_coa_tipe
-- ----------------------------
BEGIN;
INSERT INTO `acc_coa_tipe` VALUES (1, 'Aset', 'd', '10000', 1, '2022-01-22 11:25:47', '2022-01-22 11:25:47');
INSERT INTO `acc_coa_tipe` VALUES (2, 'Kewajiban', 'k', '20000', 2, '2022-01-22 11:25:47', '2022-01-22 11:25:47');
INSERT INTO `acc_coa_tipe` VALUES (3, 'Equitas', 'k', '30000', 3, '2022-01-22 11:25:47', '2022-01-22 11:25:47');
INSERT INTO `acc_coa_tipe` VALUES (4, 'Pendapatan', 'k', '40000', 4, '2022-01-22 11:25:47', '2022-01-22 11:25:47');
INSERT INTO `acc_coa_tipe` VALUES (5, 'Beban & Biaya', 'd', '50000', 5, '2022-01-22 11:25:47', '2022-01-22 11:25:47');
COMMIT;

-- ----------------------------
-- Table structure for acc_coas
-- ----------------------------
DROP TABLE IF EXISTS `acc_coas`;
CREATE TABLE `acc_coas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `coa_tipe` int(10) DEFAULT NULL,
  `coa_tipe_nm` varchar(255) DEFAULT NULL,
  `coa_grp` int(10) DEFAULT NULL,
  `coa_grp_nm` varchar(255) DEFAULT NULL,
  `coa_subgrp` int(10) DEFAULT NULL,
  `coa_subgrp_nm` varchar(255) DEFAULT NULL,
  `reff` int(10) unsigned DEFAULT NULL,
  `coa_name` varchar(100) NOT NULL,
  `dk` enum('d','k') DEFAULT NULL,
  `kode` varchar(30) NOT NULL,
  `alias` varchar(255) DEFAULT NULL,
  `urut` int(10) DEFAULT NULL,
  `total` float(15,2) DEFAULT '0.00',
  `is_akun` enum('A','G') DEFAULT 'A',
  `is_remove` enum('Y','N') DEFAULT 'Y',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `createdby` int(255) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `createdbyx` (`createdby`) USING BTREE,
  KEY `kode` (`kode`) USING BTREE,
  KEY `kode_2` (`kode`,`id`) USING BTREE,
  KEY `coa_tipex` (`coa_tipe`) USING BTREE,
  KEY `coa_grpx` (`coa_grp`) USING BTREE,
  KEY `acc_coa_ibfk_coa_subgrp` (`coa_subgrp`) USING BTREE,
  KEY `acc_coa_ibfk_cabang_id` (`cabang_id`) USING BTREE,
  CONSTRAINT `acc_coa_ibfk_cabang_id` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `acc_coa_ibfk_coa_author` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `acc_coa_ibfk_coa_grp` FOREIGN KEY (`coa_grp`) REFERENCES `acc_coa_group` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `acc_coa_ibfk_coa_subgrp` FOREIGN KEY (`coa_subgrp`) REFERENCES `acc_coa_subgroup` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `acc_coa_ibfk_coa_tipe` FOREIGN KEY (`coa_tipe`) REFERENCES `acc_coa_tipe` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56010 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of acc_coas
-- ----------------------------
BEGIN;
INSERT INTO `acc_coas` VALUES (11001, NULL, 1, 'Aset', 11, 'Aset Lancar', NULL, NULL, NULL, 'Persediaan Part', 'd', '11001', NULL, 7, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 04:29:08', '2022-05-16 04:29:08');
INSERT INTO `acc_coas` VALUES (11002, NULL, 1, 'Aset', 11, 'Aset Lancar', NULL, NULL, NULL, 'DP Pembelian Part', 'd', '11002', NULL, 8, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 10:49:23', '2022-05-19 10:49:23');
INSERT INTO `acc_coas` VALUES (11003, NULL, 1, 'Aset', 11, 'Aset Lancar', NULL, NULL, NULL, 'PPH Dibayar Dimuka', 'd', '11003', NULL, 13, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 10:58:50', '2022-05-19 10:58:50');
INSERT INTO `acc_coas` VALUES (11004, NULL, 1, 'Aset', 11, 'Aset Lancar', NULL, NULL, NULL, 'PPN Masukan', 'd', '11004', NULL, 14, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 10:59:38', '2022-05-19 10:59:38');
INSERT INTO `acc_coas` VALUES (11005, NULL, 1, 'Aset', 11, 'Aset Lancar', NULL, NULL, NULL, 'Piutang Dagang', 'd', '11005', NULL, 15, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:00:14', '2022-05-19 11:00:14');
INSERT INTO `acc_coas` VALUES (11101, NULL, 1, 'Aset', 11, 'Aset Lancar', 111, 'Bank', NULL, 'Bank BCA', 'd', '11101', NULL, 1, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 04:17:08', '2022-05-16 04:17:08');
INSERT INTO `acc_coas` VALUES (11102, NULL, 1, 'Aset', 11, 'Aset Lancar', 111, 'Bank', NULL, 'Bank BRI', 'd', '11102', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 04:17:34', '2022-05-16 04:17:34');
INSERT INTO `acc_coas` VALUES (11201, NULL, 1, 'Aset', 11, 'Aset Lancar', 112, 'Kas', NULL, 'MKS Kas Besar', 'd', '11201', NULL, 3, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 04:26:24', '2022-05-16 04:26:24');
INSERT INTO `acc_coas` VALUES (11202, NULL, 1, 'Aset', 11, 'Aset Lancar', 112, 'Kas', NULL, 'MKS Kas Kecil', 'd', '11202', NULL, 4, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 21:08:17', '2022-05-16 21:08:17');
INSERT INTO `acc_coas` VALUES (11207, NULL, 1, 'Aset', 11, 'Aset Lancar', 112, 'Kas', NULL, 'SMD Kas Besar', 'd', '11207', NULL, 18, 0.00, 'A', 'Y', 'Y', 1, '2022-05-16 21:08:37', '2022-05-16 21:08:37');
INSERT INTO `acc_coas` VALUES (11208, NULL, 1, 'Aset', 11, 'Aset Lancar', 112, 'Kas', NULL, 'SMD Kas Kecil', 'd', '11208', NULL, 18, 0.00, 'A', 'Y', 'Y', 1, '2022-05-16 21:08:58', '2022-05-16 21:08:58');
INSERT INTO `acc_coas` VALUES (11301, NULL, 1, 'Aset', 11, 'Aset Lancar', 113, 'Piutang Karyawan', NULL, 'Karyawan A', 'd', '11301', NULL, 10, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 05:03:01', '2022-05-16 05:03:01');
INSERT INTO `acc_coas` VALUES (11302, NULL, 1, 'Aset', 11, 'Aset Lancar', 113, 'Piutang Karyawan', NULL, 'Karyawan B', 'd', '11302', NULL, 11, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 21:12:00', '2022-05-16 21:12:00');
INSERT INTO `acc_coas` VALUES (12001, NULL, 1, 'Aset', 12, 'Aset Tetap', NULL, NULL, NULL, 'Inventaris Toko', 'd', '12001', NULL, 12, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 04:54:28', '2022-05-16 04:54:28');
INSERT INTO `acc_coas` VALUES (12002, NULL, 1, 'Aset', 12, 'Aset Tetap', NULL, NULL, NULL, 'Peralatan Toko', 'd', '12002', NULL, 16, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:01:59', '2022-05-19 11:01:59');
INSERT INTO `acc_coas` VALUES (12003, NULL, 1, 'Aset', 12, 'Aset Tetap', NULL, NULL, NULL, 'Akumulasi Penyusutan Aset Tetap', 'd', '12003', NULL, 17, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:02:37', '2022-05-19 11:02:37');
INSERT INTO `acc_coas` VALUES (21001, NULL, 2, 'Kewajiban', 21, 'Jangka Pendek', NULL, NULL, NULL, 'Hutang BPJS Kesehatan', 'k', '21001', NULL, 8, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 04:33:15', '2022-05-16 04:33:15');
INSERT INTO `acc_coas` VALUES (21002, NULL, 2, 'Kewajiban', 21, 'Jangka Pendek', NULL, NULL, NULL, 'Hutang BPJS Ketenagakerjaan', 'k', '21002', NULL, 9, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:03:29', '2022-05-19 11:03:29');
INSERT INTO `acc_coas` VALUES (21003, NULL, 2, 'Kewajiban', 21, 'Jangka Pendek', NULL, NULL, NULL, 'Hutang Gaji', 'k', '21003', NULL, 10, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:04:07', '2022-05-19 11:04:07');
INSERT INTO `acc_coas` VALUES (21004, NULL, 2, 'Kewajiban', 21, 'Jangka Pendek', NULL, NULL, NULL, 'PPH21 Karyawan', 'k', '21004', NULL, 11, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:07:09', '2022-05-19 11:07:09');
INSERT INTO `acc_coas` VALUES (21005, NULL, 2, 'Kewajiban', 21, 'Jangka Pendek', NULL, NULL, NULL, 'Hutang Dagang', 'k', '21005', NULL, 12, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:07:39', '2022-05-19 11:07:39');
INSERT INTO `acc_coas` VALUES (21006, NULL, 2, 'Kewajiban', 21, 'Jangka Pendek', NULL, NULL, NULL, 'PPN Keluaran', 'k', '21006', NULL, 13, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:07:57', '2022-05-19 11:07:57');
INSERT INTO `acc_coas` VALUES (22001, NULL, 2, 'Kewajiban', 22, 'Jangka Panjang', NULL, NULL, NULL, 'Hutang Ke Owner', 'k', '22001', NULL, 13, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:56:18', '2022-05-19 11:56:18');
INSERT INTO `acc_coas` VALUES (30001, NULL, 3, 'Equitas', NULL, NULL, NULL, NULL, NULL, 'Modal', 'k', '30001', NULL, 1, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:09:39', '2022-05-19 11:09:39');
INSERT INTO `acc_coas` VALUES (30002, NULL, 3, 'Equitas', NULL, NULL, NULL, NULL, NULL, 'Prive', 'k', '30002', NULL, 1, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:10:09', '2022-05-19 11:10:09');
INSERT INTO `acc_coas` VALUES (40001, NULL, 4, 'Pendapatan', NULL, NULL, NULL, NULL, NULL, 'Penjualan Barang Dagang', 'k', '40001', NULL, 9, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-16 04:31:22', '2022-05-16 04:31:22');
INSERT INTO `acc_coas` VALUES (40002, NULL, 4, 'Pendapatan', NULL, NULL, NULL, NULL, NULL, 'Pendapatan Jasa Services', 'k', '40002', NULL, 9, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:13:37', '2022-05-19 11:13:37');
INSERT INTO `acc_coas` VALUES (40003, NULL, 4, 'Pendapatan', NULL, NULL, NULL, NULL, NULL, 'Pendapatan Lain-lain', 'k', '40003', NULL, 9, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:13:57', '2022-05-19 11:13:57');
INSERT INTO `acc_coas` VALUES (40005, NULL, 4, 'Pendapatan', NULL, NULL, NULL, NULL, NULL, 'Selisih Kas', 'k', '40005', NULL, 9, 0.00, 'A', 'Y', 'Y', NULL, '2022-05-19 11:14:33', '2022-05-19 11:14:33');
INSERT INTO `acc_coas` VALUES (40006, NULL, 4, 'Pendapatan', NULL, NULL, NULL, NULL, NULL, 'Discount Penjualan Barang', 'k', '40006', NULL, 10, 0.00, 'A', 'Y', 'Y', 1, '2022-05-19 11:14:15', '2022-05-19 11:14:15');
INSERT INTO `acc_coas` VALUES (40007, NULL, 4, 'Pendapatan', NULL, NULL, NULL, NULL, NULL, 'Discount Pendapatan Jasa', 'k', '40007', NULL, 10, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-24 16:33:14', '2022-06-24 16:33:14');
INSERT INTO `acc_coas` VALUES (51001, NULL, 5, 'Beban & Biaya', 51, 'HPP Sparepart', NULL, NULL, NULL, 'HPP Barang', 'd', '51001', NULL, 2, 0.00, 'A', 'Y', 'Y', 1, '2022-05-19 13:57:28', '2022-05-19 14:51:34');
INSERT INTO `acc_coas` VALUES (51002, NULL, 5, 'Beban & Biaya', 51, 'HPP Sparepart', NULL, NULL, NULL, 'Discount Pembelian', 'd', '51002', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:28:17', '2022-06-20 11:28:17');
INSERT INTO `acc_coas` VALUES (52001, NULL, 5, 'Beban & Biaya', 52, 'HPP Jasa Service', NULL, NULL, NULL, 'Beban Jasa Pihak ketiga', 'd', '52001', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:30:16', '2022-06-20 11:30:16');
INSERT INTO `acc_coas` VALUES (52002, NULL, 5, 'Beban & Biaya', 52, 'HPP Jasa Service', NULL, NULL, NULL, 'Biaya Bahan Baku Pembantu', 'd', '52002', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:30:52', '2022-06-20 11:30:52');
INSERT INTO `acc_coas` VALUES (52003, NULL, 5, 'Beban & Biaya', 52, 'HPP Jasa Service', NULL, NULL, NULL, 'Biaya Lain-lain HPP Jasa Service', 'd', '52003', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:31:16', '2022-06-20 11:31:16');
INSERT INTO `acc_coas` VALUES (53001, NULL, 5, 'Beban & Biaya', 53, 'Beban Penjualan', NULL, NULL, NULL, 'Beban Fee', 'd', '53001', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:33:43', '2022-06-20 11:33:43');
INSERT INTO `acc_coas` VALUES (53002, NULL, 5, 'Beban & Biaya', 53, 'Beban Penjualan', NULL, NULL, NULL, 'Biaya Entertainment', 'd', '53002', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:35:10', '2022-06-20 11:35:10');
INSERT INTO `acc_coas` VALUES (53003, NULL, 5, 'Beban & Biaya', 53, 'Beban Penjualan', NULL, NULL, NULL, 'Biaya Iklan & Promosi', 'd', '53003', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:35:36', '2022-06-20 11:35:36');
INSERT INTO `acc_coas` VALUES (54001, NULL, 5, 'Beban & Biaya', 54, 'Biaya Administrasi', NULL, NULL, NULL, 'Biaya Gaji', 'd', '54001', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:36:15', '2022-06-20 11:36:15');
INSERT INTO `acc_coas` VALUES (54002, NULL, 5, 'Beban & Biaya', 54, 'Biaya Administrasi', NULL, NULL, NULL, 'Biaya Gaji Lembur', 'd', '54002', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:36:35', '2022-06-20 11:36:35');
INSERT INTO `acc_coas` VALUES (54003, NULL, 5, 'Beban & Biaya', 54, 'Biaya Administrasi', NULL, NULL, NULL, 'Biaya Konsumsi Karyawan', 'd', '54003', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:36:59', '2022-06-20 11:36:59');
INSERT INTO `acc_coas` VALUES (54004, NULL, 5, 'Beban & Biaya', 54, 'Biaya Administrasi', NULL, NULL, NULL, 'Biaya Perjalanan Dinas', 'd', '54004', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:37:29', '2022-06-20 11:37:29');
INSERT INTO `acc_coas` VALUES (54005, NULL, 5, 'Beban & Biaya', 54, 'Biaya Administrasi', NULL, NULL, NULL, 'Biaya THR', 'd', '54005', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:38:01', '2022-06-20 11:38:01');
INSERT INTO `acc_coas` VALUES (54006, NULL, 5, 'Beban & Biaya', 54, 'Biaya Administrasi', NULL, NULL, NULL, 'BPJS Kesehatan', 'd', '54006', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:38:24', '2022-06-20 11:38:24');
INSERT INTO `acc_coas` VALUES (54007, NULL, 5, 'Beban & Biaya', 54, 'Biaya Administrasi', NULL, NULL, NULL, 'BPJS Ketenaga Kerjaan', 'd', '54007', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:38:51', '2022-06-20 11:38:51');
INSERT INTO `acc_coas` VALUES (55001, NULL, 5, 'Beban & Biaya', 55, 'Biaya Operational', NULL, NULL, NULL, 'Biaya Bahan Bakar', 'd', '55001', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:39:25', '2022-06-20 11:39:25');
INSERT INTO `acc_coas` VALUES (55002, NULL, 5, 'Beban & Biaya', 55, 'Biaya Operational', NULL, NULL, NULL, 'Biaya Lain-lain Operasional', 'd', '55002', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:39:53', '2022-06-20 11:39:53');
INSERT INTO `acc_coas` VALUES (55003, NULL, 5, 'Beban & Biaya', 55, 'Biaya Operational', NULL, NULL, NULL, 'Biaya Parkir', 'd', '55003', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:40:12', '2022-06-20 11:40:12');
INSERT INTO `acc_coas` VALUES (55004, NULL, 5, 'Beban & Biaya', 55, 'Biaya Operational', NULL, NULL, NULL, 'Biaya Toll Operasional', 'd', '55004', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:40:38', '2022-06-20 11:40:38');
INSERT INTO `acc_coas` VALUES (56001, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Biaya Administrasi Bank', 'd', '56001', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:41:00', '2022-06-20 11:41:00');
INSERT INTO `acc_coas` VALUES (56002, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Biaya Rumah Tangga', 'd', '56002', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:41:39', '2022-06-20 11:41:39');
INSERT INTO `acc_coas` VALUES (56003, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Biaya Air PDAM', 'd', '56003', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:42:01', '2022-06-20 11:42:01');
INSERT INTO `acc_coas` VALUES (56004, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Biaya Listrik PLN', 'd', '56004', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:42:44', '2022-06-20 11:42:44');
INSERT INTO `acc_coas` VALUES (56005, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Biaya Telepon & Internet', 'd', '56005', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:43:12', '2022-06-20 11:43:12');
INSERT INTO `acc_coas` VALUES (56006, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Biaya Perbaikan & Pemeliharaan Toko', 'd', '56006', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:43:46', '2022-06-20 11:43:46');
INSERT INTO `acc_coas` VALUES (56007, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Biaya Sewa', 'd', '56007', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:44:08', '2022-06-20 11:44:08');
INSERT INTO `acc_coas` VALUES (56008, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Beban Penyusutan Aset Tetap', 'd', '56008', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:44:48', '2022-06-20 11:44:48');
INSERT INTO `acc_coas` VALUES (56009, NULL, 5, 'Beban & Biaya', 56, 'Biaya Umum', NULL, NULL, NULL, 'Lain-lain Umum', 'd', '56009', NULL, 2, 0.00, 'A', 'Y', 'Y', NULL, '2022-06-20 11:45:05', '2022-06-20 11:45:05');
COMMIT;

-- ----------------------------
-- Table structure for adonis_schema
-- ----------------------------
DROP TABLE IF EXISTS `adonis_schema`;
CREATE TABLE `adonis_schema` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=98 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of adonis_schema
-- ----------------------------
BEGIN;
INSERT INTO `adonis_schema` VALUES (8, '1503248427885_user', 1, '2021-11-23 22:32:51');
INSERT INTO `adonis_schema` VALUES (9, '1503248427886_token', 1, '2021-11-23 22:32:52');
INSERT INTO `adonis_schema` VALUES (10, '1637653588784_usr_profile_schema', 1, '2021-11-23 22:32:52');
INSERT INTO `adonis_schema` VALUES (11, '1637654144437_sys_menu_schema', 1, '2021-11-23 22:32:52');
INSERT INTO `adonis_schema` VALUES (12, '1637654154413_sys_submenu_schema', 1, '2021-11-23 22:32:52');
INSERT INTO `adonis_schema` VALUES (13, '1637654620900_usr_menu_schema', 1, '2021-11-23 22:32:52');
INSERT INTO `adonis_schema` VALUES (14, '1637654990059_usr_privilage_schema', 1, '2021-11-23 22:32:52');
INSERT INTO `adonis_schema` VALUES (17, '1637722944504_bisnis_unit_schema', 1, '2021-11-24 11:12:14');
INSERT INTO `adonis_schema` VALUES (21, '1637724479711_usr_bisnis_unit_schema', 1, '2021-11-24 11:30:30');
INSERT INTO `adonis_schema` VALUES (22, '1637742973419_usr_workspace_schema', 1, '2021-11-24 16:37:38');
INSERT INTO `adonis_schema` VALUES (28, '1637754497184_akunting_acc_coa_schema', 1, '2021-11-25 21:12:19');
INSERT INTO `adonis_schema` VALUES (36, '1638258984985_master_cabang_schema', 2, '2021-11-30 16:49:59');
INSERT INTO `adonis_schema` VALUES (37, '1638258984999_master_barang_schema', 2, '2021-11-30 16:49:59');
INSERT INTO `adonis_schema` VALUES (38, '1638259766883_master_equipment_schema', 2, '2021-11-30 16:49:59');
INSERT INTO `adonis_schema` VALUES (39, '1638262396053_master_gudang_schema', 3, '2021-12-01 10:50:57');
INSERT INTO `adonis_schema` VALUES (40, '1638262396054_master_pemasok_schema', 3, '2021-12-01 10:50:57');
INSERT INTO `adonis_schema` VALUES (41, '1638262396083_barang_lokasi_schema', 3, '2021-12-01 10:50:57');
INSERT INTO `adonis_schema` VALUES (42, '1638320087050_transaksi_trx_request_order_schema', 3, '2021-12-01 10:50:58');
INSERT INTO `adonis_schema` VALUES (43, '1638320099437_transaksi_trx_order_beli_item_schema', 3, '2021-12-01 10:50:58');
INSERT INTO `adonis_schema` VALUES (48, '1638327968259_transaksi_trx_faktur_beli_schema', 4, '2021-12-01 11:32:18');
INSERT INTO `adonis_schema` VALUES (49, '1638327981789_transaksi_trx_faktur_beli_item_schema', 4, '2021-12-01 11:32:18');
INSERT INTO `adonis_schema` VALUES (57, '1638262396058_master_pelanggan_schema', 5, '2021-12-02 23:49:31');
INSERT INTO `adonis_schema` VALUES (58, '1638432596434_transaksi_trx_faktur_jual_schema', 5, '2021-12-02 23:49:31');
INSERT INTO `adonis_schema` VALUES (59, '1638432608886_transaksi_trx_faktur_jual_item_schema', 5, '2021-12-02 23:49:31');
INSERT INTO `adonis_schema` VALUES (60, '1638432712849_transaksi_trx_jurnal_adjust_schema', 5, '2021-12-02 23:49:31');
INSERT INTO `adonis_schema` VALUES (61, '1638432782129_transaksi_trx_jurnal_schema', 5, '2021-12-02 23:49:32');
INSERT INTO `adonis_schema` VALUES (62, '1638432810033_transaksi_trx_jurnal_saldo_schema', 5, '2021-12-02 23:49:32');
INSERT INTO `adonis_schema` VALUES (64, '1638258984983_master_bankx_schema', 6, '2021-12-03 14:23:49');
INSERT INTO `adonis_schema` VALUES (67, '1638258984983_master_bank_schema', 7, '2021-12-03 14:38:27');
INSERT INTO `adonis_schema` VALUES (68, '1638258984984_master_kas_schema', 7, '2021-12-03 14:38:27');
INSERT INTO `adonis_schema` VALUES (69, '1638707960551_lampiran_file_schema', 8, '2021-12-05 20:48:07');
INSERT INTO `adonis_schema` VALUES (78, '1638854819123_transaksi_trx_terima_barang_schema', 9, '2021-12-07 21:59:55');
INSERT INTO `adonis_schema` VALUES (79, '1638866331219_transaksi_trx_terima_barang_item_schema', 9, '2021-12-07 21:59:56');
INSERT INTO `adonis_schema` VALUES (80, '1638866331220_lampiran_file_schema', 9, '2021-12-07 21:59:56');
INSERT INTO `adonis_schema` VALUES (81, '1639064782337_def_coa_schema', 10, '2021-12-09 23:51:39');
INSERT INTO `adonis_schema` VALUES (84, '1639154128495_master_harga_beli_schema', 11, '2021-12-11 00:43:03');
INSERT INTO `adonis_schema` VALUES (85, '1639154137207_master_harga_jual_schema', 11, '2021-12-11 00:43:03');
INSERT INTO `adonis_schema` VALUES (86, '1639793607980_master_harga_rental_schema', 12, '2021-12-18 10:15:09');
INSERT INTO `adonis_schema` VALUES (87, '1640072238944_transaksi_trx_tanda_terima_schema', 13, '2021-12-21 15:57:07');
INSERT INTO `adonis_schema` VALUES (88, '1640072877331_transaksi_trx_tanda_terima_item_schema', 13, '2021-12-21 15:57:08');
INSERT INTO `adonis_schema` VALUES (92, '1640332097333_transaksi_trx_faktur_jual_bayar_schema', 14, '2021-12-24 16:18:07');
INSERT INTO `adonis_schema` VALUES (93, '1638434402086_transaksi_trx_pembayaran_schema', 15, '2021-12-28 17:02:42');
INSERT INTO `adonis_schema` VALUES (94, '1640666794194_transaksi_trx_pembayaran_item_schema', 15, '2021-12-28 17:02:42');
INSERT INTO `adonis_schema` VALUES (95, '1640666794196_transaksi_trx_faktur_beli_bayar_schema', 15, '2021-12-28 17:02:42');
INSERT INTO `adonis_schema` VALUES (96, '1641353692282_transaksi_trx_jurnal_adjust_item_schema', 16, '2022-01-05 11:46:47');
INSERT INTO `adonis_schema` VALUES (97, '1647789867020_master_rack_schema', 17, '2022-03-20 23:34:42');
COMMIT;

-- ----------------------------
-- Table structure for barang_brands
-- ----------------------------
DROP TABLE IF EXISTS `barang_brands`;
CREATE TABLE `barang_brands` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `kode` varchar(3) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `keterangan` text,
  `aktif` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of barang_brands
-- ----------------------------
BEGIN;
INSERT INTO `barang_brands` VALUES (1, '01', 'YAMAHA', NULL, 'Y');
INSERT INTO `barang_brands` VALUES (2, '02', 'SUZUKI', NULL, 'Y');
INSERT INTO `barang_brands` VALUES (3, '03', 'PERTAMINA', NULL, 'Y');
INSERT INTO `barang_brands` VALUES (4, '04', 'EVINRUDE', NULL, 'Y');
INSERT INTO `barang_brands` VALUES (5, '05', 'MARINA', NULL, 'Y');
INSERT INTO `barang_brands` VALUES (6, '06', 'MERCURY', NULL, 'Y');
INSERT INTO `barang_brands` VALUES (7, '07', 'HONDA', NULL, 'Y');
COMMIT;

-- ----------------------------
-- Table structure for barang_categories
-- ----------------------------
DROP TABLE IF EXISTS `barang_categories`;
CREATE TABLE `barang_categories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `kode` varchar(3) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of barang_categories
-- ----------------------------
BEGIN;
INSERT INTO `barang_categories` VALUES (1, '01', 'Top Cowling', 'Powerhead mesin\r\n(Engine, Carburator, Cylinder Crankcase, Crankshaft, Piston, Intake, Fuel)', 'Y', '2022-04-06 14:25:17', '2022-04-06 14:26:21');
INSERT INTO `barang_categories` VALUES (2, '02', 'Electrical', '(Generator, Cable body, Coils, Pulser, CDI, Relays, Starting motor)', 'Y', '2022-04-06 14:25:17', '2022-04-06 14:24:25');
INSERT INTO `barang_categories` VALUES (3, '03', 'Bottom Cowling', 'Paha Mesin\r\n(Brackets, Power Trim, Mount dampers, Anodes)', 'Y', '2022-04-06 14:25:17', '2022-04-06 14:26:02');
INSERT INTO `barang_categories` VALUES (4, '04', 'Lower Casing Drive', '(Driveshafts, Propeller Shafts, gearbox, Propeller, Trim Tabs, Water pumps)', 'Y', '2022-04-06 14:25:17', '2022-04-06 14:25:17');
INSERT INTO `barang_categories` VALUES (5, '05', 'Accessories', '(Fuel Tank, Remote Control, Cable Remote control, Stickers, Covers)', 'Y', '2022-04-06 14:25:50', '2022-04-06 14:25:50');
COMMIT;

-- ----------------------------
-- Table structure for barang_config
-- ----------------------------
DROP TABLE IF EXISTS `barang_config`;
CREATE TABLE `barang_config` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `alfa_prefix` varchar(255) NOT NULL DEFAULT 'BRG',
  `len_prefix` int(10) DEFAULT NULL,
  `separator` varchar(1) DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of barang_config
-- ----------------------------
BEGIN;
INSERT INTO `barang_config` VALUES (1, 'BRG', 4, '.');
COMMIT;

-- ----------------------------
-- Table structure for barang_lokasis
-- ----------------------------
DROP TABLE IF EXISTS `barang_lokasis`;
CREATE TABLE `barang_lokasis` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `terimabrg_id` int(10) unsigned DEFAULT NULL,
  `trx_inv` int(10) DEFAULT NULL,
  `trx_fb` int(10) unsigned DEFAULT NULL,
  `trx_fj` int(10) unsigned DEFAULT NULL,
  `sesuai_item_id` int(10) unsigned DEFAULT NULL,
  `pindah_id` int(10) DEFAULT NULL,
  `hpb_id` int(10) DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `qty_hand` float(8,2) DEFAULT '0.00',
  `qty_rec` float(8,2) DEFAULT '0.00',
  `qty_del` float(8,2) DEFAULT '0.00',
  `qty_own` float(8,2) DEFAULT '0.00',
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `barang_lokasis_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `barang_lokasis_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `barang_lokasis_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `barang_lokasis_createdby_foreign` (`createdby`) USING BTREE,
  KEY `barang_lokasis_ro_id_foreign` (`terimabrg_id`) USING BTREE,
  KEY `barang_lokasis_trx_fb_foreign` (`trx_fb`) USING BTREE,
  KEY `barang_lokasis_trx_fj_foreign` (`trx_fj`) USING BTREE,
  KEY `barang_lokasis_trx_adj_foreign` (`sesuai_item_id`) USING BTREE,
  KEY `barang_lokasis_pindah_items_idx_foreign` (`pindah_id`) USING BTREE,
  KEY `barang_lokasis_hapus_items_idx_foreign` (`hpb_id`) USING BTREE,
  KEY `barang_lokasis_trx_inv_foreign` (`trx_inv`) USING BTREE,
  CONSTRAINT `barang_lokasis_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_hapus_persediaan_items_idx_foreign` FOREIGN KEY (`hpb_id`) REFERENCES `keu_hapus_persediaan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_pindah_items_idx_foreign` FOREIGN KEY (`pindah_id`) REFERENCES `keu_pindah_persediaan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_ro_id_foreign` FOREIGN KEY (`terimabrg_id`) REFERENCES `log_terima_barang_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_trx_adj_foreign` FOREIGN KEY (`sesuai_item_id`) REFERENCES `keu_jurnal_penyesuaian_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_trx_fb_foreign` FOREIGN KEY (`trx_fb`) REFERENCES `keu_faktur_pembelian_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_trx_fj_foreign` FOREIGN KEY (`trx_fj`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `barang_lokasis_trx_inv_foreign` FOREIGN KEY (`trx_inv`) REFERENCES `ord_pelanggan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of barang_lokasis
-- ----------------------------
BEGIN;
INSERT INTO `barang_lokasis` VALUES (1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 1, 763, 1, 15.00, 0.00, 0.00, 0.00, 1, '2022-10-10 21:14:39', '2022-10-10 21:14:39');
INSERT INTO `barang_lokasis` VALUES (3, 3, NULL, NULL, NULL, NULL, NULL, NULL, 1, 708, 1, 20.00, 0.00, 0.00, 0.00, 1, '2022-10-19 09:28:47', '2022-10-19 09:28:47');
INSERT INTO `barang_lokasis` VALUES (8, NULL, 3, NULL, NULL, NULL, NULL, NULL, 1, 708, 1, 0.00, 0.00, 10.00, 0.00, 1, '2022-10-19 11:17:22', '2022-10-19 11:17:22');
INSERT INTO `barang_lokasis` VALUES (9, NULL, 4, NULL, NULL, NULL, NULL, NULL, 1, 708, 1, 0.00, 0.00, 15.00, 0.00, 1, '2022-10-19 11:56:49', '2022-10-19 11:56:49');
INSERT INTO `barang_lokasis` VALUES (10, NULL, NULL, NULL, NULL, NULL, 1, NULL, 1, 763, 1, -5.00, 0.00, 0.00, 0.00, 1, '2022-10-20 09:35:49', '2022-10-20 09:35:49');
INSERT INTO `barang_lokasis` VALUES (11, NULL, NULL, NULL, NULL, NULL, 1, NULL, 1, 763, 2, 5.00, 0.00, 0.00, 0.00, 1, '2022-10-20 09:35:49', '2022-10-20 09:35:49');
INSERT INTO `barang_lokasis` VALUES (12, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 763, 2, -3.00, 0.00, 0.00, 0.00, 1, '2022-10-20 10:05:45', '2022-10-20 10:05:45');
INSERT INTO `barang_lokasis` VALUES (13, 6, NULL, NULL, NULL, NULL, NULL, NULL, 1, 715, 2, 20.00, 0.00, 0.00, 0.00, 1, '2022-10-20 10:11:52', '2022-10-20 10:11:52');
COMMIT;

-- ----------------------------
-- Table structure for barang_qualities
-- ----------------------------
DROP TABLE IF EXISTS `barang_qualities`;
CREATE TABLE `barang_qualities` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `kode` varchar(3) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of barang_qualities
-- ----------------------------
BEGIN;
INSERT INTO `barang_qualities` VALUES (1, '01', 'ORI', 'Y');
INSERT INTO `barang_qualities` VALUES (2, '02', 'KW', 'Y');
INSERT INTO `barang_qualities` VALUES (3, '03', 'NTN', 'Y');
COMMIT;

-- ----------------------------
-- Table structure for barang_racks
-- ----------------------------
DROP TABLE IF EXISTS `barang_racks`;
CREATE TABLE `barang_racks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `rack_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `pivot_barang_idx` (`barang_id`) USING BTREE,
  KEY `pivot_rack_idx` (`rack_id`) USING BTREE,
  CONSTRAINT `pivot_barang_idx` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pivot_rack_idx` FOREIGN KEY (`rack_id`) REFERENCES `mas_racks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of barang_racks
-- ----------------------------
BEGIN;
INSERT INTO `barang_racks` VALUES (1, NULL, 1, NULL, NULL);
INSERT INTO `barang_racks` VALUES (2, NULL, 1, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for barang_subcategories
-- ----------------------------
DROP TABLE IF EXISTS `barang_subcategories`;
CREATE TABLE `barang_subcategories` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `kategori_id` int(10) DEFAULT NULL,
  `kode` varchar(3) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT '',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `barang_subkategori_kategori_idx` (`kategori_id`) USING BTREE,
  CONSTRAINT `barang_subkategori_kategori_idx` FOREIGN KEY (`kategori_id`) REFERENCES `barang_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of barang_subcategories
-- ----------------------------
BEGIN;
INSERT INTO `barang_subcategories` VALUES (4, 1, '11', 'Engine', 'Format kode <1><prefix urut data>', 'Y', '2022-04-06 14:27:04', '2022-04-06 14:36:48');
INSERT INTO `barang_subcategories` VALUES (5, 1, '12', 'Carburator', NULL, 'Y', '2022-04-06 14:27:16', '2022-04-06 14:32:28');
INSERT INTO `barang_subcategories` VALUES (6, 1, '13', 'Cylinder Crankcase', NULL, 'Y', '2022-04-06 14:27:29', '2022-04-06 14:32:37');
INSERT INTO `barang_subcategories` VALUES (7, 1, '14', 'Crankshaft', NULL, 'Y', '2022-04-06 14:31:49', '2022-04-06 14:32:44');
INSERT INTO `barang_subcategories` VALUES (8, 2, '21', 'Generator', 'Format kode <2><prefix urut data>', 'Y', '2022-04-06 14:33:15', '2022-04-06 14:37:04');
INSERT INTO `barang_subcategories` VALUES (9, 2, '22', 'Cable body', NULL, 'Y', '2022-04-06 14:33:36', '2022-04-06 14:33:36');
INSERT INTO `barang_subcategories` VALUES (10, 3, '31', 'Brackets', 'Format kode <3><prefix urut data>', 'Y', '2022-04-06 14:34:08', '2022-04-06 14:37:16');
INSERT INTO `barang_subcategories` VALUES (11, 4, '41', 'Driveshafts', NULL, 'Y', '2022-04-06 14:34:37', '2022-04-06 14:34:37');
INSERT INTO `barang_subcategories` VALUES (12, 5, '51', 'Fuel Tank', 'Format kode <5><prefix urut data>', 'Y', '2022-04-06 14:34:59', '2022-04-06 14:37:25');
INSERT INTO `barang_subcategories` VALUES (13, 1, '15', 'Intake', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (14, 1, '16', 'Fuel', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (15, 4, '42', 'Gearbox', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (16, 4, '43', 'Water Pumps', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (17, 1, '17', 'Piston', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (18, 4, '44', 'DRIVESHAFTS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (19, 3, '32', 'Power Trim', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (20, 4, '45', 'PROPELLER', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (21, 4, '46', 'PROPELLER SHAFTS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (22, 3, '33', 'MOUNT DAMPERS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (23, 2, '23', 'STARTING MOTOR', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (24, 5, '52', 'REMOTE CONTROL', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (25, 2, '24', 'CDI', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (26, 2, '25', 'COILS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (27, 5, '53', 'COVERS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (28, 5, '54', 'STEERING', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (29, 5, '55', 'CABLE REMOTE CONTROL', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (30, 2, '26', 'PULSER', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (31, 4, '47', 'TRIM TABS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (32, 2, '26', 'RELAYS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (33, 3, '34', 'ANODES', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (34, 5, '56', 'RIGGINGS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (35, 5, '57', 'LIGHTING', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (36, 5, '58', 'PANELS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (37, 5, '59', 'PUMPS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (38, 5, '50', 'HORNS', '', 'Y', NULL, NULL);
INSERT INTO `barang_subcategories` VALUES (39, 5, '51', 'STICKERS', '', 'Y', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for bisnis_units
-- ----------------------------
DROP TABLE IF EXISTS `bisnis_units`;
CREATE TABLE `bisnis_units` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `initial` varchar(4) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(254) DEFAULT NULL,
  `phone` varchar(25) DEFAULT NULL,
  `alamat` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of bisnis_units
-- ----------------------------
BEGIN;
INSERT INTO `bisnis_units` VALUES (1, 'MRT', 'CV. Makkuraga Tama', 'offices@makkuragatama.com', '08123456789', 'makassar', '2022-02-18 12:03:36', '2022-02-18 12:03:36');
COMMIT;

-- ----------------------------
-- Table structure for def_coas
-- ----------------------------
DROP TABLE IF EXISTS `def_coas`;
CREATE TABLE `def_coas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(255) DEFAULT NULL,
  `tipe` enum('d','k') DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `def_coas_coa_idx` (`coa_id`) USING BTREE,
  CONSTRAINT `def_coas_coa_idx` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of def_coas
-- ----------------------------
BEGIN;
INSERT INTO `def_coas` VALUES (1, 'invoicing-hpp', 'd', 51001, 'Hpp Barang / Sparepart', '2021-12-09 23:54:03', '2021-12-09 23:54:07');
INSERT INTO `def_coas` VALUES (2, 'invoicing-hpp', 'k', 11001, 'Persedian Barang', '2021-12-09 23:54:03', '2021-12-09 23:54:03');
INSERT INTO `def_coas` VALUES (3, 'invoicing-pajak', 'k', 21006, 'PPN Keluaran', '2021-12-09 23:54:03', '2021-12-09 23:54:03');
INSERT INTO `def_coas` VALUES (4, 'invoicing-discount-barang', 'd', 40006, 'Discount Penjualan Barang', '2021-12-09 23:54:03', '2021-12-09 23:54:03');
INSERT INTO `def_coas` VALUES (6, 'invoicing-jasa', 'k', 40002, 'Pendapatan Jasa Service', '2021-12-09 23:54:03', '2021-12-09 23:54:07');
INSERT INTO `def_coas` VALUES (7, 'invoicing-piutang', 'd', 11005, 'Piutang Dagang', '2021-12-09 23:54:03', '2021-12-09 23:54:03');
INSERT INTO `def_coas` VALUES (8, 'invoicing-barang', 'k', 40001, 'Penjualan Barang Dagang', '2021-12-09 23:54:03', '2021-12-09 23:54:03');
INSERT INTO `def_coas` VALUES (9, 'paid-invoice', 'k', 11005, 'Piutang Dagang', '2021-12-09 23:54:03', '2021-12-09 23:54:03');
INSERT INTO `def_coas` VALUES (10, 'invoicing-discount-jasa', 'd', 40007, 'Discount Penjualan Jasa', '2021-12-09 23:54:03', '2021-12-09 23:54:03');
INSERT INTO `def_coas` VALUES (11, 'visible-entri-jurnal-pemasok', NULL, 21005, 'Hutang Dagang Pemasok', NULL, NULL);
INSERT INTO `def_coas` VALUES (12, 'visible-entri-jurnal-pelanggan', NULL, 11005, 'Piutang Dagang Pelanggan', NULL, NULL);
INSERT INTO `def_coas` VALUES (13, 'visible-entri-jurnal-persediaan', NULL, 11001, 'Persediaan Barang', NULL, NULL);
INSERT INTO `def_coas` VALUES (14, 'visible-entri-jurnal-kas', NULL, 11201, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (15, 'visible-entri-jurnal-kas', NULL, 11202, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (16, 'visible-entri-jurnal-kas', NULL, 11207, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (17, 'visible-entri-jurnal-kas', NULL, 11208, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (18, 'visible-entri-jurnal-bank', NULL, 11101, 'Bank', NULL, NULL);
INSERT INTO `def_coas` VALUES (19, 'visible-entri-jurnal-bank', NULL, 11102, 'Bank', NULL, NULL);
INSERT INTO `def_coas` VALUES (20, 'entri-jurnal', NULL, 11201, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (21, 'entri-jurnal', NULL, 11202, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (22, 'entri-jurnal', NULL, 11207, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (23, 'entri-jurnal', NULL, 11208, 'Kas', NULL, NULL);
INSERT INTO `def_coas` VALUES (24, 'entri-jurnal', NULL, 11101, 'Bank', NULL, NULL);
INSERT INTO `def_coas` VALUES (25, 'entri-jurnal', NULL, 11102, 'Bank', NULL, NULL);
INSERT INTO `def_coas` VALUES (26, 'entri-jurnal', NULL, 11005, 'Piutang Dagang', NULL, NULL);
INSERT INTO `def_coas` VALUES (27, 'entri-jurnal', NULL, 21005, 'Hutang Dagang', NULL, NULL);
INSERT INTO `def_coas` VALUES (28, 'entri-jurnal', NULL, 11001, 'Persediaan', NULL, NULL);
INSERT INTO `def_coas` VALUES (29, 'faktur-pembelian', 'k', 21005, 'Hutang Dagang', NULL, NULL);
INSERT INTO `def_coas` VALUES (30, 'faktur-pembelian-discount-barang', 'd', 51002, 'Discount Faktur Pembalian', NULL, NULL);
INSERT INTO `def_coas` VALUES (31, 'faktur-pembelian-pajak', 'd', 11004, 'PPN Faktur Pembelian', NULL, NULL);
INSERT INTO `def_coas` VALUES (32, 'pembayaran-keuangan', NULL, 21005, 'components.select-faktur-pemasok', NULL, NULL);
INSERT INTO `def_coas` VALUES (33, 'pembayaran-keuangan', NULL, 11005, 'components.select-faktur-pelanggan', NULL, NULL);
INSERT INTO `def_coas` VALUES (34, 'pembayaran-keuangan', NULL, 11001, 'components.select-barang-gudang', NULL, NULL);
INSERT INTO `def_coas` VALUES (35, 'penerimaan-keuangan', NULL, 21005, 'components.select-faktur-pemasok', NULL, NULL);
INSERT INTO `def_coas` VALUES (36, 'penerimaan-keuangan', NULL, 11005, 'components.select-faktur-pelanggan', NULL, NULL);
INSERT INTO `def_coas` VALUES (37, 'penerimaan-keuangan', NULL, 40001, 'components.select-barang-gudang', NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for harga_belis
-- ----------------------------
DROP TABLE IF EXISTS `harga_belis`;
CREATE TABLE `harga_belis` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `fakturbeli_item` int(10) unsigned DEFAULT NULL,
  `periode` varchar(20) DEFAULT NULL,
  `narasi` varchar(255) DEFAULT '',
  `harga_beli` float(20,2) DEFAULT '0.00',
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `harga_belis_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `harga_belis_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `harga_belis_user_idx_foreign` (`created_by`) USING BTREE,
  KEY `harga_belis_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `harga_belis_fakturbeli_item_foreign` (`fakturbeli_item`) USING BTREE,
  CONSTRAINT `harga_belis_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `harga_belis_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `harga_belis_fakturbeli_item_foreign` FOREIGN KEY (`fakturbeli_item`) REFERENCES `keu_faktur_pembelian_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `harga_belis_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `harga_belis_user_idx_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of harga_belis
-- ----------------------------
BEGIN;
INSERT INTO `harga_belis` VALUES (55, 763, 1, 1, 1, '2022-10', 'TESTINGZUL05', 20000.00, 1, '2022-10-10 21:08:01', '2022-10-10 21:08:01');
INSERT INTO `harga_belis` VALUES (56, 708, 1, 2, 2, '2022-10', 'TESTING ZUL 07', 50000.00, 1, '2022-10-19 09:35:11', '2022-10-19 09:35:11');
INSERT INTO `harga_belis` VALUES (57, 715, 1, 2, 3, '2022-10', 'TESTINGZUL08', 30000.00, 1, '2022-10-20 10:10:53', '2022-10-20 10:10:53');
COMMIT;

-- ----------------------------
-- Table structure for harga_juals
-- ----------------------------
DROP TABLE IF EXISTS `harga_juals`;
CREATE TABLE `harga_juals` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `trx_fj` int(10) unsigned DEFAULT NULL,
  `periode` varchar(20) DEFAULT NULL,
  `narasi` varchar(255) DEFAULT '',
  `harga_jual` float(20,2) DEFAULT '0.00',
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `harga_juals_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `harga_juals_trx_fj_foreign` (`trx_fj`) USING BTREE,
  KEY `harga_juals_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `harga_juals_user_idx_foreign` (`created_by`) USING BTREE,
  KEY `harga_juals_cabang_id_foreign` (`cabang_id`) USING BTREE,
  CONSTRAINT `harga_juals_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `harga_juals_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `harga_juals_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `harga_juals_trx_fj_foreign` FOREIGN KEY (`trx_fj`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `harga_juals_user_idx_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of harga_juals
-- ----------------------------
BEGIN;
INSERT INTO `harga_juals` VALUES (7, 708, 1, 2, NULL, '2022-08', NULL, 11000.00, 1, '2022-08-27 01:46:44', '2022-08-27 01:46:44');
INSERT INTO `harga_juals` VALUES (8, 763, 1, 2, NULL, '2022-09', NULL, 120000.00, 1, '2022-09-21 14:22:56', '2022-09-21 14:22:56');
INSERT INTO `harga_juals` VALUES (9, 89, 1, 2, NULL, '2022-09', NULL, 130000.00, 1, '2022-09-21 14:25:32', '2022-09-21 14:25:32');
INSERT INTO `harga_juals` VALUES (10, 763, 1, 1, NULL, '2022-09', NULL, 130000.00, 1, '2022-09-21 14:29:58', '2022-09-21 14:29:58');
INSERT INTO `harga_juals` VALUES (11, 708, 1, 1, NULL, '2022-10', NULL, 110000.00, 1, '2022-10-19 11:50:40', '2022-10-19 11:50:40');
INSERT INTO `harga_juals` VALUES (12, 708, 1, 1, NULL, '2022-10', NULL, 110000.00, 1, '2022-10-19 12:00:46', '2022-10-19 12:00:46');
COMMIT;

-- ----------------------------
-- Table structure for keu_banks
-- ----------------------------
DROP TABLE IF EXISTS `keu_banks`;
CREATE TABLE `keu_banks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdby` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `initial` varchar(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `rekening` varchar(50) NOT NULL,
  `saldo_net` float(20,2) DEFAULT '0.00',
  `setor_tunda` float(20,2) DEFAULT '0.00',
  `tarik_tunda` float(20,2) DEFAULT '0.00',
  `saldo_rill` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_banks_createdby_foreign` (`createdby`) USING BTREE,
  KEY `mas_banks_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `mas_banks_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `mas_banks_kode_foreign` (`kode`) USING BTREE,
  CONSTRAINT `mas_banks_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mas_banks_coa_id_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_banks_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_banks_kode_foreign` FOREIGN KEY (`kode`) REFERENCES `acc_coas` (`kode`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11103 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_banks
-- ----------------------------
BEGIN;
INSERT INTO `keu_banks` VALUES (11101, 1, 11101, 1, '11101', 'MKS-BCA', 'Bank BCA Makassar', '123123321', 85200000.00, 0.00, 1387500.00, 0.00, 'Y', '2022-06-08 16:13:48', '2022-08-26 18:11:06');
INSERT INTO `keu_banks` VALUES (11102, 1, 11102, 1, '11102', 'MKS-BRI', 'Bank BRI', '800081111111111', 0.00, 0.00, 0.00, 0.00, 'Y', '2022-07-05 09:19:00', '2022-08-28 19:15:59');
COMMIT;

-- ----------------------------
-- Table structure for keu_faktur_pemasok
-- ----------------------------
DROP TABLE IF EXISTS `keu_faktur_pemasok`;
CREATE TABLE `keu_faktur_pemasok` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `total` float(20,2) DEFAULT '0.00',
  `sisa` float(20,2) DEFAULT '0.00',
  `status` enum('bersisa','lunas') DEFAULT 'bersisa',
  `date_faktur` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_belis_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_faktur_belis_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_faktur_belis_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_faktur_belis_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `keu_faktur_pemasok_ibfk_2` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pemasok_ibfk_3` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pemasok_ibfk_4` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pemasok_ibfk_5` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_faktur_pemasok
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_faktur_pembelian_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_faktur_pembelian_attach`;
CREATE TABLE `keu_faktur_pembelian_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `fakturbeli_id` int(10) unsigned DEFAULT NULL,
  `filetype` enum('jpg','jpeg','png','bmp','pdf','xls','xlsx','doc','docx') DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_transfer_kasbanks_transfer_idx` (`fakturbeli_id`) USING BTREE,
  CONSTRAINT `keu_faktur_pembelian_attach_ibfk_1` FOREIGN KEY (`fakturbeli_id`) REFERENCES `keu_faktur_pembelians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_faktur_pembelian_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_faktur_pembelian_items
-- ----------------------------
DROP TABLE IF EXISTS `keu_faktur_pembelian_items`;
CREATE TABLE `keu_faktur_pembelian_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fakturbeli_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `qty` float(8,2) DEFAULT '0.00',
  `stn` varchar(255) DEFAULT NULL,
  `harga_stn` float(20,2) DEFAULT '0.00',
  `type_discount` enum('persen','rupiah') DEFAULT 'persen',
  `discount` float(20,2) DEFAULT '0.00',
  `subtotal` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_belis_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_faktur_belis_items_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `trx_faktur_belis_items_fakturbeli_id_foreign` (`fakturbeli_id`) USING BTREE,
  CONSTRAINT `keu_faktur_pembelian_items_ibfk_1` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pembelian_items_ibfk_2` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pembelian_items_ibfk_4` FOREIGN KEY (`fakturbeli_id`) REFERENCES `keu_faktur_pembelians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_faktur_pembelian_items
-- ----------------------------
BEGIN;
INSERT INTO `keu_faktur_pembelian_items` VALUES (1, 1, 763, 11001, 15.00, 'pcs', 20000.00, 'rupiah', 0.00, 300000.00, 'Y', '2022-10-10 21:08:01', '2022-10-10 21:08:01');
INSERT INTO `keu_faktur_pembelian_items` VALUES (2, 2, 708, 11001, 25.00, 'pcs', 50000.00, 'rupiah', 0.00, 1250000.00, 'Y', '2022-10-19 09:35:10', '2022-10-19 09:35:10');
INSERT INTO `keu_faktur_pembelian_items` VALUES (3, 3, 715, 11001, 20.00, 'pcs', 30000.00, 'rupiah', 0.00, 600000.00, 'Y', '2022-10-20 10:10:53', '2022-10-20 10:10:53');
COMMIT;

-- ----------------------------
-- Table structure for keu_faktur_pembelians
-- ----------------------------
DROP TABLE IF EXISTS `keu_faktur_pembelians`;
CREATE TABLE `keu_faktur_pembelians` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `reff_order` int(10) unsigned DEFAULT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `total` float(20,2) DEFAULT '0.00',
  `ppn` float(3,1) DEFAULT '11.0',
  `ppn_rp` float(20,2) DEFAULT '0.00',
  `grandtot` float(20,2) DEFAULT '0.00',
  `sisa` float(20,2) DEFAULT '0.00',
  `sts_paid` enum('bersisa','lunas') DEFAULT 'bersisa',
  `date_faktur` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_belis_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_faktur_belis_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_faktur_belis_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_faktur_belis_createdby_foreign` (`createdby`) USING BTREE,
  KEY `keu_faktur_pembelians_ibfk_6` (`reff_order`) USING BTREE,
  CONSTRAINT `keu_faktur_pembelians_ibfk_2` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pembelians_ibfk_3` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pembelians_ibfk_4` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pembelians_ibfk_5` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_faktur_pembelians_ibfk_6` FOREIGN KEY (`reff_order`) REFERENCES `keu_request_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_faktur_pembelians
-- ----------------------------
BEGIN;
INSERT INTO `keu_faktur_pembelians` VALUES (1, 1, 1, 1, 1, 'TESTINGZUL05', 300000.00, 0.0, 0.00, 300000.00, 100000.00, 'bersisa', '2022-10-10', '2022-10-15', 1, 'Y', '2022-10-10 21:08:01', '2022-10-10 21:25:38');
INSERT INTO `keu_faktur_pembelians` VALUES (2, 1, 1, 2, 3, 'TESTING ZUL 07', 1250000.00, 11.0, 137500.00, 1387500.00, 0.00, 'lunas', '2022-10-19', '2022-10-19', 1, 'Y', '2022-10-19 09:35:04', '2022-10-20 10:07:10');
INSERT INTO `keu_faktur_pembelians` VALUES (3, 1, 1, 2, 4, 'TESTINGZUL08', 600000.00, 11.0, 66000.00, 666000.00, 666000.00, 'bersisa', '2022-10-20', '2022-10-20', 1, 'Y', '2022-10-20 10:10:52', '2022-10-20 10:10:52');
COMMIT;

-- ----------------------------
-- Table structure for keu_hapus_persediaan
-- ----------------------------
DROP TABLE IF EXISTS `keu_hapus_persediaan`;
CREATE TABLE `keu_hapus_persediaan` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_date` date DEFAULT NULL,
  `reff` varchar(255) DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `isStok` enum('Y','N') DEFAULT 'N',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_hapus_persediaan_cabang_idx_foreign` (`cabang_id`) USING BTREE,
  KEY `keu_hapus_persediaan_gudang_idx_foreign` (`gudang_id`) USING BTREE,
  KEY `keu_hapus_persediaan_coa_idx_foreign` (`coa_id`) USING BTREE,
  KEY `keu_hapus_persediaan_user_idx_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `keu_hapus_persediaan_cabang_idx_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_hapus_persediaan_coa_idx_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_hapus_persediaan_gudang_idx_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_hapus_persediaan_user_idx_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_hapus_persediaan
-- ----------------------------
BEGIN;
INSERT INTO `keu_hapus_persediaan` VALUES (1, '2022-10-20', 'REM-BRG221020-1', 1, 2, 51001, 'TESTING ZUL 07', 1, 'Y', 'Y', '2022-10-20 10:05:45', '2022-10-20 10:05:45');
COMMIT;

-- ----------------------------
-- Table structure for keu_hapus_persediaan_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_hapus_persediaan_attach`;
CREATE TABLE `keu_hapus_persediaan_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `hapus_id` int(10) DEFAULT NULL,
  `filetype` enum('jpg','jpeg','png','bmp','pdf','xls','xlsx','doc','docx') DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_hapus_persediaan_attach_hapus_idx_foreign` (`hapus_id`) USING BTREE,
  CONSTRAINT `keu_hapus_persediaan_attach_hapus_idx_foreign` FOREIGN KEY (`hapus_id`) REFERENCES `keu_hapus_persediaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_hapus_persediaan_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_hapus_persediaan_items
-- ----------------------------
DROP TABLE IF EXISTS `keu_hapus_persediaan_items`;
CREATE TABLE `keu_hapus_persediaan_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `hapus_id` int(10) DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `qty` float(8,2) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_hapus_persediaan_items_hapus_idx_foreign` (`hapus_id`) USING BTREE,
  KEY `keu_hapus_persediaan_items_gudang_idx_foreign` (`gudang_id`) USING BTREE,
  KEY `keu_hapus_persediaan_items_barang_idx_foreign` (`barang_id`) USING BTREE,
  CONSTRAINT `keu_hapus_persediaan_items_barang_idx_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_hapus_persediaan_items_gudang_idx_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_hapus_persediaan_items_hapus_idx_foreign` FOREIGN KEY (`hapus_id`) REFERENCES `keu_hapus_persediaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_hapus_persediaan_items
-- ----------------------------
BEGIN;
INSERT INTO `keu_hapus_persediaan_items` VALUES (1, 1, 2, 763, 3.00, 'Y', '2022-10-20 10:05:45', '2022-10-20 10:05:45');
COMMIT;

-- ----------------------------
-- Table structure for keu_jurnal_penyesuaian
-- ----------------------------
DROP TABLE IF EXISTS `keu_jurnal_penyesuaian`;
CREATE TABLE `keu_jurnal_penyesuaian` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `trx_date` date NOT NULL,
  `reff` varchar(100) DEFAULT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `debit` float(20,2) DEFAULT '0.00',
  `kredit` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `author` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_jurnal_adjusts_author_foreign` (`author`) USING BTREE,
  KEY `keu_jurnal_penyesuaian_ibfk_2` (`cabang_id`) USING BTREE,
  CONSTRAINT `keu_jurnal_penyesuaian_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_ibfk_2` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_jurnal_penyesuaian
-- ----------------------------
BEGIN;
INSERT INTO `keu_jurnal_penyesuaian` VALUES (1, 1, '2022-10-19', 'JP221019-1', 'TESTING ZUL 07', 550000.00, 550000.00, 'N', 1, '2022-10-19 19:11:43', '2022-10-19 19:12:58');
INSERT INTO `keu_jurnal_penyesuaian` VALUES (2, 1, '2022-10-19', 'JP221019-2', 'TESTING ZUL 07', 500000.00, 500000.00, 'N', 1, '2022-10-19 19:12:57', '2022-10-19 19:13:07');
INSERT INTO `keu_jurnal_penyesuaian` VALUES (3, 1, '2022-10-19', 'JP221019-2', 'TESTING ZUL 07', 500000.00, 500000.00, 'Y', 1, '2022-10-19 19:12:59', '2022-10-19 19:12:59');
COMMIT;

-- ----------------------------
-- Table structure for keu_jurnal_penyesuaian_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_jurnal_penyesuaian_attach`;
CREATE TABLE `keu_jurnal_penyesuaian_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `sesuai_id` int(10) unsigned DEFAULT NULL,
  `filetype` enum('jpg','jpeg','png','bmp','pdf','xls','xlsx','doc','docx') DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_transfer_kasbanks_transfer_idx` (`sesuai_id`) USING BTREE,
  CONSTRAINT `keu_jurnal_penyesuaian_attach_ibfk_1` FOREIGN KEY (`sesuai_id`) REFERENCES `keu_jurnal_penyesuaian` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_jurnal_penyesuaian_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_jurnal_penyesuaian_items
-- ----------------------------
DROP TABLE IF EXISTS `keu_jurnal_penyesuaian_items`;
CREATE TABLE `keu_jurnal_penyesuaian_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `sesuai_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `faktur_id` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `order_id` int(10) DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `sync_stok` enum('Y','N') DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(50) DEFAULT NULL,
  `qty` float(10,2) DEFAULT '0.00',
  `narasi` varchar(200) DEFAULT '',
  `d` float(20,2) DEFAULT '0.00',
  `k` float(20,2) DEFAULT '0.00',
  `status` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_jurnal_adjust_items_trx_adjust_foreign` (`sesuai_id`) USING BTREE,
  KEY `keu_jurnal_adjust_items_trx_jual_foreign` (`order_id`) USING BTREE,
  KEY `keu_jurnal_adjust_items_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `keu_jurnal_adjust_items_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `keu_jurnal_adjust_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `keu_jurnal_adjust_items_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `keu_jurnal_penyesuaian_items_ibfk_9` (`pemasok_id`) USING BTREE,
  KEY `keu_jurnal_penyesuaian_items_ibfk_10` (`pelanggan_id`) USING BTREE,
  KEY `keu_jurnal_penyesuaian_items_ibfk_11` (`faktur_id`) USING BTREE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_1` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_10` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_11` FOREIGN KEY (`faktur_id`) REFERENCES `keu_faktur_pembelians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_2` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_3` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_4` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_7` FOREIGN KEY (`sesuai_id`) REFERENCES `keu_jurnal_penyesuaian` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_8` FOREIGN KEY (`order_id`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_jurnal_penyesuaian_items_ibfk_9` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_jurnal_penyesuaian_items
-- ----------------------------
BEGIN;
INSERT INTO `keu_jurnal_penyesuaian_items` VALUES (1, 1, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 12001, 'JP221019-1', NULL, 'TESTING ZUL 07', 550000.00, 0.00, 'Tidak Sesuai', 'N', '2022-10-19 19:11:43', '2022-10-19 19:12:57');
INSERT INTO `keu_jurnal_penyesuaian_items` VALUES (2, 1, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 30001, 'JP221019-1', NULL, 'TESTING ZUL 07', 0.00, 550000.00, 'Tidak Sesuai', 'N', '2022-10-19 19:11:43', '2022-10-19 19:12:57');
INSERT INTO `keu_jurnal_penyesuaian_items` VALUES (3, 2, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 12001, 'JP221019-2', NULL, 'TESTING ZUL 07', 500000.00, 0.00, 'Tidak Sesuai', 'N', '2022-10-19 19:12:57', '2022-10-19 19:13:08');
INSERT INTO `keu_jurnal_penyesuaian_items` VALUES (4, 2, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 30001, 'JP221019-2', NULL, 'TESTING ZUL 07', 0.00, 500000.00, 'Tidak Sesuai', 'N', '2022-10-19 19:12:57', '2022-10-19 19:13:08');
INSERT INTO `keu_jurnal_penyesuaian_items` VALUES (5, 3, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 12001, 'JP221019-2', NULL, 'TESTING ZUL 07', 500000.00, 0.00, 'Tidak Sesuai', 'Y', '2022-10-19 19:12:59', '2022-10-19 19:12:59');
INSERT INTO `keu_jurnal_penyesuaian_items` VALUES (6, 3, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 30001, 'JP221019-2', NULL, 'TESTING ZUL 07', 0.00, 500000.00, 'Tidak Sesuai', 'Y', '2022-10-19 19:12:59', '2022-10-19 19:12:59');
COMMIT;

-- ----------------------------
-- Table structure for keu_kas
-- ----------------------------
DROP TABLE IF EXISTS `keu_kas`;
CREATE TABLE `keu_kas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdby` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `saldo_rill` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_kas_createdby_foreign` (`createdby`) USING BTREE,
  KEY `mas_kas_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `mas_kas_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `mas_kas_kode_foreign` (`kode`) USING BTREE,
  CONSTRAINT `mas_kas_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mas_kas_coa_id_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_kas_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_kas_kode_foreign` FOREIGN KEY (`kode`) REFERENCES `acc_coas` (`kode`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11203 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_kas
-- ----------------------------
BEGIN;
INSERT INTO `keu_kas` VALUES (11201, 1, 11201, 1, '11201', 'Kas Besar Makassar', 20000000.00, 'Y', '2022-06-08 16:23:56', '2022-09-22 11:53:20');
INSERT INTO `keu_kas` VALUES (11202, 1, 11202, 1, '11202', 'MKS Kas Kecil', 0.00, 'Y', '2022-06-18 10:50:40', '2022-06-18 10:50:40');
COMMIT;

-- ----------------------------
-- Table structure for keu_pembayaran_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_pembayaran_attach`;
CREATE TABLE `keu_pembayaran_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `keubayar_id` int(10) unsigned DEFAULT NULL,
  `filetype` varchar(10) DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_pembayaran_keubayar_id_foreign` (`keubayar_id`) USING BTREE,
  CONSTRAINT `keu_pembayaran_keubayar_id_foreign` FOREIGN KEY (`keubayar_id`) REFERENCES `keu_pembayarans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_pembayaran_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_pembayaran_items
-- ----------------------------
DROP TABLE IF EXISTS `keu_pembayaran_items`;
CREATE TABLE `keu_pembayaran_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `keubayar_id` int(10) unsigned DEFAULT NULL,
  `trx_beli` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `coa_debit` int(10) unsigned DEFAULT NULL,
  `coa_kode` varchar(255) DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `narasi` varchar(200) DEFAULT '',
  `qty` float(10,2) DEFAULT '0.00',
  `harga_stn` float(20,2) DEFAULT '0.00',
  `harga_total` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_pembayaran_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `keu_pembayaran_items_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `keu_pembayaran_items_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `keu_pembayaran_items_coa_debit_foreign` (`coa_debit`) USING BTREE,
  KEY `keu_pembayaran_items_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `keu_pembayaran_items_pelanggan_id_foreign` (`pelanggan_id`) USING BTREE,
  KEY `keu_pembayaran_items_trx_jual_id_foreign` (`trx_jual`) USING BTREE,
  KEY `keu_pembayaran_items_paid_id_foreign` (`keubayar_id`) USING BTREE,
  KEY `keu_pembayaran_items_trx_beli_id_foreign` (`trx_beli`) USING BTREE,
  CONSTRAINT `keu_pembayaran_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_coa_debit_foreign` FOREIGN KEY (`coa_debit`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_paid_id_foreign` FOREIGN KEY (`keubayar_id`) REFERENCES `keu_pembayarans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_pelanggan_id_foreign` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_trx_beli_id_foreign` FOREIGN KEY (`trx_beli`) REFERENCES `keu_faktur_pembelians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayaran_items_trx_jual_id_foreign` FOREIGN KEY (`trx_jual`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_pembayaran_items
-- ----------------------------
BEGIN;
INSERT INTO `keu_pembayaran_items` VALUES (1, 1, 1, NULL, NULL, NULL, 1, 21005, NULL, 1, NULL, '', 1.00, 200000.00, 200000.00, 'Y', '2022-10-10 21:25:38', '2022-10-10 21:25:38');
INSERT INTO `keu_pembayaran_items` VALUES (2, 2, 2, NULL, NULL, NULL, 1, 21005, NULL, 1, NULL, '', 1.00, 1387500.00, 1387500.00, 'Y', '2022-10-19 10:11:30', '2022-10-19 10:11:30');
COMMIT;

-- ----------------------------
-- Table structure for keu_pembayarans
-- ----------------------------
DROP TABLE IF EXISTS `keu_pembayarans`;
CREATE TABLE `keu_pembayarans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `coa_kredit` int(10) unsigned DEFAULT NULL,
  `reff` varchar(255) DEFAULT NULL,
  `trx_date` date NOT NULL,
  `delay_trx` date DEFAULT NULL,
  `is_delay` enum('Y','N') DEFAULT 'N',
  `penerima` varchar(50) DEFAULT NULL,
  `paidby` enum('other','pelanggan','pemasok') DEFAULT NULL,
  `narasi` varchar(200) DEFAULT 'tanpa keterangan',
  `total` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_pembayarans_author_foreign` (`author`) USING BTREE,
  KEY `keu_pembayarans_coa_kredit_foreign` (`coa_kredit`) USING BTREE,
  KEY `keu_pembayarans_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `keu_pembayarans_pelanggan_id_foreign` (`pelanggan_id`) USING BTREE,
  KEY `keu_pembayarans_cabang_id_foreign` (`cabang_id`) USING BTREE,
  CONSTRAINT `keu_pembayarans_author_foreign` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayarans_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayarans_coa_kredit_foreign` FOREIGN KEY (`coa_kredit`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayarans_pelanggan_id_foreign` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_pembayarans_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_pembayarans
-- ----------------------------
BEGIN;
INSERT INTO `keu_pembayarans` VALUES (1, 1, 1, NULL, NULL, 11101, 'TESTINGZUL05', '2022-10-10', NULL, 'N', 'ZUL', 'pemasok', 'PEMBAYARAN HUTANG AYAT INV TESTINGZUL05', 200000.00, 'Y', '2022-10-10 21:25:38', '2022-10-10 21:25:38');
INSERT INTO `keu_pembayarans` VALUES (2, 1, 1, NULL, NULL, 11101, 'TESTING ZUL 07', '2022-10-19', NULL, 'N', 'AYAT', 'pelanggan', 'TESTING ZUL 07', 1387500.00, 'Y', '2022-10-19 10:11:30', '2022-10-19 10:11:30');
COMMIT;

-- ----------------------------
-- Table structure for keu_penerimaan_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_penerimaan_attach`;
CREATE TABLE `keu_penerimaan_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `keuterima_id` int(10) unsigned DEFAULT NULL,
  `filetype` varchar(10) DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_penerimaan_keuterima_id_foreign` (`keuterima_id`) USING BTREE,
  CONSTRAINT `keu_penerimaan_attach_ibfk_1` FOREIGN KEY (`keuterima_id`) REFERENCES `keu_penerimaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_penerimaan_attach
-- ----------------------------
BEGIN;
INSERT INTO `keu_penerimaan_attach` VALUES (1, 1, 'pdf', 455844, '/upload/KEU-BAYAR-20221013120258.pdf', 'N', '2022-10-13 12:02:58', '2022-10-13 12:02:58');
INSERT INTO `keu_penerimaan_attach` VALUES (2, 1, 'pdf', 455844, '/upload/KEU-BAYAR-20221013120316-0.pdf', 'Y', '2022-10-13 12:03:16', '2022-10-13 12:03:16');
INSERT INTO `keu_penerimaan_attach` VALUES (3, 1, 'png', 30076, '/upload/KEU-BAYAR-20221013120316-1.png', 'Y', '2022-10-13 12:03:16', '2022-10-13 12:03:16');
COMMIT;

-- ----------------------------
-- Table structure for keu_penerimaan_items
-- ----------------------------
DROP TABLE IF EXISTS `keu_penerimaan_items`;
CREATE TABLE `keu_penerimaan_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `keuterima_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `trx_beli` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `coa_kredit` int(10) unsigned DEFAULT NULL,
  `description` varchar(200) DEFAULT '',
  `qty` float(8,2) DEFAULT '0.00',
  `harga_stn` float(10,2) DEFAULT NULL,
  `harga_total` float(12,2) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_terima_barang_items_trx_terima_foreign` (`keuterima_id`) USING BTREE,
  KEY `trx_terima_barang_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `keu_penerimaan_items_ibfk_3` (`cabang_id`) USING BTREE,
  KEY `keu_penerimaan_items_ibfk_4` (`gudang_id`) USING BTREE,
  KEY `keu_penerimaan_items_ibfk_5` (`trx_beli`) USING BTREE,
  KEY `keu_penerimaan_items_ibfk_6` (`pemasok_id`) USING BTREE,
  KEY `keu_penerimaan_items_ibfk_7` (`trx_jual`) USING BTREE,
  KEY `keu_penerimaan_items_ibfk_8` (`pelanggan_id`) USING BTREE,
  KEY `keu_penerimaan_items_ibfk_9` (`coa_kredit`) USING BTREE,
  CONSTRAINT `keu_penerimaan_items_ibfk_1` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_2` FOREIGN KEY (`keuterima_id`) REFERENCES `keu_penerimaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_3` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_4` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_5` FOREIGN KEY (`trx_beli`) REFERENCES `keu_faktur_pemasok` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_6` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_7` FOREIGN KEY (`trx_jual`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_8` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaan_items_ibfk_9` FOREIGN KEY (`coa_kredit`) REFERENCES `acc_coas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_penerimaan_items
-- ----------------------------
BEGIN;
INSERT INTO `keu_penerimaan_items` VALUES (1, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 30001, '', 1.00, 50000000.00, 50000000.00, 'N', '2022-10-10 21:19:44', '2022-10-10 21:19:44');
INSERT INTO `keu_penerimaan_items` VALUES (2, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 30001, '', 1.00, 40000000.00, 40000000.00, 'N', '2022-10-13 11:15:52', '2022-10-13 11:15:52');
INSERT INTO `keu_penerimaan_items` VALUES (3, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 30001, '', 1.00, 50000000.00, 50000000.00, 'N', '2022-10-13 11:16:28', '2022-10-13 11:16:28');
INSERT INTO `keu_penerimaan_items` VALUES (4, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 30001, '', 1.00, 50000000.00, 50000000.00, 'N', '2022-10-13 12:02:58', '2022-10-13 12:02:58');
INSERT INTO `keu_penerimaan_items` VALUES (5, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 30001, '', 1.00, 50000000.00, 50000000.00, 'Y', '2022-10-13 12:03:17', '2022-10-13 12:03:17');
INSERT INTO `keu_penerimaan_items` VALUES (6, 2, 1, NULL, NULL, NULL, NULL, NULL, NULL, 30001, '', 1.00, 20000000.00, 20000000.00, 'Y', '2022-10-19 16:18:27', '2022-10-19 16:18:27');
INSERT INTO `keu_penerimaan_items` VALUES (7, 3, 1, NULL, NULL, NULL, NULL, NULL, NULL, 22001, '', 1.00, 35000000.00, 35000000.00, 'Y', '2022-10-19 19:16:33', '2022-10-19 19:16:33');
COMMIT;

-- ----------------------------
-- Table structure for keu_penerimaans
-- ----------------------------
DROP TABLE IF EXISTS `keu_penerimaans`;
CREATE TABLE `keu_penerimaans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) DEFAULT NULL,
  `bayar_id` int(10) DEFAULT NULL,
  `reff` varchar(255) DEFAULT NULL,
  `paidby` enum('other','pelanggan','pemasok') DEFAULT NULL,
  `penerima` varchar(255) DEFAULT NULL,
  `coa_debit` int(10) unsigned DEFAULT NULL,
  `narasi` varchar(255) DEFAULT '',
  `trx_date` date DEFAULT NULL,
  `is_delay` enum('N','Y') DEFAULT 'N',
  `delay_trx` date DEFAULT NULL,
  `total` float(12,2) DEFAULT NULL,
  `author` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_tanda_terimas_pelanggan_id_foreign` (`pelanggan_id`) USING BTREE,
  KEY `trx_tanda_terimas_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_tanda_terimas_coa_debit_foreign` (`coa_debit`) USING BTREE,
  KEY `trx_tanda_terimas_author_foreign` (`author`) USING BTREE,
  KEY `trx_tanda_terimas_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `keu_penerimaans_ibfk_7` (`trx_jual`) USING BTREE,
  KEY `keu_penerimaans_ibfk_8` (`bayar_id`) USING BTREE,
  CONSTRAINT `keu_penerimaans_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaans_ibfk_3` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaans_ibfk_4` FOREIGN KEY (`coa_debit`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaans_ibfk_5` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaans_ibfk_6` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaans_ibfk_7` FOREIGN KEY (`trx_jual`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_penerimaans_ibfk_8` FOREIGN KEY (`bayar_id`) REFERENCES `pay_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_penerimaans
-- ----------------------------
BEGIN;
INSERT INTO `keu_penerimaans` VALUES (1, 1, NULL, NULL, NULL, NULL, 'KEU-TERIMA/2022/X-0001', 'other', 'ANGGI', 11101, 'PENYERTAAN MODAL AWAL TESTING ZUL 05', '2022-10-10', 'N', NULL, 50000000.00, 1, 'Y', '2022-10-10 21:19:43', '2022-10-13 12:03:14');
INSERT INTO `keu_penerimaans` VALUES (2, 1, NULL, NULL, NULL, NULL, 'KEU-TERIMA/2022/X-0002', 'pelanggan', 'PAK JUN', 11201, 'TESTING ZUL 07', '2022-10-19', 'N', NULL, 20000000.00, 1, 'Y', '2022-10-19 16:18:27', '2022-10-19 16:18:27');
INSERT INTO `keu_penerimaans` VALUES (3, 1, NULL, NULL, NULL, NULL, 'KEU-TERIMA/2022/X-0003', 'other', 'PAK JUN', 11101, 'TESTING ZUL 07', '2022-10-19', 'N', NULL, 35000000.00, 1, 'Y', '2022-10-19 19:16:33', '2022-10-19 19:16:33');
COMMIT;

-- ----------------------------
-- Table structure for keu_pindah_persediaan_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_pindah_persediaan_attach`;
CREATE TABLE `keu_pindah_persediaan_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `pindah_id` int(10) DEFAULT NULL,
  `filetype` enum('jpg','jpeg','png','bmp','pdf','xls','xlsx','doc','docx') DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_pindah_persediaan_idx` (`pindah_id`) USING BTREE,
  CONSTRAINT `keu_pindah_persediaan_idx_foreign` FOREIGN KEY (`pindah_id`) REFERENCES `keu_pindah_persediaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_pindah_persediaan_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_pindah_persediaan_items
-- ----------------------------
DROP TABLE IF EXISTS `keu_pindah_persediaan_items`;
CREATE TABLE `keu_pindah_persediaan_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `pindah_id` int(10) DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `satuan` varchar(100) DEFAULT NULL,
  `qty` float(10,2) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_transferx_persediaans_pindah_idx` (`pindah_id`) USING BTREE,
  KEY `keu_transferx_persediaans_barang_idx` (`barang_id`) USING BTREE,
  CONSTRAINT `keu_transferx_persediaans_barang_idx` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `keu_transferx_persediaans_pindah_idx` FOREIGN KEY (`pindah_id`) REFERENCES `keu_pindah_persediaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_pindah_persediaan_items
-- ----------------------------
BEGIN;
INSERT INTO `keu_pindah_persediaan_items` VALUES (1, 1, 763, 'pcs', 5.00, 'Y', '2022-10-20 09:35:49', '2022-10-20 09:35:49');
COMMIT;

-- ----------------------------
-- Table structure for keu_pindah_persediaans
-- ----------------------------
DROP TABLE IF EXISTS `keu_pindah_persediaans`;
CREATE TABLE `keu_pindah_persediaans` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_date` date DEFAULT NULL,
  `kode` varchar(50) DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_src` int(10) unsigned DEFAULT NULL,
  `gudang_target` int(10) unsigned DEFAULT NULL,
  `narasi` varchar(200) DEFAULT '',
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `foreign_keu_transfer_barang_cabang_idx` (`cabang_id`) USING BTREE,
  KEY `foreign_keu_transfer_barang_gudang_srcx` (`gudang_src`) USING BTREE,
  KEY `foreign_keu_transfer_barang_gudang_targetx` (`gudang_target`) USING BTREE,
  KEY `foreign_keu_transfer_barang_user_idx` (`created_by`) USING BTREE,
  CONSTRAINT `foreign_keu_transfer_barang_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_keu_transfer_barang_gudang_srcx` FOREIGN KEY (`gudang_src`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_keu_transfer_barang_gudang_targetx` FOREIGN KEY (`gudang_target`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_keu_transfer_barang_user_idx` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_pindah_persediaans
-- ----------------------------
BEGIN;
INSERT INTO `keu_pindah_persediaans` VALUES (1, '2022-10-20', 'TESTING ZUL 07', NULL, 1, 2, 'TESTING ZUL 07', 1, '2022-10-20 09:35:49', '2022-10-20 09:35:49');
COMMIT;

-- ----------------------------
-- Table structure for keu_request_orders
-- ----------------------------
DROP TABLE IF EXISTS `keu_request_orders`;
CREATE TABLE `keu_request_orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `date` date NOT NULL,
  `total` float(10,2) DEFAULT '0.00',
  `kode` varchar(255) NOT NULL,
  `narasi` varchar(255) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `status` enum('created','approved','finish','reject') DEFAULT 'created',
  `createdby` int(10) unsigned DEFAULT NULL,
  `approvedby` int(10) unsigned DEFAULT NULL,
  `approved_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_request_orders_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_request_orders_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_request_orders_createdby_foreign` (`createdby`) USING BTREE,
  KEY `keu_request_orders_approvedby_id_foreignx` (`approvedby`) USING BTREE,
  CONSTRAINT `keu_request_orders_approvedby_id_foreignx` FOREIGN KEY (`approvedby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_request_orders_cabang_id_foreignx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_request_orders_createdby_foreignx` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_request_orders_gudang_id_foreignx` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_request_orders
-- ----------------------------
BEGIN;
INSERT INTO `keu_request_orders` VALUES (1, 1, 1, '2022-10-10', 0.00, 'PR/2022/X/C1-001', 'TESTING ZUL 05', 'P2', 'finish', 1, 1, '2022-10-10 21:05:35', '2022-10-10 21:05:06', '2022-10-10 21:14:39');
INSERT INTO `keu_request_orders` VALUES (2, 1, 1, '2022-10-19', 0.00, 'PR/2022/X/C1-002', 'TESTING ZUL 06', 'P2', 'finish', 1, 1, '2022-10-19 09:25:45', '2022-10-19 09:24:43', '2022-10-19 09:28:48');
INSERT INTO `keu_request_orders` VALUES (3, 1, 1, '2022-10-19', 0.00, 'PR/2022/X/C1-003', 'TESTING ZUL 07', 'P2', 'approved', 1, 1, '2022-10-19 09:32:03', '2022-10-19 09:31:54', '2022-10-19 09:33:33');
INSERT INTO `keu_request_orders` VALUES (4, 1, 2, '2022-10-20', 0.00, 'PR/2022/X/C1-004', 'TESTING ZUL 08', 'P1', 'finish', 1, 1, '2022-10-20 10:10:22', '2022-10-20 10:10:15', '2022-10-20 10:11:53');
COMMIT;

-- ----------------------------
-- Table structure for keu_request_orders_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_request_orders_attach`;
CREATE TABLE `keu_request_orders_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `purchasing_id` int(10) unsigned DEFAULT NULL,
  `filetype` enum('jpg','jpeg','png','bmp','pdf','xls','xlsx','doc','docx') DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_transfer_kasbanks_transfer_idx` (`purchasing_id`) USING BTREE,
  CONSTRAINT `keu_request_orders_attach_ibfk_1` FOREIGN KEY (`purchasing_id`) REFERENCES `keu_request_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_request_orders_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_request_orders_items
-- ----------------------------
DROP TABLE IF EXISTS `keu_request_orders_items`;
CREATE TABLE `keu_request_orders_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `purchasing_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `qty` float(8,2) DEFAULT '0.00',
  `stn` varchar(255) DEFAULT NULL,
  `metode` enum('tunai','kredit') DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `has_received` enum('Y','N') DEFAULT 'N',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_request_orders_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_request_orders_items_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_request_orders_items_ro_id_foreign` (`purchasing_id`) USING BTREE,
  CONSTRAINT `keu_request_orders_items_ibfk_1` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_request_orders_items_ibfk_2` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_request_orders_items_ibfk_3` FOREIGN KEY (`purchasing_id`) REFERENCES `keu_request_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_request_orders_items
-- ----------------------------
BEGIN;
INSERT INTO `keu_request_orders_items` VALUES (1, 1, 763, 1, 15.00, 'pcs', 'tunai', 'Y', 'Y', '2022-10-10 21:05:06', '2022-10-10 21:14:39');
INSERT INTO `keu_request_orders_items` VALUES (2, 2, 708, 1, 20.00, 'pcs', 'tunai', 'Y', 'Y', '2022-10-19 09:24:43', '2022-10-19 09:28:47');
INSERT INTO `keu_request_orders_items` VALUES (3, 3, 708, 1, 25.00, 'pcs', 'tunai', 'Y', 'N', '2022-10-19 09:31:54', '2022-10-19 09:33:33');
INSERT INTO `keu_request_orders_items` VALUES (4, 4, 715, 1, 20.00, 'pcs', 'kredit', 'Y', 'Y', '2022-10-20 10:10:15', '2022-10-20 10:11:52');
COMMIT;

-- ----------------------------
-- Table structure for keu_transfer_kasbanks
-- ----------------------------
DROP TABLE IF EXISTS `keu_transfer_kasbanks`;
CREATE TABLE `keu_transfer_kasbanks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `trx_date` date NOT NULL,
  `bank_src` int(10) unsigned DEFAULT NULL,
  `kas_src` int(10) unsigned DEFAULT NULL,
  `coa_src_id` int(10) unsigned DEFAULT NULL,
  `out_date` date DEFAULT NULL,
  `bank_target` int(10) unsigned DEFAULT NULL,
  `kas_target` int(10) unsigned DEFAULT NULL,
  `coa_target_id` int(10) unsigned DEFAULT NULL,
  `in_date` date DEFAULT NULL,
  `narasi` varchar(200) DEFAULT 'Transfer Kas & Bank',
  `total` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_pembayarans_author_foreign` (`author`) USING BTREE,
  KEY `trx_pembayarans_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_4` (`bank_src`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_5` (`kas_src`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_6` (`coa_src_id`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_7` (`bank_target`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_8` (`kas_target`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_9` (`coa_target_id`) USING BTREE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_3` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_4` FOREIGN KEY (`bank_src`) REFERENCES `keu_banks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_5` FOREIGN KEY (`kas_src`) REFERENCES `keu_kas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_6` FOREIGN KEY (`coa_src_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_7` FOREIGN KEY (`bank_target`) REFERENCES `keu_banks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_8` FOREIGN KEY (`kas_target`) REFERENCES `keu_kas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `keu_transfer_kasbanks_ibfk_9` FOREIGN KEY (`coa_target_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_transfer_kasbanks
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for keu_transfer_kasbanks_attach
-- ----------------------------
DROP TABLE IF EXISTS `keu_transfer_kasbanks_attach`;
CREATE TABLE `keu_transfer_kasbanks_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `transfer_id` int(10) unsigned DEFAULT NULL,
  `filetype` enum('jpg','jpeg','png','bmp','pdf') DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `keu_transfer_kasbanks_transfer_idx` (`transfer_id`) USING BTREE,
  CONSTRAINT `keu_transfer_kasbanks_transfer_idx` FOREIGN KEY (`transfer_id`) REFERENCES `keu_transfer_kasbanks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of keu_transfer_kasbanks_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for lampiran_files
-- ----------------------------
DROP TABLE IF EXISTS `lampiran_files`;
CREATE TABLE `lampiran_files` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ro_id` int(10) unsigned DEFAULT NULL,
  `fb_id` int(10) unsigned DEFAULT NULL,
  `fj_id` int(10) unsigned DEFAULT NULL,
  `tt_id` int(10) unsigned DEFAULT NULL,
  `bb_id` int(10) unsigned DEFAULT NULL,
  `ja_id` int(10) unsigned DEFAULT NULL,
  `trf_id` int(10) unsigned DEFAULT NULL,
  `datatype` varchar(5) NOT NULL,
  `url` text NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `lampiran_files_ro_id_foreign` (`ro_id`) USING BTREE,
  KEY `lampiran_files_fb_id_foreign` (`fb_id`) USING BTREE,
  KEY `lampiran_files_fj_id_foreign` (`fj_id`) USING BTREE,
  KEY `lampiran_files_tt_id_foreign` (`tt_id`) USING BTREE,
  KEY `lampiran_files_bb_id_foreign` (`bb_id`) USING BTREE,
  KEY `lampiran_files_jurnal_adj_foreign` (`ja_id`) USING BTREE,
  KEY `lampiran_files_trf_id_foreign` (`trf_id`) USING BTREE,
  CONSTRAINT `lampiran_files_bb_id_foreign` FOREIGN KEY (`bb_id`) REFERENCES `keu_pembayarans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lampiran_files_fb_id_foreign` FOREIGN KEY (`fb_id`) REFERENCES `xxx_trx_faktur_belis` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lampiran_files_fj_id_foreign` FOREIGN KEY (`fj_id`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lampiran_files_jurnal_adj_foreign` FOREIGN KEY (`ja_id`) REFERENCES `xxx_trx_jurnal_adjusts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lampiran_files_ro_id_foreign` FOREIGN KEY (`ro_id`) REFERENCES `keu_request_orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lampiran_files_trf_id_foreign` FOREIGN KEY (`trf_id`) REFERENCES `keu_transfer_kasbanks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lampiran_files_tt_id_foreign` FOREIGN KEY (`tt_id`) REFERENCES `trx_tanda_terimas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of lampiran_files
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for log_opname
-- ----------------------------
DROP TABLE IF EXISTS `log_opname`;
CREATE TABLE `log_opname` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `kode_opname` varchar(255) DEFAULT NULL,
  `date_opname` date DEFAULT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `log_opname_cabang_idx_foreign` (`cabang_id`) USING BTREE,
  KEY `log_opname_gudang_idx_foreign` (`gudang_id`) USING BTREE,
  KEY `log_opname_user_idx_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `log_opname_cabang_idx_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `log_opname_gudang_idx_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `log_opname_user_idx_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of log_opname
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for log_opname_items
-- ----------------------------
DROP TABLE IF EXISTS `log_opname_items`;
CREATE TABLE `log_opname_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `opname_id` int(10) DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `nm_barang` varchar(255) DEFAULT NULL,
  `stn` varchar(255) DEFAULT NULL,
  `qty_opname` float(10,2) DEFAULT '0.00',
  `narasi` varchar(255) DEFAULT '',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `log_opname_items_opname_idx_foreign` (`opname_id`) USING BTREE,
  KEY `log_opname_items_barang_idx_foreign` (`barang_id`) USING BTREE,
  KEY `log_opname_items_user_idx_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `log_opname_items_barang_idx_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `log_opname_items_opname_idx_foreign` FOREIGN KEY (`opname_id`) REFERENCES `log_opname` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `log_opname_items_user_idx_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of log_opname_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for log_opname_summary
-- ----------------------------
DROP TABLE IF EXISTS `log_opname_summary`;
CREATE TABLE `log_opname_summary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `opname_id` int(10) DEFAULT NULL,
  `date_opname` date DEFAULT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `cabang_id` int(11) unsigned DEFAULT NULL,
  `gudang_id` int(11) unsigned DEFAULT NULL,
  `barang_id` int(11) unsigned DEFAULT NULL,
  `qty_opname` float(8,2) DEFAULT NULL,
  `qty_onhand` float(8,2) DEFAULT '0.00',
  `variences` float(8,2) DEFAULT '0.00',
  `description` varchar(255) DEFAULT NULL,
  `author` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `log_opname_summary_opname_idx_foreign` (`opname_id`) USING BTREE,
  KEY `log_opname_summary_barang_idx_foreign` (`barang_id`) USING BTREE,
  KEY `log_opname_summary_cabang_idx_foreign` (`cabang_id`) USING BTREE,
  KEY `log_opname_summary_gudang_idx_foreign` (`gudang_id`) USING BTREE,
  KEY `log_opname_summary_user_idx_foreign` (`author`) USING BTREE,
  CONSTRAINT `log_opname_summary_barang_idx_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `log_opname_summary_cabang_idx_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `log_opname_summary_gudang_idx_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `log_opname_summary_opname_idx_foreign` FOREIGN KEY (`opname_id`) REFERENCES `log_opname` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `log_opname_summary_user_idx_foreign` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of log_opname_summary
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for log_terima_barang_items
-- ----------------------------
DROP TABLE IF EXISTS `log_terima_barang_items`;
CREATE TABLE `log_terima_barang_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trx_terima` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `qty` float(8,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `log_terima_barang_items_trx_terima_foreign` (`trx_terima`) USING BTREE,
  KEY `log_terima_barang_items_barang_id_foreign` (`barang_id`) USING BTREE,
  CONSTRAINT `log_terima_barang_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `log_terima_barang_items_trx_terima_foreign` FOREIGN KEY (`trx_terima`) REFERENCES `log_terima_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of log_terima_barang_items
-- ----------------------------
BEGIN;
INSERT INTO `log_terima_barang_items` VALUES (1, 1, 763, 'PENERIMAAN PO  TESTING ZUL 05', 15.00, '2022-10-10 21:14:39', '2022-10-10 21:14:39');
INSERT INTO `log_terima_barang_items` VALUES (3, 3, 708, 'TESTING ZUL 06', 20.00, '2022-10-19 09:28:47', '2022-10-19 09:28:47');
INSERT INTO `log_terima_barang_items` VALUES (6, 6, 715, 'TESTING ZUL 08', 20.00, '2022-10-20 10:11:52', '2022-10-20 10:11:52');
COMMIT;

-- ----------------------------
-- Table structure for log_terima_barangs
-- ----------------------------
DROP TABLE IF EXISTS `log_terima_barangs`;
CREATE TABLE `log_terima_barangs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `reff_fb` varchar(50) DEFAULT NULL,
  `reff_order` int(10) unsigned DEFAULT NULL,
  `reff_rcp` varchar(30) DEFAULT NULL,
  `received_at` date DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `receivedby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `log_terima_barangs_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `log_terima_barangs_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `log_terima_barang_user_terima_foreign` (`receivedby`) USING BTREE,
  KEY `log_terima_barangs_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `log_terima_order_id_foreign` (`reff_order`) USING BTREE,
  CONSTRAINT `log_terima_barang_user_terima_foreign` FOREIGN KEY (`receivedby`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `log_terima_barangs_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `log_terima_barangs_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `log_terima_barangs_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `log_terima_order_id_foreign` FOREIGN KEY (`reff_order`) REFERENCES `keu_request_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of log_terima_barangs
-- ----------------------------
BEGIN;
INSERT INTO `log_terima_barangs` VALUES (1, NULL, 1, 'TESTINGZUL05', '2022-10-10', 1, 1, 1, 'PENERIMAAN PO  TESTING ZUL 05', 1, '2022-10-10 21:14:38', '2022-10-10 21:14:38');
INSERT INTO `log_terima_barangs` VALUES (3, NULL, 2, 'TESTING ZUL 06', '2022-10-19', 1, 1, 1, 'TESTING ZUL 06', 1, '2022-10-19 09:28:47', '2022-10-19 09:28:47');
INSERT INTO `log_terima_barangs` VALUES (6, NULL, 4, 'TESTINGZUL08', '2022-10-20', 1, 1, 2, 'TESTING ZUL 08', 1, '2022-10-20 10:11:52', '2022-10-20 10:11:52');
COMMIT;

-- ----------------------------
-- Table structure for log_terima_barangs_attach
-- ----------------------------
DROP TABLE IF EXISTS `log_terima_barangs_attach`;
CREATE TABLE `log_terima_barangs_attach` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `logterima_id` int(10) unsigned DEFAULT NULL,
  `filetype` enum('jpg','jpeg','png','bmp','pdf','xls','xlsx','doc','docx') DEFAULT NULL,
  `size` double DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `log_terima_barang_idx` (`logterima_id`) USING BTREE,
  CONSTRAINT `log_terima_barangs_attach_ibfk_1` FOREIGN KEY (`logterima_id`) REFERENCES `log_terima_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of log_terima_barangs_attach
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for mas_barangs
-- ----------------------------
DROP TABLE IF EXISTS `mas_barangs`;
CREATE TABLE `mas_barangs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(50) NOT NULL,
  `kategori_id` int(10) DEFAULT NULL,
  `subkategori_id` int(10) DEFAULT NULL,
  `brand_id` int(10) DEFAULT NULL,
  `qualitas_id` int(10) DEFAULT NULL,
  `num_part` varchar(100) DEFAULT '',
  `nama` varchar(150) NOT NULL,
  `satuan` varchar(50) NOT NULL,
  `min_stok` float(8,1) DEFAULT '0.0',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `photo` varchar(200) DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `coa_in` int(10) unsigned DEFAULT NULL,
  `coa_out` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_barangs_createdby_foreign` (`user_id`) USING BTREE,
  KEY `mas_barangs_coa_in_foreign` (`coa_in`) USING BTREE,
  KEY `mas_barangs_coa_out_foreign` (`coa_out`) USING BTREE,
  KEY `mas_barangs_brand_id_foreign` (`brand_id`) USING BTREE,
  KEY `mas_barangs_kategori_id_foreign` (`kategori_id`) USING BTREE,
  KEY `mas_barangs_qualitas_id_foreign` (`qualitas_id`) USING BTREE,
  KEY `mas_barangs_subkategori_id_foreign` (`subkategori_id`) USING BTREE,
  CONSTRAINT `mas_barangs_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `barang_brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_barangs_coa_in_foreign` FOREIGN KEY (`coa_in`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_barangs_coa_out_foreign` FOREIGN KEY (`coa_out`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_barangs_kategori_id_foreign` FOREIGN KEY (`kategori_id`) REFERENCES `barang_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_barangs_qualitas_id_foreign` FOREIGN KEY (`qualitas_id`) REFERENCES `barang_qualities` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_barangs_subkategori_id_foreign` FOREIGN KEY (`subkategori_id`) REFERENCES `barang_subcategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_barangs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1231 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_barangs
-- ----------------------------
BEGIN;
INSERT INTO `mas_barangs` VALUES (1, 'MJM010401.00001', 1, 9, 4, 1, '63V-11181-A1', 'Cylnder Headx', 'blok', 0.0, 'N', NULL, 1, 11001, 40001, '2022-03-22 03:56:59', '2022-03-22 04:21:39');
INSERT INTO `mas_barangs` VALUES (2, 'MJM030202.00002', 3, NULL, 2, 2, '6F5-41112-A0', 'Exhaust Inner Cover', 'blok', 0.0, 'N', NULL, 1, 11001, 40001, '2022-03-22 04:22:16', '2022-03-22 22:10:06');
INSERT INTO `mas_barangs` VALUES (3, 'BRG01040102.0001', 1, 4, 1, 2, '63V-11181-A1', 'Gasket Clynder Head', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (4, 'BRG01040102.0002', 1, 4, 1, 2, '61N-11181-A2', 'Gasket Clynder Head', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (5, 'BRG01040102.0003', 1, 4, 1, 2, '66T-11193-A0', 'Gasket Head Cover', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (6, 'BRG01040102.0004', 1, 4, 1, 2, '6F5-41112-A0', 'Gasket Exhaust Inner Cover', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (7, 'BRG01040102.0005', 1, 4, 1, 2, '6F5-41114-A0', 'Gasket Exhaust Outter Cover', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (8, 'BRG01130102.0006', 1, 13, 1, 2, '6F5-13646-A0', 'Gasket Manifold Outter Y40', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (9, 'BRG01130102.0007', 1, 13, 1, 2, '6F5-13645-A1', 'Gasket Manifold Inner Y40', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (10, 'BRG01130102.0008', 1, 13, 1, 2, '6F5-14198-A1', 'Gasket Intake Manifold Green', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (11, 'BRG01040102.0009', 1, 4, 1, 2, '6F5-45113-A0', 'Gasket Upper Casing', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (12, 'BRG01040102.0010', 1, 4, 1, 2, '676-45114-A1', 'Gasket Upper Casing', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (13, 'BRG01040102.0011', 1, 4, 1, 2, '66T-45113-A1', 'Gasket Upper Casing', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (14, 'BRG01040102.0012', 1, 4, 1, 2, '689-45113-A1 / 61T-45113-A1', 'Gasket Upper Casing', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (15, 'BRG01040102.0013', 1, 4, 1, 2, '682-45113-A0', 'Gasket Upper Casing Y-15', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (16, 'BRG03100102.0014', 3, 10, 1, 2, '682-41133-00', 'Gasket Exhaust Manifold STD', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (17, 'BRG01140102.0015', 1, 14, 1, 2, '648-24434-00', 'Gasket Body 1', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (18, 'BRG01140102.0016', 1, 14, 1, 2, '648-24435-02', 'Gasket Body 2', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (19, 'BRG04150102.0017', 4, 15, 1, 2, '90430-08020', 'Gasket Gardan', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (20, 'BRG01040102.0018', 1, 4, 1, 2, '6B4-41112-A0', 'Gasket Exhaust Inner Cover', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (21, 'BRG01040102.0019', 1, 4, 1, 2, '6F5-11181-A1', 'Gasket Cylinder Head', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (22, 'BRG01140102.0020', 1, 14, 1, 2, '6G1-24431-01', 'Gasket Fuel Pump', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (23, 'BRG01140102.0021', 1, 14, 1, 2, '63V-24411-00', 'Diaphragm', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (24, 'BRG01140102.0022', 1, 14, 1, 2, '6G1-24411-00', 'Diaphragm', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (25, 'BRG01140102.0023', 1, 14, 1, 2, '692-24411-00', 'Diaphragm', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (26, 'BRG01040102.0024', 1, 4, 1, 2, '63V-41112-A0', 'Gasket Exhaust Inner cover', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (27, 'BRG01040102.0025', 1, 4, 1, 2, '66T-11181-00', 'Gasket Cylinder Head Y40', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (28, 'BRG01040102.0026', 1, 4, 1, 2, '6F6-11193-A1 / 00', 'Gasket Head Cover', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (29, 'BRG01040102.0027', 1, 4, 1, 2, '6B4-11351-A2', 'Gasket Upper Casing', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (30, 'BRG03100102.0028', 3, 10, 1, 2, '676-41133-A1', 'Gasket Exhaust Manifold 1', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (31, 'BRG01130101.0029', 1, 13, 1, 1, '6F5-14198-A1', 'Gasket Carburator', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (32, 'BRG01040101.0030', 1, 4, 1, 1, '61N-11181-A2', 'Gasket Cylinder Head', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (33, 'BRG01040101.0031', 1, 4, 1, 1, '6G5-11181-A3', 'Gasket Cylinder Head', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (34, 'BRG01040101.0032', 1, 4, 1, 1, '6E5-11181-A2', 'Gasket Cylinder Head', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (35, 'BRG01040101.0033', 1, 4, 1, 1, '68V-11351-00', 'Gasket Cylinder Head', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (36, 'BRG01040101.0034', 1, 4, 1, 1, '67F-11181-03', 'Gasket Cylinder Head 1', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (37, 'BRG01040101.0035', 1, 4, 1, 1, '688-11191-00-1S', 'Gasket Cover, Cylinder head', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (38, 'BRG01040101.0036', 1, 4, 1, 1, '676-45114-A1', 'Gasket Upper Casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (39, 'BRG01040101.0037', 1, 4, 1, 1, '6F5-45113-A1', 'Gasket Upper Casing', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (40, 'BRG01140101.0038', 1, 14, 1, 1, '692-24411-00', 'Diaphragm', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (41, 'BRG01140101.0039', 1, 14, 1, 1, '6E5-24471-01', 'Diaphragm', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (42, 'BRG01140101.0040', 1, 14, 1, 1, '663-24411-00', 'Diaphragm', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (43, 'BRG01140101.0041', 1, 14, 1, 1, '648-24411-00', 'Diaphragm', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (44, 'BRG01040101.0042', 1, 4, 1, 1, '6F5-11181-A2', 'Gasket Cylinder Head', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (45, 'BRG01040101.0043', 1, 4, 1, 1, '6G5-41112-A1', 'Gasket Exhaust Inner Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (46, 'BRG01040101.0044', 1, 4, 1, 1, '6F5-41112-A0', 'Gasket Exhaust Inner Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (47, 'BRG01040101.0045', 1, 4, 1, 1, '6F5-41114-A0', 'Gasket Exhaust Outter Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (48, 'BRG01040101.0046', 1, 4, 1, 1, '6H3-41112-A0', 'Gasket Exhaust Inner Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (49, 'BRG01040101.0047', 1, 4, 1, 1, '6H3-41114-A0', 'Gasket Exhaust Outter Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (50, 'BRG01040101.0048', 1, 4, 1, 1, '6G5-45113-A2', 'Gasket Upper casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (51, 'BRG01040101.0049', 1, 4, 1, 1, '688-45113-A0', 'Gasket Upper casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (52, 'BRG01040101.0050', 1, 4, 1, 1, '689-45113-A1 / 61T-45113-A0', 'Gasket Upper casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (53, 'BRG01040101.0051', 1, 4, 1, 1, '6E5-45113-A0', 'Gasket Upper casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (54, 'BRG01140101.0052', 1, 14, 1, 1, '648-24434-01', 'Gasket Body ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (55, 'BRG01040101.0053', 1, 4, 1, 1, '63V-11181-A1', 'Gasket Cylinder Head', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (56, 'BRG01040101.0054', 1, 4, 1, 1, '688-11111-02-1S', 'Cylinder Head', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (57, 'BRG01140101.0055', 1, 14, 1, 1, '648-24435-02', 'Gasket Body', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (58, 'BRG01140101.0056', 1, 14, 1, 1, '6E5-24434-02', 'Gasket Body', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (59, 'BRG01040101.0057', 1, 4, 1, 1, '688-11181-A2', 'Gasket Cylinder Head', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (60, 'BRG04160101.0058', 4, 16, 1, 1, '688-44315-A0', 'Gasket Water Pump ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (61, 'BRG04160101.0059', 4, 16, 1, 1, '688-44324-A0', 'Cartridge Outter Plate', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (62, 'BRG01130101.0060', 1, 13, 1, 1, '6E5-13621-A1', 'Valve Seat', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (63, 'BRG04150101.0061', 4, 15, 1, 1, '90430-08003', 'Gasket Gardan', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (64, 'BRG04150101.0062', 4, 15, 1, 1, '90430-06M03', 'Gasket', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (65, 'BRG01140101.0063', 1, 14, 1, 1, '6E5-24411-00', 'Diaphragm', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (66, 'BRG04160101.0064', 4, 16, 1, 1, '676-44315-A1', 'Gasket Water Pump', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (67, 'BRG04160101.0065', 4, 16, 1, 1, '676-44316-A1', 'Gasket Water Pump', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (68, 'BRG04160101.0066', 4, 16, 1, 1, '676-44324-A1', 'Cartridge', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (69, 'BRG01040101.0067', 1, 4, 1, 1, '66T-11193-A3', 'Gasket Head Cover 1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (70, 'BRG01040101.0068', 1, 4, 1, 1, '66T-11181-A3', 'Gasket Cylinder Head', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (71, 'BRG04160101.0069', 4, 16, 1, 1, '682-44315-A0', 'Gasket Water pump', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (72, 'BRG04160101.0070', 4, 16, 1, 1, '683-45315-A0', 'Packing Lower Casing', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (73, 'BRG01040101.0071', 1, 4, 1, 1, '66T-45113-A0', 'Gasket Upper Casing', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (74, 'BRG01040101.0072', 1, 4, 1, 1, '6H3-45113-A0', 'Gasket Upper Casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (75, 'BRG01040101.0073', 1, 4, 1, 1, '66T-41114-A0', 'Gasket Exhaust Outter Cover', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (76, 'BRG01040101.0074', 1, 4, 1, 1, '688-41114-A0', 'Gasket Exhaust Outter Cover', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (77, 'BRG01040101.0075', 1, 4, 1, 1, '688-41112-A0', 'Gasket Exhaust Inner Cover', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (78, 'BRG01040101.0076', 1, 4, 1, 1, '6F6-11193-A1', 'Gasket Head Cover', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (79, 'BRG01140101.0077', 1, 14, 1, 1, '650-24431-A0', 'Gasket Fuel Pump', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (80, 'BRG01130101.0078', 1, 13, 1, 1, '6F5-13621-A1', 'Valve Seat', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (81, 'BRG01050101.0079', 1, 5, 1, 1, '6F5-14390-12', 'Valve seat assy', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (82, 'BRG01040101.0080', 1, 4, 1, 1, '6B4-11351-A1', 'Gasket Upper casing', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (83, 'BRG01130101.0081', 1, 13, 1, 1, '6G5-13645-A2', 'Gasket Manifold', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (84, 'BRG01130101.0082', 1, 13, 1, 1, '6E5-13645-A1', 'Gasket Manifold 1 ', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (85, 'BRG01040101.0083', 1, 4, 1, 1, '688-12414-A1', 'Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (86, 'BRG04160101.0084', 4, 16, 1, 1, '6E5-44315-A0', 'Gasket Water Pump', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (87, 'BRG01130101.0085', 1, 13, 1, 1, '6E5-14198-A2', 'Gasket Carburator', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (88, 'BRG01130101.0086', 1, 13, 1, 1, '6E5-14483-A1', 'Gasket', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (89, 'BRG01130101.0087', 1, 13, 1, 1, '6E5-14416-A1', 'Air cleaner', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (90, 'BRG01140101.0088', 1, 14, 1, 1, '6E5-24435-00', 'Gasket Body fuel pump', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (91, 'BRG03100101.0089', 3, 10, 1, 1, '63V-41133-A1', 'Gasket Exhaust Manifold 1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (92, 'BRG04160101.0090', 4, 16, 1, 1, '688-44316-A0', 'Gasket Water Pump', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (93, 'BRG01040101.0091', 1, 4, 1, 1, '6G5-11382-A1', 'Gasket', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (94, 'BRG01040101.0092', 1, 4, 1, 1, '69J-11351-12', 'Gasket ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (95, 'BRG01040101.0093', 1, 4, 1, 1, '6P2-11590-01', 'Tensioner assy ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (96, 'BRG01040101.0094', 1, 4, 1, 1, '6P2-11181-00', 'Cylinder Head 1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (97, 'BRG01040101.0095', 1, 4, 1, 1, '6P2-11182-00', 'Cylinder Head 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (98, 'BRG01040101.0096', 1, 4, 1, 1, '6K8-41122-A1', 'Gasket Exhaust Inner Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (99, 'BRG01040101.0097', 1, 4, 1, 1, '6K8-41124-A1', 'Gasket Exhaust Outter Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (100, 'BRG01140101.0098', 1, 14, 1, 1, '66T-14536-01', 'Gasket ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (101, 'BRG01050101.0099', 1, 5, 1, 1, '66T-14984-00', 'Float chamber ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (102, 'BRG01130101.0100', 1, 13, 1, 1, '688-13621-A1', 'Valve Seat', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (103, 'BRG01130101.0101', 1, 13, 1, 1, '688-14198-A2', 'Gasket Carburator', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (104, 'BRG01040101.0102', 1, 4, 1, 1, '688-11193-A1', 'Gasket Head Cover 1', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (105, 'BRG01130101.0103', 1, 13, 1, 1, '6H3-14198-A1', 'Gasket Carburator', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (106, 'BRG01170102.0104', 1, 17, 1, 2, '6K4-11651-00', 'Conrod ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (107, 'BRG01170502.0105', 1, 17, 5, 2, '6K4-11651-00', 'Conrod', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (108, 'BRG01170102.0106', 1, 17, 1, 2, '689-11651-00', 'Conrod', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (109, 'BRG01070102.0107', 1, 7, 1, 2, '63V-11422-00', 'Crank 2 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (110, 'BRG01070102.0108', 1, 7, 1, 2, '63V-11442-00', 'Crank 4 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (111, 'BRG01070102.0109', 1, 7, 1, 2, '66T-11442-00', 'Crank 4 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (112, 'BRG01070102.0110', 1, 7, 1, 2, '61N-11442-00', 'Crank 4 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (113, 'BRG01170102.0111', 1, 17, 1, 2, '6F5-11651-00', 'Conrod ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (114, 'BRG01170502.0112', 1, 17, 5, 2, '6F5-11651-00', 'Conrod', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (115, 'BRG01070102.0113', 1, 7, 1, 2, '6F5-11422-11', 'Crank 2 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (116, 'BRG01070102.0114', 1, 7, 1, 2, '6F5-11432-11', 'Crank 3 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (117, 'BRG01070102.0115', 1, 7, 1, 2, '6F5-11442-11', 'Crank 4 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (118, 'BRG01170102.0116', 1, 17, 1, 2, '6F5-11610-00', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (119, 'BRG01170102.0117', 1, 17, 1, 2, '61N-11603-00', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (120, 'BRG01170102.0118', 1, 17, 1, 2, '6F5-11633-00', 'Pin Piston ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (121, 'BRG01070102.0119', 1, 7, 1, 2, '688-11411-00', 'Crankshaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (122, 'BRG01070102.0120', 1, 7, 1, 2, '6G5-11411-02', 'Crankshaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (123, 'BRG01070102.0121', 1, 7, 1, 2, '6F5-11681-00', 'Pin Crank ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (124, 'BRG01040102.0122', 1, 4, 1, 2, '688-11312-00 / 688-10935', 'Sleeve Cylinder/Liner ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (125, 'BRG01040102.0123', 1, 4, 1, 2, '6F5-11312-00 / 6F5-10935', 'Sleeve Cylinder/Liner Kitaco', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (126, 'BRG01040102.0124', 1, 4, 1, 2, '61N-10935-00', 'Sleeve Cylinder/Liner ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (127, 'BRG01040102.0125', 1, 4, 1, 2, '6K5-11312-00 / 6K5-10935', 'Sleeve Cylinder/Liner ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (128, 'BRG01070102.0126', 1, 7, 1, 2, '63V-11515-02', 'Seal Labyrinth Y15', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (129, 'BRG01170102.0127', 1, 17, 1, 2, '682-11610-01', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (130, 'BRG01170102.0128', 1, 17, 1, 2, '93603-21111', 'Pin Dowel ', 'pcs', 100.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (131, 'BRG01170102.0129', 1, 17, 1, 2, '93602-14104', 'Pin Dowel ', 'pcs', 100.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (132, 'BRG01170102.0130', 1, 17, 1, 2, '6E7-11631-00-97', 'Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (133, 'BRG01170102.0131', 1, 17, 1, 2, '6E7-11630-00-97', 'Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (134, 'BRG01170102.0132', 1, 17, 1, 2, '6F6-11631-00-95', 'Piston STD  (omax taiwan)', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (135, 'BRG01070102.0133', 1, 7, 1, 2, '66T-11681-00', 'Pin Crank Y40', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (136, 'BRG01170102.0134', 1, 17, 1, 2, '66T-11631-00-97', 'Piston Y40 (omax)', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (137, 'BRG01170102.0135', 1, 17, 1, 2, '61N-11630-00 / 61N-11631-00', 'Piston KIT 72MM', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (138, 'BRG01170102.0136', 1, 17, 1, 2, '66T-11603-00', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (139, 'BRG01070102.0137', 1, 7, 1, 2, '682-11681-00', 'Pin crank', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (140, 'BRG01170101.0138', 1, 17, 1, 1, '64D-11603-02', 'Ring Piston STD ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (141, 'BRG01170101.0139', 1, 17, 1, 1, '61U-11601-00', 'Ring Piston STD ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (142, 'BRG01170101.0140', 1, 17, 1, 1, '6F6-11631-00-95', 'Piston STD ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (143, 'BRG01170101.0141', 1, 17, 1, 1, '6E7-11631-00-97', 'Piston STD ', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (144, 'BRG01170101.0142', 1, 17, 1, 1, '689-11631-00-94', 'Piston STD ', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (145, 'BRG01070101.0143', 1, 7, 1, 1, '6K5-11681-00', 'Pin crank', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (146, 'BRG01070101.0144', 1, 7, 1, 1, '6F5-11681-00', 'Pin Crank ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (147, 'BRG01170101.0145', 1, 17, 1, 1, '6F5-11651-00', 'Conrod ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (148, 'BRG01170101.0146', 1, 17, 1, 1, '6F5-11610-00', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (149, 'BRG01170101.0147', 1, 17, 1, 1, '61N-11603-00', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (150, 'BRG01170101.0148', 1, 17, 1, 1, '682-11610-01', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (151, 'BRG01170101.0149', 1, 17, 1, 1, '6F5-11633-00', 'Pin Piston ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (152, 'BRG01170101.0150', 1, 17, 1, 1, '634-11633-00', 'Pin Piston ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (153, 'BRG01170101.0151', 1, 17, 1, 1, '6K7-11633-00', 'Pin Piston ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (154, 'BRG01170101.0152', 1, 17, 1, 1, '689-11633-00', 'Pin Piston ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (155, 'BRG01170101.0153', 1, 17, 1, 1, '6H3-11633-00', 'Pin Piston ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (156, 'BRG01170101.0154', 1, 17, 1, 1, '64D-11631-02-90', 'Piston STBD', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (157, 'BRG01170101.0155', 1, 17, 1, 1, '6R5-11642-01-93', 'Piston STD', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (158, 'BRG01170101.0156', 1, 17, 1, 1, '6R5-11631-01-93', 'Piston STD', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (159, 'BRG01170101.0157', 1, 17, 1, 1, '60H-11650-00', 'Conrod ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (160, 'BRG01170101.0158', 1, 17, 1, 1, '6K4-11651-00', 'Conrod', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (161, 'BRG01170101.0159', 1, 17, 1, 1, '689-11651-00', 'Conrod', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (162, 'BRG01170101.0160', 1, 17, 1, 1, '6K5-11651-00', 'Conrod', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (163, 'BRG01170101.0161', 1, 17, 1, 1, '6R5-11650-10', 'Conrod', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (164, 'BRG01170101.0162', 1, 17, 1, 1, '688-11603-A0', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (165, 'BRG01170101.0163', 1, 17, 1, 1, '60C-11603-00', 'Ring Piston STD ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (166, 'BRG01170101.0164', 1, 17, 1, 1, '688-11631-03-94', 'Piston STD ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (167, 'BRG01170101.0165', 1, 17, 1, 1, '6K5-11631-03-95', 'Piston STD ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (168, 'BRG01170101.0166', 1, 17, 1, 1, '688-11650-03', 'Conrod ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (169, 'BRG01170101.0167', 1, 17, 1, 1, '688-11634-00', 'Clip Pin Piston ', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (170, 'BRG01170101.0168', 1, 17, 1, 1, '663-11633-00', 'Pin Piston ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (171, 'BRG01170101.0169', 1, 17, 1, 1, '6R5-11633-10', 'Pin Piston ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (172, 'BRG01170101.0170', 1, 17, 1, 1, '6R5-11634-10', 'Circlip ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (173, 'BRG01170101.0171', 1, 17, 1, 1, '93602-14104', 'Pin Dowel ', 'pcs', 50.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (174, 'BRG01170101.0172', 1, 17, 1, 1, '93602-20M02', 'Pin Dowel ', 'pcs', 50.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (175, 'BRG01170101.0173', 1, 17, 1, 1, '93603-18M09', 'Pin Dowel ', 'pcs', 50.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (176, 'BRG01070101.0174', 1, 7, 1, 1, '682-11681-00', 'Pin Crank ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (177, 'BRG01070101.0175', 1, 7, 1, 1, '689-11681-00', 'Pin crank', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (178, 'BRG01170101.0176', 1, 17, 1, 1, '64D-11642-02-90', 'Piston STD', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (179, 'BRG01170101.0177', 1, 17, 1, 1, '66T-11631-01-93', 'Piston STD', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (180, 'BRG01170101.0178', 1, 17, 1, 1, '6K5-11601-02', 'Ring Piston STD ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (181, 'BRG01170101.0179', 1, 17, 1, 1, '90201-23M01', 'Washer Plate ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (182, 'BRG04150101.0180', 4, 15, 1, 1, '90201-30M92', 'Washer ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (183, 'BRG04150101.0181', 4, 15, 1, 1, '90201-22429', 'Washer Plate ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (184, 'BRG01070101.0182', 1, 7, 1, 1, '66T-11681-00', 'Pin Crank ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (185, 'BRG01170101.0183', 1, 17, 1, 1, '66T-11603-00', 'Ring Piston STD ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (186, 'BRG01040101.0184', 1, 4, 1, 1, '6F5-10935 / 6F5-11312', 'Sleeve Cylinder/Liner ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (187, 'BRG01040101.0185', 1, 4, 1, 1, '688-11312-00', 'Sleeve Cylinder/Liner ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (188, 'BRG01070101.0186', 1, 7, 1, 1, '66T-11442-00', 'Crank 4 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (189, 'BRG04180102.0187', 4, 18, 1, 2, '93101-22067 / 22M00', 'Oil Seal Y40', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (190, 'BRG04180102.0188', 4, 18, 1, 2, '93101-20048', 'Oil Seal ', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (191, 'BRG04150102.0189', 4, 15, 1, 2, '93101-17054', 'Oil Seal', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (192, 'BRG01040102.0190', 1, 4, 1, 2, '93101-30M33', 'Oil Seal Y40', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (193, 'BRG02080102.0191', 2, 8, 1, 2, '93102-35M18 / 35M58', 'Oil Seal ', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (194, 'BRG04180101.0192', 4, 18, 1, 1, '93101-28M16', 'Oil Seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (195, 'BRG04180101.0193', 4, 18, 1, 1, '93101-22067 / 22M00', 'Oil Seal Y40', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (196, 'BRG04150101.0194', 4, 15, 1, 1, '93101-30M17', 'Oil Seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (197, 'BRG01040101.0195', 1, 4, 1, 1, '93102-35M61', 'Oil Seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (198, 'BRG01040101.0196', 1, 4, 1, 1, '93101-22M15', 'Oil Seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (199, 'BRG01040101.0197', 1, 4, 1, 1, '93101-16001', 'Oil Seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (200, 'BRG04150101.0198', 4, 15, 1, 1, '93101-25M03', 'Oil Seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (201, 'BRG01040101.0199', 1, 4, 1, 1, '93102-30M56', 'Oil Seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (202, 'BRG01070101.0200', 1, 7, 1, 1, '93110-23M00', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (203, 'BRG02080101.0201', 2, 8, 1, 1, '93102-35M18 / 35M58', 'Oil Seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (204, 'BRG01040101.0202', 1, 4, 1, 1, '93102-35M13', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (205, 'BRG01040101.0203', 1, 4, 1, 1, '93101-30M33', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (206, 'BRG01040101.0204', 1, 4, 1, 1, '93101-13M11', 'Oil Seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (207, 'BRG01040101.0205', 1, 4, 1, 1, '93101-16M36', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (208, 'BRG04180101.0206', 4, 18, 1, 1, '93101-22M60', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (209, 'BRG04180101.0207', 4, 18, 1, 1, '93101-20048', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (210, 'BRG04150101.0208', 4, 15, 1, 1, '93101-20M07', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (211, 'BRG04150101.0209', 4, 15, 1, 1, '93101-17001', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (212, 'BRG01040101.0210', 1, 4, 1, 1, '93104-16M01', 'Oil seal ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (213, 'BRG01040101.0211', 1, 4, 1, 1, '93102-30M53', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (214, 'BRG01040101.0212', 1, 4, 1, 1, '93102-30009', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (215, 'BRG03190101.0213', 3, 19, 1, 1, '64E-4384J-00', 'Oil seal', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (216, 'BRG04180101.0214', 4, 18, 1, 1, '93315-325V1', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (217, 'BRG04150101.0215', 4, 15, 1, 1, '93317-325U0', 'Bearing Cyl-Cal Roller', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (218, 'BRG04180101.0216', 4, 18, 1, 1, '93332-000U3', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (219, 'BRG04180102.0217', 4, 18, 1, 2, '93341-41414', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (220, 'BRG04180102.0218', 4, 18, 1, 2, '93342-624U0', 'Bearing Thrust ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (221, 'BRG01070102.0219', 1, 7, 1, 2, '93310-620W5 / 620V5', 'Bearing Conrod', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (222, 'BRG01070103.0220', 1, 7, 1, 3, '93306-307U0 (koyo 6307 NYC3)', 'Bearing Atas', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (223, 'BRG04180103.0221', 4, 18, 1, 3, '93390-000U0 / AG 503001', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (224, 'BRG01070102.0222', 1, 7, 1, 2, '93310-727V7 (NTN 27x36x20.8)', 'Bearing Conrod', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (225, 'BRG01070103.0223', 1, 7, 1, 3, 'NTN 305X50NW3', 'Bearing tengah ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (226, 'BRG04180103.0224', 4, 18, 1, 3, '93342-624U0 (NTN.ARX23.8x44.7x11PX1)', 'Thrust bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (227, 'BRG01070103.0225', 1, 7, 1, 3, '93306-306U2 / 93306-306V5 (NTN TMB 306x12 JR 2W3C3)', 'Bearing Bawah ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (228, 'BRG01070103.0226', 1, 7, 1, 3, '83A209D-9TC3', 'Bearing Bawah ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (229, 'BRG01070103.0227', 1, 7, 1, 3, '83B716-9RC3', 'Bearing Bawah ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (230, 'BRG01070103.0228', 1, 7, 1, 3, '93332-000UE / NU-306EG1NRW33', 'Bearing Tengah', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (231, 'BRG01070103.0229', 1, 7, 1, 3, '93390-00009 / NU 305 X50G1NRW3C3 ', 'Bearing Bawah ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (232, 'BRG01070103.0230', 1, 7, 1, 3, '83A0709H', 'Bearing tengah', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (233, 'BRG04150103.0231', 4, 15, 1, 3, 'N5K M12649R/61', 'Bearing gear 1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (234, 'BRG04150103.0232', 4, 15, 1, 3, '93332-000V3 (Koyo JM205149/10) K1805', 'Bearing gear 1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (235, 'BRG04150103.0233', 4, 15, 1, 3, '93332-00005 / 4T-30205', 'Bearing gear 1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (236, 'BRG01070102.0234', 1, 7, 1, 2, '93306-205A1', 'Bearing 6205C3', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (237, 'BRG01070102.0235', 1, 7, 1, 2, '93390-00029', 'Bearing Tengah', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (238, 'BRG01070101.0236', 1, 7, 1, 1, '93310-727V7  ', 'Bearing conrod ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (239, 'BRG04180103.0237', 4, 18, 1, 3, '93332-000U0', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (240, 'BRG04150101.0238', 4, 15, 1, 1, '93306-001U1', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (241, 'BRG01070101.0239', 1, 7, 1, 1, '93306-205A1', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (242, 'BRG01070101.0240', 1, 7, 1, 1, '93306-206U5', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (243, 'BRG04150101.0241', 4, 15, 1, 1, '93317-22204', 'Bearing Cyl. Cal Roller ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (244, 'BRG01070101.0242', 1, 7, 1, 1, '93310-954U1', 'Bearing Cylindrical ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (245, 'BRG01070101.0243', 1, 7, 1, 1, '93306-208U0', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (246, 'BRG01070101.0244', 1, 7, 1, 1, '93306-306V1', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (247, 'BRG01070101.0245', 1, 7, 1, 1, '93310-836V2', 'Bearing Cyl. Cal Roller ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (248, 'BRG01070101.0246', 1, 7, 1, 1, '93310-730V8', 'Bearing Cyl. Cal Roller ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (249, 'BRG01070101.0247', 1, 7, 1, 1, '93310-835U8', 'Bearing Cyl. Cal Roller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (250, 'BRG01070101.0248', 1, 7, 1, 1, '93310-62406', 'Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (251, 'BRG01070101.0249', 1, 7, 1, 1, '93310-636U4', 'Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (252, 'BRG04180101.0250', 4, 18, 1, 1, '93315-32224', 'Bearing Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (253, 'BRG01070101.0251', 1, 7, 1, 1, '93310-836U0', 'Bearing Cylindrical ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (254, 'BRG01170101.0252', 1, 17, 1, 1, '93310-32337', 'Bearing Pin Piston ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (255, 'BRG01070101.0253', 1, 7, 1, 1, '93310-527W1', 'Bearing Cylindrical ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (256, 'BRG04180101.0254', 4, 18, 1, 1, '93315-430V5 / 93317-330U2', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (257, 'BRG04180101.0255', 4, 18, 1, 1, '93341-930V2', 'Bearing Thrust ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (258, 'BRG04180101.0256', 4, 18, 1, 1, '93311-83280', 'Bearing Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (259, 'BRG01070101.0257', 1, 7, 1, 1, '93311-940U3', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (260, 'BRG04180101.0258', 4, 18, 1, 1, '93341-440U5', 'Thrust Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (261, 'BRG04150101.0259', 4, 15, 1, 1, '93315-660W3', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (262, 'BRG04150101.0260', 4, 15, 1, 1, '93390-000U2', 'Bearing Roller', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (263, 'BRG04150103.0261', 4, 15, 1, 3, '93332-00003 / Koyo 70326 Hi-Cap 322/32', 'Bearing gear 1', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (264, 'BRG04180101.0262', 4, 18, 1, 1, '93332-00001', 'Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (265, 'BRG04180101.0263', 4, 18, 1, 1, '663-45552-00', 'Bearing Plain ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (266, 'BRG04180101.0264', 4, 18, 1, 1, '93315-324U1', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (267, 'BRG04180101.0265', 4, 18, 1, 1, '93315-314V8', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (268, 'BRG04150101.0266', 4, 15, 1, 1, '93315-317U2', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (269, 'BRG04180101.0267', 4, 18, 1, 1, '93315-217U0', 'Bearing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (270, 'BRG04180101.0268', 4, 18, 1, 1, '93390-000U0', 'Bearing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (271, 'BRG04150101.0269', 4, 15, 1, 1, '93332-000W1', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (272, 'BRG04150101.0270', 4, 15, 1, 1, '93332-00003', 'Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (273, 'BRG04180101.0271', 4, 18, 1, 1, '93311-928U5', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (274, 'BRG04150101.0272', 4, 15, 1, 1, '93306-209U0', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (275, 'BRG01070101.0273', 1, 7, 1, 1, '93306-305U3', 'Bearing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (276, 'BRG04160102.0274', 4, 16, 1, 2, '682-44352-00', 'Impeller ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (277, 'BRG04180102.0275', 4, 18, 1, 2, '90280-03005', 'Key Woodruff ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (278, 'BRG04180102.0276', 4, 18, 1, 2, '90280-03M03 / 03M07', 'Key Woodruff ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (279, 'BRG04180102.0277', 4, 18, 1, 2, '626-45316-09', 'Bushing D/Shaft Y15', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (280, 'BRG04180102.0278', 4, 18, 1, 2, '90179-08M06', 'Nut Pinion ', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (281, 'BRG04150102.0279', 4, 15, 1, 2, '683-45361-01-4D', 'Cap Lower Casing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (282, 'BRG04200102.0280', 4, 20, 1, 2, '91490-30020', 'Pin Cotter Y15', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (283, 'BRG04200102.0281', 4, 20, 1, 2, '683-45945-00-EL', 'Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (284, 'BRG04200102.0282', 4, 20, 1, 2, '63V-45945-00-EL', 'Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (285, 'BRG04210102.0283', 4, 21, 1, 2, '6F5-45611-00', 'Shaft propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (286, 'BRG04150102.0284', 4, 15, 1, 2, '697-45384-02', 'Nut Turbo ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (287, 'BRG04200102.0285', 4, 20, 1, 2, '676-45616-01', 'Nut Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (288, 'BRG01140102.0286', 1, 14, 1, 2, '6G1-24412-00', 'Fuel Pump Body Y15', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (289, 'BRG01140102.0287', 1, 14, 1, 2, '61N-24560-00', 'Fuel Filter Assy Y8-40', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (290, 'BRG03220102.0288', 3, 22, 1, 2, '682-44514-01-94', 'Mount Damper ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (291, 'BRG03220102.0289', 3, 22, 1, 2, '679-44555-00-94', 'Mount Damper besar Y40', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (292, 'BRG03220102.0290', 3, 22, 1, 2, '679-44514-00-94', 'Mount Damper kecil', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (293, 'BRG04180102.0291', 4, 18, 1, 2, '676-45501-10', 'Drive Shaft Long ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (294, 'BRG04180102.0292', 4, 18, 1, 2, '679-45501-10', 'Drive shaft comp long', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (295, 'BRG04150102.0293', 4, 15, 1, 2, '676-45361-00-94', 'Cap Lower Assy ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (296, 'BRG04200102.0294', 4, 20, 1, 2, '90250-07M00', 'Pin Straight ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (297, 'BRG01170102.0295', 1, 17, 1, 2, '90209-27M11', 'Washer ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (298, 'BRG04200102.0296', 4, 20, 1, 2, '91490-40040', 'Pin Cotter ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (299, 'BRG04200102.0297', 4, 20, 1, 2, '663-45945-02-EL', 'Propeller 13\" Omax', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (300, 'BRG04200102.0298', 4, 20, 1, 2, '676-45941-62-EL', 'Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (301, 'BRG04200102.0299', 4, 20, 1, 2, '664-45945-00-EL', 'Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (302, 'BRG01040102.0300', 1, 4, 1, 2, '6B4-15396-00-94', 'Housing Oil Seal Y15', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (303, 'BRG02260102.0301', 2, 26, 1, 2, '6B4-85520-10', 'Coil Charge ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (304, 'BRG02260102.0302', 2, 26, 1, 2, '6B4-85570-00', 'Ignition Coil ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (305, 'BRG02260102.0303', 2, 26, 1, 2, '6F5-85570-11', 'Ignition Coil', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (306, 'BRG01130102.0304', 1, 13, 1, 2, '6B4-26301-00', 'Cable Throttle ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (307, 'BRG01130102.0305', 1, 13, 1, 2, '662-26311-03', 'Cable Throttle ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (308, 'BRG01140102.0306', 1, 14, 1, 2, '6A0-24412-02', 'Fuel Pump Body ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (309, 'BRG02230102.0307', 2, 23, 1, 2, '6F5-15713-00', 'Spring Stater ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (310, 'BRG02250102.0308', 2, 25, 1, 2, '6F6-85540-01', 'CDI Unit NEW', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (311, 'BRG01130102.0309', 1, 13, 1, 2, '6F5-26311-00', 'Cable Throttle ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (312, 'BRG03100102.0310', 3, 10, 1, 2, '6J8-43131-10', 'Bolt Clamp Bracket ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (313, 'BRG05240102.0311', 5, 24, 1, 2, '6R5-41237-00', 'Joint Link ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (314, 'BRG03100102.0312', 3, 10, 1, 2, '90101-12M37', 'Bolt & Nut Handle KIT ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (315, 'BRG02230102.0313', 2, 23, 1, 2, '90510-08M04', 'Spring Spiral Y8-25', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (316, 'BRG02260102.0314', 2, 26, 1, 2, '6F5-85520-10', 'Coil Charge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (317, 'BRG02260102.0315', 2, 26, 1, 2, '6F5-85520-01', 'Coil Charge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (318, 'BRG01050102.0316', 1, 5, 1, 2, '6F5-14390-21', 'Needle Valve ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (319, 'BRG04180102.0317', 4, 18, 1, 2, '6B4-45501-10', 'Drive Shaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (320, 'BRG02250102.0318', 2, 25, 1, 2, '6F6-85540-20', 'CDI ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (321, 'BRG04200102.0319', 4, 20, 1, 2, '663-45930-00 / SS', 'Propeller solas 14\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (322, 'BRG04200102.0320', 4, 20, 1, 2, '663-45970-60', 'Propeller solas 12\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (323, 'BRG04200102.0321', 4, 20, 1, 2, '688-45930-02', 'Propeller solas 17\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (324, 'BRG04200102.0322', 4, 20, 1, 2, '663-45952-00-EL', 'Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (325, 'BRG02090102.0323', 2, 9, 1, 2, '6F6-82590-00', 'Cable Body ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (326, 'BRG02260102.0324', 2, 26, 1, 2, '66T-85520-00', 'Coil Charge Y40', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (327, 'BRG04160102.0325', 4, 16, 1, 2, '6H4-44352-02', 'Impeller ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (328, 'BRG01040102.0326', 1, 4, 1, 2, 'BKR6E', 'Busi', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (329, 'BRG01040102.0327', 1, 4, 1, 2, 'B8HS-10', 'Busi ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (330, 'BRG02090102.0328', 2, 9, 1, 2, '6E9-82575-02', 'Engine Stop Assy ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (331, 'BRG01070102.0329', 1, 7, 1, 2, '6F5-11515-00', 'Seal Labyrinth ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (332, 'BRG02260102.0330', 2, 26, 1, 2, '66T-85570-00', 'Ignition Coil ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (333, 'BRG01140102.0331', 1, 14, 1, 2, '663-24411-00', 'Diaphragm ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (334, 'BRG04160102.0332', 4, 16, 1, 2, '6F5-44352-00', 'Impeller ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (335, 'BRG04200102.0333', 4, 20, 1, 2, '6F6-45614-00', 'Pin drive', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (336, 'BRG02250102.0334', 2, 25, 1, 2, '6F5-85540-22', 'CDI', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (337, 'BRG04210102.0335', 4, 21, 1, 2, '66T-45611-00', 'Shaft propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (338, 'BRG01040102.0336', 1, 4, 1, 2, '66T-42610-00', 'Top cowling 40X bulat', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (339, 'BRG01040102.0337', 1, 4, 1, 2, '6J4-42610-00', 'Top cowling 40J/lama', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (340, 'BRG01040102.0338', 1, 4, 1, 2, '6B4-42610-00', 'Top cowling 15HP', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (341, 'BRG01140102.0339', 1, 14, 1, 2, '6A0-24410-05 / 692-24410-00', 'Fuel Pump Assy ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (342, 'BRG04200102.0340', 4, 20, 1, 2, '90171-16011', 'Nut castle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (343, 'BRG02260102.0341', 2, 26, 1, 2, '62E-82371-11', 'Plug cap  ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (344, 'BRG02250102.0342', 2, 25, 1, 2, '6B4-85540-01 (Omax)', 'CDI Unit Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (345, 'BRG02260102.0343', 2, 26, 1, 2, '6F5-85520-10 (Omax)', 'Coil Charge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (346, 'BRG01050102.0344', 1, 5, 1, 2, '6F6-14301-00', 'Carburator Y40', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (347, 'BRG05120102.0345', 5, 12, 1, 2, '6Y1-24360-02', 'Primary Pump ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (348, 'BRG01130102.0346', 1, 13, 1, 2, '63W-13610-00', 'Reed valve assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (349, 'BRG02090102.0347', 2, 9, 1, 2, '66T-82519-00', 'Wire earth lead', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (350, 'BRG04160101.0348', 4, 16, 1, 1, '6D8-WS443-00', 'Housing Water Pump ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (351, 'BRG02250101.0349', 2, 25, 1, 1, '6F6-85540-01', 'CDI', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (352, 'BRG02250101.0350', 2, 25, 1, 1, '6F5-85540-23', 'CDI unit  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (353, 'BRG04200101.0351', 4, 20, 1, 1, '663-45970-60-98', 'Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (354, 'BRG02230101.0352', 2, 23, 1, 1, '6F5-15779-02', 'Cover', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (355, 'BRG02230101.0353', 2, 23, 1, 1, '6G1-15779-00', 'Cover', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (356, 'BRG02230101.0354', 2, 23, 1, 1, '689-15755-01', 'Handle Starter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (357, 'BRG02230101.0355', 2, 23, 1, 1, '6G1-15755-00', 'Handle Starter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (358, 'BRG04200101.0356', 4, 20, 1, 1, '69W-45945-00', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (359, 'BRG01040101.0357', 1, 4, 1, 1, '64D-41111-00-1S', 'Inner Cover Exhaust', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (360, 'BRG01040101.0358', 1, 4, 1, 1, '6F5-41111-01-1S', 'Inner Cover Exhaust', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (361, 'BRG02230101.0359', 2, 23, 1, 1, '6F5-15713-01', 'Spring Stater ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (362, 'BRG05270102.0360', 5, 27, 1, 2, 'SM 40 B GREY', 'Sarung mesin 40 KAPSUL (grey)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (363, 'BRG05270102.0361', 5, 27, 1, 2, 'SM 40 L GREY ', 'Sarung mesin 40 KOTAK (grey)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (364, 'BRG05270102.0362', 5, 27, 1, 2, 'SM 15BMHL BLACK', 'Sarung mesin 15HP (Black)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (365, 'BRG05240101.0363', 5, 24, 1, 1, '703 (7 pin)', 'Remote control assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (366, 'BRG05240101.0364', 5, 24, 1, 1, '703-48345-01', 'Cable end & remote control', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (367, 'BRG05280100.0365', 5, 28, 1, NULL, NULL, 'Cable steer (3mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (368, 'BRG05280100.0366', 5, 28, 1, NULL, 'CS-TX-13FT', 'Cable Steer TX 13FT (3,96 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (369, 'BRG05280100.0367', 5, 28, 1, NULL, 'CS-TX-17FT', 'Cable Steer TX 17FT (5,18 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (370, 'BRG05280100.0368', 5, 28, 1, NULL, 'CS-TX-20FT', 'Cable Steer TX 20FT (6 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (371, 'BRG05280100.0369', 5, 28, 1, NULL, 'CS-TX-7M', 'Cable steer (7 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (372, 'BRG05280100.0370', 5, 28, 1, NULL, 'CS-TX-8M', 'Cable steer (8mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (373, 'BRG05290100.0371', 5, 29, 1, NULL, 'CR-TX-10FT', 'Cable remote TX10FT (3 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (374, 'BRG05290100.0372', 5, 29, 1, NULL, 'CR-TX-13FT', 'Cable remote TX 13FT (3,96 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (375, 'BRG05290100.0373', 5, 29, 1, NULL, 'CR-TLF-13FT', 'Cable remote TLF 13FT (3,96 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (376, 'BRG05290100.0374', 5, 29, 1, NULL, 'CR-TX-17FT', 'Cable remote TX 17FT (5,18 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (377, 'BRG05290100.0375', 5, 29, 1, NULL, 'CR-TX-18FT', 'Cable remote TX 18FT (5,48 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (378, 'BRG05290100.0376', 5, 29, 1, NULL, 'CR-TX-20FT', 'Cable remote TX 20FT (6,09 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (379, 'BRG05290100.0377', 5, 29, 1, NULL, 'CR-TX-23FT', 'Cable remote TX 23FT (7 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (380, 'BRG05290100.0378', 5, 29, 1, NULL, 'CR-TLF-23FT', 'Cable remote TLF 23FT (7 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (381, 'BRG05290100.0379', 5, 29, 1, NULL, 'CR-TX-26FT', 'Cable remote TX C33 26FT (8 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (382, 'BRG05290100.0380', 5, 29, 1, NULL, 'CR-PROMARINE', 'Cable remote (6 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (383, 'BRG05290100.0381', 5, 29, 1, NULL, 'CR-PROMARINE', 'Cable remote (9 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (384, 'BRG05290100.0382', 5, 29, 1, NULL, 'CCX63214', 'Cable remote seastar 14FT (4,2mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (385, 'BRG05290100.0383', 5, 29, 1, NULL, NULL, 'Cable remote seastar 20FT (6,09mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (386, 'BRG05290100.0384', 5, 29, 1, NULL, 'CCX63224', 'Cable remote seastar 24FT (7,3mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (387, 'BRG05290100.0385', 5, 29, 1, NULL, NULL, 'Cable remote seastar 30FT (9,1mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (388, 'BRG05290100.0386', 5, 29, 1, NULL, NULL, 'Cable remote seastar 34FT (10,3mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (389, 'BRG01130101.0387', 1, 13, 1, 1, '6L2-26301-01', 'Cable Throttle ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (390, 'BRG05280100.0388', 5, 28, 1, NULL, NULL, 'Tie bar yamaha', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (391, 'BRG05240000.0389', 5, 24, NULL, NULL, 'ACC-REMOTE MLD', 'Remote morse double', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (392, 'BRG05240000.0390', 5, 24, NULL, NULL, 'ACC-REMOTE MLS', 'Remote morse single', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (393, 'BRG05240000.0391', 5, 24, NULL, NULL, NULL, 'Remote Teleflex single', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (394, 'BRG05280100.0392', 5, 28, 1, NULL, 'ACC-HELM D290 C', 'Helm rotary system (komplite)', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (395, 'BRG05280100.0393', 5, 28, 1, NULL, 'ACC-BEZEL 90 DE / 292842', 'Helm Bezel 90DEG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (396, 'BRG05280100.0394', 5, 28, 1, NULL, 'ACC-TIE BAR SLS', 'Tie bar selongsong', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (397, 'BRG05280000.0395', 5, 28, NULL, NULL, 'ACC-STEER MORS', 'Steer plastik', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (398, 'BRG05290000.0396', 5, 29, NULL, NULL, 'ACC-NYLON TUBE', 'Nylon Tubing 3/8\" /mtr (selang p.steering)', 'mtr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (399, 'BRG02230000.0397', 2, 23, NULL, NULL, 'ACC-ROPE KIT AC', 'Stater Rope KITACO ', 'mtr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (400, 'BRG05290000.0398', 5, 29, NULL, NULL, 'ACC-NYLON HYNA ', 'Morse Hynautic Hose MSH560', 'mtr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (401, 'BRG05280000.0399', 5, 28, NULL, NULL, '292525', 'Helm', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (402, 'BRG05120000.0400', 5, 12, NULL, NULL, NULL, 'Fuel Hose 6MM/mtr', 'mtr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (403, 'BRG05280000.0401', 5, 28, NULL, NULL, 'ACC-PULLY', 'Roda Pully roll baut', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (404, 'BRG01070101.0402', 1, 7, 1, 1, '6F5-11442-11', 'Crank 4', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (405, 'BRG04200101.0403', 4, 20, 1, 1, '663-45954-01', 'Propeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (406, 'BRG01170101.0404', 1, 17, 1, 1, '90201-20417', 'Washer plate', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (407, 'BRG01170101.0405', 1, 17, 1, 1, '90209-20M23', 'Washer (6M7)', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (408, 'BRG01170101.0406', 1, 17, 1, 1, '90209-24M03', 'Washer plate', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (409, 'BRG02260101.0407', 2, 26, 1, 1, '6F5-85520-10', 'Coil Charge ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (410, 'BRG02260101.0408', 2, 26, 1, 1, '66T-85520-00', 'Coil Charge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (411, 'BRG02260101.0409', 2, 26, 1, 1, '6B4-85520-00', 'Coil Charge ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (412, 'BRG02300101.0410', 2, 30, 1, 1, '6F5-85580-10', 'Coil Pulser ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (413, 'BRG02300101.0411', 2, 30, 1, 1, '6F5-85580-20', 'Coil Pulser ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (414, 'BRG02300101.0412', 2, 30, 1, 1, '6B4-85580-00', 'Coil Pulser ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (415, 'BRG02300101.0413', 2, 30, 1, 1, '66T-85596-00', 'Coil Pulser ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (416, 'BRG01130101.0414', 1, 13, 1, 1, '6F5-26311-00', 'Cable Throttle ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (417, 'BRG03220101.0415', 3, 22, 1, 1, '679-44514-00-94', 'Mount Damper kecil', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (418, 'BRG03220101.0416', 3, 22, 1, 1, '676-44518-00', 'Bracket 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (419, 'BRG01040101.0417', 1, 4, 1, 1, '6F5-41662-00', 'Bracket', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (420, 'BRG05280101.0418', 5, 28, 1, 1, '65W-48511-01', 'Hook steering', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (421, 'BRG03220101.0419', 3, 22, 1, 1, '676-44511-00', 'Cover Upper Mount ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (422, 'BRG04160101.0420', 4, 16, 1, 1, '6E5-44352-01', 'Impeller ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (423, 'BRG01170101.0421', 1, 17, 1, 1, '90201-14377', 'Washer Pin Piston', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (424, 'BRG01040101.0422', 1, 4, 1, 1, '676-45251-00', 'Anode ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (425, 'BRG01040101.0423', 1, 4, 1, 1, '676-11325-00', 'Anode ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (426, 'BRG04310101.0424', 4, 31, 1, 1, '6CE-45373-00', 'Anode ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (427, 'BRG01140101.0425', 1, 14, 1, 1, '692-24410-00', 'Fuel Pump Assy ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (428, 'BRG03220101.0426', 3, 22, 1, 1, '676-44512-00', 'Cover Upper Mount ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (429, 'BRG04150101.0427', 4, 15, 1, 1, '6G5-45384-02', 'Nut Turbo ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (430, 'BRG04160101.0428', 4, 16, 1, 1, '688-44322-00', 'Insert Cartridge ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (431, 'BRG04160101.0429', 4, 16, 1, 1, '688-44352-03', 'Impeller ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (432, 'BRG04160101.0430', 4, 16, 1, 1, '63V-44352-01', 'Impeller', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (433, 'BRG04160101.0431', 4, 16, 1, 1, '688-44323-00', 'Outter Plate Cartridge ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (434, 'BRG05240101.0432', 5, 24, 1, 1, '6H3-48538-00', 'Clamp Cable', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (435, 'BRG05240101.0433', 5, 24, 1, 1, '90468-18008', 'Circlip ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (436, 'BRG05240101.0434', 5, 24, 1, 1, '6F5-48345-00', 'Cable End ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (437, 'BRG05240101.0435', 5, 24, 1, 1, '6FM-48344-00 / 663-48344-00', 'Cable end & remote control', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (438, 'BRG05240101.0436', 5, 24, 1, 1, '6F5-48538-00', 'Clamp Cable', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (439, 'BRG05240101.0437', 5, 24, 1, 1, '6R5-41237-00', 'Joint Link ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (440, 'BRG03190101.0438', 3, 19, 1, 1, '6H1-43861-10', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (441, 'BRG03190101.0439', 3, 19, 1, 1, '69J-43822-00', 'Seal Trim Dust ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (442, 'BRG03190101.0440', 3, 19, 1, 1, '61A-43821-09', 'Screw Trim Cylinder ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (443, 'BRG01040101.0441', 1, 4, 1, 1, '67F-12411-01', 'Thermostat ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (444, 'BRG04160101.0442', 4, 16, 1, 1, '6H4-44352-02', 'Impeller ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (445, 'BRG04160101.0443', 4, 16, 1, 1, '6F5-44352-00', 'Impeller', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (446, 'BRG04160101.0444', 4, 16, 1, 1, '682-44352-03', 'Impeller', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (447, 'BRG05240101.0445', 5, 24, 1, 1, '704-82563-42', 'Trim & Tilt Switch Assy ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (448, 'BRG04180101.0446', 4, 18, 1, 1, '90280-04M05', 'Key Woodruff ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (449, 'BRG04180101.0447', 4, 18, 1, 1, '90170-16M01', 'Nut ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (450, 'BRG04200101.0448', 4, 20, 1, 1, '688-45987-01', 'Spacer ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (451, 'BRG01130101.0449', 1, 13, 1, 1, '6E5-11370-01', 'Check Valve Assy ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (452, 'BRG04150101.0450', 4, 15, 1, 1, '648-44146-00', 'Connector Shift Rod ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (453, 'BRG04150101.0451', 4, 15, 1, 1, '61N-44146-00', 'Connector Shift Rod ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (454, 'BRG02080101.0452', 2, 8, 1, 1, '90280-05049 / 90280-05015', 'Key Woodruff ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (455, 'BRG04180101.0453', 4, 18, 1, 1, '90280-03024', 'Key Woodruff ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (456, 'BRG04180101.0454', 4, 18, 1, 1, '679-45536-00', 'Sleeve Drive Shaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (457, 'BRG04180101.0455', 4, 18, 1, 1, '6H4-45536-00', 'Sleeve Drive Shaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (458, 'BRG04180101.0456', 4, 18, 1, 1, '6E7-45536-00', 'Sleeve Drive Shaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (459, 'BRG04180101.0457', 4, 18, 1, 1, '6G5-45536-01', 'Sleeve Drive Shaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (460, 'BRG04180101.0458', 4, 18, 1, 1, '676-45536-00', 'Sleeve Drive Shaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (461, 'BRG04180101.0459', 4, 18, 1, 1, '61N-45536-00', 'Sleeve Drive Shaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (462, 'BRG04180101.0460', 4, 18, 1, 1, '663-45587-01', 'Shim ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (463, 'BRG04160101.0461', 4, 16, 1, 1, '676-44311-00', 'Housing Water Pump ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (464, 'BRG04160101.0462', 4, 16, 1, 1, '99999-03916', 'Housing Water Pump Set', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (465, 'BRG04150101.0463', 4, 15, 1, 1, '90280-04M00', 'Key Woodruff ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (466, 'BRG04160101.0464', 4, 16, 1, 1, '93210-41042', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (467, 'BRG04160101.0465', 4, 16, 1, 1, '93210-46044', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (468, 'BRG04150101.0466', 4, 15, 1, 1, '93210-85M97', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (469, 'BRG02080101.0467', 2, 8, 1, 1, '93210-75M51', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (470, 'BRG01040101.0468', 1, 4, 1, 1, '93210-46M16', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (471, 'BRG04150101.0469', 4, 15, 1, 1, '93210-97M55', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (472, 'BRG04150101.0470', 4, 15, 1, 1, '93210-74775 / 93210-74MG5', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (473, 'BRG04180101.0471', 4, 18, 1, 1, '90170-12138', 'Nut Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (474, 'BRG04180101.0472', 4, 18, 1, 1, '90179-08M06', 'Nut Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (475, 'BRG01040101.0473', 1, 4, 1, 1, '94702-00160', 'Busi B8HS-10', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (476, 'BRG01040101.0474', 1, 4, 1, 1, '94702-00400', 'Busi LFR6A-11', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (477, 'BRG04150101.0475', 4, 15, 1, 1, '93210-66M98', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (478, 'BRG04150101.0476', 4, 15, 1, 1, '93210-69MG6', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (479, 'BRG04180101.0477', 4, 18, 1, 1, '93210-48MG8', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (480, 'BRG04160101.0478', 4, 16, 1, 1, '93210-59MG7', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (481, 'BRG01040101.0479', 1, 4, 1, 1, '93210-65M50', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (482, 'BRG01040101.0480', 1, 4, 1, 1, '93210-22M02', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (483, 'BRG04160101.0481', 4, 16, 1, 1, '93210-86M38', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (484, 'BRG03190101.0482', 3, 19, 1, 1, '6G5-43865-01', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (485, 'BRG03190101.0483', 3, 19, 1, 1, '64E-43868-00', 'O-ring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (486, 'BRG01050101.0484', 1, 5, 1, 1, '6F5-14397-00', 'O-ring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (487, 'BRG03220101.0485', 3, 22, 1, 1, '63V-W4451-01-CA', 'Mount Damper Besar', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (488, 'BRG04160101.0486', 4, 16, 1, 1, '63V-44361-11', 'Tube Water', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (489, 'BRG04150101.0487', 4, 15, 1, 1, '650-44147-00', 'Boot Shift Rod ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (490, 'BRG04310101.0488', 4, 31, 1, 1, '679-45371-00', 'Trim Tab ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (491, 'BRG04100101.0489', 4, 10, 1, 1, '676-43111-04-8D', 'Bracket Clamp ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (492, 'BRG03100101.0490', 3, 10, 1, 1, '676-43613-01', 'Arm Tilt Lock ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (493, 'BRG01040101.0491', 1, 4, 1, 1, '6G5-11372-00-1S', 'Cover Bypass ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (494, 'BRG04180101.0492', 4, 18, 1, 1, '676-45533-00', 'Washer Thrust ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (495, 'BRG01040101.0493', 1, 4, 1, 1, '665-11372-00-1S', 'Cover bypass 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (496, 'BRG04160101.0494', 4, 16, 1, 1, '682-44361-01', 'Tube Water ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (497, 'BRG04160101.0495', 4, 16, 1, 1, '682-44361-10', 'Tube Water', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (498, 'BRG04310101.0496', 4, 31, 1, 1, '6B4-45251-00', 'Anode ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (499, 'BRG04310101.0497', 4, 31, 1, 1, '6F5-45251-02', 'Anode ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (500, 'BRG04200101.0498', 4, 20, 1, 1, '90171-10M01', 'Nut castle 683', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (501, 'BRG04310101.0499', 4, 31, 1, 1, '6G5-45251-02', 'Anode ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (502, 'BRG02260101.0500', 2, 26, 1, 1, '6F6-85530-01', 'Ignition Coil', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (503, 'BRG02260101.0501', 2, 26, 1, 1, '66T-85570-00', 'Ignition Coil ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (504, 'BRG04310101.0502', 4, 31, 1, 1, '6J9-45371-01', 'Trim Tab ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (505, 'BRG04310101.0503', 4, 31, 1, 1, '6K1-45371-02', 'Trim Tab ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (506, 'BRG05120101.0504', 5, 12, 1, 1, '6Y1-24360-52', 'Primary Pump ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (507, 'BRG05120101.0505', 5, 12, 1, 1, '6Y2-24360-60', 'Primary Pump ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (508, 'BRG04150101.0506', 4, 15, 1, 1, '90105-06M01', 'Bolt ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (509, 'BRG03100101.0507', 3, 10, 1, 1, '97095-08040', 'Bolt', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (510, 'BRG03100101.0508', 3, 10, 1, 1, '97080-08030', 'Bolt', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (511, 'BRG01130101.0509', 1, 13, 1, 1, '66T-26301-00', 'Cable Throttle ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (512, 'BRG04150101.0510', 4, 15, 1, 1, '6B4-44147-00', 'Boot Shift Rod ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (513, 'BRG04180101.0511', 4, 18, 1, 1, '90209-14011', 'Washer ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (514, 'BRG04180101.0512', 4, 18, 1, 1, '6E8-45587-10', 'Shim 1.13MM', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (515, 'BRG04180101.0513', 4, 18, 1, 1, '90201-15017', 'Washer plate', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (516, 'BRG04150101.0514', 4, 15, 1, 1, '90149-06M00', 'Screw  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (517, 'BRG04160101.0515', 4, 16, 1, 1, '682-44300-40', 'Housing Water Pump ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (518, 'BRG04180101.0516', 4, 18, 1, 1, '682-45344-00', 'Cover Oil Seal ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (519, 'BRG04150101.0517', 4, 15, 1, 1, '6E7-45331-00-CA', 'Housing Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (520, 'BRG04150101.0518', 4, 15, 1, 1, '93210-57M09', 'O-ring ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (521, 'BRG04150101.0519', 4, 15, 1, 1, '93210-56M80', 'O-ring ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (522, 'BRG04150101.0520', 4, 15, 1, 1, '679-45331-00-94', 'Housing Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (523, 'BRG01050101.0521', 1, 5, 1, 1, '6E5-14546-00', 'Needle Valve ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (524, 'BRG02090101.0522', 2, 9, 1, 1, '66T-82575-01', 'Engine Stop Switch ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (525, 'BRG04150101.0523', 4, 15, 1, 1, '688-45384-02', 'Nut Turbo ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (526, 'BRG04150101.0524', 4, 15, 1, 1, '697-45384-02', 'Nut Turbo ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (527, 'BRG04200101.0525', 4, 20, 1, 1, '90171-16011', 'Nut', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (528, 'BRG02090101.0526', 2, 9, 1, 1, '6E9-82575-02', 'Engine Stop Switch ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (529, 'BRG01130101.0527', 1, 13, 1, 1, '6F6-11370-01', 'Check Valve Assy ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (530, 'BRG01040101.0528', 1, 4, 1, 1, '688-11370-01', 'Check Valve Assy ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (531, 'BRG01040101.0529', 1, 4, 1, 1, '650-11370-01', 'Check Valve Assy ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (532, 'BRG04150101.0530', 4, 15, 1, 1, '682-45331-00-5B', 'Housing Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (533, 'BRG01050101.0531', 1, 5, 1, 1, '692-14590-01', 'Valve assy', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (534, 'BRG01050101.0532', 1, 5, 1, 1, '647-14342-45', 'Jet Pilot ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (535, 'BRG01050101.0533', 1, 5, 1, 1, '6F6-14385-00', 'Float ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (536, 'BRG01050101.0534', 1, 5, 1, 1, '6E5-14385-01', 'Float ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (537, 'BRG01050101.0535', 1, 5, 1, 1, '6F5-14387-00', 'Arm float ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (538, 'BRG01050101.0536', 1, 5, 1, 1, '1J2-14398-00', 'Packing ', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (539, 'BRG01050101.0537', 1, 5, 1, 1, '677-14343-75', 'Jet Main ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (540, 'BRG01050101.0538', 1, 5, 1, 1, '6F5-14390-21', 'Needle Valve ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (541, 'BRG01050101.0539', 1, 5, 1, 1, '6C5-14546-10', 'Needle Valve ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (542, 'BRG01040101.0540', 1, 4, 1, 1, '93410-16400 / 99009-16400', 'Circlip ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (543, 'BRG01040101.0541', 1, 4, 1, 1, '93410-32075', 'Circlip ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (544, 'BRG04180101.0542', 4, 18, 1, 1, '676-45587-00', 'Shim 0,70 MM', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (545, 'BRG04150101.0543', 4, 15, 1, 1, '676-45314-00', 'Seal Lower Casing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (546, 'BRG01170101.0544', 1, 17, 1, 1, '90209-27011 / 90209-27M11 / 90209-27012', 'Washer pin crank', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (547, 'BRG01070101.0545', 1, 7, 1, 1, '6F5-11515-00', 'Seal Labyrinth ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (548, 'BRG02230101.0546', 2, 23, 1, 1, '90385-12M04', 'Bushing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (549, 'BRG03100101.0547', 3, 10, 1, 1, '90386-52M02', 'Bushing ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (550, 'BRG04150101.0548', 4, 15, 1, 1, '90501-16M11', 'Spring compression', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (551, 'BRG02230101.0549', 2, 23, 1, 1, '63V-15741-00', 'Pawl Drive ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (552, 'BRG03100101.0550', 3, 10, 1, 1, '90480-09M21', 'Grommet (6E9)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (553, 'BRG03100101.0551', 3, 10, 1, 1, '90480-20M05', 'Grommet ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (554, 'BRG03100101.0552', 3, 10, 1, 1, '90387-06M41', 'Collar ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (555, 'BRG03100101.0553', 3, 10, 1, 1, '90387-08M05', 'Collar 663', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (556, 'BRG04200101.0554', 4, 20, 1, 1, '91490-30030', 'Pin cotter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (557, 'BRG04200101.0555', 4, 20, 1, 1, '91490-40030', 'Pin cotter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (558, 'BRG02250101.0556', 2, 25, 1, 1, '66T-85540-02', 'CDI ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (559, 'BRG04180101.0557', 4, 18, 1, 1, '90280-03M03 / 03M07', 'Key Woodruff ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (560, 'BRG02080101.0558', 2, 8, 1, 1, '90280-16053', 'Key Woodruff ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (561, 'BRG03220101.0559', 3, 22, 1, 1, '66T-44514-00', 'Mount Damper ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (562, 'BRG03100101.0560', 3, 10, 1, 1, '90101-08M86', 'Bolt 6H4', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (563, 'BRG03220101.0561', 3, 22, 1, 1, '90185-08018 / 08045', 'Nut ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (564, 'BRG04310101.0562', 4, 31, 1, 1, '664-45371-00', 'Trim Tab ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (565, 'BRG04310101.0563', 4, 31, 1, 1, '67F-45371-00', 'Trim Tab ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (566, 'BRG04310101.0564', 4, 31, 1, 1, '688-45371-02', 'Trim Tab ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (567, 'BRG03220101.0565', 3, 22, 1, 1, '679-44555-00 / 62Y-44555-00', 'Mount Damper besar ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (568, 'BRG03100101.0566', 3, 10, 1, 1, '90185-22M11 / 90185-22007', 'Nut ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (569, 'BRG04160101.0567', 4, 16, 1, 1, '6H3-44352-00', 'Impeller', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (570, 'BRG04160101.0568', 4, 16, 1, 1, '679-44341-00', 'Housing Water Pump ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (571, 'BRG04200101.0569', 4, 20, 1, 1, '664-45945-00', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (572, 'BRG04200101.0570', 4, 20, 1, 1, '6E5-45945-01', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (573, 'BRG04200101.0571', 4, 20, 1, 1, '63V-45945-10', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (574, 'BRG04160101.0572', 4, 16, 1, 1, '6CE-44352-00', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (575, 'BRG02320101.0573', 2, 32, 1, 1, '68V-8194A-00', 'Relay assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (576, 'BRG02320101.0574', 2, 32, 1, 1, '68F-8195A-00', 'Relay assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (577, 'BRG02320101.0575', 2, 32, 1, 1, '61A-81950-01', 'Relay assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (578, 'BRG05280101.0576', 5, 28, 1, 1, 'Z-NEPEL-690961', 'Nepel cincin power steering 3/8', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (579, 'BRG03100101.0577', 3, 10, 1, 1, '6F5-42815-01-8D', 'Lever, Clamp', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (580, 'BRG03100101.0578', 3, 10, 1, 1, '6J8-43131-10', 'Bolt', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (581, 'BRG03100101.0579', 3, 10, 1, 1, '676-44521-00', 'Seal damper 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (582, 'BRG04210101.0580', 4, 21, 1, 1, '6F5-45611-01', 'Shaft Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (583, 'BRG02260101.0581', 2, 26, 1, 1, '6F5-85570-13', 'Ignition coil assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (584, 'BRG02090101.0582', 2, 9, 1, 1, '704-82570-12', 'Panel Switch assy ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (585, 'BRG02260101.0583', 2, 26, 1, 1, '663-82370-01', 'Plug cap assy', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (586, 'BRG04160101.0584', 4, 16, 1, 1, '682-44367-00', 'Rubber water seal 3', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (587, 'BRG04160101.0585', 4, 16, 1, 1, '682-44366-00', 'Water seal 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (588, 'BRG01050101.0586', 1, 5, 1, 1, '6F5-14370-02', 'Plunger pump assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (589, 'BRG04150101.0587', 4, 15, 1, 1, '676-45635-00', 'Plunger  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (590, 'BRG03190101.0588', 3, 19, 1, 1, '64E-4380F-00', 'Holder brush 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (591, 'BRG03190101.0589', 3, 19, 1, 1, '64E-43892-00', 'Brush 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (592, 'BRG03190101.0590', 3, 19, 1, 1, '64E-43891-00', 'Brush 1 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (593, 'BRG02230101.0591', 2, 23, 1, 1, '663-81840-11', 'Brush holder assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (594, 'BRG02230101.0592', 2, 23, 1, 1, '6E5-81840-10', 'Brush holder assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (595, 'BRG03100101.0593', 3, 10, 1, 1, '90101-08M02', 'Bolt, Hexagon (676)', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (596, 'BRG03100101.0594', 3, 10, 1, 1, '90101-12M01', 'Bolt, Hexagon (676)', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (597, 'BRG02320101.0595', 2, 32, 1, 1, '6G1-81941-10', 'Stater relay Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (598, 'BRG01170101.0596', 1, 17, 1, 1, '90109-08022', 'Bolt', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (599, 'BRG04180101.0597', 4, 18, 1, 1, '69J-45501-00', 'Drive shaft comp  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (600, 'BRG01170101.0598', 1, 17, 1, 1, '6E5-11650-01', 'Conrod', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (601, 'BRG01040101.0599', 1, 4, 1, 1, '60H-12416-00', 'Valve, pressure conrod', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (602, 'BRG04160101.0600', 4, 16, 1, 1, '676-44361-10', 'Tube water long ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (603, 'BRG05120101.0601', 5, 12, 1, 1, '6G1-24305-05', 'Fuel pipe joint', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (604, 'BRG05120101.0602', 5, 12, 1, 1, '6Y2-24305-06', 'Fuel pipe joint', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (605, 'BRG05120101.0603', 5, 12, 1, 1, '6Y1-24305-06', 'Fuel pipe joint', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (606, 'BRG04160101.0604', 4, 16, 1, 1, '683-44362-01', 'Tube water 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (607, 'BRG04160101.0605', 4, 16, 1, 1, '683-44365-01', 'Damper seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (608, 'BRG01050101.0606', 1, 5, 1, 1, '6F6-14301-06', 'Carburator assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (609, 'BRG01050101.0607', 1, 5, 1, 1, '688-14301-42', 'Carburator 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (610, 'BRG01050101.0608', 1, 5, 1, 1, '688-14302-40', 'Carburator 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (611, 'BRG01050101.0609', 1, 5, 1, 1, '688-14303-42', 'Carburator 3', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (612, 'BRG04150101.0610', 4, 15, 1, 1, '6H1-44151-00', 'Cam, Shift', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (613, 'BRG01050101.0611', 1, 5, 1, 1, '6F5-14323-01', 'Screw air adjusting ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (614, 'BRG01050101.0612', 1, 5, 1, 1, '6F5-14334-01', 'Spring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (615, 'BRG02230101.0613', 2, 23, 1, 1, '6F5-15715-00', 'Spring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (616, 'BRG02230101.0614', 2, 23, 1, 1, '6F5-15734-00', 'Spring ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (617, 'BRG02230101.0615', 2, 23, 1, 1, '66T-15705-00', 'Spring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (618, 'BRG02230101.0616', 2, 23, 1, 1, '66T-15767-00', 'Spring', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (619, 'BRG01050101.0617', 1, 5, 1, 1, '51Y-12119-00', 'Seal valve stem', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (620, 'BRG02230101.0618', 2, 23, 1, 1, '688-81800-12', 'Starting motor', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (621, 'BRG02090101.0619', 2, 9, 1, 1, '703-82540-00', 'Neutral switch assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (622, 'BRG04150101.0620', 4, 15, 1, 1, '6H1-45641-01', 'Shifter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (623, 'BRG04160101.0621', 4, 16, 1, 1, '6G5-12581-00', 'Joint hose', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (624, 'BRG04150101.0622', 4, 15, 1, 1, '688-45341-10', 'Plug drain Gardan', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (625, 'BRG04150101.0623', 4, 15, 1, 1, '90340-08002', 'Plug', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (626, 'BRG01130101.0624', 1, 13, 1, 1, '66T-13610-00', 'Reed valve assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (627, 'BRG03100101.0625', 3, 10, 1, 1, '663-43118-01-8D', 'Handle Transom Clamp', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (628, 'BRG03100101.0626', 3, 10, 1, 1, '90243-04007', 'Pin 663', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (629, 'BRG03190101.0627', 3, 19, 1, 1, '64E-43829-01', 'Plug Reservoir', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (630, 'BRG05290101.0628', 5, 29, 1, 1, '688-8258A-30', 'Extension Harness 3M 10 PIN', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (631, 'BRG03190101.0629', 3, 19, 1, 1, '64E-43821-03', 'Screw Trim Cylinder ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (632, 'BRG04150101.0630', 4, 15, 1, 1, '676-44150-00', 'Shift Cam', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (633, 'BRG01050101.0631', 1, 5, 1, 1, '6H1-W0093-01', 'Carburator Kit', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (634, 'BRG02260101.0632', 2, 26, 1, 1, '6F5-85533-00', 'Lighting Coil', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (635, 'BRG03100101.0633', 3, 10, 1, 1, '6F5-42816-00', 'Lever, Clamp', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (636, 'BRG01050101.0634', 1, 5, 1, 1, '6H2-14947-02', 'Jet Needle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (637, 'BRG03190101.0635', 3, 19, 1, 1, '64E-43822-00', 'Oil seal strim', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (638, 'BRG05120101.0636', 5, 12, 1, 1, '6Y1-24306-55', 'Fuel pipe komplite', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (639, 'BRG05120101.0637', 5, 12, 1, 1, '61J-24306-04', 'Fuel pipe comp', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (640, 'BRG05120101.0638', 5, 12, 1, 1, '6YJ-24201-00', 'Fuel tank assy', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (641, 'BRG01040101.0639', 1, 4, 1, 1, '90794-46911', 'Element 10 Micro Large', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (642, 'BRG01040101.0640', 1, 4, 1, 1, '90794-46912', 'Element 25 Micro Large', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (643, 'BRG01040101.0641', 1, 4, 1, 1, '6P3-WS24A-01', 'Element Filter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (644, 'BRG01040102.0642', 1, 4, 1, 2, '69J-13440-03', 'Element Assy, Oil Cleaner', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (645, 'BRG01040101.0643', 1, 4, 1, 1, '69J-13440-04', 'Element Assy, Oil Cleaner', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (646, 'BRG01040101.0644', 1, 4, 1, 1, '5GH-13440-71', 'Element Assy, Oil Cleaner', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (647, 'BRG01140101.0645', 1, 14, 1, 1, '6E5-24410-03', 'Fuel Pump Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (648, 'BRG01040201.0646', 1, 4, 2, 1, '16510-96J10', 'Filter Oil Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (649, 'BRG01040101.0647', 1, 4, 1, 1, '90790-BS214', 'Oli Yamalube 2 ST o/b. 1L', 'ltr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (650, 'BRG01040301.0648', 1, 4, 3, 1, NULL, 'Oli Mesran 2T Super X (Drum)', 'ltr', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (651, 'BRG01040101.0649', 1, 4, 1, 1, '90790-BS402', 'Oli Yamalube 4T o/b . 4L', 'galon', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (652, 'BRG04150101.0650', 4, 15, 1, 1, '90790-BS802', 'Oli Yamalube Gardan 750ml', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (653, 'BRG01040101.0651', 1, 4, 1, 1, '90790-BS225', 'Oli Yamalube 2T o/b. 4L', 'galon', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (654, 'BRG01040101.0652', 1, 4, 1, 1, '90790-BS401', 'Oli Yamalube 4T o/b. 1L', 'ltr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (655, 'BRG01040201.0653', 1, 4, 2, 1, '11141-98J10-000', 'Gasket Cylinder Head STBD', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (656, 'BRG01040201.0654', 1, 4, 2, 1, '11142-98J10-000', 'Gasket Cylinder Head PORT', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (657, 'BRG01170201.0655', 1, 17, 2, 1, '12140-98J00-000', 'Ring Set Piston', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (658, 'BRG01070201.0656', 1, 7, 2, 1, '12340-98J00-0C0', 'Bearing Sub Set Crankshaft', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (659, 'BRG01130201.0657', 1, 13, 2, 1, '13119-98J00-000', 'Intake Manifold', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (660, 'BRG01140201.0658', 1, 14, 2, 1, '15440-93J00-000', 'Filter Comp. Fuel', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (661, 'BRG01140201.0659', 1, 14, 2, 1, '15412-93J00-000', 'Filter Fuel', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (662, 'BRG01130201.0660', 1, 13, 2, 1, '13139-98J01-000', 'Collector', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (663, 'BRG01040201.0661', 1, 4, 2, 1, '51211-93J00-000', 'Engine Holder', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (664, 'BRG03220201.0662', 3, 22, 2, 1, '54160-98J00-000', 'Mount Lower', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (665, 'BRG05120101.0663', 5, 12, 1, 1, '90790-77001', 'Fuel Hose 8MM/mtr', 'mtr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (666, 'BRG03220201.0664', 3, 22, 2, 1, '54221-93J00-0EP', 'Cover Mount Lower', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (667, 'BRG03220201.0665', 3, 22, 2, 1, '09116-10175-000', 'Bolt 10x50', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (668, 'BRG03330201.0666', 3, 33, 2, 1, '55320-95311-000', 'Zink set Protection', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (669, 'BRG05290201.0667', 5, 29, 2, 1, '36620-98J51-000', 'Wire Assy R.Control Ext', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (670, 'BRG01140201.0668', 1, 14, 2, 1, '3412-93J00', 'Element Fuel Filter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (671, 'BRG01170201.0669', 1, 17, 2, 1, '12100-98810-0A0', 'Bearing set, conrod', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (672, 'BRG04180201.0670', 4, 18, 2, 1, '09282-17005', 'Oil seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (673, 'BRG04180201.0671', 4, 18, 2, 1, '09263-30023', 'Bearing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (674, 'BRG01070201.0672', 1, 7, 2, 1, '09269-30014', 'Bearing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (675, 'BRG04150201.0673', 4, 15, 2, 1, '09282-30006', 'Oil seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (676, 'BRG03190201.0674', 3, 19, 2, 1, '48633-93J00', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (677, 'BRG04160201.0675', 4, 16, 2, 1, '17472-93J00', 'Gasket Water Pump', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (678, 'BRG04160201.0676', 4, 16, 2, 1, '17461-93J00', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (679, 'BRG04160201.0677', 4, 16, 2, 1, '17461-96312', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (680, 'BRG04180201.0678', 4, 18, 2, 1, '09282-24004', 'Oil seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (681, 'BRG04150201.0679', 4, 15, 2, 1, '09289-22007', 'Oil seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (682, 'BRG02320201.0680', 2, 32, 2, 1, '38410-93J12', 'Relay trim', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (683, 'BRG05280000.0681', 5, 28, NULL, NULL, NULL, 'Steer Stainless', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (684, 'BRG05340000.0682', 5, 34, NULL, NULL, 'ACC-Bollard', 'SS 316 Bollard 3\"x6\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (685, 'BRG05340000.0683', 5, 34, NULL, NULL, '41542', 'Plastik Truhull 3/4\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (686, 'BRG05350000.0684', 5, 35, NULL, NULL, '00331', 'LED Green X1, Red X1 Nav. LT Plastic Vertical', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (687, 'BRG05340000.0685', 5, 34, NULL, NULL, '13560-WH', 'Plastic Deck Plate 4\" White', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (688, 'BRG05340000.0686', 5, 34, NULL, NULL, '13561-WH', 'Plastic Deck Plate 5\" White', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (689, 'BRG05340000.0687', 5, 34, NULL, NULL, '13574-WH', 'Louver Vent White 125/CTN Made of ABS', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (690, 'BRG05340000.0688', 5, 34, NULL, NULL, '13575-WH', 'Louver Vent White 250/CTN Made of ABS', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (691, 'BRG05340000.0689', 5, 34, NULL, NULL, '62509', 'SS Hatch Adjuster 210mm LTH', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (692, 'BRG05340000.0690', 5, 34, NULL, NULL, '41543', 'Plastic Truhull 1\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (693, 'BRG05360000.0691', 5, 36, NULL, NULL, '10192', 'Mini Battery Switch-Fixed on Type w/Red Knob', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (694, 'BRG05120000.0692', 5, 12, NULL, NULL, '035726-10', 'Fuel Sender Moeller Scepter 4\"-28\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (695, 'BRG05340000.0693', 5, 34, NULL, NULL, '80275', 'SS Flush Mount Rod Holder 30 Degree', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (696, 'BRG05120000.0694', 5, 12, NULL, NULL, 'F15C', 'MR Funnel Fuel Filter', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (697, 'BRG05120000.0695', 5, 12, NULL, NULL, '18547-S', 'Lube-Oil Extractor For 4 Ltr', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (698, 'BRG05340000.0696', 5, 34, NULL, NULL, '43001-WH', 'Plastic Flush Pull Latch 60mmX30mm w/o Locking Black', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (699, 'BRG05340000.0697', 5, 34, NULL, NULL, '80284', 'SS 316 Flush Latch 2\" w/6mm Medium Spacer', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (700, 'BRG05350000.0698', 5, 35, NULL, NULL, '00116', 'Folding Clear Light', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (701, 'BRG05360000.0699', 5, 36, NULL, NULL, 'P10037-02', 'Switch Only For 10032/36/37/47/62/10061/10087', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (702, 'BRG05360000.0700', 5, 36, NULL, NULL, 'HF-743', 'Ritchie HF-743 Helmsman Compass Black 12V, 3-3/4\", 4\" Mount.Hole', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (703, 'BRG05360000.0701', 5, 36, NULL, NULL, ' B-51', 'Ritchie B-51 Explorer Compass Black 12V, 2-3/4\" Dial, Bracket Mount', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (704, 'BRG05360000.0702', 5, 36, NULL, NULL, '10005', 'Battery Selector Switch 24/CTN', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (705, 'BRG05370000.0703', 5, 37, NULL, NULL, '346.4', 'Mavimare-Flojet Water System Pumps 12V 1.9GPM', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (706, 'BRG05370000.0704', 5, 37, NULL, NULL, '346.41', 'Mavimare-Flojet Water System Pumps 12V 2.9GPM', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (707, 'BRG05360000.0705', 5, 36, NULL, NULL, '10093', 'Mini Battery Switch Removable', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (708, 'BRG05280000.0706', 5, 28, NULL, NULL, '73052-SL', '13.5\" Alu Steering Wheel With PU S3/4\" Tapered Hub Silver Color Spoke', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (709, 'BRG05340000.0707', 5, 34, NULL, NULL, '40007', 'Nylon Deck Fill 1-1/2\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (710, 'BRG05340000.0708', 5, 34, NULL, NULL, 'AM14-05', 'Oblong pad eye 5MM', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (711, 'BRG05340000.0709', 5, 34, NULL, NULL, 'AM14-06', 'Oblong Pad Eye 6mm', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (712, 'BRG05340000.0710', 5, 34, NULL, NULL, '85021', 'SS316 Anti Rattle Door Keep', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (713, 'BRG05340000.0711', 5, 34, NULL, NULL, '80262', 'SS Flush Lifting Rings', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (714, 'BRG05340000.0712', 5, 34, NULL, NULL, '80261', 'SS Flush Hatch Lifting Handle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (715, 'BRG05340000.0713', 5, 34, NULL, NULL, '50074', '3\" Swivel Hasp SS', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (716, 'BRG05340000.0714', 5, 34, NULL, NULL, '50072', 'SS Safety Hasp 3\' Length', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (717, 'BRG05350000.0715', 5, 35, NULL, NULL, '00555-WH', 'Plastic Dome Light 5.5\" 24X0.2 W 2835 Nature White Led', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (718, 'BRG05360000.0716', 5, 36, NULL, NULL, '10136-BK', 'Switch Panel w/Digital Voltmeter & Cig.Lighter, 3 Gang, BK Panel', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (719, 'BRG05360000.0717', 5, 36, NULL, NULL, '10016-BK', '6 Gang Switch Panel With Label', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (720, 'BRG05360000.0718', 5, 36, NULL, NULL, '10247-BK', '8 Gang waterproof switch panel', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (721, 'BRG05360000.0719', 5, 36, NULL, NULL, '10178-BK', 'LED Rocker Switch Panel 12V, Black Auto Fuses, Labels Included, 8 Gang', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (722, 'BRG05350000.0720', 5, 35, NULL, NULL, '00541-SLD', 'Dome Light SS 4\" Cool White w/White LED', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (723, 'BRG05350000.0721', 5, 35, NULL, NULL, '00550-SLD', 'Dome Light SS 5\" Cool White w/White LED', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (724, 'BRG05350000.0722', 5, 35, NULL, NULL, '00141-LD', 'LED Navigation Light', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (725, 'BRG05340000.0723', 5, 34, NULL, NULL, '52548', 'S.S Hinge 2-3/8\"X1-7/16\"X2mm', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (726, 'BRG05340000.0724', 5, 34, NULL, NULL, '52565', 'Hinge 40X37mm', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (727, 'BRG05340000.0725', 5, 34, NULL, NULL, '52563', 'Hinge 75X37mm', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (728, 'BRG05340000.0726', 5, 34, NULL, NULL, '52564', 'Hinge (85.7mmX37.5mm)', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (729, 'BRG05340000.0727', 5, 34, NULL, NULL, '52558', 'Hinge 50x50x2MM', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (730, 'BRG05340000.0728', 5, 34, NULL, NULL, '80015', 'Bow Shock 4-1/2\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (731, 'BRG05340000.0729', 5, 34, NULL, NULL, '86501-02', 'SS 316 Bollard With Spring 4 Base; 3-3/8\"X3-3/8\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (732, 'BRG05340000.0730', 5, 34, NULL, NULL, '86500-01', 'SS 316 Bollard 3-1/2\" H Base 2-1/2\"X2-1/2\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (733, 'BRG05340000.0731', 5, 34, NULL, NULL, '80205-PT', 'Hose Deck Plate w/Key Type; Petrol For 1-1/2\" Hose', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (734, 'BRG05370000.0732', 5, 37, NULL, NULL, 'TMC-10057-12', 'TMC - Bilge Pump 12V 2000 GPH', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (735, 'BRG05370000.0733', 5, 37, NULL, NULL, 'TMC-10056-12', 'TMC - Bilge Pump 12V 1500 GPH', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (736, 'BRG05340000.0734', 5, 34, NULL, NULL, 'SS80020', 'Skene Bow Chock 4-1/2\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (737, 'BRG05120000.0735', 5, 12, NULL, NULL, '033314-10', 'Moeller Water Separator Clear Site Racor 320', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (738, 'BRG05120000.0736', 5, 12, NULL, NULL, '033315-10', 'Element Moeller Clear Site Rac. S3227', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (739, 'BRG05340000.0737', 5, 34, NULL, NULL, '80036-04', 'Cleat 4\"', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (740, 'BRG05340000.0738', 5, 34, NULL, NULL, '80036-05', 'Cleat 5\"', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (741, 'BRG05340000.0739', 5, 34, NULL, NULL, '80041-04', 'Hollow Base Cleat 4\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (742, 'BRG05340000.0740', 5, 34, NULL, NULL, '80041-05', 'Hollow Base Cleat 5\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (743, 'BRG05340000.0741', 5, 34, NULL, NULL, '80058-02', 'Round Base SS 316, 90\'', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (744, 'BRG05340000.0742', 5, 34, NULL, NULL, '80057-02', 'Round Base SS 316, 60\'', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (745, 'BRG05280000.0743', 5, 28, NULL, NULL, NULL, 'Power Steering Seastar', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (746, 'BRG05280000.0744', 5, 28, NULL, NULL, NULL, 'Power Steering Baystar', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (747, 'BRG05280000.0745', 5, 28, NULL, NULL, NULL, 'Power Steering Baystar (1 set)', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (748, 'BRG05340000.0746', 5, 34, NULL, NULL, NULL, 'Selang Flexibel 2\" (Hitam)/mtr', 'mtr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (749, 'BRG05120000.0747', 5, 12, NULL, NULL, 'ACC-RAC-EL-2010PM-0R', 'Element Racor Parker', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (750, 'BRG05120000.0748', 5, 12, NULL, NULL, 'ACC-RAC 500FGG', 'Racor 500 FG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (751, 'BRG05120000.0749', 5, 12, NULL, NULL, 'ACC-RAC-NEPEL 5', 'Nepel racor 500FG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (752, 'BRG05350000.0750', 5, 35, NULL, NULL, '00291-LD', 'Round Side Light, Green STBD w/1XRed High Power LED, 8-30V/1W', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (753, 'BRG05350000.0751', 5, 35, NULL, NULL, '00292-LD', 'Round Side Light, Red Port /1XRed High Power LED, 8-30V/1W', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (754, 'BRG05340000.0752', 5, 34, NULL, NULL, '40097-WH', 'Plastic Drain Plug White', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (755, 'BRG05340000.0753', 5, 34, NULL, NULL, '40097-BK', 'Plastic Drain Plug Black', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (756, 'BRG05340000.0754', 5, 34, NULL, NULL, '40094', 'Drain Plug W/Nylon Plug Chrome PL 1\" DIA X 2\" (L)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (757, 'BRG05120000.0755', 5, 12, NULL, NULL, 'SM-320R', 'SM Racor 320R (Seamaster)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (758, 'BRG05340000.0756', 5, 34, NULL, NULL, '85027', 'S.S 316 Barrel Bolt 38X92mm', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (759, 'BRG05340000.0757', 5, 34, NULL, NULL, '53550', 'SS Bow Eye3/8\"x4\"x1\" W/Two Plates', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (760, 'BRG05340000.0758', 5, 34, NULL, NULL, '53551', 'SS Bow Eye3/8\"x5\"x1\" W/Two Plates', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (761, 'BRG05340000.0759', 5, 34, NULL, NULL, '53552', 'SS Bow Eye5/16mm x 10cm', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (762, 'BRG05370000.0760', 5, 37, NULL, NULL, '10196-12', 'Bilge pump switch DC12V', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (763, 'BRG05360000.0761', 5, 36, NULL, NULL, '10013-BK', '3 gang switch panel with label', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (764, 'BRG05360000.0762', 5, 36, NULL, NULL, '10069', 'Switch Panel 6 Gang Alum', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (765, 'BRG05380000.0763', 5, 38, NULL, NULL, '15013-12', 'Single trumpet 12V', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (766, 'BRG05380000.0764', 5, 38, NULL, NULL, '15023-12', 'Dual trumpet 12V', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (767, 'BRG05340000.0765', 5, 34, NULL, NULL, '16594-18', 'Wiper blade 18\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (768, 'BRG05340000.0766', 5, 34, NULL, NULL, '16583', 'Wiper arm ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (769, 'BRG05340000.0767', 5, 34, NULL, NULL, '16652-CE', 'Wiper motor two speed 2/CTN 12V', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (770, 'BRG05340000.0768', 5, 34, NULL, NULL, '16612-CE', 'Self-parking wiper motor 30/C 12V', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (771, 'BRG05340000.0769', 5, 34, NULL, NULL, '16650-CE', 'HD Wiper Motor Two Speed 12V, Shaft 16X38MM', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (772, 'BRG05340000.0770', 5, 34, NULL, NULL, '16500-12', 'Self Parking Wiper Motor 50/C 12V, Shaft 65mm', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (773, 'BRG05370000.0771', 5, 37, NULL, NULL, '18042-12CE', 'Bilge pump 12V 1500GPH', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (774, 'BRG05350000.0772', 5, 35, NULL, NULL, '01652-BK', 'Lampu sorot', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (775, 'BRG05360000.0773', 5, 36, NULL, NULL, '70032-BK', 'Compass wth Black Bracket Large ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (776, 'BRG05120000.0774', 5, 12, NULL, NULL, 'MP3227-10', 'Element Racor 53227 10 MIC', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (777, 'BRG05280000.0775', 5, 28, NULL, NULL, '73051', 'Steering wheel plastic 13,5\"', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (778, 'BRG05350000.0776', 5, 35, NULL, NULL, '00111-LD', 'Starboard Light Green 48/CTN 12V 10W', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (779, 'BRG05350000.0777', 5, 35, NULL, NULL, '00121-LD', 'Port Light Red 48/CTN 12V 10W', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (780, 'BRG05350000.0778', 5, 35, NULL, NULL, '00532-SLD', 'Dome light SS 3\" Cool White w/White LED', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (781, 'BRG05340000.0779', 5, 34, NULL, NULL, 'ACC-F1', 'Fender F.1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (782, 'BRG05340000.0780', 5, 34, NULL, NULL, 'PLF-FENDER F1-WHITE', 'Fender F.1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (783, 'BRG05340000.0781', 5, 34, NULL, NULL, 'PLF-FENDER F2-WHITE', 'Fender F.2 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (784, 'BRG05340000.0782', 5, 34, NULL, NULL, 'ACC-F3', 'Fender F.3 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (785, 'BRG05340000.0783', 5, 34, NULL, NULL, 'PLF-FENDER F3-WHITE', 'Fender F.3 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (786, 'BRG05340000.0784', 5, 34, NULL, NULL, 'PLF-FENDER F4', 'Fender F.4', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (787, 'BRG05120000.0785', 5, 12, NULL, NULL, 'ACC-RAC-EL2040T', 'Element Racor Parker 10MIC', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (788, 'BRG05370000.0786', 5, 37, NULL, NULL, 'ACC-BP-1500', 'Bilge Pump Rule 1500GPH', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (789, 'BRG05370000.0787', 5, 37, NULL, NULL, 'ACC-BP-1100', 'Bilge Pump Rule 1100GPH 12V', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (790, 'BRG05340000.0788', 5, 34, NULL, NULL, 'TMC-10172L', 'Wiper arm ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (791, 'BRG05340000.0789', 5, 34, NULL, NULL, 'ACC-SPRING SS', 'Spring SS', 'pcs', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (792, 'BRG05370000.0790', 5, 37, NULL, NULL, 'ACC-35F SW', 'Float switch rule ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (793, 'BRG05390102.0791', 5, 39, 1, 2, 'ACC-STK-40HP BARU', 'Sticker 40HP Baru (KAPSUL)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (794, 'BRG05390102.0792', 5, 39, 1, 2, 'ACC-STK-40HP LAMA', 'Sticker 40HP Lama (KOTAK)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (795, 'BRG05390102.0793', 5, 39, 1, 2, 'ACC-STK-15 BARU', 'Sticker 15HP BARU', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (796, 'BRG05280000.0794', 5, 28, NULL, NULL, 'ACC-SEAFIRST', 'Steering Hydraulic Seafirst', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (797, 'BRG01040401.0795', 1, 4, 4, 1, '346007', 'Gasket Cylinder Head', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (798, 'BRG01040401.0796', 1, 4, 4, 1, '351535', 'Gasket ADPTR', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (799, 'BRG01130401.0797', 1, 13, 4, 1, '350933', 'Throttle body', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (800, 'BRG01130401.0798', 1, 13, 4, 1, '350934', 'Reed Plate', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (801, 'BRG02230401.0799', 2, 23, 4, 1, '586890 / 584799', 'Stater motor AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (802, 'BRG04160401.0800', 4, 16, 4, 1, '338484', 'Gasket Wtr Pump 5 PK', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (803, 'BRG04200401.0801', 4, 20, 4, 1, '763918', 'Propeller VIPER TBX 14.75x19RH', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (804, 'BRG01140401.0802', 1, 14, 4, 1, '502906', 'Fuel Filter 10 MIC/5009676/5011090', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (805, 'BRG02230401.0803', 2, 23, 4, 1, '586957', 'Motor Stater AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (806, 'BRG02320401.0804', 2, 32, 4, 1, '587020', 'Solenoid AY Start', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (807, 'BRG02320401.0805', 2, 32, 4, 1, '586767', 'Cable & Relay AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (808, 'BRG03190401.0806', 3, 19, 4, 1, '5005254', 'Motor & O-Ring AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (809, 'BRG01170401.0807', 1, 17, 4, 1, '5005046', 'Piston Ring AY STD', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (810, 'BRG04210401.0808', 4, 21, 4, 1, '5007643', 'Shaft AY Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (811, 'BRG04150401.0809', 4, 15, 4, 1, '354992', 'O-ring ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (812, 'BRG03100401.0810', 3, 10, 4, 1, '320961', 'Seal G/C Inner HSG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (813, 'BRG03100401.0811', 3, 10, 4, 1, '320936', 'Seal EX HSG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (814, 'BRG01040401.0812', 1, 4, 4, 1, '5007419', 'Spark Plug SP PL QC10WEP-4PK', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (815, 'BRG04200401.0813', 4, 20, 4, 1, '128572', 'Bushing Torsion Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (816, 'BRG04160401.0814', 4, 16, 4, 1, '5007554', 'Housing Impeller AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (817, 'BRG04160401.0815', 4, 16, 4, 1, '338486', 'Cup Impeller HSG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (818, 'BRG04160401.0816', 4, 16, 4, 1, '331353', 'Seal Impeller HSG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (819, 'BRG02080401.0817', 2, 8, 4, 1, '5007967', 'Flywheel AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (820, 'BRG03190401.0818', 3, 19, 4, 1, '435341', 'ReserVoir & Cap AY ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (821, 'BRG04150102.0819', 4, 15, 1, 2, '66T-45560-01', 'Gear 1 ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (822, 'BRG04150102.0820', 4, 15, 1, 2, '66T-45570-00', 'Gear 2', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (823, 'BRG04150102.0821', 4, 15, 1, 2, '6E7-45560-00', 'Gear 1 ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (824, 'BRG04150102.0822', 4, 15, 1, 2, '6E7-45571-00', 'Gear 2', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (825, 'BRG04150102.0823', 4, 15, 1, 2, '679-45560-00', 'Gear 1 ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (826, 'BRG04150102.0824', 4, 15, 1, 2, '679-45571-00 / 679-45570-00', 'Gear 2 ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (827, 'BRG04150102.0825', 4, 15, 1, 2, '61N-45560-00', 'Gear 1 ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (828, 'BRG04150102.0826', 4, 15, 1, 2, '6H9-45551-00', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (829, 'BRG04150102.0827', 4, 15, 1, 2, '6F5-45560-00', 'Gear 1 ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (830, 'BRG04150102.0828', 4, 15, 1, 2, '6F5-45570-00', 'Gear 2', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (831, 'BRG04150102.0829', 4, 15, 1, 2, '6F5-45551-01', 'Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (832, 'BRG04150102.0830', 4, 15, 1, 2, '63V-45551-00', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (833, 'BRG04180102.0831', 4, 18, 1, 2, '66T-45501-11', 'Drive shaft', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (834, 'BRG04180102.0832', 4, 18, 1, 2, '61N-45510-10', 'Drive shaft Y25 Long', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (835, 'BRG04150102.0833', 4, 15, 1, 2, '66T-45551-00', 'Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (836, 'BRG04150102.0834', 4, 15, 1, 2, '61N-45551-00', 'Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (837, 'BRG04150101.0835', 4, 15, 1, 1, '6P2-45560-01', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (838, 'BRG04150101.0836', 4, 15, 1, 1, '6P2-45551-02', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (839, 'BRG04180101.0837', 4, 18, 1, 1, '6P2-45501-01', 'Drive shaft', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (840, 'BRG04180101.0838', 4, 18, 1, 1, '66T-45501-11', 'Drive shaft comp long', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (841, 'BRG04150101.0839', 4, 15, 1, 1, '6G5-45560-10', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (842, 'BRG04150101.0840', 4, 15, 1, 1, '6G5-45571-02', 'Gear 2 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (843, 'BRG04150101.0841', 4, 15, 1, 1, '6E7-45560-00', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (844, 'BRG04150101.0842', 4, 15, 1, 1, '679-45560-00', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (845, 'BRG04150101.0843', 4, 15, 1, 1, '688-45560-00', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (846, 'BRG04150101.0844', 4, 15, 1, 1, '6F5-45560-01', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (847, 'BRG04150101.0845', 4, 15, 1, 1, '66T-45560-01', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (848, 'BRG04150101.0846', 4, 15, 1, 1, '6K5-45560-00', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (849, 'BRG04150101.0847', 4, 15, 1, 1, '6P2-45571-00', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (850, 'BRG04150101.0848', 4, 15, 1, 1, '6P3-45560-00', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (851, 'BRG04150101.0849', 4, 15, 1, 1, '6P3-45571-01', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (852, 'BRG04150101.0850', 4, 15, 1, 1, '6E5-45560-01', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (853, 'BRG04150101.0851', 4, 15, 1, 1, '6F5-45570-00', 'Gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (854, 'BRG04150101.0852', 4, 15, 1, 1, '688-45571-01', 'Gear 2 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (855, 'BRG04150101.0853', 4, 15, 1, 1, '61N-45571-00', 'Gear 2 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (856, 'BRG04150101.0854', 4, 15, 1, 1, '648-45570-01', 'Gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (857, 'BRG04150101.0855', 4, 15, 1, 1, '650-45570-00', 'Gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (858, 'BRG04150101.0856', 4, 15, 1, 1, '663-45633-00', 'Ring Cross Pin ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (859, 'BRG04150101.0857', 4, 15, 1, 1, '61A-45633-00', 'Ring Cross Pin ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (860, 'BRG04150101.0858', 4, 15, 1, 1, '6G5-45551-10', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (861, 'BRG04150101.0859', 4, 15, 1, 1, '63V-45551-00', 'Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (862, 'BRG04150101.0860', 4, 15, 1, 1, '6H9-45551-00', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (863, 'BRG04150101.0861', 4, 15, 1, 1, '688-45551-01', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (864, 'BRG04150101.0862', 4, 15, 1, 1, '663-45631-01', 'Clutch Dog', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (865, 'BRG04150101.0863', 4, 15, 1, 1, '6F5-45551-01', 'Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (866, 'BRG04150101.0864', 4, 15, 1, 1, '66T-45551-00', 'Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (867, 'BRG04150101.0865', 4, 15, 1, 1, '61N-45551-00', 'Pinion ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (868, 'BRG04150101.0866', 4, 15, 1, 1, '626-45551-00', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (869, 'BRG04150101.0867', 4, 15, 1, 1, '6K5-45551-00', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (870, 'BRG04150101.0868', 4, 15, 1, 1, '688-45633-00', 'Ring Cross Pin ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (871, 'BRG04150101.0869', 4, 15, 1, 1, '68V-45560-00', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (872, 'BRG04150101.0870', 4, 15, 1, 1, '68V-45551-00', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (873, 'BRG04150101.0871', 4, 15, 1, 1, '6E5-45633-01', 'Ring Cross Pin ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (874, 'BRG01130101.0872', 1, 13, 1, 1, '650-42152-00-94', 'Gear ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (875, 'BRG01130101.0873', 1, 13, 1, 1, '676-42151-00-94', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (876, 'BRG04150101.0874', 4, 15, 1, 1, '6E5-45551-02', 'Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (877, 'BRG04150101.0875', 4, 15, 1, 1, '648-45633-11', 'Ring Cross Pin ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (878, 'BRG01040401.0876', 1, 4, 4, 1, '359476', 'Cover', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (879, 'BRG01040401.0877', 1, 4, 4, 1, '354135', 'PWD-ADPTR', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (880, 'BRG04150401.0878', 4, 15, 4, 1, '5009044', 'Gear set, FWD & TIN', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (881, 'BRG04150401.0879', 4, 15, 4, 1, '5006311', 'Gear set, FWD & TIN', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (882, 'BRG04150401.0880', 4, 15, 4, 1, '357038', 'Gear, REV', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (883, 'BRG04160401.0881', 4, 16, 4, 1, '5001593', 'KIT AY,Impeller/435821/435748', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (884, 'BRG04150401.0882', 4, 15, 4, 1, '335191', 'Lever, Shift ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (885, 'BRG04150401.0883', 4, 15, 4, 1, '327590', 'Pin', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (886, 'BRG02260401.0884', 2, 26, 4, 1, '586980', 'COIL AY, IGNITION/587275', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (887, 'BRG01040401.0885', 1, 4, 4, 1, '5007597', 'SPARK PLUG, QC8WEP', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (888, 'BRG04180401.0886', 4, 18, 4, 1, '439476', 'DS BRG HSG & SEAL AY/437215', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (889, 'BRG04180401.0887', 4, 18, 4, 1, '387817', 'ROLLER BEARING/5007751', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (890, 'BRG04180401.0888', 4, 18, 4, 1, '314730', 'Nut Pinion ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (891, 'BRG04180401.0889', 4, 18, 4, 1, '353162', 'SEAL', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (892, 'BRG01170401.0890', 1, 17, 4, 1, '436752', 'BEARING AY, NEEDLE', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (893, 'BRG01170401.0891', 1, 17, 4, 1, '431926', 'BRG AY, NEEDLE', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (894, 'BRG01040401.0892', 1, 4, 4, 1, '334950', 'SEAL', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (895, 'BRG01040401.0893', 1, 4, 4, 1, '324369', 'SPRING', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (896, 'BRG04310401.0894', 4, 31, 4, 1, '436745', 'ANODE & INSERT AY/393023', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (897, 'BRG04150401.0895', 4, 15, 4, 1, '391473', 'BEARING AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (898, 'BRG04180401.0896', 4, 18, 4, 1, '353039', 'WASHER, THURST', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (899, 'BRG04180401.0897', 4, 18, 4, 1, '389042', 'THR-BEARING', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (900, 'BRG04180401.0898', 4, 18, 4, 1, '349193', 'WASHER, THURST', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (901, 'BRG04310401.0899', 4, 31, 4, 1, '431708', 'ANODE & INSERT AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (902, 'BRG01040401.0900', 1, 4, 4, 1, '5007369', 'HOUSING AY, SHIFTER', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (903, 'BRG01040401.0901', 1, 4, 4, 1, '351535', 'PWD-ADPTR', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (904, 'BRG01040401.0902', 1, 4, 4, 1, '331188', 'O-RING/QIPL', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (905, 'BRG02260401.0903', 2, 26, 4, 1, '584333', 'Coil & LAM AY, charge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (906, 'BRG04180401.0904', 4, 18, 4, 1, '329922', 'Oil Retainer ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (907, 'BRG04180401.0905', 4, 18, 4, 1, '329923', 'Oil Retainer ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (908, 'BRG01040401.0906', 1, 4, 4, 1, '352165', 'Gasket / 324670', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (909, 'BRG04180401.0907', 4, 18, 4, 1, '311598', 'Washer-10 PK', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (910, 'BRG04180401.0908', 4, 18, 4, 1, '352341', 'Retainer, DR SHIFT', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (911, 'BRG04180401.0909', 4, 18, 4, 1, '323361', 'SHIM', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (912, 'BRG04310401.0910', 4, 31, 4, 1, '431708', 'Anode & Insert AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (913, 'BRG04150401.0911', 4, 15, 4, 1, '313446', 'O-RING', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (914, 'BRG01040401.0912', 1, 4, 4, 1, '344771', 'Cover Thermostat ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (915, 'BRG02090401.0913', 2, 9, 4, 1, '3010449', 'Capacitor', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (916, 'BRG04180401.0914', 4, 18, 4, 1, '382343', 'Bearing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (917, 'BRG04200401.0915', 4, 20, 4, 1, '177283', 'Bushing KIT AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (918, 'BRG01170401.0916', 1, 17, 4, 1, '326764', 'Wrist Pin', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (919, 'BRG01170401.0917', 1, 17, 4, 1, '327861', 'Wrist Pin', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (920, 'BRG01070401.0918', 1, 7, 4, 1, '396041', 'Bearing conrod', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (921, 'BRG04200401.0919', 4, 20, 4, 1, '314503', 'Prop Nut', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (922, 'BRG04200401.0920', 4, 20, 4, 1, '5008966', 'Prop Nut Keeper AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (923, 'BRG01170401.0921', 1, 17, 4, 1, '336530', 'W/P Plate', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (924, 'BRG03100401.0922', 3, 10, 4, 1, '586789', 'Switch trim ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (925, 'BRG02090401.0923', 2, 9, 4, 1, '5006484', 'Sensor TPS kit', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (926, 'BRG04150401.0924', 4, 15, 4, 1, '330137', 'Seal dealer 5PK', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (927, 'BRG01040401.0925', 1, 4, 4, 1, '351366', 'Gasket ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (928, 'BRG01040401.0926', 1, 4, 4, 1, '343809', 'Gasket', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (929, 'BRG04200401.0927', 4, 20, 4, 1, '5009242', 'Prop nut and keeper AY', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (930, 'BRG01040401.0928', 1, 4, 4, 1, '5008903', 'Cover Thermostat ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (931, 'BRG02090401.0929', 2, 9, 4, 1, '5010161', 'Panel AY Key ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (932, 'BRG03190101.0930', 3, 19, 1, 1, '64E-43821-08', 'Screw Trim Cylinder ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (933, 'BRG03190101.0931', 3, 19, 1, 1, '6G5-43864-00', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (934, 'BRG02230101.0932', 2, 23, 1, 1, '66T-15784-00', 'Spring Return', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (935, 'BRG02250101.0933', 2, 25, 1, 1, '99999-03764', 'CDI Unit', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (936, 'BRG04150101.0934', 4, 15, 1, 1, '6FM-45631-00', 'Clutch Dog', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (937, 'BRG01040101.0935', 1, 4, 1, 1, '93102-25010', 'Oil seal', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (938, 'BRG01040101.0936', 1, 4, 1, 1, '93101-13M27', 'Oil seal', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (939, 'BRG01040101.0937', 1, 4, 1, 1, '6G5-11193-A2', 'Gasket ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (940, 'BRG02260101.0938', 2, 26, 1, 1, '6B4-85570-03', 'Ignition coil assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (941, 'BRG05340000.0939', 5, 34, NULL, NULL, 'PLF-BUOY A1', 'Buoy A1-Forest Green', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (942, 'BRG04180103.0940', 4, 18, 1, 3, '93332-00001 / 32005X', 'Bearing AS panjang', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (943, 'BRG04150103.0941', 4, 15, 1, 3, '93306-001U1 / 00702 / 60070CM ', 'Bearing gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (944, 'BRG01040401.0942', 1, 4, 4, 1, '5010260', 'Spark Plug QC10WEPI', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (945, 'BRG05350000.0943', 5, 35, NULL, NULL, '01603-WB', 'Cabin Control Search Light 20W/12V 55W Halogen Bean', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (946, 'BRG05120000.0944', 5, 12, NULL, NULL, '035765-10', 'Moeller Reed Switch Sending Unit 14\"', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (947, 'BRG04150101.0945', 4, 15, 1, 1, '93315-43061', 'Bearing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (948, 'BRG04150101.0946', 4, 15, 1, 1, '93210-58144 / 93210-58677', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (949, 'BRG04150101.0947', 4, 15, 1, 1, '93106-09014', 'Oil seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (950, 'BRG04160101.0948', 4, 16, 1, 1, '663-44366-00', 'water seal 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (951, 'BRG04160101.0949', 4, 16, 1, 1, '63D-44312-00', 'Cover wtr pump house', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (952, 'BRG04160101.0950', 4, 16, 1, 1, '63D-44316-00', 'Gasket Water Pump', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (953, 'BRG04160101.0951', 4, 16, 1, 1, '688-44321-41', 'Inner plate cartridge', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (954, 'BRG04160101.0952', 4, 16, 1, 1, '679-44316-A1', 'Gasket Water Pump', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (955, 'BRG04160101.0953', 4, 16, 1, 1, '69P-44322-00', 'Insert cartrigde', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (956, 'BRG01050101.0954', 1, 5, 1, 1, '61N-14198-00', 'Gasket Carburator', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (957, 'BRG01130101.0955', 1, 13, 1, 1, '61N-26311-01', 'Cable Throttle ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (958, 'BRG05280100.0956', 5, 28, 1, NULL, 'ACC-DARKLINK S', 'Darklink S', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (959, 'BRG05360000.0957', 5, 36, NULL, NULL, '10007', 'Battery switch 300AMP ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (960, 'BRG05350000.0958', 5, 35, NULL, NULL, '00614-SSWH', 'Led Dome LT.4\" Nature White', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (961, 'BRG01170101.0959', 1, 17, 1, 1, '6S1-11603-00', 'Ring Piston STD ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (962, 'BRG05340000.0960', 5, 34, NULL, NULL, '51024-BP', 'Lifting Handle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (963, 'BRG01130101.0961', 1, 13, 1, 1, '6B4-26301-00', 'Cable Throttle ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (964, 'BRG04150103.0962', 4, 15, 1, 3, '93306-207U0 / 6207CM3', 'Bearing gear 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (965, 'BRG04150103.0963', 4, 15, 1, 3, '93332-000W7 / Hi-Cap26882R / 22 ', 'Bearing Gear 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (966, 'BRG03100101.0964', 3, 10, 1, 1, '90386-18M35', 'Bush', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (967, 'BRG03100101.0965', 3, 10, 1, 1, '90386-22M15', 'Bush', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (968, 'BRG05290100.0966', 5, 29, 1, NULL, 'CR-TLF-26FT', 'Cable remote Teleflex (8mtr)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (969, 'BRG04160101.0967', 4, 16, 1, 1, '676-44322-40', 'Cartridge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (970, 'BRG01040101.0968', 1, 4, 1, 1, '66T-11312-00', 'Sleeve Cylinder/Liner ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (971, 'BRG01040102.0969', 1, 4, 1, 2, '66T-11312-00 / 66T-10935-00', 'Sleeve cylinder/Liner', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (972, 'BRG05280100.0970', 5, 28, 1, NULL, 'ACC+HELM+BEZEL', 'Helm D290 + Bezel 90', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (973, 'BRG05280100.0971', 5, 28, 1, NULL, 'BAYSTAR-HH4314', 'Baystar helm pump', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (974, 'BRG04150101.0972', 4, 15, 1, 1, '90790-BS801', 'Oli Yamalube Gardan 350ml', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (975, 'BRG04150101.0973', 4, 15, 1, 1, '679-45571-00', 'Gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (976, 'BRG01040102.0974', 1, 4, 1, 2, '5GH-13440-00', 'Filter Oil  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (977, 'BRG01040101.0975', 1, 4, 1, 1, '6H3-11181-A2', 'Cylinder Head', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (978, 'BRG01140101.0976', 1, 14, 1, 1, '61A-24560-04', 'Filter Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (979, 'BRG04160101.0977', 4, 16, 1, 1, '6E0-44352-00', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (980, 'BRG01130101.0978', 1, 13, 1, 1, '6F5-13610-00', 'Reed valve assy', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (981, 'BRG04200101.0979', 4, 20, 1, 1, '676-45943-62', 'Propeller  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (982, 'BRG01040101.0980', 1, 4, 1, 1, '6E5-13552-01', 'Nozzle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (983, 'BRG05360000.0981', 5, 36, NULL, NULL, '10026-BK', '6 Gang Wave Design Switch Panel', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (984, 'BRG05340000.0982', 5, 34, NULL, NULL, 'SS400097-BK', 'Plastic Drain Plug Black', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (985, 'BRG05340000.0983', 5, 34, NULL, NULL, 'SS50011-CP', 'Barrel Bolt 71MMx29MMx2.6MM', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (986, 'BRG01170102.0984', 1, 17, 1, 2, '634-11633-00', 'Pin Piston', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (987, 'BRG03100101.0985', 3, 10, 1, 1, '6F5-41211-00', 'Link Accel', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (988, 'BRG01130101.0986', 1, 13, 1, 1, '6F5-13645-A1', 'Gasket Manifold Inner Y40', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (989, 'BRG01130101.0987', 1, 13, 1, 1, '6F5-13646-A2', 'Gasket Manifold Outter Y40', 'pcs', 4.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (990, 'BRG05280100.0988', 5, 28, 1, NULL, 'Z-NEPEL-690051', 'Nepel L Besar 5/16', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (991, 'BRG05280100.0989', 5, 28, 1, NULL, 'Z-NEPEL-690110', 'Nepel Reseuble Fitting 5/16', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (992, 'BRG04150101.0990', 4, 15, 1, 1, '6J4-W4531-01-8D', 'Casing Lower Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (993, 'BRG04150101.0991', 4, 15, 1, 1, '6E8-45311-01-8D', 'Casing Lower ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (994, 'BRG01170102.0992', 1, 17, 1, 2, '6F6-11635-00', 'Piston STD over size (0.25)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (995, 'BRG04160101.0993', 4, 16, 1, 1, '6BG-44341-00', 'Housing Water Pump ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (996, 'BRG05340000.0994', 5, 34, NULL, NULL, 'PLF-BUOY A3', 'Buoy A3', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (997, 'BRG05340000.0995', 5, 34, NULL, NULL, NULL, 'Tali Tambang/mtr', 'mtr', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (998, 'BRG04200101.0996', 4, 20, 1, 1, '6G5-45974-03', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (999, 'BRG04150101.0997', 4, 15, 1, 1, '61N-45560-10', 'Gear 1 ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1000, 'BRG04160101.0998', 4, 16, 1, 1, '662-44352-01', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1001, 'BRG03100101.0999', 3, 10, 1, 1, '90149-14M03', 'Screw ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1002, 'BRG03100101.1000', 3, 10, 1, 1, '6F5-43116-00', 'Screw transom clamp', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1003, 'BRG03100101.1001', 3, 10, 1, 1, '6F5-43114-00', 'Pat transom clamp', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1004, 'BRG01130101.1002', 1, 13, 1, 1, '6F6-41256-00', 'ROD Choke link', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1005, 'BRG01130101.1003', 1, 13, 1, 1, '661-41262-02', 'Joint choke lever', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1006, 'BRG01070502.1004', 1, 7, 5, 2, '6G5-11411-01', 'Crankshaft ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1007, 'BRG01070101.1005', 1, 7, 1, 1, '93310-620V5', 'Bearing conrod', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1008, 'BRG04150102.1006', 4, 15, 1, 2, '61N-45571-00', 'Gear 2', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1009, 'BRG01040101.1007', 1, 4, 1, 1, '63V-41111-00-1S', 'Inner cover exhaust', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1010, 'BRG04160101.1008', 4, 16, 1, 1, '647-44366-01', 'Damper water seal 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1011, 'BRG01140101.1009', 1, 14, 1, 1, '61N-24560-10', 'Filter Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1012, 'BRG03100101.1010', 3, 10, 1, 1, '90386-44M03', 'Bushing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1013, 'BRG01170101.1011', 1, 17, 1, 1, '6F5-11610-10', 'Ring Piston OS 025', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1014, 'BRG01040502.1012', 1, 4, 5, 2, '6F5-11181-A2', 'Cylinder Head', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1015, 'BRG01040502.1013', 1, 4, 5, 2, '6G5-11181-A1', 'Cylinder Head', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1016, 'BRG01040101.1014', 1, 4, 1, 1, '6R3-11312-00', 'Sleeve cylinder/Liner', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1017, 'BRG01170502.1015', 1, 17, 5, 2, '93602-20M02', 'Pin dowel', 'pcs', 50.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1018, 'BRG01070101.1016', 1, 7, 1, 1, '93102-32M07', 'Oil seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1019, 'BRG01170101.1017', 1, 17, 1, 1, '61N-11631-00-95', 'Piston STD  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1020, 'BRG03330101.1018', 3, 33, 1, 1, '6H1-45251-03', 'Anode', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1021, 'BRG02260101.1019', 2, 26, 1, 1, '61N-85570-10', 'Ignition coil assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1022, 'BRG04150101.1020', 4, 15, 1, 1, '676-45577-00', 'Shim 1.8MM', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1023, 'BRG02230101.1021', 2, 23, 1, 1, '66T-15714-00', 'Drum sheave', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1024, 'BRG02230101.1022', 2, 23, 1, 1, '6F5-15714-03', 'Drive sheave', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1025, 'BRG01130101.1023', 1, 13, 1, 1, '664-42119-00', 'Grip', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1026, 'BRG02260101.1024', 2, 26, 1, 1, '6F5-85520-01', 'Coil charge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1027, 'BRG02300101.1025', 2, 30, 1, 1, '6F5-85580-00', 'Coil pulser', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1028, 'BRG04150101.1026', 4, 15, 1, 1, '93210-64ME7', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1029, 'BRG04160101.1027', 4, 16, 1, 1, '61N-45315-00', 'Packing Lower Casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1030, 'BRG04200101.1028', 4, 20, 1, 1, '90171-14013', 'Nut', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1031, 'BRG03100101.1029', 3, 10, 1, 1, '6B4-41131-00-CA', 'Gasket Manifold EXT 1', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1032, 'BRG01040101.1030', 1, 4, 1, 1, '6E9-12413-00-1S', 'Cover Thermostat ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1033, 'BRG01040101.1031', 1, 4, 1, 1, '6E9-12414-A1', 'Gasket', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1034, 'BRG01040101.1032', 1, 4, 1, 1, '6F6-11111-00-1S', 'Cylinder Head', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1035, 'BRG01040101.1033', 1, 4, 1, 1, '6F6-11191-00-1S', 'Cover Cylinder', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1036, 'BRG01070101.1034', 1, 7, 1, 1, '93311-636U6', 'Bearing Needle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1037, 'BRG04150102.1035', 4, 15, 1, 2, '663-45631-01', 'Clutch Dog', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1038, 'BRG05120502.1036', 5, 12, 5, 2, '6Y1-24306-53', 'Fuel pipe com', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1039, 'BRG02260502.1037', 2, 26, 5, 2, '63V-85570-00', 'Ignition coil assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1040, 'BRG02090502.1038', 2, 9, 5, 2, '6E9-82575-00', 'Engine stop assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1041, 'BRG01070502.1039', 1, 7, 5, 2, '6F5-11432-11', 'Crank 3', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1042, 'BRG01070502.1040', 1, 7, 5, 2, '6F5-11442-11', 'Crank 4', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1043, 'BRG04160101.1041', 4, 16, 1, 1, '6B4-44361-10', 'Tube water', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1044, 'BRG02260101.1042', 2, 26, 1, 1, '69P-85541-09', 'Coil charge', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1045, 'BRG04160101.1043', 4, 16, 1, 1, '626-44365-01', 'Damper water seal 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1046, 'BRG01130101.1044', 1, 13, 1, 1, '6F5-14417-00', 'Cover', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1047, 'BRG01130101.1045', 1, 13, 1, 1, '6F5-14418-00', 'Cover 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1048, 'BRG01130101.1046', 1, 13, 1, 1, '682-41271-01', 'Knob, Choke', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1049, 'BRG01130101.1047', 1, 13, 1, 1, '6F5-14476-00', 'SEAL', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1050, 'BRG04150101.1048', 4, 15, 1, 1, '6F5-45312-01-8D', 'Casing lower', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1051, 'BRG01040101.1049', 1, 4, 1, 1, '688-41111-00-1S', 'Inner cover exhaust', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1052, 'BRG02230101.1050', 2, 23, 1, 1, '6F5-15716-01', 'Drive plate', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1053, 'BRG02230101.1051', 2, 23, 1, 1, '63V-15714-00', 'Drum sheave', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1054, 'BRG04160601.1052', 4, 16, 6, 1, '161542', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1055, 'BRG01170101.1053', 1, 17, 1, 1, '64D-11605-02', 'Ring Piston O.S 50', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1056, 'BRG01040301.1054', 1, 4, 3, 1, 'DR-27', 'Oli Meditran SX Plus 15W/40 CI4 (200 ltr)', 'ltr', 10.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1057, 'BRG04180101.1055', 4, 18, 1, 1, '93101-20001', 'Oil seal', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1058, 'BRG05290100.1056', 5, 29, 1, NULL, 'CR-KRA-3M', 'Cable remote korea (3 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1059, 'BRG01170201.1057', 1, 17, 2, 1, '12110-94400', 'Piston ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1060, 'BRG01170201.1058', 1, 17, 2, 1, '12151-94400', 'Pin Piston', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1061, 'BRG01170201.1059', 1, 17, 2, 1, '09263-20072', 'Bearing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1062, 'BRG01170201.1060', 1, 17, 2, 1, '12140-94400', 'Ring piston', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1063, 'BRG01040201.1061', 1, 4, 2, 1, '11141-94450', 'Cylinder head', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1064, 'BRG01040201.1062', 1, 4, 2, 1, '11433-94412', 'Under Oil', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1065, 'BRG05350000.1063', 5, 35, NULL, NULL, '01602-WB', 'Search Light 50/CTN W/12V55W', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1066, 'BRG05350000.1064', 5, 35, NULL, NULL, '01603-WBD', 'Cabin Control Search Light 20W/12V 55W', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1067, 'BRG01050101.1065', 1, 5, 1, 1, '679-14923-00', 'Screw adjusting', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1068, 'BRG01050101.1066', 1, 5, 1, 1, '63V-14947-00', 'Jet Needle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1069, 'BRG01170101.1067', 1, 17, 1, 1, '677-11631-00-97', 'Piston STD 0.97', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1070, 'BRG01170101.1068', 1, 17, 1, 1, '647-11610-00', 'Ring Piston STD ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1071, 'BRG01040101.1069', 1, 4, 1, 1, '677-11181-A1', 'Cylinder Head', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1072, 'BRG01130101.1070', 1, 13, 1, 1, '677-26301-02', 'Cable Throttle ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1073, 'BRG01040101.1071', 1, 4, 1, 1, '93101-14M01', 'Oil seal', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1074, 'BRG01040101.1072', 1, 4, 1, 1, '93101-20M29', 'Oil seal', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1075, 'BRG01040101.1073', 1, 4, 1, 1, '677-41112-A2', 'Exhaust Inner Cover', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1076, 'BRG01040101.1074', 1, 4, 1, 1, '93102-30M05', 'Oil seal', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1077, 'BRG01040101.1075', 1, 4, 1, 1, '93104-20M02', 'Oil seal', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1078, 'BRG05280100.1076', 5, 28, 1, NULL, 'Z-NEPEL-690081', 'Nepel Tee besar', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1079, 'BRG05240000.1077', 5, 24, NULL, NULL, 'RC-MT3-309078', 'Remote control MT-3 Twin Teleflex', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1080, 'BRG04150502.1078', 4, 15, 5, 2, '6E7-45571-00', 'Gear 2', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1081, 'BRG04150103.1079', 4, 15, 1, 3, '93306-00501 / 6005 ', 'Bearing gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1082, 'BRG04150103.1080', 4, 15, 1, 3, '93306-00612 / 6006 ', 'Bearing gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1083, 'BRG01130201.1081', 1, 13, 2, 1, '63610-92L00', 'Cable Throttle ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1084, 'BRG04180101.1082', 4, 18, 1, 1, '6E5-45587-01', 'Shim', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1085, 'BRG04180101.1083', 4, 18, 1, 1, '93210-55354 / 93210-54534', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1086, 'BRG04150101.1084', 4, 15, 1, 1, '90282-04M00', 'Key straight', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1087, 'BRG04150101.1085', 4, 15, 1, 1, '6G5-45567-10', 'Shim', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1088, 'BRG02250102.1086', 2, 25, 1, 2, '6B4-85540-01', 'CDI Unit', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1089, 'BRG04200101.1087', 4, 20, 1, 1, '663-45952-02', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1090, 'BRG01070102.1088', 1, 7, 1, 2, '682-11515-00', 'Seal Labyrinth ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1091, 'BRG05120101.1089', 5, 12, 1, 1, '90890-56878', 'Fuel Hose/mtr', 'mtr', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1092, 'BRG01130101.1090', 1, 13, 1, 1, '688-13610-00', 'Reed valve assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1093, 'BRG05120101.1091', 5, 12, 1, 1, '90794-46909', 'Water Separator', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1094, 'BRG01070502.1092', 1, 7, 5, 2, '689-11681-01', 'Pin crank', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1095, 'BRG04150101.1093', 4, 15, 1, 1, '682-44147-00', 'Boot Shift Rod', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1096, 'BRG02250102.1094', 2, 25, 1, 2, '66T-85540-00', 'CDI Unit', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1097, 'BRG04160401.1095', 4, 16, 4, 1, '5011603', 'Kit Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1098, 'BRG04310101.1096', 4, 31, 1, 1, '6E0-45251-12', 'Anode', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1099, 'BRG04310101.1097', 4, 31, 1, 1, '63D-45251-01', 'Anode', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1100, 'BRG01100101.1098', 1, 10, 1, 1, '682-43311-07-8D', 'Bracket Swivel 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1101, 'BRG03190101.1099', 3, 19, 1, 1, '6H1-43891-10', 'Brush', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1102, 'BRG01100101.1100', 1, 10, 1, 1, '6B4-42816-00', 'Lever clamp', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1103, 'BRG01130101.1101', 1, 13, 1, 1, '6B4-42138-00', 'Lever Throttle', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1104, 'BRG01040101.1102', 1, 4, 1, 1, '6B4-11193-A1', 'Head Cover 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1105, 'BRG01040101.1103', 1, 4, 1, 1, '682-12414-A1', 'Cover', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1106, 'BRG01050101.1104', 1, 5, 1, 1, '633-14159-00', 'Clip', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1107, 'BRG01170102.1105', 1, 17, 1, 2, '93310-624W2', 'Bearing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1108, 'BRG01070102.1106', 1, 7, 1, 2, '689-11681-01', 'Pin crank', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1109, 'BRG04180101.1107', 4, 18, 1, 1, '6B4-45501-10', 'Drive Shaft', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1110, 'BRG04180101.1108', 4, 18, 1, 1, '679-45501-10', 'Drive Shaft', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1111, 'BRG03220102.1109', 3, 22, 1, 2, '664-44514-00', 'Mount damper Y25', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1112, 'BRG01040102.1110', 1, 4, 1, 2, '6E7-11312-00 / 6E7-10935', 'Sleeve cylinder/Liner', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1113, 'BRG01050101.1111', 1, 5, 1, 1, '6J4-14301-05', 'Carburator assy 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1114, 'BRG01050101.1112', 1, 5, 1, 1, '6B4-14301-02', 'Carburator assy 1', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1115, 'BRG04150101.1113', 4, 15, 1, 1, '66T-45311-01-8D', 'Lower Casing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1116, 'BRG01050101.1114', 1, 5, 1, 1, '6AH-14546-00 / 6G1-14546-00', 'Needle Valve ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1117, 'BRG01050101.1115', 1, 5, 1, 1, '62Y-14392-00 ', 'Needle Valve ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1118, 'BRG04150101.1116', 4, 15, 1, 1, '650-45635-00', 'Plunger shift', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1119, 'BRG04150101.1117', 4, 15, 1, 1, '682-45631-00', 'Clutch Dog', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1120, 'BRG04150101.1118', 4, 15, 1, 1, '66T-45631-00', 'Clutch Dog', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1121, 'BRG04150101.1119', 4, 15, 1, 1, '6G5-44150-02', 'Shift cam assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1122, 'BRG05340000.1120', 5, 34, NULL, NULL, 'SS80169-02', 'S.S Swivel 316 deck 1\" Seastar', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1123, 'BRG04150101.1121', 4, 15, 1, 1, '6G5-44150-03', 'Shift cam assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1124, 'BRG04150101.1122', 4, 15, 1, 1, '6E5-45634-02', 'Slide Shift', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1125, 'BRG04150101.1123', 4, 15, 1, 1, '6D1-45332-00-CA', 'Housing Bearing ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1126, 'BRG03100101.1124', 3, 10, 1, 1, '689-43160-00', 'Tilt rod assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1127, 'BRG05280001.1125', 5, 28, NULL, 1, NULL, 'Seal P.Steering Seastar', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1128, 'BRG04180101.1126', 4, 18, 1, 1, '6G5-45501-22', 'Drive shaft comp long', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1129, 'BRG05120502.1127', 5, 12, 5, 2, '6G1-24305-00', 'Fuel pipe joint', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1130, 'BRG01140502.1128', 1, 14, 5, 2, '692-24410-00', 'Fuel pump assy', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1131, 'BRG04150502.1129', 4, 15, 5, 2, '6F5-45560-00', 'Gear 1 ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1132, 'BRG04150502.1130', 4, 15, 5, 2, '6F5-45551-00', 'Pinion ', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1133, 'BRG03100502.1131', 3, 10, 5, 2, '663-43118-01-4D', 'Handle Transom Clamp', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1134, 'BRG04210502.1132', 4, 21, 5, 2, '679-45611-00', 'Shaft Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1135, 'BRG04200502.1133', 4, 20, 5, 2, '670-45997-00', 'Propeller spacer', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1136, 'BRG03100502.1134', 3, 10, 5, 2, '676-43160-02', 'Tilt rod assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1137, 'BRG01040101.1135', 1, 4, 1, 1, '6B4-41112-A0', 'Exhaust Inner Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1138, 'BRG01040101.1136', 1, 4, 1, 1, '63V-41112-A0', 'Exhaust Inner Cover', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1139, 'BRG01050101.1137', 1, 5, 1, 1, '6F5-14384-00', 'Float Chamber', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1140, 'BRG04180101.1138', 4, 18, 1, 1, '90179-10M14', 'Nut', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1141, 'BRG04180101.1139', 4, 18, 1, 1, '61N-45510-10', 'Drive shaft assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1142, 'BRG04200102.1140', 4, 20, 1, 2, '663-45987-00', 'Spacer', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1143, 'BRG04150502.1141', 4, 15, 5, 2, '93210-66M98', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1144, 'BRG04160502.1142', 4, 16, 5, 2, '93210-41042', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1145, 'BRG01140502.1143', 1, 14, 5, 2, '93210-32738', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1146, 'BRG01040502.1144', 1, 4, 5, 2, '93210-65M50', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1147, 'BRG04180502.1145', 4, 18, 5, 2, '93210-58677', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1148, 'BRG04160502.1146', 4, 16, 5, 2, '93210-86M38', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1149, 'BRG04180502.1147', 4, 18, 5, 2, '93210-55354 / 93210-54534', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1150, 'BRG04160502.1148', 4, 16, 5, 2, '93210-37M67', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1151, 'BRG01040502.1149', 1, 4, 5, 2, '93210-74M35', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1152, 'BRG04210101.1150', 4, 21, 1, 1, '66T-45611-00', 'Shaft Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1153, 'BRG04150102.1151', 4, 15, 1, 2, '63D-45361-02-4D', 'Cap lower casing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1154, 'BRG04150101.1152', 4, 15, 1, 1, '63D-45361-02-8D', 'Cap lower casing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1155, 'BRG04150101.1153', 4, 15, 1, 1, '90250-05010', 'Pin straight', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1156, 'BRG03220101.1154', 3, 22, 1, 1, '676-44533-00', 'Mount damper upper', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1157, 'BRG04150101.1155', 4, 15, 1, 1, '6N7-81807-00', 'Gear assy', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1158, 'BRG04200101.1156', 4, 20, 1, 1, '663-45981-10', 'Damper rubber propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1159, 'BRG04200502.1157', 4, 20, 5, 2, '69W-45945-00-EL', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1160, 'BRG05340000.1158', 5, 34, NULL, NULL, 'SS52558', 'Seastar-Hinge 50x50x2MM', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1161, 'BRG05350000.1159', 5, 35, NULL, NULL, '00194', 'Navigation Light 100/CTN', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1162, 'BRG05350000.1160', 5, 35, NULL, NULL, '00091', 'Small round side light,  Green STAR LT', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1163, 'BRG05350000.1161', 5, 35, NULL, NULL, '00092', 'Small round side light, Red Port L', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1164, 'BRG05350000.1162', 5, 35, NULL, NULL, '00093', 'Small round side light, 225 DEG', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1165, 'BRG05240101.1163', 5, 24, 1, 1, '6E5-48344-00', 'Cable end', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1166, 'BRG01140101.1164', 1, 14, 1, 1, '64J-24560-11', 'Filter assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1167, 'BRG03100101.1165', 3, 10, 1, 1, '676-43160-02', 'Tilt ROD  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1168, 'BRG01050101.1166', 1, 5, 1, 1, '5Y1-14397-00', 'O-Ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1169, 'BRG02090201.1167', 2, 9, 2, 1, '67466-95200', 'Connector throttle cable', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1170, 'BRG05240201.1168', 5, 24, 2, 1, '67467-94404', 'Connector', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1171, 'BRG05240201.1169', 5, 24, 2, 1, '67341-94400', 'Holder Remocon cable', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1172, 'BRG01140201.1170', 1, 14, 2, 1, '65750-95500', 'Socket fuel hose', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1173, 'BRG01140201.1171', 1, 14, 2, 1, '65750-98506', 'Socket fuel hose', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1174, 'BRG05340000.1172', 5, 34, NULL, NULL, '16584-18', 'Wiper arm ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1175, 'BRG05240101.1173', 5, 24, 1, 1, '703-48205-23', 'Remote Control (10 Pin)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1176, 'BRG05350000.1174', 5, 35, NULL, NULL, '00165-WH', 'LED Surface Mount Light w/16 cool white', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1177, 'BRG01040101.1175', 1, 4, 1, 1, '69J-11181-03', 'Cylinder Head', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1178, 'BRG01040101.1176', 1, 4, 1, 1, '69J-11182-03', 'Cylinder Head', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1179, 'BRG02320101.1177', 2, 32, 1, 1, '61A-81941-00', 'Relay stater', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1180, 'BRG05370000.1178', 5, 37, NULL, NULL, NULL, 'Bilge pump Rule 2000GPH', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1181, 'BRG03100101.1179', 3, 10, 1, 1, '90206-12M00', 'Washer', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1182, 'BRG03100101.1180', 3, 10, 1, 1, '676-43191-00', 'Shaft stopper', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1183, 'BRG01070101.1181', 1, 7, 1, 1, '93102-40M38', 'Oil seal', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1184, 'BRG05360000.1182', 5, 36, NULL, NULL, '70032-WH', 'Compass wth White Bracket Large', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1185, 'BRG04160701.1183', 4, 16, 7, 1, '19210-ZW9-A32', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1186, 'BRG04150101.1184', 4, 15, 1, 1, '6E7-45571-00', 'Gear 2', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1187, 'BRG04160101.1185', 4, 16, 1, 1, '63V-45315-A0', 'Packing Lower Casing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1188, 'BRG04160701.1186', 4, 16, 7, 1, '90752-ZW9-A30', 'Key Woodruff ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1189, 'BRG05280100.1187', 5, 28, 1, NULL, 'CS-TX-30FT', 'Cable Steer TX 30FT (9,1 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1190, 'BRG05290100.1188', 5, 29, 1, NULL, 'CR-TX-30FT', 'Cable remote TX 30FT (9,1 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1191, 'BRG01050101.1189', 1, 5, 1, 1, '676-14943-40', 'Jet Main', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1192, 'BRG04150101.1190', 4, 15, 1, 1, '676-45635-00', 'Plunger ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1193, 'BRG04150101.1191', 4, 15, 1, 1, '663-45567-01', 'Shim', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1194, 'BRG05360000.1192', 5, 36, NULL, NULL, '10008', 'Heavy Duty Battery Switch 380AMP', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1195, 'BRG01050101.1193', 1, 5, 1, 1, '66T-14301-61', 'Carburator Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1196, 'BRG02090101.1194', 2, 9, 1, 1, '9E471-04305', 'Housing F-4-B', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1197, 'BRG05350000.1195', 5, 35, NULL, NULL, 'ACC-CH001-WHITE', 'Remote control searching LT', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1198, 'BRG01040101.1196', 1, 4, 1, 1, '63V-15396-01-CA', 'Housing Oil Seal  ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1199, 'BRG01040101.1197', 1, 4, 1, 1, '63V-45113-A1', 'Upper Casing', 'pcs', 3.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1200, 'BRG03100101.1198', 3, 10, 1, 1, '90386-10M16', 'Bushing', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1201, 'BRG03100101.1199', 3, 10, 1, 1, '90249-12M27', 'Pin (6F6)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1202, 'BRG03100101.1200', 3, 10, 1, 1, '6F5-43628-80', 'Stopper 2 ', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1203, 'BRG03100101.1201', 3, 10, 1, 1, '90249-12M13', 'Pin (6F5)', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1204, 'BRG01040101.1202', 1, 4, 1, 1, '94702-00217', 'Busi B7HS-10', 'pcs', 5.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1205, 'BRG01040101.1203', 1, 4, 1, 1, '93102-25M48', 'Oil seal 63V', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1206, 'BRG03100101.1204', 3, 10, 1, 1, '682-41133-A0', 'Exhaust Manifold', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1207, 'BRG01040101.1205', 1, 4, 1, 1, '6B4-44121-00', 'Lever Shift ROD', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1208, 'BRG05290100.1206', 5, 29, 1, NULL, 'CR-KRA-4M', 'Cable remote korea (4 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1209, 'BRG05290100.1207', 5, 29, 1, NULL, 'CR-KRA-5M', 'Cable remoter korea (5 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1210, 'BRG05390102.1208', 5, 39, 1, 2, 'ACC-STK-85HP', 'Sticker YMH 85HP', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1211, 'BRG04310201.1209', 4, 31, 2, 1, '55125-95500', 'Trim Tab', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1212, 'BRG04200102.1210', 4, 20, 1, 2, '663-45947-02-EL', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1213, 'BRG04200102.1211', 4, 20, 1, 2, '69W-45945-13', 'Propeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1214, 'BRG03100502.1212', 3, 10, 5, 2, '90386-52M02', 'Bushing', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1215, 'BRG04150101.1213', 4, 15, 1, 1, '90501-15M01', 'Spring Compression', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1216, 'BRG04150101.1214', 4, 15, 1, 1, '90501-16M01', 'Spring Compression', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1217, 'BRG02080101.1215', 2, 8, 1, 1, '90280-05001', 'Key Woodruff ', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1218, 'BRG04160101.1216', 4, 16, 1, 1, '689-44352-02', 'Impeller', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1219, 'BRG01140601.1217', 1, 14, 6, 1, '822626Q05', 'Filter Assy / 8M0065103', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1220, 'BRG03190101.1218', 3, 19, 1, 1, '6H1-43880-02', 'Motor Assy', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1221, 'BRG05340000.1219', 5, 34, NULL, NULL, 'PLF-FENDER F5-WHITE', 'Fender F.5', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1222, 'BRG01070101.1220', 1, 7, 1, 1, '6F5-11422-12', 'Crank 2', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1223, 'BRG03100101.1221', 3, 10, 1, 1, '90202-12M01', 'Washer Plate', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1224, 'BRG05290100.1222', 5, 29, 1, NULL, 'CR-KRA-7M', 'Cable remote korea (7 mtr)', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1225, 'BRG04160601.1223', 4, 16, 6, 1, '19453T', 'Impeller', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1226, 'BRG05360000.1224', 5, 36, NULL, NULL, 'GRN-GPS 585PLUS', 'Garmin GPS MAP 585PLUS', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1227, 'BRG05280000.1225', 5, 28, NULL, NULL, 'ACC-SEAFIRST SOC3520H', 'Seafirst Cylinder (D0068846)', 'set', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1228, 'BRG01130101.1226', 1, 13, 1, 1, '63P-13761-01', 'Injector', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1229, 'BRG05270102.1227', 5, 27, 1, 2, NULL, 'Sarung mesin 15DMHL', 'pcs', 2.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
INSERT INTO `mas_barangs` VALUES (1230, 'BRG04160101.1228', 4, 16, 1, 1, '93210-44704', 'O-ring', 'pcs', 1.0, 'Y', NULL, NULL, 11001, 40001, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for mas_bins
-- ----------------------------
DROP TABLE IF EXISTS `mas_bins`;
CREATE TABLE `mas_bins` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `rack_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(100) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `user_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `foreign_cabang_idx` (`cabang_id`) USING BTREE,
  KEY `foreign_gudang_idx` (`gudang_id`) USING BTREE,
  KEY `foreign_rack_idx` (`rack_id`) USING BTREE,
  KEY `foreign_user_idx` (`user_id`) USING BTREE,
  CONSTRAINT `foreign_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `foreign_gudang_idx` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `foreign_rack_idx` FOREIGN KEY (`rack_id`) REFERENCES `mas_racks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `foreign_user_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_bins
-- ----------------------------
BEGIN;
INSERT INTO `mas_bins` VALUES (1, 1, 1, 2, '001', 'zxzxzxzx', 'Y', 1, '2022-03-22 21:54:37', '2022-03-22 21:57:16');
COMMIT;

-- ----------------------------
-- Table structure for mas_cabangs
-- ----------------------------
DROP TABLE IF EXISTS `mas_cabangs`;
CREATE TABLE `mas_cabangs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `kode` varchar(30) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tipe` enum('PUSAT','CAB') DEFAULT 'CAB',
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(18) DEFAULT NULL,
  `alamat` varchar(200) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_cabangs_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `mas_cabangs_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_cabangs
-- ----------------------------
BEGIN;
INSERT INTO `mas_cabangs` VALUES (1, 'C1', 'Cabang Makassar', 'CAB', 'ayat.ekapoetra@gmail.com', '08123456789', 'JL. Hertasning 7 No.22c', 'Y', 1, '2022-03-20 23:51:50', '2022-03-20 23:51:50');
INSERT INTO `mas_cabangs` VALUES (2, 'C2', 'Cabang Kalimantan', 'CAB', 'ayat.ekapoetra@gmail.com', '+628114107717', 'JL. Hertasning 7 No.22c', 'Y', 1, '2022-04-05 14:05:54', '2022-04-05 14:05:54');
COMMIT;

-- ----------------------------
-- Table structure for mas_departments
-- ----------------------------
DROP TABLE IF EXISTS `mas_departments`;
CREATE TABLE `mas_departments` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `golongan` varchar(200) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `departments_foreign_bisnis_idx` (`bisnis_id`) USING BTREE,
  CONSTRAINT `departments_foreign_bisnis_idx` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_departments
-- ----------------------------
BEGIN;
INSERT INTO `mas_departments` VALUES (1, 1, 'Operational', 'MGR', 'Y', '2022-01-31 13:29:29', '2022-03-19 15:50:22');
INSERT INTO `mas_departments` VALUES (2, 1, 'Keuangan', 'MGR', 'Y', '2022-01-31 13:30:22', '2022-03-06 19:18:11');
COMMIT;

-- ----------------------------
-- Table structure for mas_equipment
-- ----------------------------
DROP TABLE IF EXISTS `mas_equipment`;
CREATE TABLE `mas_equipment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(50) NOT NULL,
  `identity` varchar(50) DEFAULT NULL,
  `nama` varchar(50) NOT NULL,
  `group` enum('internal','external','subcon') NOT NULL,
  `tipe` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `manufaktur` varchar(100) NOT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `photo` varchar(200) DEFAULT NULL,
  `coa_in` int(10) unsigned DEFAULT NULL,
  `coa_out` int(10) unsigned DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_equipment_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `mas_equipment_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `mas_equipment_createdby_foreign` (`createdby`) USING BTREE,
  KEY `mas_equipment_coain_foreign` (`coa_in`) USING BTREE,
  KEY `mas_equipment_coaout_foreign` (`coa_out`) USING BTREE,
  CONSTRAINT `mas_equipment_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_equipment_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_equipment_coain_foreign` FOREIGN KEY (`coa_in`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_equipment_coaout_foreign` FOREIGN KEY (`coa_out`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_equipment_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_equipment
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for mas_gaji
-- ----------------------------
DROP TABLE IF EXISTS `mas_gaji`;
CREATE TABLE `mas_gaji` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `component` varchar(255) NOT NULL,
  `tipe` varchar(255) NOT NULL,
  `aktif` enum('Y','N') NOT NULL DEFAULT 'Y',
  `urut` int(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_gaji
-- ----------------------------
BEGIN;
INSERT INTO `mas_gaji` VALUES (1, 'Gaji Pokok', 'tetap', 'Y', 1, '2022-01-31 13:35:43', '2022-01-31 15:03:45');
INSERT INTO `mas_gaji` VALUES (2, 'Tunjangan Transport', 'tetap', 'Y', 3, '2022-01-31 13:40:07', '2022-01-31 15:03:49');
INSERT INTO `mas_gaji` VALUES (3, 'Tunjangan Telekomunikasi', 'tetap', 'Y', 4, '2022-01-31 13:40:57', '2022-01-31 15:03:51');
INSERT INTO `mas_gaji` VALUES (4, 'Tunjangan Jabatan', 'tdk tetap', 'Y', 2, '2022-01-31 13:41:14', '2022-01-31 15:03:48');
INSERT INTO `mas_gaji` VALUES (5, 'Uang Makan', 'tetap', 'Y', 5, '2022-01-31 13:42:51', '2022-01-31 15:03:53');
INSERT INTO `mas_gaji` VALUES (6, 'Bonus', 'tdk tetap', 'Y', 7, '2022-01-31 13:43:12', '2022-01-31 15:04:02');
INSERT INTO `mas_gaji` VALUES (7, 'THR', 'tdk tetap', 'Y', 8, '2022-01-31 13:43:32', '2022-01-31 15:04:05');
INSERT INTO `mas_gaji` VALUES (8, 'Over times', 'tdk tetap', 'Y', 6, '2022-01-31 13:45:14', '2022-01-31 15:03:59');
COMMIT;

-- ----------------------------
-- Table structure for mas_gudangs
-- ----------------------------
DROP TABLE IF EXISTS `mas_gudangs`;
CREATE TABLE `mas_gudangs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(50) NOT NULL,
  `nama` varchar(50) NOT NULL,
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(18) DEFAULT NULL,
  `alamat` varchar(200) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_gudangs_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `mas_gudangs_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `mas_gudangs_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_gudangs_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_gudangs
-- ----------------------------
BEGIN;
INSERT INTO `mas_gudangs` VALUES (1, 1, 'G-KMA', 'GUDANG KIMA MKS', NULL, NULL, NULL, 'Y', 1, '2022-03-20 23:52:27', '2022-03-20 23:52:27');
INSERT INTO `mas_gudangs` VALUES (2, 1, 'G-GWA', 'GUDANG KIMA GOWA', 'ayat.ekapoetra@gmail.com', '123123123123', 'JL. Hertasning 7 No.22c', 'Y', 1, '2022-04-05 14:04:42', '2022-04-05 14:04:42');
INSERT INTO `mas_gudangs` VALUES (3, 2, 'G-SMD', 'GUDANG SAMARINDA', NULL, NULL, NULL, 'Y', 1, '2022-04-05 14:09:58', '2022-04-05 14:09:58');
COMMIT;

-- ----------------------------
-- Table structure for mas_jasas
-- ----------------------------
DROP TABLE IF EXISTS `mas_jasas`;
CREATE TABLE `mas_jasas` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(20) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `narasi` varchar(255) DEFAULT NULL,
  `biaya` float(8,2) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_jasas_cabang_idx` (`cabang_id`) USING BTREE,
  KEY `mas_jasas_user_idx` (`createdby`) USING BTREE,
  CONSTRAINT `mas_jasas_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mas_jasas_user_idx` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_jasas
-- ----------------------------
BEGIN;
INSERT INTO `mas_jasas` VALUES (1, 1, 'JC1.001', 'Jasa Bongkar Blok Cylinder Head', 'test', 100000.00, 'Y', 1, '2022-04-09 21:31:51', '2022-06-09 09:44:26');
COMMIT;

-- ----------------------------
-- Table structure for mas_karyawans
-- ----------------------------
DROP TABLE IF EXISTS `mas_karyawans`;
CREATE TABLE `mas_karyawans` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `department_id` int(10) DEFAULT NULL,
  `nik` varchar(50) NOT NULL,
  `nama` varchar(200) NOT NULL,
  `jenkel` enum('m','f','x') NOT NULL DEFAULT 'm',
  `t4_lahir` varchar(200) DEFAULT NULL,
  `tgl_lahir` date DEFAULT NULL,
  `email` varchar(255) DEFAULT '',
  `phone` varchar(20) DEFAULT '',
  `alamat` varchar(200) DEFAULT '',
  `sts_karyawan` varchar(200) NOT NULL DEFAULT 'kontrak',
  `sts_nikah` varchar(200) NOT NULL,
  `tgl_gabung` date NOT NULL,
  `tgl_expired` date DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `user_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `karyawan_foreign_cabang_idx` (`cabang_id`) USING BTREE,
  KEY `karyawan_foreign_department_idx` (`department_id`) USING BTREE,
  KEY `karyawan_foreign_user_idx` (`user_id`) USING BTREE,
  CONSTRAINT `karyawan_foreign_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `karyawan_foreign_department_idx` FOREIGN KEY (`department_id`) REFERENCES `mas_departments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `karyawan_foreign_user_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_karyawans
-- ----------------------------
BEGIN;
INSERT INTO `mas_karyawans` VALUES (1, 1, 1, 'NIK202111.0001', 'Rustam Dg. Ngunru', 'm', 'Jeneponto', '1979-07-06', 'ayat.ekapoetra@gmail.com', '08123456789', 'JL. Pacalaya No.08', 'kontrak', 'menikah', '2021-11-06', '2022-11-06', 'Y', NULL, '2022-03-06 19:20:56', '2022-04-06 19:58:56');
INSERT INTO `mas_karyawans` VALUES (2, 1, 2, 'NIK202204.0002', 'Zulkifli', 'm', 'Makassar', '2022-04-09', 'zulkifli@localhost.com', '123123123123', 'makassar', 'kontrak', 'menikah', '2022-04-09', '2023-04-09', 'Y', 1, '2022-04-09 20:04:15', '2022-04-09 20:04:15');
COMMIT;

-- ----------------------------
-- Table structure for mas_pelanggans
-- ----------------------------
DROP TABLE IF EXISTS `mas_pelanggans`;
CREATE TABLE `mas_pelanggans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `pic` varchar(100) DEFAULT '',
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(18) DEFAULT NULL,
  `npwp` varchar(25) DEFAULT NULL,
  `alamat_tagih` varchar(200) DEFAULT NULL,
  `alamat_kirim` varchar(200) DEFAULT NULL,
  `limit_pagu` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_pelanggans_createdby_foreign` (`user_id`) USING BTREE,
  CONSTRAINT `mas_pelanggans_createdby_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1002 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_pelanggans
-- ----------------------------
BEGIN;
INSERT INTO `mas_pelanggans` VALUES (1, 1, 'CUST220609.000002', 'Ayat Ekapoetra', 'ayat', 'ayat.ekapoetra@gmail.com', '081355719747', '01010101010', 'JL. Pacalaya No.06', 'JL. Hertasning 7 No.22c', 1000000000.00, 'Y', '2022-06-09 12:00:27', '2022-06-09 12:04:24');
INSERT INTO `mas_pelanggans` VALUES (2, 1, 'CUST220609.000001', 'Pelanggan 000001', 'PIC000001', 'pelanggan000001@localhost.com', '000001000001', '002008000001', 'JL. Localhost No.000001', 'JL. Server No.000001', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (3, 1, 'CUST220609.000002', 'Pelanggan 000002', 'PIC000002', 'pelanggan000002@localhost.com', '000002000002', '002008000002', 'JL. Localhost No.000002', 'JL. Server No.000002', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (4, 1, 'CUST220609.000003', 'Pelanggan 000003', 'PIC000003', 'pelanggan000003@localhost.com', '000003000003', '002008000003', 'JL. Localhost No.000003', 'JL. Server No.000003', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (5, 1, 'CUST220609.000004', 'Pelanggan 000004', 'PIC000004', 'pelanggan000004@localhost.com', '000004000004', '002008000004', 'JL. Localhost No.000004', 'JL. Server No.000004', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (6, 1, 'CUST220609.000005', 'Pelanggan 000005', 'PIC000005', 'pelanggan000005@localhost.com', '000005000005', '002008000005', 'JL. Localhost No.000005', 'JL. Server No.000005', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (7, 1, 'CUST220609.000006', 'Pelanggan 000006', 'PIC000006', 'pelanggan000006@localhost.com', '000006000006', '002008000006', 'JL. Localhost No.000006', 'JL. Server No.000006', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (8, 1, 'CUST220609.000007', 'Pelanggan 000007', 'PIC000007', 'pelanggan000007@localhost.com', '000007000007', '002008000007', 'JL. Localhost No.000007', 'JL. Server No.000007', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (9, 1, 'CUST220609.000008', 'Pelanggan 000008', 'PIC000008', 'pelanggan000008@localhost.com', '000008000008', '002008000008', 'JL. Localhost No.000008', 'JL. Server No.000008', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (10, 1, 'CUST220609.000009', 'Pelanggan 000009', 'PIC000009', 'pelanggan000009@localhost.com', '000009000009', '002008000009', 'JL. Localhost No.000009', 'JL. Server No.000009', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (11, 1, 'CUST220609.000010', 'Pelanggan 000010', 'PIC000010', 'pelanggan000010@localhost.com', '000010000010', '002008000010', 'JL. Localhost No.000010', 'JL. Server No.000010', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (12, 1, 'CUST220609.000011', 'Pelanggan 000011', 'PIC000011', 'pelanggan000011@localhost.com', '000011000011', '002008000011', 'JL. Localhost No.000011', 'JL. Server No.000011', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (13, 1, 'CUST220609.000012', 'Pelanggan 000012', 'PIC000012', 'pelanggan000012@localhost.com', '000012000012', '002008000012', 'JL. Localhost No.000012', 'JL. Server No.000012', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (14, 1, 'CUST220609.000013', 'Pelanggan 000013', 'PIC000013', 'pelanggan000013@localhost.com', '000013000013', '002008000013', 'JL. Localhost No.000013', 'JL. Server No.000013', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (15, 1, 'CUST220609.000014', 'Pelanggan 000014', 'PIC000014', 'pelanggan000014@localhost.com', '000014000014', '002008000014', 'JL. Localhost No.000014', 'JL. Server No.000014', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (16, 1, 'CUST220609.000015', 'Pelanggan 000015', 'PIC000015', 'pelanggan000015@localhost.com', '000015000015', '002008000015', 'JL. Localhost No.000015', 'JL. Server No.000015', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (17, 1, 'CUST220609.000016', 'Pelanggan 000016', 'PIC000016', 'pelanggan000016@localhost.com', '000016000016', '002008000016', 'JL. Localhost No.000016', 'JL. Server No.000016', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (18, 1, 'CUST220609.000017', 'Pelanggan 000017', 'PIC000017', 'pelanggan000017@localhost.com', '000017000017', '002008000017', 'JL. Localhost No.000017', 'JL. Server No.000017', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (19, 1, 'CUST220609.000018', 'Pelanggan 000018', 'PIC000018', 'pelanggan000018@localhost.com', '000018000018', '002008000018', 'JL. Localhost No.000018', 'JL. Server No.000018', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (20, 1, 'CUST220609.000019', 'Pelanggan 000019', 'PIC000019', 'pelanggan000019@localhost.com', '000019000019', '002008000019', 'JL. Localhost No.000019', 'JL. Server No.000019', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (21, 1, 'CUST220609.000020', 'Pelanggan 000020', 'PIC000020', 'pelanggan000020@localhost.com', '000020000020', '002008000020', 'JL. Localhost No.000020', 'JL. Server No.000020', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (22, 1, 'CUST220609.000021', 'Pelanggan 000021', 'PIC000021', 'pelanggan000021@localhost.com', '000021000021', '002008000021', 'JL. Localhost No.000021', 'JL. Server No.000021', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (23, 1, 'CUST220609.000022', 'Pelanggan 000022', 'PIC000022', 'pelanggan000022@localhost.com', '000022000022', '002008000022', 'JL. Localhost No.000022', 'JL. Server No.000022', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (24, 1, 'CUST220609.000023', 'Pelanggan 000023', 'PIC000023', 'pelanggan000023@localhost.com', '000023000023', '002008000023', 'JL. Localhost No.000023', 'JL. Server No.000023', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (25, 1, 'CUST220609.000024', 'Pelanggan 000024', 'PIC000024', 'pelanggan000024@localhost.com', '000024000024', '002008000024', 'JL. Localhost No.000024', 'JL. Server No.000024', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (26, 1, 'CUST220609.000025', 'Pelanggan 000025', 'PIC000025', 'pelanggan000025@localhost.com', '000025000025', '002008000025', 'JL. Localhost No.000025', 'JL. Server No.000025', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (27, 1, 'CUST220609.000026', 'Pelanggan 000026', 'PIC000026', 'pelanggan000026@localhost.com', '000026000026', '002008000026', 'JL. Localhost No.000026', 'JL. Server No.000026', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (28, 1, 'CUST220609.000027', 'Pelanggan 000027', 'PIC000027', 'pelanggan000027@localhost.com', '000027000027', '002008000027', 'JL. Localhost No.000027', 'JL. Server No.000027', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (29, 1, 'CUST220609.000028', 'Pelanggan 000028', 'PIC000028', 'pelanggan000028@localhost.com', '000028000028', '002008000028', 'JL. Localhost No.000028', 'JL. Server No.000028', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (30, 1, 'CUST220609.000029', 'Pelanggan 000029', 'PIC000029', 'pelanggan000029@localhost.com', '000029000029', '002008000029', 'JL. Localhost No.000029', 'JL. Server No.000029', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (31, 1, 'CUST220609.000030', 'Pelanggan 000030', 'PIC000030', 'pelanggan000030@localhost.com', '000030000030', '002008000030', 'JL. Localhost No.000030', 'JL. Server No.000030', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (32, 1, 'CUST220609.000031', 'Pelanggan 000031', 'PIC000031', 'pelanggan000031@localhost.com', '000031000031', '002008000031', 'JL. Localhost No.000031', 'JL. Server No.000031', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (33, 1, 'CUST220609.000032', 'Pelanggan 000032', 'PIC000032', 'pelanggan000032@localhost.com', '000032000032', '002008000032', 'JL. Localhost No.000032', 'JL. Server No.000032', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (34, 1, 'CUST220609.000033', 'Pelanggan 000033', 'PIC000033', 'pelanggan000033@localhost.com', '000033000033', '002008000033', 'JL. Localhost No.000033', 'JL. Server No.000033', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (35, 1, 'CUST220609.000034', 'Pelanggan 000034', 'PIC000034', 'pelanggan000034@localhost.com', '000034000034', '002008000034', 'JL. Localhost No.000034', 'JL. Server No.000034', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (36, 1, 'CUST220609.000035', 'Pelanggan 000035', 'PIC000035', 'pelanggan000035@localhost.com', '000035000035', '002008000035', 'JL. Localhost No.000035', 'JL. Server No.000035', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (37, 1, 'CUST220609.000036', 'Pelanggan 000036', 'PIC000036', 'pelanggan000036@localhost.com', '000036000036', '002008000036', 'JL. Localhost No.000036', 'JL. Server No.000036', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (38, 1, 'CUST220609.000037', 'Pelanggan 000037', 'PIC000037', 'pelanggan000037@localhost.com', '000037000037', '002008000037', 'JL. Localhost No.000037', 'JL. Server No.000037', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (39, 1, 'CUST220609.000038', 'Pelanggan 000038', 'PIC000038', 'pelanggan000038@localhost.com', '000038000038', '002008000038', 'JL. Localhost No.000038', 'JL. Server No.000038', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (40, 1, 'CUST220609.000039', 'Pelanggan 000039', 'PIC000039', 'pelanggan000039@localhost.com', '000039000039', '002008000039', 'JL. Localhost No.000039', 'JL. Server No.000039', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (41, 1, 'CUST220609.000040', 'Pelanggan 000040', 'PIC000040', 'pelanggan000040@localhost.com', '000040000040', '002008000040', 'JL. Localhost No.000040', 'JL. Server No.000040', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (42, 1, 'CUST220609.000041', 'Pelanggan 000041', 'PIC000041', 'pelanggan000041@localhost.com', '000041000041', '002008000041', 'JL. Localhost No.000041', 'JL. Server No.000041', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (43, 1, 'CUST220609.000042', 'Pelanggan 000042', 'PIC000042', 'pelanggan000042@localhost.com', '000042000042', '002008000042', 'JL. Localhost No.000042', 'JL. Server No.000042', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (44, 1, 'CUST220609.000043', 'Pelanggan 000043', 'PIC000043', 'pelanggan000043@localhost.com', '000043000043', '002008000043', 'JL. Localhost No.000043', 'JL. Server No.000043', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (45, 1, 'CUST220609.000044', 'Pelanggan 000044', 'PIC000044', 'pelanggan000044@localhost.com', '000044000044', '002008000044', 'JL. Localhost No.000044', 'JL. Server No.000044', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (46, 1, 'CUST220609.000045', 'Pelanggan 000045', 'PIC000045', 'pelanggan000045@localhost.com', '000045000045', '002008000045', 'JL. Localhost No.000045', 'JL. Server No.000045', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (47, 1, 'CUST220609.000046', 'Pelanggan 000046', 'PIC000046', 'pelanggan000046@localhost.com', '000046000046', '002008000046', 'JL. Localhost No.000046', 'JL. Server No.000046', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (48, 1, 'CUST220609.000047', 'Pelanggan 000047', 'PIC000047', 'pelanggan000047@localhost.com', '000047000047', '002008000047', 'JL. Localhost No.000047', 'JL. Server No.000047', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (49, 1, 'CUST220609.000048', 'Pelanggan 000048', 'PIC000048', 'pelanggan000048@localhost.com', '000048000048', '002008000048', 'JL. Localhost No.000048', 'JL. Server No.000048', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (50, 1, 'CUST220609.000049', 'Pelanggan 000049', 'PIC000049', 'pelanggan000049@localhost.com', '000049000049', '002008000049', 'JL. Localhost No.000049', 'JL. Server No.000049', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (51, 1, 'CUST220609.000050', 'Pelanggan 000050', 'PIC000050', 'pelanggan000050@localhost.com', '000050000050', '002008000050', 'JL. Localhost No.000050', 'JL. Server No.000050', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (52, 1, 'CUST220609.000051', 'Pelanggan 000051', 'PIC000051', 'pelanggan000051@localhost.com', '000051000051', '002008000051', 'JL. Localhost No.000051', 'JL. Server No.000051', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (53, 1, 'CUST220609.000052', 'Pelanggan 000052', 'PIC000052', 'pelanggan000052@localhost.com', '000052000052', '002008000052', 'JL. Localhost No.000052', 'JL. Server No.000052', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (54, 1, 'CUST220609.000053', 'Pelanggan 000053', 'PIC000053', 'pelanggan000053@localhost.com', '000053000053', '002008000053', 'JL. Localhost No.000053', 'JL. Server No.000053', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (55, 1, 'CUST220609.000054', 'Pelanggan 000054', 'PIC000054', 'pelanggan000054@localhost.com', '000054000054', '002008000054', 'JL. Localhost No.000054', 'JL. Server No.000054', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (56, 1, 'CUST220609.000055', 'Pelanggan 000055', 'PIC000055', 'pelanggan000055@localhost.com', '000055000055', '002008000055', 'JL. Localhost No.000055', 'JL. Server No.000055', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (57, 1, 'CUST220609.000056', 'Pelanggan 000056', 'PIC000056', 'pelanggan000056@localhost.com', '000056000056', '002008000056', 'JL. Localhost No.000056', 'JL. Server No.000056', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (58, 1, 'CUST220609.000057', 'Pelanggan 000057', 'PIC000057', 'pelanggan000057@localhost.com', '000057000057', '002008000057', 'JL. Localhost No.000057', 'JL. Server No.000057', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (59, 1, 'CUST220609.000058', 'Pelanggan 000058', 'PIC000058', 'pelanggan000058@localhost.com', '000058000058', '002008000058', 'JL. Localhost No.000058', 'JL. Server No.000058', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (60, 1, 'CUST220609.000059', 'Pelanggan 000059', 'PIC000059', 'pelanggan000059@localhost.com', '000059000059', '002008000059', 'JL. Localhost No.000059', 'JL. Server No.000059', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (61, 1, 'CUST220609.000060', 'Pelanggan 000060', 'PIC000060', 'pelanggan000060@localhost.com', '000060000060', '002008000060', 'JL. Localhost No.000060', 'JL. Server No.000060', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (62, 1, 'CUST220609.000061', 'Pelanggan 000061', 'PIC000061', 'pelanggan000061@localhost.com', '000061000061', '002008000061', 'JL. Localhost No.000061', 'JL. Server No.000061', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (63, 1, 'CUST220609.000062', 'Pelanggan 000062', 'PIC000062', 'pelanggan000062@localhost.com', '000062000062', '002008000062', 'JL. Localhost No.000062', 'JL. Server No.000062', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (64, 1, 'CUST220609.000063', 'Pelanggan 000063', 'PIC000063', 'pelanggan000063@localhost.com', '000063000063', '002008000063', 'JL. Localhost No.000063', 'JL. Server No.000063', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (65, 1, 'CUST220609.000064', 'Pelanggan 000064', 'PIC000064', 'pelanggan000064@localhost.com', '000064000064', '002008000064', 'JL. Localhost No.000064', 'JL. Server No.000064', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (66, 1, 'CUST220609.000065', 'Pelanggan 000065', 'PIC000065', 'pelanggan000065@localhost.com', '000065000065', '002008000065', 'JL. Localhost No.000065', 'JL. Server No.000065', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (67, 1, 'CUST220609.000066', 'Pelanggan 000066', 'PIC000066', 'pelanggan000066@localhost.com', '000066000066', '002008000066', 'JL. Localhost No.000066', 'JL. Server No.000066', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (68, 1, 'CUST220609.000067', 'Pelanggan 000067', 'PIC000067', 'pelanggan000067@localhost.com', '000067000067', '002008000067', 'JL. Localhost No.000067', 'JL. Server No.000067', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (69, 1, 'CUST220609.000068', 'Pelanggan 000068', 'PIC000068', 'pelanggan000068@localhost.com', '000068000068', '002008000068', 'JL. Localhost No.000068', 'JL. Server No.000068', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (70, 1, 'CUST220609.000069', 'Pelanggan 000069', 'PIC000069', 'pelanggan000069@localhost.com', '000069000069', '002008000069', 'JL. Localhost No.000069', 'JL. Server No.000069', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (71, 1, 'CUST220609.000070', 'Pelanggan 000070', 'PIC000070', 'pelanggan000070@localhost.com', '000070000070', '002008000070', 'JL. Localhost No.000070', 'JL. Server No.000070', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (72, 1, 'CUST220609.000071', 'Pelanggan 000071', 'PIC000071', 'pelanggan000071@localhost.com', '000071000071', '002008000071', 'JL. Localhost No.000071', 'JL. Server No.000071', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (73, 1, 'CUST220609.000072', 'Pelanggan 000072', 'PIC000072', 'pelanggan000072@localhost.com', '000072000072', '002008000072', 'JL. Localhost No.000072', 'JL. Server No.000072', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (74, 1, 'CUST220609.000073', 'Pelanggan 000073', 'PIC000073', 'pelanggan000073@localhost.com', '000073000073', '002008000073', 'JL. Localhost No.000073', 'JL. Server No.000073', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (75, 1, 'CUST220609.000074', 'Pelanggan 000074', 'PIC000074', 'pelanggan000074@localhost.com', '000074000074', '002008000074', 'JL. Localhost No.000074', 'JL. Server No.000074', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (76, 1, 'CUST220609.000075', 'Pelanggan 000075', 'PIC000075', 'pelanggan000075@localhost.com', '000075000075', '002008000075', 'JL. Localhost No.000075', 'JL. Server No.000075', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (77, 1, 'CUST220609.000076', 'Pelanggan 000076', 'PIC000076', 'pelanggan000076@localhost.com', '000076000076', '002008000076', 'JL. Localhost No.000076', 'JL. Server No.000076', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (78, 1, 'CUST220609.000077', 'Pelanggan 000077', 'PIC000077', 'pelanggan000077@localhost.com', '000077000077', '002008000077', 'JL. Localhost No.000077', 'JL. Server No.000077', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (79, 1, 'CUST220609.000078', 'Pelanggan 000078', 'PIC000078', 'pelanggan000078@localhost.com', '000078000078', '002008000078', 'JL. Localhost No.000078', 'JL. Server No.000078', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (80, 1, 'CUST220609.000079', 'Pelanggan 000079', 'PIC000079', 'pelanggan000079@localhost.com', '000079000079', '002008000079', 'JL. Localhost No.000079', 'JL. Server No.000079', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (81, 1, 'CUST220609.000080', 'Pelanggan 000080', 'PIC000080', 'pelanggan000080@localhost.com', '000080000080', '002008000080', 'JL. Localhost No.000080', 'JL. Server No.000080', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (82, 1, 'CUST220609.000081', 'Pelanggan 000081', 'PIC000081', 'pelanggan000081@localhost.com', '000081000081', '002008000081', 'JL. Localhost No.000081', 'JL. Server No.000081', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (83, 1, 'CUST220609.000082', 'Pelanggan 000082', 'PIC000082', 'pelanggan000082@localhost.com', '000082000082', '002008000082', 'JL. Localhost No.000082', 'JL. Server No.000082', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (84, 1, 'CUST220609.000083', 'Pelanggan 000083', 'PIC000083', 'pelanggan000083@localhost.com', '000083000083', '002008000083', 'JL. Localhost No.000083', 'JL. Server No.000083', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (85, 1, 'CUST220609.000084', 'Pelanggan 000084', 'PIC000084', 'pelanggan000084@localhost.com', '000084000084', '002008000084', 'JL. Localhost No.000084', 'JL. Server No.000084', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (86, 1, 'CUST220609.000085', 'Pelanggan 000085', 'PIC000085', 'pelanggan000085@localhost.com', '000085000085', '002008000085', 'JL. Localhost No.000085', 'JL. Server No.000085', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (87, 1, 'CUST220609.000086', 'Pelanggan 000086', 'PIC000086', 'pelanggan000086@localhost.com', '000086000086', '002008000086', 'JL. Localhost No.000086', 'JL. Server No.000086', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (88, 1, 'CUST220609.000087', 'Pelanggan 000087', 'PIC000087', 'pelanggan000087@localhost.com', '000087000087', '002008000087', 'JL. Localhost No.000087', 'JL. Server No.000087', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (89, 1, 'CUST220609.000088', 'Pelanggan 000088', 'PIC000088', 'pelanggan000088@localhost.com', '000088000088', '002008000088', 'JL. Localhost No.000088', 'JL. Server No.000088', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (90, 1, 'CUST220609.000089', 'Pelanggan 000089', 'PIC000089', 'pelanggan000089@localhost.com', '000089000089', '002008000089', 'JL. Localhost No.000089', 'JL. Server No.000089', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (91, 1, 'CUST220609.000090', 'Pelanggan 000090', 'PIC000090', 'pelanggan000090@localhost.com', '000090000090', '002008000090', 'JL. Localhost No.000090', 'JL. Server No.000090', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (92, 1, 'CUST220609.000091', 'Pelanggan 000091', 'PIC000091', 'pelanggan000091@localhost.com', '000091000091', '002008000091', 'JL. Localhost No.000091', 'JL. Server No.000091', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (93, 1, 'CUST220609.000092', 'Pelanggan 000092', 'PIC000092', 'pelanggan000092@localhost.com', '000092000092', '002008000092', 'JL. Localhost No.000092', 'JL. Server No.000092', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (94, 1, 'CUST220609.000093', 'Pelanggan 000093', 'PIC000093', 'pelanggan000093@localhost.com', '000093000093', '002008000093', 'JL. Localhost No.000093', 'JL. Server No.000093', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (95, 1, 'CUST220609.000094', 'Pelanggan 000094', 'PIC000094', 'pelanggan000094@localhost.com', '000094000094', '002008000094', 'JL. Localhost No.000094', 'JL. Server No.000094', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (96, 1, 'CUST220609.000095', 'Pelanggan 000095', 'PIC000095', 'pelanggan000095@localhost.com', '000095000095', '002008000095', 'JL. Localhost No.000095', 'JL. Server No.000095', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (97, 1, 'CUST220609.000096', 'Pelanggan 000096', 'PIC000096', 'pelanggan000096@localhost.com', '000096000096', '002008000096', 'JL. Localhost No.000096', 'JL. Server No.000096', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (98, 1, 'CUST220609.000097', 'Pelanggan 000097', 'PIC000097', 'pelanggan000097@localhost.com', '000097000097', '002008000097', 'JL. Localhost No.000097', 'JL. Server No.000097', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (99, 1, 'CUST220609.000098', 'Pelanggan 000098', 'PIC000098', 'pelanggan000098@localhost.com', '000098000098', '002008000098', 'JL. Localhost No.000098', 'JL. Server No.000098', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (100, 1, 'CUST220609.000099', 'Pelanggan 000099', 'PIC000099', 'pelanggan000099@localhost.com', '000099000099', '002008000099', 'JL. Localhost No.000099', 'JL. Server No.000099', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (101, 1, 'CUST220609.000100', 'Pelanggan 000100', 'PIC000100', 'pelanggan000100@localhost.com', '000100000100', '002008000100', 'JL. Localhost No.000100', 'JL. Server No.000100', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (102, 1, 'CUST220609.000101', 'Pelanggan 000101', 'PIC000101', 'pelanggan000101@localhost.com', '000101000101', '002008000101', 'JL. Localhost No.000101', 'JL. Server No.000101', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (103, 1, 'CUST220609.000102', 'Pelanggan 000102', 'PIC000102', 'pelanggan000102@localhost.com', '000102000102', '002008000102', 'JL. Localhost No.000102', 'JL. Server No.000102', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (104, 1, 'CUST220609.000103', 'Pelanggan 000103', 'PIC000103', 'pelanggan000103@localhost.com', '000103000103', '002008000103', 'JL. Localhost No.000103', 'JL. Server No.000103', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (105, 1, 'CUST220609.000104', 'Pelanggan 000104', 'PIC000104', 'pelanggan000104@localhost.com', '000104000104', '002008000104', 'JL. Localhost No.000104', 'JL. Server No.000104', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (106, 1, 'CUST220609.000105', 'Pelanggan 000105', 'PIC000105', 'pelanggan000105@localhost.com', '000105000105', '002008000105', 'JL. Localhost No.000105', 'JL. Server No.000105', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (107, 1, 'CUST220609.000106', 'Pelanggan 000106', 'PIC000106', 'pelanggan000106@localhost.com', '000106000106', '002008000106', 'JL. Localhost No.000106', 'JL. Server No.000106', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (108, 1, 'CUST220609.000107', 'Pelanggan 000107', 'PIC000107', 'pelanggan000107@localhost.com', '000107000107', '002008000107', 'JL. Localhost No.000107', 'JL. Server No.000107', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (109, 1, 'CUST220609.000108', 'Pelanggan 000108', 'PIC000108', 'pelanggan000108@localhost.com', '000108000108', '002008000108', 'JL. Localhost No.000108', 'JL. Server No.000108', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (110, 1, 'CUST220609.000109', 'Pelanggan 000109', 'PIC000109', 'pelanggan000109@localhost.com', '000109000109', '002008000109', 'JL. Localhost No.000109', 'JL. Server No.000109', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (111, 1, 'CUST220609.000110', 'Pelanggan 000110', 'PIC000110', 'pelanggan000110@localhost.com', '000110000110', '002008000110', 'JL. Localhost No.000110', 'JL. Server No.000110', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (112, 1, 'CUST220609.000111', 'Pelanggan 000111', 'PIC000111', 'pelanggan000111@localhost.com', '000111000111', '002008000111', 'JL. Localhost No.000111', 'JL. Server No.000111', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (113, 1, 'CUST220609.000112', 'Pelanggan 000112', 'PIC000112', 'pelanggan000112@localhost.com', '000112000112', '002008000112', 'JL. Localhost No.000112', 'JL. Server No.000112', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (114, 1, 'CUST220609.000113', 'Pelanggan 000113', 'PIC000113', 'pelanggan000113@localhost.com', '000113000113', '002008000113', 'JL. Localhost No.000113', 'JL. Server No.000113', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (115, 1, 'CUST220609.000114', 'Pelanggan 000114', 'PIC000114', 'pelanggan000114@localhost.com', '000114000114', '002008000114', 'JL. Localhost No.000114', 'JL. Server No.000114', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (116, 1, 'CUST220609.000115', 'Pelanggan 000115', 'PIC000115', 'pelanggan000115@localhost.com', '000115000115', '002008000115', 'JL. Localhost No.000115', 'JL. Server No.000115', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (117, 1, 'CUST220609.000116', 'Pelanggan 000116', 'PIC000116', 'pelanggan000116@localhost.com', '000116000116', '002008000116', 'JL. Localhost No.000116', 'JL. Server No.000116', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (118, 1, 'CUST220609.000117', 'Pelanggan 000117', 'PIC000117', 'pelanggan000117@localhost.com', '000117000117', '002008000117', 'JL. Localhost No.000117', 'JL. Server No.000117', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (119, 1, 'CUST220609.000118', 'Pelanggan 000118', 'PIC000118', 'pelanggan000118@localhost.com', '000118000118', '002008000118', 'JL. Localhost No.000118', 'JL. Server No.000118', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (120, 1, 'CUST220609.000119', 'Pelanggan 000119', 'PIC000119', 'pelanggan000119@localhost.com', '000119000119', '002008000119', 'JL. Localhost No.000119', 'JL. Server No.000119', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (121, 1, 'CUST220609.000120', 'Pelanggan 000120', 'PIC000120', 'pelanggan000120@localhost.com', '000120000120', '002008000120', 'JL. Localhost No.000120', 'JL. Server No.000120', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (122, 1, 'CUST220609.000121', 'Pelanggan 000121', 'PIC000121', 'pelanggan000121@localhost.com', '000121000121', '002008000121', 'JL. Localhost No.000121', 'JL. Server No.000121', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (123, 1, 'CUST220609.000122', 'Pelanggan 000122', 'PIC000122', 'pelanggan000122@localhost.com', '000122000122', '002008000122', 'JL. Localhost No.000122', 'JL. Server No.000122', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (124, 1, 'CUST220609.000123', 'Pelanggan 000123', 'PIC000123', 'pelanggan000123@localhost.com', '000123000123', '002008000123', 'JL. Localhost No.000123', 'JL. Server No.000123', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (125, 1, 'CUST220609.000124', 'Pelanggan 000124', 'PIC000124', 'pelanggan000124@localhost.com', '000124000124', '002008000124', 'JL. Localhost No.000124', 'JL. Server No.000124', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (126, 1, 'CUST220609.000125', 'Pelanggan 000125', 'PIC000125', 'pelanggan000125@localhost.com', '000125000125', '002008000125', 'JL. Localhost No.000125', 'JL. Server No.000125', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (127, 1, 'CUST220609.000126', 'Pelanggan 000126', 'PIC000126', 'pelanggan000126@localhost.com', '000126000126', '002008000126', 'JL. Localhost No.000126', 'JL. Server No.000126', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (128, 1, 'CUST220609.000127', 'Pelanggan 000127', 'PIC000127', 'pelanggan000127@localhost.com', '000127000127', '002008000127', 'JL. Localhost No.000127', 'JL. Server No.000127', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (129, 1, 'CUST220609.000128', 'Pelanggan 000128', 'PIC000128', 'pelanggan000128@localhost.com', '000128000128', '002008000128', 'JL. Localhost No.000128', 'JL. Server No.000128', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (130, 1, 'CUST220609.000129', 'Pelanggan 000129', 'PIC000129', 'pelanggan000129@localhost.com', '000129000129', '002008000129', 'JL. Localhost No.000129', 'JL. Server No.000129', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (131, 1, 'CUST220609.000130', 'Pelanggan 000130', 'PIC000130', 'pelanggan000130@localhost.com', '000130000130', '002008000130', 'JL. Localhost No.000130', 'JL. Server No.000130', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (132, 1, 'CUST220609.000131', 'Pelanggan 000131', 'PIC000131', 'pelanggan000131@localhost.com', '000131000131', '002008000131', 'JL. Localhost No.000131', 'JL. Server No.000131', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (133, 1, 'CUST220609.000132', 'Pelanggan 000132', 'PIC000132', 'pelanggan000132@localhost.com', '000132000132', '002008000132', 'JL. Localhost No.000132', 'JL. Server No.000132', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (134, 1, 'CUST220609.000133', 'Pelanggan 000133', 'PIC000133', 'pelanggan000133@localhost.com', '000133000133', '002008000133', 'JL. Localhost No.000133', 'JL. Server No.000133', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (135, 1, 'CUST220609.000134', 'Pelanggan 000134', 'PIC000134', 'pelanggan000134@localhost.com', '000134000134', '002008000134', 'JL. Localhost No.000134', 'JL. Server No.000134', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (136, 1, 'CUST220609.000135', 'Pelanggan 000135', 'PIC000135', 'pelanggan000135@localhost.com', '000135000135', '002008000135', 'JL. Localhost No.000135', 'JL. Server No.000135', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (137, 1, 'CUST220609.000136', 'Pelanggan 000136', 'PIC000136', 'pelanggan000136@localhost.com', '000136000136', '002008000136', 'JL. Localhost No.000136', 'JL. Server No.000136', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (138, 1, 'CUST220609.000137', 'Pelanggan 000137', 'PIC000137', 'pelanggan000137@localhost.com', '000137000137', '002008000137', 'JL. Localhost No.000137', 'JL. Server No.000137', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (139, 1, 'CUST220609.000138', 'Pelanggan 000138', 'PIC000138', 'pelanggan000138@localhost.com', '000138000138', '002008000138', 'JL. Localhost No.000138', 'JL. Server No.000138', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (140, 1, 'CUST220609.000139', 'Pelanggan 000139', 'PIC000139', 'pelanggan000139@localhost.com', '000139000139', '002008000139', 'JL. Localhost No.000139', 'JL. Server No.000139', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (141, 1, 'CUST220609.000140', 'Pelanggan 000140', 'PIC000140', 'pelanggan000140@localhost.com', '000140000140', '002008000140', 'JL. Localhost No.000140', 'JL. Server No.000140', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (142, 1, 'CUST220609.000141', 'Pelanggan 000141', 'PIC000141', 'pelanggan000141@localhost.com', '000141000141', '002008000141', 'JL. Localhost No.000141', 'JL. Server No.000141', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (143, 1, 'CUST220609.000142', 'Pelanggan 000142', 'PIC000142', 'pelanggan000142@localhost.com', '000142000142', '002008000142', 'JL. Localhost No.000142', 'JL. Server No.000142', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (144, 1, 'CUST220609.000143', 'Pelanggan 000143', 'PIC000143', 'pelanggan000143@localhost.com', '000143000143', '002008000143', 'JL. Localhost No.000143', 'JL. Server No.000143', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (145, 1, 'CUST220609.000144', 'Pelanggan 000144', 'PIC000144', 'pelanggan000144@localhost.com', '000144000144', '002008000144', 'JL. Localhost No.000144', 'JL. Server No.000144', 100000000.00, 'Y', '2022-06-11 10:35:33', '2022-06-11 10:35:33');
INSERT INTO `mas_pelanggans` VALUES (146, 1, 'CUST220609.000145', 'Pelanggan 000145', 'PIC000145', 'pelanggan000145@localhost.com', '000145000145', '002008000145', 'JL. Localhost No.000145', 'JL. Server No.000145', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (147, 1, 'CUST220609.000146', 'Pelanggan 000146', 'PIC000146', 'pelanggan000146@localhost.com', '000146000146', '002008000146', 'JL. Localhost No.000146', 'JL. Server No.000146', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (148, 1, 'CUST220609.000147', 'Pelanggan 000147', 'PIC000147', 'pelanggan000147@localhost.com', '000147000147', '002008000147', 'JL. Localhost No.000147', 'JL. Server No.000147', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (149, 1, 'CUST220609.000148', 'Pelanggan 000148', 'PIC000148', 'pelanggan000148@localhost.com', '000148000148', '002008000148', 'JL. Localhost No.000148', 'JL. Server No.000148', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (150, 1, 'CUST220609.000149', 'Pelanggan 000149', 'PIC000149', 'pelanggan000149@localhost.com', '000149000149', '002008000149', 'JL. Localhost No.000149', 'JL. Server No.000149', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (151, 1, 'CUST220609.000150', 'Pelanggan 000150', 'PIC000150', 'pelanggan000150@localhost.com', '000150000150', '002008000150', 'JL. Localhost No.000150', 'JL. Server No.000150', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (152, 1, 'CUST220609.000151', 'Pelanggan 000151', 'PIC000151', 'pelanggan000151@localhost.com', '000151000151', '002008000151', 'JL. Localhost No.000151', 'JL. Server No.000151', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (153, 1, 'CUST220609.000152', 'Pelanggan 000152', 'PIC000152', 'pelanggan000152@localhost.com', '000152000152', '002008000152', 'JL. Localhost No.000152', 'JL. Server No.000152', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (154, 1, 'CUST220609.000153', 'Pelanggan 000153', 'PIC000153', 'pelanggan000153@localhost.com', '000153000153', '002008000153', 'JL. Localhost No.000153', 'JL. Server No.000153', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (155, 1, 'CUST220609.000154', 'Pelanggan 000154', 'PIC000154', 'pelanggan000154@localhost.com', '000154000154', '002008000154', 'JL. Localhost No.000154', 'JL. Server No.000154', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (156, 1, 'CUST220609.000155', 'Pelanggan 000155', 'PIC000155', 'pelanggan000155@localhost.com', '000155000155', '002008000155', 'JL. Localhost No.000155', 'JL. Server No.000155', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (157, 1, 'CUST220609.000156', 'Pelanggan 000156', 'PIC000156', 'pelanggan000156@localhost.com', '000156000156', '002008000156', 'JL. Localhost No.000156', 'JL. Server No.000156', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (158, 1, 'CUST220609.000157', 'Pelanggan 000157', 'PIC000157', 'pelanggan000157@localhost.com', '000157000157', '002008000157', 'JL. Localhost No.000157', 'JL. Server No.000157', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (159, 1, 'CUST220609.000158', 'Pelanggan 000158', 'PIC000158', 'pelanggan000158@localhost.com', '000158000158', '002008000158', 'JL. Localhost No.000158', 'JL. Server No.000158', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (160, 1, 'CUST220609.000159', 'Pelanggan 000159', 'PIC000159', 'pelanggan000159@localhost.com', '000159000159', '002008000159', 'JL. Localhost No.000159', 'JL. Server No.000159', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (161, 1, 'CUST220609.000160', 'Pelanggan 000160', 'PIC000160', 'pelanggan000160@localhost.com', '000160000160', '002008000160', 'JL. Localhost No.000160', 'JL. Server No.000160', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (162, 1, 'CUST220609.000161', 'Pelanggan 000161', 'PIC000161', 'pelanggan000161@localhost.com', '000161000161', '002008000161', 'JL. Localhost No.000161', 'JL. Server No.000161', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (163, 1, 'CUST220609.000162', 'Pelanggan 000162', 'PIC000162', 'pelanggan000162@localhost.com', '000162000162', '002008000162', 'JL. Localhost No.000162', 'JL. Server No.000162', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (164, 1, 'CUST220609.000163', 'Pelanggan 000163', 'PIC000163', 'pelanggan000163@localhost.com', '000163000163', '002008000163', 'JL. Localhost No.000163', 'JL. Server No.000163', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (165, 1, 'CUST220609.000164', 'Pelanggan 000164', 'PIC000164', 'pelanggan000164@localhost.com', '000164000164', '002008000164', 'JL. Localhost No.000164', 'JL. Server No.000164', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (166, 1, 'CUST220609.000165', 'Pelanggan 000165', 'PIC000165', 'pelanggan000165@localhost.com', '000165000165', '002008000165', 'JL. Localhost No.000165', 'JL. Server No.000165', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (167, 1, 'CUST220609.000166', 'Pelanggan 000166', 'PIC000166', 'pelanggan000166@localhost.com', '000166000166', '002008000166', 'JL. Localhost No.000166', 'JL. Server No.000166', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (168, 1, 'CUST220609.000167', 'Pelanggan 000167', 'PIC000167', 'pelanggan000167@localhost.com', '000167000167', '002008000167', 'JL. Localhost No.000167', 'JL. Server No.000167', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (169, 1, 'CUST220609.000168', 'Pelanggan 000168', 'PIC000168', 'pelanggan000168@localhost.com', '000168000168', '002008000168', 'JL. Localhost No.000168', 'JL. Server No.000168', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (170, 1, 'CUST220609.000169', 'Pelanggan 000169', 'PIC000169', 'pelanggan000169@localhost.com', '000169000169', '002008000169', 'JL. Localhost No.000169', 'JL. Server No.000169', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (171, 1, 'CUST220609.000170', 'Pelanggan 000170', 'PIC000170', 'pelanggan000170@localhost.com', '000170000170', '002008000170', 'JL. Localhost No.000170', 'JL. Server No.000170', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (172, 1, 'CUST220609.000171', 'Pelanggan 000171', 'PIC000171', 'pelanggan000171@localhost.com', '000171000171', '002008000171', 'JL. Localhost No.000171', 'JL. Server No.000171', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (173, 1, 'CUST220609.000172', 'Pelanggan 000172', 'PIC000172', 'pelanggan000172@localhost.com', '000172000172', '002008000172', 'JL. Localhost No.000172', 'JL. Server No.000172', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (174, 1, 'CUST220609.000173', 'Pelanggan 000173', 'PIC000173', 'pelanggan000173@localhost.com', '000173000173', '002008000173', 'JL. Localhost No.000173', 'JL. Server No.000173', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (175, 1, 'CUST220609.000174', 'Pelanggan 000174', 'PIC000174', 'pelanggan000174@localhost.com', '000174000174', '002008000174', 'JL. Localhost No.000174', 'JL. Server No.000174', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (176, 1, 'CUST220609.000175', 'Pelanggan 000175', 'PIC000175', 'pelanggan000175@localhost.com', '000175000175', '002008000175', 'JL. Localhost No.000175', 'JL. Server No.000175', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (177, 1, 'CUST220609.000176', 'Pelanggan 000176', 'PIC000176', 'pelanggan000176@localhost.com', '000176000176', '002008000176', 'JL. Localhost No.000176', 'JL. Server No.000176', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (178, 1, 'CUST220609.000177', 'Pelanggan 000177', 'PIC000177', 'pelanggan000177@localhost.com', '000177000177', '002008000177', 'JL. Localhost No.000177', 'JL. Server No.000177', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (179, 1, 'CUST220609.000178', 'Pelanggan 000178', 'PIC000178', 'pelanggan000178@localhost.com', '000178000178', '002008000178', 'JL. Localhost No.000178', 'JL. Server No.000178', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (180, 1, 'CUST220609.000179', 'Pelanggan 000179', 'PIC000179', 'pelanggan000179@localhost.com', '000179000179', '002008000179', 'JL. Localhost No.000179', 'JL. Server No.000179', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (181, 1, 'CUST220609.000180', 'Pelanggan 000180', 'PIC000180', 'pelanggan000180@localhost.com', '000180000180', '002008000180', 'JL. Localhost No.000180', 'JL. Server No.000180', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (182, 1, 'CUST220609.000181', 'Pelanggan 000181', 'PIC000181', 'pelanggan000181@localhost.com', '000181000181', '002008000181', 'JL. Localhost No.000181', 'JL. Server No.000181', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (183, 1, 'CUST220609.000182', 'Pelanggan 000182', 'PIC000182', 'pelanggan000182@localhost.com', '000182000182', '002008000182', 'JL. Localhost No.000182', 'JL. Server No.000182', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (184, 1, 'CUST220609.000183', 'Pelanggan 000183', 'PIC000183', 'pelanggan000183@localhost.com', '000183000183', '002008000183', 'JL. Localhost No.000183', 'JL. Server No.000183', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (185, 1, 'CUST220609.000184', 'Pelanggan 000184', 'PIC000184', 'pelanggan000184@localhost.com', '000184000184', '002008000184', 'JL. Localhost No.000184', 'JL. Server No.000184', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (186, 1, 'CUST220609.000185', 'Pelanggan 000185', 'PIC000185', 'pelanggan000185@localhost.com', '000185000185', '002008000185', 'JL. Localhost No.000185', 'JL. Server No.000185', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (187, 1, 'CUST220609.000186', 'Pelanggan 000186', 'PIC000186', 'pelanggan000186@localhost.com', '000186000186', '002008000186', 'JL. Localhost No.000186', 'JL. Server No.000186', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (188, 1, 'CUST220609.000187', 'Pelanggan 000187', 'PIC000187', 'pelanggan000187@localhost.com', '000187000187', '002008000187', 'JL. Localhost No.000187', 'JL. Server No.000187', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (189, 1, 'CUST220609.000188', 'Pelanggan 000188', 'PIC000188', 'pelanggan000188@localhost.com', '000188000188', '002008000188', 'JL. Localhost No.000188', 'JL. Server No.000188', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (190, 1, 'CUST220609.000189', 'Pelanggan 000189', 'PIC000189', 'pelanggan000189@localhost.com', '000189000189', '002008000189', 'JL. Localhost No.000189', 'JL. Server No.000189', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (191, 1, 'CUST220609.000190', 'Pelanggan 000190', 'PIC000190', 'pelanggan000190@localhost.com', '000190000190', '002008000190', 'JL. Localhost No.000190', 'JL. Server No.000190', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (192, 1, 'CUST220609.000191', 'Pelanggan 000191', 'PIC000191', 'pelanggan000191@localhost.com', '000191000191', '002008000191', 'JL. Localhost No.000191', 'JL. Server No.000191', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (193, 1, 'CUST220609.000192', 'Pelanggan 000192', 'PIC000192', 'pelanggan000192@localhost.com', '000192000192', '002008000192', 'JL. Localhost No.000192', 'JL. Server No.000192', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (194, 1, 'CUST220609.000193', 'Pelanggan 000193', 'PIC000193', 'pelanggan000193@localhost.com', '000193000193', '002008000193', 'JL. Localhost No.000193', 'JL. Server No.000193', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (195, 1, 'CUST220609.000194', 'Pelanggan 000194', 'PIC000194', 'pelanggan000194@localhost.com', '000194000194', '002008000194', 'JL. Localhost No.000194', 'JL. Server No.000194', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (196, 1, 'CUST220609.000195', 'Pelanggan 000195', 'PIC000195', 'pelanggan000195@localhost.com', '000195000195', '002008000195', 'JL. Localhost No.000195', 'JL. Server No.000195', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (197, 1, 'CUST220609.000196', 'Pelanggan 000196', 'PIC000196', 'pelanggan000196@localhost.com', '000196000196', '002008000196', 'JL. Localhost No.000196', 'JL. Server No.000196', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (198, 1, 'CUST220609.000197', 'Pelanggan 000197', 'PIC000197', 'pelanggan000197@localhost.com', '000197000197', '002008000197', 'JL. Localhost No.000197', 'JL. Server No.000197', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (199, 1, 'CUST220609.000198', 'Pelanggan 000198', 'PIC000198', 'pelanggan000198@localhost.com', '000198000198', '002008000198', 'JL. Localhost No.000198', 'JL. Server No.000198', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (200, 1, 'CUST220609.000199', 'Pelanggan 000199', 'PIC000199', 'pelanggan000199@localhost.com', '000199000199', '002008000199', 'JL. Localhost No.000199', 'JL. Server No.000199', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (201, 1, 'CUST220609.000200', 'Pelanggan 000200', 'PIC000200', 'pelanggan000200@localhost.com', '000200000200', '002008000200', 'JL. Localhost No.000200', 'JL. Server No.000200', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (202, 1, 'CUST220609.000201', 'Pelanggan 000201', 'PIC000201', 'pelanggan000201@localhost.com', '000201000201', '002008000201', 'JL. Localhost No.000201', 'JL. Server No.000201', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (203, 1, 'CUST220609.000202', 'Pelanggan 000202', 'PIC000202', 'pelanggan000202@localhost.com', '000202000202', '002008000202', 'JL. Localhost No.000202', 'JL. Server No.000202', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (204, 1, 'CUST220609.000203', 'Pelanggan 000203', 'PIC000203', 'pelanggan000203@localhost.com', '000203000203', '002008000203', 'JL. Localhost No.000203', 'JL. Server No.000203', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (205, 1, 'CUST220609.000204', 'Pelanggan 000204', 'PIC000204', 'pelanggan000204@localhost.com', '000204000204', '002008000204', 'JL. Localhost No.000204', 'JL. Server No.000204', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (206, 1, 'CUST220609.000205', 'Pelanggan 000205', 'PIC000205', 'pelanggan000205@localhost.com', '000205000205', '002008000205', 'JL. Localhost No.000205', 'JL. Server No.000205', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (207, 1, 'CUST220609.000206', 'Pelanggan 000206', 'PIC000206', 'pelanggan000206@localhost.com', '000206000206', '002008000206', 'JL. Localhost No.000206', 'JL. Server No.000206', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (208, 1, 'CUST220609.000207', 'Pelanggan 000207', 'PIC000207', 'pelanggan000207@localhost.com', '000207000207', '002008000207', 'JL. Localhost No.000207', 'JL. Server No.000207', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (209, 1, 'CUST220609.000208', 'Pelanggan 000208', 'PIC000208', 'pelanggan000208@localhost.com', '000208000208', '002008000208', 'JL. Localhost No.000208', 'JL. Server No.000208', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (210, 1, 'CUST220609.000209', 'Pelanggan 000209', 'PIC000209', 'pelanggan000209@localhost.com', '000209000209', '002008000209', 'JL. Localhost No.000209', 'JL. Server No.000209', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (211, 1, 'CUST220609.000210', 'Pelanggan 000210', 'PIC000210', 'pelanggan000210@localhost.com', '000210000210', '002008000210', 'JL. Localhost No.000210', 'JL. Server No.000210', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (212, 1, 'CUST220609.000211', 'Pelanggan 000211', 'PIC000211', 'pelanggan000211@localhost.com', '000211000211', '002008000211', 'JL. Localhost No.000211', 'JL. Server No.000211', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (213, 1, 'CUST220609.000212', 'Pelanggan 000212', 'PIC000212', 'pelanggan000212@localhost.com', '000212000212', '002008000212', 'JL. Localhost No.000212', 'JL. Server No.000212', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (214, 1, 'CUST220609.000213', 'Pelanggan 000213', 'PIC000213', 'pelanggan000213@localhost.com', '000213000213', '002008000213', 'JL. Localhost No.000213', 'JL. Server No.000213', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (215, 1, 'CUST220609.000214', 'Pelanggan 000214', 'PIC000214', 'pelanggan000214@localhost.com', '000214000214', '002008000214', 'JL. Localhost No.000214', 'JL. Server No.000214', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (216, 1, 'CUST220609.000215', 'Pelanggan 000215', 'PIC000215', 'pelanggan000215@localhost.com', '000215000215', '002008000215', 'JL. Localhost No.000215', 'JL. Server No.000215', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (217, 1, 'CUST220609.000216', 'Pelanggan 000216', 'PIC000216', 'pelanggan000216@localhost.com', '000216000216', '002008000216', 'JL. Localhost No.000216', 'JL. Server No.000216', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (218, 1, 'CUST220609.000217', 'Pelanggan 000217', 'PIC000217', 'pelanggan000217@localhost.com', '000217000217', '002008000217', 'JL. Localhost No.000217', 'JL. Server No.000217', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (219, 1, 'CUST220609.000218', 'Pelanggan 000218', 'PIC000218', 'pelanggan000218@localhost.com', '000218000218', '002008000218', 'JL. Localhost No.000218', 'JL. Server No.000218', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (220, 1, 'CUST220609.000219', 'Pelanggan 000219', 'PIC000219', 'pelanggan000219@localhost.com', '000219000219', '002008000219', 'JL. Localhost No.000219', 'JL. Server No.000219', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (221, 1, 'CUST220609.000220', 'Pelanggan 000220', 'PIC000220', 'pelanggan000220@localhost.com', '000220000220', '002008000220', 'JL. Localhost No.000220', 'JL. Server No.000220', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (222, 1, 'CUST220609.000221', 'Pelanggan 000221', 'PIC000221', 'pelanggan000221@localhost.com', '000221000221', '002008000221', 'JL. Localhost No.000221', 'JL. Server No.000221', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (223, 1, 'CUST220609.000222', 'Pelanggan 000222', 'PIC000222', 'pelanggan000222@localhost.com', '000222000222', '002008000222', 'JL. Localhost No.000222', 'JL. Server No.000222', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (224, 1, 'CUST220609.000223', 'Pelanggan 000223', 'PIC000223', 'pelanggan000223@localhost.com', '000223000223', '002008000223', 'JL. Localhost No.000223', 'JL. Server No.000223', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (225, 1, 'CUST220609.000224', 'Pelanggan 000224', 'PIC000224', 'pelanggan000224@localhost.com', '000224000224', '002008000224', 'JL. Localhost No.000224', 'JL. Server No.000224', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (226, 1, 'CUST220609.000225', 'Pelanggan 000225', 'PIC000225', 'pelanggan000225@localhost.com', '000225000225', '002008000225', 'JL. Localhost No.000225', 'JL. Server No.000225', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (227, 1, 'CUST220609.000226', 'Pelanggan 000226', 'PIC000226', 'pelanggan000226@localhost.com', '000226000226', '002008000226', 'JL. Localhost No.000226', 'JL. Server No.000226', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (228, 1, 'CUST220609.000227', 'Pelanggan 000227', 'PIC000227', 'pelanggan000227@localhost.com', '000227000227', '002008000227', 'JL. Localhost No.000227', 'JL. Server No.000227', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (229, 1, 'CUST220609.000228', 'Pelanggan 000228', 'PIC000228', 'pelanggan000228@localhost.com', '000228000228', '002008000228', 'JL. Localhost No.000228', 'JL. Server No.000228', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (230, 1, 'CUST220609.000229', 'Pelanggan 000229', 'PIC000229', 'pelanggan000229@localhost.com', '000229000229', '002008000229', 'JL. Localhost No.000229', 'JL. Server No.000229', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (231, 1, 'CUST220609.000230', 'Pelanggan 000230', 'PIC000230', 'pelanggan000230@localhost.com', '000230000230', '002008000230', 'JL. Localhost No.000230', 'JL. Server No.000230', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (232, 1, 'CUST220609.000231', 'Pelanggan 000231', 'PIC000231', 'pelanggan000231@localhost.com', '000231000231', '002008000231', 'JL. Localhost No.000231', 'JL. Server No.000231', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (233, 1, 'CUST220609.000232', 'Pelanggan 000232', 'PIC000232', 'pelanggan000232@localhost.com', '000232000232', '002008000232', 'JL. Localhost No.000232', 'JL. Server No.000232', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (234, 1, 'CUST220609.000233', 'Pelanggan 000233', 'PIC000233', 'pelanggan000233@localhost.com', '000233000233', '002008000233', 'JL. Localhost No.000233', 'JL. Server No.000233', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (235, 1, 'CUST220609.000234', 'Pelanggan 000234', 'PIC000234', 'pelanggan000234@localhost.com', '000234000234', '002008000234', 'JL. Localhost No.000234', 'JL. Server No.000234', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (236, 1, 'CUST220609.000235', 'Pelanggan 000235', 'PIC000235', 'pelanggan000235@localhost.com', '000235000235', '002008000235', 'JL. Localhost No.000235', 'JL. Server No.000235', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (237, 1, 'CUST220609.000236', 'Pelanggan 000236', 'PIC000236', 'pelanggan000236@localhost.com', '000236000236', '002008000236', 'JL. Localhost No.000236', 'JL. Server No.000236', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (238, 1, 'CUST220609.000237', 'Pelanggan 000237', 'PIC000237', 'pelanggan000237@localhost.com', '000237000237', '002008000237', 'JL. Localhost No.000237', 'JL. Server No.000237', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (239, 1, 'CUST220609.000238', 'Pelanggan 000238', 'PIC000238', 'pelanggan000238@localhost.com', '000238000238', '002008000238', 'JL. Localhost No.000238', 'JL. Server No.000238', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (240, 1, 'CUST220609.000239', 'Pelanggan 000239', 'PIC000239', 'pelanggan000239@localhost.com', '000239000239', '002008000239', 'JL. Localhost No.000239', 'JL. Server No.000239', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (241, 1, 'CUST220609.000240', 'Pelanggan 000240', 'PIC000240', 'pelanggan000240@localhost.com', '000240000240', '002008000240', 'JL. Localhost No.000240', 'JL. Server No.000240', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (242, 1, 'CUST220609.000241', 'Pelanggan 000241', 'PIC000241', 'pelanggan000241@localhost.com', '000241000241', '002008000241', 'JL. Localhost No.000241', 'JL. Server No.000241', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (243, 1, 'CUST220609.000242', 'Pelanggan 000242', 'PIC000242', 'pelanggan000242@localhost.com', '000242000242', '002008000242', 'JL. Localhost No.000242', 'JL. Server No.000242', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (244, 1, 'CUST220609.000243', 'Pelanggan 000243', 'PIC000243', 'pelanggan000243@localhost.com', '000243000243', '002008000243', 'JL. Localhost No.000243', 'JL. Server No.000243', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (245, 1, 'CUST220609.000244', 'Pelanggan 000244', 'PIC000244', 'pelanggan000244@localhost.com', '000244000244', '002008000244', 'JL. Localhost No.000244', 'JL. Server No.000244', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (246, 1, 'CUST220609.000245', 'Pelanggan 000245', 'PIC000245', 'pelanggan000245@localhost.com', '000245000245', '002008000245', 'JL. Localhost No.000245', 'JL. Server No.000245', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (247, 1, 'CUST220609.000246', 'Pelanggan 000246', 'PIC000246', 'pelanggan000246@localhost.com', '000246000246', '002008000246', 'JL. Localhost No.000246', 'JL. Server No.000246', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (248, 1, 'CUST220609.000247', 'Pelanggan 000247', 'PIC000247', 'pelanggan000247@localhost.com', '000247000247', '002008000247', 'JL. Localhost No.000247', 'JL. Server No.000247', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (249, 1, 'CUST220609.000248', 'Pelanggan 000248', 'PIC000248', 'pelanggan000248@localhost.com', '000248000248', '002008000248', 'JL. Localhost No.000248', 'JL. Server No.000248', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (250, 1, 'CUST220609.000249', 'Pelanggan 000249', 'PIC000249', 'pelanggan000249@localhost.com', '000249000249', '002008000249', 'JL. Localhost No.000249', 'JL. Server No.000249', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (251, 1, 'CUST220609.000250', 'Pelanggan 000250', 'PIC000250', 'pelanggan000250@localhost.com', '000250000250', '002008000250', 'JL. Localhost No.000250', 'JL. Server No.000250', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (252, 1, 'CUST220609.000251', 'Pelanggan 000251', 'PIC000251', 'pelanggan000251@localhost.com', '000251000251', '002008000251', 'JL. Localhost No.000251', 'JL. Server No.000251', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (253, 1, 'CUST220609.000252', 'Pelanggan 000252', 'PIC000252', 'pelanggan000252@localhost.com', '000252000252', '002008000252', 'JL. Localhost No.000252', 'JL. Server No.000252', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (254, 1, 'CUST220609.000253', 'Pelanggan 000253', 'PIC000253', 'pelanggan000253@localhost.com', '000253000253', '002008000253', 'JL. Localhost No.000253', 'JL. Server No.000253', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (255, 1, 'CUST220609.000254', 'Pelanggan 000254', 'PIC000254', 'pelanggan000254@localhost.com', '000254000254', '002008000254', 'JL. Localhost No.000254', 'JL. Server No.000254', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (256, 1, 'CUST220609.000255', 'Pelanggan 000255', 'PIC000255', 'pelanggan000255@localhost.com', '000255000255', '002008000255', 'JL. Localhost No.000255', 'JL. Server No.000255', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (257, 1, 'CUST220609.000256', 'Pelanggan 000256', 'PIC000256', 'pelanggan000256@localhost.com', '000256000256', '002008000256', 'JL. Localhost No.000256', 'JL. Server No.000256', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (258, 1, 'CUST220609.000257', 'Pelanggan 000257', 'PIC000257', 'pelanggan000257@localhost.com', '000257000257', '002008000257', 'JL. Localhost No.000257', 'JL. Server No.000257', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (259, 1, 'CUST220609.000258', 'Pelanggan 000258', 'PIC000258', 'pelanggan000258@localhost.com', '000258000258', '002008000258', 'JL. Localhost No.000258', 'JL. Server No.000258', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (260, 1, 'CUST220609.000259', 'Pelanggan 000259', 'PIC000259', 'pelanggan000259@localhost.com', '000259000259', '002008000259', 'JL. Localhost No.000259', 'JL. Server No.000259', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (261, 1, 'CUST220609.000260', 'Pelanggan 000260', 'PIC000260', 'pelanggan000260@localhost.com', '000260000260', '002008000260', 'JL. Localhost No.000260', 'JL. Server No.000260', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (262, 1, 'CUST220609.000261', 'Pelanggan 000261', 'PIC000261', 'pelanggan000261@localhost.com', '000261000261', '002008000261', 'JL. Localhost No.000261', 'JL. Server No.000261', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (263, 1, 'CUST220609.000262', 'Pelanggan 000262', 'PIC000262', 'pelanggan000262@localhost.com', '000262000262', '002008000262', 'JL. Localhost No.000262', 'JL. Server No.000262', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (264, 1, 'CUST220609.000263', 'Pelanggan 000263', 'PIC000263', 'pelanggan000263@localhost.com', '000263000263', '002008000263', 'JL. Localhost No.000263', 'JL. Server No.000263', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (265, 1, 'CUST220609.000264', 'Pelanggan 000264', 'PIC000264', 'pelanggan000264@localhost.com', '000264000264', '002008000264', 'JL. Localhost No.000264', 'JL. Server No.000264', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (266, 1, 'CUST220609.000265', 'Pelanggan 000265', 'PIC000265', 'pelanggan000265@localhost.com', '000265000265', '002008000265', 'JL. Localhost No.000265', 'JL. Server No.000265', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (267, 1, 'CUST220609.000266', 'Pelanggan 000266', 'PIC000266', 'pelanggan000266@localhost.com', '000266000266', '002008000266', 'JL. Localhost No.000266', 'JL. Server No.000266', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (268, 1, 'CUST220609.000267', 'Pelanggan 000267', 'PIC000267', 'pelanggan000267@localhost.com', '000267000267', '002008000267', 'JL. Localhost No.000267', 'JL. Server No.000267', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (269, 1, 'CUST220609.000268', 'Pelanggan 000268', 'PIC000268', 'pelanggan000268@localhost.com', '000268000268', '002008000268', 'JL. Localhost No.000268', 'JL. Server No.000268', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (270, 1, 'CUST220609.000269', 'Pelanggan 000269', 'PIC000269', 'pelanggan000269@localhost.com', '000269000269', '002008000269', 'JL. Localhost No.000269', 'JL. Server No.000269', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (271, 1, 'CUST220609.000270', 'Pelanggan 000270', 'PIC000270', 'pelanggan000270@localhost.com', '000270000270', '002008000270', 'JL. Localhost No.000270', 'JL. Server No.000270', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (272, 1, 'CUST220609.000271', 'Pelanggan 000271', 'PIC000271', 'pelanggan000271@localhost.com', '000271000271', '002008000271', 'JL. Localhost No.000271', 'JL. Server No.000271', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (273, 1, 'CUST220609.000272', 'Pelanggan 000272', 'PIC000272', 'pelanggan000272@localhost.com', '000272000272', '002008000272', 'JL. Localhost No.000272', 'JL. Server No.000272', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (274, 1, 'CUST220609.000273', 'Pelanggan 000273', 'PIC000273', 'pelanggan000273@localhost.com', '000273000273', '002008000273', 'JL. Localhost No.000273', 'JL. Server No.000273', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (275, 1, 'CUST220609.000274', 'Pelanggan 000274', 'PIC000274', 'pelanggan000274@localhost.com', '000274000274', '002008000274', 'JL. Localhost No.000274', 'JL. Server No.000274', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (276, 1, 'CUST220609.000275', 'Pelanggan 000275', 'PIC000275', 'pelanggan000275@localhost.com', '000275000275', '002008000275', 'JL. Localhost No.000275', 'JL. Server No.000275', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (277, 1, 'CUST220609.000276', 'Pelanggan 000276', 'PIC000276', 'pelanggan000276@localhost.com', '000276000276', '002008000276', 'JL. Localhost No.000276', 'JL. Server No.000276', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (278, 1, 'CUST220609.000277', 'Pelanggan 000277', 'PIC000277', 'pelanggan000277@localhost.com', '000277000277', '002008000277', 'JL. Localhost No.000277', 'JL. Server No.000277', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (279, 1, 'CUST220609.000278', 'Pelanggan 000278', 'PIC000278', 'pelanggan000278@localhost.com', '000278000278', '002008000278', 'JL. Localhost No.000278', 'JL. Server No.000278', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (280, 1, 'CUST220609.000279', 'Pelanggan 000279', 'PIC000279', 'pelanggan000279@localhost.com', '000279000279', '002008000279', 'JL. Localhost No.000279', 'JL. Server No.000279', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (281, 1, 'CUST220609.000280', 'Pelanggan 000280', 'PIC000280', 'pelanggan000280@localhost.com', '000280000280', '002008000280', 'JL. Localhost No.000280', 'JL. Server No.000280', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (282, 1, 'CUST220609.000281', 'Pelanggan 000281', 'PIC000281', 'pelanggan000281@localhost.com', '000281000281', '002008000281', 'JL. Localhost No.000281', 'JL. Server No.000281', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (283, 1, 'CUST220609.000282', 'Pelanggan 000282', 'PIC000282', 'pelanggan000282@localhost.com', '000282000282', '002008000282', 'JL. Localhost No.000282', 'JL. Server No.000282', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (284, 1, 'CUST220609.000283', 'Pelanggan 000283', 'PIC000283', 'pelanggan000283@localhost.com', '000283000283', '002008000283', 'JL. Localhost No.000283', 'JL. Server No.000283', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (285, 1, 'CUST220609.000284', 'Pelanggan 000284', 'PIC000284', 'pelanggan000284@localhost.com', '000284000284', '002008000284', 'JL. Localhost No.000284', 'JL. Server No.000284', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (286, 1, 'CUST220609.000285', 'Pelanggan 000285', 'PIC000285', 'pelanggan000285@localhost.com', '000285000285', '002008000285', 'JL. Localhost No.000285', 'JL. Server No.000285', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (287, 1, 'CUST220609.000286', 'Pelanggan 000286', 'PIC000286', 'pelanggan000286@localhost.com', '000286000286', '002008000286', 'JL. Localhost No.000286', 'JL. Server No.000286', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (288, 1, 'CUST220609.000287', 'Pelanggan 000287', 'PIC000287', 'pelanggan000287@localhost.com', '000287000287', '002008000287', 'JL. Localhost No.000287', 'JL. Server No.000287', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (289, 1, 'CUST220609.000288', 'Pelanggan 000288', 'PIC000288', 'pelanggan000288@localhost.com', '000288000288', '002008000288', 'JL. Localhost No.000288', 'JL. Server No.000288', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (290, 1, 'CUST220609.000289', 'Pelanggan 000289', 'PIC000289', 'pelanggan000289@localhost.com', '000289000289', '002008000289', 'JL. Localhost No.000289', 'JL. Server No.000289', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (291, 1, 'CUST220609.000290', 'Pelanggan 000290', 'PIC000290', 'pelanggan000290@localhost.com', '000290000290', '002008000290', 'JL. Localhost No.000290', 'JL. Server No.000290', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (292, 1, 'CUST220609.000291', 'Pelanggan 000291', 'PIC000291', 'pelanggan000291@localhost.com', '000291000291', '002008000291', 'JL. Localhost No.000291', 'JL. Server No.000291', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (293, 1, 'CUST220609.000292', 'Pelanggan 000292', 'PIC000292', 'pelanggan000292@localhost.com', '000292000292', '002008000292', 'JL. Localhost No.000292', 'JL. Server No.000292', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (294, 1, 'CUST220609.000293', 'Pelanggan 000293', 'PIC000293', 'pelanggan000293@localhost.com', '000293000293', '002008000293', 'JL. Localhost No.000293', 'JL. Server No.000293', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (295, 1, 'CUST220609.000294', 'Pelanggan 000294', 'PIC000294', 'pelanggan000294@localhost.com', '000294000294', '002008000294', 'JL. Localhost No.000294', 'JL. Server No.000294', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (296, 1, 'CUST220609.000295', 'Pelanggan 000295', 'PIC000295', 'pelanggan000295@localhost.com', '000295000295', '002008000295', 'JL. Localhost No.000295', 'JL. Server No.000295', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (297, 1, 'CUST220609.000296', 'Pelanggan 000296', 'PIC000296', 'pelanggan000296@localhost.com', '000296000296', '002008000296', 'JL. Localhost No.000296', 'JL. Server No.000296', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (298, 1, 'CUST220609.000297', 'Pelanggan 000297', 'PIC000297', 'pelanggan000297@localhost.com', '000297000297', '002008000297', 'JL. Localhost No.000297', 'JL. Server No.000297', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (299, 1, 'CUST220609.000298', 'Pelanggan 000298', 'PIC000298', 'pelanggan000298@localhost.com', '000298000298', '002008000298', 'JL. Localhost No.000298', 'JL. Server No.000298', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (300, 1, 'CUST220609.000299', 'Pelanggan 000299', 'PIC000299', 'pelanggan000299@localhost.com', '000299000299', '002008000299', 'JL. Localhost No.000299', 'JL. Server No.000299', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (301, 1, 'CUST220609.000300', 'Pelanggan 000300', 'PIC000300', 'pelanggan000300@localhost.com', '000300000300', '002008000300', 'JL. Localhost No.000300', 'JL. Server No.000300', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (302, 1, 'CUST220609.000301', 'Pelanggan 000301', 'PIC000301', 'pelanggan000301@localhost.com', '000301000301', '002008000301', 'JL. Localhost No.000301', 'JL. Server No.000301', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (303, 1, 'CUST220609.000302', 'Pelanggan 000302', 'PIC000302', 'pelanggan000302@localhost.com', '000302000302', '002008000302', 'JL. Localhost No.000302', 'JL. Server No.000302', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (304, 1, 'CUST220609.000303', 'Pelanggan 000303', 'PIC000303', 'pelanggan000303@localhost.com', '000303000303', '002008000303', 'JL. Localhost No.000303', 'JL. Server No.000303', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (305, 1, 'CUST220609.000304', 'Pelanggan 000304', 'PIC000304', 'pelanggan000304@localhost.com', '000304000304', '002008000304', 'JL. Localhost No.000304', 'JL. Server No.000304', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (306, 1, 'CUST220609.000305', 'Pelanggan 000305', 'PIC000305', 'pelanggan000305@localhost.com', '000305000305', '002008000305', 'JL. Localhost No.000305', 'JL. Server No.000305', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (307, 1, 'CUST220609.000306', 'Pelanggan 000306', 'PIC000306', 'pelanggan000306@localhost.com', '000306000306', '002008000306', 'JL. Localhost No.000306', 'JL. Server No.000306', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (308, 1, 'CUST220609.000307', 'Pelanggan 000307', 'PIC000307', 'pelanggan000307@localhost.com', '000307000307', '002008000307', 'JL. Localhost No.000307', 'JL. Server No.000307', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (309, 1, 'CUST220609.000308', 'Pelanggan 000308', 'PIC000308', 'pelanggan000308@localhost.com', '000308000308', '002008000308', 'JL. Localhost No.000308', 'JL. Server No.000308', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (310, 1, 'CUST220609.000309', 'Pelanggan 000309', 'PIC000309', 'pelanggan000309@localhost.com', '000309000309', '002008000309', 'JL. Localhost No.000309', 'JL. Server No.000309', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (311, 1, 'CUST220609.000310', 'Pelanggan 000310', 'PIC000310', 'pelanggan000310@localhost.com', '000310000310', '002008000310', 'JL. Localhost No.000310', 'JL. Server No.000310', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (312, 1, 'CUST220609.000311', 'Pelanggan 000311', 'PIC000311', 'pelanggan000311@localhost.com', '000311000311', '002008000311', 'JL. Localhost No.000311', 'JL. Server No.000311', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (313, 1, 'CUST220609.000312', 'Pelanggan 000312', 'PIC000312', 'pelanggan000312@localhost.com', '000312000312', '002008000312', 'JL. Localhost No.000312', 'JL. Server No.000312', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (314, 1, 'CUST220609.000313', 'Pelanggan 000313', 'PIC000313', 'pelanggan000313@localhost.com', '000313000313', '002008000313', 'JL. Localhost No.000313', 'JL. Server No.000313', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (315, 1, 'CUST220609.000314', 'Pelanggan 000314', 'PIC000314', 'pelanggan000314@localhost.com', '000314000314', '002008000314', 'JL. Localhost No.000314', 'JL. Server No.000314', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (316, 1, 'CUST220609.000315', 'Pelanggan 000315', 'PIC000315', 'pelanggan000315@localhost.com', '000315000315', '002008000315', 'JL. Localhost No.000315', 'JL. Server No.000315', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (317, 1, 'CUST220609.000316', 'Pelanggan 000316', 'PIC000316', 'pelanggan000316@localhost.com', '000316000316', '002008000316', 'JL. Localhost No.000316', 'JL. Server No.000316', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (318, 1, 'CUST220609.000317', 'Pelanggan 000317', 'PIC000317', 'pelanggan000317@localhost.com', '000317000317', '002008000317', 'JL. Localhost No.000317', 'JL. Server No.000317', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (319, 1, 'CUST220609.000318', 'Pelanggan 000318', 'PIC000318', 'pelanggan000318@localhost.com', '000318000318', '002008000318', 'JL. Localhost No.000318', 'JL. Server No.000318', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (320, 1, 'CUST220609.000319', 'Pelanggan 000319', 'PIC000319', 'pelanggan000319@localhost.com', '000319000319', '002008000319', 'JL. Localhost No.000319', 'JL. Server No.000319', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (321, 1, 'CUST220609.000320', 'Pelanggan 000320', 'PIC000320', 'pelanggan000320@localhost.com', '000320000320', '002008000320', 'JL. Localhost No.000320', 'JL. Server No.000320', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (322, 1, 'CUST220609.000321', 'Pelanggan 000321', 'PIC000321', 'pelanggan000321@localhost.com', '000321000321', '002008000321', 'JL. Localhost No.000321', 'JL. Server No.000321', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (323, 1, 'CUST220609.000322', 'Pelanggan 000322', 'PIC000322', 'pelanggan000322@localhost.com', '000322000322', '002008000322', 'JL. Localhost No.000322', 'JL. Server No.000322', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (324, 1, 'CUST220609.000323', 'Pelanggan 000323', 'PIC000323', 'pelanggan000323@localhost.com', '000323000323', '002008000323', 'JL. Localhost No.000323', 'JL. Server No.000323', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (325, 1, 'CUST220609.000324', 'Pelanggan 000324', 'PIC000324', 'pelanggan000324@localhost.com', '000324000324', '002008000324', 'JL. Localhost No.000324', 'JL. Server No.000324', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (326, 1, 'CUST220609.000325', 'Pelanggan 000325', 'PIC000325', 'pelanggan000325@localhost.com', '000325000325', '002008000325', 'JL. Localhost No.000325', 'JL. Server No.000325', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (327, 1, 'CUST220609.000326', 'Pelanggan 000326', 'PIC000326', 'pelanggan000326@localhost.com', '000326000326', '002008000326', 'JL. Localhost No.000326', 'JL. Server No.000326', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (328, 1, 'CUST220609.000327', 'Pelanggan 000327', 'PIC000327', 'pelanggan000327@localhost.com', '000327000327', '002008000327', 'JL. Localhost No.000327', 'JL. Server No.000327', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (329, 1, 'CUST220609.000328', 'Pelanggan 000328', 'PIC000328', 'pelanggan000328@localhost.com', '000328000328', '002008000328', 'JL. Localhost No.000328', 'JL. Server No.000328', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (330, 1, 'CUST220609.000329', 'Pelanggan 000329', 'PIC000329', 'pelanggan000329@localhost.com', '000329000329', '002008000329', 'JL. Localhost No.000329', 'JL. Server No.000329', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (331, 1, 'CUST220609.000330', 'Pelanggan 000330', 'PIC000330', 'pelanggan000330@localhost.com', '000330000330', '002008000330', 'JL. Localhost No.000330', 'JL. Server No.000330', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (332, 1, 'CUST220609.000331', 'Pelanggan 000331', 'PIC000331', 'pelanggan000331@localhost.com', '000331000331', '002008000331', 'JL. Localhost No.000331', 'JL. Server No.000331', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (333, 1, 'CUST220609.000332', 'Pelanggan 000332', 'PIC000332', 'pelanggan000332@localhost.com', '000332000332', '002008000332', 'JL. Localhost No.000332', 'JL. Server No.000332', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (334, 1, 'CUST220609.000333', 'Pelanggan 000333', 'PIC000333', 'pelanggan000333@localhost.com', '000333000333', '002008000333', 'JL. Localhost No.000333', 'JL. Server No.000333', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (335, 1, 'CUST220609.000334', 'Pelanggan 000334', 'PIC000334', 'pelanggan000334@localhost.com', '000334000334', '002008000334', 'JL. Localhost No.000334', 'JL. Server No.000334', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (336, 1, 'CUST220609.000335', 'Pelanggan 000335', 'PIC000335', 'pelanggan000335@localhost.com', '000335000335', '002008000335', 'JL. Localhost No.000335', 'JL. Server No.000335', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (337, 1, 'CUST220609.000336', 'Pelanggan 000336', 'PIC000336', 'pelanggan000336@localhost.com', '000336000336', '002008000336', 'JL. Localhost No.000336', 'JL. Server No.000336', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (338, 1, 'CUST220609.000337', 'Pelanggan 000337', 'PIC000337', 'pelanggan000337@localhost.com', '000337000337', '002008000337', 'JL. Localhost No.000337', 'JL. Server No.000337', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (339, 1, 'CUST220609.000338', 'Pelanggan 000338', 'PIC000338', 'pelanggan000338@localhost.com', '000338000338', '002008000338', 'JL. Localhost No.000338', 'JL. Server No.000338', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (340, 1, 'CUST220609.000339', 'Pelanggan 000339', 'PIC000339', 'pelanggan000339@localhost.com', '000339000339', '002008000339', 'JL. Localhost No.000339', 'JL. Server No.000339', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (341, 1, 'CUST220609.000340', 'Pelanggan 000340', 'PIC000340', 'pelanggan000340@localhost.com', '000340000340', '002008000340', 'JL. Localhost No.000340', 'JL. Server No.000340', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (342, 1, 'CUST220609.000341', 'Pelanggan 000341', 'PIC000341', 'pelanggan000341@localhost.com', '000341000341', '002008000341', 'JL. Localhost No.000341', 'JL. Server No.000341', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (343, 1, 'CUST220609.000342', 'Pelanggan 000342', 'PIC000342', 'pelanggan000342@localhost.com', '000342000342', '002008000342', 'JL. Localhost No.000342', 'JL. Server No.000342', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (344, 1, 'CUST220609.000343', 'Pelanggan 000343', 'PIC000343', 'pelanggan000343@localhost.com', '000343000343', '002008000343', 'JL. Localhost No.000343', 'JL. Server No.000343', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (345, 1, 'CUST220609.000344', 'Pelanggan 000344', 'PIC000344', 'pelanggan000344@localhost.com', '000344000344', '002008000344', 'JL. Localhost No.000344', 'JL. Server No.000344', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (346, 1, 'CUST220609.000345', 'Pelanggan 000345', 'PIC000345', 'pelanggan000345@localhost.com', '000345000345', '002008000345', 'JL. Localhost No.000345', 'JL. Server No.000345', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (347, 1, 'CUST220609.000346', 'Pelanggan 000346', 'PIC000346', 'pelanggan000346@localhost.com', '000346000346', '002008000346', 'JL. Localhost No.000346', 'JL. Server No.000346', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (348, 1, 'CUST220609.000347', 'Pelanggan 000347', 'PIC000347', 'pelanggan000347@localhost.com', '000347000347', '002008000347', 'JL. Localhost No.000347', 'JL. Server No.000347', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (349, 1, 'CUST220609.000348', 'Pelanggan 000348', 'PIC000348', 'pelanggan000348@localhost.com', '000348000348', '002008000348', 'JL. Localhost No.000348', 'JL. Server No.000348', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (350, 1, 'CUST220609.000349', 'Pelanggan 000349', 'PIC000349', 'pelanggan000349@localhost.com', '000349000349', '002008000349', 'JL. Localhost No.000349', 'JL. Server No.000349', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (351, 1, 'CUST220609.000350', 'Pelanggan 000350', 'PIC000350', 'pelanggan000350@localhost.com', '000350000350', '002008000350', 'JL. Localhost No.000350', 'JL. Server No.000350', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (352, 1, 'CUST220609.000351', 'Pelanggan 000351', 'PIC000351', 'pelanggan000351@localhost.com', '000351000351', '002008000351', 'JL. Localhost No.000351', 'JL. Server No.000351', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (353, 1, 'CUST220609.000352', 'Pelanggan 000352', 'PIC000352', 'pelanggan000352@localhost.com', '000352000352', '002008000352', 'JL. Localhost No.000352', 'JL. Server No.000352', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (354, 1, 'CUST220609.000353', 'Pelanggan 000353', 'PIC000353', 'pelanggan000353@localhost.com', '000353000353', '002008000353', 'JL. Localhost No.000353', 'JL. Server No.000353', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (355, 1, 'CUST220609.000354', 'Pelanggan 000354', 'PIC000354', 'pelanggan000354@localhost.com', '000354000354', '002008000354', 'JL. Localhost No.000354', 'JL. Server No.000354', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (356, 1, 'CUST220609.000355', 'Pelanggan 000355', 'PIC000355', 'pelanggan000355@localhost.com', '000355000355', '002008000355', 'JL. Localhost No.000355', 'JL. Server No.000355', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (357, 1, 'CUST220609.000356', 'Pelanggan 000356', 'PIC000356', 'pelanggan000356@localhost.com', '000356000356', '002008000356', 'JL. Localhost No.000356', 'JL. Server No.000356', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (358, 1, 'CUST220609.000357', 'Pelanggan 000357', 'PIC000357', 'pelanggan000357@localhost.com', '000357000357', '002008000357', 'JL. Localhost No.000357', 'JL. Server No.000357', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (359, 1, 'CUST220609.000358', 'Pelanggan 000358', 'PIC000358', 'pelanggan000358@localhost.com', '000358000358', '002008000358', 'JL. Localhost No.000358', 'JL. Server No.000358', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (360, 1, 'CUST220609.000359', 'Pelanggan 000359', 'PIC000359', 'pelanggan000359@localhost.com', '000359000359', '002008000359', 'JL. Localhost No.000359', 'JL. Server No.000359', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (361, 1, 'CUST220609.000360', 'Pelanggan 000360', 'PIC000360', 'pelanggan000360@localhost.com', '000360000360', '002008000360', 'JL. Localhost No.000360', 'JL. Server No.000360', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (362, 1, 'CUST220609.000361', 'Pelanggan 000361', 'PIC000361', 'pelanggan000361@localhost.com', '000361000361', '002008000361', 'JL. Localhost No.000361', 'JL. Server No.000361', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (363, 1, 'CUST220609.000362', 'Pelanggan 000362', 'PIC000362', 'pelanggan000362@localhost.com', '000362000362', '002008000362', 'JL. Localhost No.000362', 'JL. Server No.000362', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (364, 1, 'CUST220609.000363', 'Pelanggan 000363', 'PIC000363', 'pelanggan000363@localhost.com', '000363000363', '002008000363', 'JL. Localhost No.000363', 'JL. Server No.000363', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (365, 1, 'CUST220609.000364', 'Pelanggan 000364', 'PIC000364', 'pelanggan000364@localhost.com', '000364000364', '002008000364', 'JL. Localhost No.000364', 'JL. Server No.000364', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (366, 1, 'CUST220609.000365', 'Pelanggan 000365', 'PIC000365', 'pelanggan000365@localhost.com', '000365000365', '002008000365', 'JL. Localhost No.000365', 'JL. Server No.000365', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (367, 1, 'CUST220609.000366', 'Pelanggan 000366', 'PIC000366', 'pelanggan000366@localhost.com', '000366000366', '002008000366', 'JL. Localhost No.000366', 'JL. Server No.000366', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (368, 1, 'CUST220609.000367', 'Pelanggan 000367', 'PIC000367', 'pelanggan000367@localhost.com', '000367000367', '002008000367', 'JL. Localhost No.000367', 'JL. Server No.000367', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (369, 1, 'CUST220609.000368', 'Pelanggan 000368', 'PIC000368', 'pelanggan000368@localhost.com', '000368000368', '002008000368', 'JL. Localhost No.000368', 'JL. Server No.000368', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (370, 1, 'CUST220609.000369', 'Pelanggan 000369', 'PIC000369', 'pelanggan000369@localhost.com', '000369000369', '002008000369', 'JL. Localhost No.000369', 'JL. Server No.000369', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (371, 1, 'CUST220609.000370', 'Pelanggan 000370', 'PIC000370', 'pelanggan000370@localhost.com', '000370000370', '002008000370', 'JL. Localhost No.000370', 'JL. Server No.000370', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (372, 1, 'CUST220609.000371', 'Pelanggan 000371', 'PIC000371', 'pelanggan000371@localhost.com', '000371000371', '002008000371', 'JL. Localhost No.000371', 'JL. Server No.000371', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (373, 1, 'CUST220609.000372', 'Pelanggan 000372', 'PIC000372', 'pelanggan000372@localhost.com', '000372000372', '002008000372', 'JL. Localhost No.000372', 'JL. Server No.000372', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (374, 1, 'CUST220609.000373', 'Pelanggan 000373', 'PIC000373', 'pelanggan000373@localhost.com', '000373000373', '002008000373', 'JL. Localhost No.000373', 'JL. Server No.000373', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (375, 1, 'CUST220609.000374', 'Pelanggan 000374', 'PIC000374', 'pelanggan000374@localhost.com', '000374000374', '002008000374', 'JL. Localhost No.000374', 'JL. Server No.000374', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (376, 1, 'CUST220609.000375', 'Pelanggan 000375', 'PIC000375', 'pelanggan000375@localhost.com', '000375000375', '002008000375', 'JL. Localhost No.000375', 'JL. Server No.000375', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (377, 1, 'CUST220609.000376', 'Pelanggan 000376', 'PIC000376', 'pelanggan000376@localhost.com', '000376000376', '002008000376', 'JL. Localhost No.000376', 'JL. Server No.000376', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (378, 1, 'CUST220609.000377', 'Pelanggan 000377', 'PIC000377', 'pelanggan000377@localhost.com', '000377000377', '002008000377', 'JL. Localhost No.000377', 'JL. Server No.000377', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (379, 1, 'CUST220609.000378', 'Pelanggan 000378', 'PIC000378', 'pelanggan000378@localhost.com', '000378000378', '002008000378', 'JL. Localhost No.000378', 'JL. Server No.000378', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (380, 1, 'CUST220609.000379', 'Pelanggan 000379', 'PIC000379', 'pelanggan000379@localhost.com', '000379000379', '002008000379', 'JL. Localhost No.000379', 'JL. Server No.000379', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (381, 1, 'CUST220609.000380', 'Pelanggan 000380', 'PIC000380', 'pelanggan000380@localhost.com', '000380000380', '002008000380', 'JL. Localhost No.000380', 'JL. Server No.000380', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (382, 1, 'CUST220609.000381', 'Pelanggan 000381', 'PIC000381', 'pelanggan000381@localhost.com', '000381000381', '002008000381', 'JL. Localhost No.000381', 'JL. Server No.000381', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (383, 1, 'CUST220609.000382', 'Pelanggan 000382', 'PIC000382', 'pelanggan000382@localhost.com', '000382000382', '002008000382', 'JL. Localhost No.000382', 'JL. Server No.000382', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (384, 1, 'CUST220609.000383', 'Pelanggan 000383', 'PIC000383', 'pelanggan000383@localhost.com', '000383000383', '002008000383', 'JL. Localhost No.000383', 'JL. Server No.000383', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (385, 1, 'CUST220609.000384', 'Pelanggan 000384', 'PIC000384', 'pelanggan000384@localhost.com', '000384000384', '002008000384', 'JL. Localhost No.000384', 'JL. Server No.000384', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (386, 1, 'CUST220609.000385', 'Pelanggan 000385', 'PIC000385', 'pelanggan000385@localhost.com', '000385000385', '002008000385', 'JL. Localhost No.000385', 'JL. Server No.000385', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (387, 1, 'CUST220609.000386', 'Pelanggan 000386', 'PIC000386', 'pelanggan000386@localhost.com', '000386000386', '002008000386', 'JL. Localhost No.000386', 'JL. Server No.000386', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (388, 1, 'CUST220609.000387', 'Pelanggan 000387', 'PIC000387', 'pelanggan000387@localhost.com', '000387000387', '002008000387', 'JL. Localhost No.000387', 'JL. Server No.000387', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (389, 1, 'CUST220609.000388', 'Pelanggan 000388', 'PIC000388', 'pelanggan000388@localhost.com', '000388000388', '002008000388', 'JL. Localhost No.000388', 'JL. Server No.000388', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (390, 1, 'CUST220609.000389', 'Pelanggan 000389', 'PIC000389', 'pelanggan000389@localhost.com', '000389000389', '002008000389', 'JL. Localhost No.000389', 'JL. Server No.000389', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (391, 1, 'CUST220609.000390', 'Pelanggan 000390', 'PIC000390', 'pelanggan000390@localhost.com', '000390000390', '002008000390', 'JL. Localhost No.000390', 'JL. Server No.000390', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (392, 1, 'CUST220609.000391', 'Pelanggan 000391', 'PIC000391', 'pelanggan000391@localhost.com', '000391000391', '002008000391', 'JL. Localhost No.000391', 'JL. Server No.000391', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (393, 1, 'CUST220609.000392', 'Pelanggan 000392', 'PIC000392', 'pelanggan000392@localhost.com', '000392000392', '002008000392', 'JL. Localhost No.000392', 'JL. Server No.000392', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (394, 1, 'CUST220609.000393', 'Pelanggan 000393', 'PIC000393', 'pelanggan000393@localhost.com', '000393000393', '002008000393', 'JL. Localhost No.000393', 'JL. Server No.000393', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (395, 1, 'CUST220609.000394', 'Pelanggan 000394', 'PIC000394', 'pelanggan000394@localhost.com', '000394000394', '002008000394', 'JL. Localhost No.000394', 'JL. Server No.000394', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (396, 1, 'CUST220609.000395', 'Pelanggan 000395', 'PIC000395', 'pelanggan000395@localhost.com', '000395000395', '002008000395', 'JL. Localhost No.000395', 'JL. Server No.000395', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (397, 1, 'CUST220609.000396', 'Pelanggan 000396', 'PIC000396', 'pelanggan000396@localhost.com', '000396000396', '002008000396', 'JL. Localhost No.000396', 'JL. Server No.000396', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (398, 1, 'CUST220609.000397', 'Pelanggan 000397', 'PIC000397', 'pelanggan000397@localhost.com', '000397000397', '002008000397', 'JL. Localhost No.000397', 'JL. Server No.000397', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (399, 1, 'CUST220609.000398', 'Pelanggan 000398', 'PIC000398', 'pelanggan000398@localhost.com', '000398000398', '002008000398', 'JL. Localhost No.000398', 'JL. Server No.000398', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (400, 1, 'CUST220609.000399', 'Pelanggan 000399', 'PIC000399', 'pelanggan000399@localhost.com', '000399000399', '002008000399', 'JL. Localhost No.000399', 'JL. Server No.000399', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (401, 1, 'CUST220609.000400', 'Pelanggan 000400', 'PIC000400', 'pelanggan000400@localhost.com', '000400000400', '002008000400', 'JL. Localhost No.000400', 'JL. Server No.000400', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (402, 1, 'CUST220609.000401', 'Pelanggan 000401', 'PIC000401', 'pelanggan000401@localhost.com', '000401000401', '002008000401', 'JL. Localhost No.000401', 'JL. Server No.000401', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (403, 1, 'CUST220609.000402', 'Pelanggan 000402', 'PIC000402', 'pelanggan000402@localhost.com', '000402000402', '002008000402', 'JL. Localhost No.000402', 'JL. Server No.000402', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (404, 1, 'CUST220609.000403', 'Pelanggan 000403', 'PIC000403', 'pelanggan000403@localhost.com', '000403000403', '002008000403', 'JL. Localhost No.000403', 'JL. Server No.000403', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (405, 1, 'CUST220609.000404', 'Pelanggan 000404', 'PIC000404', 'pelanggan000404@localhost.com', '000404000404', '002008000404', 'JL. Localhost No.000404', 'JL. Server No.000404', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (406, 1, 'CUST220609.000405', 'Pelanggan 000405', 'PIC000405', 'pelanggan000405@localhost.com', '000405000405', '002008000405', 'JL. Localhost No.000405', 'JL. Server No.000405', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (407, 1, 'CUST220609.000406', 'Pelanggan 000406', 'PIC000406', 'pelanggan000406@localhost.com', '000406000406', '002008000406', 'JL. Localhost No.000406', 'JL. Server No.000406', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (408, 1, 'CUST220609.000407', 'Pelanggan 000407', 'PIC000407', 'pelanggan000407@localhost.com', '000407000407', '002008000407', 'JL. Localhost No.000407', 'JL. Server No.000407', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (409, 1, 'CUST220609.000408', 'Pelanggan 000408', 'PIC000408', 'pelanggan000408@localhost.com', '000408000408', '002008000408', 'JL. Localhost No.000408', 'JL. Server No.000408', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (410, 1, 'CUST220609.000409', 'Pelanggan 000409', 'PIC000409', 'pelanggan000409@localhost.com', '000409000409', '002008000409', 'JL. Localhost No.000409', 'JL. Server No.000409', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (411, 1, 'CUST220609.000410', 'Pelanggan 000410', 'PIC000410', 'pelanggan000410@localhost.com', '000410000410', '002008000410', 'JL. Localhost No.000410', 'JL. Server No.000410', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (412, 1, 'CUST220609.000411', 'Pelanggan 000411', 'PIC000411', 'pelanggan000411@localhost.com', '000411000411', '002008000411', 'JL. Localhost No.000411', 'JL. Server No.000411', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (413, 1, 'CUST220609.000412', 'Pelanggan 000412', 'PIC000412', 'pelanggan000412@localhost.com', '000412000412', '002008000412', 'JL. Localhost No.000412', 'JL. Server No.000412', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (414, 1, 'CUST220609.000413', 'Pelanggan 000413', 'PIC000413', 'pelanggan000413@localhost.com', '000413000413', '002008000413', 'JL. Localhost No.000413', 'JL. Server No.000413', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (415, 1, 'CUST220609.000414', 'Pelanggan 000414', 'PIC000414', 'pelanggan000414@localhost.com', '000414000414', '002008000414', 'JL. Localhost No.000414', 'JL. Server No.000414', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (416, 1, 'CUST220609.000415', 'Pelanggan 000415', 'PIC000415', 'pelanggan000415@localhost.com', '000415000415', '002008000415', 'JL. Localhost No.000415', 'JL. Server No.000415', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (417, 1, 'CUST220609.000416', 'Pelanggan 000416', 'PIC000416', 'pelanggan000416@localhost.com', '000416000416', '002008000416', 'JL. Localhost No.000416', 'JL. Server No.000416', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (418, 1, 'CUST220609.000417', 'Pelanggan 000417', 'PIC000417', 'pelanggan000417@localhost.com', '000417000417', '002008000417', 'JL. Localhost No.000417', 'JL. Server No.000417', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (419, 1, 'CUST220609.000418', 'Pelanggan 000418', 'PIC000418', 'pelanggan000418@localhost.com', '000418000418', '002008000418', 'JL. Localhost No.000418', 'JL. Server No.000418', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (420, 1, 'CUST220609.000419', 'Pelanggan 000419', 'PIC000419', 'pelanggan000419@localhost.com', '000419000419', '002008000419', 'JL. Localhost No.000419', 'JL. Server No.000419', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (421, 1, 'CUST220609.000420', 'Pelanggan 000420', 'PIC000420', 'pelanggan000420@localhost.com', '000420000420', '002008000420', 'JL. Localhost No.000420', 'JL. Server No.000420', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (422, 1, 'CUST220609.000421', 'Pelanggan 000421', 'PIC000421', 'pelanggan000421@localhost.com', '000421000421', '002008000421', 'JL. Localhost No.000421', 'JL. Server No.000421', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (423, 1, 'CUST220609.000422', 'Pelanggan 000422', 'PIC000422', 'pelanggan000422@localhost.com', '000422000422', '002008000422', 'JL. Localhost No.000422', 'JL. Server No.000422', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (424, 1, 'CUST220609.000423', 'Pelanggan 000423', 'PIC000423', 'pelanggan000423@localhost.com', '000423000423', '002008000423', 'JL. Localhost No.000423', 'JL. Server No.000423', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (425, 1, 'CUST220609.000424', 'Pelanggan 000424', 'PIC000424', 'pelanggan000424@localhost.com', '000424000424', '002008000424', 'JL. Localhost No.000424', 'JL. Server No.000424', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (426, 1, 'CUST220609.000425', 'Pelanggan 000425', 'PIC000425', 'pelanggan000425@localhost.com', '000425000425', '002008000425', 'JL. Localhost No.000425', 'JL. Server No.000425', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (427, 1, 'CUST220609.000426', 'Pelanggan 000426', 'PIC000426', 'pelanggan000426@localhost.com', '000426000426', '002008000426', 'JL. Localhost No.000426', 'JL. Server No.000426', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (428, 1, 'CUST220609.000427', 'Pelanggan 000427', 'PIC000427', 'pelanggan000427@localhost.com', '000427000427', '002008000427', 'JL. Localhost No.000427', 'JL. Server No.000427', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (429, 1, 'CUST220609.000428', 'Pelanggan 000428', 'PIC000428', 'pelanggan000428@localhost.com', '000428000428', '002008000428', 'JL. Localhost No.000428', 'JL. Server No.000428', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (430, 1, 'CUST220609.000429', 'Pelanggan 000429', 'PIC000429', 'pelanggan000429@localhost.com', '000429000429', '002008000429', 'JL. Localhost No.000429', 'JL. Server No.000429', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (431, 1, 'CUST220609.000430', 'Pelanggan 000430', 'PIC000430', 'pelanggan000430@localhost.com', '000430000430', '002008000430', 'JL. Localhost No.000430', 'JL. Server No.000430', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (432, 1, 'CUST220609.000431', 'Pelanggan 000431', 'PIC000431', 'pelanggan000431@localhost.com', '000431000431', '002008000431', 'JL. Localhost No.000431', 'JL. Server No.000431', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (433, 1, 'CUST220609.000432', 'Pelanggan 000432', 'PIC000432', 'pelanggan000432@localhost.com', '000432000432', '002008000432', 'JL. Localhost No.000432', 'JL. Server No.000432', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (434, 1, 'CUST220609.000433', 'Pelanggan 000433', 'PIC000433', 'pelanggan000433@localhost.com', '000433000433', '002008000433', 'JL. Localhost No.000433', 'JL. Server No.000433', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (435, 1, 'CUST220609.000434', 'Pelanggan 000434', 'PIC000434', 'pelanggan000434@localhost.com', '000434000434', '002008000434', 'JL. Localhost No.000434', 'JL. Server No.000434', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (436, 1, 'CUST220609.000435', 'Pelanggan 000435', 'PIC000435', 'pelanggan000435@localhost.com', '000435000435', '002008000435', 'JL. Localhost No.000435', 'JL. Server No.000435', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (437, 1, 'CUST220609.000436', 'Pelanggan 000436', 'PIC000436', 'pelanggan000436@localhost.com', '000436000436', '002008000436', 'JL. Localhost No.000436', 'JL. Server No.000436', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (438, 1, 'CUST220609.000437', 'Pelanggan 000437', 'PIC000437', 'pelanggan000437@localhost.com', '000437000437', '002008000437', 'JL. Localhost No.000437', 'JL. Server No.000437', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (439, 1, 'CUST220609.000438', 'Pelanggan 000438', 'PIC000438', 'pelanggan000438@localhost.com', '000438000438', '002008000438', 'JL. Localhost No.000438', 'JL. Server No.000438', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (440, 1, 'CUST220609.000439', 'Pelanggan 000439', 'PIC000439', 'pelanggan000439@localhost.com', '000439000439', '002008000439', 'JL. Localhost No.000439', 'JL. Server No.000439', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (441, 1, 'CUST220609.000440', 'Pelanggan 000440', 'PIC000440', 'pelanggan000440@localhost.com', '000440000440', '002008000440', 'JL. Localhost No.000440', 'JL. Server No.000440', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (442, 1, 'CUST220609.000441', 'Pelanggan 000441', 'PIC000441', 'pelanggan000441@localhost.com', '000441000441', '002008000441', 'JL. Localhost No.000441', 'JL. Server No.000441', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (443, 1, 'CUST220609.000442', 'Pelanggan 000442', 'PIC000442', 'pelanggan000442@localhost.com', '000442000442', '002008000442', 'JL. Localhost No.000442', 'JL. Server No.000442', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (444, 1, 'CUST220609.000443', 'Pelanggan 000443', 'PIC000443', 'pelanggan000443@localhost.com', '000443000443', '002008000443', 'JL. Localhost No.000443', 'JL. Server No.000443', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (445, 1, 'CUST220609.000444', 'Pelanggan 000444', 'PIC000444', 'pelanggan000444@localhost.com', '000444000444', '002008000444', 'JL. Localhost No.000444', 'JL. Server No.000444', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (446, 1, 'CUST220609.000445', 'Pelanggan 000445', 'PIC000445', 'pelanggan000445@localhost.com', '000445000445', '002008000445', 'JL. Localhost No.000445', 'JL. Server No.000445', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (447, 1, 'CUST220609.000446', 'Pelanggan 000446', 'PIC000446', 'pelanggan000446@localhost.com', '000446000446', '002008000446', 'JL. Localhost No.000446', 'JL. Server No.000446', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (448, 1, 'CUST220609.000447', 'Pelanggan 000447', 'PIC000447', 'pelanggan000447@localhost.com', '000447000447', '002008000447', 'JL. Localhost No.000447', 'JL. Server No.000447', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (449, 1, 'CUST220609.000448', 'Pelanggan 000448', 'PIC000448', 'pelanggan000448@localhost.com', '000448000448', '002008000448', 'JL. Localhost No.000448', 'JL. Server No.000448', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (450, 1, 'CUST220609.000449', 'Pelanggan 000449', 'PIC000449', 'pelanggan000449@localhost.com', '000449000449', '002008000449', 'JL. Localhost No.000449', 'JL. Server No.000449', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (451, 1, 'CUST220609.000450', 'Pelanggan 000450', 'PIC000450', 'pelanggan000450@localhost.com', '000450000450', '002008000450', 'JL. Localhost No.000450', 'JL. Server No.000450', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (452, 1, 'CUST220609.000451', 'Pelanggan 000451', 'PIC000451', 'pelanggan000451@localhost.com', '000451000451', '002008000451', 'JL. Localhost No.000451', 'JL. Server No.000451', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (453, 1, 'CUST220609.000452', 'Pelanggan 000452', 'PIC000452', 'pelanggan000452@localhost.com', '000452000452', '002008000452', 'JL. Localhost No.000452', 'JL. Server No.000452', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (454, 1, 'CUST220609.000453', 'Pelanggan 000453', 'PIC000453', 'pelanggan000453@localhost.com', '000453000453', '002008000453', 'JL. Localhost No.000453', 'JL. Server No.000453', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (455, 1, 'CUST220609.000454', 'Pelanggan 000454', 'PIC000454', 'pelanggan000454@localhost.com', '000454000454', '002008000454', 'JL. Localhost No.000454', 'JL. Server No.000454', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (456, 1, 'CUST220609.000455', 'Pelanggan 000455', 'PIC000455', 'pelanggan000455@localhost.com', '000455000455', '002008000455', 'JL. Localhost No.000455', 'JL. Server No.000455', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (457, 1, 'CUST220609.000456', 'Pelanggan 000456', 'PIC000456', 'pelanggan000456@localhost.com', '000456000456', '002008000456', 'JL. Localhost No.000456', 'JL. Server No.000456', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (458, 1, 'CUST220609.000457', 'Pelanggan 000457', 'PIC000457', 'pelanggan000457@localhost.com', '000457000457', '002008000457', 'JL. Localhost No.000457', 'JL. Server No.000457', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (459, 1, 'CUST220609.000458', 'Pelanggan 000458', 'PIC000458', 'pelanggan000458@localhost.com', '000458000458', '002008000458', 'JL. Localhost No.000458', 'JL. Server No.000458', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (460, 1, 'CUST220609.000459', 'Pelanggan 000459', 'PIC000459', 'pelanggan000459@localhost.com', '000459000459', '002008000459', 'JL. Localhost No.000459', 'JL. Server No.000459', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (461, 1, 'CUST220609.000460', 'Pelanggan 000460', 'PIC000460', 'pelanggan000460@localhost.com', '000460000460', '002008000460', 'JL. Localhost No.000460', 'JL. Server No.000460', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (462, 1, 'CUST220609.000461', 'Pelanggan 000461', 'PIC000461', 'pelanggan000461@localhost.com', '000461000461', '002008000461', 'JL. Localhost No.000461', 'JL. Server No.000461', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (463, 1, 'CUST220609.000462', 'Pelanggan 000462', 'PIC000462', 'pelanggan000462@localhost.com', '000462000462', '002008000462', 'JL. Localhost No.000462', 'JL. Server No.000462', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (464, 1, 'CUST220609.000463', 'Pelanggan 000463', 'PIC000463', 'pelanggan000463@localhost.com', '000463000463', '002008000463', 'JL. Localhost No.000463', 'JL. Server No.000463', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (465, 1, 'CUST220609.000464', 'Pelanggan 000464', 'PIC000464', 'pelanggan000464@localhost.com', '000464000464', '002008000464', 'JL. Localhost No.000464', 'JL. Server No.000464', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (466, 1, 'CUST220609.000465', 'Pelanggan 000465', 'PIC000465', 'pelanggan000465@localhost.com', '000465000465', '002008000465', 'JL. Localhost No.000465', 'JL. Server No.000465', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (467, 1, 'CUST220609.000466', 'Pelanggan 000466', 'PIC000466', 'pelanggan000466@localhost.com', '000466000466', '002008000466', 'JL. Localhost No.000466', 'JL. Server No.000466', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (468, 1, 'CUST220609.000467', 'Pelanggan 000467', 'PIC000467', 'pelanggan000467@localhost.com', '000467000467', '002008000467', 'JL. Localhost No.000467', 'JL. Server No.000467', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (469, 1, 'CUST220609.000468', 'Pelanggan 000468', 'PIC000468', 'pelanggan000468@localhost.com', '000468000468', '002008000468', 'JL. Localhost No.000468', 'JL. Server No.000468', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (470, 1, 'CUST220609.000469', 'Pelanggan 000469', 'PIC000469', 'pelanggan000469@localhost.com', '000469000469', '002008000469', 'JL. Localhost No.000469', 'JL. Server No.000469', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (471, 1, 'CUST220609.000470', 'Pelanggan 000470', 'PIC000470', 'pelanggan000470@localhost.com', '000470000470', '002008000470', 'JL. Localhost No.000470', 'JL. Server No.000470', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (472, 1, 'CUST220609.000471', 'Pelanggan 000471', 'PIC000471', 'pelanggan000471@localhost.com', '000471000471', '002008000471', 'JL. Localhost No.000471', 'JL. Server No.000471', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (473, 1, 'CUST220609.000472', 'Pelanggan 000472', 'PIC000472', 'pelanggan000472@localhost.com', '000472000472', '002008000472', 'JL. Localhost No.000472', 'JL. Server No.000472', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (474, 1, 'CUST220609.000473', 'Pelanggan 000473', 'PIC000473', 'pelanggan000473@localhost.com', '000473000473', '002008000473', 'JL. Localhost No.000473', 'JL. Server No.000473', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (475, 1, 'CUST220609.000474', 'Pelanggan 000474', 'PIC000474', 'pelanggan000474@localhost.com', '000474000474', '002008000474', 'JL. Localhost No.000474', 'JL. Server No.000474', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (476, 1, 'CUST220609.000475', 'Pelanggan 000475', 'PIC000475', 'pelanggan000475@localhost.com', '000475000475', '002008000475', 'JL. Localhost No.000475', 'JL. Server No.000475', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (477, 1, 'CUST220609.000476', 'Pelanggan 000476', 'PIC000476', 'pelanggan000476@localhost.com', '000476000476', '002008000476', 'JL. Localhost No.000476', 'JL. Server No.000476', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (478, 1, 'CUST220609.000477', 'Pelanggan 000477', 'PIC000477', 'pelanggan000477@localhost.com', '000477000477', '002008000477', 'JL. Localhost No.000477', 'JL. Server No.000477', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (479, 1, 'CUST220609.000478', 'Pelanggan 000478', 'PIC000478', 'pelanggan000478@localhost.com', '000478000478', '002008000478', 'JL. Localhost No.000478', 'JL. Server No.000478', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (480, 1, 'CUST220609.000479', 'Pelanggan 000479', 'PIC000479', 'pelanggan000479@localhost.com', '000479000479', '002008000479', 'JL. Localhost No.000479', 'JL. Server No.000479', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (481, 1, 'CUST220609.000480', 'Pelanggan 000480', 'PIC000480', 'pelanggan000480@localhost.com', '000480000480', '002008000480', 'JL. Localhost No.000480', 'JL. Server No.000480', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (482, 1, 'CUST220609.000481', 'Pelanggan 000481', 'PIC000481', 'pelanggan000481@localhost.com', '000481000481', '002008000481', 'JL. Localhost No.000481', 'JL. Server No.000481', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (483, 1, 'CUST220609.000482', 'Pelanggan 000482', 'PIC000482', 'pelanggan000482@localhost.com', '000482000482', '002008000482', 'JL. Localhost No.000482', 'JL. Server No.000482', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (484, 1, 'CUST220609.000483', 'Pelanggan 000483', 'PIC000483', 'pelanggan000483@localhost.com', '000483000483', '002008000483', 'JL. Localhost No.000483', 'JL. Server No.000483', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (485, 1, 'CUST220609.000484', 'Pelanggan 000484', 'PIC000484', 'pelanggan000484@localhost.com', '000484000484', '002008000484', 'JL. Localhost No.000484', 'JL. Server No.000484', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (486, 1, 'CUST220609.000485', 'Pelanggan 000485', 'PIC000485', 'pelanggan000485@localhost.com', '000485000485', '002008000485', 'JL. Localhost No.000485', 'JL. Server No.000485', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (487, 1, 'CUST220609.000486', 'Pelanggan 000486', 'PIC000486', 'pelanggan000486@localhost.com', '000486000486', '002008000486', 'JL. Localhost No.000486', 'JL. Server No.000486', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (488, 1, 'CUST220609.000487', 'Pelanggan 000487', 'PIC000487', 'pelanggan000487@localhost.com', '000487000487', '002008000487', 'JL. Localhost No.000487', 'JL. Server No.000487', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (489, 1, 'CUST220609.000488', 'Pelanggan 000488', 'PIC000488', 'pelanggan000488@localhost.com', '000488000488', '002008000488', 'JL. Localhost No.000488', 'JL. Server No.000488', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (490, 1, 'CUST220609.000489', 'Pelanggan 000489', 'PIC000489', 'pelanggan000489@localhost.com', '000489000489', '002008000489', 'JL. Localhost No.000489', 'JL. Server No.000489', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (491, 1, 'CUST220609.000490', 'Pelanggan 000490', 'PIC000490', 'pelanggan000490@localhost.com', '000490000490', '002008000490', 'JL. Localhost No.000490', 'JL. Server No.000490', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (492, 1, 'CUST220609.000491', 'Pelanggan 000491', 'PIC000491', 'pelanggan000491@localhost.com', '000491000491', '002008000491', 'JL. Localhost No.000491', 'JL. Server No.000491', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (493, 1, 'CUST220609.000492', 'Pelanggan 000492', 'PIC000492', 'pelanggan000492@localhost.com', '000492000492', '002008000492', 'JL. Localhost No.000492', 'JL. Server No.000492', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (494, 1, 'CUST220609.000493', 'Pelanggan 000493', 'PIC000493', 'pelanggan000493@localhost.com', '000493000493', '002008000493', 'JL. Localhost No.000493', 'JL. Server No.000493', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (495, 1, 'CUST220609.000494', 'Pelanggan 000494', 'PIC000494', 'pelanggan000494@localhost.com', '000494000494', '002008000494', 'JL. Localhost No.000494', 'JL. Server No.000494', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (496, 1, 'CUST220609.000495', 'Pelanggan 000495', 'PIC000495', 'pelanggan000495@localhost.com', '000495000495', '002008000495', 'JL. Localhost No.000495', 'JL. Server No.000495', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (497, 1, 'CUST220609.000496', 'Pelanggan 000496', 'PIC000496', 'pelanggan000496@localhost.com', '000496000496', '002008000496', 'JL. Localhost No.000496', 'JL. Server No.000496', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (498, 1, 'CUST220609.000497', 'Pelanggan 000497', 'PIC000497', 'pelanggan000497@localhost.com', '000497000497', '002008000497', 'JL. Localhost No.000497', 'JL. Server No.000497', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (499, 1, 'CUST220609.000498', 'Pelanggan 000498', 'PIC000498', 'pelanggan000498@localhost.com', '000498000498', '002008000498', 'JL. Localhost No.000498', 'JL. Server No.000498', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (500, 1, 'CUST220609.000499', 'Pelanggan 000499', 'PIC000499', 'pelanggan000499@localhost.com', '000499000499', '002008000499', 'JL. Localhost No.000499', 'JL. Server No.000499', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (501, 1, 'CUST220609.000500', 'Pelanggan 000500', 'PIC000500', 'pelanggan000500@localhost.com', '000500000500', '002008000500', 'JL. Localhost No.000500', 'JL. Server No.000500', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (502, 1, 'CUST220609.000501', 'Pelanggan 000501', 'PIC000501', 'pelanggan000501@localhost.com', '000501000501', '002008000501', 'JL. Localhost No.000501', 'JL. Server No.000501', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (503, 1, 'CUST220609.000502', 'Pelanggan 000502', 'PIC000502', 'pelanggan000502@localhost.com', '000502000502', '002008000502', 'JL. Localhost No.000502', 'JL. Server No.000502', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (504, 1, 'CUST220609.000503', 'Pelanggan 000503', 'PIC000503', 'pelanggan000503@localhost.com', '000503000503', '002008000503', 'JL. Localhost No.000503', 'JL. Server No.000503', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (505, 1, 'CUST220609.000504', 'Pelanggan 000504', 'PIC000504', 'pelanggan000504@localhost.com', '000504000504', '002008000504', 'JL. Localhost No.000504', 'JL. Server No.000504', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (506, 1, 'CUST220609.000505', 'Pelanggan 000505', 'PIC000505', 'pelanggan000505@localhost.com', '000505000505', '002008000505', 'JL. Localhost No.000505', 'JL. Server No.000505', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (507, 1, 'CUST220609.000506', 'Pelanggan 000506', 'PIC000506', 'pelanggan000506@localhost.com', '000506000506', '002008000506', 'JL. Localhost No.000506', 'JL. Server No.000506', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (508, 1, 'CUST220609.000507', 'Pelanggan 000507', 'PIC000507', 'pelanggan000507@localhost.com', '000507000507', '002008000507', 'JL. Localhost No.000507', 'JL. Server No.000507', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (509, 1, 'CUST220609.000508', 'Pelanggan 000508', 'PIC000508', 'pelanggan000508@localhost.com', '000508000508', '002008000508', 'JL. Localhost No.000508', 'JL. Server No.000508', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (510, 1, 'CUST220609.000509', 'Pelanggan 000509', 'PIC000509', 'pelanggan000509@localhost.com', '000509000509', '002008000509', 'JL. Localhost No.000509', 'JL. Server No.000509', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (511, 1, 'CUST220609.000510', 'Pelanggan 000510', 'PIC000510', 'pelanggan000510@localhost.com', '000510000510', '002008000510', 'JL. Localhost No.000510', 'JL. Server No.000510', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (512, 1, 'CUST220609.000511', 'Pelanggan 000511', 'PIC000511', 'pelanggan000511@localhost.com', '000511000511', '002008000511', 'JL. Localhost No.000511', 'JL. Server No.000511', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (513, 1, 'CUST220609.000512', 'Pelanggan 000512', 'PIC000512', 'pelanggan000512@localhost.com', '000512000512', '002008000512', 'JL. Localhost No.000512', 'JL. Server No.000512', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (514, 1, 'CUST220609.000513', 'Pelanggan 000513', 'PIC000513', 'pelanggan000513@localhost.com', '000513000513', '002008000513', 'JL. Localhost No.000513', 'JL. Server No.000513', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (515, 1, 'CUST220609.000514', 'Pelanggan 000514', 'PIC000514', 'pelanggan000514@localhost.com', '000514000514', '002008000514', 'JL. Localhost No.000514', 'JL. Server No.000514', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (516, 1, 'CUST220609.000515', 'Pelanggan 000515', 'PIC000515', 'pelanggan000515@localhost.com', '000515000515', '002008000515', 'JL. Localhost No.000515', 'JL. Server No.000515', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (517, 1, 'CUST220609.000516', 'Pelanggan 000516', 'PIC000516', 'pelanggan000516@localhost.com', '000516000516', '002008000516', 'JL. Localhost No.000516', 'JL. Server No.000516', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (518, 1, 'CUST220609.000517', 'Pelanggan 000517', 'PIC000517', 'pelanggan000517@localhost.com', '000517000517', '002008000517', 'JL. Localhost No.000517', 'JL. Server No.000517', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (519, 1, 'CUST220609.000518', 'Pelanggan 000518', 'PIC000518', 'pelanggan000518@localhost.com', '000518000518', '002008000518', 'JL. Localhost No.000518', 'JL. Server No.000518', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (520, 1, 'CUST220609.000519', 'Pelanggan 000519', 'PIC000519', 'pelanggan000519@localhost.com', '000519000519', '002008000519', 'JL. Localhost No.000519', 'JL. Server No.000519', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (521, 1, 'CUST220609.000520', 'Pelanggan 000520', 'PIC000520', 'pelanggan000520@localhost.com', '000520000520', '002008000520', 'JL. Localhost No.000520', 'JL. Server No.000520', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (522, 1, 'CUST220609.000521', 'Pelanggan 000521', 'PIC000521', 'pelanggan000521@localhost.com', '000521000521', '002008000521', 'JL. Localhost No.000521', 'JL. Server No.000521', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (523, 1, 'CUST220609.000522', 'Pelanggan 000522', 'PIC000522', 'pelanggan000522@localhost.com', '000522000522', '002008000522', 'JL. Localhost No.000522', 'JL. Server No.000522', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (524, 1, 'CUST220609.000523', 'Pelanggan 000523', 'PIC000523', 'pelanggan000523@localhost.com', '000523000523', '002008000523', 'JL. Localhost No.000523', 'JL. Server No.000523', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (525, 1, 'CUST220609.000524', 'Pelanggan 000524', 'PIC000524', 'pelanggan000524@localhost.com', '000524000524', '002008000524', 'JL. Localhost No.000524', 'JL. Server No.000524', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (526, 1, 'CUST220609.000525', 'Pelanggan 000525', 'PIC000525', 'pelanggan000525@localhost.com', '000525000525', '002008000525', 'JL. Localhost No.000525', 'JL. Server No.000525', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (527, 1, 'CUST220609.000526', 'Pelanggan 000526', 'PIC000526', 'pelanggan000526@localhost.com', '000526000526', '002008000526', 'JL. Localhost No.000526', 'JL. Server No.000526', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (528, 1, 'CUST220609.000527', 'Pelanggan 000527', 'PIC000527', 'pelanggan000527@localhost.com', '000527000527', '002008000527', 'JL. Localhost No.000527', 'JL. Server No.000527', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (529, 1, 'CUST220609.000528', 'Pelanggan 000528', 'PIC000528', 'pelanggan000528@localhost.com', '000528000528', '002008000528', 'JL. Localhost No.000528', 'JL. Server No.000528', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (530, 1, 'CUST220609.000529', 'Pelanggan 000529', 'PIC000529', 'pelanggan000529@localhost.com', '000529000529', '002008000529', 'JL. Localhost No.000529', 'JL. Server No.000529', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (531, 1, 'CUST220609.000530', 'Pelanggan 000530', 'PIC000530', 'pelanggan000530@localhost.com', '000530000530', '002008000530', 'JL. Localhost No.000530', 'JL. Server No.000530', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (532, 1, 'CUST220609.000531', 'Pelanggan 000531', 'PIC000531', 'pelanggan000531@localhost.com', '000531000531', '002008000531', 'JL. Localhost No.000531', 'JL. Server No.000531', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (533, 1, 'CUST220609.000532', 'Pelanggan 000532', 'PIC000532', 'pelanggan000532@localhost.com', '000532000532', '002008000532', 'JL. Localhost No.000532', 'JL. Server No.000532', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (534, 1, 'CUST220609.000533', 'Pelanggan 000533', 'PIC000533', 'pelanggan000533@localhost.com', '000533000533', '002008000533', 'JL. Localhost No.000533', 'JL. Server No.000533', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (535, 1, 'CUST220609.000534', 'Pelanggan 000534', 'PIC000534', 'pelanggan000534@localhost.com', '000534000534', '002008000534', 'JL. Localhost No.000534', 'JL. Server No.000534', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (536, 1, 'CUST220609.000535', 'Pelanggan 000535', 'PIC000535', 'pelanggan000535@localhost.com', '000535000535', '002008000535', 'JL. Localhost No.000535', 'JL. Server No.000535', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (537, 1, 'CUST220609.000536', 'Pelanggan 000536', 'PIC000536', 'pelanggan000536@localhost.com', '000536000536', '002008000536', 'JL. Localhost No.000536', 'JL. Server No.000536', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (538, 1, 'CUST220609.000537', 'Pelanggan 000537', 'PIC000537', 'pelanggan000537@localhost.com', '000537000537', '002008000537', 'JL. Localhost No.000537', 'JL. Server No.000537', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (539, 1, 'CUST220609.000538', 'Pelanggan 000538', 'PIC000538', 'pelanggan000538@localhost.com', '000538000538', '002008000538', 'JL. Localhost No.000538', 'JL. Server No.000538', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (540, 1, 'CUST220609.000539', 'Pelanggan 000539', 'PIC000539', 'pelanggan000539@localhost.com', '000539000539', '002008000539', 'JL. Localhost No.000539', 'JL. Server No.000539', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (541, 1, 'CUST220609.000540', 'Pelanggan 000540', 'PIC000540', 'pelanggan000540@localhost.com', '000540000540', '002008000540', 'JL. Localhost No.000540', 'JL. Server No.000540', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (542, 1, 'CUST220609.000541', 'Pelanggan 000541', 'PIC000541', 'pelanggan000541@localhost.com', '000541000541', '002008000541', 'JL. Localhost No.000541', 'JL. Server No.000541', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (543, 1, 'CUST220609.000542', 'Pelanggan 000542', 'PIC000542', 'pelanggan000542@localhost.com', '000542000542', '002008000542', 'JL. Localhost No.000542', 'JL. Server No.000542', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (544, 1, 'CUST220609.000543', 'Pelanggan 000543', 'PIC000543', 'pelanggan000543@localhost.com', '000543000543', '002008000543', 'JL. Localhost No.000543', 'JL. Server No.000543', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (545, 1, 'CUST220609.000544', 'Pelanggan 000544', 'PIC000544', 'pelanggan000544@localhost.com', '000544000544', '002008000544', 'JL. Localhost No.000544', 'JL. Server No.000544', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (546, 1, 'CUST220609.000545', 'Pelanggan 000545', 'PIC000545', 'pelanggan000545@localhost.com', '000545000545', '002008000545', 'JL. Localhost No.000545', 'JL. Server No.000545', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (547, 1, 'CUST220609.000546', 'Pelanggan 000546', 'PIC000546', 'pelanggan000546@localhost.com', '000546000546', '002008000546', 'JL. Localhost No.000546', 'JL. Server No.000546', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (548, 1, 'CUST220609.000547', 'Pelanggan 000547', 'PIC000547', 'pelanggan000547@localhost.com', '000547000547', '002008000547', 'JL. Localhost No.000547', 'JL. Server No.000547', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (549, 1, 'CUST220609.000548', 'Pelanggan 000548', 'PIC000548', 'pelanggan000548@localhost.com', '000548000548', '002008000548', 'JL. Localhost No.000548', 'JL. Server No.000548', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (550, 1, 'CUST220609.000549', 'Pelanggan 000549', 'PIC000549', 'pelanggan000549@localhost.com', '000549000549', '002008000549', 'JL. Localhost No.000549', 'JL. Server No.000549', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (551, 1, 'CUST220609.000550', 'Pelanggan 000550', 'PIC000550', 'pelanggan000550@localhost.com', '000550000550', '002008000550', 'JL. Localhost No.000550', 'JL. Server No.000550', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (552, 1, 'CUST220609.000551', 'Pelanggan 000551', 'PIC000551', 'pelanggan000551@localhost.com', '000551000551', '002008000551', 'JL. Localhost No.000551', 'JL. Server No.000551', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (553, 1, 'CUST220609.000552', 'Pelanggan 000552', 'PIC000552', 'pelanggan000552@localhost.com', '000552000552', '002008000552', 'JL. Localhost No.000552', 'JL. Server No.000552', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (554, 1, 'CUST220609.000553', 'Pelanggan 000553', 'PIC000553', 'pelanggan000553@localhost.com', '000553000553', '002008000553', 'JL. Localhost No.000553', 'JL. Server No.000553', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (555, 1, 'CUST220609.000554', 'Pelanggan 000554', 'PIC000554', 'pelanggan000554@localhost.com', '000554000554', '002008000554', 'JL. Localhost No.000554', 'JL. Server No.000554', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (556, 1, 'CUST220609.000555', 'Pelanggan 000555', 'PIC000555', 'pelanggan000555@localhost.com', '000555000555', '002008000555', 'JL. Localhost No.000555', 'JL. Server No.000555', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (557, 1, 'CUST220609.000556', 'Pelanggan 000556', 'PIC000556', 'pelanggan000556@localhost.com', '000556000556', '002008000556', 'JL. Localhost No.000556', 'JL. Server No.000556', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (558, 1, 'CUST220609.000557', 'Pelanggan 000557', 'PIC000557', 'pelanggan000557@localhost.com', '000557000557', '002008000557', 'JL. Localhost No.000557', 'JL. Server No.000557', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (559, 1, 'CUST220609.000558', 'Pelanggan 000558', 'PIC000558', 'pelanggan000558@localhost.com', '000558000558', '002008000558', 'JL. Localhost No.000558', 'JL. Server No.000558', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (560, 1, 'CUST220609.000559', 'Pelanggan 000559', 'PIC000559', 'pelanggan000559@localhost.com', '000559000559', '002008000559', 'JL. Localhost No.000559', 'JL. Server No.000559', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (561, 1, 'CUST220609.000560', 'Pelanggan 000560', 'PIC000560', 'pelanggan000560@localhost.com', '000560000560', '002008000560', 'JL. Localhost No.000560', 'JL. Server No.000560', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (562, 1, 'CUST220609.000561', 'Pelanggan 000561', 'PIC000561', 'pelanggan000561@localhost.com', '000561000561', '002008000561', 'JL. Localhost No.000561', 'JL. Server No.000561', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (563, 1, 'CUST220609.000562', 'Pelanggan 000562', 'PIC000562', 'pelanggan000562@localhost.com', '000562000562', '002008000562', 'JL. Localhost No.000562', 'JL. Server No.000562', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (564, 1, 'CUST220609.000563', 'Pelanggan 000563', 'PIC000563', 'pelanggan000563@localhost.com', '000563000563', '002008000563', 'JL. Localhost No.000563', 'JL. Server No.000563', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (565, 1, 'CUST220609.000564', 'Pelanggan 000564', 'PIC000564', 'pelanggan000564@localhost.com', '000564000564', '002008000564', 'JL. Localhost No.000564', 'JL. Server No.000564', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (566, 1, 'CUST220609.000565', 'Pelanggan 000565', 'PIC000565', 'pelanggan000565@localhost.com', '000565000565', '002008000565', 'JL. Localhost No.000565', 'JL. Server No.000565', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (567, 1, 'CUST220609.000566', 'Pelanggan 000566', 'PIC000566', 'pelanggan000566@localhost.com', '000566000566', '002008000566', 'JL. Localhost No.000566', 'JL. Server No.000566', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (568, 1, 'CUST220609.000567', 'Pelanggan 000567', 'PIC000567', 'pelanggan000567@localhost.com', '000567000567', '002008000567', 'JL. Localhost No.000567', 'JL. Server No.000567', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (569, 1, 'CUST220609.000568', 'Pelanggan 000568', 'PIC000568', 'pelanggan000568@localhost.com', '000568000568', '002008000568', 'JL. Localhost No.000568', 'JL. Server No.000568', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (570, 1, 'CUST220609.000569', 'Pelanggan 000569', 'PIC000569', 'pelanggan000569@localhost.com', '000569000569', '002008000569', 'JL. Localhost No.000569', 'JL. Server No.000569', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (571, 1, 'CUST220609.000570', 'Pelanggan 000570', 'PIC000570', 'pelanggan000570@localhost.com', '000570000570', '002008000570', 'JL. Localhost No.000570', 'JL. Server No.000570', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (572, 1, 'CUST220609.000571', 'Pelanggan 000571', 'PIC000571', 'pelanggan000571@localhost.com', '000571000571', '002008000571', 'JL. Localhost No.000571', 'JL. Server No.000571', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (573, 1, 'CUST220609.000572', 'Pelanggan 000572', 'PIC000572', 'pelanggan000572@localhost.com', '000572000572', '002008000572', 'JL. Localhost No.000572', 'JL. Server No.000572', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (574, 1, 'CUST220609.000573', 'Pelanggan 000573', 'PIC000573', 'pelanggan000573@localhost.com', '000573000573', '002008000573', 'JL. Localhost No.000573', 'JL. Server No.000573', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (575, 1, 'CUST220609.000574', 'Pelanggan 000574', 'PIC000574', 'pelanggan000574@localhost.com', '000574000574', '002008000574', 'JL. Localhost No.000574', 'JL. Server No.000574', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (576, 1, 'CUST220609.000575', 'Pelanggan 000575', 'PIC000575', 'pelanggan000575@localhost.com', '000575000575', '002008000575', 'JL. Localhost No.000575', 'JL. Server No.000575', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (577, 1, 'CUST220609.000576', 'Pelanggan 000576', 'PIC000576', 'pelanggan000576@localhost.com', '000576000576', '002008000576', 'JL. Localhost No.000576', 'JL. Server No.000576', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (578, 1, 'CUST220609.000577', 'Pelanggan 000577', 'PIC000577', 'pelanggan000577@localhost.com', '000577000577', '002008000577', 'JL. Localhost No.000577', 'JL. Server No.000577', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (579, 1, 'CUST220609.000578', 'Pelanggan 000578', 'PIC000578', 'pelanggan000578@localhost.com', '000578000578', '002008000578', 'JL. Localhost No.000578', 'JL. Server No.000578', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (580, 1, 'CUST220609.000579', 'Pelanggan 000579', 'PIC000579', 'pelanggan000579@localhost.com', '000579000579', '002008000579', 'JL. Localhost No.000579', 'JL. Server No.000579', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (581, 1, 'CUST220609.000580', 'Pelanggan 000580', 'PIC000580', 'pelanggan000580@localhost.com', '000580000580', '002008000580', 'JL. Localhost No.000580', 'JL. Server No.000580', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (582, 1, 'CUST220609.000581', 'Pelanggan 000581', 'PIC000581', 'pelanggan000581@localhost.com', '000581000581', '002008000581', 'JL. Localhost No.000581', 'JL. Server No.000581', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (583, 1, 'CUST220609.000582', 'Pelanggan 000582', 'PIC000582', 'pelanggan000582@localhost.com', '000582000582', '002008000582', 'JL. Localhost No.000582', 'JL. Server No.000582', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (584, 1, 'CUST220609.000583', 'Pelanggan 000583', 'PIC000583', 'pelanggan000583@localhost.com', '000583000583', '002008000583', 'JL. Localhost No.000583', 'JL. Server No.000583', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (585, 1, 'CUST220609.000584', 'Pelanggan 000584', 'PIC000584', 'pelanggan000584@localhost.com', '000584000584', '002008000584', 'JL. Localhost No.000584', 'JL. Server No.000584', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (586, 1, 'CUST220609.000585', 'Pelanggan 000585', 'PIC000585', 'pelanggan000585@localhost.com', '000585000585', '002008000585', 'JL. Localhost No.000585', 'JL. Server No.000585', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (587, 1, 'CUST220609.000586', 'Pelanggan 000586', 'PIC000586', 'pelanggan000586@localhost.com', '000586000586', '002008000586', 'JL. Localhost No.000586', 'JL. Server No.000586', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (588, 1, 'CUST220609.000587', 'Pelanggan 000587', 'PIC000587', 'pelanggan000587@localhost.com', '000587000587', '002008000587', 'JL. Localhost No.000587', 'JL. Server No.000587', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (589, 1, 'CUST220609.000588', 'Pelanggan 000588', 'PIC000588', 'pelanggan000588@localhost.com', '000588000588', '002008000588', 'JL. Localhost No.000588', 'JL. Server No.000588', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (590, 1, 'CUST220609.000589', 'Pelanggan 000589', 'PIC000589', 'pelanggan000589@localhost.com', '000589000589', '002008000589', 'JL. Localhost No.000589', 'JL. Server No.000589', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (591, 1, 'CUST220609.000590', 'Pelanggan 000590', 'PIC000590', 'pelanggan000590@localhost.com', '000590000590', '002008000590', 'JL. Localhost No.000590', 'JL. Server No.000590', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (592, 1, 'CUST220609.000591', 'Pelanggan 000591', 'PIC000591', 'pelanggan000591@localhost.com', '000591000591', '002008000591', 'JL. Localhost No.000591', 'JL. Server No.000591', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (593, 1, 'CUST220609.000592', 'Pelanggan 000592', 'PIC000592', 'pelanggan000592@localhost.com', '000592000592', '002008000592', 'JL. Localhost No.000592', 'JL. Server No.000592', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (594, 1, 'CUST220609.000593', 'Pelanggan 000593', 'PIC000593', 'pelanggan000593@localhost.com', '000593000593', '002008000593', 'JL. Localhost No.000593', 'JL. Server No.000593', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (595, 1, 'CUST220609.000594', 'Pelanggan 000594', 'PIC000594', 'pelanggan000594@localhost.com', '000594000594', '002008000594', 'JL. Localhost No.000594', 'JL. Server No.000594', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (596, 1, 'CUST220609.000595', 'Pelanggan 000595', 'PIC000595', 'pelanggan000595@localhost.com', '000595000595', '002008000595', 'JL. Localhost No.000595', 'JL. Server No.000595', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (597, 1, 'CUST220609.000596', 'Pelanggan 000596', 'PIC000596', 'pelanggan000596@localhost.com', '000596000596', '002008000596', 'JL. Localhost No.000596', 'JL. Server No.000596', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (598, 1, 'CUST220609.000597', 'Pelanggan 000597', 'PIC000597', 'pelanggan000597@localhost.com', '000597000597', '002008000597', 'JL. Localhost No.000597', 'JL. Server No.000597', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (599, 1, 'CUST220609.000598', 'Pelanggan 000598', 'PIC000598', 'pelanggan000598@localhost.com', '000598000598', '002008000598', 'JL. Localhost No.000598', 'JL. Server No.000598', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (600, 1, 'CUST220609.000599', 'Pelanggan 000599', 'PIC000599', 'pelanggan000599@localhost.com', '000599000599', '002008000599', 'JL. Localhost No.000599', 'JL. Server No.000599', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (601, 1, 'CUST220609.000600', 'Pelanggan 000600', 'PIC000600', 'pelanggan000600@localhost.com', '000600000600', '002008000600', 'JL. Localhost No.000600', 'JL. Server No.000600', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (602, 1, 'CUST220609.000601', 'Pelanggan 000601', 'PIC000601', 'pelanggan000601@localhost.com', '000601000601', '002008000601', 'JL. Localhost No.000601', 'JL. Server No.000601', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (603, 1, 'CUST220609.000602', 'Pelanggan 000602', 'PIC000602', 'pelanggan000602@localhost.com', '000602000602', '002008000602', 'JL. Localhost No.000602', 'JL. Server No.000602', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (604, 1, 'CUST220609.000603', 'Pelanggan 000603', 'PIC000603', 'pelanggan000603@localhost.com', '000603000603', '002008000603', 'JL. Localhost No.000603', 'JL. Server No.000603', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (605, 1, 'CUST220609.000604', 'Pelanggan 000604', 'PIC000604', 'pelanggan000604@localhost.com', '000604000604', '002008000604', 'JL. Localhost No.000604', 'JL. Server No.000604', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (606, 1, 'CUST220609.000605', 'Pelanggan 000605', 'PIC000605', 'pelanggan000605@localhost.com', '000605000605', '002008000605', 'JL. Localhost No.000605', 'JL. Server No.000605', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (607, 1, 'CUST220609.000606', 'Pelanggan 000606', 'PIC000606', 'pelanggan000606@localhost.com', '000606000606', '002008000606', 'JL. Localhost No.000606', 'JL. Server No.000606', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (608, 1, 'CUST220609.000607', 'Pelanggan 000607', 'PIC000607', 'pelanggan000607@localhost.com', '000607000607', '002008000607', 'JL. Localhost No.000607', 'JL. Server No.000607', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (609, 1, 'CUST220609.000608', 'Pelanggan 000608', 'PIC000608', 'pelanggan000608@localhost.com', '000608000608', '002008000608', 'JL. Localhost No.000608', 'JL. Server No.000608', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (610, 1, 'CUST220609.000609', 'Pelanggan 000609', 'PIC000609', 'pelanggan000609@localhost.com', '000609000609', '002008000609', 'JL. Localhost No.000609', 'JL. Server No.000609', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (611, 1, 'CUST220609.000610', 'Pelanggan 000610', 'PIC000610', 'pelanggan000610@localhost.com', '000610000610', '002008000610', 'JL. Localhost No.000610', 'JL. Server No.000610', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (612, 1, 'CUST220609.000611', 'Pelanggan 000611', 'PIC000611', 'pelanggan000611@localhost.com', '000611000611', '002008000611', 'JL. Localhost No.000611', 'JL. Server No.000611', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (613, 1, 'CUST220609.000612', 'Pelanggan 000612', 'PIC000612', 'pelanggan000612@localhost.com', '000612000612', '002008000612', 'JL. Localhost No.000612', 'JL. Server No.000612', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (614, 1, 'CUST220609.000613', 'Pelanggan 000613', 'PIC000613', 'pelanggan000613@localhost.com', '000613000613', '002008000613', 'JL. Localhost No.000613', 'JL. Server No.000613', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (615, 1, 'CUST220609.000614', 'Pelanggan 000614', 'PIC000614', 'pelanggan000614@localhost.com', '000614000614', '002008000614', 'JL. Localhost No.000614', 'JL. Server No.000614', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (616, 1, 'CUST220609.000615', 'Pelanggan 000615', 'PIC000615', 'pelanggan000615@localhost.com', '000615000615', '002008000615', 'JL. Localhost No.000615', 'JL. Server No.000615', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (617, 1, 'CUST220609.000616', 'Pelanggan 000616', 'PIC000616', 'pelanggan000616@localhost.com', '000616000616', '002008000616', 'JL. Localhost No.000616', 'JL. Server No.000616', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (618, 1, 'CUST220609.000617', 'Pelanggan 000617', 'PIC000617', 'pelanggan000617@localhost.com', '000617000617', '002008000617', 'JL. Localhost No.000617', 'JL. Server No.000617', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (619, 1, 'CUST220609.000618', 'Pelanggan 000618', 'PIC000618', 'pelanggan000618@localhost.com', '000618000618', '002008000618', 'JL. Localhost No.000618', 'JL. Server No.000618', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (620, 1, 'CUST220609.000619', 'Pelanggan 000619', 'PIC000619', 'pelanggan000619@localhost.com', '000619000619', '002008000619', 'JL. Localhost No.000619', 'JL. Server No.000619', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (621, 1, 'CUST220609.000620', 'Pelanggan 000620', 'PIC000620', 'pelanggan000620@localhost.com', '000620000620', '002008000620', 'JL. Localhost No.000620', 'JL. Server No.000620', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (622, 1, 'CUST220609.000621', 'Pelanggan 000621', 'PIC000621', 'pelanggan000621@localhost.com', '000621000621', '002008000621', 'JL. Localhost No.000621', 'JL. Server No.000621', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (623, 1, 'CUST220609.000622', 'Pelanggan 000622', 'PIC000622', 'pelanggan000622@localhost.com', '000622000622', '002008000622', 'JL. Localhost No.000622', 'JL. Server No.000622', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (624, 1, 'CUST220609.000623', 'Pelanggan 000623', 'PIC000623', 'pelanggan000623@localhost.com', '000623000623', '002008000623', 'JL. Localhost No.000623', 'JL. Server No.000623', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (625, 1, 'CUST220609.000624', 'Pelanggan 000624', 'PIC000624', 'pelanggan000624@localhost.com', '000624000624', '002008000624', 'JL. Localhost No.000624', 'JL. Server No.000624', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (626, 1, 'CUST220609.000625', 'Pelanggan 000625', 'PIC000625', 'pelanggan000625@localhost.com', '000625000625', '002008000625', 'JL. Localhost No.000625', 'JL. Server No.000625', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (627, 1, 'CUST220609.000626', 'Pelanggan 000626', 'PIC000626', 'pelanggan000626@localhost.com', '000626000626', '002008000626', 'JL. Localhost No.000626', 'JL. Server No.000626', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (628, 1, 'CUST220609.000627', 'Pelanggan 000627', 'PIC000627', 'pelanggan000627@localhost.com', '000627000627', '002008000627', 'JL. Localhost No.000627', 'JL. Server No.000627', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (629, 1, 'CUST220609.000628', 'Pelanggan 000628', 'PIC000628', 'pelanggan000628@localhost.com', '000628000628', '002008000628', 'JL. Localhost No.000628', 'JL. Server No.000628', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (630, 1, 'CUST220609.000629', 'Pelanggan 000629', 'PIC000629', 'pelanggan000629@localhost.com', '000629000629', '002008000629', 'JL. Localhost No.000629', 'JL. Server No.000629', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (631, 1, 'CUST220609.000630', 'Pelanggan 000630', 'PIC000630', 'pelanggan000630@localhost.com', '000630000630', '002008000630', 'JL. Localhost No.000630', 'JL. Server No.000630', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (632, 1, 'CUST220609.000631', 'Pelanggan 000631', 'PIC000631', 'pelanggan000631@localhost.com', '000631000631', '002008000631', 'JL. Localhost No.000631', 'JL. Server No.000631', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (633, 1, 'CUST220609.000632', 'Pelanggan 000632', 'PIC000632', 'pelanggan000632@localhost.com', '000632000632', '002008000632', 'JL. Localhost No.000632', 'JL. Server No.000632', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (634, 1, 'CUST220609.000633', 'Pelanggan 000633', 'PIC000633', 'pelanggan000633@localhost.com', '000633000633', '002008000633', 'JL. Localhost No.000633', 'JL. Server No.000633', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (635, 1, 'CUST220609.000634', 'Pelanggan 000634', 'PIC000634', 'pelanggan000634@localhost.com', '000634000634', '002008000634', 'JL. Localhost No.000634', 'JL. Server No.000634', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (636, 1, 'CUST220609.000635', 'Pelanggan 000635', 'PIC000635', 'pelanggan000635@localhost.com', '000635000635', '002008000635', 'JL. Localhost No.000635', 'JL. Server No.000635', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (637, 1, 'CUST220609.000636', 'Pelanggan 000636', 'PIC000636', 'pelanggan000636@localhost.com', '000636000636', '002008000636', 'JL. Localhost No.000636', 'JL. Server No.000636', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (638, 1, 'CUST220609.000637', 'Pelanggan 000637', 'PIC000637', 'pelanggan000637@localhost.com', '000637000637', '002008000637', 'JL. Localhost No.000637', 'JL. Server No.000637', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (639, 1, 'CUST220609.000638', 'Pelanggan 000638', 'PIC000638', 'pelanggan000638@localhost.com', '000638000638', '002008000638', 'JL. Localhost No.000638', 'JL. Server No.000638', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (640, 1, 'CUST220609.000639', 'Pelanggan 000639', 'PIC000639', 'pelanggan000639@localhost.com', '000639000639', '002008000639', 'JL. Localhost No.000639', 'JL. Server No.000639', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (641, 1, 'CUST220609.000640', 'Pelanggan 000640', 'PIC000640', 'pelanggan000640@localhost.com', '000640000640', '002008000640', 'JL. Localhost No.000640', 'JL. Server No.000640', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (642, 1, 'CUST220609.000641', 'Pelanggan 000641', 'PIC000641', 'pelanggan000641@localhost.com', '000641000641', '002008000641', 'JL. Localhost No.000641', 'JL. Server No.000641', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (643, 1, 'CUST220609.000642', 'Pelanggan 000642', 'PIC000642', 'pelanggan000642@localhost.com', '000642000642', '002008000642', 'JL. Localhost No.000642', 'JL. Server No.000642', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (644, 1, 'CUST220609.000643', 'Pelanggan 000643', 'PIC000643', 'pelanggan000643@localhost.com', '000643000643', '002008000643', 'JL. Localhost No.000643', 'JL. Server No.000643', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (645, 1, 'CUST220609.000644', 'Pelanggan 000644', 'PIC000644', 'pelanggan000644@localhost.com', '000644000644', '002008000644', 'JL. Localhost No.000644', 'JL. Server No.000644', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (646, 1, 'CUST220609.000645', 'Pelanggan 000645', 'PIC000645', 'pelanggan000645@localhost.com', '000645000645', '002008000645', 'JL. Localhost No.000645', 'JL. Server No.000645', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (647, 1, 'CUST220609.000646', 'Pelanggan 000646', 'PIC000646', 'pelanggan000646@localhost.com', '000646000646', '002008000646', 'JL. Localhost No.000646', 'JL. Server No.000646', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (648, 1, 'CUST220609.000647', 'Pelanggan 000647', 'PIC000647', 'pelanggan000647@localhost.com', '000647000647', '002008000647', 'JL. Localhost No.000647', 'JL. Server No.000647', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (649, 1, 'CUST220609.000648', 'Pelanggan 000648', 'PIC000648', 'pelanggan000648@localhost.com', '000648000648', '002008000648', 'JL. Localhost No.000648', 'JL. Server No.000648', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (650, 1, 'CUST220609.000649', 'Pelanggan 000649', 'PIC000649', 'pelanggan000649@localhost.com', '000649000649', '002008000649', 'JL. Localhost No.000649', 'JL. Server No.000649', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (651, 1, 'CUST220609.000650', 'Pelanggan 000650', 'PIC000650', 'pelanggan000650@localhost.com', '000650000650', '002008000650', 'JL. Localhost No.000650', 'JL. Server No.000650', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (652, 1, 'CUST220609.000651', 'Pelanggan 000651', 'PIC000651', 'pelanggan000651@localhost.com', '000651000651', '002008000651', 'JL. Localhost No.000651', 'JL. Server No.000651', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (653, 1, 'CUST220609.000652', 'Pelanggan 000652', 'PIC000652', 'pelanggan000652@localhost.com', '000652000652', '002008000652', 'JL. Localhost No.000652', 'JL. Server No.000652', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (654, 1, 'CUST220609.000653', 'Pelanggan 000653', 'PIC000653', 'pelanggan000653@localhost.com', '000653000653', '002008000653', 'JL. Localhost No.000653', 'JL. Server No.000653', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (655, 1, 'CUST220609.000654', 'Pelanggan 000654', 'PIC000654', 'pelanggan000654@localhost.com', '000654000654', '002008000654', 'JL. Localhost No.000654', 'JL. Server No.000654', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (656, 1, 'CUST220609.000655', 'Pelanggan 000655', 'PIC000655', 'pelanggan000655@localhost.com', '000655000655', '002008000655', 'JL. Localhost No.000655', 'JL. Server No.000655', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (657, 1, 'CUST220609.000656', 'Pelanggan 000656', 'PIC000656', 'pelanggan000656@localhost.com', '000656000656', '002008000656', 'JL. Localhost No.000656', 'JL. Server No.000656', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (658, 1, 'CUST220609.000657', 'Pelanggan 000657', 'PIC000657', 'pelanggan000657@localhost.com', '000657000657', '002008000657', 'JL. Localhost No.000657', 'JL. Server No.000657', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (659, 1, 'CUST220609.000658', 'Pelanggan 000658', 'PIC000658', 'pelanggan000658@localhost.com', '000658000658', '002008000658', 'JL. Localhost No.000658', 'JL. Server No.000658', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (660, 1, 'CUST220609.000659', 'Pelanggan 000659', 'PIC000659', 'pelanggan000659@localhost.com', '000659000659', '002008000659', 'JL. Localhost No.000659', 'JL. Server No.000659', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (661, 1, 'CUST220609.000660', 'Pelanggan 000660', 'PIC000660', 'pelanggan000660@localhost.com', '000660000660', '002008000660', 'JL. Localhost No.000660', 'JL. Server No.000660', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (662, 1, 'CUST220609.000661', 'Pelanggan 000661', 'PIC000661', 'pelanggan000661@localhost.com', '000661000661', '002008000661', 'JL. Localhost No.000661', 'JL. Server No.000661', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (663, 1, 'CUST220609.000662', 'Pelanggan 000662', 'PIC000662', 'pelanggan000662@localhost.com', '000662000662', '002008000662', 'JL. Localhost No.000662', 'JL. Server No.000662', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (664, 1, 'CUST220609.000663', 'Pelanggan 000663', 'PIC000663', 'pelanggan000663@localhost.com', '000663000663', '002008000663', 'JL. Localhost No.000663', 'JL. Server No.000663', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (665, 1, 'CUST220609.000664', 'Pelanggan 000664', 'PIC000664', 'pelanggan000664@localhost.com', '000664000664', '002008000664', 'JL. Localhost No.000664', 'JL. Server No.000664', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (666, 1, 'CUST220609.000665', 'Pelanggan 000665', 'PIC000665', 'pelanggan000665@localhost.com', '000665000665', '002008000665', 'JL. Localhost No.000665', 'JL. Server No.000665', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (667, 1, 'CUST220609.000666', 'Pelanggan 000666', 'PIC000666', 'pelanggan000666@localhost.com', '000666000666', '002008000666', 'JL. Localhost No.000666', 'JL. Server No.000666', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (668, 1, 'CUST220609.000667', 'Pelanggan 000667', 'PIC000667', 'pelanggan000667@localhost.com', '000667000667', '002008000667', 'JL. Localhost No.000667', 'JL. Server No.000667', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (669, 1, 'CUST220609.000668', 'Pelanggan 000668', 'PIC000668', 'pelanggan000668@localhost.com', '000668000668', '002008000668', 'JL. Localhost No.000668', 'JL. Server No.000668', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (670, 1, 'CUST220609.000669', 'Pelanggan 000669', 'PIC000669', 'pelanggan000669@localhost.com', '000669000669', '002008000669', 'JL. Localhost No.000669', 'JL. Server No.000669', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (671, 1, 'CUST220609.000670', 'Pelanggan 000670', 'PIC000670', 'pelanggan000670@localhost.com', '000670000670', '002008000670', 'JL. Localhost No.000670', 'JL. Server No.000670', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (672, 1, 'CUST220609.000671', 'Pelanggan 000671', 'PIC000671', 'pelanggan000671@localhost.com', '000671000671', '002008000671', 'JL. Localhost No.000671', 'JL. Server No.000671', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (673, 1, 'CUST220609.000672', 'Pelanggan 000672', 'PIC000672', 'pelanggan000672@localhost.com', '000672000672', '002008000672', 'JL. Localhost No.000672', 'JL. Server No.000672', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (674, 1, 'CUST220609.000673', 'Pelanggan 000673', 'PIC000673', 'pelanggan000673@localhost.com', '000673000673', '002008000673', 'JL. Localhost No.000673', 'JL. Server No.000673', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (675, 1, 'CUST220609.000674', 'Pelanggan 000674', 'PIC000674', 'pelanggan000674@localhost.com', '000674000674', '002008000674', 'JL. Localhost No.000674', 'JL. Server No.000674', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (676, 1, 'CUST220609.000675', 'Pelanggan 000675', 'PIC000675', 'pelanggan000675@localhost.com', '000675000675', '002008000675', 'JL. Localhost No.000675', 'JL. Server No.000675', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (677, 1, 'CUST220609.000676', 'Pelanggan 000676', 'PIC000676', 'pelanggan000676@localhost.com', '000676000676', '002008000676', 'JL. Localhost No.000676', 'JL. Server No.000676', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (678, 1, 'CUST220609.000677', 'Pelanggan 000677', 'PIC000677', 'pelanggan000677@localhost.com', '000677000677', '002008000677', 'JL. Localhost No.000677', 'JL. Server No.000677', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (679, 1, 'CUST220609.000678', 'Pelanggan 000678', 'PIC000678', 'pelanggan000678@localhost.com', '000678000678', '002008000678', 'JL. Localhost No.000678', 'JL. Server No.000678', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (680, 1, 'CUST220609.000679', 'Pelanggan 000679', 'PIC000679', 'pelanggan000679@localhost.com', '000679000679', '002008000679', 'JL. Localhost No.000679', 'JL. Server No.000679', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (681, 1, 'CUST220609.000680', 'Pelanggan 000680', 'PIC000680', 'pelanggan000680@localhost.com', '000680000680', '002008000680', 'JL. Localhost No.000680', 'JL. Server No.000680', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (682, 1, 'CUST220609.000681', 'Pelanggan 000681', 'PIC000681', 'pelanggan000681@localhost.com', '000681000681', '002008000681', 'JL. Localhost No.000681', 'JL. Server No.000681', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (683, 1, 'CUST220609.000682', 'Pelanggan 000682', 'PIC000682', 'pelanggan000682@localhost.com', '000682000682', '002008000682', 'JL. Localhost No.000682', 'JL. Server No.000682', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (684, 1, 'CUST220609.000683', 'Pelanggan 000683', 'PIC000683', 'pelanggan000683@localhost.com', '000683000683', '002008000683', 'JL. Localhost No.000683', 'JL. Server No.000683', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (685, 1, 'CUST220609.000684', 'Pelanggan 000684', 'PIC000684', 'pelanggan000684@localhost.com', '000684000684', '002008000684', 'JL. Localhost No.000684', 'JL. Server No.000684', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (686, 1, 'CUST220609.000685', 'Pelanggan 000685', 'PIC000685', 'pelanggan000685@localhost.com', '000685000685', '002008000685', 'JL. Localhost No.000685', 'JL. Server No.000685', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (687, 1, 'CUST220609.000686', 'Pelanggan 000686', 'PIC000686', 'pelanggan000686@localhost.com', '000686000686', '002008000686', 'JL. Localhost No.000686', 'JL. Server No.000686', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (688, 1, 'CUST220609.000687', 'Pelanggan 000687', 'PIC000687', 'pelanggan000687@localhost.com', '000687000687', '002008000687', 'JL. Localhost No.000687', 'JL. Server No.000687', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (689, 1, 'CUST220609.000688', 'Pelanggan 000688', 'PIC000688', 'pelanggan000688@localhost.com', '000688000688', '002008000688', 'JL. Localhost No.000688', 'JL. Server No.000688', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (690, 1, 'CUST220609.000689', 'Pelanggan 000689', 'PIC000689', 'pelanggan000689@localhost.com', '000689000689', '002008000689', 'JL. Localhost No.000689', 'JL. Server No.000689', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (691, 1, 'CUST220609.000690', 'Pelanggan 000690', 'PIC000690', 'pelanggan000690@localhost.com', '000690000690', '002008000690', 'JL. Localhost No.000690', 'JL. Server No.000690', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (692, 1, 'CUST220609.000691', 'Pelanggan 000691', 'PIC000691', 'pelanggan000691@localhost.com', '000691000691', '002008000691', 'JL. Localhost No.000691', 'JL. Server No.000691', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (693, 1, 'CUST220609.000692', 'Pelanggan 000692', 'PIC000692', 'pelanggan000692@localhost.com', '000692000692', '002008000692', 'JL. Localhost No.000692', 'JL. Server No.000692', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (694, 1, 'CUST220609.000693', 'Pelanggan 000693', 'PIC000693', 'pelanggan000693@localhost.com', '000693000693', '002008000693', 'JL. Localhost No.000693', 'JL. Server No.000693', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (695, 1, 'CUST220609.000694', 'Pelanggan 000694', 'PIC000694', 'pelanggan000694@localhost.com', '000694000694', '002008000694', 'JL. Localhost No.000694', 'JL. Server No.000694', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (696, 1, 'CUST220609.000695', 'Pelanggan 000695', 'PIC000695', 'pelanggan000695@localhost.com', '000695000695', '002008000695', 'JL. Localhost No.000695', 'JL. Server No.000695', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (697, 1, 'CUST220609.000696', 'Pelanggan 000696', 'PIC000696', 'pelanggan000696@localhost.com', '000696000696', '002008000696', 'JL. Localhost No.000696', 'JL. Server No.000696', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (698, 1, 'CUST220609.000697', 'Pelanggan 000697', 'PIC000697', 'pelanggan000697@localhost.com', '000697000697', '002008000697', 'JL. Localhost No.000697', 'JL. Server No.000697', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (699, 1, 'CUST220609.000698', 'Pelanggan 000698', 'PIC000698', 'pelanggan000698@localhost.com', '000698000698', '002008000698', 'JL. Localhost No.000698', 'JL. Server No.000698', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (700, 1, 'CUST220609.000699', 'Pelanggan 000699', 'PIC000699', 'pelanggan000699@localhost.com', '000699000699', '002008000699', 'JL. Localhost No.000699', 'JL. Server No.000699', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (701, 1, 'CUST220609.000700', 'Pelanggan 000700', 'PIC000700', 'pelanggan000700@localhost.com', '000700000700', '002008000700', 'JL. Localhost No.000700', 'JL. Server No.000700', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (702, 1, 'CUST220609.000701', 'Pelanggan 000701', 'PIC000701', 'pelanggan000701@localhost.com', '000701000701', '002008000701', 'JL. Localhost No.000701', 'JL. Server No.000701', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (703, 1, 'CUST220609.000702', 'Pelanggan 000702', 'PIC000702', 'pelanggan000702@localhost.com', '000702000702', '002008000702', 'JL. Localhost No.000702', 'JL. Server No.000702', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (704, 1, 'CUST220609.000703', 'Pelanggan 000703', 'PIC000703', 'pelanggan000703@localhost.com', '000703000703', '002008000703', 'JL. Localhost No.000703', 'JL. Server No.000703', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (705, 1, 'CUST220609.000704', 'Pelanggan 000704', 'PIC000704', 'pelanggan000704@localhost.com', '000704000704', '002008000704', 'JL. Localhost No.000704', 'JL. Server No.000704', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (706, 1, 'CUST220609.000705', 'Pelanggan 000705', 'PIC000705', 'pelanggan000705@localhost.com', '000705000705', '002008000705', 'JL. Localhost No.000705', 'JL. Server No.000705', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (707, 1, 'CUST220609.000706', 'Pelanggan 000706', 'PIC000706', 'pelanggan000706@localhost.com', '000706000706', '002008000706', 'JL. Localhost No.000706', 'JL. Server No.000706', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (708, 1, 'CUST220609.000707', 'Pelanggan 000707', 'PIC000707', 'pelanggan000707@localhost.com', '000707000707', '002008000707', 'JL. Localhost No.000707', 'JL. Server No.000707', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (709, 1, 'CUST220609.000708', 'Pelanggan 000708', 'PIC000708', 'pelanggan000708@localhost.com', '000708000708', '002008000708', 'JL. Localhost No.000708', 'JL. Server No.000708', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (710, 1, 'CUST220609.000709', 'Pelanggan 000709', 'PIC000709', 'pelanggan000709@localhost.com', '000709000709', '002008000709', 'JL. Localhost No.000709', 'JL. Server No.000709', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (711, 1, 'CUST220609.000710', 'Pelanggan 000710', 'PIC000710', 'pelanggan000710@localhost.com', '000710000710', '002008000710', 'JL. Localhost No.000710', 'JL. Server No.000710', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (712, 1, 'CUST220609.000711', 'Pelanggan 000711', 'PIC000711', 'pelanggan000711@localhost.com', '000711000711', '002008000711', 'JL. Localhost No.000711', 'JL. Server No.000711', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (713, 1, 'CUST220609.000712', 'Pelanggan 000712', 'PIC000712', 'pelanggan000712@localhost.com', '000712000712', '002008000712', 'JL. Localhost No.000712', 'JL. Server No.000712', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (714, 1, 'CUST220609.000713', 'Pelanggan 000713', 'PIC000713', 'pelanggan000713@localhost.com', '000713000713', '002008000713', 'JL. Localhost No.000713', 'JL. Server No.000713', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (715, 1, 'CUST220609.000714', 'Pelanggan 000714', 'PIC000714', 'pelanggan000714@localhost.com', '000714000714', '002008000714', 'JL. Localhost No.000714', 'JL. Server No.000714', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (716, 1, 'CUST220609.000715', 'Pelanggan 000715', 'PIC000715', 'pelanggan000715@localhost.com', '000715000715', '002008000715', 'JL. Localhost No.000715', 'JL. Server No.000715', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (717, 1, 'CUST220609.000716', 'Pelanggan 000716', 'PIC000716', 'pelanggan000716@localhost.com', '000716000716', '002008000716', 'JL. Localhost No.000716', 'JL. Server No.000716', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (718, 1, 'CUST220609.000717', 'Pelanggan 000717', 'PIC000717', 'pelanggan000717@localhost.com', '000717000717', '002008000717', 'JL. Localhost No.000717', 'JL. Server No.000717', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (719, 1, 'CUST220609.000718', 'Pelanggan 000718', 'PIC000718', 'pelanggan000718@localhost.com', '000718000718', '002008000718', 'JL. Localhost No.000718', 'JL. Server No.000718', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (720, 1, 'CUST220609.000719', 'Pelanggan 000719', 'PIC000719', 'pelanggan000719@localhost.com', '000719000719', '002008000719', 'JL. Localhost No.000719', 'JL. Server No.000719', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (721, 1, 'CUST220609.000720', 'Pelanggan 000720', 'PIC000720', 'pelanggan000720@localhost.com', '000720000720', '002008000720', 'JL. Localhost No.000720', 'JL. Server No.000720', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (722, 1, 'CUST220609.000721', 'Pelanggan 000721', 'PIC000721', 'pelanggan000721@localhost.com', '000721000721', '002008000721', 'JL. Localhost No.000721', 'JL. Server No.000721', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (723, 1, 'CUST220609.000722', 'Pelanggan 000722', 'PIC000722', 'pelanggan000722@localhost.com', '000722000722', '002008000722', 'JL. Localhost No.000722', 'JL. Server No.000722', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (724, 1, 'CUST220609.000723', 'Pelanggan 000723', 'PIC000723', 'pelanggan000723@localhost.com', '000723000723', '002008000723', 'JL. Localhost No.000723', 'JL. Server No.000723', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (725, 1, 'CUST220609.000724', 'Pelanggan 000724', 'PIC000724', 'pelanggan000724@localhost.com', '000724000724', '002008000724', 'JL. Localhost No.000724', 'JL. Server No.000724', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (726, 1, 'CUST220609.000725', 'Pelanggan 000725', 'PIC000725', 'pelanggan000725@localhost.com', '000725000725', '002008000725', 'JL. Localhost No.000725', 'JL. Server No.000725', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (727, 1, 'CUST220609.000726', 'Pelanggan 000726', 'PIC000726', 'pelanggan000726@localhost.com', '000726000726', '002008000726', 'JL. Localhost No.000726', 'JL. Server No.000726', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (728, 1, 'CUST220609.000727', 'Pelanggan 000727', 'PIC000727', 'pelanggan000727@localhost.com', '000727000727', '002008000727', 'JL. Localhost No.000727', 'JL. Server No.000727', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (729, 1, 'CUST220609.000728', 'Pelanggan 000728', 'PIC000728', 'pelanggan000728@localhost.com', '000728000728', '002008000728', 'JL. Localhost No.000728', 'JL. Server No.000728', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (730, 1, 'CUST220609.000729', 'Pelanggan 000729', 'PIC000729', 'pelanggan000729@localhost.com', '000729000729', '002008000729', 'JL. Localhost No.000729', 'JL. Server No.000729', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (731, 1, 'CUST220609.000730', 'Pelanggan 000730', 'PIC000730', 'pelanggan000730@localhost.com', '000730000730', '002008000730', 'JL. Localhost No.000730', 'JL. Server No.000730', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (732, 1, 'CUST220609.000731', 'Pelanggan 000731', 'PIC000731', 'pelanggan000731@localhost.com', '000731000731', '002008000731', 'JL. Localhost No.000731', 'JL. Server No.000731', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (733, 1, 'CUST220609.000732', 'Pelanggan 000732', 'PIC000732', 'pelanggan000732@localhost.com', '000732000732', '002008000732', 'JL. Localhost No.000732', 'JL. Server No.000732', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (734, 1, 'CUST220609.000733', 'Pelanggan 000733', 'PIC000733', 'pelanggan000733@localhost.com', '000733000733', '002008000733', 'JL. Localhost No.000733', 'JL. Server No.000733', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (735, 1, 'CUST220609.000734', 'Pelanggan 000734', 'PIC000734', 'pelanggan000734@localhost.com', '000734000734', '002008000734', 'JL. Localhost No.000734', 'JL. Server No.000734', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (736, 1, 'CUST220609.000735', 'Pelanggan 000735', 'PIC000735', 'pelanggan000735@localhost.com', '000735000735', '002008000735', 'JL. Localhost No.000735', 'JL. Server No.000735', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (737, 1, 'CUST220609.000736', 'Pelanggan 000736', 'PIC000736', 'pelanggan000736@localhost.com', '000736000736', '002008000736', 'JL. Localhost No.000736', 'JL. Server No.000736', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (738, 1, 'CUST220609.000737', 'Pelanggan 000737', 'PIC000737', 'pelanggan000737@localhost.com', '000737000737', '002008000737', 'JL. Localhost No.000737', 'JL. Server No.000737', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (739, 1, 'CUST220609.000738', 'Pelanggan 000738', 'PIC000738', 'pelanggan000738@localhost.com', '000738000738', '002008000738', 'JL. Localhost No.000738', 'JL. Server No.000738', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (740, 1, 'CUST220609.000739', 'Pelanggan 000739', 'PIC000739', 'pelanggan000739@localhost.com', '000739000739', '002008000739', 'JL. Localhost No.000739', 'JL. Server No.000739', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (741, 1, 'CUST220609.000740', 'Pelanggan 000740', 'PIC000740', 'pelanggan000740@localhost.com', '000740000740', '002008000740', 'JL. Localhost No.000740', 'JL. Server No.000740', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (742, 1, 'CUST220609.000741', 'Pelanggan 000741', 'PIC000741', 'pelanggan000741@localhost.com', '000741000741', '002008000741', 'JL. Localhost No.000741', 'JL. Server No.000741', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (743, 1, 'CUST220609.000742', 'Pelanggan 000742', 'PIC000742', 'pelanggan000742@localhost.com', '000742000742', '002008000742', 'JL. Localhost No.000742', 'JL. Server No.000742', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (744, 1, 'CUST220609.000743', 'Pelanggan 000743', 'PIC000743', 'pelanggan000743@localhost.com', '000743000743', '002008000743', 'JL. Localhost No.000743', 'JL. Server No.000743', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (745, 1, 'CUST220609.000744', 'Pelanggan 000744', 'PIC000744', 'pelanggan000744@localhost.com', '000744000744', '002008000744', 'JL. Localhost No.000744', 'JL. Server No.000744', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (746, 1, 'CUST220609.000745', 'Pelanggan 000745', 'PIC000745', 'pelanggan000745@localhost.com', '000745000745', '002008000745', 'JL. Localhost No.000745', 'JL. Server No.000745', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (747, 1, 'CUST220609.000746', 'Pelanggan 000746', 'PIC000746', 'pelanggan000746@localhost.com', '000746000746', '002008000746', 'JL. Localhost No.000746', 'JL. Server No.000746', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (748, 1, 'CUST220609.000747', 'Pelanggan 000747', 'PIC000747', 'pelanggan000747@localhost.com', '000747000747', '002008000747', 'JL. Localhost No.000747', 'JL. Server No.000747', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (749, 1, 'CUST220609.000748', 'Pelanggan 000748', 'PIC000748', 'pelanggan000748@localhost.com', '000748000748', '002008000748', 'JL. Localhost No.000748', 'JL. Server No.000748', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (750, 1, 'CUST220609.000749', 'Pelanggan 000749', 'PIC000749', 'pelanggan000749@localhost.com', '000749000749', '002008000749', 'JL. Localhost No.000749', 'JL. Server No.000749', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (751, 1, 'CUST220609.000750', 'Pelanggan 000750', 'PIC000750', 'pelanggan000750@localhost.com', '000750000750', '002008000750', 'JL. Localhost No.000750', 'JL. Server No.000750', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (752, 1, 'CUST220609.000751', 'Pelanggan 000751', 'PIC000751', 'pelanggan000751@localhost.com', '000751000751', '002008000751', 'JL. Localhost No.000751', 'JL. Server No.000751', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (753, 1, 'CUST220609.000752', 'Pelanggan 000752', 'PIC000752', 'pelanggan000752@localhost.com', '000752000752', '002008000752', 'JL. Localhost No.000752', 'JL. Server No.000752', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (754, 1, 'CUST220609.000753', 'Pelanggan 000753', 'PIC000753', 'pelanggan000753@localhost.com', '000753000753', '002008000753', 'JL. Localhost No.000753', 'JL. Server No.000753', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (755, 1, 'CUST220609.000754', 'Pelanggan 000754', 'PIC000754', 'pelanggan000754@localhost.com', '000754000754', '002008000754', 'JL. Localhost No.000754', 'JL. Server No.000754', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (756, 1, 'CUST220609.000755', 'Pelanggan 000755', 'PIC000755', 'pelanggan000755@localhost.com', '000755000755', '002008000755', 'JL. Localhost No.000755', 'JL. Server No.000755', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (757, 1, 'CUST220609.000756', 'Pelanggan 000756', 'PIC000756', 'pelanggan000756@localhost.com', '000756000756', '002008000756', 'JL. Localhost No.000756', 'JL. Server No.000756', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (758, 1, 'CUST220609.000757', 'Pelanggan 000757', 'PIC000757', 'pelanggan000757@localhost.com', '000757000757', '002008000757', 'JL. Localhost No.000757', 'JL. Server No.000757', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (759, 1, 'CUST220609.000758', 'Pelanggan 000758', 'PIC000758', 'pelanggan000758@localhost.com', '000758000758', '002008000758', 'JL. Localhost No.000758', 'JL. Server No.000758', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (760, 1, 'CUST220609.000759', 'Pelanggan 000759', 'PIC000759', 'pelanggan000759@localhost.com', '000759000759', '002008000759', 'JL. Localhost No.000759', 'JL. Server No.000759', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (761, 1, 'CUST220609.000760', 'Pelanggan 000760', 'PIC000760', 'pelanggan000760@localhost.com', '000760000760', '002008000760', 'JL. Localhost No.000760', 'JL. Server No.000760', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (762, 1, 'CUST220609.000761', 'Pelanggan 000761', 'PIC000761', 'pelanggan000761@localhost.com', '000761000761', '002008000761', 'JL. Localhost No.000761', 'JL. Server No.000761', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (763, 1, 'CUST220609.000762', 'Pelanggan 000762', 'PIC000762', 'pelanggan000762@localhost.com', '000762000762', '002008000762', 'JL. Localhost No.000762', 'JL. Server No.000762', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (764, 1, 'CUST220609.000763', 'Pelanggan 000763', 'PIC000763', 'pelanggan000763@localhost.com', '000763000763', '002008000763', 'JL. Localhost No.000763', 'JL. Server No.000763', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (765, 1, 'CUST220609.000764', 'Pelanggan 000764', 'PIC000764', 'pelanggan000764@localhost.com', '000764000764', '002008000764', 'JL. Localhost No.000764', 'JL. Server No.000764', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (766, 1, 'CUST220609.000765', 'Pelanggan 000765', 'PIC000765', 'pelanggan000765@localhost.com', '000765000765', '002008000765', 'JL. Localhost No.000765', 'JL. Server No.000765', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (767, 1, 'CUST220609.000766', 'Pelanggan 000766', 'PIC000766', 'pelanggan000766@localhost.com', '000766000766', '002008000766', 'JL. Localhost No.000766', 'JL. Server No.000766', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (768, 1, 'CUST220609.000767', 'Pelanggan 000767', 'PIC000767', 'pelanggan000767@localhost.com', '000767000767', '002008000767', 'JL. Localhost No.000767', 'JL. Server No.000767', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (769, 1, 'CUST220609.000768', 'Pelanggan 000768', 'PIC000768', 'pelanggan000768@localhost.com', '000768000768', '002008000768', 'JL. Localhost No.000768', 'JL. Server No.000768', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (770, 1, 'CUST220609.000769', 'Pelanggan 000769', 'PIC000769', 'pelanggan000769@localhost.com', '000769000769', '002008000769', 'JL. Localhost No.000769', 'JL. Server No.000769', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (771, 1, 'CUST220609.000770', 'Pelanggan 000770', 'PIC000770', 'pelanggan000770@localhost.com', '000770000770', '002008000770', 'JL. Localhost No.000770', 'JL. Server No.000770', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (772, 1, 'CUST220609.000771', 'Pelanggan 000771', 'PIC000771', 'pelanggan000771@localhost.com', '000771000771', '002008000771', 'JL. Localhost No.000771', 'JL. Server No.000771', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (773, 1, 'CUST220609.000772', 'Pelanggan 000772', 'PIC000772', 'pelanggan000772@localhost.com', '000772000772', '002008000772', 'JL. Localhost No.000772', 'JL. Server No.000772', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (774, 1, 'CUST220609.000773', 'Pelanggan 000773', 'PIC000773', 'pelanggan000773@localhost.com', '000773000773', '002008000773', 'JL. Localhost No.000773', 'JL. Server No.000773', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (775, 1, 'CUST220609.000774', 'Pelanggan 000774', 'PIC000774', 'pelanggan000774@localhost.com', '000774000774', '002008000774', 'JL. Localhost No.000774', 'JL. Server No.000774', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (776, 1, 'CUST220609.000775', 'Pelanggan 000775', 'PIC000775', 'pelanggan000775@localhost.com', '000775000775', '002008000775', 'JL. Localhost No.000775', 'JL. Server No.000775', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (777, 1, 'CUST220609.000776', 'Pelanggan 000776', 'PIC000776', 'pelanggan000776@localhost.com', '000776000776', '002008000776', 'JL. Localhost No.000776', 'JL. Server No.000776', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (778, 1, 'CUST220609.000777', 'Pelanggan 000777', 'PIC000777', 'pelanggan000777@localhost.com', '000777000777', '002008000777', 'JL. Localhost No.000777', 'JL. Server No.000777', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (779, 1, 'CUST220609.000778', 'Pelanggan 000778', 'PIC000778', 'pelanggan000778@localhost.com', '000778000778', '002008000778', 'JL. Localhost No.000778', 'JL. Server No.000778', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (780, 1, 'CUST220609.000779', 'Pelanggan 000779', 'PIC000779', 'pelanggan000779@localhost.com', '000779000779', '002008000779', 'JL. Localhost No.000779', 'JL. Server No.000779', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (781, 1, 'CUST220609.000780', 'Pelanggan 000780', 'PIC000780', 'pelanggan000780@localhost.com', '000780000780', '002008000780', 'JL. Localhost No.000780', 'JL. Server No.000780', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (782, 1, 'CUST220609.000781', 'Pelanggan 000781', 'PIC000781', 'pelanggan000781@localhost.com', '000781000781', '002008000781', 'JL. Localhost No.000781', 'JL. Server No.000781', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (783, 1, 'CUST220609.000782', 'Pelanggan 000782', 'PIC000782', 'pelanggan000782@localhost.com', '000782000782', '002008000782', 'JL. Localhost No.000782', 'JL. Server No.000782', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (784, 1, 'CUST220609.000783', 'Pelanggan 000783', 'PIC000783', 'pelanggan000783@localhost.com', '000783000783', '002008000783', 'JL. Localhost No.000783', 'JL. Server No.000783', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (785, 1, 'CUST220609.000784', 'Pelanggan 000784', 'PIC000784', 'pelanggan000784@localhost.com', '000784000784', '002008000784', 'JL. Localhost No.000784', 'JL. Server No.000784', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (786, 1, 'CUST220609.000785', 'Pelanggan 000785', 'PIC000785', 'pelanggan000785@localhost.com', '000785000785', '002008000785', 'JL. Localhost No.000785', 'JL. Server No.000785', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (787, 1, 'CUST220609.000786', 'Pelanggan 000786', 'PIC000786', 'pelanggan000786@localhost.com', '000786000786', '002008000786', 'JL. Localhost No.000786', 'JL. Server No.000786', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (788, 1, 'CUST220609.000787', 'Pelanggan 000787', 'PIC000787', 'pelanggan000787@localhost.com', '000787000787', '002008000787', 'JL. Localhost No.000787', 'JL. Server No.000787', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (789, 1, 'CUST220609.000788', 'Pelanggan 000788', 'PIC000788', 'pelanggan000788@localhost.com', '000788000788', '002008000788', 'JL. Localhost No.000788', 'JL. Server No.000788', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (790, 1, 'CUST220609.000789', 'Pelanggan 000789', 'PIC000789', 'pelanggan000789@localhost.com', '000789000789', '002008000789', 'JL. Localhost No.000789', 'JL. Server No.000789', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (791, 1, 'CUST220609.000790', 'Pelanggan 000790', 'PIC000790', 'pelanggan000790@localhost.com', '000790000790', '002008000790', 'JL. Localhost No.000790', 'JL. Server No.000790', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (792, 1, 'CUST220609.000791', 'Pelanggan 000791', 'PIC000791', 'pelanggan000791@localhost.com', '000791000791', '002008000791', 'JL. Localhost No.000791', 'JL. Server No.000791', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (793, 1, 'CUST220609.000792', 'Pelanggan 000792', 'PIC000792', 'pelanggan000792@localhost.com', '000792000792', '002008000792', 'JL. Localhost No.000792', 'JL. Server No.000792', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (794, 1, 'CUST220609.000793', 'Pelanggan 000793', 'PIC000793', 'pelanggan000793@localhost.com', '000793000793', '002008000793', 'JL. Localhost No.000793', 'JL. Server No.000793', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (795, 1, 'CUST220609.000794', 'Pelanggan 000794', 'PIC000794', 'pelanggan000794@localhost.com', '000794000794', '002008000794', 'JL. Localhost No.000794', 'JL. Server No.000794', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (796, 1, 'CUST220609.000795', 'Pelanggan 000795', 'PIC000795', 'pelanggan000795@localhost.com', '000795000795', '002008000795', 'JL. Localhost No.000795', 'JL. Server No.000795', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (797, 1, 'CUST220609.000796', 'Pelanggan 000796', 'PIC000796', 'pelanggan000796@localhost.com', '000796000796', '002008000796', 'JL. Localhost No.000796', 'JL. Server No.000796', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (798, 1, 'CUST220609.000797', 'Pelanggan 000797', 'PIC000797', 'pelanggan000797@localhost.com', '000797000797', '002008000797', 'JL. Localhost No.000797', 'JL. Server No.000797', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (799, 1, 'CUST220609.000798', 'Pelanggan 000798', 'PIC000798', 'pelanggan000798@localhost.com', '000798000798', '002008000798', 'JL. Localhost No.000798', 'JL. Server No.000798', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (800, 1, 'CUST220609.000799', 'Pelanggan 000799', 'PIC000799', 'pelanggan000799@localhost.com', '000799000799', '002008000799', 'JL. Localhost No.000799', 'JL. Server No.000799', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (801, 1, 'CUST220609.000800', 'Pelanggan 000800', 'PIC000800', 'pelanggan000800@localhost.com', '000800000800', '002008000800', 'JL. Localhost No.000800', 'JL. Server No.000800', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (802, 1, 'CUST220609.000801', 'Pelanggan 000801', 'PIC000801', 'pelanggan000801@localhost.com', '000801000801', '002008000801', 'JL. Localhost No.000801', 'JL. Server No.000801', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (803, 1, 'CUST220609.000802', 'Pelanggan 000802', 'PIC000802', 'pelanggan000802@localhost.com', '000802000802', '002008000802', 'JL. Localhost No.000802', 'JL. Server No.000802', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (804, 1, 'CUST220609.000803', 'Pelanggan 000803', 'PIC000803', 'pelanggan000803@localhost.com', '000803000803', '002008000803', 'JL. Localhost No.000803', 'JL. Server No.000803', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (805, 1, 'CUST220609.000804', 'Pelanggan 000804', 'PIC000804', 'pelanggan000804@localhost.com', '000804000804', '002008000804', 'JL. Localhost No.000804', 'JL. Server No.000804', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (806, 1, 'CUST220609.000805', 'Pelanggan 000805', 'PIC000805', 'pelanggan000805@localhost.com', '000805000805', '002008000805', 'JL. Localhost No.000805', 'JL. Server No.000805', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (807, 1, 'CUST220609.000806', 'Pelanggan 000806', 'PIC000806', 'pelanggan000806@localhost.com', '000806000806', '002008000806', 'JL. Localhost No.000806', 'JL. Server No.000806', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (808, 1, 'CUST220609.000807', 'Pelanggan 000807', 'PIC000807', 'pelanggan000807@localhost.com', '000807000807', '002008000807', 'JL. Localhost No.000807', 'JL. Server No.000807', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (809, 1, 'CUST220609.000808', 'Pelanggan 000808', 'PIC000808', 'pelanggan000808@localhost.com', '000808000808', '002008000808', 'JL. Localhost No.000808', 'JL. Server No.000808', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (810, 1, 'CUST220609.000809', 'Pelanggan 000809', 'PIC000809', 'pelanggan000809@localhost.com', '000809000809', '002008000809', 'JL. Localhost No.000809', 'JL. Server No.000809', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (811, 1, 'CUST220609.000810', 'Pelanggan 000810', 'PIC000810', 'pelanggan000810@localhost.com', '000810000810', '002008000810', 'JL. Localhost No.000810', 'JL. Server No.000810', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (812, 1, 'CUST220609.000811', 'Pelanggan 000811', 'PIC000811', 'pelanggan000811@localhost.com', '000811000811', '002008000811', 'JL. Localhost No.000811', 'JL. Server No.000811', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (813, 1, 'CUST220609.000812', 'Pelanggan 000812', 'PIC000812', 'pelanggan000812@localhost.com', '000812000812', '002008000812', 'JL. Localhost No.000812', 'JL. Server No.000812', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (814, 1, 'CUST220609.000813', 'Pelanggan 000813', 'PIC000813', 'pelanggan000813@localhost.com', '000813000813', '002008000813', 'JL. Localhost No.000813', 'JL. Server No.000813', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (815, 1, 'CUST220609.000814', 'Pelanggan 000814', 'PIC000814', 'pelanggan000814@localhost.com', '000814000814', '002008000814', 'JL. Localhost No.000814', 'JL. Server No.000814', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (816, 1, 'CUST220609.000815', 'Pelanggan 000815', 'PIC000815', 'pelanggan000815@localhost.com', '000815000815', '002008000815', 'JL. Localhost No.000815', 'JL. Server No.000815', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (817, 1, 'CUST220609.000816', 'Pelanggan 000816', 'PIC000816', 'pelanggan000816@localhost.com', '000816000816', '002008000816', 'JL. Localhost No.000816', 'JL. Server No.000816', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (818, 1, 'CUST220609.000817', 'Pelanggan 000817', 'PIC000817', 'pelanggan000817@localhost.com', '000817000817', '002008000817', 'JL. Localhost No.000817', 'JL. Server No.000817', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (819, 1, 'CUST220609.000818', 'Pelanggan 000818', 'PIC000818', 'pelanggan000818@localhost.com', '000818000818', '002008000818', 'JL. Localhost No.000818', 'JL. Server No.000818', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (820, 1, 'CUST220609.000819', 'Pelanggan 000819', 'PIC000819', 'pelanggan000819@localhost.com', '000819000819', '002008000819', 'JL. Localhost No.000819', 'JL. Server No.000819', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (821, 1, 'CUST220609.000820', 'Pelanggan 000820', 'PIC000820', 'pelanggan000820@localhost.com', '000820000820', '002008000820', 'JL. Localhost No.000820', 'JL. Server No.000820', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (822, 1, 'CUST220609.000821', 'Pelanggan 000821', 'PIC000821', 'pelanggan000821@localhost.com', '000821000821', '002008000821', 'JL. Localhost No.000821', 'JL. Server No.000821', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (823, 1, 'CUST220609.000822', 'Pelanggan 000822', 'PIC000822', 'pelanggan000822@localhost.com', '000822000822', '002008000822', 'JL. Localhost No.000822', 'JL. Server No.000822', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (824, 1, 'CUST220609.000823', 'Pelanggan 000823', 'PIC000823', 'pelanggan000823@localhost.com', '000823000823', '002008000823', 'JL. Localhost No.000823', 'JL. Server No.000823', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (825, 1, 'CUST220609.000824', 'Pelanggan 000824', 'PIC000824', 'pelanggan000824@localhost.com', '000824000824', '002008000824', 'JL. Localhost No.000824', 'JL. Server No.000824', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (826, 1, 'CUST220609.000825', 'Pelanggan 000825', 'PIC000825', 'pelanggan000825@localhost.com', '000825000825', '002008000825', 'JL. Localhost No.000825', 'JL. Server No.000825', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (827, 1, 'CUST220609.000826', 'Pelanggan 000826', 'PIC000826', 'pelanggan000826@localhost.com', '000826000826', '002008000826', 'JL. Localhost No.000826', 'JL. Server No.000826', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (828, 1, 'CUST220609.000827', 'Pelanggan 000827', 'PIC000827', 'pelanggan000827@localhost.com', '000827000827', '002008000827', 'JL. Localhost No.000827', 'JL. Server No.000827', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (829, 1, 'CUST220609.000828', 'Pelanggan 000828', 'PIC000828', 'pelanggan000828@localhost.com', '000828000828', '002008000828', 'JL. Localhost No.000828', 'JL. Server No.000828', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (830, 1, 'CUST220609.000829', 'Pelanggan 000829', 'PIC000829', 'pelanggan000829@localhost.com', '000829000829', '002008000829', 'JL. Localhost No.000829', 'JL. Server No.000829', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (831, 1, 'CUST220609.000830', 'Pelanggan 000830', 'PIC000830', 'pelanggan000830@localhost.com', '000830000830', '002008000830', 'JL. Localhost No.000830', 'JL. Server No.000830', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (832, 1, 'CUST220609.000831', 'Pelanggan 000831', 'PIC000831', 'pelanggan000831@localhost.com', '000831000831', '002008000831', 'JL. Localhost No.000831', 'JL. Server No.000831', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (833, 1, 'CUST220609.000832', 'Pelanggan 000832', 'PIC000832', 'pelanggan000832@localhost.com', '000832000832', '002008000832', 'JL. Localhost No.000832', 'JL. Server No.000832', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (834, 1, 'CUST220609.000833', 'Pelanggan 000833', 'PIC000833', 'pelanggan000833@localhost.com', '000833000833', '002008000833', 'JL. Localhost No.000833', 'JL. Server No.000833', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (835, 1, 'CUST220609.000834', 'Pelanggan 000834', 'PIC000834', 'pelanggan000834@localhost.com', '000834000834', '002008000834', 'JL. Localhost No.000834', 'JL. Server No.000834', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (836, 1, 'CUST220609.000835', 'Pelanggan 000835', 'PIC000835', 'pelanggan000835@localhost.com', '000835000835', '002008000835', 'JL. Localhost No.000835', 'JL. Server No.000835', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (837, 1, 'CUST220609.000836', 'Pelanggan 000836', 'PIC000836', 'pelanggan000836@localhost.com', '000836000836', '002008000836', 'JL. Localhost No.000836', 'JL. Server No.000836', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (838, 1, 'CUST220609.000837', 'Pelanggan 000837', 'PIC000837', 'pelanggan000837@localhost.com', '000837000837', '002008000837', 'JL. Localhost No.000837', 'JL. Server No.000837', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (839, 1, 'CUST220609.000838', 'Pelanggan 000838', 'PIC000838', 'pelanggan000838@localhost.com', '000838000838', '002008000838', 'JL. Localhost No.000838', 'JL. Server No.000838', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (840, 1, 'CUST220609.000839', 'Pelanggan 000839', 'PIC000839', 'pelanggan000839@localhost.com', '000839000839', '002008000839', 'JL. Localhost No.000839', 'JL. Server No.000839', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (841, 1, 'CUST220609.000840', 'Pelanggan 000840', 'PIC000840', 'pelanggan000840@localhost.com', '000840000840', '002008000840', 'JL. Localhost No.000840', 'JL. Server No.000840', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (842, 1, 'CUST220609.000841', 'Pelanggan 000841', 'PIC000841', 'pelanggan000841@localhost.com', '000841000841', '002008000841', 'JL. Localhost No.000841', 'JL. Server No.000841', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (843, 1, 'CUST220609.000842', 'Pelanggan 000842', 'PIC000842', 'pelanggan000842@localhost.com', '000842000842', '002008000842', 'JL. Localhost No.000842', 'JL. Server No.000842', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (844, 1, 'CUST220609.000843', 'Pelanggan 000843', 'PIC000843', 'pelanggan000843@localhost.com', '000843000843', '002008000843', 'JL. Localhost No.000843', 'JL. Server No.000843', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (845, 1, 'CUST220609.000844', 'Pelanggan 000844', 'PIC000844', 'pelanggan000844@localhost.com', '000844000844', '002008000844', 'JL. Localhost No.000844', 'JL. Server No.000844', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (846, 1, 'CUST220609.000845', 'Pelanggan 000845', 'PIC000845', 'pelanggan000845@localhost.com', '000845000845', '002008000845', 'JL. Localhost No.000845', 'JL. Server No.000845', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (847, 1, 'CUST220609.000846', 'Pelanggan 000846', 'PIC000846', 'pelanggan000846@localhost.com', '000846000846', '002008000846', 'JL. Localhost No.000846', 'JL. Server No.000846', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (848, 1, 'CUST220609.000847', 'Pelanggan 000847', 'PIC000847', 'pelanggan000847@localhost.com', '000847000847', '002008000847', 'JL. Localhost No.000847', 'JL. Server No.000847', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (849, 1, 'CUST220609.000848', 'Pelanggan 000848', 'PIC000848', 'pelanggan000848@localhost.com', '000848000848', '002008000848', 'JL. Localhost No.000848', 'JL. Server No.000848', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (850, 1, 'CUST220609.000849', 'Pelanggan 000849', 'PIC000849', 'pelanggan000849@localhost.com', '000849000849', '002008000849', 'JL. Localhost No.000849', 'JL. Server No.000849', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (851, 1, 'CUST220609.000850', 'Pelanggan 000850', 'PIC000850', 'pelanggan000850@localhost.com', '000850000850', '002008000850', 'JL. Localhost No.000850', 'JL. Server No.000850', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (852, 1, 'CUST220609.000851', 'Pelanggan 000851', 'PIC000851', 'pelanggan000851@localhost.com', '000851000851', '002008000851', 'JL. Localhost No.000851', 'JL. Server No.000851', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (853, 1, 'CUST220609.000852', 'Pelanggan 000852', 'PIC000852', 'pelanggan000852@localhost.com', '000852000852', '002008000852', 'JL. Localhost No.000852', 'JL. Server No.000852', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (854, 1, 'CUST220609.000853', 'Pelanggan 000853', 'PIC000853', 'pelanggan000853@localhost.com', '000853000853', '002008000853', 'JL. Localhost No.000853', 'JL. Server No.000853', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (855, 1, 'CUST220609.000854', 'Pelanggan 000854', 'PIC000854', 'pelanggan000854@localhost.com', '000854000854', '002008000854', 'JL. Localhost No.000854', 'JL. Server No.000854', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (856, 1, 'CUST220609.000855', 'Pelanggan 000855', 'PIC000855', 'pelanggan000855@localhost.com', '000855000855', '002008000855', 'JL. Localhost No.000855', 'JL. Server No.000855', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (857, 1, 'CUST220609.000856', 'Pelanggan 000856', 'PIC000856', 'pelanggan000856@localhost.com', '000856000856', '002008000856', 'JL. Localhost No.000856', 'JL. Server No.000856', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (858, 1, 'CUST220609.000857', 'Pelanggan 000857', 'PIC000857', 'pelanggan000857@localhost.com', '000857000857', '002008000857', 'JL. Localhost No.000857', 'JL. Server No.000857', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (859, 1, 'CUST220609.000858', 'Pelanggan 000858', 'PIC000858', 'pelanggan000858@localhost.com', '000858000858', '002008000858', 'JL. Localhost No.000858', 'JL. Server No.000858', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (860, 1, 'CUST220609.000859', 'Pelanggan 000859', 'PIC000859', 'pelanggan000859@localhost.com', '000859000859', '002008000859', 'JL. Localhost No.000859', 'JL. Server No.000859', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (861, 1, 'CUST220609.000860', 'Pelanggan 000860', 'PIC000860', 'pelanggan000860@localhost.com', '000860000860', '002008000860', 'JL. Localhost No.000860', 'JL. Server No.000860', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (862, 1, 'CUST220609.000861', 'Pelanggan 000861', 'PIC000861', 'pelanggan000861@localhost.com', '000861000861', '002008000861', 'JL. Localhost No.000861', 'JL. Server No.000861', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (863, 1, 'CUST220609.000862', 'Pelanggan 000862', 'PIC000862', 'pelanggan000862@localhost.com', '000862000862', '002008000862', 'JL. Localhost No.000862', 'JL. Server No.000862', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (864, 1, 'CUST220609.000863', 'Pelanggan 000863', 'PIC000863', 'pelanggan000863@localhost.com', '000863000863', '002008000863', 'JL. Localhost No.000863', 'JL. Server No.000863', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (865, 1, 'CUST220609.000864', 'Pelanggan 000864', 'PIC000864', 'pelanggan000864@localhost.com', '000864000864', '002008000864', 'JL. Localhost No.000864', 'JL. Server No.000864', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (866, 1, 'CUST220609.000865', 'Pelanggan 000865', 'PIC000865', 'pelanggan000865@localhost.com', '000865000865', '002008000865', 'JL. Localhost No.000865', 'JL. Server No.000865', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (867, 1, 'CUST220609.000866', 'Pelanggan 000866', 'PIC000866', 'pelanggan000866@localhost.com', '000866000866', '002008000866', 'JL. Localhost No.000866', 'JL. Server No.000866', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (868, 1, 'CUST220609.000867', 'Pelanggan 000867', 'PIC000867', 'pelanggan000867@localhost.com', '000867000867', '002008000867', 'JL. Localhost No.000867', 'JL. Server No.000867', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (869, 1, 'CUST220609.000868', 'Pelanggan 000868', 'PIC000868', 'pelanggan000868@localhost.com', '000868000868', '002008000868', 'JL. Localhost No.000868', 'JL. Server No.000868', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (870, 1, 'CUST220609.000869', 'Pelanggan 000869', 'PIC000869', 'pelanggan000869@localhost.com', '000869000869', '002008000869', 'JL. Localhost No.000869', 'JL. Server No.000869', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (871, 1, 'CUST220609.000870', 'Pelanggan 000870', 'PIC000870', 'pelanggan000870@localhost.com', '000870000870', '002008000870', 'JL. Localhost No.000870', 'JL. Server No.000870', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (872, 1, 'CUST220609.000871', 'Pelanggan 000871', 'PIC000871', 'pelanggan000871@localhost.com', '000871000871', '002008000871', 'JL. Localhost No.000871', 'JL. Server No.000871', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (873, 1, 'CUST220609.000872', 'Pelanggan 000872', 'PIC000872', 'pelanggan000872@localhost.com', '000872000872', '002008000872', 'JL. Localhost No.000872', 'JL. Server No.000872', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (874, 1, 'CUST220609.000873', 'Pelanggan 000873', 'PIC000873', 'pelanggan000873@localhost.com', '000873000873', '002008000873', 'JL. Localhost No.000873', 'JL. Server No.000873', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (875, 1, 'CUST220609.000874', 'Pelanggan 000874', 'PIC000874', 'pelanggan000874@localhost.com', '000874000874', '002008000874', 'JL. Localhost No.000874', 'JL. Server No.000874', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (876, 1, 'CUST220609.000875', 'Pelanggan 000875', 'PIC000875', 'pelanggan000875@localhost.com', '000875000875', '002008000875', 'JL. Localhost No.000875', 'JL. Server No.000875', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (877, 1, 'CUST220609.000876', 'Pelanggan 000876', 'PIC000876', 'pelanggan000876@localhost.com', '000876000876', '002008000876', 'JL. Localhost No.000876', 'JL. Server No.000876', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (878, 1, 'CUST220609.000877', 'Pelanggan 000877', 'PIC000877', 'pelanggan000877@localhost.com', '000877000877', '002008000877', 'JL. Localhost No.000877', 'JL. Server No.000877', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (879, 1, 'CUST220609.000878', 'Pelanggan 000878', 'PIC000878', 'pelanggan000878@localhost.com', '000878000878', '002008000878', 'JL. Localhost No.000878', 'JL. Server No.000878', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (880, 1, 'CUST220609.000879', 'Pelanggan 000879', 'PIC000879', 'pelanggan000879@localhost.com', '000879000879', '002008000879', 'JL. Localhost No.000879', 'JL. Server No.000879', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (881, 1, 'CUST220609.000880', 'Pelanggan 000880', 'PIC000880', 'pelanggan000880@localhost.com', '000880000880', '002008000880', 'JL. Localhost No.000880', 'JL. Server No.000880', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (882, 1, 'CUST220609.000881', 'Pelanggan 000881', 'PIC000881', 'pelanggan000881@localhost.com', '000881000881', '002008000881', 'JL. Localhost No.000881', 'JL. Server No.000881', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (883, 1, 'CUST220609.000882', 'Pelanggan 000882', 'PIC000882', 'pelanggan000882@localhost.com', '000882000882', '002008000882', 'JL. Localhost No.000882', 'JL. Server No.000882', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (884, 1, 'CUST220609.000883', 'Pelanggan 000883', 'PIC000883', 'pelanggan000883@localhost.com', '000883000883', '002008000883', 'JL. Localhost No.000883', 'JL. Server No.000883', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (885, 1, 'CUST220609.000884', 'Pelanggan 000884', 'PIC000884', 'pelanggan000884@localhost.com', '000884000884', '002008000884', 'JL. Localhost No.000884', 'JL. Server No.000884', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (886, 1, 'CUST220609.000885', 'Pelanggan 000885', 'PIC000885', 'pelanggan000885@localhost.com', '000885000885', '002008000885', 'JL. Localhost No.000885', 'JL. Server No.000885', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (887, 1, 'CUST220609.000886', 'Pelanggan 000886', 'PIC000886', 'pelanggan000886@localhost.com', '000886000886', '002008000886', 'JL. Localhost No.000886', 'JL. Server No.000886', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (888, 1, 'CUST220609.000887', 'Pelanggan 000887', 'PIC000887', 'pelanggan000887@localhost.com', '000887000887', '002008000887', 'JL. Localhost No.000887', 'JL. Server No.000887', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (889, 1, 'CUST220609.000888', 'Pelanggan 000888', 'PIC000888', 'pelanggan000888@localhost.com', '000888000888', '002008000888', 'JL. Localhost No.000888', 'JL. Server No.000888', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (890, 1, 'CUST220609.000889', 'Pelanggan 000889', 'PIC000889', 'pelanggan000889@localhost.com', '000889000889', '002008000889', 'JL. Localhost No.000889', 'JL. Server No.000889', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (891, 1, 'CUST220609.000890', 'Pelanggan 000890', 'PIC000890', 'pelanggan000890@localhost.com', '000890000890', '002008000890', 'JL. Localhost No.000890', 'JL. Server No.000890', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (892, 1, 'CUST220609.000891', 'Pelanggan 000891', 'PIC000891', 'pelanggan000891@localhost.com', '000891000891', '002008000891', 'JL. Localhost No.000891', 'JL. Server No.000891', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (893, 1, 'CUST220609.000892', 'Pelanggan 000892', 'PIC000892', 'pelanggan000892@localhost.com', '000892000892', '002008000892', 'JL. Localhost No.000892', 'JL. Server No.000892', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (894, 1, 'CUST220609.000893', 'Pelanggan 000893', 'PIC000893', 'pelanggan000893@localhost.com', '000893000893', '002008000893', 'JL. Localhost No.000893', 'JL. Server No.000893', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (895, 1, 'CUST220609.000894', 'Pelanggan 000894', 'PIC000894', 'pelanggan000894@localhost.com', '000894000894', '002008000894', 'JL. Localhost No.000894', 'JL. Server No.000894', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (896, 1, 'CUST220609.000895', 'Pelanggan 000895', 'PIC000895', 'pelanggan000895@localhost.com', '000895000895', '002008000895', 'JL. Localhost No.000895', 'JL. Server No.000895', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (897, 1, 'CUST220609.000896', 'Pelanggan 000896', 'PIC000896', 'pelanggan000896@localhost.com', '000896000896', '002008000896', 'JL. Localhost No.000896', 'JL. Server No.000896', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (898, 1, 'CUST220609.000897', 'Pelanggan 000897', 'PIC000897', 'pelanggan000897@localhost.com', '000897000897', '002008000897', 'JL. Localhost No.000897', 'JL. Server No.000897', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (899, 1, 'CUST220609.000898', 'Pelanggan 000898', 'PIC000898', 'pelanggan000898@localhost.com', '000898000898', '002008000898', 'JL. Localhost No.000898', 'JL. Server No.000898', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (900, 1, 'CUST220609.000899', 'Pelanggan 000899', 'PIC000899', 'pelanggan000899@localhost.com', '000899000899', '002008000899', 'JL. Localhost No.000899', 'JL. Server No.000899', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (901, 1, 'CUST220609.000900', 'Pelanggan 000900', 'PIC000900', 'pelanggan000900@localhost.com', '000900000900', '002008000900', 'JL. Localhost No.000900', 'JL. Server No.000900', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (902, 1, 'CUST220609.000901', 'Pelanggan 000901', 'PIC000901', 'pelanggan000901@localhost.com', '000901000901', '002008000901', 'JL. Localhost No.000901', 'JL. Server No.000901', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (903, 1, 'CUST220609.000902', 'Pelanggan 000902', 'PIC000902', 'pelanggan000902@localhost.com', '000902000902', '002008000902', 'JL. Localhost No.000902', 'JL. Server No.000902', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (904, 1, 'CUST220609.000903', 'Pelanggan 000903', 'PIC000903', 'pelanggan000903@localhost.com', '000903000903', '002008000903', 'JL. Localhost No.000903', 'JL. Server No.000903', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (905, 1, 'CUST220609.000904', 'Pelanggan 000904', 'PIC000904', 'pelanggan000904@localhost.com', '000904000904', '002008000904', 'JL. Localhost No.000904', 'JL. Server No.000904', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (906, 1, 'CUST220609.000905', 'Pelanggan 000905', 'PIC000905', 'pelanggan000905@localhost.com', '000905000905', '002008000905', 'JL. Localhost No.000905', 'JL. Server No.000905', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (907, 1, 'CUST220609.000906', 'Pelanggan 000906', 'PIC000906', 'pelanggan000906@localhost.com', '000906000906', '002008000906', 'JL. Localhost No.000906', 'JL. Server No.000906', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (908, 1, 'CUST220609.000907', 'Pelanggan 000907', 'PIC000907', 'pelanggan000907@localhost.com', '000907000907', '002008000907', 'JL. Localhost No.000907', 'JL. Server No.000907', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (909, 1, 'CUST220609.000908', 'Pelanggan 000908', 'PIC000908', 'pelanggan000908@localhost.com', '000908000908', '002008000908', 'JL. Localhost No.000908', 'JL. Server No.000908', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (910, 1, 'CUST220609.000909', 'Pelanggan 000909', 'PIC000909', 'pelanggan000909@localhost.com', '000909000909', '002008000909', 'JL. Localhost No.000909', 'JL. Server No.000909', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (911, 1, 'CUST220609.000910', 'Pelanggan 000910', 'PIC000910', 'pelanggan000910@localhost.com', '000910000910', '002008000910', 'JL. Localhost No.000910', 'JL. Server No.000910', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (912, 1, 'CUST220609.000911', 'Pelanggan 000911', 'PIC000911', 'pelanggan000911@localhost.com', '000911000911', '002008000911', 'JL. Localhost No.000911', 'JL. Server No.000911', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (913, 1, 'CUST220609.000912', 'Pelanggan 000912', 'PIC000912', 'pelanggan000912@localhost.com', '000912000912', '002008000912', 'JL. Localhost No.000912', 'JL. Server No.000912', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (914, 1, 'CUST220609.000913', 'Pelanggan 000913', 'PIC000913', 'pelanggan000913@localhost.com', '000913000913', '002008000913', 'JL. Localhost No.000913', 'JL. Server No.000913', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (915, 1, 'CUST220609.000914', 'Pelanggan 000914', 'PIC000914', 'pelanggan000914@localhost.com', '000914000914', '002008000914', 'JL. Localhost No.000914', 'JL. Server No.000914', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (916, 1, 'CUST220609.000915', 'Pelanggan 000915', 'PIC000915', 'pelanggan000915@localhost.com', '000915000915', '002008000915', 'JL. Localhost No.000915', 'JL. Server No.000915', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (917, 1, 'CUST220609.000916', 'Pelanggan 000916', 'PIC000916', 'pelanggan000916@localhost.com', '000916000916', '002008000916', 'JL. Localhost No.000916', 'JL. Server No.000916', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (918, 1, 'CUST220609.000917', 'Pelanggan 000917', 'PIC000917', 'pelanggan000917@localhost.com', '000917000917', '002008000917', 'JL. Localhost No.000917', 'JL. Server No.000917', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (919, 1, 'CUST220609.000918', 'Pelanggan 000918', 'PIC000918', 'pelanggan000918@localhost.com', '000918000918', '002008000918', 'JL. Localhost No.000918', 'JL. Server No.000918', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (920, 1, 'CUST220609.000919', 'Pelanggan 000919', 'PIC000919', 'pelanggan000919@localhost.com', '000919000919', '002008000919', 'JL. Localhost No.000919', 'JL. Server No.000919', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (921, 1, 'CUST220609.000920', 'Pelanggan 000920', 'PIC000920', 'pelanggan000920@localhost.com', '000920000920', '002008000920', 'JL. Localhost No.000920', 'JL. Server No.000920', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (922, 1, 'CUST220609.000921', 'Pelanggan 000921', 'PIC000921', 'pelanggan000921@localhost.com', '000921000921', '002008000921', 'JL. Localhost No.000921', 'JL. Server No.000921', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (923, 1, 'CUST220609.000922', 'Pelanggan 000922', 'PIC000922', 'pelanggan000922@localhost.com', '000922000922', '002008000922', 'JL. Localhost No.000922', 'JL. Server No.000922', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (924, 1, 'CUST220609.000923', 'Pelanggan 000923', 'PIC000923', 'pelanggan000923@localhost.com', '000923000923', '002008000923', 'JL. Localhost No.000923', 'JL. Server No.000923', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (925, 1, 'CUST220609.000924', 'Pelanggan 000924', 'PIC000924', 'pelanggan000924@localhost.com', '000924000924', '002008000924', 'JL. Localhost No.000924', 'JL. Server No.000924', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (926, 1, 'CUST220609.000925', 'Pelanggan 000925', 'PIC000925', 'pelanggan000925@localhost.com', '000925000925', '002008000925', 'JL. Localhost No.000925', 'JL. Server No.000925', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (927, 1, 'CUST220609.000926', 'Pelanggan 000926', 'PIC000926', 'pelanggan000926@localhost.com', '000926000926', '002008000926', 'JL. Localhost No.000926', 'JL. Server No.000926', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (928, 1, 'CUST220609.000927', 'Pelanggan 000927', 'PIC000927', 'pelanggan000927@localhost.com', '000927000927', '002008000927', 'JL. Localhost No.000927', 'JL. Server No.000927', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (929, 1, 'CUST220609.000928', 'Pelanggan 000928', 'PIC000928', 'pelanggan000928@localhost.com', '000928000928', '002008000928', 'JL. Localhost No.000928', 'JL. Server No.000928', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (930, 1, 'CUST220609.000929', 'Pelanggan 000929', 'PIC000929', 'pelanggan000929@localhost.com', '000929000929', '002008000929', 'JL. Localhost No.000929', 'JL. Server No.000929', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (931, 1, 'CUST220609.000930', 'Pelanggan 000930', 'PIC000930', 'pelanggan000930@localhost.com', '000930000930', '002008000930', 'JL. Localhost No.000930', 'JL. Server No.000930', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (932, 1, 'CUST220609.000931', 'Pelanggan 000931', 'PIC000931', 'pelanggan000931@localhost.com', '000931000931', '002008000931', 'JL. Localhost No.000931', 'JL. Server No.000931', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (933, 1, 'CUST220609.000932', 'Pelanggan 000932', 'PIC000932', 'pelanggan000932@localhost.com', '000932000932', '002008000932', 'JL. Localhost No.000932', 'JL. Server No.000932', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (934, 1, 'CUST220609.000933', 'Pelanggan 000933', 'PIC000933', 'pelanggan000933@localhost.com', '000933000933', '002008000933', 'JL. Localhost No.000933', 'JL. Server No.000933', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (935, 1, 'CUST220609.000934', 'Pelanggan 000934', 'PIC000934', 'pelanggan000934@localhost.com', '000934000934', '002008000934', 'JL. Localhost No.000934', 'JL. Server No.000934', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (936, 1, 'CUST220609.000935', 'Pelanggan 000935', 'PIC000935', 'pelanggan000935@localhost.com', '000935000935', '002008000935', 'JL. Localhost No.000935', 'JL. Server No.000935', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (937, 1, 'CUST220609.000936', 'Pelanggan 000936', 'PIC000936', 'pelanggan000936@localhost.com', '000936000936', '002008000936', 'JL. Localhost No.000936', 'JL. Server No.000936', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (938, 1, 'CUST220609.000937', 'Pelanggan 000937', 'PIC000937', 'pelanggan000937@localhost.com', '000937000937', '002008000937', 'JL. Localhost No.000937', 'JL. Server No.000937', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (939, 1, 'CUST220609.000938', 'Pelanggan 000938', 'PIC000938', 'pelanggan000938@localhost.com', '000938000938', '002008000938', 'JL. Localhost No.000938', 'JL. Server No.000938', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (940, 1, 'CUST220609.000939', 'Pelanggan 000939', 'PIC000939', 'pelanggan000939@localhost.com', '000939000939', '002008000939', 'JL. Localhost No.000939', 'JL. Server No.000939', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (941, 1, 'CUST220609.000940', 'Pelanggan 000940', 'PIC000940', 'pelanggan000940@localhost.com', '000940000940', '002008000940', 'JL. Localhost No.000940', 'JL. Server No.000940', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (942, 1, 'CUST220609.000941', 'Pelanggan 000941', 'PIC000941', 'pelanggan000941@localhost.com', '000941000941', '002008000941', 'JL. Localhost No.000941', 'JL. Server No.000941', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (943, 1, 'CUST220609.000942', 'Pelanggan 000942', 'PIC000942', 'pelanggan000942@localhost.com', '000942000942', '002008000942', 'JL. Localhost No.000942', 'JL. Server No.000942', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (944, 1, 'CUST220609.000943', 'Pelanggan 000943', 'PIC000943', 'pelanggan000943@localhost.com', '000943000943', '002008000943', 'JL. Localhost No.000943', 'JL. Server No.000943', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (945, 1, 'CUST220609.000944', 'Pelanggan 000944', 'PIC000944', 'pelanggan000944@localhost.com', '000944000944', '002008000944', 'JL. Localhost No.000944', 'JL. Server No.000944', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (946, 1, 'CUST220609.000945', 'Pelanggan 000945', 'PIC000945', 'pelanggan000945@localhost.com', '000945000945', '002008000945', 'JL. Localhost No.000945', 'JL. Server No.000945', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (947, 1, 'CUST220609.000946', 'Pelanggan 000946', 'PIC000946', 'pelanggan000946@localhost.com', '000946000946', '002008000946', 'JL. Localhost No.000946', 'JL. Server No.000946', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (948, 1, 'CUST220609.000947', 'Pelanggan 000947', 'PIC000947', 'pelanggan000947@localhost.com', '000947000947', '002008000947', 'JL. Localhost No.000947', 'JL. Server No.000947', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (949, 1, 'CUST220609.000948', 'Pelanggan 000948', 'PIC000948', 'pelanggan000948@localhost.com', '000948000948', '002008000948', 'JL. Localhost No.000948', 'JL. Server No.000948', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (950, 1, 'CUST220609.000949', 'Pelanggan 000949', 'PIC000949', 'pelanggan000949@localhost.com', '000949000949', '002008000949', 'JL. Localhost No.000949', 'JL. Server No.000949', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (951, 1, 'CUST220609.000950', 'Pelanggan 000950', 'PIC000950', 'pelanggan000950@localhost.com', '000950000950', '002008000950', 'JL. Localhost No.000950', 'JL. Server No.000950', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (952, 1, 'CUST220609.000951', 'Pelanggan 000951', 'PIC000951', 'pelanggan000951@localhost.com', '000951000951', '002008000951', 'JL. Localhost No.000951', 'JL. Server No.000951', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (953, 1, 'CUST220609.000952', 'Pelanggan 000952', 'PIC000952', 'pelanggan000952@localhost.com', '000952000952', '002008000952', 'JL. Localhost No.000952', 'JL. Server No.000952', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (954, 1, 'CUST220609.000953', 'Pelanggan 000953', 'PIC000953', 'pelanggan000953@localhost.com', '000953000953', '002008000953', 'JL. Localhost No.000953', 'JL. Server No.000953', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (955, 1, 'CUST220609.000954', 'Pelanggan 000954', 'PIC000954', 'pelanggan000954@localhost.com', '000954000954', '002008000954', 'JL. Localhost No.000954', 'JL. Server No.000954', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (956, 1, 'CUST220609.000955', 'Pelanggan 000955', 'PIC000955', 'pelanggan000955@localhost.com', '000955000955', '002008000955', 'JL. Localhost No.000955', 'JL. Server No.000955', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (957, 1, 'CUST220609.000956', 'Pelanggan 000956', 'PIC000956', 'pelanggan000956@localhost.com', '000956000956', '002008000956', 'JL. Localhost No.000956', 'JL. Server No.000956', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (958, 1, 'CUST220609.000957', 'Pelanggan 000957', 'PIC000957', 'pelanggan000957@localhost.com', '000957000957', '002008000957', 'JL. Localhost No.000957', 'JL. Server No.000957', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (959, 1, 'CUST220609.000958', 'Pelanggan 000958', 'PIC000958', 'pelanggan000958@localhost.com', '000958000958', '002008000958', 'JL. Localhost No.000958', 'JL. Server No.000958', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (960, 1, 'CUST220609.000959', 'Pelanggan 000959', 'PIC000959', 'pelanggan000959@localhost.com', '000959000959', '002008000959', 'JL. Localhost No.000959', 'JL. Server No.000959', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (961, 1, 'CUST220609.000960', 'Pelanggan 000960', 'PIC000960', 'pelanggan000960@localhost.com', '000960000960', '002008000960', 'JL. Localhost No.000960', 'JL. Server No.000960', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (962, 1, 'CUST220609.000961', 'Pelanggan 000961', 'PIC000961', 'pelanggan000961@localhost.com', '000961000961', '002008000961', 'JL. Localhost No.000961', 'JL. Server No.000961', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (963, 1, 'CUST220609.000962', 'Pelanggan 000962', 'PIC000962', 'pelanggan000962@localhost.com', '000962000962', '002008000962', 'JL. Localhost No.000962', 'JL. Server No.000962', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (964, 1, 'CUST220609.000963', 'Pelanggan 000963', 'PIC000963', 'pelanggan000963@localhost.com', '000963000963', '002008000963', 'JL. Localhost No.000963', 'JL. Server No.000963', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (965, 1, 'CUST220609.000964', 'Pelanggan 000964', 'PIC000964', 'pelanggan000964@localhost.com', '000964000964', '002008000964', 'JL. Localhost No.000964', 'JL. Server No.000964', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (966, 1, 'CUST220609.000965', 'Pelanggan 000965', 'PIC000965', 'pelanggan000965@localhost.com', '000965000965', '002008000965', 'JL. Localhost No.000965', 'JL. Server No.000965', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (967, 1, 'CUST220609.000966', 'Pelanggan 000966', 'PIC000966', 'pelanggan000966@localhost.com', '000966000966', '002008000966', 'JL. Localhost No.000966', 'JL. Server No.000966', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (968, 1, 'CUST220609.000967', 'Pelanggan 000967', 'PIC000967', 'pelanggan000967@localhost.com', '000967000967', '002008000967', 'JL. Localhost No.000967', 'JL. Server No.000967', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (969, 1, 'CUST220609.000968', 'Pelanggan 000968', 'PIC000968', 'pelanggan000968@localhost.com', '000968000968', '002008000968', 'JL. Localhost No.000968', 'JL. Server No.000968', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (970, 1, 'CUST220609.000969', 'Pelanggan 000969', 'PIC000969', 'pelanggan000969@localhost.com', '000969000969', '002008000969', 'JL. Localhost No.000969', 'JL. Server No.000969', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (971, 1, 'CUST220609.000970', 'Pelanggan 000970', 'PIC000970', 'pelanggan000970@localhost.com', '000970000970', '002008000970', 'JL. Localhost No.000970', 'JL. Server No.000970', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (972, 1, 'CUST220609.000971', 'Pelanggan 000971', 'PIC000971', 'pelanggan000971@localhost.com', '000971000971', '002008000971', 'JL. Localhost No.000971', 'JL. Server No.000971', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (973, 1, 'CUST220609.000972', 'Pelanggan 000972', 'PIC000972', 'pelanggan000972@localhost.com', '000972000972', '002008000972', 'JL. Localhost No.000972', 'JL. Server No.000972', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (974, 1, 'CUST220609.000973', 'Pelanggan 000973', 'PIC000973', 'pelanggan000973@localhost.com', '000973000973', '002008000973', 'JL. Localhost No.000973', 'JL. Server No.000973', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (975, 1, 'CUST220609.000974', 'Pelanggan 000974', 'PIC000974', 'pelanggan000974@localhost.com', '000974000974', '002008000974', 'JL. Localhost No.000974', 'JL. Server No.000974', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (976, 1, 'CUST220609.000975', 'Pelanggan 000975', 'PIC000975', 'pelanggan000975@localhost.com', '000975000975', '002008000975', 'JL. Localhost No.000975', 'JL. Server No.000975', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (977, 1, 'CUST220609.000976', 'Pelanggan 000976', 'PIC000976', 'pelanggan000976@localhost.com', '000976000976', '002008000976', 'JL. Localhost No.000976', 'JL. Server No.000976', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (978, 1, 'CUST220609.000977', 'Pelanggan 000977', 'PIC000977', 'pelanggan000977@localhost.com', '000977000977', '002008000977', 'JL. Localhost No.000977', 'JL. Server No.000977', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (979, 1, 'CUST220609.000978', 'Pelanggan 000978', 'PIC000978', 'pelanggan000978@localhost.com', '000978000978', '002008000978', 'JL. Localhost No.000978', 'JL. Server No.000978', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (980, 1, 'CUST220609.000979', 'Pelanggan 000979', 'PIC000979', 'pelanggan000979@localhost.com', '000979000979', '002008000979', 'JL. Localhost No.000979', 'JL. Server No.000979', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (981, 1, 'CUST220609.000980', 'Pelanggan 000980', 'PIC000980', 'pelanggan000980@localhost.com', '000980000980', '002008000980', 'JL. Localhost No.000980', 'JL. Server No.000980', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (982, 1, 'CUST220609.000981', 'Pelanggan 000981', 'PIC000981', 'pelanggan000981@localhost.com', '000981000981', '002008000981', 'JL. Localhost No.000981', 'JL. Server No.000981', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (983, 1, 'CUST220609.000982', 'Pelanggan 000982', 'PIC000982', 'pelanggan000982@localhost.com', '000982000982', '002008000982', 'JL. Localhost No.000982', 'JL. Server No.000982', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (984, 1, 'CUST220609.000983', 'Pelanggan 000983', 'PIC000983', 'pelanggan000983@localhost.com', '000983000983', '002008000983', 'JL. Localhost No.000983', 'JL. Server No.000983', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (985, 1, 'CUST220609.000984', 'Pelanggan 000984', 'PIC000984', 'pelanggan000984@localhost.com', '000984000984', '002008000984', 'JL. Localhost No.000984', 'JL. Server No.000984', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (986, 1, 'CUST220609.000985', 'Pelanggan 000985', 'PIC000985', 'pelanggan000985@localhost.com', '000985000985', '002008000985', 'JL. Localhost No.000985', 'JL. Server No.000985', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (987, 1, 'CUST220609.000986', 'Pelanggan 000986', 'PIC000986', 'pelanggan000986@localhost.com', '000986000986', '002008000986', 'JL. Localhost No.000986', 'JL. Server No.000986', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (988, 1, 'CUST220609.000987', 'Pelanggan 000987', 'PIC000987', 'pelanggan000987@localhost.com', '000987000987', '002008000987', 'JL. Localhost No.000987', 'JL. Server No.000987', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (989, 1, 'CUST220609.000988', 'Pelanggan 000988', 'PIC000988', 'pelanggan000988@localhost.com', '000988000988', '002008000988', 'JL. Localhost No.000988', 'JL. Server No.000988', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (990, 1, 'CUST220609.000989', 'Pelanggan 000989', 'PIC000989', 'pelanggan000989@localhost.com', '000989000989', '002008000989', 'JL. Localhost No.000989', 'JL. Server No.000989', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (991, 1, 'CUST220609.000990', 'Pelanggan 000990', 'PIC000990', 'pelanggan000990@localhost.com', '000990000990', '002008000990', 'JL. Localhost No.000990', 'JL. Server No.000990', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (992, 1, 'CUST220609.000991', 'Pelanggan 000991', 'PIC000991', 'pelanggan000991@localhost.com', '000991000991', '002008000991', 'JL. Localhost No.000991', 'JL. Server No.000991', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (993, 1, 'CUST220609.000992', 'Pelanggan 000992', 'PIC000992', 'pelanggan000992@localhost.com', '000992000992', '002008000992', 'JL. Localhost No.000992', 'JL. Server No.000992', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (994, 1, 'CUST220609.000993', 'Pelanggan 000993', 'PIC000993', 'pelanggan000993@localhost.com', '000993000993', '002008000993', 'JL. Localhost No.000993', 'JL. Server No.000993', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (995, 1, 'CUST220609.000994', 'Pelanggan 000994', 'PIC000994', 'pelanggan000994@localhost.com', '000994000994', '002008000994', 'JL. Localhost No.000994', 'JL. Server No.000994', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (996, 1, 'CUST220609.000995', 'Pelanggan 000995', 'PIC000995', 'pelanggan000995@localhost.com', '000995000995', '002008000995', 'JL. Localhost No.000995', 'JL. Server No.000995', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (997, 1, 'CUST220609.000996', 'Pelanggan 000996', 'PIC000996', 'pelanggan000996@localhost.com', '000996000996', '002008000996', 'JL. Localhost No.000996', 'JL. Server No.000996', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (998, 1, 'CUST220609.000997', 'Pelanggan 000997', 'PIC000997', 'pelanggan000997@localhost.com', '000997000997', '002008000997', 'JL. Localhost No.000997', 'JL. Server No.000997', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (999, 1, 'CUST220609.000998', 'Pelanggan 000998', 'PIC000998', 'pelanggan000998@localhost.com', '000998000998', '002008000998', 'JL. Localhost No.000998', 'JL. Server No.000998', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (1000, 1, 'CUST220609.000999', 'Pelanggan 000999', 'PIC000999', 'pelanggan000999@localhost.com', '000999000999', '002008000999', 'JL. Localhost No.000999', 'JL. Server No.000999', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
INSERT INTO `mas_pelanggans` VALUES (1001, 1, 'CUST220609.001000', 'Pelanggan 001000', 'PIC001000', 'pelanggan001000@localhost.com', '001000001000', '002008001000', 'JL. Localhost No.001000', 'JL. Server No.001000', 100000000.00, 'Y', '2022-06-11 10:35:34', '2022-06-11 10:35:34');
COMMIT;

-- ----------------------------
-- Table structure for mas_pemasoks
-- ----------------------------
DROP TABLE IF EXISTS `mas_pemasoks`;
CREATE TABLE `mas_pemasoks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `pic` varchar(100) DEFAULT '',
  `email` varchar(200) DEFAULT NULL,
  `phone` varchar(18) DEFAULT NULL,
  `alamat` varchar(200) DEFAULT NULL,
  `max_hutang` float(12,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `user_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_pemasoks_createdby_foreign` (`user_id`) USING BTREE,
  KEY `mas_pemasoks_cabang_id_foreign` (`cabang_id`) USING BTREE,
  CONSTRAINT `mas_pemasoks_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `mas_pemasoks_createdby_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_pemasoks
-- ----------------------------
BEGIN;
INSERT INTO `mas_pemasoks` VALUES (1, 1, 'SUP220322.001', 'Ayat Ekapoetra', '', 'ayat.ekapoetra@gmail.com', '08123456789', 'JL. Hertasning 7 No.22c', 0.00, 'Y', 1, '2022-03-22 05:05:24', '2022-03-22 05:05:24');
INSERT INTO `mas_pemasoks` VALUES (2, 1, 'SUP220714.002', 'Alfatih Kenzie Putra', 'kenzie', 'kenzie@localhost.com', '123123123123', 'JL. Hertasning 7 No.22c', 1000000000.00, 'Y', 1, '2022-07-14 15:02:43', '2022-07-14 15:02:43');
COMMIT;

-- ----------------------------
-- Table structure for mas_racks
-- ----------------------------
DROP TABLE IF EXISTS `mas_racks`;
CREATE TABLE `mas_racks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(10) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `keterangan` varchar(200) DEFAULT '',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `user_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mas_racks_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `mas_racks_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `mas_racks_user_id_foreign` (`user_id`) USING BTREE,
  CONSTRAINT `mas_racks_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mas_racks_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mas_racks_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mas_racks
-- ----------------------------
BEGIN;
INSERT INTO `mas_racks` VALUES (1, 1, 2, 'R.01', 'Rack 1', 'After calling pivotModel you cannot call the pivotTable itself.', 'Y', 1, '2022-03-20 23:53:10', '2022-03-21 00:38:23');
INSERT INTO `mas_racks` VALUES (2, 1, 1, 'R.2', 'Rack 2', 'By default, pivot table names are derived by sorting lowercased related model names in alphabetical order and joining them with a _ character (e.g. User + Car = car_user).', 'Y', 1, '2022-03-21 00:40:26', '2022-03-21 00:41:29');
COMMIT;

-- ----------------------------
-- Table structure for mjm_notifications
-- ----------------------------
DROP TABLE IF EXISTS `mjm_notifications`;
CREATE TABLE `mjm_notifications` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `header` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `sender` int(10) unsigned DEFAULT NULL,
  `receiver` int(10) unsigned DEFAULT NULL,
  `status` enum('unread','read','removed') DEFAULT 'unread',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `mjm_notification_sender_foreignkey` (`sender`) USING BTREE,
  KEY `mjm_notification_receiver_foreignkey` (`receiver`) USING BTREE,
  CONSTRAINT `mjm_notification_receiver_foreignkey` FOREIGN KEY (`receiver`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `mjm_notification_sender_foreignkey` FOREIGN KEY (`sender`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of mjm_notifications
-- ----------------------------
BEGIN;
INSERT INTO `mjm_notifications` VALUES (1, 'New Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-13 15:44:27', '2022-07-13 15:44:27', NULL);
INSERT INTO `mjm_notifications` VALUES (2, 'New Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-13 15:44:27', '2022-07-13 15:44:27', NULL);
INSERT INTO `mjm_notifications` VALUES (3, 'New Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-13 15:44:27', '2022-07-13 15:44:27', NULL);
INSERT INTO `mjm_notifications` VALUES (4, 'Edit Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-13 15:45:28', '2022-08-27 14:16:23', '2022-08-27 14:16:24');
INSERT INTO `mjm_notifications` VALUES (5, 'Edit Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-13 15:45:28', '2022-07-13 15:45:28', NULL);
INSERT INTO `mjm_notifications` VALUES (6, 'Edit Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-13 15:45:28', '2022-07-13 15:45:28', NULL);
INSERT INTO `mjm_notifications` VALUES (7, 'Edit Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-13 15:45:28', '2022-07-13 15:45:28', NULL);
INSERT INTO `mjm_notifications` VALUES (8, 'New Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-14 11:49:49', '2022-07-14 11:49:49', NULL);
INSERT INTO `mjm_notifications` VALUES (9, 'New Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-14 11:49:49', '2022-07-14 11:49:49', NULL);
INSERT INTO `mjm_notifications` VALUES (10, 'New Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-14 11:49:49', '2022-07-14 11:49:49', NULL);
INSERT INTO `mjm_notifications` VALUES (11, 'Approved Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-14 13:51:58', '2022-08-27 14:16:21', '2022-08-27 14:16:21');
INSERT INTO `mjm_notifications` VALUES (12, 'Approved Purchasing Request', 'PR/2022/VII/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-001', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-14 13:51:58', '2022-08-27 14:16:22', '2022-08-27 14:16:22');
INSERT INTO `mjm_notifications` VALUES (13, 'Approved Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-14 13:57:16', '2022-08-27 14:16:16', '2022-08-27 14:16:16');
INSERT INTO `mjm_notifications` VALUES (14, 'Approved Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-14 13:57:16', '2022-08-27 14:16:19', '2022-08-27 14:16:19');
INSERT INTO `mjm_notifications` VALUES (15, 'New Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-14 15:26:34', '2022-07-14 15:26:34', NULL);
INSERT INTO `mjm_notifications` VALUES (16, 'New Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-14 15:26:34', '2022-07-14 15:26:34', NULL);
INSERT INTO `mjm_notifications` VALUES (17, 'New Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-14 15:26:34', '2022-07-14 15:26:34', NULL);
INSERT INTO `mjm_notifications` VALUES (18, 'Approved Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-14 15:39:10', '2022-08-27 14:16:08', '2022-08-27 14:16:08');
INSERT INTO `mjm_notifications` VALUES (19, 'Approved Purchasing Request', 'PR/2022/VII/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-002', '/acc/purchasing-request', 1, 1, 'unread', '2022-07-14 15:39:10', '2022-07-14 15:39:10', NULL);
INSERT INTO `mjm_notifications` VALUES (20, 'New Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-30 15:17:23', '2022-07-30 15:17:23', NULL);
INSERT INTO `mjm_notifications` VALUES (21, 'New Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-30 15:17:23', '2022-07-30 15:17:23', NULL);
INSERT INTO `mjm_notifications` VALUES (22, 'New Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-30 15:17:23', '2022-07-30 15:17:23', NULL);
INSERT INTO `mjm_notifications` VALUES (23, 'Edit Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 1, 'unread', '2022-07-30 15:23:53', '2022-07-30 15:23:53', NULL);
INSERT INTO `mjm_notifications` VALUES (24, 'Edit Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-30 15:23:53', '2022-07-30 15:23:53', NULL);
INSERT INTO `mjm_notifications` VALUES (25, 'Edit Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-30 15:23:53', '2022-07-30 15:23:53', NULL);
INSERT INTO `mjm_notifications` VALUES (26, 'Edit Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-30 15:23:53', '2022-07-30 15:23:53', NULL);
INSERT INTO `mjm_notifications` VALUES (27, 'Reject Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer menolak permohonan order barang anda dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-30 15:32:32', '2022-08-27 14:15:54', '2022-08-27 14:15:55');
INSERT INTO `mjm_notifications` VALUES (28, 'Approved Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-30 15:33:51', '2022-08-27 14:15:53', '2022-08-27 14:15:54');
INSERT INTO `mjm_notifications` VALUES (29, 'Approved Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-31 15:26:38', '2022-08-27 14:15:51', '2022-08-27 14:15:51');
INSERT INTO `mjm_notifications` VALUES (30, 'Reject Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer menolak permohonan order barang anda dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-31 15:35:24', '2022-08-27 14:15:50', '2022-08-27 14:15:50');
INSERT INTO `mjm_notifications` VALUES (31, 'Approved Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-31 15:35:30', '2022-08-27 14:15:49', '2022-08-27 14:15:49');
INSERT INTO `mjm_notifications` VALUES (32, 'Approved Purchasing Request', 'PR/2022/VII/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-003', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-31 15:35:48', '2022-08-27 14:15:47', '2022-08-27 14:15:48');
INSERT INTO `mjm_notifications` VALUES (33, 'New Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-31 21:26:26', '2022-07-31 21:26:26', NULL);
INSERT INTO `mjm_notifications` VALUES (34, 'New Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-31 21:26:27', '2022-07-31 21:26:27', NULL);
INSERT INTO `mjm_notifications` VALUES (35, 'New Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-31 21:26:27', '2022-07-31 21:26:27', NULL);
INSERT INTO `mjm_notifications` VALUES (36, 'Edit Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-31 21:28:01', '2022-08-27 14:15:46', '2022-08-27 14:15:47');
INSERT INTO `mjm_notifications` VALUES (37, 'Edit Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 2, 'unread', '2022-07-31 21:28:01', '2022-07-31 21:28:01', NULL);
INSERT INTO `mjm_notifications` VALUES (38, 'Edit Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 3, 'unread', '2022-07-31 21:28:01', '2022-07-31 21:28:01', NULL);
INSERT INTO `mjm_notifications` VALUES (39, 'Edit Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer melakukan update & meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 14, 'unread', '2022-07-31 21:28:01', '2022-07-31 21:28:01', NULL);
INSERT INTO `mjm_notifications` VALUES (40, 'Approved Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-31 21:29:14', '2022-08-27 14:15:43', '2022-08-27 14:15:44');
INSERT INTO `mjm_notifications` VALUES (41, 'Approved Purchasing Request', 'PR/2022/VII/C1-004', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VII/C1-004', '/acc/purchasing-request', 1, 1, 'removed', '2022-07-31 21:29:14', '2022-08-27 14:15:45', '2022-08-27 14:15:45');
INSERT INTO `mjm_notifications` VALUES (42, 'New Purchasing Request', 'PR/2022/VIII/C1-005', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-005', '/acc/purchasing-request', 1, 2, 'unread', '2022-08-01 15:24:58', '2022-08-01 15:24:58', NULL);
INSERT INTO `mjm_notifications` VALUES (43, 'New Purchasing Request', 'PR/2022/VIII/C1-005', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-005', '/acc/purchasing-request', 1, 3, 'unread', '2022-08-01 15:24:58', '2022-08-01 15:24:58', NULL);
INSERT INTO `mjm_notifications` VALUES (44, 'New Purchasing Request', 'PR/2022/VIII/C1-005', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-005', '/acc/purchasing-request', 1, 14, 'unread', '2022-08-01 15:24:58', '2022-08-01 15:24:58', NULL);
INSERT INTO `mjm_notifications` VALUES (45, 'Approved Purchasing Request', 'PR/2022/VIII/C1-005', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-005', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-01 15:26:14', '2022-08-27 14:15:34', '2022-08-27 14:15:35');
INSERT INTO `mjm_notifications` VALUES (46, 'Approved Purchasing Request', 'PR/2022/VIII/C1-005', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-005', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-01 15:26:16', '2022-08-27 14:15:33', '2022-08-27 14:15:33');
INSERT INTO `mjm_notifications` VALUES (47, 'Approved Purchasing Request', 'PR/2022/VIII/C1-005', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-005', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-01 15:26:17', '2022-08-27 14:15:30', '2022-08-27 14:15:30');
INSERT INTO `mjm_notifications` VALUES (48, 'Approved Purchasing Request', 'PR/2022/VIII/C1-005', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-005', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-01 15:26:17', '2022-08-27 14:15:31', '2022-08-27 14:15:31');
INSERT INTO `mjm_notifications` VALUES (49, 'New Purchasing Request', 'PR/2022/VIII/C1-006', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-006', '/acc/purchasing-request', 1, 2, 'unread', '2022-08-01 15:28:50', '2022-08-01 15:28:50', NULL);
INSERT INTO `mjm_notifications` VALUES (50, 'New Purchasing Request', 'PR/2022/VIII/C1-006', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-006', '/acc/purchasing-request', 1, 3, 'unread', '2022-08-01 15:28:50', '2022-08-01 15:28:50', NULL);
INSERT INTO `mjm_notifications` VALUES (51, 'New Purchasing Request', 'PR/2022/VIII/C1-006', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-006', '/acc/purchasing-request', 1, 14, 'unread', '2022-08-01 15:28:50', '2022-08-01 15:28:50', NULL);
INSERT INTO `mjm_notifications` VALUES (52, 'Approved Purchasing Request', 'PR/2022/VIII/C1-006', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-006', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-01 15:28:58', '2022-08-27 14:15:29', '2022-08-27 14:15:29');
INSERT INTO `mjm_notifications` VALUES (53, 'Approved Purchasing Request', 'PR/2022/VIII/C1-006', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-006', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-01 15:28:59', '2022-08-27 14:15:26', '2022-08-27 14:15:26');
INSERT INTO `mjm_notifications` VALUES (54, 'New Purchasing Request', 'PR/2022/VIII/C1-007', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-007', '/acc/purchasing-request', 1, 2, 'unread', '2022-08-02 16:17:37', '2022-08-02 16:17:37', NULL);
INSERT INTO `mjm_notifications` VALUES (55, 'New Purchasing Request', 'PR/2022/VIII/C1-007', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-007', '/acc/purchasing-request', 1, 3, 'unread', '2022-08-02 16:17:37', '2022-08-02 16:17:37', NULL);
INSERT INTO `mjm_notifications` VALUES (56, 'New Purchasing Request', 'PR/2022/VIII/C1-007', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-007', '/acc/purchasing-request', 1, 14, 'unread', '2022-08-02 16:17:37', '2022-08-02 16:17:37', NULL);
INSERT INTO `mjm_notifications` VALUES (57, 'Approved Purchasing Request', 'PR/2022/VIII/C1-007', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-007', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-02 16:17:52', '2022-08-27 14:15:23', '2022-08-27 14:15:23');
INSERT INTO `mjm_notifications` VALUES (58, 'Approved Purchasing Request', 'PR/2022/VIII/C1-007', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-007', '/acc/purchasing-request', 1, 1, 'removed', '2022-08-02 16:17:54', '2022-08-27 14:15:20', '2022-08-27 14:15:20');
INSERT INTO `mjm_notifications` VALUES (59, 'Customer Order', 'INV220802C101.005', NULL, 'developer telah membuat order dengan kode INV220802C101.005', '/operational/entry-pembayaran', 1, 1, 'removed', '2022-08-02 16:39:53', '2022-08-27 14:15:16', '2022-08-27 14:15:17');
INSERT INTO `mjm_notifications` VALUES (60, 'Customer Order', 'INV220802C101.005', NULL, 'developer telah membuat order dengan kode INV220802C101.005', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-02 16:39:58', '2022-08-02 16:39:58', NULL);
INSERT INTO `mjm_notifications` VALUES (61, 'Customer Order', 'INV220802C101.005', NULL, 'developer telah membuat order dengan kode INV220802C101.005', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-02 16:39:58', '2022-08-02 16:39:58', NULL);
INSERT INTO `mjm_notifications` VALUES (62, 'Pembayaran Pelanggan', 'PAID220818C101.004', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220818C101.004', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-18 12:21:48', '2022-08-18 12:21:48', NULL);
INSERT INTO `mjm_notifications` VALUES (63, 'Pembayaran Pelanggan', 'PAID220818C101.004', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220818C101.004', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-18 12:21:48', '2022-08-18 12:21:48', NULL);
INSERT INTO `mjm_notifications` VALUES (64, 'Pembayaran Pelanggan', 'PAID220818C101.004', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220818C101.004', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-18 12:21:48', '2022-08-18 12:21:48', NULL);
INSERT INTO `mjm_notifications` VALUES (65, 'New Purchasing Request', 'PR/2022/VIII/C1-008', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-008', '/acc/purchasing-request', 1, 2, 'unread', '2022-08-26 21:15:11', '2022-08-26 21:15:11', NULL);
INSERT INTO `mjm_notifications` VALUES (66, 'New Purchasing Request', 'PR/2022/VIII/C1-008', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-008', '/acc/purchasing-request', 1, 3, 'unread', '2022-08-26 21:15:11', '2022-08-26 21:15:11', NULL);
INSERT INTO `mjm_notifications` VALUES (67, 'New Purchasing Request', 'PR/2022/VIII/C1-008', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-008', '/acc/purchasing-request', 1, 14, 'unread', '2022-08-26 21:15:11', '2022-08-26 21:15:11', NULL);
INSERT INTO `mjm_notifications` VALUES (68, 'Approved Purchasing Request', 'PR/2022/VIII/C1-008', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-008', '/acc/purchasing-request', 1, 1, 'unread', '2022-08-26 21:15:22', '2022-08-26 21:15:22', NULL);
INSERT INTO `mjm_notifications` VALUES (69, 'Approved Purchasing Request', 'PR/2022/VIII/C1-008', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-008', '/acc/purchasing-request', 1, 1, 'unread', '2022-08-26 21:15:22', '2022-08-26 21:15:22', NULL);
INSERT INTO `mjm_notifications` VALUES (70, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-26 22:16:33', '2022-08-26 22:16:33', NULL);
INSERT INTO `mjm_notifications` VALUES (71, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-26 22:16:33', '2022-08-26 22:16:33', NULL);
INSERT INTO `mjm_notifications` VALUES (72, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-26 22:16:33', '2022-08-26 22:16:33', NULL);
INSERT INTO `mjm_notifications` VALUES (73, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-26 22:22:18', '2022-08-26 22:22:18', NULL);
INSERT INTO `mjm_notifications` VALUES (74, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-26 22:22:18', '2022-08-26 22:22:18', NULL);
INSERT INTO `mjm_notifications` VALUES (75, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-26 22:22:18', '2022-08-26 22:22:18', NULL);
INSERT INTO `mjm_notifications` VALUES (76, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-26 22:33:54', '2022-08-26 22:33:54', NULL);
INSERT INTO `mjm_notifications` VALUES (77, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-26 22:33:54', '2022-08-26 22:33:54', NULL);
INSERT INTO `mjm_notifications` VALUES (78, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-26 22:33:54', '2022-08-26 22:33:54', NULL);
INSERT INTO `mjm_notifications` VALUES (79, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-26 22:36:42', '2022-08-26 22:36:42', NULL);
INSERT INTO `mjm_notifications` VALUES (80, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-26 22:36:42', '2022-08-26 22:36:42', NULL);
INSERT INTO `mjm_notifications` VALUES (81, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-26 22:36:42', '2022-08-26 22:36:42', NULL);
INSERT INTO `mjm_notifications` VALUES (82, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-26 22:42:15', '2022-08-26 22:42:15', NULL);
INSERT INTO `mjm_notifications` VALUES (83, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-26 22:42:15', '2022-08-26 22:42:15', NULL);
INSERT INTO `mjm_notifications` VALUES (84, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-26 22:42:15', '2022-08-26 22:42:15', NULL);
INSERT INTO `mjm_notifications` VALUES (85, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-26 22:48:22', '2022-08-26 22:48:22', NULL);
INSERT INTO `mjm_notifications` VALUES (86, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-26 22:48:22', '2022-08-26 22:48:22', NULL);
INSERT INTO `mjm_notifications` VALUES (87, 'Customer Order', 'INV220826C101.006', NULL, 'developer telah membuat order dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-26 22:48:22', '2022-08-26 22:48:22', NULL);
INSERT INTO `mjm_notifications` VALUES (88, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-26 22:48:50', '2022-08-26 22:48:50', NULL);
INSERT INTO `mjm_notifications` VALUES (89, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-26 22:48:50', '2022-08-26 22:48:50', NULL);
INSERT INTO `mjm_notifications` VALUES (90, 'Invoicing', 'INV220826C101.006', NULL, 'developer telah membuat invoice dengan kode INV220826C101.006', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-26 22:48:50', '2022-08-26 22:48:50', NULL);
INSERT INTO `mjm_notifications` VALUES (91, 'New Purchasing Request', 'PR/2022/VIII/C1-009', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-009', '/acc/purchasing-request', 1, 2, 'unread', '2022-08-26 23:50:45', '2022-08-26 23:50:45', NULL);
INSERT INTO `mjm_notifications` VALUES (92, 'New Purchasing Request', 'PR/2022/VIII/C1-009', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-009', '/acc/purchasing-request', 1, 3, 'unread', '2022-08-26 23:50:45', '2022-08-26 23:50:45', NULL);
INSERT INTO `mjm_notifications` VALUES (93, 'New Purchasing Request', 'PR/2022/VIII/C1-009', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-009', '/acc/purchasing-request', 1, 14, 'unread', '2022-08-26 23:50:45', '2022-08-26 23:50:45', NULL);
INSERT INTO `mjm_notifications` VALUES (94, 'Approved Purchasing Request', 'PR/2022/VIII/C1-009', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-009', '/acc/purchasing-request', 1, 1, 'unread', '2022-08-26 23:50:54', '2022-08-26 23:50:54', NULL);
INSERT INTO `mjm_notifications` VALUES (95, 'Approved Purchasing Request', 'PR/2022/VIII/C1-009', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-009', '/acc/purchasing-request', 1, 1, 'unread', '2022-08-26 23:50:54', '2022-08-26 23:50:54', NULL);
INSERT INTO `mjm_notifications` VALUES (96, 'New Purchasing Request', 'PR/2022/VIII/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-001', '/acc/purchasing-request', 1, 2, 'unread', '2022-08-27 00:48:41', '2022-08-27 00:48:41', NULL);
INSERT INTO `mjm_notifications` VALUES (97, 'New Purchasing Request', 'PR/2022/VIII/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-001', '/acc/purchasing-request', 1, 3, 'unread', '2022-08-27 00:48:41', '2022-08-27 00:48:41', NULL);
INSERT INTO `mjm_notifications` VALUES (98, 'New Purchasing Request', 'PR/2022/VIII/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/VIII/C1-001', '/acc/purchasing-request', 1, 14, 'unread', '2022-08-27 00:48:41', '2022-08-27 00:48:41', NULL);
INSERT INTO `mjm_notifications` VALUES (99, 'Approved Purchasing Request', 'PR/2022/VIII/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-08-27 00:49:01', '2022-08-27 00:49:01', NULL);
INSERT INTO `mjm_notifications` VALUES (100, 'Approved Purchasing Request', 'PR/2022/VIII/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/VIII/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-08-27 00:49:01', '2022-08-27 00:49:01', NULL);
INSERT INTO `mjm_notifications` VALUES (101, 'Customer Order', 'INV220827C101.001', NULL, 'developer telah membuat order dengan kode INV220827C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 01:47:34', '2022-08-27 01:47:34', NULL);
INSERT INTO `mjm_notifications` VALUES (102, 'Customer Order', 'INV220827C101.001', NULL, 'developer telah membuat order dengan kode INV220827C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 01:47:34', '2022-08-27 01:47:34', NULL);
INSERT INTO `mjm_notifications` VALUES (103, 'Customer Order', 'INV220827C101.001', NULL, 'developer telah membuat order dengan kode INV220827C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 01:47:34', '2022-08-27 01:47:34', NULL);
INSERT INTO `mjm_notifications` VALUES (104, 'Invoicing', 'INV220827C101.001', NULL, 'developer telah membuat invoice dengan kode INV220827C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 01:48:15', '2022-08-27 01:48:15', NULL);
INSERT INTO `mjm_notifications` VALUES (105, 'Invoicing', 'INV220827C101.001', NULL, 'developer telah membuat invoice dengan kode INV220827C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 01:48:15', '2022-08-27 01:48:15', NULL);
INSERT INTO `mjm_notifications` VALUES (106, 'Invoicing', 'INV220827C101.001', NULL, 'developer telah membuat invoice dengan kode INV220827C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 01:48:15', '2022-08-27 01:48:15', NULL);
INSERT INTO `mjm_notifications` VALUES (107, 'Pembayaran Pelanggan', 'PAID220827C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 01:54:16', '2022-08-27 01:54:16', NULL);
INSERT INTO `mjm_notifications` VALUES (108, 'Pembayaran Pelanggan', 'PAID220827C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 01:54:16', '2022-08-27 01:54:16', NULL);
INSERT INTO `mjm_notifications` VALUES (109, 'Pembayaran Pelanggan', 'PAID220827C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 01:54:16', '2022-08-27 01:54:16', NULL);
INSERT INTO `mjm_notifications` VALUES (110, 'Customer Order', 'INV220827C101.002', NULL, 'developer telah membuat order dengan kode INV220827C101.002', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 12:42:36', '2022-08-27 12:42:36', NULL);
INSERT INTO `mjm_notifications` VALUES (111, 'Customer Order', 'INV220827C101.002', NULL, 'developer telah membuat order dengan kode INV220827C101.002', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 12:42:36', '2022-08-27 12:42:36', NULL);
INSERT INTO `mjm_notifications` VALUES (112, 'Customer Order', 'INV220827C101.002', NULL, 'developer telah membuat order dengan kode INV220827C101.002', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 12:42:36', '2022-08-27 12:42:36', NULL);
INSERT INTO `mjm_notifications` VALUES (113, 'Invoicing', 'INV220827C101.002', NULL, 'developer telah membuat invoice dengan kode INV220827C101.002', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 12:44:15', '2022-08-27 12:44:15', NULL);
INSERT INTO `mjm_notifications` VALUES (114, 'Invoicing', 'INV220827C101.002', NULL, 'developer telah membuat invoice dengan kode INV220827C101.002', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 12:44:15', '2022-08-27 12:44:15', NULL);
INSERT INTO `mjm_notifications` VALUES (115, 'Invoicing', 'INV220827C101.002', NULL, 'developer telah membuat invoice dengan kode INV220827C101.002', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 12:44:15', '2022-08-27 12:44:15', NULL);
INSERT INTO `mjm_notifications` VALUES (116, 'Pembayaran Pelanggan', 'PAID220827C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.002', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 14:04:49', '2022-08-27 14:04:49', NULL);
INSERT INTO `mjm_notifications` VALUES (117, 'Pembayaran Pelanggan', 'PAID220827C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.002', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 14:04:49', '2022-08-27 14:04:49', NULL);
INSERT INTO `mjm_notifications` VALUES (118, 'Pembayaran Pelanggan', 'PAID220827C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.002', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 14:04:49', '2022-08-27 14:04:49', NULL);
INSERT INTO `mjm_notifications` VALUES (119, 'Pembayaran Pelanggan', 'PAID220827C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.002', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 14:05:36', '2022-08-27 14:05:36', NULL);
INSERT INTO `mjm_notifications` VALUES (120, 'Pembayaran Pelanggan', 'PAID220827C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.002', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 14:05:36', '2022-08-27 14:05:36', NULL);
INSERT INTO `mjm_notifications` VALUES (121, 'Pembayaran Pelanggan', 'PAID220827C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.002', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 14:05:36', '2022-08-27 14:05:36', NULL);
INSERT INTO `mjm_notifications` VALUES (122, 'Customer Order', 'INV220827C101.003', NULL, 'developer telah membuat order dengan kode INV220827C101.003', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 14:10:15', '2022-08-27 14:10:15', NULL);
INSERT INTO `mjm_notifications` VALUES (123, 'Customer Order', 'INV220827C101.003', NULL, 'developer telah membuat order dengan kode INV220827C101.003', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 14:10:15', '2022-08-27 14:10:15', NULL);
INSERT INTO `mjm_notifications` VALUES (124, 'Customer Order', 'INV220827C101.003', NULL, 'developer telah membuat order dengan kode INV220827C101.003', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 14:10:15', '2022-08-27 14:10:15', NULL);
INSERT INTO `mjm_notifications` VALUES (125, 'Invoicing', 'INV220827C101.003', NULL, 'developer telah membuat invoice dengan kode INV220827C101.003', '/operational/entry-pembayaran', 1, 1, 'removed', '2022-08-27 14:10:42', '2022-08-27 14:16:11', '2022-08-27 14:16:11');
INSERT INTO `mjm_notifications` VALUES (126, 'Invoicing', 'INV220827C101.003', NULL, 'developer telah membuat invoice dengan kode INV220827C101.003', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 14:10:42', '2022-08-27 14:10:42', NULL);
INSERT INTO `mjm_notifications` VALUES (127, 'Invoicing', 'INV220827C101.003', NULL, 'developer telah membuat invoice dengan kode INV220827C101.003', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 14:10:42', '2022-08-27 14:10:42', NULL);
INSERT INTO `mjm_notifications` VALUES (128, 'Pembayaran Pelanggan', 'PAID220827C101.003', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.003', '/operational/entry-pembayaran', 1, 1, 'removed', '2022-08-27 14:11:44', '2022-08-27 14:16:10', '2022-08-27 14:16:10');
INSERT INTO `mjm_notifications` VALUES (129, 'Pembayaran Pelanggan', 'PAID220827C101.003', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.003', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 14:11:44', '2022-08-27 14:11:44', NULL);
INSERT INTO `mjm_notifications` VALUES (130, 'Pembayaran Pelanggan', 'PAID220827C101.003', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.003', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 14:11:44', '2022-08-27 14:11:44', NULL);
INSERT INTO `mjm_notifications` VALUES (131, 'Pembayaran Pelanggan', 'PAID220827C101.003', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.003', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-08-27 20:13:11', '2022-08-27 20:13:11', NULL);
INSERT INTO `mjm_notifications` VALUES (132, 'Pembayaran Pelanggan', 'PAID220827C101.003', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.003', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-08-27 20:13:11', '2022-08-27 20:13:11', NULL);
INSERT INTO `mjm_notifications` VALUES (133, 'Pembayaran Pelanggan', 'PAID220827C101.003', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220827C101.003', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-08-27 20:13:11', '2022-08-27 20:13:11', NULL);
INSERT INTO `mjm_notifications` VALUES (134, 'New Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 2, 'unread', '2022-09-01 09:39:44', '2022-09-01 09:39:44', NULL);
INSERT INTO `mjm_notifications` VALUES (135, 'New Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 3, 'unread', '2022-09-01 09:39:44', '2022-09-01 09:39:44', NULL);
INSERT INTO `mjm_notifications` VALUES (136, 'New Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 14, 'unread', '2022-09-01 09:39:44', '2022-09-01 09:39:44', NULL);
INSERT INTO `mjm_notifications` VALUES (137, 'Approved Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-01 09:39:49', '2022-09-01 09:39:49', NULL);
INSERT INTO `mjm_notifications` VALUES (138, 'Approved Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-01 09:39:49', '2022-09-01 09:39:49', NULL);
INSERT INTO `mjm_notifications` VALUES (139, 'New Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 2, 'unread', '2022-09-08 12:00:40', '2022-09-08 12:00:40', NULL);
INSERT INTO `mjm_notifications` VALUES (140, 'New Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 3, 'unread', '2022-09-08 12:00:40', '2022-09-08 12:00:40', NULL);
INSERT INTO `mjm_notifications` VALUES (141, 'New Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 14, 'unread', '2022-09-08 12:00:40', '2022-09-08 12:00:40', NULL);
INSERT INTO `mjm_notifications` VALUES (142, 'Approved Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-08 12:00:48', '2022-09-08 12:00:48', NULL);
INSERT INTO `mjm_notifications` VALUES (143, 'Approved Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-08 12:00:48', '2022-09-08 12:00:48', NULL);
INSERT INTO `mjm_notifications` VALUES (144, 'New Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 2, 'unread', '2022-09-15 13:35:16', '2022-09-15 13:35:16', NULL);
INSERT INTO `mjm_notifications` VALUES (145, 'New Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 3, 'unread', '2022-09-15 13:35:16', '2022-09-15 13:35:16', NULL);
INSERT INTO `mjm_notifications` VALUES (146, 'New Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 14, 'unread', '2022-09-15 13:35:16', '2022-09-15 13:35:16', NULL);
INSERT INTO `mjm_notifications` VALUES (147, 'Approved Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-15 13:35:58', '2022-09-15 13:35:58', NULL);
INSERT INTO `mjm_notifications` VALUES (148, 'Approved Purchasing Request', 'PR/2022/IX/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-15 13:35:58', '2022-09-15 13:35:58', NULL);
INSERT INTO `mjm_notifications` VALUES (149, 'New Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 2, 'unread', '2022-09-21 08:43:40', '2022-09-21 08:43:40', NULL);
INSERT INTO `mjm_notifications` VALUES (150, 'New Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 3, 'unread', '2022-09-21 08:43:40', '2022-09-21 08:43:40', NULL);
INSERT INTO `mjm_notifications` VALUES (151, 'New Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 14, 'unread', '2022-09-21 08:43:40', '2022-09-21 08:43:40', NULL);
INSERT INTO `mjm_notifications` VALUES (152, 'New Purchasing Request', 'PR/2022/IX/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-003', '/acc/purchasing-request', 1, 2, 'unread', '2022-09-21 08:44:28', '2022-09-21 08:44:28', NULL);
INSERT INTO `mjm_notifications` VALUES (153, 'New Purchasing Request', 'PR/2022/IX/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-003', '/acc/purchasing-request', 1, 3, 'unread', '2022-09-21 08:44:28', '2022-09-21 08:44:28', NULL);
INSERT INTO `mjm_notifications` VALUES (154, 'New Purchasing Request', 'PR/2022/IX/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-003', '/acc/purchasing-request', 1, 14, 'unread', '2022-09-21 08:44:28', '2022-09-21 08:44:28', NULL);
INSERT INTO `mjm_notifications` VALUES (155, 'Approved Purchasing Request', 'PR/2022/IX/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-003', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-21 08:44:37', '2022-09-21 08:44:37', NULL);
INSERT INTO `mjm_notifications` VALUES (156, 'Approved Purchasing Request', 'PR/2022/IX/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-003', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-21 08:44:37', '2022-09-21 08:44:37', NULL);
INSERT INTO `mjm_notifications` VALUES (157, 'Approved Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-21 08:44:42', '2022-09-21 08:44:42', NULL);
INSERT INTO `mjm_notifications` VALUES (158, 'Approved Purchasing Request', 'PR/2022/IX/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-002', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-21 08:44:42', '2022-09-21 08:44:42', NULL);
INSERT INTO `mjm_notifications` VALUES (159, 'New Purchasing Request', 'PR/2022/IX/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-004', '/acc/purchasing-request', 1, 2, 'unread', '2022-09-21 08:48:49', '2022-09-21 08:48:49', NULL);
INSERT INTO `mjm_notifications` VALUES (160, 'New Purchasing Request', 'PR/2022/IX/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-004', '/acc/purchasing-request', 1, 3, 'unread', '2022-09-21 08:48:49', '2022-09-21 08:48:49', NULL);
INSERT INTO `mjm_notifications` VALUES (161, 'New Purchasing Request', 'PR/2022/IX/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/IX/C1-004', '/acc/purchasing-request', 1, 14, 'unread', '2022-09-21 08:48:49', '2022-09-21 08:48:49', NULL);
INSERT INTO `mjm_notifications` VALUES (162, 'Approved Purchasing Request', 'PR/2022/IX/C1-004', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-004', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-21 08:48:53', '2022-09-21 08:48:53', NULL);
INSERT INTO `mjm_notifications` VALUES (163, 'Approved Purchasing Request', 'PR/2022/IX/C1-004', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/IX/C1-004', '/acc/purchasing-request', 1, 1, 'unread', '2022-09-21 08:48:53', '2022-09-21 08:48:53', NULL);
INSERT INTO `mjm_notifications` VALUES (164, 'Customer Order', 'INV220921C101.001', NULL, 'developer telah membuat order dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-21 14:27:35', '2022-09-21 14:27:35', NULL);
INSERT INTO `mjm_notifications` VALUES (165, 'Customer Order', 'INV220921C101.001', NULL, 'developer telah membuat order dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-21 14:27:35', '2022-09-21 14:27:35', NULL);
INSERT INTO `mjm_notifications` VALUES (166, 'Customer Order', 'INV220921C101.001', NULL, 'developer telah membuat order dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-21 14:27:35', '2022-09-21 14:27:35', NULL);
INSERT INTO `mjm_notifications` VALUES (167, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-21 14:51:56', '2022-09-21 14:51:56', NULL);
INSERT INTO `mjm_notifications` VALUES (168, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-21 14:51:56', '2022-09-21 14:51:56', NULL);
INSERT INTO `mjm_notifications` VALUES (169, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-21 14:51:56', '2022-09-21 14:51:56', NULL);
INSERT INTO `mjm_notifications` VALUES (170, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:30:33', '2022-09-22 11:30:33', NULL);
INSERT INTO `mjm_notifications` VALUES (171, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:30:33', '2022-09-22 11:30:33', NULL);
INSERT INTO `mjm_notifications` VALUES (172, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:30:33', '2022-09-22 11:30:33', NULL);
INSERT INTO `mjm_notifications` VALUES (173, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:39:00', '2022-09-22 11:39:00', NULL);
INSERT INTO `mjm_notifications` VALUES (174, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:39:00', '2022-09-22 11:39:00', NULL);
INSERT INTO `mjm_notifications` VALUES (175, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:39:00', '2022-09-22 11:39:00', NULL);
INSERT INTO `mjm_notifications` VALUES (176, 'Pembayaran Pelanggan', 'PAID220922C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:42:50', '2022-09-22 11:42:50', NULL);
INSERT INTO `mjm_notifications` VALUES (177, 'Pembayaran Pelanggan', 'PAID220922C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:42:50', '2022-09-22 11:42:50', NULL);
INSERT INTO `mjm_notifications` VALUES (178, 'Pembayaran Pelanggan', 'PAID220922C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:42:50', '2022-09-22 11:42:50', NULL);
INSERT INTO `mjm_notifications` VALUES (179, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:47:38', '2022-09-22 11:47:38', NULL);
INSERT INTO `mjm_notifications` VALUES (180, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:47:38', '2022-09-22 11:47:38', NULL);
INSERT INTO `mjm_notifications` VALUES (181, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:47:38', '2022-09-22 11:47:38', NULL);
INSERT INTO `mjm_notifications` VALUES (182, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:48:45', '2022-09-22 11:48:45', NULL);
INSERT INTO `mjm_notifications` VALUES (183, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:48:45', '2022-09-22 11:48:45', NULL);
INSERT INTO `mjm_notifications` VALUES (184, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:48:45', '2022-09-22 11:48:45', NULL);
INSERT INTO `mjm_notifications` VALUES (185, 'Pembayaran Pelanggan', 'PAID220922C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:51:28', '2022-09-22 11:51:28', NULL);
INSERT INTO `mjm_notifications` VALUES (186, 'Pembayaran Pelanggan', 'PAID220922C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:51:28', '2022-09-22 11:51:28', NULL);
INSERT INTO `mjm_notifications` VALUES (187, 'Pembayaran Pelanggan', 'PAID220922C101.001', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:51:28', '2022-09-22 11:51:28', NULL);
INSERT INTO `mjm_notifications` VALUES (188, 'Pembayaran Pelanggan', 'PAID220922C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.002', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:51:48', '2022-09-22 11:51:48', NULL);
INSERT INTO `mjm_notifications` VALUES (189, 'Pembayaran Pelanggan', 'PAID220922C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.002', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:51:48', '2022-09-22 11:51:48', NULL);
INSERT INTO `mjm_notifications` VALUES (190, 'Pembayaran Pelanggan', 'PAID220922C101.002', NULL, 'developer developer telah melakukan input pembayaran dengan kode PAID220922C101.002', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:51:48', '2022-09-22 11:51:48', NULL);
INSERT INTO `mjm_notifications` VALUES (191, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:53:47', '2022-09-22 11:53:47', NULL);
INSERT INTO `mjm_notifications` VALUES (192, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:53:47', '2022-09-22 11:53:47', NULL);
INSERT INTO `mjm_notifications` VALUES (193, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:53:47', '2022-09-22 11:53:47', NULL);
INSERT INTO `mjm_notifications` VALUES (194, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:54:47', '2022-09-22 11:54:47', NULL);
INSERT INTO `mjm_notifications` VALUES (195, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:54:47', '2022-09-22 11:54:47', NULL);
INSERT INTO `mjm_notifications` VALUES (196, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:54:47', '2022-09-22 11:54:47', NULL);
INSERT INTO `mjm_notifications` VALUES (197, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-22 11:57:59', '2022-09-22 11:57:59', NULL);
INSERT INTO `mjm_notifications` VALUES (198, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-22 11:57:59', '2022-09-22 11:57:59', NULL);
INSERT INTO `mjm_notifications` VALUES (199, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah melakukan ROLLBACK data invoices dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-22 11:57:59', '2022-09-22 11:57:59', NULL);
INSERT INTO `mjm_notifications` VALUES (200, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-09-24 09:25:07', '2022-09-24 09:25:07', NULL);
INSERT INTO `mjm_notifications` VALUES (201, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-09-24 09:25:07', '2022-09-24 09:25:07', NULL);
INSERT INTO `mjm_notifications` VALUES (202, 'Invoicing', 'INV220921C101.001', NULL, 'developer telah membuat invoice dengan kode INV220921C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-09-24 09:25:07', '2022-09-24 09:25:07', NULL);
INSERT INTO `mjm_notifications` VALUES (203, 'New Purchasing Request', 'PR/2022/X/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-001', '/acc/purchasing-request', 1, 2, 'unread', '2022-10-10 21:05:06', '2022-10-10 21:05:06', NULL);
INSERT INTO `mjm_notifications` VALUES (204, 'New Purchasing Request', 'PR/2022/X/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-001', '/acc/purchasing-request', 1, 3, 'unread', '2022-10-10 21:05:07', '2022-10-10 21:05:07', NULL);
INSERT INTO `mjm_notifications` VALUES (205, 'New Purchasing Request', 'PR/2022/X/C1-001', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-001', '/acc/purchasing-request', 1, 14, 'unread', '2022-10-10 21:05:08', '2022-10-10 21:05:08', NULL);
INSERT INTO `mjm_notifications` VALUES (206, 'Approved Purchasing Request', 'PR/2022/X/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-10 21:05:34', '2022-10-10 21:05:34', NULL);
INSERT INTO `mjm_notifications` VALUES (207, 'Approved Purchasing Request', 'PR/2022/X/C1-001', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-001', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-10 21:05:35', '2022-10-10 21:05:35', NULL);
INSERT INTO `mjm_notifications` VALUES (208, 'New Purchasing Request', 'PR/2022/X/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-002', '/acc/purchasing-request', 1, 2, 'unread', '2022-10-19 09:24:43', '2022-10-19 09:24:43', NULL);
INSERT INTO `mjm_notifications` VALUES (209, 'New Purchasing Request', 'PR/2022/X/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-002', '/acc/purchasing-request', 1, 3, 'unread', '2022-10-19 09:24:43', '2022-10-19 09:24:43', NULL);
INSERT INTO `mjm_notifications` VALUES (210, 'New Purchasing Request', 'PR/2022/X/C1-002', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-002', '/acc/purchasing-request', 1, 14, 'unread', '2022-10-19 09:24:43', '2022-10-19 09:24:43', NULL);
INSERT INTO `mjm_notifications` VALUES (211, 'Approved Purchasing Request', 'PR/2022/X/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-002', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-19 09:25:45', '2022-10-19 09:25:45', NULL);
INSERT INTO `mjm_notifications` VALUES (212, 'Approved Purchasing Request', 'PR/2022/X/C1-002', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-002', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-19 09:25:45', '2022-10-19 09:25:45', NULL);
INSERT INTO `mjm_notifications` VALUES (213, 'New Purchasing Request', 'PR/2022/X/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-003', '/acc/purchasing-request', 1, 2, 'unread', '2022-10-19 09:31:54', '2022-10-19 09:31:54', NULL);
INSERT INTO `mjm_notifications` VALUES (214, 'New Purchasing Request', 'PR/2022/X/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-003', '/acc/purchasing-request', 1, 3, 'unread', '2022-10-19 09:31:54', '2022-10-19 09:31:54', NULL);
INSERT INTO `mjm_notifications` VALUES (215, 'New Purchasing Request', 'PR/2022/X/C1-003', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-003', '/acc/purchasing-request', 1, 14, 'unread', '2022-10-19 09:31:54', '2022-10-19 09:31:54', NULL);
INSERT INTO `mjm_notifications` VALUES (216, 'Approved Purchasing Request', 'PR/2022/X/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-003', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-19 09:32:02', '2022-10-19 09:32:02', NULL);
INSERT INTO `mjm_notifications` VALUES (217, 'Approved Purchasing Request', 'PR/2022/X/C1-003', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-003', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-19 09:32:03', '2022-10-19 09:32:03', NULL);
INSERT INTO `mjm_notifications` VALUES (218, 'Customer Order', 'INV221019C101.001', NULL, 'developer telah membuat order dengan kode INV221019C101.001', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-10-19 11:15:36', '2022-10-19 11:15:36', NULL);
INSERT INTO `mjm_notifications` VALUES (219, 'Customer Order', 'INV221019C101.001', NULL, 'developer telah membuat order dengan kode INV221019C101.001', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-10-19 11:15:36', '2022-10-19 11:15:36', NULL);
INSERT INTO `mjm_notifications` VALUES (220, 'Customer Order', 'INV221019C101.001', NULL, 'developer telah membuat order dengan kode INV221019C101.001', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-10-19 11:15:36', '2022-10-19 11:15:36', NULL);
INSERT INTO `mjm_notifications` VALUES (221, 'Customer Order', 'INV221019C101.002', NULL, 'developer telah membuat order dengan kode INV221019C101.002', '/operational/entry-pembayaran', 1, 1, 'unread', '2022-10-19 11:56:49', '2022-10-19 11:56:49', NULL);
INSERT INTO `mjm_notifications` VALUES (222, 'Customer Order', 'INV221019C101.002', NULL, 'developer telah membuat order dengan kode INV221019C101.002', '/operational/entry-pembayaran', 1, 2, 'unread', '2022-10-19 11:56:49', '2022-10-19 11:56:49', NULL);
INSERT INTO `mjm_notifications` VALUES (223, 'Customer Order', 'INV221019C101.002', NULL, 'developer telah membuat order dengan kode INV221019C101.002', '/operational/entry-pembayaran', 1, 3, 'unread', '2022-10-19 11:56:49', '2022-10-19 11:56:49', NULL);
INSERT INTO `mjm_notifications` VALUES (224, 'New Purchasing Request', 'PR/2022/X/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-004', '/acc/purchasing-request', 1, 2, 'unread', '2022-10-20 10:10:15', '2022-10-20 10:10:15', NULL);
INSERT INTO `mjm_notifications` VALUES (225, 'New Purchasing Request', 'PR/2022/X/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-004', '/acc/purchasing-request', 1, 3, 'unread', '2022-10-20 10:10:15', '2022-10-20 10:10:15', NULL);
INSERT INTO `mjm_notifications` VALUES (226, 'New Purchasing Request', 'PR/2022/X/C1-004', NULL, 'developer meminta persetujuan untuk order barang dengan kode Purchasing PR/2022/X/C1-004', '/acc/purchasing-request', 1, 14, 'unread', '2022-10-20 10:10:15', '2022-10-20 10:10:15', NULL);
INSERT INTO `mjm_notifications` VALUES (227, 'Approved Purchasing Request', 'PR/2022/X/C1-004', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-004', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-20 10:10:22', '2022-10-20 10:10:22', NULL);
INSERT INTO `mjm_notifications` VALUES (228, 'Approved Purchasing Request', 'PR/2022/X/C1-004', NULL, 'developer menyetujui untuk order barang dengan kode Purchasing PR/2022/X/C1-004', '/acc/purchasing-request', 1, 1, 'unread', '2022-10-20 10:10:22', '2022-10-20 10:10:22', NULL);
COMMIT;

-- ----------------------------
-- Table structure for ord_pelanggan
-- ----------------------------
DROP TABLE IF EXISTS `ord_pelanggan`;
CREATE TABLE `ord_pelanggan` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `kdpesanan` varchar(255) DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `narasi` varchar(255) DEFAULT NULL,
  `tot_order` float(10,2) DEFAULT '0.00',
  `tot_service` float(10,2) DEFAULT '0.00',
  `total_trx` float(10,2) DEFAULT '0.00',
  `type_discount` enum('rupiah','persentase') DEFAULT 'rupiah',
  `barangdisc_rp` float(10,2) DEFAULT '0.00',
  `jasadisc_rp` float(10,2) DEFAULT '0.00',
  `totdisc_rp` float(10,2) DEFAULT '0.00',
  `ppn` float(3,1) DEFAULT '0.0',
  `pajak_trx` float(10,2) DEFAULT '0.00',
  `grandtot_trx` float(10,2) DEFAULT '0.00',
  `paid_trx` float(10,2) DEFAULT '0.00',
  `sisa_trx` float(10,2) DEFAULT '0.00',
  `status` enum('dp','pending','lunas','batal','ready') DEFAULT 'pending',
  `createdby` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `ord_pelanggan_pelanggan_idx` (`pelanggan_id`) USING BTREE,
  KEY `ord_pelanggan_user_idx` (`createdby`) USING BTREE,
  KEY `ord_pelanggan_cabang_idx` (`cabang_id`) USING BTREE,
  CONSTRAINT `ord_pelanggan_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ord_pelanggan_pelanggan_idx` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ord_pelanggan_user_idx` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of ord_pelanggan
-- ----------------------------
BEGIN;
INSERT INTO `ord_pelanggan` VALUES (1, 'INV221019C101.001', 1, 1, '2022-10-19 11:15:00', '', 110000.00, 0.00, 110000.00, 'rupiah', 0.00, 0.00, 0.00, 0.0, 0.00, 110000.00, 0.00, 110000.00, 'pending', 1, 'Y', '2022-10-19 11:15:36', '2022-10-19 11:17:21');
INSERT INTO `ord_pelanggan` VALUES (2, 'INV221019C101.002', 1, 1, '2022-10-19 11:57:00', 'TESTING ZUL 08', 165000.00, 0.00, 165000.00, 'rupiah', 0.00, 0.00, 0.00, 0.0, 0.00, 165000.00, 0.00, 165000.00, 'pending', 1, 'Y', '2022-10-19 11:56:48', '2022-10-19 11:56:48');
COMMIT;

-- ----------------------------
-- Table structure for ord_pelanggan_items
-- ----------------------------
DROP TABLE IF EXISTS `ord_pelanggan_items`;
CREATE TABLE `ord_pelanggan_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_id` int(10) DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(11) unsigned DEFAULT NULL,
  `qty` int(11) DEFAULT '1',
  `harga` float(10,2) DEFAULT '0.00',
  `total` float(10,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `ord_pelanggan_items_barang_idx` (`barang_id`) USING BTREE,
  KEY `ord_pelanggan_items_order_idx` (`order_id`) USING BTREE,
  KEY `ord_pelanggan_items_gudang_idx` (`gudang_id`) USING BTREE,
  CONSTRAINT `ord_pelanggan_items_barang_idx` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ord_pelanggan_items_gudang_idx` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ord_pelanggan_items_order_idx` FOREIGN KEY (`order_id`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of ord_pelanggan_items
-- ----------------------------
BEGIN;
INSERT INTO `ord_pelanggan_items` VALUES (3, 1, 1, 708, 10, 11000.00, 110000.00, 'Y', '2022-10-19 11:17:22', '2022-10-19 11:17:22');
INSERT INTO `ord_pelanggan_items` VALUES (4, 2, 1, 708, 15, 11000.00, 165000.00, 'Y', '2022-10-19 11:56:49', '2022-10-19 11:56:49');
COMMIT;

-- ----------------------------
-- Table structure for ord_pelanggan_services
-- ----------------------------
DROP TABLE IF EXISTS `ord_pelanggan_services`;
CREATE TABLE `ord_pelanggan_services` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_id` int(10) DEFAULT NULL,
  `jasa_id` int(10) DEFAULT NULL,
  `qty` int(11) DEFAULT '1',
  `harga` float(10,2) DEFAULT '0.00',
  `total` float(10,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `ord_pelanggan_services_order_idx` (`order_id`) USING BTREE,
  KEY `ord_pelanggan_services_jasa_idx` (`jasa_id`) USING BTREE,
  CONSTRAINT `ord_pelanggan_services_jasa_idx` FOREIGN KEY (`jasa_id`) REFERENCES `mas_jasas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ord_pelanggan_services_order_idx` FOREIGN KEY (`order_id`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of ord_pelanggan_services
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for pay_pelanggan
-- ----------------------------
DROP TABLE IF EXISTS `pay_pelanggan`;
CREATE TABLE `pay_pelanggan` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `order_id` int(10) DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `no_invoice` varchar(255) DEFAULT NULL,
  `no_kwitansi` varchar(255) DEFAULT NULL,
  `coa_id` int(10) DEFAULT NULL,
  `date_paid` datetime DEFAULT NULL,
  `delay_date` datetime DEFAULT NULL,
  `metode_paid` varchar(255) DEFAULT NULL,
  `kas_id` int(10) unsigned DEFAULT NULL,
  `bank_id` int(10) unsigned DEFAULT NULL,
  `paid_trx` float(10,2) DEFAULT NULL,
  `add_coa` int(10) DEFAULT NULL,
  `adm_bank` float(10,2) DEFAULT NULL,
  `narasi` varchar(255) DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `is_delay` enum('Y','N') DEFAULT 'N',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `pay_pelanggan_cabang_idx` (`cabang_id`) USING BTREE,
  KEY `pay_pelanggan_order_idx` (`order_id`) USING BTREE,
  KEY `pay_pelanggan_bank_idx` (`bank_id`) USING BTREE,
  KEY `pay_pelanggan_user_idx` (`createdby`) USING BTREE,
  KEY `pay_pelanggan_kas_idx` (`kas_id`) USING BTREE,
  CONSTRAINT `pay_pelanggan_bank_idx` FOREIGN KEY (`bank_id`) REFERENCES `keu_banks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pay_pelanggan_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pay_pelanggan_kas_idx` FOREIGN KEY (`kas_id`) REFERENCES `keu_kas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pay_pelanggan_order_idx` FOREIGN KEY (`order_id`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pay_pelanggan_user_idx` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of pay_pelanggan
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for sys_config
-- ----------------------------
DROP TABLE IF EXISTS `sys_config`;
CREATE TABLE `sys_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pajak` float(4,2) DEFAULT NULL,
  `prefix_no_barang` int(3) NOT NULL,
  `prefix_init_barang` varchar(255) NOT NULL,
  `prefix_init_pr` varchar(255) NOT NULL,
  `prefix_no_pr` int(10) NOT NULL,
  `prefix_no_receipt_brg` int(10) NOT NULL,
  `prefix_init_receipt_brg` varchar(255) NOT NULL,
  `periode_saldo` varchar(2) NOT NULL,
  `hutang_dagang_id` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `hutangdagang_idx` (`hutang_dagang_id`) USING BTREE,
  CONSTRAINT `hutangdagang_idx` FOREIGN KEY (`hutang_dagang_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sys_config
-- ----------------------------
BEGIN;
INSERT INTO `sys_config` VALUES (1, 11.00, 5, 'BRG', 'PR', 5, 5, 'FTR', '01', NULL);
COMMIT;

-- ----------------------------
-- Table structure for sys_config_documents
-- ----------------------------
DROP TABLE IF EXISTS `sys_config_documents`;
CREATE TABLE `sys_config_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_type` varchar(255) DEFAULT NULL,
  `user_id` int(10) unsigned DEFAULT NULL,
  `urut` int(10) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `documentType_user_idx` (`user_id`) USING BTREE,
  CONSTRAINT `documentType_user_idx` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sys_config_documents
-- ----------------------------
BEGIN;
INSERT INTO `sys_config_documents` VALUES (1, 'purchasing order', 1, 1, '2022-04-08 11:09:04', '2022-04-09 20:22:13');
COMMIT;

-- ----------------------------
-- Table structure for sys_menus
-- ----------------------------
DROP TABLE IF EXISTS `sys_menus`;
CREATE TABLE `sys_menus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `icon` varchar(200) NOT NULL,
  `uri` varchar(200) NOT NULL,
  `urut` int(10) DEFAULT NULL,
  `kode` varchar(3) NOT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sys_menus
-- ----------------------------
BEGIN;
INSERT INTO `sys_menus` VALUES (1, 'Master', 'mdi-database', '#', 1, 'MAS', 'Y', '2021-11-23 23:21:24', '2021-11-23 23:21:26');
INSERT INTO `sys_menus` VALUES (2, 'Akunting', 'mdi-calculator', '#', 2, 'ACC', 'Y', '2021-11-23 23:22:01', '2021-11-23 23:22:03');
INSERT INTO `sys_menus` VALUES (3, 'Logistik', 'mdi-package-variant', '#', 3, 'LOG', 'Y', '2022-09-12 11:28:49', '2022-09-12 11:28:52');
INSERT INTO `sys_menus` VALUES (4, 'CS', 'mdi-account-convert', '#', 4, 'CUS', 'Y', NULL, NULL);
INSERT INTO `sys_menus` VALUES (5, 'Kasir', 'mdi-cash-multiple', '#', 3, 'OPR', 'Y', '2021-11-24 22:27:38', '2021-11-24 22:27:41');
INSERT INTO `sys_menus` VALUES (6, 'Setting', 'mdi-settings', '#', 4, 'SET', 'Y', '2021-11-24 22:28:05', '2021-11-24 22:28:08');
INSERT INTO `sys_menus` VALUES (7, 'Notifikasi', 'mdi-bell', '#', 5, 'NOT', 'N', '2022-07-13 10:55:05', '2022-07-13 10:55:07');
COMMIT;

-- ----------------------------
-- Table structure for sys_options
-- ----------------------------
DROP TABLE IF EXISTS `sys_options`;
CREATE TABLE `sys_options` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group` varchar(30) NOT NULL,
  `teks` varchar(50) NOT NULL,
  `nilai` varchar(50) NOT NULL,
  `urut` int(11) NOT NULL,
  `status` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sys_options
-- ----------------------------
BEGIN;
INSERT INTO `sys_options` VALUES (1, 'user-groups', 'Administrator', 'administrator', 1, 'Y', '2021-03-13 16:16:35', '2021-03-13 16:16:35');
INSERT INTO `sys_options` VALUES (2, 'user-groups', 'Direktur', 'direktur', 2, 'Y', '2021-03-13 16:16:35', '2021-03-13 16:16:35');
INSERT INTO `sys_options` VALUES (3, 'user-groups', 'Finance', 'finance', 3, 'Y', '2021-03-13 16:16:35', '2021-03-13 16:16:35');
INSERT INTO `sys_options` VALUES (4, 'user-groups', 'Operation', 'operation', 4, 'Y', '2021-03-13 16:16:35', '2021-03-13 16:16:35');
INSERT INTO `sys_options` VALUES (5, 'user-groups', 'HRD', 'hrd', 5, 'Y', '2021-03-13 16:16:35', '2021-03-13 16:16:35');
INSERT INTO `sys_options` VALUES (6, 'user-groups', 'Logistik', 'logistik', 6, 'Y', '2021-03-13 16:16:35', '2021-03-13 16:16:35');
INSERT INTO `sys_options` VALUES (7, 'jenkel', 'Laki-laki', 'm', 1, 'Y', '2021-02-21 03:30:03', '2021-02-21 04:14:07');
INSERT INTO `sys_options` VALUES (8, 'jenkel', 'Perempuan', 'f', 2, 'Y', '2021-02-21 03:30:30', '2021-02-21 04:14:11');
INSERT INTO `sys_options` VALUES (10, 'satuan', 'Unit', 'unit', 1, 'Y', '2021-02-21 03:34:55', '2021-02-21 03:34:55');
INSERT INTO `sys_options` VALUES (11, 'satuan', 'Karton', 'karton', 2, 'Y', '2021-02-21 03:44:42', '2021-02-21 04:13:52');
INSERT INTO `sys_options` VALUES (12, 'satuan', 'Roll', 'roll', 3, 'Y', '2021-02-21 04:14:55', '2021-02-21 04:14:55');
INSERT INTO `sys_options` VALUES (13, 'satuan', 'Galon', 'galon', 4, 'Y', '2021-02-21 04:16:03', '2021-02-21 04:16:03');
INSERT INTO `sys_options` VALUES (14, 'satuan', 'Botol', 'botol', 5, 'Y', '2021-02-21 04:16:18', '2021-02-21 04:16:18');
INSERT INTO `sys_options` VALUES (15, 'satuan', 'Lusin', 'lusin', 6, 'Y', '2021-02-21 04:16:46', '2021-02-21 04:16:46');
INSERT INTO `sys_options` VALUES (16, 'satuan', 'Gross', 'gross', 7, 'Y', '2021-02-21 04:16:57', '2021-02-21 04:16:57');
INSERT INTO `sys_options` VALUES (17, 'satuan', 'Pack', 'pack', 8, 'Y', '2021-02-21 04:17:19', '2021-02-21 04:17:19');
INSERT INTO `sys_options` VALUES (18, 'tipe-barang', 'Unit', 'unit', 1, 'Y', '2021-02-22 20:08:48', '2021-02-22 20:08:48');
INSERT INTO `sys_options` VALUES (19, 'tipe-barang', 'SparePart', 'sparepart', 2, 'Y', '2021-02-22 20:09:24', '2021-02-22 20:09:24');
INSERT INTO `sys_options` VALUES (20, 'divisi', 'Operational', 'operational', 1, 'Y', '2021-02-25 05:38:41', '2021-02-25 05:38:41');
INSERT INTO `sys_options` VALUES (21, 'divisi', 'Logistik', 'logistik', 2, 'Y', '2021-02-25 05:38:59', '2021-02-25 05:38:59');
INSERT INTO `sys_options` VALUES (22, 'divisi', 'Akunting', 'akunting', 3, 'Y', '2021-02-25 05:39:12', '2021-02-25 05:39:12');
INSERT INTO `sys_options` VALUES (23, 'jabatan', 'Owner', 'owner', 1, 'Y', '2021-02-25 05:39:29', '2021-02-25 05:39:29');
INSERT INTO `sys_options` VALUES (24, 'jabatan', 'Manager', 'manager', 2, 'Y', '2021-02-25 05:39:44', '2021-02-25 05:39:44');
INSERT INTO `sys_options` VALUES (25, 'pesanan_prioritas', 'Urgent', 'urgent', 1, 'Y', '2021-03-11 02:41:36', '2021-03-11 02:42:53');
INSERT INTO `sys_options` VALUES (26, 'pesanan_prioritas', 'Stock', 'stock', 2, 'Y', '2021-03-11 02:41:58', '2021-03-11 02:43:03');
INSERT INTO `sys_options` VALUES (27, 'pesanan_prioritas', 'Lainnya', 'lainnya', 3, 'Y', '2021-03-11 02:42:09', '2021-03-11 02:43:13');
INSERT INTO `sys_options` VALUES (30, 'pesanan_prioritas', 'Baru', 'baru', 4, 'Y', '2021-03-21 18:15:10', '2021-03-21 18:15:10');
INSERT INTO `sys_options` VALUES (31, 'satuan', 'Batang', 'batang', 9, 'Y', '2021-03-28 22:45:02', '2021-03-28 22:45:02');
INSERT INTO `sys_options` VALUES (32, 'satuan', 'Kilogram', 'kg', 10, 'Y', '2021-04-02 13:37:13', '2021-04-02 13:37:13');
INSERT INTO `sys_options` VALUES (33, 'satuan', 'SET', 'set', 11, 'Y', '2021-04-11 00:29:41', '2021-04-11 00:29:44');
INSERT INTO `sys_options` VALUES (34, 'satuan', 'Liter', 'liter', 12, 'Y', '2021-04-11 00:31:50', '2021-04-11 00:31:50');
INSERT INTO `sys_options` VALUES (35, 'satuan', 'Pasang', 'pasang', 13, 'Y', '2021-04-11 00:32:39', '2021-04-11 00:32:39');
INSERT INTO `sys_options` VALUES (36, 'satuan', 'Blok', 'blok', 14, 'Y', '2021-04-11 00:33:27', '2021-04-11 00:33:27');
INSERT INTO `sys_options` VALUES (37, 'satuan', 'CM', 'cm', 15, 'Y', '2021-04-11 00:33:45', '2021-04-11 00:33:45');
INSERT INTO `sys_options` VALUES (38, 'satuan', 'Kaleng', 'kaleng', 16, 'Y', '2021-04-11 00:34:03', '2021-04-11 00:34:03');
INSERT INTO `sys_options` VALUES (39, 'satuan', 'Meter', 'meter', 17, 'Y', '2021-04-11 00:34:22', '2021-04-11 00:34:22');
INSERT INTO `sys_options` VALUES (40, 'satuan', 'PAIL', 'pail', 18, 'Y', '2021-04-11 00:34:47', '2021-04-11 00:34:47');
INSERT INTO `sys_options` VALUES (41, 'user-groups', 'Staff', 'staff', 7, 'Y', '2021-04-11 01:01:17', '2021-04-11 01:01:17');
INSERT INTO `sys_options` VALUES (42, 'satuan', 'Pcs', 'pcs', 19, 'Y', '2021-04-12 23:23:19', '2021-04-12 23:23:22');
INSERT INTO `sys_options` VALUES (43, 'jabatan', 'Operator', 'operator', 3, 'Y', '2021-05-09 19:54:35', '2021-05-09 19:54:38');
INSERT INTO `sys_options` VALUES (44, 'services-priority', 'High Priority', 'p1', 1, 'Y', '2021-08-03 23:19:51', '2021-08-03 23:21:04');
INSERT INTO `sys_options` VALUES (45, 'services-priority', 'Medium Priority', 'p2', 2, 'Y', '2021-08-03 23:20:02', '2021-08-03 23:21:25');
INSERT INTO `sys_options` VALUES (46, 'services-priority', 'Low Priority', 'p3', 3, 'Y', '2021-08-03 23:20:26', '2021-08-03 23:21:43');
INSERT INTO `sys_options` VALUES (61, 'prioritas', 'High Priority', 'P1', 1, 'Y', '2021-12-05 13:11:59', '2021-12-05 13:11:59');
INSERT INTO `sys_options` VALUES (62, 'prioritas', 'Medium Priority', 'P2', 2, 'Y', '2021-12-05 13:11:59', '2021-12-05 13:11:59');
INSERT INTO `sys_options` VALUES (63, 'prioritas', 'Low Priority', 'P3', 3, 'Y', '2021-12-05 13:11:59', '2021-12-05 13:11:59');
INSERT INTO `sys_options` VALUES (64, 'metode-bayar', 'TUNAI', 'tunai', 1, 'Y', '2021-12-06 16:14:11', '2021-12-06 16:14:14');
INSERT INTO `sys_options` VALUES (65, 'metode-bayar', 'KREDIT', 'kredit', 2, 'Y', '2021-12-06 16:14:35', '2021-12-06 16:14:38');
INSERT INTO `sys_options` VALUES (66, 'tipe-cabang', 'PUSAT', 'PUSAT', 1, 'Y', '2022-01-17 09:11:23', '2022-01-17 09:11:25');
INSERT INTO `sys_options` VALUES (67, 'tipe-cabang', 'CABANG', 'CAB', 2, 'Y', '2022-01-17 09:11:56', '2022-01-17 09:11:58');
INSERT INTO `sys_options` VALUES (74, 'golongan-karyawan', 'Manager', 'MGR', 1, 'N', '2022-01-31 11:47:54', '2022-01-31 11:47:57');
INSERT INTO `sys_options` VALUES (75, 'golongan-karyawan', 'Asst. Manager', 'Asst MGR', 2, 'N', '2022-01-31 11:48:19', '2022-01-31 11:48:21');
INSERT INTO `sys_options` VALUES (76, 'golongan-karyawan', 'STAFF', 'staff', 3, 'N', '2022-01-31 11:49:07', '2022-01-31 11:49:10');
INSERT INTO `sys_options` VALUES (77, 'status-karyawan', 'Karyawan Tetap', 'tetap', 1, 'Y', '2022-01-31 11:49:07', '2022-01-31 11:49:07');
INSERT INTO `sys_options` VALUES (78, 'status-karyawan', 'Kontrak/PKWT', 'kontrak', 2, 'Y', '2022-01-31 11:49:07', '2022-01-31 11:49:07');
INSERT INTO `sys_options` VALUES (79, 'status-karyawan', 'Paruh Waktu', 'part-time', 3, 'Y', '2022-01-31 11:49:07', '2022-01-31 11:49:07');
INSERT INTO `sys_options` VALUES (80, 'pernikahan-karyawan', 'Single', 'single', 1, 'Y', '2022-01-31 11:59:45', '2022-01-31 11:59:45');
INSERT INTO `sys_options` VALUES (81, 'pernikahan-karyawan', 'Menikah', 'menikah', 2, 'Y', '2022-01-31 11:59:45', '2022-01-31 11:59:45');
INSERT INTO `sys_options` VALUES (82, 'pernikahan-karyawan', 'Duda', 'duda', 3, 'Y', '2022-01-31 11:59:45', '2022-01-31 11:59:45');
INSERT INTO `sys_options` VALUES (83, 'pernikahan-karyawan', 'Janda', 'janda', 4, 'Y', '2022-01-31 11:59:45', '2022-01-31 11:59:45');
INSERT INTO `sys_options` VALUES (84, 'gaji-tipe', 'Tetap', 'tetap', 1, 'Y', '2022-01-31 12:03:47', '2022-01-31 12:03:47');
INSERT INTO `sys_options` VALUES (85, 'gaji-tipe', 'Tdk Tetap', 'tdk tetap', 2, 'Y', '2022-01-31 12:03:47', '2022-01-31 12:03:47');
INSERT INTO `sys_options` VALUES (86, 'sex', 'Laki-laki', 'm', 1, 'Y', '2022-02-02 08:59:39', '2022-02-02 08:59:41');
INSERT INTO `sys_options` VALUES (87, 'sex', 'Perempuan', 'f', 2, 'Y', '2022-02-02 09:00:02', '2022-02-02 09:00:04');
INSERT INTO `sys_options` VALUES (88, 'section-karyawan', 'Kasir', 'kasir', 1, 'Y', '2022-02-03 10:06:57', '2022-02-03 10:07:00');
INSERT INTO `sys_options` VALUES (89, 'section-karyawan', 'Gudang', 'gudang', 2, 'Y', '2022-02-03 10:07:40', '2022-02-03 10:07:42');
INSERT INTO `sys_options` VALUES (90, 'section-karyawan', 'Staff', 'staff', 3, 'Y', '2022-02-03 10:08:07', '2022-02-03 10:08:10');
INSERT INTO `sys_options` VALUES (92, 'shift', 'Shift-Siang', '1', 1, 'Y', '2022-02-03 10:54:41', '2022-02-03 10:54:44');
INSERT INTO `sys_options` VALUES (93, 'shift', 'Shift-Malam', '2', 2, 'Y', '2022-02-03 10:55:11', '2022-02-03 10:55:14');
INSERT INTO `sys_options` VALUES (94, 'mutasi-status', 'Tunda', 'tunda', 1, 'Y', '2022-06-28 23:23:13', '2022-06-28 23:23:13');
INSERT INTO `sys_options` VALUES (95, 'mutasi-status', 'Sesuai', 'sesuai', 2, 'Y', '2022-06-28 23:23:13', '2022-06-28 23:23:13');
COMMIT;

-- ----------------------------
-- Table structure for sys_submenus
-- ----------------------------
DROP TABLE IF EXISTS `sys_submenus`;
CREATE TABLE `sys_submenus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `menu_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(30) NOT NULL,
  `icon` varchar(200) NOT NULL,
  `uri` varchar(200) NOT NULL,
  `alias` varchar(200) DEFAULT '',
  `urut` int(10) DEFAULT NULL,
  `kode` varchar(3) NOT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `sys_submenus_menu_id_foreign` (`menu_id`) USING BTREE,
  CONSTRAINT `sys_submenus_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `sys_menus` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sys_submenus
-- ----------------------------
BEGIN;
INSERT INTO `sys_submenus` VALUES (1, 1, 'Unit Bisnis', 'ti-angle-right', 'mas.bisnis', 'master/bisnis', 1, '01', 'N', '2021-11-23 23:24:05', '2021-11-23 23:24:07');
INSERT INTO `sys_submenus` VALUES (2, 1, 'Cabang', 'ti-angle-right', 'mas.cabang', 'master/cabang', 2, '02', 'Y', '2021-11-24 08:44:52', '2021-11-24 08:44:55');
INSERT INTO `sys_submenus` VALUES (3, 6, 'COA', 'ti-angle-right', 'set.coa', 'setting/coa', 99, '99', 'Y', '2021-11-24 22:25:10', '2021-11-24 22:25:12');
INSERT INTO `sys_submenus` VALUES (4, 2, 'Ringkasan', 'ti-angle-right', 'acc.ringkasan', 'akunting/ringkasan', 1, '01', 'Y', '2021-12-01 15:56:29', '2021-12-01 15:56:32');
INSERT INTO `sys_submenus` VALUES (5, 2, 'Akun Bank & Kas', 'ti-angle-right', 'acc.kas-bank', 'akunting/kas-bank', 2, '02', 'Y', '2021-12-01 16:21:29', '2021-12-01 16:21:32');
INSERT INTO `sys_submenus` VALUES (6, 2, 'Purchase Requisition', 'ti-angle-right', 'acc.purchasing-request', 'akunting/purchasing-request', 3, '03', 'Y', '2021-12-04 23:20:58', '2021-12-04 23:21:01');
INSERT INTO `sys_submenus` VALUES (7, 2, 'Faktur Pembelian', 'ti-angle-right', 'acc.faktur-pembelian', 'akunting/faktur-pembelian', 4, '04', 'Y', '2021-12-08 10:09:00', '2021-12-08 10:09:03');
INSERT INTO `sys_submenus` VALUES (8, 3, 'Terima Barang', 'ti-angle-right', 'log.terima-barang', 'logistik/terima-barang', 1, '01', 'Y', '2021-12-08 10:09:52', '2021-12-08 10:09:55');
INSERT INTO `sys_submenus` VALUES (9, 2, 'Faktur Penjualan', 'ti-angle-right', 'acc.faktur-jual', 'akunting/faktur-jual', 6, '06', 'N', '2021-12-13 01:17:14', '2021-12-13 01:17:17');
INSERT INTO `sys_submenus` VALUES (10, 2, 'Persediaan Barang', 'ti-angle-right', 'acc.persediaan-barang', 'akunting/persediaan-barang', 7, '07', 'Y', '2021-12-19 19:42:53', '2021-12-19 19:42:56');
INSERT INTO `sys_submenus` VALUES (11, 2, 'Penerimaan Keuangan', 'ti-angle-right', 'acc.keu-penerimaan', 'akunting/keu-penerimaan', 8, '08', 'Y', '2021-12-21 15:24:41', '2021-12-21 15:24:44');
INSERT INTO `sys_submenus` VALUES (12, 2, 'Pembayaran Pusat', 'ti-angle-right', 'acc.keu-pembayaran', 'akunting/pembayaran', 9, '09', 'Y', '2021-12-28 12:27:38', '2021-12-28 12:27:41');
INSERT INTO `sys_submenus` VALUES (13, 2, 'Entri Jurnal', 'ti-angle-right', 'acc.entri-jurnal', 'akunting/entri-jurnal', 10, '10', 'Y', '2022-01-03 16:17:35', '2022-01-03 16:17:38');
INSERT INTO `sys_submenus` VALUES (14, 6, 'User Privilages', 'ti-angle-right', 'set.users-privilages', 'setting/users-privilages', 2, '02', 'Y', '2022-01-07 01:22:17', '2022-01-07 01:22:19');
INSERT INTO `sys_submenus` VALUES (15, 1, 'User', 'ti-angle-right', 'mas.users', 'master/users', 3, '03', 'Y', '2022-01-07 01:25:51', '2022-01-07 01:25:54');
INSERT INTO `sys_submenus` VALUES (16, 1, 'Barang', 'ti-angle-right', 'mas.barang', 'master/barang', 4, '04', 'Y', '2022-01-07 01:44:35', '2022-01-07 01:44:39');
INSERT INTO `sys_submenus` VALUES (17, 6, 'Menu Akses', 'ti-angle-right', 'set.users-menu', 'setting/users-menu', 3, '03', 'Y', '2022-01-15 10:08:23', '2022-01-15 10:08:26');
INSERT INTO `sys_submenus` VALUES (18, 1, 'Gudang', 'ti-angle-right', 'mas.gudang', 'master/gudang', 5, '05', 'Y', '2022-01-17 10:26:01', '2022-01-17 10:26:03');
INSERT INTO `sys_submenus` VALUES (19, 1, 'Rak', 'ti-angle-right', 'mas.rack', 'master/rack', 6, '06', 'Y', '2022-01-17 10:27:50', '2022-01-17 10:27:53');
INSERT INTO `sys_submenus` VALUES (20, 6, 'Options', 'ti-angle-right', 'set.options', 'setting/options', 7, '07', 'Y', '2022-01-17 10:29:57', '2022-01-17 10:30:04');
INSERT INTO `sys_submenus` VALUES (21, 1, 'Pemasok', 'ti-angle-right', 'mas.pemasok', 'master/pemasok', 8, '08', 'N', '2022-01-17 10:32:25', '2022-01-17 10:32:28');
INSERT INTO `sys_submenus` VALUES (22, 1, 'Pelanggan', 'ti-angle-right', 'mas.pelanggan', 'master/pelanggan', 9, '09', 'N', '2022-01-17 10:33:29', '2022-01-17 10:33:26');
INSERT INTO `sys_submenus` VALUES (23, 1, 'Karyawan', 'ti-angle-right', 'mas.karyawan', 'master/karyawan', 10, '10', 'Y', '2022-01-31 15:18:43', '2022-01-31 15:18:45');
INSERT INTO `sys_submenus` VALUES (24, 1, 'Bin', 'ti-angle-right', 'mas.bin', 'master/bin', 11, '11', 'Y', '2022-02-04 10:05:03', '2022-02-04 10:05:06');
INSERT INTO `sys_submenus` VALUES (25, 4, 'Entry Order', 'ti-angle-right', 'ops.entry-order', 'operational/entry-order', 2, '02', 'Y', '2022-02-04 10:06:24', '2022-02-04 10:06:27');
INSERT INTO `sys_submenus` VALUES (26, 5, 'Equipment Backlog', 'ti-angle-right', 'ops.backlog', 'operational/backlog', 3, '03', 'N', '2022-02-04 10:06:24', '2022-02-04 10:06:24');
INSERT INTO `sys_submenus` VALUES (27, 5, 'Equipment OnProses', 'ti-angle-right', 'ops.onproses', 'operational/onproses', 4, '04', 'N', '2022-02-04 10:06:24', '2022-02-04 10:06:24');
INSERT INTO `sys_submenus` VALUES (28, 5, 'Equipment Services Log', 'ti-angle-right', 'ops.services-log', 'operational/services-log', 5, '05', 'N', '2022-02-04 10:06:24', '2022-02-04 10:06:24');
INSERT INTO `sys_submenus` VALUES (29, 1, 'Harga Barang', 'ti-angle-right', 'mas.barang-harga', 'master/barang-harga', 4, '04', 'Y', '2022-02-06 11:14:13', '2022-02-06 11:14:16');
INSERT INTO `sys_submenus` VALUES (30, 2, 'Transfer Kas & Bank', 'ti-angle-right', 'acc.transfer-kasbank', 'akunting/transfer-kasbank', 11, '11', 'Y', '2022-02-06 20:48:50', '2022-02-06 20:48:52');
INSERT INTO `sys_submenus` VALUES (31, 2, 'Saldo Awal', 'ti-angle-right', 'acc.saldo-awal', 'akunting/saldo-awal', 12, '12', 'Y', '2022-02-08 14:22:34', '2022-02-08 14:22:36');
INSERT INTO `sys_submenus` VALUES (32, 2, 'Pindah Persediaan', 'ti-angle-right', 'acc.pemindahan-persediaan', 'akunting/pemindahan-persediaan', 13, '13', 'Y', '2022-02-09 15:37:44', '2022-02-09 15:37:46');
INSERT INTO `sys_submenus` VALUES (33, 2, 'Hapus Persediaan', 'ti-angle-right', 'acc.hapus-persediaan', 'akunting/hapus-persediaan', 14, '14', 'Y', '2022-02-10 11:07:58', '2022-02-10 11:08:01');
INSERT INTO `sys_submenus` VALUES (34, 5, 'PM Monitoring', 'ti-angle-right', 'ops.pm-monitoring', 'operational/pm-monitoring', 6, '06', 'N', '2022-03-06 18:13:56', '2022-03-06 18:13:58');
INSERT INTO `sys_submenus` VALUES (35, 1, 'Brands Barang', 'ti-angle-right', 'mas.brands', 'master/brands', 12, '12', 'Y', '2022-02-04 10:05:03', '2022-02-04 10:05:06');
INSERT INTO `sys_submenus` VALUES (36, 1, 'Kategori Barang', 'ti-angle-right', 'mas.kategori', 'master/kategori', 13, '13', 'Y', '2022-02-04 10:05:03', '2022-02-04 10:05:06');
INSERT INTO `sys_submenus` VALUES (37, 1, 'SubKategori Barang', 'ti-angle-right', 'mas.sub-kategori', 'master/sub-kategori', 14, '14', 'Y', '2022-02-04 10:05:03', '2022-02-04 10:05:06');
INSERT INTO `sys_submenus` VALUES (38, 1, 'Biaya Jasa', 'ti-angle-right', 'mas.jasa', 'master/jasa', 15, '15', 'Y', '2022-04-09 21:23:43', '2022-04-09 21:23:52');
INSERT INTO `sys_submenus` VALUES (39, 5, 'Pembayaran Pelanggan', 'ti-angle-right', 'ops.entry-pembayaran', 'operational/entry-pembayaran', 3, '03', 'Y', '2022-02-04 10:06:24', '2022-02-04 10:06:27');
INSERT INTO `sys_submenus` VALUES (40, 3, 'Stok Opname', 'ti-angle-right', 'log.stok-opname', 'logistik/stok-opname', 2, '02', 'Y', '2022-09-12 11:30:26', '2022-09-12 11:30:29');
COMMIT;

-- ----------------------------
-- Table structure for tokens
-- ----------------------------
DROP TABLE IF EXISTS `tokens`;
CREATE TABLE `tokens` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `token` varchar(255) NOT NULL,
  `type` varchar(80) NOT NULL,
  `is_revoked` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `tokens_token_unique` (`token`) USING BTREE,
  KEY `tokens_user_id_foreign` (`user_id`) USING BTREE,
  KEY `tokens_token_index` (`token`) USING BTREE,
  CONSTRAINT `tokens_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tokens
-- ----------------------------
BEGIN;
INSERT INTO `tokens` VALUES (1, 1, 'ad042676-4fa4-4aa9-9d00-1c9a008e4159', 'jwt_refresh_token', 0, '2022-10-23 17:36:38', '2022-10-23 17:36:38');
INSERT INTO `tokens` VALUES (2, 1, '4be8d297-1c32-4a5d-85a6-888e765e0a12', 'jwt_refresh_token', 0, '2022-10-23 21:49:16', '2022-10-23 21:49:16');
COMMIT;

-- ----------------------------
-- Table structure for trx_banks
-- ----------------------------
DROP TABLE IF EXISTS `trx_banks`;
CREATE TABLE `trx_banks` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_date` date DEFAULT NULL,
  `mutasi` varchar(50) DEFAULT NULL,
  `bank_id` int(10) unsigned DEFAULT NULL,
  `paid_id` int(10) DEFAULT NULL,
  `keubayar_id` int(10) unsigned DEFAULT NULL,
  `keuterima_id` int(10) unsigned DEFAULT NULL,
  `ja_id` int(10) unsigned DEFAULT NULL,
  `trf_id` int(10) unsigned DEFAULT NULL,
  `saldo_net` float(20,2) DEFAULT '0.00',
  `setor_tunda` float(20,2) DEFAULT '0.00',
  `tarik_tunda` float(20,2) DEFAULT '0.00',
  `saldo_rill` float(20,2) DEFAULT '0.00',
  `desc` varchar(200) DEFAULT '',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `foreign_bank_idx` (`bank_id`) USING BTREE,
  KEY `foreign_bank_bukti_bayar_idx` (`keubayar_id`) USING BTREE,
  KEY `foreign_bank_jurnal_adjust_idx` (`ja_id`) USING BTREE,
  KEY `foreign_bank_transfer_kasbank_idx` (`trf_id`) USING BTREE,
  KEY `trx_bank_paid_idx_foreign` (`paid_id`) USING BTREE,
  KEY `foreign_bank_bukti_terima_idx` (`keuterima_id`) USING BTREE,
  CONSTRAINT `foreign_bank_bukti_bayar_idx` FOREIGN KEY (`keubayar_id`) REFERENCES `keu_pembayarans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_bank_bukti_terima_idx` FOREIGN KEY (`keuterima_id`) REFERENCES `keu_penerimaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_bank_idx` FOREIGN KEY (`bank_id`) REFERENCES `keu_banks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_bank_jurnal_adjust_idx` FOREIGN KEY (`ja_id`) REFERENCES `keu_jurnal_penyesuaian_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_bank_transfer_kasbank_idx` FOREIGN KEY (`trf_id`) REFERENCES `keu_transfer_kasbanks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_bank_paid_idx_foreign` FOREIGN KEY (`paid_id`) REFERENCES `pay_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_banks
-- ----------------------------
BEGIN;
INSERT INTO `trx_banks` VALUES (1, '2022-10-10', 'KEU-TERIMA/2022/X-0001', 11101, NULL, NULL, 1, NULL, NULL, 0.00, 0.00, 50000000.00, 0.00, '[ KEU-TERIMA/2022/X-0001 ] Penerimaan Pembayaran', 'N', '2022-10-10 21:19:43', '2022-10-13 11:15:52');
INSERT INTO `trx_banks` VALUES (2, '2022-10-10', 'TESTINGZUL05', 11101, NULL, 1, NULL, NULL, NULL, 200000.00, 0.00, 0.00, 0.00, '[ TESTINGZUL05 ] PEMBAYARAN HUTANG AYAT INV TESTINGZUL05', 'Y', '2022-10-10 21:25:38', '2022-10-10 21:25:38');
INSERT INTO `trx_banks` VALUES (3, '2022-10-10', 'KEU-TERIMA/2022/X-0001', 11101, NULL, NULL, 1, NULL, NULL, 0.00, 0.00, 40000000.00, 0.00, '[ KEU-TERIMA/2022/X-0001 ] Pembayaran Akun Faktur', 'N', '2022-10-13 11:15:52', '2022-10-13 11:16:28');
INSERT INTO `trx_banks` VALUES (4, '2022-10-10', 'KEU-TERIMA/2022/X-0001', 11101, NULL, NULL, 1, NULL, NULL, 0.00, 0.00, 50000000.00, 0.00, '[ KEU-TERIMA/2022/X-0001 ] Pembayaran Akun Faktur', 'N', '2022-10-13 11:16:28', '2022-10-13 12:02:58');
INSERT INTO `trx_banks` VALUES (7, '2022-10-10', 'KEU-TERIMA/2022/X-0001', 11101, NULL, NULL, 1, NULL, NULL, 0.00, 0.00, 50000000.00, 0.00, '[ KEU-TERIMA/2022/X-0001 ] Pembayaran Akun Faktur', 'N', '2022-10-13 12:02:58', '2022-10-13 12:03:16');
INSERT INTO `trx_banks` VALUES (8, '2022-10-10', 'KEU-TERIMA/2022/X-0001', 11101, NULL, NULL, 1, NULL, NULL, 50000000.00, 0.00, 0.00, 0.00, '[ KEU-TERIMA/2022/X-0001 ] Pembayaran Akun Faktur', 'Y', '2022-10-13 12:03:16', '2022-10-20 16:12:55');
INSERT INTO `trx_banks` VALUES (9, '2022-10-19', 'TESTING ZUL 07', 11101, NULL, 2, NULL, NULL, NULL, 0.00, 0.00, 1387500.00, 0.00, '[ TESTING ZUL 07 ] TESTING ZUL 07', 'Y', '2022-10-19 10:11:30', '2022-10-19 10:11:30');
INSERT INTO `trx_banks` VALUES (10, '2022-10-19', 'KEU-TERIMA/2022/X-0003', 11101, NULL, NULL, 3, NULL, NULL, 35000000.00, 0.00, 0.00, 0.00, '[ KEU-TERIMA/2022/X-0003 ] Penerimaan Pembayaran', 'Y', '2022-10-19 19:16:33', '2022-10-20 16:13:05');
COMMIT;

-- ----------------------------
-- Table structure for trx_faktur_beli_bayars
-- ----------------------------
DROP TABLE IF EXISTS `trx_faktur_beli_bayars`;
CREATE TABLE `trx_faktur_beli_bayars` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `bbi_id` int(10) unsigned DEFAULT NULL,
  `trx_beli` int(10) unsigned DEFAULT NULL,
  `no_faktur` varchar(30) DEFAULT NULL,
  `no_paid` varchar(30) NOT NULL,
  `date_paid` date NOT NULL,
  `tipe_paid` enum('cash','transfer','giro') DEFAULT 'cash',
  `nilai_paid` float(20,2) DEFAULT '0.00',
  `narasi` varchar(200) DEFAULT '',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_beli_bayars_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_faktur_beli_bayars_trx_beli_foreign` (`trx_beli`) USING BTREE,
  KEY `trx_faktur_beli_bayars_bb_id_foreign` (`bbi_id`) USING BTREE,
  CONSTRAINT `trx_faktur_beli_bayars_bb_id_foreign` FOREIGN KEY (`bbi_id`) REFERENCES `keu_pembayaran_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_beli_bayars_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_beli_bayars_trx_beli_foreign` FOREIGN KEY (`trx_beli`) REFERENCES `xxx_trx_faktur_belis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_faktur_beli_bayars
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_faktur_belis
-- ----------------------------
DROP TABLE IF EXISTS `trx_faktur_belis`;
CREATE TABLE `trx_faktur_belis` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `reff_ro` varchar(255) DEFAULT NULL,
  `kode` varchar(255) DEFAULT NULL,
  `total` float(20,2) DEFAULT '0.00',
  `sisa` float(20,2) DEFAULT '0.00',
  `sts_paid` enum('bersisa','lunas') DEFAULT 'bersisa',
  `date_faktur` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_belis_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_faktur_belis_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_faktur_belis_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_faktur_belis_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_faktur_belis_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `trx_faktur_belis_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_belis_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_belis_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_belis_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_belis_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_faktur_belis
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_faktur_belis_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_faktur_belis_items`;
CREATE TABLE `trx_faktur_belis_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fakturbeli_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `kode_coa` varchar(200) DEFAULT NULL,
  `qty` float(8,2) DEFAULT '0.00',
  `stn` varchar(255) DEFAULT NULL,
  `harga_stn` float(20,2) DEFAULT '0.00',
  `harga_pot` float(20,2) DEFAULT '0.00',
  `subtotal` float(20,2) DEFAULT '0.00',
  `equipment_id` int(10) unsigned DEFAULT NULL,
  `description` varchar(200) DEFAULT '',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_belis_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_faktur_belis_items_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `trx_faktur_belis_items_equipment_id_foreign` (`equipment_id`) USING BTREE,
  KEY `trx_faktur_belis_items_fakturbeli_id_foreign` (`fakturbeli_id`) USING BTREE,
  CONSTRAINT `trx_faktur_belis_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_belis_items_coa_id_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_belis_items_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `mas_equipment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_belis_items_fakturbeli_id_foreign` FOREIGN KEY (`fakturbeli_id`) REFERENCES `trx_faktur_belis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_faktur_belis_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_faktur_jual_bayars
-- ----------------------------
DROP TABLE IF EXISTS `trx_faktur_jual_bayars`;
CREATE TABLE `trx_faktur_jual_bayars` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `tti_id` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) unsigned DEFAULT NULL,
  `no_faktur` varchar(30) NOT NULL,
  `no_paid` varchar(30) NOT NULL,
  `date_paid` date NOT NULL,
  `tipe_paid` enum('cash','transfer','giro') DEFAULT 'cash',
  `nilai_paid` float(20,2) DEFAULT '0.00',
  `narasi` varchar(200) DEFAULT '',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_jual_bayars_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_faktur_jual_bayars_trx_jual_foreign` (`trx_jual`) USING BTREE,
  KEY `trx_faktur_jual_bayars_tt_id_foreign` (`tti_id`) USING BTREE,
  CONSTRAINT `trx_faktur_jual_bayars_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_jual_bayars_trx_jual_foreign` FOREIGN KEY (`trx_jual`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_jual_bayars_tti_id_foreign` FOREIGN KEY (`tti_id`) REFERENCES `trx_tanda_terima_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_faktur_jual_bayars
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_faktur_jual_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_faktur_jual_items`;
CREATE TABLE `trx_faktur_jual_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trx_jual` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `equipment_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `kode_coa` varchar(100) NOT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `qty` float(10,2) DEFAULT '0.00',
  `satuan` varchar(25) DEFAULT 'HM',
  `harga_stn` float(20,2) DEFAULT '0.00',
  `harga_tot` float(20,2) DEFAULT '0.00',
  `harga_pot` float(20,2) DEFAULT '0.00',
  `subtotal` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_jual_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_faktur_jual_items_equipment_id_foreign` (`equipment_id`) USING BTREE,
  KEY `trx_faktur_jual_items_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_faktur_jual_items_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_faktur_jual_items_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `trx_faktur_jual_items_trx_jual_foreign` (`trx_jual`) USING BTREE,
  CONSTRAINT `trx_faktur_jual_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_jual_items_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_jual_items_coa_id_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_jual_items_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `mas_equipment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_jual_items_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_jual_items_trx_jual_foreign` FOREIGN KEY (`trx_jual`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_faktur_jual_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_faktur_juals
-- ----------------------------
DROP TABLE IF EXISTS `trx_faktur_juals`;
CREATE TABLE `trx_faktur_juals` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `cust_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `date_trx` date NOT NULL,
  `date_due` date NOT NULL,
  `reff` varchar(255) DEFAULT NULL,
  `no_faktur` varchar(25) NOT NULL,
  `no_order` varchar(50) DEFAULT NULL,
  `narasi` varchar(255) DEFAULT NULL,
  `totharga` float(20,2) DEFAULT '0.00',
  `totpot` float(20,2) DEFAULT '0.00',
  `grandtotal` float(20,2) DEFAULT '0.00',
  `sisa` float(20,2) DEFAULT '0.00',
  `bayar` float(20,2) DEFAULT '0.00',
  `status` enum('lunas','bersisa') DEFAULT 'bersisa',
  `expired` enum('Y','N') DEFAULT 'N',
  `title` varchar(200) DEFAULT '',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_faktur_juals_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_faktur_juals_cust_id_foreign` (`cust_id`) USING BTREE,
  KEY `trx_faktur_juals_createdby_foreign` (`createdby`) USING BTREE,
  KEY `trx_faktur_juals_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_faktur_juals_cabang_id_foreign` (`cabang_id`) USING BTREE,
  CONSTRAINT `trx_faktur_juals_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_juals_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_juals_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_juals_cust_id_foreign` FOREIGN KEY (`cust_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_faktur_juals_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_faktur_juals
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_hapus_persediaan_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_hapus_persediaan_items`;
CREATE TABLE `trx_hapus_persediaan_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `hapus_id` int(10) DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `equipment_id` int(10) unsigned DEFAULT NULL,
  `coa_kredit` int(10) unsigned DEFAULT NULL,
  `coa_kode` varchar(10) DEFAULT NULL,
  `qty` float(10,2) DEFAULT NULL,
  `avg_harga` float(20,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_hapus_persediaan_item_hapus_idx` (`hapus_id`) USING BTREE,
  KEY `trx_hapus_persediaan_item_barang_idx` (`barang_id`) USING BTREE,
  KEY `trx_hapus_persediaan_item_coa_debit_idx` (`coa_kredit`) USING BTREE,
  KEY `trx_hapus_persediaan_item_equipment_idx` (`equipment_id`) USING BTREE,
  CONSTRAINT `trx_hapus_persediaan_item_barang_idx` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_item_coa_debit_idx` FOREIGN KEY (`coa_kredit`) REFERENCES `acc_coas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_item_equipment_idx` FOREIGN KEY (`equipment_id`) REFERENCES `mas_equipment` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_item_hapus_idx` FOREIGN KEY (`hapus_id`) REFERENCES `trx_hapus_persediaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_hapus_persediaan_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_hapus_persediaans
-- ----------------------------
DROP TABLE IF EXISTS `trx_hapus_persediaans`;
CREATE TABLE `trx_hapus_persediaans` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `services_id` int(10) DEFAULT NULL COMMENT 'backlog_id',
  `trx_date` date DEFAULT NULL,
  `coa_debit` int(10) unsigned DEFAULT NULL COMMENT 'coa persediaan barang',
  `coa_kode` varchar(10) DEFAULT NULL,
  `nilai` float(20,2) DEFAULT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `created_by` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_hapus_persediaan_bisnis_idx` (`bisnis_id`) USING BTREE,
  KEY `trx_hapus_persediaan_cabang_idx` (`cabang_id`) USING BTREE,
  KEY `trx_hapus_persediaan_gudang_idx` (`gudang_id`) USING BTREE,
  KEY `trx_hapus_persediaan_services_idx` (`services_id`) USING BTREE,
  KEY `trx_hapus_persediaan_coa_idx` (`coa_debit`) USING BTREE,
  KEY `trx_hapus_persediaan_user_idx` (`created_by`) USING BTREE,
  CONSTRAINT `trx_hapus_persediaan_bisnis_idx` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_coa_idx` FOREIGN KEY (`coa_debit`) REFERENCES `acc_coas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_gudang_idx` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_services_idx` FOREIGN KEY (`services_id`) REFERENCES `xxx_ops_part_requireds` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_hapus_persediaan_user_idx` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_hapus_persediaans
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_jurnal_adjust_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_jurnal_adjust_items`;
CREATE TABLE `trx_jurnal_adjust_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trx_adjust` int(10) unsigned DEFAULT NULL,
  `trx_beli` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `kode` varchar(50) NOT NULL,
  `qty` float(10,2) DEFAULT '0.00',
  `narasi` varchar(200) DEFAULT '',
  `d` float(20,2) DEFAULT '0.00',
  `k` float(20,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_jurnal_adjust_items_trx_adjust_foreign` (`trx_adjust`) USING BTREE,
  KEY `trx_jurnal_adjust_items_trx_beli_foreign` (`trx_beli`) USING BTREE,
  KEY `trx_jurnal_adjust_items_trx_jual_foreign` (`trx_jual`) USING BTREE,
  KEY `trx_jurnal_adjust_items_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_jurnal_adjust_items_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_jurnal_adjust_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_jurnal_adjust_items_coa_id_foreign` (`coa_id`) USING BTREE,
  CONSTRAINT `trx_jurnal_adjust_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_adjust_items_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_adjust_items_coa_id_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_adjust_items_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_adjust_items_trx_adjust_foreign` FOREIGN KEY (`trx_adjust`) REFERENCES `trx_jurnal_adjusts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_adjust_items_trx_beli_foreign` FOREIGN KEY (`trx_beli`) REFERENCES `trx_faktur_belis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_adjust_items_trx_jual_foreign` FOREIGN KEY (`trx_jual`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_jurnal_adjust_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_jurnal_adjusts
-- ----------------------------
DROP TABLE IF EXISTS `trx_jurnal_adjusts`;
CREATE TABLE `trx_jurnal_adjusts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `trx_date` date NOT NULL,
  `reff` varchar(100) DEFAULT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `debit` float(20,2) DEFAULT '0.00',
  `kredit` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `author` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_jurnal_adjusts_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_jurnal_adjusts_author_foreign` (`author`) USING BTREE,
  CONSTRAINT `trx_jurnal_adjusts_author_foreign` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_adjusts_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_jurnal_adjusts
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_jurnal_saldos
-- ----------------------------
DROP TABLE IF EXISTS `trx_jurnal_saldos`;
CREATE TABLE `trx_jurnal_saldos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `jurnal_id` int(10) unsigned DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `kode_coa` varchar(100) NOT NULL,
  `date_trx` date NOT NULL,
  `saldo` float(20,0) DEFAULT '0',
  `dk` enum('d','k') DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_jurnal_saldos_createdby_foreign` (`createdby`) USING BTREE,
  KEY `trx_jurnal_saldos_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_jurnal_saldos_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `trx_jurnal_saldos_jurnal_id_foreign` (`jurnal_id`) USING BTREE,
  CONSTRAINT `trx_jurnal_saldos_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_saldos_coa_id_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_saldos_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnal_saldos_jurnal_id_foreign` FOREIGN KEY (`jurnal_id`) REFERENCES `trx_jurnals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_jurnal_saldos
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_jurnals
-- ----------------------------
DROP TABLE IF EXISTS `trx_jurnals`;
CREATE TABLE `trx_jurnals` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdby` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `bank_id` int(10) unsigned DEFAULT NULL,
  `kas_id` int(10) unsigned DEFAULT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `reff` varchar(30) DEFAULT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `trx_date` date NOT NULL,
  `nilai` float(20,2) NOT NULL,
  `dk` enum('d','k') NOT NULL,
  `is_delay` enum('Y','N') NOT NULL DEFAULT 'N',
  `delay_date` datetime DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) DEFAULT NULL,
  `trx_paid` int(10) DEFAULT NULL,
  `transfer_id` int(10) unsigned DEFAULT NULL,
  `sesuai_item_id` int(10) unsigned DEFAULT NULL,
  `pindahbrg_id` int(10) DEFAULT NULL,
  `hapusbrg_id` int(10) DEFAULT NULL,
  `hapusbrg_item` int(10) DEFAULT NULL,
  `fakturbeli_id` int(10) unsigned DEFAULT NULL,
  `fakturbeli_item` int(10) unsigned DEFAULT NULL,
  `keubayar_id` int(10) unsigned DEFAULT NULL,
  `keubayaritem_id` int(10) unsigned DEFAULT NULL,
  `keuterima_id` int(10) unsigned DEFAULT NULL,
  `keuterimaitem_id` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_jurnals_createdby_foreign` (`createdby`) USING BTREE,
  KEY `trx_jurnals_coa_id_foreign` (`coa_id`) USING BTREE,
  KEY `trx_jurnals_bank_id_foreign` (`bank_id`) USING BTREE,
  KEY `trx_jurnals_kas_id_foreign` (`kas_id`) USING BTREE,
  KEY `trx_jurnals_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_jurnals_order_id_foreign` (`trx_jual`) USING BTREE,
  KEY `trx_jurnals_paid_id_foreign` (`trx_paid`) USING BTREE,
  KEY `trx_jurnals_transfer_id_foreign` (`transfer_id`) USING BTREE,
  KEY `trx_jurnals_sesuai_item_id_foreign` (`sesuai_item_id`) USING BTREE,
  KEY `trx_jurnals_pindah_barang_id_foreign` (`pindahbrg_id`) USING BTREE,
  KEY `trx_jurnals_faktur_pembelian_id_foreign` (`fakturbeli_id`) USING BTREE,
  KEY `trx_jurnals_faktur_pembelian_items_id_foreign` (`fakturbeli_item`) USING BTREE,
  KEY `trx_jurnals_keu_pembayaran_id_foreign` (`keubayar_id`) USING BTREE,
  KEY `trx_jurnals_keu_pembayaran_item_id_foreign` (`keubayaritem_id`) USING BTREE,
  KEY `trx_jurnals_keu_penerimaan_id_foreign` (`keuterima_id`) USING BTREE,
  KEY `trx_jurnals_keu_penerimaan_item_id_foreign` (`keuterimaitem_id`) USING BTREE,
  KEY `trx_jurnals_keu_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_jurnals_hapus_barang_id_foreign` (`hapusbrg_id`) USING BTREE,
  KEY `trx_jurnals_hapus_item_barang_id_foreign` (`hapusbrg_item`) USING BTREE,
  CONSTRAINT `trx_jurnals_bank_id_foreign` FOREIGN KEY (`bank_id`) REFERENCES `keu_banks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_coa_id_foreign` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_faktur_pembelian_id_foreign` FOREIGN KEY (`fakturbeli_id`) REFERENCES `keu_faktur_pembelians` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_faktur_pembelian_items_id_foreign` FOREIGN KEY (`fakturbeli_item`) REFERENCES `keu_faktur_pembelian_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_hapus_barang_id_foreign` FOREIGN KEY (`hapusbrg_id`) REFERENCES `keu_hapus_persediaan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_hapus_item_barang_id_foreign` FOREIGN KEY (`hapusbrg_item`) REFERENCES `keu_hapus_persediaan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_kas_id_foreign` FOREIGN KEY (`kas_id`) REFERENCES `keu_kas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_keu_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_keu_pembayaran_id_foreign` FOREIGN KEY (`keubayar_id`) REFERENCES `keu_pembayarans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_keu_pembayaran_item_id_foreign` FOREIGN KEY (`keubayaritem_id`) REFERENCES `keu_pembayaran_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_keu_penerimaan_id_foreign` FOREIGN KEY (`keuterima_id`) REFERENCES `keu_penerimaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_keu_penerimaan_item_id_foreign` FOREIGN KEY (`keuterimaitem_id`) REFERENCES `keu_penerimaan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_order_id_foreign` FOREIGN KEY (`trx_jual`) REFERENCES `ord_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_paid_id_foreign` FOREIGN KEY (`trx_paid`) REFERENCES `pay_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_pindah_barang_id_foreign` FOREIGN KEY (`pindahbrg_id`) REFERENCES `keu_pindah_persediaan_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_sesuai_item_id_foreign` FOREIGN KEY (`sesuai_item_id`) REFERENCES `keu_jurnal_penyesuaian_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_jurnals_transfer_id_foreign` FOREIGN KEY (`transfer_id`) REFERENCES `keu_transfer_kasbanks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_jurnals
-- ----------------------------
BEGIN;
INSERT INTO `trx_jurnals` VALUES (1, 1, 1, NULL, NULL, 11004, 'TESTINGZUL05', '[ TESTINGZUL05 ] PPN Faktur Pembelian', '2022-10-10', 0.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-10 21:08:01', '2022-10-10 21:08:01');
INSERT INTO `trx_jurnals` VALUES (2, 1, 1, NULL, NULL, 21005, 'TESTINGZUL05', '[ TESTINGZUL05 ] Hutang Dagang', '2022-10-10', 300000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-10 21:08:01', '2022-10-10 21:08:01');
INSERT INTO `trx_jurnals` VALUES (3, 1, 1, NULL, NULL, 11001, 'TESTINGZUL05', '[ TESTINGZUL05 ] 3 gang switch panel with label', '2022-10-10', 300000.00, 'd', 'N', NULL, 763, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, 'Y', '2022-10-10 21:08:01', '2022-10-10 21:08:01');
INSERT INTO `trx_jurnals` VALUES (4, 1, 1, NULL, NULL, 51002, 'TESTINGZUL05', '[ TESTINGZUL05 ] Discount Faktur Pembalian', '2022-10-10', 0.00, 'd', 'N', NULL, 763, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, 'Y', '2022-10-10 21:08:01', '2022-10-10 21:08:01');
INSERT INTO `trx_jurnals` VALUES (5, 1, 1, 11101, NULL, 11101, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] PENYERTAAN MODAL AWAL TESTING ZUL 05', '2022-10-10', 50000000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'N', '2022-10-10 21:19:43', '2022-10-10 21:19:43');
INSERT INTO `trx_jurnals` VALUES (6, 1, 1, 11101, NULL, 30001, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] Modal', '2022-10-10', 50000000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, 'N', '2022-10-10 21:19:45', '2022-10-10 21:19:45');
INSERT INTO `trx_jurnals` VALUES (7, 1, 1, 11101, NULL, 11101, 'TESTINGZUL05', '[ TESTINGZUL05 ] PEMBAYARAN HUTANG AYAT INV TESTINGZUL05', '2022-10-10', 200000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, 'N', '2022-10-10 21:25:38', '2022-10-10 21:25:38');
INSERT INTO `trx_jurnals` VALUES (8, 1, 1, 11101, NULL, 21005, 'TESTINGZUL05', '[ TESTINGZUL05 ] Hutang Dagang', '2022-10-10', 200000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 1, 1, NULL, NULL, 'N', '2022-10-10 21:25:38', '2022-10-10 21:25:38');
INSERT INTO `trx_jurnals` VALUES (10, 1, 1, 11101, NULL, 11101, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] PENYERTAAN MODAL AWAL TESTING ZUL 05', '2022-10-10', 40000000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'N', '2022-10-13 11:15:52', '2022-10-13 11:15:52');
INSERT INTO `trx_jurnals` VALUES (11, 1, 1, 11101, NULL, 30001, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] Modal', '2022-10-10', 40000000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 2, 'N', '2022-10-13 11:15:53', '2022-10-13 11:15:53');
INSERT INTO `trx_jurnals` VALUES (12, 1, 1, 11101, NULL, 11101, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] PENYERTAAN MODAL AWAL TESTING ZUL 05', '2022-10-10', 50000000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'N', '2022-10-13 11:16:28', '2022-10-13 11:16:28');
INSERT INTO `trx_jurnals` VALUES (13, 1, 1, 11101, NULL, 30001, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] Modal', '2022-10-10', 50000000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 3, 'N', '2022-10-13 11:16:28', '2022-10-13 11:16:28');
INSERT INTO `trx_jurnals` VALUES (16, 1, 1, 11101, NULL, 11101, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] PENYERTAAN MODAL AWAL TESTING ZUL 05', '2022-10-10', 50000000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'N', '2022-10-13 12:02:58', '2022-10-13 12:02:58');
INSERT INTO `trx_jurnals` VALUES (17, 1, 1, 11101, NULL, 30001, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] Modal', '2022-10-10', 50000000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 4, 'N', '2022-10-13 12:02:58', '2022-10-13 12:02:58');
INSERT INTO `trx_jurnals` VALUES (18, 1, 1, 11101, NULL, 11101, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] PENYERTAAN MODAL AWAL TESTING ZUL 05', '2022-10-10', 50000000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'Y', '2022-10-13 12:03:16', '2022-10-13 12:03:16');
INSERT INTO `trx_jurnals` VALUES (19, 1, 1, 11101, NULL, 30001, 'KEU-TERIMA/2022/X-0001', '[ KEU-TERIMA/2022/X-0001 ] Modal', '2022-10-10', 50000000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 5, 'Y', '2022-10-13 12:03:17', '2022-10-13 12:03:17');
INSERT INTO `trx_jurnals` VALUES (20, 1, 1, NULL, NULL, 11004, 'TESTING ZUL 07', '[ TESTING ZUL 07 ] PPN Faktur Pembelian', '2022-10-19', 137500.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 09:35:10', '2022-10-19 09:35:10');
INSERT INTO `trx_jurnals` VALUES (21, 1, 1, NULL, NULL, 21005, 'TESTING ZUL 07', '[ TESTING ZUL 07 ] Hutang Dagang', '2022-10-19', 1387500.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 09:35:10', '2022-10-19 09:35:10');
INSERT INTO `trx_jurnals` VALUES (22, 1, 1, NULL, NULL, 11001, 'TESTING ZUL 07', '[ TESTING ZUL 07 ] 13.5\" Alu Steering Wheel With PU S3/4\" Tapered Hub Silver Color Spoke', '2022-10-19', 1250000.00, 'd', 'N', NULL, 708, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 2, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 09:35:10', '2022-10-19 09:35:10');
INSERT INTO `trx_jurnals` VALUES (23, 1, 1, NULL, NULL, 51002, 'TESTING ZUL 07', '[ TESTING ZUL 07 ] Discount Faktur Pembalian', '2022-10-19', 0.00, 'd', 'N', NULL, 708, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 2, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 09:35:10', '2022-10-19 09:35:10');
INSERT INTO `trx_jurnals` VALUES (24, 1, 1, 11101, NULL, 11101, 'TESTING ZUL 07', '[ TESTING ZUL 07 ] TESTING ZUL 07', '2022-10-19', 1387500.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, 'Y', '2022-10-19 10:11:30', '2022-10-19 10:11:30');
INSERT INTO `trx_jurnals` VALUES (25, 1, 1, 11101, NULL, 21005, 'TESTING ZUL 07', '[ TESTING ZUL 07 ] Hutang Dagang', '2022-10-19', 1387500.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, 2, 2, NULL, NULL, 'Y', '2022-10-19 10:11:30', '2022-10-19 10:11:30');
INSERT INTO `trx_jurnals` VALUES (38, 1, 1, NULL, 11201, 11201, 'KEU-TERIMA/2022/X-0002', '[ KEU-TERIMA/2022/X-0002 ] TESTING ZUL 07', '2022-10-19', 20000000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, NULL, 'N', '2022-10-19 16:18:27', '2022-10-19 16:18:27');
INSERT INTO `trx_jurnals` VALUES (39, 1, 1, NULL, 11201, 30001, 'KEU-TERIMA/2022/X-0002', '[ KEU-TERIMA/2022/X-0002 ] Modal', '2022-10-19', 20000000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, 6, 'N', '2022-10-19 16:18:27', '2022-10-19 16:18:27');
INSERT INTO `trx_jurnals` VALUES (41, 1, 1, NULL, NULL, 12001, 'JP221019-1', '[ JP221019-1 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 550000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:11:43', '2022-10-19 19:12:57');
INSERT INTO `trx_jurnals` VALUES (42, 1, 1, NULL, NULL, 12001, 'JP221019-1', '[ JP221019-1 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 0.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:11:43', '2022-10-19 19:12:57');
INSERT INTO `trx_jurnals` VALUES (43, 1, 1, NULL, NULL, 30001, 'JP221019-1', '[ JP221019-1 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 0.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:11:43', '2022-10-19 19:12:57');
INSERT INTO `trx_jurnals` VALUES (44, 1, 1, NULL, NULL, 30001, 'JP221019-1', '[ JP221019-1 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 550000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:11:43', '2022-10-19 19:12:57');
INSERT INTO `trx_jurnals` VALUES (45, 1, 1, NULL, NULL, 12001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 500000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:12:57', '2022-10-19 19:13:08');
INSERT INTO `trx_jurnals` VALUES (46, 1, 1, NULL, NULL, 12001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 0.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:12:57', '2022-10-19 19:13:08');
INSERT INTO `trx_jurnals` VALUES (47, 1, 1, NULL, NULL, 30001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 0.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:12:57', '2022-10-19 19:13:08');
INSERT INTO `trx_jurnals` VALUES (48, 1, 1, NULL, NULL, 30001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 500000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'N', '2022-10-19 19:12:58', '2022-10-19 19:13:08');
INSERT INTO `trx_jurnals` VALUES (49, 1, 1, NULL, NULL, 12001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 500000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 19:12:59', '2022-10-19 19:12:59');
INSERT INTO `trx_jurnals` VALUES (50, 1, 1, NULL, NULL, 12001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 0.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, 5, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 19:12:59', '2022-10-19 19:12:59');
INSERT INTO `trx_jurnals` VALUES (51, 1, 1, NULL, NULL, 30001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 0.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 19:13:00', '2022-10-19 19:13:00');
INSERT INTO `trx_jurnals` VALUES (52, 1, 1, NULL, NULL, 30001, 'JP221019-2', '[ JP221019-2 ] Persediaan Jurnal Penyesuaian', '2022-10-19', 500000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-19 19:13:00', '2022-10-19 19:13:00');
INSERT INTO `trx_jurnals` VALUES (53, 1, 1, 11101, NULL, 11101, 'KEU-TERIMA/2022/X-0003', '[ KEU-TERIMA/2022/X-0003 ] TESTING ZUL 07', '2022-10-19', 35000000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, 'Y', '2022-10-19 19:16:33', '2022-10-19 19:16:33');
INSERT INTO `trx_jurnals` VALUES (54, 1, 1, 11101, NULL, 22001, 'KEU-TERIMA/2022/X-0003', '[ KEU-TERIMA/2022/X-0003 ] Hutang Ke Owner', '2022-10-19', 35000000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 7, 'Y', '2022-10-19 19:16:33', '2022-10-19 19:16:33');
INSERT INTO `trx_jurnals` VALUES (55, 1, 1, NULL, NULL, 51001, 'REM-BRG221020-1', '[ REM-BRG221020-1 ] TESTING ZUL 07', '2022-10-20', 20000.00, 'd', 'N', NULL, 763, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-20 10:05:45', '2022-10-20 10:05:45');
INSERT INTO `trx_jurnals` VALUES (56, 1, 1, NULL, NULL, 11001, 'REM-BRG221020-1', '[ REM-BRG221020-1 ] TESTING ZUL 07', '2022-10-20', 20000.00, 'k', 'N', NULL, 763, NULL, NULL, NULL, NULL, NULL, 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-20 10:05:46', '2022-10-20 10:05:46');
INSERT INTO `trx_jurnals` VALUES (57, 1, 1, NULL, NULL, 11004, 'TESTINGZUL08', '[ TESTINGZUL08 ] PPN Faktur Pembelian', '2022-10-20', 66000.00, 'd', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-20 10:10:53', '2022-10-20 10:10:53');
INSERT INTO `trx_jurnals` VALUES (58, 1, 1, NULL, NULL, 21005, 'TESTINGZUL08', '[ TESTINGZUL08 ] Hutang Dagang', '2022-10-20', 666000.00, 'k', 'N', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, NULL, NULL, NULL, NULL, 'Y', '2022-10-20 10:10:53', '2022-10-20 10:10:53');
INSERT INTO `trx_jurnals` VALUES (59, 1, 1, NULL, NULL, 11001, 'TESTINGZUL08', '[ TESTINGZUL08 ] 3\" Swivel Hasp SS', '2022-10-20', 600000.00, 'd', 'N', NULL, 715, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 3, NULL, NULL, NULL, NULL, 'Y', '2022-10-20 10:10:53', '2022-10-20 10:10:53');
INSERT INTO `trx_jurnals` VALUES (60, 1, 1, NULL, NULL, 51002, 'TESTINGZUL08', '[ TESTINGZUL08 ] Discount Faktur Pembalian', '2022-10-20', 0.00, 'd', 'N', NULL, 715, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, 3, NULL, NULL, NULL, NULL, 'Y', '2022-10-20 10:10:53', '2022-10-20 10:10:53');
COMMIT;

-- ----------------------------
-- Table structure for trx_kases
-- ----------------------------
DROP TABLE IF EXISTS `trx_kases`;
CREATE TABLE `trx_kases` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_date` date DEFAULT NULL,
  `kas_id` int(10) unsigned DEFAULT NULL,
  `keubayar_id` int(10) unsigned DEFAULT NULL,
  `keuterima_id` int(10) unsigned DEFAULT NULL,
  `ja_id` int(10) unsigned DEFAULT NULL,
  `trf_id` int(10) unsigned DEFAULT NULL,
  `saldo_rill` float(20,2) DEFAULT '0.00',
  `desc` varchar(200) DEFAULT '',
  `paid_id` int(10) DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `foreign_kas_idx` (`kas_id`) USING BTREE,
  KEY `foreign_kas_bukti_bayar_idx` (`keubayar_id`) USING BTREE,
  KEY `foreign_kas_jurnal_adjust_idx` (`ja_id`) USING BTREE,
  KEY `foreign_kas_transfer_kasbank_idx` (`trf_id`) USING BTREE,
  KEY `trx_kas_paid_idx_foreign` (`paid_id`) USING BTREE,
  KEY `foreign_kas_bukti_terima_idx` (`keuterima_id`) USING BTREE,
  CONSTRAINT `foreign_kas_bukti_bayar_idx` FOREIGN KEY (`keubayar_id`) REFERENCES `keu_pembayarans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_kas_bukti_terima_idx` FOREIGN KEY (`keuterima_id`) REFERENCES `keu_penerimaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_kas_idx` FOREIGN KEY (`kas_id`) REFERENCES `keu_kas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_kas_jurnal_adjust_idx` FOREIGN KEY (`ja_id`) REFERENCES `keu_jurnal_penyesuaian_items` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_kas_transfer_kasbank_idx` FOREIGN KEY (`trf_id`) REFERENCES `keu_transfer_kasbanks` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_kas_paid_idx_foreign` FOREIGN KEY (`paid_id`) REFERENCES `pay_pelanggan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_kases
-- ----------------------------
BEGIN;
INSERT INTO `trx_kases` VALUES (1, '2022-10-19', 11201, NULL, 2, NULL, NULL, 20000000.00, '[ KEU-TERIMA/2022/X-0002 ] Penerimaan Pembayaran', NULL, 'Y', '2022-10-19 16:18:27', '2022-10-19 16:18:27');
COMMIT;

-- ----------------------------
-- Table structure for trx_pembayaran_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_pembayaran_items`;
CREATE TABLE `trx_pembayaran_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `paid_id` int(10) unsigned DEFAULT NULL,
  `trx_beli` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `coa_debit` int(10) unsigned DEFAULT NULL,
  `coa_kode` varchar(255) DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `narasi` varchar(200) DEFAULT '',
  `qty` float(10,2) DEFAULT '0.00',
  `harga_stn` float(20,2) DEFAULT '0.00',
  `harga_total` float(20,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_pembayaran_items_paid_id_foreign` (`paid_id`) USING BTREE,
  KEY `trx_pembayaran_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_pembayaran_items_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_pembayaran_items_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_pembayaran_items_coa_debit_foreign` (`coa_debit`) USING BTREE,
  KEY `trx_pembayaran_items_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_pembayaran_items_pelanggan_id_foreign` (`pelanggan_id`) USING BTREE,
  KEY `trx_pembayaran_items_trx_beli_id_foreign` (`trx_beli`) USING BTREE,
  KEY `trx_pembayaran_items_trx_jual_id_foreign` (`trx_jual`) USING BTREE,
  CONSTRAINT `trx_pembayaran_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_coa_debit_foreign` FOREIGN KEY (`coa_debit`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_paid_id_foreign` FOREIGN KEY (`paid_id`) REFERENCES `trx_pembayarans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_pelanggan_id_foreign` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_trx_beli_id_foreign` FOREIGN KEY (`trx_beli`) REFERENCES `xxx_trx_faktur_belis` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayaran_items_trx_jual_id_foreign` FOREIGN KEY (`trx_jual`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_pembayaran_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_pembayarans
-- ----------------------------
DROP TABLE IF EXISTS `trx_pembayarans`;
CREATE TABLE `trx_pembayarans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author` int(10) unsigned DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `coa_kredit` int(10) unsigned DEFAULT NULL,
  `coa_kode` varchar(255) DEFAULT NULL,
  `reff` varchar(255) DEFAULT NULL,
  `trx_date` date NOT NULL,
  `delay_trx` date DEFAULT NULL,
  `is_delay` enum('Y','N') DEFAULT 'N',
  `penerima` varchar(50) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `paidby` enum('other','pelanggan','pemasok') DEFAULT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `total` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_pembayarans_author_foreign` (`author`) USING BTREE,
  KEY `trx_pembayarans_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_pembayarans_coa_kredit_foreign` (`coa_kredit`) USING BTREE,
  KEY `trx_pembayarans_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_pembayarans_pelanggan_id_foreign` (`pelanggan_id`) USING BTREE,
  KEY `trx_pembayarans_cabang_id_foreign` (`cabang_id`) USING BTREE,
  CONSTRAINT `trx_pembayarans_author_foreign` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayarans_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayarans_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayarans_coa_kredit_foreign` FOREIGN KEY (`coa_kredit`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayarans_pelanggan_id_foreign` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_pembayarans_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_pembayarans
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_request_orders
-- ----------------------------
DROP TABLE IF EXISTS `trx_request_orders`;
CREATE TABLE `trx_request_orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `date` date NOT NULL,
  `total` float(10,2) DEFAULT '0.00',
  `kode` varchar(255) NOT NULL,
  `narasi` varchar(255) DEFAULT NULL,
  `status` enum('created','approved','finish') DEFAULT 'created',
  `url_file` varchar(255) DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_request_orders_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_request_orders_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_request_orders_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `trx_request_orders_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_request_orders_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_request_orders_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_request_orders
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_request_orders_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_request_orders_items`;
CREATE TABLE `trx_request_orders_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `prioritas` enum('P1','P2','P3','P4') DEFAULT 'P1',
  `qty` float(8,2) DEFAULT '0.00',
  `stn` varchar(255) DEFAULT NULL,
  `metode` enum('tunai','kredit') DEFAULT 'tunai',
  `date_validated` datetime DEFAULT NULL,
  `date_approved` datetime DEFAULT NULL,
  `user_validated` int(10) unsigned DEFAULT NULL,
  `user_approved` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_request_orders_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_request_orders_items_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_request_orders_items_user_validated_foreign` (`user_validated`) USING BTREE,
  KEY `trx_request_orders_items_user_approved_foreign` (`user_approved`) USING BTREE,
  KEY `trx_request_orders_items_ro_id_foreign` (`order_id`) USING BTREE,
  CONSTRAINT `trx_request_orders_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_request_orders_items_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_request_orders_items_ro_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `trx_request_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_request_orders_items_user_approved_foreign` FOREIGN KEY (`user_approved`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_request_orders_items_user_validated_foreign` FOREIGN KEY (`user_validated`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_request_orders_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_tanda_terima_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_tanda_terima_items`;
CREATE TABLE `trx_tanda_terima_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trx_terimaid` int(10) unsigned DEFAULT NULL,
  `trx_jual` int(10) unsigned DEFAULT NULL,
  `trx_beli` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `equipment_id` int(10) unsigned DEFAULT NULL,
  `coa_kredit` int(10) unsigned DEFAULT NULL,
  `coa_kode` varchar(255) DEFAULT NULL,
  `narasi` varchar(255) DEFAULT '',
  `qty` float(10,2) DEFAULT '0.00',
  `harga_stn` float(20,2) DEFAULT '0.00',
  `harga_pot` float(20,2) DEFAULT '0.00',
  `harga_total` float(20,2) DEFAULT '0.00',
  `author` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_tanda_terima_items_trx_terimaid_foreign` (`trx_terimaid`) USING BTREE,
  KEY `trx_tanda_terima_items_barang_id_foreign` (`barang_id`) USING BTREE,
  KEY `trx_tanda_terima_items_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_tanda_terima_items_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_tanda_terima_items_equipment_id_foreign` (`equipment_id`) USING BTREE,
  KEY `trx_tanda_terima_items_coa_kredit_foreign` (`coa_kredit`) USING BTREE,
  KEY `trx_tanda_terima_items_author_foreign` (`author`) USING BTREE,
  KEY `trx_tanda_terima_items_trx_jualid_foreign` (`trx_jual`) USING BTREE,
  KEY `trx_tanda_terima_items_trx_beliid_foreign` (`trx_beli`) USING BTREE,
  KEY `trx_tanda_terima_items_pelanggan_id_foreign` (`pelanggan_id`) USING BTREE,
  CONSTRAINT `trx_tanda_terima_items_author_foreign` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_coa_kredit_foreign` FOREIGN KEY (`coa_kredit`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `mas_equipment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_pelanggan_id_foreign` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_trx_beliid_foreign` FOREIGN KEY (`trx_beli`) REFERENCES `xxx_trx_faktur_belis` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_trx_jualid_foreign` FOREIGN KEY (`trx_jual`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terima_items_trx_terimaid_foreign` FOREIGN KEY (`trx_terimaid`) REFERENCES `trx_tanda_terimas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_tanda_terima_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_tanda_terimas
-- ----------------------------
DROP TABLE IF EXISTS `trx_tanda_terimas`;
CREATE TABLE `trx_tanda_terimas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `reff_fj` int(10) unsigned DEFAULT NULL,
  `pelanggan_id` int(10) unsigned DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `penerima` varchar(255) DEFAULT NULL,
  `coa_debit` int(10) unsigned DEFAULT NULL,
  `coa_kode` varchar(255) DEFAULT NULL,
  `narasi` varchar(255) DEFAULT '',
  `trx_date` date DEFAULT NULL,
  `delay_trx` date DEFAULT NULL,
  `is_delay` enum('N','Y') DEFAULT 'N',
  `reff` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT '',
  `paidby` enum('other','pelanggan','pemasok') DEFAULT NULL,
  `author` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_tanda_terimas_pelanggan_id_foreign` (`pelanggan_id`) USING BTREE,
  KEY `trx_tanda_terimas_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_tanda_terimas_coa_debit_foreign` (`coa_debit`) USING BTREE,
  KEY `trx_tanda_terimas_author_foreign` (`author`) USING BTREE,
  KEY `trx_tanda_terimas_reff_fj_foreign` (`reff_fj`) USING BTREE,
  KEY `trx_tanda_terimas_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_tanda_terimas_cabang_id_foreign` (`cabang_id`) USING BTREE,
  CONSTRAINT `trx_tanda_terimas_author_foreign` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terimas_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terimas_cabang_id_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terimas_coa_debit_foreign` FOREIGN KEY (`coa_debit`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terimas_pelanggan_id_foreign` FOREIGN KEY (`pelanggan_id`) REFERENCES `mas_pelanggans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terimas_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_tanda_terimas_reff_fj_foreign` FOREIGN KEY (`reff_fj`) REFERENCES `trx_faktur_juals` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_tanda_terimas
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_terima_barang_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_terima_barang_items`;
CREATE TABLE `trx_terima_barang_items` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trx_terima` int(10) unsigned DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  `qty` float(8,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_terima_barang_items_trx_terima_foreign` (`trx_terima`) USING BTREE,
  KEY `trx_terima_barang_items_barang_id_foreign` (`barang_id`) USING BTREE,
  CONSTRAINT `trx_terima_barang_items_barang_id_foreign` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_terima_barang_items_trx_terima_foreign` FOREIGN KEY (`trx_terima`) REFERENCES `trx_terima_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_terima_barang_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_terima_barangs
-- ----------------------------
DROP TABLE IF EXISTS `trx_terima_barangs`;
CREATE TABLE `trx_terima_barangs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `ro_id` int(10) unsigned DEFAULT NULL,
  `reff_fb` varchar(50) DEFAULT NULL,
  `reff_ro` varchar(30) DEFAULT NULL,
  `reff_rcp` varchar(30) DEFAULT NULL,
  `received_at` date DEFAULT NULL,
  `pemasok_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `narasi` varchar(200) DEFAULT NULL,
  `receivedby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_terima_barangs_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_terima_barangs_ro_id_foreign` (`ro_id`) USING BTREE,
  KEY `trx_terima_barangs_pemasok_id_foreign` (`pemasok_id`) USING BTREE,
  KEY `trx_terima_barangs_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_terima_barang_user_terima_foreign` (`receivedby`) USING BTREE,
  CONSTRAINT `trx_terima_barang_user_terima_foreign` FOREIGN KEY (`receivedby`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_terima_barangs_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_terima_barangs_gudang_id_foreign` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_terima_barangs_pemasok_id_foreign` FOREIGN KEY (`pemasok_id`) REFERENCES `mas_pemasoks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_terima_barangs_ro_id_foreign` FOREIGN KEY (`ro_id`) REFERENCES `keu_request_orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_terima_barangs
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_transfer_kasbanks
-- ----------------------------
DROP TABLE IF EXISTS `trx_transfer_kasbanks`;
CREATE TABLE `trx_transfer_kasbanks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `author` int(10) unsigned DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `reff` varchar(255) DEFAULT '',
  `trx_date` date NOT NULL,
  `bank_src` int(10) unsigned DEFAULT NULL,
  `kas_src` int(10) unsigned DEFAULT NULL,
  `coa_src_id` int(10) unsigned DEFAULT NULL,
  `coa_src_kode` varchar(255) DEFAULT NULL,
  `out_date` date DEFAULT NULL,
  `bank_target` int(10) unsigned DEFAULT NULL,
  `kas_target` int(10) unsigned DEFAULT NULL,
  `coa_target_id` int(10) unsigned DEFAULT NULL,
  `coa_target_kode` varchar(255) DEFAULT NULL,
  `in_date` date DEFAULT NULL,
  `narasi` varchar(200) DEFAULT 'Transfer Kas & Bank',
  `total` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_pembayarans_author_foreign` (`author`) USING BTREE,
  KEY `trx_pembayarans_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  KEY `trx_pembayarans_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_4` (`bank_src`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_5` (`kas_src`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_6` (`coa_src_id`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_7` (`bank_target`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_8` (`kas_target`) USING BTREE,
  KEY `trx_transfer_kasbanks_ibfk_9` (`coa_target_id`) USING BTREE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_1` FOREIGN KEY (`author`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_2` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_3` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_4` FOREIGN KEY (`bank_src`) REFERENCES `keu_banks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_5` FOREIGN KEY (`kas_src`) REFERENCES `keu_kas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_6` FOREIGN KEY (`coa_src_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_7` FOREIGN KEY (`bank_target`) REFERENCES `keu_banks` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_8` FOREIGN KEY (`kas_target`) REFERENCES `keu_kas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_kasbanks_ibfk_9` FOREIGN KEY (`coa_target_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_transfer_kasbanks
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_transfer_persediaan_items
-- ----------------------------
DROP TABLE IF EXISTS `trx_transfer_persediaan_items`;
CREATE TABLE `trx_transfer_persediaan_items` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `pindah_id` int(10) DEFAULT NULL,
  `barang_id` int(10) unsigned DEFAULT NULL,
  `satuan` varchar(100) DEFAULT NULL,
  `qty` float(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_transfer_persediaans_pindah_idx` (`pindah_id`) USING BTREE,
  KEY `trx_transfer_persediaans_barang_idx` (`barang_id`) USING BTREE,
  CONSTRAINT `trx_transfer_persediaans_barang_idx` FOREIGN KEY (`barang_id`) REFERENCES `mas_barangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trx_transfer_persediaans_pindah_idx` FOREIGN KEY (`pindah_id`) REFERENCES `trx_transfer_persediaans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_transfer_persediaan_items
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for trx_transfer_persediaans
-- ----------------------------
DROP TABLE IF EXISTS `trx_transfer_persediaans`;
CREATE TABLE `trx_transfer_persediaans` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `trx_date` date DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_src` int(10) unsigned DEFAULT NULL,
  `gudang_target` int(10) unsigned DEFAULT NULL,
  `narasi` varchar(200) DEFAULT '',
  `created_by` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `foreign_transfer_barang_cabang_idx` (`cabang_id`) USING BTREE,
  KEY `foreign_transfer_barang_gudang_srcx` (`gudang_src`) USING BTREE,
  KEY `foreign_transfer_barang_gudang_targetx` (`gudang_target`) USING BTREE,
  KEY `foreign_transfer_barang_user_idx` (`created_by`) USING BTREE,
  KEY `foreign_transfer_barang_bisnis_idx` (`bisnis_id`) USING BTREE,
  CONSTRAINT `foreign_transfer_barang_bisnis_idx` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_transfer_barang_cabang_idx` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_transfer_barang_gudang_srcx` FOREIGN KEY (`gudang_src`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_transfer_barang_gudang_targetx` FOREIGN KEY (`gudang_target`) REFERENCES `mas_gudangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foreign_transfer_barang_user_idx` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of trx_transfer_persediaans
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `email` varchar(254) NOT NULL,
  `password` varchar(60) NOT NULL,
  `usertype` varchar(60) NOT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `users_username_unique` (`username`) USING BTREE,
  UNIQUE KEY `users_email_unique` (`email`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES (1, 'dev', 'ayat.ekaputra@gmail.com', '$2a$10$QoIkiqHP2X9SmxmwGED93OJHGJrWmKhRdIPTtc1MZtPVIL2VyPH/u', 'developer', 'Y', '2021-11-23 22:34:37', '2022-03-26 10:01:52');
INSERT INTO `users` VALUES (2, 'admin', 'admin@localhost.com', '$2a$10$QoIkiqHP2X9SmxmwGED93OJHGJrWmKhRdIPTtc1MZtPVIL2VyPH/u', 'administrator', 'Y', '2021-11-23 22:35:56', '2021-11-23 22:35:58');
INSERT INTO `users` VALUES (3, 'keuangan', 'ayat.ekapoetra@gmail.com', '$2a$10$QoIkiqHP2X9SmxmwGED93OJHGJrWmKhRdIPTtc1MZtPVIL2VyPH/u', 'keuangan', 'Y', '2022-01-08 09:46:27', '2022-01-14 23:59:00');
INSERT INTO `users` VALUES (14, 'kensie', 'kensie@poetra.co', '$2a$10$fyfzvPyVZ6z9NHTx6m2VeeN91N6xWt6LaIGqzky/1Aw0TgKIrMfoq', 'direktur', 'Y', '2022-01-15 09:15:31', '2022-01-15 09:15:31');
INSERT INTO `users` VALUES (15, 'logistik', 'managerlogistik@localhost.com', '$2a$10$QLXmfDhKvBD8U9AC3It81udNTzpeQhkaqVRBs949eWwuMVNwHXpZi', 'logistik', 'N', '2022-02-06 10:38:27', '2022-03-19 16:16:40');
INSERT INTO `users` VALUES (16, 'staff', 'staff@localhost.com', '$2a$10$qfy8CWqzQ2Xeu/XYV50Fo.55iZwLOkuwBlbwR8wHqdAOaik.vmNdO', 'staff', 'N', '2022-02-06 10:39:41', '2022-03-19 16:16:23');
COMMIT;

-- ----------------------------
-- Table structure for usr_bisnis_units
-- ----------------------------
DROP TABLE IF EXISTS `usr_bisnis_units`;
CREATE TABLE `usr_bisnis_units` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `bisnis_unit_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `bisnis_unit_id` (`bisnis_unit_id`) USING BTREE,
  CONSTRAINT `usr_bisnis_units_bisnis_unit_id_foreign` FOREIGN KEY (`bisnis_unit_id`) REFERENCES `bisnis_units` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usr_bisnis_units_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_bisnis_units
-- ----------------------------
BEGIN;
INSERT INTO `usr_bisnis_units` VALUES (1, 1, 1, '2022-02-18 12:03:36', '2022-02-18 12:03:36');
COMMIT;

-- ----------------------------
-- Table structure for usr_cabangs
-- ----------------------------
DROP TABLE IF EXISTS `usr_cabangs`;
CREATE TABLE `usr_cabangs` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `aktif` char(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `usr_cabang_user_idx_foreign` (`user_id`) USING BTREE,
  KEY `usr_cabang_cabang_idx_foreign` (`cabang_id`) USING BTREE,
  CONSTRAINT `usr_cabang_cabang_idx_foreign` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usr_cabang_user_idx_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_cabangs
-- ----------------------------
BEGIN;
INSERT INTO `usr_cabangs` VALUES (1, 1, 1, 'Y', '2022-05-06 13:25:31', '2022-07-24 16:44:35');
INSERT INTO `usr_cabangs` VALUES (2, 1, 2, 'N', '2022-05-06 13:25:19', '2022-07-24 16:44:35');
INSERT INTO `usr_cabangs` VALUES (5, 3, 1, 'Y', '2022-06-29 11:25:45', '2022-06-29 11:25:54');
INSERT INTO `usr_cabangs` VALUES (6, 3, 2, 'N', '2022-06-29 11:25:45', '2022-06-29 11:25:58');
COMMIT;

-- ----------------------------
-- Table structure for usr_menus
-- ----------------------------
DROP TABLE IF EXISTS `usr_menus`;
CREATE TABLE `usr_menus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `menu_id` int(10) unsigned DEFAULT NULL,
  `submenu_id` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `usr_menus_user_id_foreign` (`user_id`) USING BTREE,
  KEY `usr_menus_menu_id_foreign` (`menu_id`) USING BTREE,
  KEY `usr_menus_submenu_id_foreign` (`submenu_id`) USING BTREE,
  CONSTRAINT `usr_menus_menu_id_foreign` FOREIGN KEY (`menu_id`) REFERENCES `sys_menus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usr_menus_submenu_id_foreign` FOREIGN KEY (`submenu_id`) REFERENCES `sys_submenus` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usr_menus_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_menus
-- ----------------------------
BEGIN;
INSERT INTO `usr_menus` VALUES (1, 1, 1, 1, 'N', '2021-11-23 23:20:04', '2021-11-23 23:20:06');
INSERT INTO `usr_menus` VALUES (2, 1, 1, 2, 'Y', '2021-11-24 08:45:35', '2021-11-24 08:45:37');
INSERT INTO `usr_menus` VALUES (3, 1, 6, 3, 'Y', '2021-11-24 22:39:44', '2021-11-24 22:39:47');
INSERT INTO `usr_menus` VALUES (4, 1, 2, 4, 'Y', '2021-12-01 15:57:14', '2021-12-01 15:57:17');
INSERT INTO `usr_menus` VALUES (5, 1, 2, 5, 'Y', '2021-12-02 08:47:42', '2021-12-02 08:47:45');
INSERT INTO `usr_menus` VALUES (6, 1, 2, 6, 'Y', '2021-12-04 23:21:39', '2021-12-04 23:21:42');
INSERT INTO `usr_menus` VALUES (7, 1, 2, 7, 'Y', '2021-12-08 10:11:02', '2021-12-08 10:11:02');
INSERT INTO `usr_menus` VALUES (8, 1, 3, 8, 'Y', '2021-12-08 10:11:02', '2021-12-08 10:11:02');
INSERT INTO `usr_menus` VALUES (9, 1, 2, 9, 'N', '2021-12-13 01:17:39', '2021-12-13 01:17:42');
INSERT INTO `usr_menus` VALUES (10, 1, 2, 10, 'Y', '2021-12-19 19:43:33', '2021-12-19 19:43:36');
INSERT INTO `usr_menus` VALUES (11, 1, 2, 11, 'Y', '2021-12-21 15:25:14', '2021-12-21 15:25:17');
INSERT INTO `usr_menus` VALUES (12, 1, 2, 12, 'Y', '2021-12-28 12:29:26', '2021-12-28 12:29:29');
INSERT INTO `usr_menus` VALUES (13, 1, 2, 13, 'Y', '2022-01-03 16:20:49', '2022-01-03 16:20:52');
INSERT INTO `usr_menus` VALUES (14, 1, 6, 14, 'Y', '2022-01-07 01:27:07', '2022-01-07 01:27:09');
INSERT INTO `usr_menus` VALUES (15, 1, 1, 15, 'Y', '2022-01-07 01:27:24', '2022-01-07 01:27:28');
INSERT INTO `usr_menus` VALUES (16, 1, 1, 16, 'Y', '2022-01-07 01:45:02', '2022-01-07 01:45:04');
INSERT INTO `usr_menus` VALUES (37, 14, 1, 1, 'Y', '2022-01-15 09:16:14', '2022-01-15 09:16:14');
INSERT INTO `usr_menus` VALUES (38, 14, 1, 2, 'Y', '2022-01-15 09:16:14', '2022-01-15 09:16:14');
INSERT INTO `usr_menus` VALUES (39, 14, 6, 3, 'Y', '2022-01-15 09:16:14', '2022-01-15 09:16:14');
INSERT INTO `usr_menus` VALUES (40, 14, 2, 5, 'N', '2022-01-15 09:16:14', '2022-01-15 09:16:14');
INSERT INTO `usr_menus` VALUES (41, 14, 2, 4, 'N', '2022-01-15 09:16:14', '2022-01-15 09:16:14');
INSERT INTO `usr_menus` VALUES (42, 1, 6, 17, 'Y', '2022-01-15 10:10:34', '2022-01-15 10:10:36');
INSERT INTO `usr_menus` VALUES (43, 14, 2, 10, 'Y', '2022-01-16 18:16:39', '2022-01-16 23:48:56');
INSERT INTO `usr_menus` VALUES (44, 1, 1, 18, 'Y', '2022-01-17 10:26:33', '2022-01-17 10:26:35');
INSERT INTO `usr_menus` VALUES (45, 1, 1, 19, 'Y', '2022-01-17 10:28:23', '2022-01-17 10:28:26');
INSERT INTO `usr_menus` VALUES (46, 1, 6, 20, 'Y', '2022-01-17 10:30:35', '2022-01-17 10:30:37');
INSERT INTO `usr_menus` VALUES (47, 1, 1, 21, 'Y', '2022-01-17 10:33:48', '2022-01-17 10:33:51');
INSERT INTO `usr_menus` VALUES (48, 1, 1, 22, 'Y', '2022-01-17 10:34:02', '2022-01-17 10:34:04');
INSERT INTO `usr_menus` VALUES (49, 1, 1, 23, 'Y', '2022-01-31 15:19:12', '2022-01-31 15:19:15');
INSERT INTO `usr_menus` VALUES (50, 1, 1, 24, 'Y', '2022-02-04 10:00:59', '2022-02-04 10:01:01');
INSERT INTO `usr_menus` VALUES (51, 1, 5, 25, 'N', '2022-02-04 10:00:59', '2022-02-04 10:01:01');
INSERT INTO `usr_menus` VALUES (52, 1, 5, 26, 'N', '2022-02-04 10:00:59', '2022-02-04 10:01:01');
INSERT INTO `usr_menus` VALUES (53, 1, 5, 27, 'N', '2022-02-04 10:00:59', '2022-02-04 10:01:01');
INSERT INTO `usr_menus` VALUES (54, 1, 5, 28, 'N', '2022-02-04 10:00:59', '2022-02-04 10:01:01');
INSERT INTO `usr_menus` VALUES (55, 16, 1, 1, 'N', '2022-02-06 10:40:07', '2022-02-06 10:41:36');
INSERT INTO `usr_menus` VALUES (56, 16, 1, 2, 'N', '2022-02-06 10:40:07', '2022-02-06 10:41:30');
INSERT INTO `usr_menus` VALUES (57, 16, 6, 3, 'N', '2022-02-06 10:40:07', '2022-02-06 10:41:20');
INSERT INTO `usr_menus` VALUES (58, 16, 2, 5, 'N', '2022-02-06 10:40:07', '2022-02-06 10:41:12');
INSERT INTO `usr_menus` VALUES (59, 16, 2, 4, 'N', '2022-02-06 10:40:07', '2022-02-06 10:41:05');
INSERT INTO `usr_menus` VALUES (60, 16, 2, 6, 'Y', '2022-02-06 10:42:00', '2022-02-06 10:42:00');
INSERT INTO `usr_menus` VALUES (62, 1, 1, 29, 'Y', '2022-02-06 11:15:00', '2022-02-06 11:15:02');
INSERT INTO `usr_menus` VALUES (63, 1, 2, 30, 'Y', '2022-02-06 20:49:19', '2022-02-06 20:49:21');
INSERT INTO `usr_menus` VALUES (64, 1, 2, 31, 'N', '2022-02-08 14:23:31', '2022-02-08 14:23:33');
INSERT INTO `usr_menus` VALUES (65, 1, 2, 32, 'Y', '2022-02-09 15:38:19', '2022-02-09 15:38:21');
INSERT INTO `usr_menus` VALUES (66, 1, 2, 33, 'Y', '2022-02-10 11:08:22', '2022-02-10 11:08:25');
INSERT INTO `usr_menus` VALUES (67, 1, 5, 34, 'N', '2022-03-06 18:14:27', '2022-03-06 18:14:29');
INSERT INTO `usr_menus` VALUES (68, 1, 1, 35, 'Y', '2022-04-06 15:24:58', '2022-04-06 15:25:00');
INSERT INTO `usr_menus` VALUES (69, 1, 1, 36, 'Y', '2022-04-06 15:24:58', '2022-04-06 15:25:00');
INSERT INTO `usr_menus` VALUES (70, 1, 1, 37, 'Y', '2022-04-06 15:24:58', '2022-04-06 15:25:00');
INSERT INTO `usr_menus` VALUES (71, 1, 1, 38, 'Y', '2022-04-09 21:24:34', '2022-04-09 21:24:36');
INSERT INTO `usr_menus` VALUES (72, 1, 4, 25, 'Y', NULL, NULL);
INSERT INTO `usr_menus` VALUES (73, 1, 5, 39, 'Y', NULL, NULL);
INSERT INTO `usr_menus` VALUES (74, 3, 1, 1, 'N', '2022-06-29 11:14:55', '2022-06-29 15:36:48');
INSERT INTO `usr_menus` VALUES (75, 3, 1, 2, 'Y', '2022-06-29 11:14:55', '2022-06-29 11:14:55');
INSERT INTO `usr_menus` VALUES (76, 3, 5, 3, 'Y', '2022-06-29 11:14:55', '2022-06-29 11:14:55');
INSERT INTO `usr_menus` VALUES (77, 3, 2, 5, 'Y', '2022-06-29 11:14:55', '2022-06-29 11:14:55');
INSERT INTO `usr_menus` VALUES (78, 3, 2, 4, 'Y', '2022-06-29 11:14:55', '2022-06-29 11:14:55');
INSERT INTO `usr_menus` VALUES (79, 3, 2, 30, 'Y', '2022-06-29 11:19:41', '2022-06-29 11:19:41');
INSERT INTO `usr_menus` VALUES (80, 3, 3, 8, 'Y', '2022-08-09 15:01:54', '2022-08-09 15:01:54');
INSERT INTO `usr_menus` VALUES (81, 1, 3, 40, 'Y', '2022-09-12 11:31:15', '2022-09-12 11:31:16');
COMMIT;

-- ----------------------------
-- Table structure for usr_privilages
-- ----------------------------
DROP TABLE IF EXISTS `usr_privilages`;
CREATE TABLE `usr_privilages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `konten` varchar(100) NOT NULL,
  `create` char(1) DEFAULT NULL,
  `read` char(1) DEFAULT NULL,
  `update` char(1) DEFAULT NULL,
  `delete` char(1) DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `usr_privilages_user_id_foreign` (`user_id`) USING BTREE,
  KEY `usr_privilages_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `usr_privilages_createdby_foreign` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`),
  CONSTRAINT `usr_privilages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_privilages
-- ----------------------------
BEGIN;
INSERT INTO `usr_privilages` VALUES (1, 1, 'bisnis', 'Y', 'Y', 'Y', 'Y', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `usr_privilages` VALUES (2, 1, 'barang', NULL, 'Y', 'Y', NULL, 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `usr_privilages` VALUES (3, 1, 'coa', 'Y', 'Y', 'Y', 'Y', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `usr_privilages` VALUES (4, 1, 'bank-kas', 'Y', 'Y', 'Y', 'Y', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `usr_privilages` VALUES (17, 1, 'ringkasan', 'Y', 'Y', 'Y', 'Y', 1, 'Y', '2022-01-10 00:37:13', '2022-01-10 00:37:13');
INSERT INTO `usr_privilages` VALUES (18, 1, 'pr', NULL, 'Y', 'Y', 'Y', 1, 'Y', '2022-01-10 00:38:02', '2022-01-10 00:38:02');
INSERT INTO `usr_privilages` VALUES (20, 3, 'persediaan-barang', 'Y', 'Y', NULL, NULL, 1, 'Y', '2022-01-10 12:18:46', '2022-01-10 12:19:01');
INSERT INTO `usr_privilages` VALUES (21, 3, 'pr', 'Y', 'Y', NULL, NULL, 1, 'Y', '2022-01-14 23:59:30', '2022-01-15 00:10:04');
INSERT INTO `usr_privilages` VALUES (22, 14, 'ringkasan', NULL, NULL, 'Y', NULL, 1, 'Y', '2022-01-15 09:59:03', '2022-01-16 08:27:28');
INSERT INTO `usr_privilages` VALUES (23, 16, 'pr', 'Y', 'Y', NULL, NULL, 1, 'Y', '2022-02-06 10:44:07', '2022-02-06 10:49:30');
INSERT INTO `usr_privilages` VALUES (24, 16, 'daily-monitoring', NULL, 'Y', NULL, NULL, 1, 'Y', '2022-02-06 11:01:44', '2022-02-06 11:01:44');
INSERT INTO `usr_privilages` VALUES (25, 3, 'transfer-kasbank', 'Y', 'Y', 'Y', NULL, 1, 'Y', '2022-06-29 11:18:16', '2022-06-29 11:18:16');
INSERT INTO `usr_privilages` VALUES (26, 3, 'terima-barang', 'Y', 'Y', 'Y', NULL, 1, 'Y', '2022-08-09 15:03:01', '2022-08-09 15:03:01');
INSERT INTO `usr_privilages` VALUES (27, 1, 'stok-opname', 'Y', 'Y', 'Y', 'Y', 1, 'Y', '2022-09-12 11:36:42', '2022-09-12 11:36:45');
COMMIT;

-- ----------------------------
-- Table structure for usr_profiles
-- ----------------------------
DROP TABLE IF EXISTS `usr_profiles`;
CREATE TABLE `usr_profiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `nama_lengkap` varchar(200) NOT NULL,
  `handphone` varchar(16) DEFAULT NULL,
  `telephone` varchar(16) DEFAULT NULL,
  `alamat` varchar(200) DEFAULT NULL,
  `jenkel` enum('m','f') DEFAULT NULL,
  `avatar` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `usr_profiles_user_id_foreign` (`user_id`) USING BTREE,
  CONSTRAINT `usr_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_profiles
-- ----------------------------
BEGIN;
INSERT INTO `usr_profiles` VALUES (1, 1, 'developer', '081355719747', '081393270171', 'JL. Pacalaya No.06 Makassar', 'm', 'avatar/USR-20220108102757.jpg', '2021-11-24 10:14:53', '2022-01-08 10:27:57');
INSERT INTO `usr_profiles` VALUES (3, 3, 'ayat ekapoetra', '08114107717', '6281393270171', 'JL. Pacalaya No.06', 'f', NULL, '2022-01-08 09:46:27', '2022-01-14 23:59:00');
INSERT INTO `usr_profiles` VALUES (4, NULL, 'kenzie', '08114107717', '081393270171', 'JL. Pacalaya No.06', 'm', 'avatar/USR-20220115002429.jpg', '2022-01-15 00:24:30', '2022-01-15 00:24:30');
INSERT INTO `usr_profiles` VALUES (8, NULL, 'kaivan', '08114107717', '6281393270171', 'JL. Hertasning 7 No.22c', 'm', NULL, '2022-01-15 08:54:59', '2022-01-15 08:54:59');
INSERT INTO `usr_profiles` VALUES (9, 14, 'Alfatih Kenzie Poetra', '08114107717', '081393270171', 'JL. Hertasning 7 No.22c', 'm', 'avatar/USR-20220115091531.jpg', '2022-01-15 09:15:31', '2022-01-15 09:15:31');
INSERT INTO `usr_profiles` VALUES (10, 15, 'manager logistik', '08114107717', '6281393270171', 'xxx', 'm', 'avatar/USR-20220206103826.jpg', '2022-02-06 10:38:27', '2022-02-06 10:38:27');
INSERT INTO `usr_profiles` VALUES (11, 16, 'staff', '8114107717', '081393270171', 'zxzxzxz', 'f', 'avatar/USR-20220206103941.png', '2022-02-06 10:39:41', '2022-02-06 10:39:41');
COMMIT;

-- ----------------------------
-- Table structure for usr_workspaces
-- ----------------------------
DROP TABLE IF EXISTS `usr_workspaces`;
CREATE TABLE `usr_workspaces` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `usr_workspaces_user_id_foreign` (`user_id`) USING BTREE,
  KEY `usr_workspaces_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  CONSTRAINT `usr_workspaces_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `usr_workspaces_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_workspaces
-- ----------------------------
BEGIN;
INSERT INTO `usr_workspaces` VALUES (1, 1, 1, '2022-02-18 12:00:42', '2022-02-18 12:16:50');
COMMIT;

-- ----------------------------
-- Table structure for x_usr_privilages
-- ----------------------------
DROP TABLE IF EXISTS `x_usr_privilages`;
CREATE TABLE `x_usr_privilages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned DEFAULT NULL,
  `konten` varchar(100) NOT NULL,
  `method` enum('c','r','u','d') NOT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `usr_privilages_user_id_foreign` (`user_id`) USING BTREE,
  KEY `usr_privilages_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `x_usr_privilages_ibfk_1` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`),
  CONSTRAINT `x_usr_privilages_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of x_usr_privilages
-- ----------------------------
BEGIN;
INSERT INTO `x_usr_privilages` VALUES (1, 1, 'bisnis', 'c', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (2, 1, 'bisnis', 'r', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (3, 1, 'bisnis', 'u', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (4, 1, 'bisnis', 'd', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (5, 1, 'barang', 'c', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (6, 1, 'barang', 'r', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (7, 1, 'barang', 'u', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (8, 1, 'barang', 'd', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (9, 1, 'coa', 'c', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (10, 1, 'coa', 'r', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (11, 1, 'coa', 'u', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (12, 1, 'coa', 'd', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (13, 1, 'bank-kas', 'c', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (14, 1, 'bank-kas', 'r', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (15, 1, 'bank-kas', 'u', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
INSERT INTO `x_usr_privilages` VALUES (16, 1, 'bank-kas', 'd', 1, 'Y', '2021-12-02 09:34:11', '2021-12-02 09:34:11');
COMMIT;

-- ----------------------------
-- Table structure for xxx_harga_rentals
-- ----------------------------
DROP TABLE IF EXISTS `xxx_harga_rentals`;
CREATE TABLE `xxx_harga_rentals` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `equipment_id` int(10) unsigned DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `periode` varchar(20) DEFAULT NULL,
  `harga` float(20,2) DEFAULT '0.00',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `harga_rentals_equipment_id_foreign` (`equipment_id`) USING BTREE,
  KEY `harga_rentals_bisnis_id_foreign` (`bisnis_id`) USING BTREE,
  CONSTRAINT `harga_rentals_bisnis_id_foreign` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `harga_rentals_equipment_id_foreign` FOREIGN KEY (`equipment_id`) REFERENCES `mas_equipment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of xxx_harga_rentals
-- ----------------------------
BEGIN;
INSERT INTO `xxx_harga_rentals` VALUES (1, 33, NULL, '11-2021', 350000.00, '2021-12-18 10:20:26', '2021-12-18 10:20:28');
COMMIT;

-- ----------------------------
-- Table structure for xxx_mas_banks
-- ----------------------------
DROP TABLE IF EXISTS `xxx_mas_banks`;
CREATE TABLE `xxx_mas_banks` (
  `kode` varchar(255) NOT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `initial` varchar(10) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rekening` varchar(255) DEFAULT NULL,
  `saldo_net` float(20,2) NOT NULL DEFAULT '0.00',
  `setor_tunda` float(20,2) DEFAULT '0.00',
  `tarik_tunda` float(20,2) DEFAULT '0.00',
  `saldo_rill` float(20,2) DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`kode`) USING BTREE,
  UNIQUE KEY `bank_rekeningx` (`rekening`(25)) USING BTREE,
  KEY `bank_bisnis_idx` (`bisnis_id`) USING BTREE,
  KEY `bank_coa_idx` (`coa_id`) USING BTREE,
  CONSTRAINT `bank_bisnis_idx` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `bank_coa_idx` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of xxx_mas_banks
-- ----------------------------
BEGIN;
INSERT INTO `xxx_mas_banks` VALUES ('100.1.1.1.2.2', NULL, NULL, 'BRI', 'BRI', '13232322', 0.00, 0.00, 0.00, 2000.00, 'Y', '2021-12-03 11:46:13', '2021-12-03 11:46:13');
COMMIT;

-- ----------------------------
-- Table structure for xxx_mas_kas
-- ----------------------------
DROP TABLE IF EXISTS `xxx_mas_kas`;
CREATE TABLE `xxx_mas_kas` (
  `kode` varchar(30) NOT NULL,
  `coa_id` int(10) unsigned DEFAULT NULL,
  `bisnis_id` int(10) unsigned DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `saldo_rill` float(20,2) NOT NULL DEFAULT '0.00',
  `aktif` enum('Y','N') DEFAULT 'Y',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`kode`) USING BTREE,
  KEY `bank_bisnis_idx` (`bisnis_id`) USING BTREE,
  KEY `mas_kas_ibfk_2` (`coa_id`) USING BTREE,
  CONSTRAINT `xxx_mas_kas_ibfk_1` FOREIGN KEY (`bisnis_id`) REFERENCES `bisnis_units` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `xxx_mas_kas_ibfk_2` FOREIGN KEY (`coa_id`) REFERENCES `acc_coas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of xxx_mas_kas
-- ----------------------------
BEGIN;
INSERT INTO `xxx_mas_kas` VALUES ('100.1.1.1.1.1', NULL, NULL, 'Kas Kecil', 2000000.00, 'Y', '2021-12-02 14:20:37', '2021-12-02 14:48:27');
COMMIT;

-- ----------------------------
-- Table structure for xxx_ops_part_requireds
-- ----------------------------
DROP TABLE IF EXISTS `xxx_ops_part_requireds`;
CREATE TABLE `xxx_ops_part_requireds` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of xxx_ops_part_requireds
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for xxx_trx_request_orders
-- ----------------------------
DROP TABLE IF EXISTS `xxx_trx_request_orders`;
CREATE TABLE `xxx_trx_request_orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cabang_id` int(10) unsigned DEFAULT NULL,
  `gudang_id` int(10) unsigned DEFAULT NULL,
  `date` date NOT NULL,
  `total` float(10,2) DEFAULT '0.00',
  `kode` varchar(255) NOT NULL,
  `narasi` varchar(255) DEFAULT NULL,
  `status` enum('created','approved','finish') DEFAULT 'created',
  `url_file` varchar(255) DEFAULT NULL,
  `createdby` int(10) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `trx_request_orders_cabang_id_foreign` (`cabang_id`) USING BTREE,
  KEY `trx_request_orders_gudang_id_foreign` (`gudang_id`) USING BTREE,
  KEY `trx_request_orders_createdby_foreign` (`createdby`) USING BTREE,
  CONSTRAINT `xxx_trx_request_orders_ibfk_1` FOREIGN KEY (`cabang_id`) REFERENCES `mas_cabangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `xxx_trx_request_orders_ibfk_2` FOREIGN KEY (`createdby`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `xxx_trx_request_orders_ibfk_3` FOREIGN KEY (`gudang_id`) REFERENCES `mas_gudangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of xxx_trx_request_orders
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- View structure for v_barang_harga
-- ----------------------------
DROP VIEW IF EXISTS `v_barang_harga`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_barang_harga` AS select `a`.`id` AS `id`,`a`.`kode` AS `kode`,`a`.`num_part` AS `num_part`,`a`.`nama` AS `nama`,`a`.`satuan` AS `satuan`,`a`.`min_stok` AS `min_stok`,`a`.`photo` AS `photo`,`a`.`brand_id` AS `brand_id`,`b`.`nama` AS `nm_brand`,`a`.`kategori_id` AS `kategori_id`,`c`.`nama` AS `nm_kategori`,`a`.`qualitas_id` AS `qualitas_id`,`d`.`nama` AS `nm_qualitas`,`e`.`id` AS `harga_beli_id`,`e`.`periode` AS `periode_beli`,`e`.`harga_beli` AS `harga_beli`,`f`.`id` AS `harga_jual_id`,`f`.`periode` AS `periode_jual`,`f`.`harga_jual` AS `harga_jual`,`a`.`aktif` AS `aktif` from (((((`mas_barangs` `a` join `barang_brands` `b` on((`a`.`brand_id` = `b`.`id`))) join `barang_categories` `c` on((`a`.`kategori_id` = `c`.`id`))) join `barang_qualities` `d` on((`a`.`qualitas_id` = `d`.`id`))) join `harga_belis` `e` on((`a`.`id` = `e`.`barang_id`))) join `harga_juals` `f` on((`a`.`id` = `f`.`barang_id`)));

-- ----------------------------
-- View structure for v_barang_stok
-- ----------------------------
DROP VIEW IF EXISTS `v_barang_stok`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_barang_stok` AS select `a`.`barang_id` AS `id`,`a`.`gudang_id` AS `gudang_id`,`a`.`cabang_id` AS `cabang_id`,`d`.`kode` AS `kd_barang`,`d`.`nama` AS `nm_barang`,`d`.`num_part` AS `partNumber`,`b`.`kode` AS `kd_cabang`,`b`.`nama` AS `nm_cabang`,`c`.`kode` AS `kd_gudang`,`c`.`nama` AS `nm_gudang`,sum(`a`.`qty_rec`) AS `brg_onreceived`,sum(`a`.`qty_del`) AS `brg_ondelivered`,((sum(`a`.`qty_hand`) + sum(`a`.`qty_rec`)) - sum(`a`.`qty_del`)) AS `brg_own`,sum(`a`.`qty_hand`) AS `brg_hand` from (((`barang_lokasis` `a` join `mas_cabangs` `b` on((`a`.`cabang_id` = `b`.`id`))) join `mas_gudangs` `c` on((`a`.`gudang_id` = `c`.`id`))) join `mas_barangs` `d` on((`a`.`barang_id` = `d`.`id`))) group by `a`.`cabang_id`,`a`.`gudang_id`,`a`.`barang_id`;

-- ----------------------------
-- View structure for v_persediaan
-- ----------------------------
DROP VIEW IF EXISTS `v_persediaan`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_persediaan` AS select `mas_barangs`.`id` AS `id`,`mas_barangs`.`kode` AS `kode`,`mas_barangs`.`nama` AS `nama`,`mas_barangs`.`satuan` AS `satuan`,`mas_barangs`.`photo` AS `photo`,`barang_lokasis`.`cabang_id` AS `cabang_id`,`barang_lokasis`.`gudang_id` AS `gudang_id`,`barang_lokasis`.`qty_hand` AS `qty_hand`,`barang_lokasis`.`qty_rec` AS `qty_rec`,`barang_lokasis`.`qty_del` AS `qty_del`,`barang_lokasis`.`qty_own` AS `qty_own`,`harga_juals`.`periode` AS `per_jual`,`harga_juals`.`harga_jual` AS `harga_jual`,`harga_belis`.`periode` AS `per_beli`,`harga_belis`.`harga_beli` AS `harga_beli` from (((`mas_barangs` join `barang_lokasis` on((`mas_barangs`.`id` = `barang_lokasis`.`barang_id`))) join `harga_juals` on((`mas_barangs`.`id` = `harga_juals`.`barang_id`))) join `harga_belis` on((`mas_barangs`.`id` = `harga_belis`.`barang_id`)));

-- ----------------------------
-- View structure for v_privilages
-- ----------------------------
DROP VIEW IF EXISTS `v_privilages`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_privilages` AS select `usr_privilages`.`id` AS `id`,`users`.`id` AS `user_id`,`users`.`usertype` AS `usertype`,`usr_privilages`.`konten` AS `konten`,`usr_privilages`.`create` AS `create`,`usr_privilages`.`read` AS `read`,`usr_privilages`.`update` AS `update`,`usr_privilages`.`delete` AS `delete`,`usr_privilages`.`aktif` AS `aktif`,`usr_profiles`.`nama_lengkap` AS `nama_lengkap` from ((`users` join `usr_privilages` on((`users`.`id` = `usr_privilages`.`user_id`))) join `usr_profiles` on((`users`.`id` = `usr_profiles`.`user_id`)));

-- ----------------------------
-- View structure for v_users
-- ----------------------------
DROP VIEW IF EXISTS `v_users`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `v_users` AS select `users`.`id` AS `id`,`users`.`username` AS `username`,`users`.`email` AS `email`,`users`.`password` AS `password`,`users`.`usertype` AS `usertype`,`users`.`aktif` AS `aktif`,`usr_profiles`.`nama_lengkap` AS `nama_lengkap`,`usr_profiles`.`handphone` AS `handphone`,`usr_profiles`.`telephone` AS `telephone`,`usr_profiles`.`alamat` AS `alamat`,`usr_profiles`.`jenkel` AS `jenkel`,`usr_profiles`.`avatar` AS `avatar`,`usr_cabangs`.`cabang_id` AS `cabang_id` from ((`users` join `usr_profiles` on((`users`.`id` = `usr_profiles`.`user_id`))) join `usr_cabangs` on((`users`.`id` = `usr_cabangs`.`user_id`))) where (`usr_cabangs`.`aktif` = 'Y');

-- ----------------------------
-- Triggers structure for table pay_pelanggan
-- ----------------------------
DROP TRIGGER IF EXISTS `after_insert_paypelanggan`;
delimiter ;;
CREATE TRIGGER `after_insert_paypelanggan` AFTER INSERT ON `pay_pelanggan` FOR EACH ROW BEGIN
		UPDATE ord_pelanggan
		SET 
		paid_trx = IF((SELECT SUM(paid_trx) AS paid FROM pay_pelanggan WHERE aktif = 'Y' AND order_id = new.order_id) <> 0, (SELECT SUM(paid_trx) AS paid FROM pay_pelanggan WHERE aktif = 'Y' AND order_id = new.order_id), 0),
		sisa_trx = grandtot_trx - paid_trx,
		status = IF((new.paid_trx - grandtot_trx) <> 0, (IF((SELECT COUNT(aktif) FROM pay_pelanggan WHERE (aktif = 'Y') AND (order_id = new.order_id)) > 0, 'dp', 'ready')), 'lunas')
		WHERE id = new.order_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table pay_pelanggan
-- ----------------------------
DROP TRIGGER IF EXISTS `after_upd_paypelanggan`;
delimiter ;;
CREATE TRIGGER `after_upd_paypelanggan` AFTER UPDATE ON `pay_pelanggan` FOR EACH ROW BEGIN
		UPDATE ord_pelanggan
		SET 
		paid_trx = IF((SELECT SUM(paid_trx) AS paid FROM pay_pelanggan WHERE aktif = 'Y' AND order_id = new.order_id) <> 0, (SELECT SUM(paid_trx) AS paid FROM pay_pelanggan WHERE aktif = 'Y' AND order_id = new.order_id), 0),
		sisa_trx = grandtot_trx - paid_trx,
		status = IF((new.paid_trx - grandtot_trx) <> 0, (IF((SELECT COUNT(aktif) FROM pay_pelanggan WHERE (aktif = 'Y') AND (order_id = new.order_id)) > 0, 'dp', 'ready')), 'lunas')
		WHERE id = new.order_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table pay_pelanggan
-- ----------------------------
DROP TRIGGER IF EXISTS `after_delete_paypelanggan`;
delimiter ;;
CREATE TRIGGER `after_delete_paypelanggan` AFTER DELETE ON `pay_pelanggan` FOR EACH ROW BEGIN
		UPDATE ord_pelanggan
		SET 
		paid_trx = IF((SELECT SUM(paid_trx) AS paid FROM pay_pelanggan WHERE aktif = 'Y' AND order_id = old.order_id) <> 0, (SELECT SUM(paid_trx) AS paid FROM pay_pelanggan WHERE aktif = 'Y' AND order_id = old.order_id), 0),
		sisa_trx = grandtot_trx - paid_trx,
		status = IF((old.paid_trx - grandtot_trx) <> 0, 'dp', 'lunas')
		WHERE id = old.order_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table trx_banks
-- ----------------------------
DROP TRIGGER IF EXISTS `after_insert_trx_bank`;
delimiter ;;
CREATE TRIGGER `after_insert_trx_bank` AFTER INSERT ON `trx_banks` FOR EACH ROW BEGIN
		UPDATE keu_banks
		SET 
		saldo_net = (
			SELECT SUM(saldo_net) AS saldo_net
			FROM trx_banks 
			WHERE(bank_id = new.bank_id AND aktif = 'Y')),
		setor_tunda = (
			SELECT SUM(setor_tunda) AS setor_tunda
			FROM trx_banks 
			WHERE(bank_id = new.bank_id AND aktif = 'Y')),
		tarik_tunda = (
			SELECT SUM(tarik_tunda) AS tarik_tunda
			FROM trx_banks 
			WHERE(bank_id = new.bank_id AND aktif = 'Y'))
		WHERE id = new.bank_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table trx_banks
-- ----------------------------
DROP TRIGGER IF EXISTS `after_update_trx_bank`;
delimiter ;;
CREATE TRIGGER `after_update_trx_bank` AFTER UPDATE ON `trx_banks` FOR EACH ROW BEGIN
		UPDATE keu_banks
		SET 
		saldo_net = (
			SELECT SUM(saldo_net) AS saldo_net
			FROM trx_banks 
			WHERE(bank_id = new.bank_id AND aktif = 'Y')),
		setor_tunda = (
			SELECT SUM(setor_tunda) AS setor_tunda
			FROM trx_banks 
			WHERE(bank_id = new.bank_id AND aktif = 'Y')),
		tarik_tunda = (
			SELECT SUM(tarik_tunda) AS tarik_tunda
			FROM trx_banks 
			WHERE(bank_id = new.bank_id AND aktif = 'Y'))
		WHERE id = new.bank_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table trx_banks
-- ----------------------------
DROP TRIGGER IF EXISTS `after_delete_trx_bank`;
delimiter ;;
CREATE TRIGGER `after_delete_trx_bank` AFTER DELETE ON `trx_banks` FOR EACH ROW BEGIN
		UPDATE keu_banks
		SET 
		saldo_net = (
			SELECT SUM(saldo_net) AS saldo_net
			FROM trx_banks 
			WHERE(bank_id = old.bank_id AND aktif = 'Y')),
		setor_tunda = (
			SELECT SUM(setor_tunda) AS setor_tunda
			FROM trx_banks 
			WHERE(bank_id = old.bank_id AND aktif = 'Y')),
		tarik_tunda = (
			SELECT SUM(tarik_tunda) AS tarik_tunda
			FROM trx_banks 
			WHERE(bank_id = old.bank_id AND aktif = 'Y'))
		WHERE id = old.bank_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table trx_kases
-- ----------------------------
DROP TRIGGER IF EXISTS `after_insert_trx_kas`;
delimiter ;;
CREATE TRIGGER `after_insert_trx_kas` AFTER INSERT ON `trx_kases` FOR EACH ROW BEGIN
		UPDATE keu_kas
		SET 
		saldo_rill = (
			SELECT SUM(saldo_rill) AS saldo 
			FROM trx_kases 
			WHERE(kas_id = new.kas_id AND aktif = 'Y'))
		WHERE id = new.kas_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table trx_kases
-- ----------------------------
DROP TRIGGER IF EXISTS `after_update_trx_kas`;
delimiter ;;
CREATE TRIGGER `after_update_trx_kas` AFTER UPDATE ON `trx_kases` FOR EACH ROW BEGIN
		UPDATE keu_kas
		SET 
		saldo_rill = (
			SELECT SUM(saldo_rill) AS saldo 
			FROM trx_kases 
			WHERE(kas_id = new.kas_id AND aktif = 'Y'))
		WHERE id = new.kas_id;
END
;;
delimiter ;

-- ----------------------------
-- Triggers structure for table trx_kases
-- ----------------------------
DROP TRIGGER IF EXISTS `after_delete_trx_kas`;
delimiter ;;
CREATE TRIGGER `after_delete_trx_kas` AFTER DELETE ON `trx_kases` FOR EACH ROW BEGIN
		UPDATE keu_kas
		SET 
		saldo_rill = (
			SELECT SUM(saldo_rill) AS saldo 
			FROM trx_kases 
			WHERE(kas_id = old.kas_id AND aktif = 'Y'))
		WHERE id = old.kas_id;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
