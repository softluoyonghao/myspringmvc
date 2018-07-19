package com.luoamin.web.User;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

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
}
