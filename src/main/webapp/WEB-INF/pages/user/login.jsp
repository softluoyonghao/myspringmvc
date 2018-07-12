<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/6/17
  Time: 21:31
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
    <%
    String basePath=request.getContextPath();
    %>
</head>
<body>
<form name="form1" method="post" action="<%=basePath%>/user/header">
    账号：<input type="text" name="account" value="">
    密码：<input type="password" name="password" value="">
    <input type="submit" value="提交">
</form>
</body>
</html>
