<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/8/4
  Time: 13:23
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <%
        String path = request.getContextPath();
        String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
                + path + "/";
    %>
    <link rel="stylesheet" href="<%=basePath%>resources/css/app.css"/>
    <link rel="stylesheet" href="<%=basePath%>resources/bootstrap/css/bootstrap.min.css" />
    <script src="<%=basePath%>resources/js/lib/angular/angular.js"></script>
    <script src="<%=basePath%>resources/js/app.js"></script>
    <script src="<%=basePath%>resources/js/services.js"></script>
    <script src="<%=basePath%>resources/js/controllers/RailwayStationController.js"></script>
    <script src="<%=basePath%>resources/js/controllers/CarController.js"></script>
    <script src="<%=basePath%>resources/js/controllers/TrainController.js"></script>
    <!-- <script src="resources/js/controllers/StoreController.js"></script> -->
    <script src="<%=basePath%>resources/js/filters.js"></script>
    <script src="<%=basePath%>resources/js/directives.js"></script>

    <title>Title</title>
</head>
<body><div id="wrapper">

    <ul class="menu">
        <li><a href="#/cars">Cars</a></li>
        <li><a href="#/trains">Trains</a></li>
        <li><a href="#/railwaystations">Railway Station</a></li>
    </ul>
    <hr class="" />
    <div ng-view></div>

</div>


</body>
</html>
