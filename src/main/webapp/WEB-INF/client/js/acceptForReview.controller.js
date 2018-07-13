/**
 * Created by ThinkPad-wzw on 2015/8/29.
 */

'use strict';

angular.module('epikApp').controller('acceptForReviewCtrl',function($scope,$state,$stateParams,$modal,$window,bootDialog,classfication,breadcrumButton,projectService,productService,employeeService){

  //projectService.getProjectBasicInfo({projectId:$stateParams.projectId}).then(function(data){
  //  $scope.roleA = data.lastModifiedBy;
  //  employeeService.getEmployeeById({id: $scope.roleA}).then(function(data){
  //    $scope.roleAName = data.employeeName
  //  })
  //})

  /*待办列表进入不是这个页面，但是内容和功能几乎相同*/
  ///////////////公共部分/////////////////
  //询问部分需要的码表数据
  classfication.getByDTypes(['BusinessSource']).then(function (data) {
    $scope.projectSources = data.BusinessSource;
  });
  //行业选择
  $scope.select2 = function (item, model, select) {};

  //进入询问部分之后加载客户基本数据，初始化页面
  $scope.edit = $scope.taskBusinessData;
  $scope.view = $scope.taskBusinessData;
  var projectId = $scope.task.businessId,
    customerId = $scope.taskBusinessData.clientId;
  //面包屑右侧按钮
  breadcrumButton.buttons = [{
    label: '返回',
    className: 'btn returnBtn',
    handler: function () {
      $state.go('main.dashboard');
    }
  },{
    label: '提交',
    ngDisabled:false,
    className: 'btn sureBtn',
    handler: function () {
      $scope.submit();
    }
  }];

  //切换标签页保存上一个标签页的数据
  $('.tabbable-line > ul > li > a').mousedown(function (event) {
    if(_.trim($(event.target).html()) === '询问部分'){
      $('#acceptForReview_XWBF').css('display','block');
      $('#acceptForReview_CXBF').css('display','none');
      $('#acceptForReview_LDSP').css('display','none');
    }else if(_.trim($(event.target).html()) === '查询部分'){
      $('#acceptForReview_XWBF').css('display','none');
      $('#acceptForReview_CXBF').css('display','block');
      $('#acceptForReview_LDSP').css('display','none');
    }else if(_.trim($(event.target).html()) === '领导审批'){
      $('#acceptForReview_XWBF').css('display','none');
      $('#acceptForReview_CXBF').css('display','none');
      $('#acceptForReview_LDSP').css('display','block');
    }
    $('.tabbable-line > ul > li').removeClass("active");
    $(event.target.parentElement).addClass('active');
    //$scope.$apply();
  });
  ///////////////询问部分/////////////////
  //来自客户列表
  //$scope.opinion = "1";//默认选中审批通过
  //提交
  $scope.submit = function(){

    var suggestLimit = $scope.suggestLimit;
    var suggestProductIds = $scope.suggestProductIds;
    if(suggestLimit==='null'){
      suggestLimit =null;
    }
    if(suggestProductIds==='null' ||angular.isUndefined(suggestProductIds)){
      suggestProductIds = null;
    }
    /*else{
      suggestProductIds=suggestProductIds.join(",");
    }*/
        //退回不校验A B角色是否选择
    if($scope.opinion === '2'){
      var params = {
        projectId:$scope.task.businessId,
        roleA :$scope.roleA,
        roleB:$scope.roleB,
        suggestLimit: suggestLimit,
        suggestProductIds: suggestProductIds,
        workflowApprovalLogVO : {
          nodeInstanceId:$scope.task.taskId,
          workflowInstanceId:$scope.task.processInstanceId,
          opinion:$scope.opinion,
          remark: $scope.remark
        }
      };
      $scope.complete(params).then(function(data) {
        //breadcrumButton.buttons[1].ngDisabled = false;
        bootDialog.createMsg('提交成功，业务受理流程审批未通过，流程结束！',{
          type: 'success',
          title: '提示信息',
          showCancel:false,
          cb: function () {
            $state.go('main.dashboard');
          }
        });
      });
    }else if($scope.opinion === '1'){ // 审批通过
      if(angular.isUndefined($scope.roleA) || $scope.roleA===''){
        bootDialog.createMsg('请选择 批复A角!',{
          type: 'warn',
          title: '警告信息',
          showCancel:false
        });
      }else if(angular.isUndefined($scope.roleB) || $scope.roleB===''){
        bootDialog.createMsg('请选择 批复B角!',{
          type: 'warn',
          title: '警告信息',
          showCancel:false
        });
      }else if($scope.roleA === $scope.roleB){
        bootDialog.createMsg('批复A角 和 批复B角 不能指定为同一个人！',{
          type: 'warn',
          title: '警告信息',
          showCancel:false
        });
      }else if(angular.isUndefined($scope.suggestProductIds) || $scope.suggestProductIds===''){
        bootDialog.createMsg('请选择建议产品！',{
          type: 'warn',
          title: '警告信息',
          showCancel:false
        });
      }else{
        var params = {
          projectId:$scope.task.businessId,
          roleA :$scope.roleA,
          roleB:$scope.roleB,
          suggestLimit: suggestLimit,
          suggestProductIds: suggestProductIds,
          workflowApprovalLogVO : {
            nodeInstanceId:$scope.task.taskId,
            workflowInstanceId:$scope.task.processInstanceId,
            opinion:$scope.opinion,
            remark: $scope.remark
          }
        };
        $scope.complete(params).then(function(data) {
          breadcrumButton.buttons[1].ngDisabled = false;
          bootDialog.createMsg('提交成功，业务受理流程审批通过，流程结束！！',{
            type: 'success',
            title: '提示信息',
            showCancel:false,
            cb: function () {
              $state.go('main.dashboard');
            }
          });
        });
      }
    }else if( $scope.opinion === '5'){
      if(angular.isUndefined($scope.remark) || $scope.remark===''){
        bootDialog.createMsg('备注说明不能为空!',{
          type: 'warn',
          title: '警告信息',
          showCancel:false
        });
      }else{
        var params = {
          projectId:$scope.task.businessId,
          roleA :$scope.roleA,
          roleB:$scope.roleB,
          suggestLimit: suggestLimit,
          suggestProductIds: suggestProductIds,
          workflowApprovalLogVO : {
            nodeInstanceId:$scope.task.taskId,
            workflowInstanceId:$scope.task.processInstanceId,
            opinion:$scope.opinion,
            remark: $scope.remark
          }
        };
        $scope.complete(params).then(function(data) {
          bootDialog.createMsg('提交成功，下一处理人：'+data.taskAssigneeChs+'',{
            type: 'success',
            title: '提示信息',
            showCancel:false,
            cb: function () {
              $state.go('main.dashboard');
            }
          });
        });
      }
    }else{
      bootDialog.createMsg('请选择 审批是否通过！',{
        type: 'error',
        title: '错误信息',
        showCancel:false
      });
    }
  };
  ///////////////查询部分/////////////////

  //个人客户
  $scope.myData = [];
  //企业客户数据
  $scope.myData1 = [];
  $scope.getAspcList = function(params,type){
    if(type === 'corp'){//企业客户
      projectService.getAspcCorpList(params).then(function(data){
        $scope.myData1 = data.resultList;
      });
    }else{//个人客户
      projectService.getAspcIndiList(params).then(function(data){
        $scope.myData = data.resultList;
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
      //查询方式
      $scope.rsList = data.page.resultList;
      //查询结果
      $scope.webSiteList = data.webSiteList;
      //公共信息
      $scope.industryPolAnaly =  data.industryPolAnaly;
      $scope.softInfo= data.softInfo;
      $scope.creditManagerRemark= data.creditManagerRemark;
      if( data.industryPolAnalyFileId != ""){
        $scope.industryPolAnalyFileId= JSON.parse(data.industryPolAnalyFileId);
      }
      if( data.softInfoFileId != ""){
        $scope.softInfoFileId= JSON.parse(data.softInfoFileId);
      }

    });

  //跳转到查看客户页面
  $scope.gotoCustomerDetail = function (row) {
    $state.go("main.customer.detail", {customerId: row.getProperty('customerId')});
  };

  $scope.confirmQueryPYCredits = function (customer) {
    var modalInstance = $modal.open({
      templateUrl: '/app/customer/detail/credits/custPYCreditsCommon/confirmQueryPYCredits.html',
      size: 'md',
      controller: 'ConfirmQueryPYCreditsCommonCtrl',
      resolve: {
        customer : function () {
          return customer;
        }
      }
    })
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

  ///////////////领导审批/////////////////
  $scope.filterCacheData = {};
  //A角选择
  $scope.select1 = function (item, model, select) {
    angular.extend($scope.filterCacheData, {roleA: select});
  };
  //B角选择
  $scope.select2 = function (item, model, select) {
    angular.extend($scope.filterCacheData, {roleB: select});
  };

  $scope.resetSelect = function(key){
    if($scope.filterCacheData[key]) $scope.filterCacheData[key]['search'] = null;
    var select = $scope.filterCacheData[key];
    if(!angular.isUndefined(select)){
      select.selected = null;
    }
    $scope[key] = null;
  };

  //授信产品
  $scope.creditProducts = [];

  productService.getAllCreditProducts({name:name }).then(function (data) {
    $scope.creditProducts = _.filter(data,{isLeaf:true});
  })

  $scope.onSelect = function($item, $model,$select,params){
    $scope.suggestProductIds = $item.id;
    $scope.resetSelect('roleA');
  }

});
