/**
 * Created by ThinkPad-wzw on 2015/8/29.
 */

'use strict';

angular.module('epikApp').controller('acceptForReviewTimeLineCtrl',function($scope,$state,$filter,$stateParams,$modal,$window,bootDialog,classfication,breadcrumButton,projectService){

  /*待办列表进入不是这个页面，但是内容和功能几乎相同*/
  ///////////////公共部分/////////////////
  //询问部分需要的码表数据
  classfication.getByDTypes(['BusinessSource']).then(function (data) {
    $scope.projectSources = data.BusinessSource;
  });
  //行业选择
  $scope.select2 = function (item, model, select) {};

  //进入询问部分之后加载客户基本数据，初始化页面
  //$scope.edit = $scope.taskBusinessData;
  //$scope.view = $scope.taskBusinessData;
  var projectId = $scope.projectId;
  //进入询问部分之后加载客户基本数据，初始化页面
  projectService.getDataForBizacceptInquiryinfo({projectId:projectId})
    .then(function(data){
      if(data!==null){
        $scope.edit = data;
        $scope.edit.businessIncome = $scope.tranMoneyFromFloatToStr($scope.edit.businessIncome);
        $scope.edit.debt = $scope.tranMoneyFromFloatToStr($scope.edit.debt);
        $scope.edit.needScale = $scope.tranMoneyFromFloatToStr($scope.edit.needScale);
        $scope.view = data;

        console.info(data);
      }
    }).catch(function (data) {
      bootDialog.createMsg(data,{
        type: 'error',
        title: '错误信息',
        showCancel:false
      });
    });

  //将12323.00转换为￥123,23.00
  $scope.tranMoneyFromFloatToStr = function(floatMoney){
    if(floatMoney!==null && floatMoney!==undefined){
      return $filter('currency')(floatMoney, '￥', 2);
    }else{
      return floatMoney;
    }
  };

  //面包屑右侧按钮
  breadcrumButton.buttons = [{
    label: '取消',
    className: 'btn cancelBtn',
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

    var suggestLimit =$scope.suggestLimit;
    var suggestProductIds =$scope.suggestProductIds;
    if(suggestLimit==='null'){
      suggestLimit =null;
    }
    if(suggestProductIds==='null' ||angular.isUndefined(suggestProductIds)){
      suggestProductIds = null;
    }else{
      suggestProductIds=suggestProductIds.join(",");
    }
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
    }else if($scope.opinion === '1'){
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
      $scope.industryPolAnalyFileId= JSON.parse(data.industryPolAnalyFileId);
      $scope.softInfoFileId= JSON.parse(data.softInfoFileId);
    });

  //个人客户列表
  $scope.columnDefs = [
    {field: 'customerName', displayName: '客户姓名', cellClass: 'text-center', sortable: false},
    {field: 'industryName', displayName: '行业', cellClass: 'text-center', sortable: false},
    {field: 'identityNumber', displayName: '身份证号', cellClass: 'text-center', sortable: false},
    {
      field: 'pictureIdentity', displayName: '身份证复印件', cellClass: 'text-center', sortable: false,
      cellTemplate:
        '<div class="ngCellText"><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'pictureIdentity\')">下载</span><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="show(row,\'pictureIdentity\',\'身份证复印件\')">查看</span></div>'
    },
    {
      field: 'pictureAuthorization', displayName: '授权书', cellClass: 'text-center',
      cellTemplate: '<div class="ngCellText"><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'pictureAuthorization\')">下载</span><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="show(row,\'pictureAuthorization\',\'授权书\')">查看</span></div>'
    },
    {
      field: 'individualCreditId', displayName: '人行征信', cellClass: 'text-center',
      cellTemplate: '<div class="ngCellText"><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'individualCreditId\')">下载</span></div>'
    },
    {field: 'reportorName', displayName: '查询人', headerClass: 'text-center',cellClass: 'text-center', sortable: false},
    {field: 'reportDate', displayName: '查询时间', headerClass: 'text-center',cellClass: 'text-center', sortable: false,
      cellTemplate: '<div class="ngCellText" title="{{row.getProperty(col.field)}}" ng-bind="row.getProperty(col.field) | date:\'yyyy-MM-dd\'"></div>'}
  ];

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
      cellTemplate:
      '<div class="ngCellText"><span ng-show="row.getProperty(col.field)!==null" class="ngCellText text-info pointer blueA" ng-click="downloadFile(row,\'corporationCreditId\')">下载</span></div>'
    },
    {field: 'reportorName', displayName: '查询人', headerClass: 'text-center',cellClass: 'text-center', sortable: false},
    {field: 'reportDate', displayName: '查询时间', headerClass: 'text-center',cellClass: 'text-center', sortable: false,
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

  $scope.downloadFile = function(row,pictureIdentity){
    var pictureItem = row.getProperty(pictureIdentity);
    var pictureItemObj = JSON.parse(pictureItem)[0];
    var url = '/api/accessories/download?documentId='+pictureItemObj
.documentId+'&filename='+pictureItemObj.filename;
    $window.open(url, '_blank');
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

  //查看汇法报告弹框确认
  $scope.confirmQueryHFCredits = function (customer) {
    $window.open($scope.config['epikSale']['host']+'/customer/customerhfcredits/'+customer.id,'_blank');
  };

  //查看鹏元报告弹框确认
  $scope.confirmQueryPYCredits = function (customer) {
    $window.open($scope.config['epikSale']['host']+'/customer/customerpycredits/'+customer.id,'_blank');
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
    var select = $scope.filterCacheData[key];
    if(!angular.isUndefined(select)){
      select.selected = null;
    }
    $scope[key] = null;
  };
});
