package com.luoamin.web.User;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by Administrator on 2018/6/17.
 */
@Controller
@RequestMapping(value = "/user")
public class UserController {
    @RequestMapping(value = "loginToView")
    public String loginToView(HttpServletRequest request, HttpServletResponse response){
        System.out.println("开始计时！");
        System.out.println(request.getParameterNames());
        System.out.println("用户进入登录页面111！");

        return "user/login";
    }
    @RequestMapping(value = "login")
    public void login(InputStream requestBodyIn, OutputStream responseBodyOut)throws IOException{
        System.out.println("登录开始！");
        //responseBodyOut就是响应页面，使用后不用返回，会出现重复相应的异常
        responseBodyOut.write("sdfdsfsdf".getBytes());
    }

    @RequestMapping(value = "header")
    public void header( @RequestHeader("User-Agent") String userAgent,
                        @RequestHeader(value="Accept") String[] accepts)throws IOException{
        System.out.println("请求头部数据！");
    }
}
