/**
 * Created by ThinkPad-wzw on 2015/8/29.
 */

'use strict';

angular.module('epikApp').controller('acceptCtrl', function ($scope, $state, $stateParams, $modal, $filter, $window, epikBootbox, bootDialog, classfication, breadcrumButton, projectService, employeeService,customerService) {

    var projectId = $stateParams.projectId, from = $stateParams.from;

    breadcrumButton.buttons = [{
      label: '返回',
      className: 'btn returnBtn',
      handler: function () {
        $state.go('main.project.list');
      }
    }, {
      label: '存草稿',
      className: 'btn sureBtn',
      handler: function () {
        draftData();
      }
    }, {
      label: '提交',
      ngDisabled: false,
      className: 'btn sureBtn',
      handler: function () {
        submitData();
      }
    }];

    $scope.currentTab = {
      tab1: true,
      tab2: false
    }

    $scope.switchTab = function () {
      $scope.currentTab.tab1 = !$scope.currentTab.tab1;
      $scope.currentTab.tab2 = !$scope.currentTab.tab2;
    }

    $scope.open = function ($event, dateOpt) {
      $event.preventDefault();
      $event.stopPropagation();
      dateOpt.opened = true;
    };

    $scope.projectSourceCode = null;
    $scope.$watch("edit.projectSourceId", function (newValue, oldValue) {
      if (newValue !== oldValue) {
        if (!newValue) {
          $scope.projectSourceCode = null;
        } else {
          $scope.projectSourceCode = _.find($scope.projectSources, function (source) {
            return source.id === newValue;
          })["code"];
        }
      }
    })

    classfication.getByDTypes(['BusinessSource']).then(function (data) {
      $scope.projectSources = data.BusinessSource;
    });

    projectService.getDataForBizacceptInquiryinfo({projectId: projectId}).then(function (data) {
      $scope.edit = data;
      $scope.view = data;
    });

    projectService.getDataForBizacceptQueryinfoCreditapplyid({projectId: projectId}).then(function (data) {
      $scope.creditReportApplyId = data;
    });

    if (from === 'customerList' || from === 'projectList' || from === 'customerDetail') {
      //询问部分显示为填写
      $scope.canEdit = true;
    } else if (from === 'timeLine') {
      //询问部分显示为只读
      $scope.canEdit = false;
    }

    // 提交草稿
    function draftData() {
      var sData = {
        projectId: projectId,
        projectAcceptVO: $scope.edit,
        customerSoftAndMediaInfoResultVO: {
          creditReportApplyId: $scope.creditReportApplyId,
          webSiteList: $scope.webSiteList.length === 0 ? null : $scope.webSiteList,
          industryPolAnaly: $scope.industryPolAnaly,
          softInfo: $scope.softInfo,
          creditManagerRemark: $scope.creditManagerRemark,
          industryPolAnalyFileId: JSON.stringify($scope.industryPolAnalyFileId),
          softInfoFileId: JSON.stringify($scope.softInfoFileId)
        },
        customerPublicInfoQueryResultVO: $scope.rsList[0],
        saveOrSub: false,
        isBizAccept: true
      };

      projectService.putDataForBizacceptSubmit(sData).then(function (data) {
        epikBootbox.alert('保存草稿成功！');
      });
    }

    // 提交申请
    function submitData() {
      var sData = {
        projectId: projectId,
        projectAcceptVO: $scope.edit,
        customerSoftAndMediaInfoResultVO: {
          creditReportApplyId: $scope.creditReportApplyId,
          webSiteList: $scope.webSiteList.length === 0 ? null : $scope.webSiteList,
          industryPolAnaly: $scope.industryPolAnaly,
          softInfo: $scope.softInfo,
          creditManagerRemark: $scope.creditManagerRemark,
          industryPolAnalyFileId: JSON.stringify($scope.industryPolAnalyFileId),
          softInfoFileId: JSON.stringify($scope.softInfoFileId)
        },
        customerPublicInfoQueryResultVO: $scope.rsList[0],
        saveOrSub: true,
        isBizAccept: true
      };

      for (var i in $scope.form1.$error) {
        angular.forEach($scope.form1.$error[i], function(field) {
          field.$setDirty();
        });
      }

      if ($scope.form1.$invalid) {
        bootDialog.createMsg('询问部分的信息没填写完整，请完成后再提交',{
          type:'info',
        })
        return;
      }
      var isRslist = $scope.validRslist($scope.edit,$scope.rsList);
      if(isRslist) {
        breadcrumButton.buttons[2].ngDisabled = true;
        projectService.putDataForBizacceptSubmit(sData).then(function (data) {

          epikBootbox.alertSuccess('提交成功,下一步骤名称：' + data.taskName + '&nbsp;&nbsp;下一步骤处理人：' + data.taskAssigneeChs).then(function (data) {
            if (from === 'customerList') {
              $state.go('main.customer.list');
            } else if (from === 'projectList') {
              $state.go('main.project.list');
            }
          });
        });
      }
    }


    // 获取征信查询人数据
    function getAspcList(params, type) {
      if (type === 'corp') {
        projectService.getAspcCorpList(params).then(function (data) {
          if (data !== null) {
            $scope.myData1 = data.resultList;
          } else {
            $scope.myData1 = [];
          }
        });
      } else {
        projectService.getAspcIndiList(params).then(function (data) {
          if (data !== null) {
            $scope.myData = data.resultList;
          } else {
            $scope.myData = [];
          }
        });
      }
    };

    $scope.myData = [];
    $scope.myData1 = [];
    $scope.rsList = [];
    $scope.webSiteList = [];
    $scope.selectedCorpList = {};
    $scope.selectedIndiList = {};

    getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'corp');
    getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'indi');

    //获取公共信息列表
    $scope.publicInfoEditable = {};
    projectService.getDataForBizacceptQueryinfoPublicInfoList({projectId: projectId}).then(function (data) {
      if (data && data.page) {
        $scope.rsList = data.page.resultList;
      }
      if (data && data.page) {
        $scope.webSiteList = data.webSiteList;
      }

      $scope.industryPolAnaly = data.industryPolAnaly;
      $scope.softInfo = data.softInfo;
      $scope.creditManagerRemark = data.creditManagerRemark;
      $scope.industryPolAnalyFileId = data.industryPolAnalyFileId === null ? null : JSON.parse(data.industryPolAnalyFileId);
      $scope.softInfoFileId = data.softInfoFileId === null ? null : JSON.parse(data.softInfoFileId);

      _.forEach($scope.rsList, function (row) {
        if (row.customerName === $scope.edit.clientName) {
          $scope.publicInfoEditable[row.customerName] = false;
          row.relationTypeId = '2AB68ECD-5E8E-437E-8EEE-335926479AA9';
          row.relationTypeName = '主业公司';
        } else {
          $scope.publicInfoEditable[row.customerName] = true;
        }
      });
    });

    //添加编辑个人客户
    $scope.addIndividualCustomer = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'app/project/accept/modals/addIndividualCustomer.html',
        controller: 'addIndividualCustomerCtrl',
        resolve: {
          customerData: function () {
            return row;
          },
          projectId: function () {
            return projectId;
          }
        }
      });

      modalInstance.result.then(function (obj) {//确定
        //查询个人客户
        getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'indi');
      }, function () {//取消
        return false;
      });
    };

    //查看人行征信（个人）详细结果
    $scope.lookInfoCreditDetail = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'app/project/accept/modals/InfoCreditDetail.html',
        controller: 'InfoCreditDetailCtrl',
        resolve: {
          customerData: function () {
            return row;
          },
          projectId: function () {
            return projectId;
          },
          creditInfoVOs: function () {
            return customerService.getHistorytCredits(row.identityNumber, 'CT_GE_REN_KE_HU');
          }
        }
      });

      modalInstance.result.then(function (obj) {
      }, function () {//取消
        return false;
      });
    };




    //添加编辑企业客户
    $scope.addCorporateCustomer = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'app/project/accept/modals/addCorporateCustomer.html',
        controller: 'addCorporateCustomerCtrl',
        resolve: {
          customerData: function () {
            return row;
          },
          projectId: function () {
            return projectId;
          }
        }
      });

      modalInstance.result.then(function (obj) {//确定
        //查询个人客户
        getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'corp');
      }, function () {//取消
        return false;
      });
    };

    //查看人行征信（企业）详细结果
    $scope.lookCorpCreditDetail = function (row) {
      var modalInstance = $modal.open({
        templateUrl: 'app/project/accept/modals/CorpCreditDetail.html',
        controller: 'CorpCreditDetailCtrl',
        resolve: {
          customerData: function () {
            return row;
          },
          projectId: function () {
            return projectId;
          },
          creditInfoVOs: function () {
            return customerService.getHistorytCredits(row.identityNumber, 'CT_QI_YE_KE_HU');
          }
        }
      });

      modalInstance.result.then(function (obj) {
      }, function () {//取消
        return false;
      });
    };


    //编辑公共信息
    $scope.addOrEditPublicInfo = function (item) {
      var modalInstance = $modal.open({
        size: 'lg',
        templateUrl: 'app/project/accept/modals/editPublicInfo.html',
        controller: 'eidtPublicInfoCtrl',
        resolve: {
          rowData: function () {
            return item;
          },
          editable: function () {
            if (item) {
              return $scope.publicInfoEditable[item.customerName] ? true : false;
            } else {
              return true;
            }
          },
          projectId: function () {
            return projectId;
          }
        }
      });

      modalInstance.result.then(function (data) {
        debugger;
        projectService.getDataForBizacceptQueryinfoPublicInfoList({projectId: projectId}).then(function (data) {
          if (data !== null) {
            if (data.page !== null) {
              $scope.rsList = data.page.resultList;

              _.forEach($scope.rsList, function (row) {
                if (row.customerName === $scope.edit.clientName) {
                  $scope.publicInfoEditable[row.customerName] = false;
                  row.relationTypeId = '2AB68ECD-5E8E-437E-8EEE-335926479AA9';
                  row.relationTypeName = '主业公司';
                } else {
                  $scope.publicInfoEditable[row.customerName] = true;
                }
              });
            }
          }
        })
        return true;
      });
    };

    //删除公共信息
    $scope.delPublicInfo = function (item) {
      projectService.deleteDataForBizacceptQueryinfoPublicInfo([{id: item.id}]).then(function (data) {
        projectService.getDataForBizacceptQueryinfoPublicInfoList({projectId: projectId}).then(function (data) {
          if (data !== null) {
            //查询结果
            $scope.webSiteList = data.webSiteList;
            if (data.page !== null) {
              //查询方式
              $scope.rsList = data.page.resultList;
            }
          }
        })
      })
    };

    //跳转到查看客户页面
    $scope.gotoCustomerDetail = function (row) {
      $state.go("main.customer.detail", {customerId: row.getProperty('customerId')});
    };

    //删除个人客户
    $scope.removeIndividualCustomer = function (row) {
      var submitData = {
        customerVoList: [{id: row.id}],
        method: 'DELETE',
        url: '/gbp/project/v1/bizaccept/queryinfo/individual'
      };
      //友好提示  确认移除吗
      epikBootbox.confirm('确认移除？').then(function () {
        //移除
        projectService.putOrDeleteData(submitData).then(function (data) {
          getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'indi');
        })
      })
    }

    $scope.removeIndividualCustomers = function () {
      var submitData = {
        customerVoList: [],
        method: 'DELETE',
        url: '/gbp/project/v1/bizaccept/queryinfo/individual'
      };

      var selectedIndiList = $scope.selectedIndiList;

      var flag = false;
      _.forEach(selectedIndiList, function(n, key) {
        if(n){
          flag = true;
          return;
        }
      });
      if(!flag){
        epikBootbox.alertFail("请选择查询人");
        return;
      }
      //友好提示  确认移除吗
      epikBootbox.confirm('确认移除？').then(function () {
        //移除
        for (var id in $scope.selectedIndiList) {
          if ($scope.selectedIndiList[id]) {
            submitData.customerVoList.push({id: id})
          }
        }
        projectService.putOrDeleteData(submitData).then(function (data) {
          getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'indi');
        })
        $scope.selectedIndiList = {};
      })
    }

    //删除企业客户
    $scope.removeCorporateCustomer = function (row) {
      var submitData = {
        customerVoList: [{id: row.id}],
        method: 'DELETE',
        url: '/gbp/project/v1/bizaccept/queryinfo/corporation'
      };
      //友好提示  确认移除吗
      epikBootbox.confirm('确认移除？').then(function () {
        //移除
        projectService.putOrDeleteData(submitData).then(function (data) {
          getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'corp');
        })
      })
    }

    $scope.removeCorporateCustomers = function () {
      var submitData = {
        customerVoList: [],
        method: 'DELETE',
        url: '/gbp/project/v1/bizaccept/queryinfo/corporation'
      };

      var selectedCorpList = $scope.selectedCorpList;

      var flag = false;
      _.forEach(selectedCorpList, function(n, key) {
        if(n){
          flag = true;
          return;
        }
      });
      if(!flag){
        epikBootbox.alertFail("请选择查询人");
        return;
      }

      //友好提示  确认移除吗
      epikBootbox.confirm('确认移除？').then(function () {
        //移除
        for (var id in $scope.selectedCorpList) {
          if ($scope.selectedCorpList[id]) {
            submitData.customerVoList.push({id: id})
          }
        }
        projectService.putOrDeleteData(submitData).then(function (data) {
          getAspcList({pg: '1', pz: '10000', projectId: projectId}, 'corp');
        })
        $scope.selectedCorpList ={};
      })
    }

    //发起征信调查申请
    $scope.applySearchCredit = function () {
      var arrOnly = [];
      _.forEach($scope.myData, function (row) {
        arrOnly.push(row);
      })
      _.forEach($scope.myData1, function (row) {
        arrOnly.push(row);
      })
      var submitData = {
        url: '/gbp/project/v1/bizaccept/apply/cbc/creditreport',
        method: 'PUT',
        arrOnly: arrOnly
      };
      projectService.putOrDeleteData(submitData).then(function (data) {
        epikBootbox.alertSuccess('提交成功,下一步骤名称：' + data.taskName + '&nbsp;&nbsp;下一步骤处理人：' + data.taskAssigneeChs);
      })
    };

    $scope.confirmQueryPYCredits = function (customer) {
      var modalInstance = $modal.open({
        templateUrl: '/app/customer/detail/credits/custPYCreditsCommon/confirmQueryPYCredits.html',
        size: 'md',
        controller: 'ConfirmQueryPYCreditsCommonCtrl',
        resolve: {
          customer: function () {
            return customer;
          }
        }
      });
      modalInstance.result.then(function (data) {
        projectService.getDataForBizacceptQueryinfoPublicInfoList({
          projectId: projectId
        })
          .then(function (data) {
            if (data !== null) {
              ////查询结果
              //由于不会针对webSiteList做保存，反而从后台加载新的webSiteList会覆盖掉之前已经选择的结果，暂时先注释掉
              //$scope.webSiteList = data.webSiteList;
              if (data.page !== null) {
                //查询方式
                $scope.rsList = data.page.resultList;
              }
            }
          }).catch(function (data) {
            bootDialog.createMsg(data, {
              type: 'error',
              title: '错误信息',
              showCancel: false
            });
          });
        return true;
      }, function () {//取消
        return false;
      });

    };

    $scope.confirmQueryHFCredits = function (customer) {
      var modalInstance = $modal.open({
        templateUrl: '/app/customer/detail/credits/custHFCreditsCommon/confirmQueryHFCredits.html',
        size: 'md',
        controller: 'ConfirmQueryHFCreditsCommonCtrl',
        resolve: {
          customer: function () {
            return customer;
          }
        }
      })
    };

    //转介客户选择 -- 回调
    $scope.select1 = function (item) {
      console.log(item);
      $scope.edit.customerTel = item.mobile;
    }

    //转介员工选择 -- 回调
    $scope.select2 = function (item) {
      console.log(item);
      $scope.edit.employeeTitle = item.positionType;
      $scope.edit.employeeTel = item.employeeMobile;
      $scope.edit.departmentFullName = item.departmentFullNamePath;
    }
    $scope.validRslist = function (argEdit, argRslist) {
      //查询结果中其他列的必填校验
      var isComplete = true;
      for (var i = 0; i < argRslist.length; i++) {
        isComplete = isComplete && (argRslist[i].relationTypeName !== null) && (_.trim(argRslist[i].relationTypeName) !== '');
        isComplete = isComplete && (argRslist[i].customerName !== null) && (_.trim(argRslist[i].customerName) !== '');
        //isComplete=isComplete&&(argRslist[i].identityNumber!==null)&&(_.trim(argRslist[i].identityNumber)!=='');
        isComplete = isComplete && (argRslist[i].manageStatusName !== null) && (_.trim(argRslist[i].manageStatusName) !== '');
        //isComplete = isComplete && (argRslist[i].manageStopDate !== null) && (_.trim(argRslist[i].manageStopDate) !== '');
        isComplete = isComplete && (argRslist[i].isHaveLitigation !== null) && (_.trim(argRslist[i].isHaveLitigation) !== '');
        isComplete = isComplete && (argRslist[i].othersStatus !== null) && (_.trim(argRslist[i].othersStatus) !== '');
        isComplete = isComplete && (argRslist[i].isHaveNegativeInfo !== null) && (_.trim(argRslist[i].isHaveNegativeInfo) !== '');
        //isComplete=isComplete&&(argRslist[i].pycReportTime !==null)&&(_.trim(argRslist[i].pycReportTime )!=='');
        //isComplete=isComplete&&(argRslist[i].lawxpReportTime!==null)&&(_.trim(argRslist[i].lawxpReportTime)!=='');
      }
      if (isComplete) {
        return true;
      } else {
        bootDialog.createMsg('查询部分：查询结果填写不完整，请填写完整！', {
          type: 'warn',
          title: '警告信息',
          showCancel: false
        });
        return false;
      }
    }
  }
)
;
