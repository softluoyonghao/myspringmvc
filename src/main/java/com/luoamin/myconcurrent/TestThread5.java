package com.luoamin.myconcurrent;

/**
 * Created by Administrator on 2018/7/12.
 */
public class TestThread5 {

}

class TestThread6 implements Runnable{
    public void run(){
        System.out.println(Thread.currentThread().getName()+"thread will before");
    }

}

class TestThread7 implements Runnable{
    public void run(){
        System.out.println(Thread.currentThread().getName()+"thread will before");
    }

}
