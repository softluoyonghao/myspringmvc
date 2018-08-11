package com.luoamin.util.myconcurrent;

/**
 * Created by Administrator on 2018/7/11.
 */
public class Thread1 {

    public static void main(String[]args){
        Thread t1=new Thread(new Thread2());
        t1.start();
    }
}

class  Thread2 implements Runnable{
    public  void run(){
        System.out.println("my thread is running!");
    }
}
