<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<title>My JSP 'listLibrary.jsp' starting page</title>
<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">
    <%
        String path = request.getContextPath();
        String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + path + "/";
    %>
<link rel="stylesheet" type="text/css" href="<%=basePath%>static/css/zTreeStyle/zTreeStyle.css">
<script type="text/javascript" src="<%=basePath%>static/js/jquery-1.4.4.min.js"></script>
<script type="text/javascript" src="<%=basePath%>static/js/jquery.ztree.core.js"></script>
<script type="text/javascript" src="<%=basePath%>static/js/jquery.ztree.excheck.js"></script>
<script type="text/javascript" src="<%=basePath%>static/js/jquery.ztree.exedit-3.5.js"></script>

<script>  
      //用于捕获分类编辑按钮的 click 事件，并且根据返回值确定是否允许进入名称编辑状态  
     function beforeEditName(treeId, treeNode) {  
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");  
            zTree.selectNode(treeNode);  
            return true;  
     }  
      //移除分类前执行  
     function beforeRemove(treeId, treeNode) {  
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");  
            zTree.selectNode(treeNode);  
            var confirmFlag = confirm("确认删除分类[ " + treeNode.name + " ]吗？" )  
            var confirmVal = false;  
            if(confirmFlag){  
                 var data = {id:treeNode.id};  
                $.ajax({  
                     async: false,  
                     type: "post",  
                     data:data,  
                     url: "<%=request.getContextPath() %>/library/deleteLibrary/ ",  
                     success: function(json){  
                            if(json == "success" ){  
                                confirmVal = true;  
                           } else{  
                alert('亲，删除失败！');  
                           }  
                     },  
                     error: function(){  
                           alert('亲，删除失败！');  
                     }  
                });  
           }  
            return confirmVal;  
     }  
      //执行删除操作后提示  
     function onRemove(e, treeId, treeNode) {  
           alert('亲，删除成功！');  
     }  
      //用于捕获分类编辑名称结束（Input 失去焦点 或 按下 Enter 键）之后，更新分类名称数据之前的事件回调函数  
     function beforeRename(treeId, treeNode, newName) {  
            if (newName.length == 0 || newName.indexOf("请输入名称")>=0) {  
         alert('亲，请输入分类名称！');  
                 var zTree = $.fn.zTree.getZTreeObj("treeDemo");  
                 setTimeout( function(){zTree.editName(treeNode)}, 10);  
                 return false;  
           }  
            if(newName.length > 15){  
        alert('亲，分类名称过长！');  
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");  
                setTimeout( function(){zTree.editName(treeNode)}, 10);  
                return false;  
           }  
           native_name = treeNode.name;  
           return true;  
     }  
      //执行编辑操作  
     function onRename(e, treeId, treeNode) {  
            if(native_name == treeNode.name){  
                 return;  
            }  
            var data = {id:treeNode.id,level_id:treeNode.level,pid:treeNode.pId,name:treeNode.name};  
            $.ajax({  
                async: false,  
                type: "post",  
                data:data,  
                url: "<%=request.getContextPath() %>/library/updateLibraryName/ ",  
                success : function(json){  
                      if(json == "success" ){  
               alert('操作成功!');  
                     } else{  
               alert('亲，操作失败，请稍后再试！');  
                     }  
                },  
                error : function()    {  
             alert('亲，网络有点不给力呀！');  
                }  
           });  
     }  
       
      //添加子分类  
     function addHoverDom(treeId, treeNode) {  
            var sObj = $("#" + treeNode.tId + "_span");  
            if (treeNode.editNameFlag || $("#addBtn_" +treeNode.tId).length>0 || treeNode.level == 3) return;  
            var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "' title='添加分类' onfocus='this.blur();'></span>";  
            sObj.after(addStr);  
            var btn = $("#addBtn_" +treeNode.tId);  
            if (btn) btn.bind("click" , function(){  
                 var zTree = $.fn.zTree.getZTreeObj("treeDemo");  
                 var treeNodes;  
                $.ajax({  
                     async: false,  
                     type: "post",  
                     url: "<%=request.getContextPath() %>/library/saveLibrary/ ",  
                     success : function(libraryId){  
                            if(libraryId != "" ){  
                                treeNodes = zTree.addNodes(treeNode, {id:(libraryId), pId:treeNode.id, name:"请输入名称" });  
                           }  
                            if (treeNodes) {  
                                zTree.editName(treeNodes[0]);  
                           }  
                     },  
                     error : function(){  
                           alert('亲，网络有点不给力呀！');  
                     }  
                });  
                 return false;  
           });  
     }  
      //父级分类去除删除功能  
     function setRemoveBtn(treeId, treeNode) {  
        return !treeNode.isParent;  
     }  
       
      //鼠标移开按钮消失  
     function removeHoverDom(treeId, treeNode) {  
           $( "#addBtn_"+treeNode.tId).unbind().remove();  
     };  
       
      //添加按钮点击事件  
     function addClick(){  
           $( "#addParent").bind("click" , {isParent:true}, add);  
     }  
  
      //移除分类  
     function remove(e) {  
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),  
           nodes = zTree.getSelectedNodes(),  
           treeNode = nodes[0];  
            if (nodes.length == 0) {  
                 alert( "亲，请先选择一个分类!" );  
                 return;  
           }  
            var callbackFlag = $("#callbackTrigger" ).attr("checked");  
           zTree.removeNode(treeNode, callbackFlag);  
     };  
       
      //展开全部分类  
     function expandAllFlag(){  
           zTree_Menu.expandAll( true);  
     }  
      //合并全部分类  
     function combineAllFlag(){  
           zTree_Menu.expandAll( false);  
     }  
       
      //加载ztree  
     function onloadZTree(){  
            var ztreeNodes;  
           $.ajax( {  
                async : true, //是否异步  
                cache : false, //是否使用缓存  
                type : 'post', //请求方式,post  
                dataType : "json", //数据传输格式  
                url : "<%=request.getContextPath() %>/library/findAllLibrary ", //请求链接
                error : function() {  
                     alert('亲，网络有点不给力呀！');  
                },  
                success : function(data) {
                    alert("页面开始渲染！");
                     ztreeNodes = eval( "["+data+"]" ); //将string类型转换成json对象  
                     $.fn.zTree.init($( "#treeDemo"), setting, ztreeNodes);  
                     zTree_Menu = $.fn.zTree.getZTreeObj("treeDemo" );  
                     $( "#selectAll").bind("click" , selectAll);  
                     expandAllFlag();  
                     addClick();  
                }  
           });  
     }  
       
      //初始化操作  
     $(document).ready( function(){  
           onloadZTree();  
     });  
</script>  



</head>
<body>

<div id="treeDemo" class="ztree">

</div>

</body>
</html>
