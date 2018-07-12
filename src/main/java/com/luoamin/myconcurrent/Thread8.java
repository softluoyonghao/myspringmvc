package com.luoamin.myconcurrent;

/**
 * Created by Administrator on 2018/7/12.
 */
public class Thread8 {
    public static void main(String[]args){
        for (int i=0;i<5;i++){
            Thread t1=new Thread(new Thread9(),String.valueOf(i));
            System.out.println(t1.getName()+" thread is start!");
            t1.start();
        }
        Thread t=new Thread(new Thread9());
        t.start();
        System.out.println("myThread is stat !");
        try {
            t.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("main thread run end!");
    }
    static class Thread9 implements Runnable{

        public void run(){
                System.out.println(Thread.currentThread().getName()+"thread will before");
        }
    }
}
