package com.luoamin.web.rest.project.accept;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Administrator on 2018/7/13.
 */
@Controller
@RequestMapping(value = "/accept/")
public class AcceptController {

    @RequestMapping(value = "detail")
    public String accept(){
        return "/project/accept";
    }
}
