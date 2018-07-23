package com.luoamin.web.User;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;


/**
 * Created by Administrator on 2018/7/19.
 */
@Controller
@RequestMapping("/jsp/")
public class JspController {
    @RequestMapping("encoding")
    public String encoding(){
        System.out.println("可以进来了！");
        return "/test/encoding";
    }

    @RequestMapping(value = "toSubmit")
    public String toSubmit(){
        System.out.println("可以进来了！");
        System.out.println("你来了吗！");
        return "/test/submit";
    }
    @RequestMapping(value = "submit", method = RequestMethod.POST )
    public String submit(){
        Map map=new HashMap();
        System.out.println("可以进来了！");
        System.out.println("你来了吗！");
        map.put("sss","key");
        return "/test/submit";
    }
}
