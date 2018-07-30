/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50537
Source Host           : localhost:3306
Source Database       : test11

Target Server Type    : MYSQL
Target Server Version : 50537
File Encoding         : 65001

Date: 2016-12-21 14:52:31
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for onair_vms_library
-- ----------------------------
DROP TABLE IF EXISTS `onair_vms_library`;
CREATE TABLE `onair_vms_library` (
  `id` varchar(255) NOT NULL,
  `pid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT NULL,
  `update_time` timestamp NULL DEFAULT NULL,
  `is_delete` int(255) DEFAULT NULL,
  `update_user` varchar(255) DEFAULT NULL,
  `create_user` varchar(255) DEFAULT NULL,
  `level_id` int(255) DEFAULT NULL,
  `order_id` int(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of onair_vms_library
-- ----------------------------
INSERT INTO `onair_vms_library` VALUES ('0aa925e6-0c8f-4614-adaf-93e0cecc4bb0', '4', 'sss', '2016-12-21 14:36:23', '2016-12-21 14:36:23', '1', 'aa', 'aa', '2', null);
INSERT INTO `onair_vms_library` VALUES ('1', '0', 'qq', null, null, '1', 'ww', 'ee', '1', '1');
INSERT INTO `onair_vms_library` VALUES ('2', '1', 'ss', null, null, '1', null, null, null, '2');
INSERT INTO `onair_vms_library` VALUES ('276764c4-5662-4776-93f8-a93c79495fc0', '7bbeb752-a185-4d5a-b13b-589ca6ca9c61', 'ww', '2016-12-21 14:46:06', '2016-12-21 14:46:06', '1', 'aa', 'aa', '3', null);
INSERT INTO `onair_vms_library` VALUES ('4', '1', 'gg', null, null, '1', null, null, null, '2');
INSERT INTO `onair_vms_library` VALUES ('5', '2', 'rr', null, null, '1', null, null, null, '3');
INSERT INTO `onair_vms_library` VALUES ('7bbeb752-a185-4d5a-b13b-589ca6ca9c61', '4', 'ds', '2016-12-21 14:45:54', '2016-12-21 14:45:54', '1', 'aa', 'aa', '2', null);
INSERT INTO `onair_vms_library` VALUES ('b8032f63-93a0-47f6-9c22-924039df1d28', '2', 'xzz', null, '2016-12-21 14:44:49', '0', 'aa', 'aa', '2', null);
INSERT INTO `onair_vms_library` VALUES ('dc54e344-e2b9-42b9-b2b7-cf73ccd998da', '2', 'ff', null, '2016-12-21 14:48:29', '1', 'aa', 'aa', '2', null);
