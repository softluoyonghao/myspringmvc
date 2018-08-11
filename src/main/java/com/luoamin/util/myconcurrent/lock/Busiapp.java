package com.luoamin.util.myconcurrent.lock;


import com.luoamin.util.concurrent.tools.SleepTools;

import java.util.Random;

/**
 * Created by Administrator on 2018/7/19.
 */
public class Busiapp {
    static final  int readLockCount=10;
    static final  int wriLockCount=3;
    public static class ReadThread implements Runnable{

        private Goodservice goodservice;
        public ReadThread(Goodservice goodservice){
            this.goodservice=goodservice;
        }
        public void run(){
            long start =System.currentTimeMillis();
            for(int i=0;i<100;i++){
                goodservice.getNum();
            }
            System.out.println("读线程运行时长："+(System.currentTimeMillis()-start));
        }
    }

    public static class WriteThread implements Runnable{
        private Goodservice goodservice;
        public WriteThread(Goodservice goodservice){
            this.goodservice=goodservice;
        }
        public void run(){
            long start =System.currentTimeMillis();
            Random random=new Random();
            for(int i=0;i<10;i++){
                SleepTools.ms(50);
                goodservice.setNum(random.nextInt(10));
            }
            System.out.println("写线程运行时长："+(System.currentTimeMillis()-start));
        }
    }

    public static void main(String[] args) {
        GoodInfo goodInfo=new GoodInfo("java",10000,10000);
//        Goodservice goodservice=new UserLock(goodInfo);
        Goodservice goodservice=new UserSyn(goodInfo);
        for (int i=0;i<readLockCount;i++){
           Thread readThread=new Thread(new ReadThread(goodservice));
            for (int j=0;j<wriLockCount;j++){
                Thread writeThread=new Thread(new WriteThread(goodservice));
                writeThread.start();
            }
            SleepTools.ms(100);
            readThread.start();
        }
    }
}
