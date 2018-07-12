package com.luoamin.web.User;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * Created by Administrator on 2018/6/17.
 */
@Controller
@RequestMapping(value = "/student")
public class StudentController {

    @RequestMapping(value = "/view")
    public String   viewStudent(ModelAndView model){
        System.out.print("进入控制器");
        model.addObject("");
        return "/test/test1";
    }

}
