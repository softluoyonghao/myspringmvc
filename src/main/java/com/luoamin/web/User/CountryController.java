package com.luoamin.web.User;

import com.luoamin.service.CountryService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

/**
 * Created by Administrator on 2018/6/25.
 */
@Controller
@RequestMapping(value = "/country/")
public class CountryController {

    @Resource
    private CountryService countryService;
    @RequestMapping(value = "delete")
    @ResponseBody
    public void deleteCounty(){
        countryService.delete(1);
    }

}
