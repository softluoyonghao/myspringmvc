/**
 * Created by ThinkPad-wzw on 2015/9/16.
 */

'use strict';

angular.module('epikApp').controller('acceptForReviewROCtrl',function($scope,$state,breadcrumButton,$ngBootbox,bootDialog){

  //领取待办任务
  breadcrumButton.buttons = [{
    label: '取消',
    className: 'btn cancelBtn',
    handler: function () {
      $state.go('main.dashboard');
    }
  },{
    label: '领取',
    className: 'btn sureBtn',
    handler: function () {
      bootDialog.createMsg('是否领取?',{
        cb:function(){
          $scope.receive().then(function(data){
            $state.reload();
          });
        }
      });
    }
  }];
});
