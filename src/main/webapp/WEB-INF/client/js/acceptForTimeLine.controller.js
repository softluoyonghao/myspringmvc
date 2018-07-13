/**
 * Created by ThinkPad-wzw on 2015/10/14.
 */

'use strict';

angular.module('epikApp').controller('acceptForTimeLineCtrl',function($scope,$state,$stateParams,$modal,$filter,$window,bootDialog,classfication,breadcrumButton,projectService,Auth){

  $scope.showLDSP = false;
  //将12323.00转换为￥123,23.00
  $scope.tranMoneyFromFloatToStr = function(floatMoney){
    if(floatMoney!==null && floatMoney!==undefined){
      return $filter('currency')(floatMoney, '￥', 2);
    }else{
      return floatMoney;
    }
  };
  var state = $stateParams.state;
  var projectId = null,from = $stateParams.from;
  if($stateParams.projectId===null ||$stateParams.projectId === undefined ){
    projectId = $scope.task.businessObjectId;
    from = 'timeLine';
    if($scope.task.workflowNodeName === "MinisterReview"){
      state = 'pass';
    }
  }else{
    projectId = $stateParams.projectId;
  }

  //获取领导审批建议产品
  $scope.getSQXX = function () {
    var params = {};
    params.projectId = projectId;

    projectService.getProjectApplicationInfoList(params).then(function (data) {
      ;
      if (data !== null) {
        // 定义需要查询出来的数据 projectFfApplicationVO ，并将查询出来的数据 data 赋值给它
        $scope.suggestProductIdNames = data.products;
      }else{
        $scope.suggestProductIdNames = null;
      }
    })
  };
  if(state === null){
    //不显示领导审批
    console.log('不显示领导审批');
  }else if(state === 'pass' || state === 'sendback'){
    var taskBusinessData = $scope.taskBusinessData;
    //显示领导审批，需要加载审批相关数据
    $scope.showLDSP = true;
    if(taskBusinessData === null ||taskBusinessData === undefined){
      $scope.bRoal = $stateParams.bRoal;
      $scope.aRoal = $stateParams.aRoal;
      $scope.remark = $stateParams.remark;
      $scope.stateMsg = $stateParams.stateMsg;
      $scope.suggestProductIdNames = $stateParams.suggestProductIdNames;
      $scope.suggestLimit =$scope.tranMoneyFromFloatToStr($stateParams.suggestLimit);
    }else{
      $scope.aRoal = taskBusinessData.roleAName;
      $scope.bRoal = taskBusinessData.roleBName;
      $scope.remark = $scope.task.remark;
      $scope.stateMsg = $scope.task.opinionChs;
      if(taskBusinessData.suggestProductIdNames==null){
        $scope.getSQXX();
      }else{
        $scope.suggestProductIdNames = taskBusinessData.suggestProductIdNames;
      }
      $scope.suggestLimit =$scope.tranMoneyFromFloatToStr(taskBusinessData.suggestLimit);
    }
      console.log('显示领导审批，需要加载审批相关数据');
    //目前只有两种审批意见，1：通过，2：退回
    //TODO 此处需要一个获取流程审批意见的服务,SYS_NODE_CONF中配置的INIT_API：/gbp/project/v1/bizaccept/inquiryinfo 并没有返回审批意见
    //projectService.getData({
    //
    //});
  }


  /*待办列表进入不是这个页面，但是内容和功能几乎相同*/
  ///////////////公共部分/////////////////
  //将字符串的货比 ￥123,23.00 转换为 12323.00
  $scope.tranMoneyFromStrToFloat = function(strMoney){
    strMoney = strMoney+'';
    if(strMoney.indexOf('￥') !== -1){
      strMoney = strMoney.replace('￥','');
      while(strMoney.indexOf(',') !== -1){
        strMoney = strMoney.replace(',','');
      }
      return parseFloat(strMoney);
    }else{
      return strMoney;
    }
  };

  //面包屑右侧按钮
  breadcrumButton.buttons = [{
    label: '返回',
    className: 'btn returnBtn',
    handler: function () {
      $state.go('main.project.timeline',
        {projectId:projectId,projectName:$stateParams.projectName});
      //$window.history.go(-1);
    }
  }];

  //切换标签页保存上一个标签页的数据
  $('ul > li > a').mousedown(function (event) {
    if(_.trim($(event.target).html()) === '询问部分'){
      $('#accept_XWBF').css('display','block');
      $('#accept_CXBF').css('display','none');
      $('#accept_LDSP').css('display','none');
    }else if(_.trim($(event.target).html()) === '查询部分'){
      $('#accept_XWBF').css('display','none');
      $('#accept_CXBF').css('display','block');
      $('#accept_LDSP').css('display','none');
    }else if(_.trim($(event.target).html()) === '领导审批'){
      $('#accept_XWBF').css('display','none');
      $('#accept_CXBF').css('display','none');
      $('#accept_LDSP').css('display','block');
    }
    $('ul > li').removeClass("active");
    $(event.target.parentElement).addClass('active');
    //全量保存
    //$scope.saveOrSubmit(false,false);
  });

  //获取焦点时将type设置为number
  $scope.myFocus = function(event,key1,key2){
    if($scope[key1] !== null){
      var value = $scope.tranMoneyFromStrToFloat($scope[key1][key2] +'');
    }
    event.target.type = 'number';
    $scope[key1][key2] = value;
  };

  //失去焦点将类型设置为text
  $scope.myBlur = function(event,key1,key2){
    event.target.type = 'text';
    if($scope[key1]!== null){
      if(($scope[key1][key2]+'').indexOf('-')!==-1 || $scope[key1][key2]==='null'){
        $scope[key1][key2] = null;
      }
      $scope[key1][key2] = $filter('currency')($scope[key1][key2], '￥', 2);
    }
  };

  ///////////////询问部分/////////////////
  //来自客户列表
  if(from === 'customerList' || from === 'projectList' || from === 'customerDetail'){
    //询问部分显示为填写
    $scope.canEdit = true;
  }else if(from === 'timeLine'){
    //询问部分显示为只读
    $scope.canEdit = false;
  }
  //询问部分需要的码表数据
  classfication.getByDTypes(['BusinessSource']).then(function (data) {
    $scope.projectSources = data.BusinessSource;
  }).catch(function (data) {
    bootDialog.createMsg(data,{
      type: 'error',
      title: '错误信息',
      showCancel:false
    });
  });
  //行业选择
  $scope.select2 = function (item, model, select) {};
  //进入询问部分之后加载客户基本数据，初始化页面
  projectService.getDataForBizacceptInquiryinfo({projectId:projectId})
    .then(function(data){
      if(data!==null){
        $scope.edit = data;
        $scope.edit.businessIncome = $scope.tranMoneyFromFloatToStr($scope.edit.businessIncome);
        $scope.edit.debt = $scope.tranMoneyFromFloatToStr($scope.edit.debt);
        $scope.edit.needScale = $scope.tranMoneyFromFloatToStr($scope.edit.needScale);
        $scope.view = data;
      }
    }).catch(function (data) {
      bootDialog.createMsg(data,{
        type: 'error',
        title: '错误信息',
        showCancel:false
      });
    });

  projectService.getDataForBizacceptQueryinfoCreditapplyid({
    projectId:projectId})
    .then(function(data){
      if($scope.params === null){
        $scope.params = {};
      }
      if(data!==null){
        $scope.creditReportApplyId = data;
      }
    }).catch(function (data) {
      bootDialog.createMsg(data,{
        type: 'error',
        title: '错误信息',
        showCancel:false
      });
    });
  //提交或者存草稿 flag:false 存草稿，true 提交
  $scope.saveOrSubmit = function(flag,isShowSuccess){

    $scope.editData = $scope.edit;
    $scope.editData.businessIncome = $scope.tranMoneyFromStrToFloat($scope.edit.businessIncome);
    $scope.editData.debt = $scope.tranMoneyFromStrToFloat($scope.edit.debt);
    $scope.editData.needScale = $scope.tranMoneyFromStrToFloat($scope.edit.needScale);
    if($scope.editData.businessIncome === 'null'){
      $scope.editData.businessIncome=null;
    }
    if($scope.editData.debt === 'null'){
      $scope.editData.debt=null;
    }
    if($scope.editData.needScale === 'null'){
      $scope.editData.needScale=null;
    }
    var params = {
      projectId:projectId,
      projectAcceptVO:$scope.editData,
      customerSoftAndMediaInfoResultVO:{
        creditReportApplyId: $scope.creditReportApplyId,
        webSiteList: $scope.webSiteList.length===0?null:$scope.webSiteList,
        industryPolAnaly: $scope.industryPolAnaly,
        softInfo: $scope.softInfo,
        creditManagerRemark: $scope.creditManagerRemark,
        industryPolAnalyFileId: $scope.industryPolAnalyFileId!==null?JSON.stringify($scope.industryPolAnalyFileId):$scope.industryPolAnalyFileId,
        softInfoFileId: $scope.softInfoFileId!==null?JSON.stringify($scope.softInfoFileId):$scope.softInfoFileId
      },
      customerPublicInfoQueryResultVO:$scope.rsList[0],
      saveOrSub:flag
    };
    projectService.putDataForBizacceptSubmit(params)
      .then(function(data){
        //TODO 返回结果中如果有友好业务提示，需要显示友好业务提示！
        if(isShowSuccess){
          bootDialog.createMsg(flag?'提交成功！':'存草稿成功！',{
            type: 'success',
            title: '提示信息',
            showCancel:false,
            cb: function () {
              if (flag) {
                if (from === 'customerList') {
                  $state.go('main.customer.list');
                } else if (from === 'projectList') {
                  $state.go('main.project.list');
                }
              }
            }
          });
        }
      }).catch(function (data) {
        bootDialog.createMsg(data,{
          type: 'error',
          title: '错误信息',
          showCancel:false
        });
      });
  };
  ///////////////查询部分/////////////////

  //个人客户
  $scope.myData = [];
  //企业客户数据
  $scope.myData1 = [];
  $scope.getAspcList = function(params,type){
    if(type === 'corp'){//企业客户
      projectService.getAspcCorpList(params).then(function(data){
        if(data!==null){
          $scope.myData1 = data.resultList;
        }
      }).catch(function (data) {
        bootDialog.createMsg(data,{
          type: 'error',
          title: '错误信息',
          showCancel:false
        });
      });
    }else{//个人客户
      projectService.getAspcIndiList(params).then(function(data){
        if(data!==null){
          $scope.myData = data.resultList;
        }
      }).catch(function (data) {
        bootDialog.createMsg(data,{
          type: 'error',
          title: '错误信息',
          showCancel:false
        });
      });
    }
  };
  //查询企业客户
  $scope.getAspcList({pg:'1',pz:'10000',projectId:projectId},'corp');
  //查询个人客户
  $scope.getAspcList({pg:'1',pz:'10000',projectId:projectId},'indi');

  $scope.rsList = [];
  $scope.webSiteList = [];

  //获取公共信息列表
  projectService.getDataForBizacceptQueryinfoPublicInfoList({
    projectId:projectId})
    .then(function(data){
      if(data!==null){
        if(data.page!==null){
          //查询方式
          $scope.rsList = data.page.resultList;
        }
        if(data.webSiteList!==null){
          //查询结果
          $scope.webSiteList = data.webSiteList;
        }

        //公共信息
        $scope.industryPolAnaly =  data.industryPolAnaly;
        $scope.softInfo= data.softInfo;
        $scope.creditManagerRemark= data.creditManagerRemark;
        $scope.industryPolAnalyFileId= (data.industryPolAnalyFileId===null || "" == data.industryPolAnalyFileId)?null:JSON.parse(data.industryPolAnalyFileId);
        $scope.softInfoFileId= (data.softInfoFileId===null || "" == data.softInfoFileId)?null:JSON.parse(data.softInfoFileId);
      }
    }).catch(function (data) {
      bootDialog.createMsg(data,{
        type: 'error',
        title: '错误信息',
        showCancel:false
      });
    });

  //个人客户列表
  $scope.columnDefs = [
    {field: 'customerName', displayName: '客户姓名', cellClass: 'text-center', sortable: false},
    {field: 'industryName', displayName: '行业', cellClass: 'text-center', sortable: false},
    {field: 'identityNumber', displayName: '身份证号', cellClass: 'text-center', sortable: false},
    {
      field: 'pictureIdentity', displayName: '身份证复印件', cellClass: 'text-center', sortable: false,
      cellTemplate:
        '<span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'pictureIdentity\')">下载</span><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="show(row,\'pictureIdentity\',\'身份证复印件\')">查看</span>'
    },
    {
      field: 'pictureAuthorization', displayName: '授权书', cellClass: 'text-center',
      cellTemplate: '<span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'pictureAuthorization\')">下载</span><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="show(row,\'pictureAuthorization\',\'授权书\')">查看</span>'
    },
    {
      field: 'individualCreditId', displayName: '人行征信', cellClass: 'text-center',
      cellTemplate: '<span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'individualCreditId\')">下载</span>'
    },
    {field: 'reportorName', displayName: '查询人', headerClass: 'text-center', sortable: false},
    {field: 'reportDate', displayName: '查询时间', headerClass: 'text-center', sortable: false,
      cellTemplate: '<div class="ngCellText" title="{{row.getProperty(col.field)}}" ng-bind="row.getProperty(col.field) | date:\'yyyy-MM-dd\'"></div>'}
  ];

  $scope.downloadFile = function(row,pictureIdentity){
    var pictureItem = row.getProperty(pictureIdentity);
    var pictureItemObj = JSON.parse(pictureItem);
    var url = '/api/accessories/download?documentId='+pictureItemObj.documentId+'&filename='+pictureItemObj.filename;
    $window.open(url, '_blank');
  };

  $scope.gridOptions = {
    data: 'myData',
    showSelectionCheckbox: false,
    selectWithCheckboxOnly:true,
    selectedItems: [],
    plugins: [new ngGridFlexibleHeightPlugin()],
    i18n: 'zh-cn',
    columnDefs: $scope.columnDefs,
    rowHeight: 50,
    headerRowHeight: 50
  };

  //个人客户列表

  //企业客户列表
  $scope.columnDefs1 = [
    {
      field: 'customerName', displayName: '客户姓名', cellClass: 'text-center', sortable: false,
      cellTemplate:'<div style="line-height:50px;"><a href="#" ng-click="gotoCustomerDetail(row)">{{row.getProperty(col.field)}}</a></div>'
    },
    {field: 'industryName', displayName: '行业', cellClass: 'text-center', sortable: false},
    {field: 'identityNumber', displayName: '组织机构代码', cellClass: 'text-center', sortable: false},
    {field: 'loanCardNo', displayName: '贷款卡号', cellClass: 'text-center', sortable: false},
    {
      field: 'pictureIdentity', displayName: '贷款卡复印件', cellClass: 'text-center',
      cellTemplate: '<div class="ngCellText"><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'pictureIdentity\')">下载</span><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="show(row,\'pictureIdentity\',\'贷款卡复印件\')">查看</span></div>'
    },
    {
      field: 'pictureAuthorization', displayName: '授权书', cellClass: 'text-center',
      cellTemplate: '<div class="ngCellText"><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'pictureAuthorization\')">下载</span><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="show(row,\'pictureAuthorization\',\'授权书\')">查看</span></div>'
    },
    {
      field: 'corporationCreditId', displayName: '人行征信', cellClass: 'text-center', sortable: false,
      cellTemplate: '<div class="ngCellText"><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'corporationCreditId\')">下载</span></div>'
    },
    {field: 'reportorName', displayName: '查询人', headerClass: 'text-center', sortable: false},
    {field: 'reportDate', displayName: '查询时间', headerClass: 'text-center', sortable: false,
      cellTemplate: '<div class="ngCellText" title="{{row.getProperty(col.field)}}" ng-bind="row.getProperty(col.field) | date:\'yyyy-MM-dd\'"></div>'}
  ];

  $scope.gridOptions1 = {
    data: 'myData1',
    showSelectionCheckbox: false,
    selectWithCheckboxOnly:true,
    selectedItems: [],
    plugins: [new ngGridFlexibleHeightPlugin()],
    i18n: 'zh-cn',
    columnDefs: $scope.columnDefs1,
    rowHeight: 50,
    headerRowHeight: 50
  };

  //企业客户列表

  //添加或编辑个人客户
  $scope.addIndividualCustomer = function(row){
    var modalInstance = $modal.open({
      animation: true,
      backdrop:'static',
      //size:'sm',
      keyboard:false,
      templateUrl: 'app/project/accept/modals/addIndividualCustomer.html',
      controller: 'addIndividualCustomerCtrl',
      resolve: {
        rowData:function(){
          if(row === undefined){
            return null;
          }
          return row.entity;
        },
        projectId:function(){
          return projectId;
        }
      }
    });

    modalInstance.result.then(function (obj) {//确定
      //查询个人客户
      $scope.getAspcList({pg:'1',pz:'10000',projectId:projectId},'indi');
    }, function () {//取消
      return false;
    });
  };

  //添加或编辑企业客户
  $scope.addCorporateCustomer = function(row){
    var modalInstance = $modal.open({
      animation: true,
      backdrop:'static',
      //size:'sm',
      keyboard:false,
      templateUrl: 'app/project/accept/modals/addCorporateCustomer.html',
      controller: 'addCorporateCustomerCtrl',
      resolve: {
        rowData:function(){
          if(row === undefined){
            return null;
          }
          return row.entity;
        },
        projectId:function(){
          return projectId;
        }
      }
    });

    modalInstance.result.then(function (obj) {//确定
      //查询企业客户
      $scope.getAspcList({pg:'1',pz:'10000',projectId:projectId},'corp');
    }, function () {//取消
      return false;
    });
  };

  //编辑公共信息
  $scope.addOrEditPublicInfo = function(item){
    var modalInstance = $modal.open({
      animation: true,
      backdrop:'static',
      size:'lg',
      keyboard:false,
      templateUrl: 'app/project/accept/modals/editPublicInfo.html',
      controller: 'eidtPublicInfoCtrl',
      resolve: {
        rowData:function(){
          return item;
        },
        projectId:function(){
          return projectId;
        }
      }
    });

    modalInstance.result.then(function (data) {
      projectService.getDataForBizacceptQueryinfoPublicInfoList({
        projectId:projectId})
        .then(function(data){
          if(data!==null){
            //查询结果
            $scope.webSiteList = data.webSiteList;
            if(data.page!==null){
              //查询方式
              $scope.rsList = data.page.resultList;
            }
          }
        }).catch(function (data) {
          bootDialog.createMsg(data,{
            type: 'error',
            title: '错误信息',
            showCancel:false
          });
        });
      return true;
    }, function () {//取消
      return false;
    });
  };

  //删除公共信息
  $scope.delPublicInfo = function(item){
    var params = {
      customerVoList:[{id : item.id}]
    };
    projectService.deleteDataForBizacceptQueryinfoPublicInfo(params).then(function(data){
      bootDialog.createMsg('删除成功！',{
        type: 'success',
        title: '提示信息',
        showCancel:false,
        cb: function () {
          projectService.getDataForBizacceptQueryinfoPublicInfoList({
            projectId:projectId})
            .then(function(data){
              if(data!==null){
                //查询结果
                $scope.webSiteList = data.webSiteList;
                if(data.page!==null){
                  //查询方式
                  $scope.rsList = data.page.resultList;
                }
              }
            }).catch(function (data) {
              bootDialog.createMsg(data,{
                type: 'error',
                title: '错误信息',
                showCancel:false
              });
            });
        }
      });

    }).catch(function (data) {
      bootDialog.createMsg(data,{
        type: 'error',
        title: '错误信息',
        showCancel:false
      });
    });
  };

  //查看图片
  $scope.show = function(row,fieldName,title){

    var pictureItem = row.getProperty(fieldName);
    var pictureItemObj = JSON.parse(pictureItem)[0];
    var url = '/api/accessories/download?documentId='+pictureItemObj.documentId+'&filename='+pictureItemObj.filename;
    var slides = [{
      image:url,
      text:pictureItemObj.filename
    }];
    var modalInstance = $modal.open({
      animation: true,
      backdrop:'static',
      size:'lg',
      keyboard:false,
      templateUrl: 'app/project/accept/modals/viewPicture.html',
      controller: function($scope,$modalInstance){
        $scope.title = title;
        $scope.slides = slides;
        $('.projectPicCarousel').on('slid.bs.carousel', function () {
          // 执行一些动作...
          console.log('完成过度效果。。。');
        })

        $scope.cancel = function(){
          $modalInstance.dismiss('cancel');
        }
      }
    });
  };

  //跳转到查看客户页面
  $scope.gotoCustomerDetail = function (row) {
    $state.go("main.customer.detail", {customerId: row.getProperty('customerId')});
  };


  //发起征信调查申请
  $scope.applySearchCredit = function(){
    var paramsArr = [];
    angular.copy($scope.gridOptions.selectedItems,paramsArr);
    angular.forEach($scope.gridOptions1.selectedItems,function(value,index){
      this.push(value);
    },paramsArr);

    var obj = {
      arrOnly:paramsArr
    };

     ;
    if(paramsArr.length<1){
      bootDialog.createMsg('请选择需要查询的客户！',{
        type: 'warn',
        title: '警告信息',
        showCancel:false
      });
    }else{
      projectService.putForBizacceptApplyCbcCreditreport(obj).then(function(data){
        bootDialog.createMsg('发起查询流程成功！',{
          type: 'success',
          title: '提示信息',
          showCancel:false
        });
      }).catch(function (data) {
        bootDialog.createMsg(data,{
          type: 'error',
          title: '错误信息',
          showCancel:false
        });
      });
    }
  };

  //发起征信调查申请
  $scope.applySearchCredit = function(){
    var paramsArr = [];
    angular.copy($scope.gridOptions.selectedItems,paramsArr);
    angular.forEach($scope.gridOptions1.selectedItems,function(value,index){
      this.push(value);
    },paramsArr);

    var obj = {
      arrOnly:paramsArr
    };

    if(paramsArr.length<1){
      bootDialog.createMsg(data,{
        type: 'error',
        title: '错误信息',
        showCancel:false
      });
    }else{
      projectService.putForBizacceptApplyCbcCreditreport(obj).then(function(data){
        bootDialog.createMsg('发起查询流程成功！',{
          type: 'success',
          title: '提示信息',
          showCancel:false
        });
      }).catch(function (data) {
        bootDialog.createMsg(data,{
          type: 'error',
          title: '错误信息',
          showCancel:false
        });
      });
    }
  };

  //查看汇法报告弹框确认
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

  //上传文件
  $scope.uploadFile = function (fieldName) {
    if($scope[fieldName] === null){
      $scope[fieldName] = [];
    }
    var modalInstance = $modal.open({
      templateUrl: '/components/uploaderModal/uploaderModal.html',
      size: 'lg',
      resolve: {
        successCb: function () {
          return function(data) {
            //身份证复印件文档对象{"documentId":"4F31D054-9BA7-4EDA-B1A1-17E4155A6A87","filename":"111.png"}
            $scope[fieldName].push(data.data);
          };
        },
        errorCb : function() {
          return function(error){
            console.log(error);
          };
        }
      },
      controller: 'uploaderModalCtrl'
    });
  };

  $scope.removeFile = function(fieldName,documentId){
    var arr = [];
    angular.forEach($scope[fieldName],function(value,index){
      if(value.documentId !== documentId){
        this.push(value);
      }
    },arr);
    $scope[fieldName] = arr;
  };

  ///////////////领导审批/////////////////
});
