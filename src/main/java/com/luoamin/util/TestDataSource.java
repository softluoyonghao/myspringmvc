package com.luoamin.util;

import com.alibaba.druid.pool.DruidDataSource;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Created by Administrator on 2018/6/19.
 */

public class TestDataSource {

    public  static  void  main(String[]args){
        ApplicationContext context=new ClassPathXmlApplicationContext("classpath:applicationContext-datasource.xml");
        DruidDataSource druidDataSource=(DruidDataSource)context.getBean("bsDBdataSource");
        System.out.println(druidDataSource);

    }



}
