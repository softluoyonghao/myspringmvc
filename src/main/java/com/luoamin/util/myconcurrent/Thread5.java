package com.luoamin.util.myconcurrent;

/**
 * Created by Administrator on 2018/7/11.
 */
public class Thread5 {
    public static void main(String[]args){
        Thread thread1=new Thread(new Thread6());
        Thread thread2=new Thread(new Thread7());
        thread1.start();
        thread2.start();
        try {
            thread2.join();
        }catch (InterruptedException e){
            e.printStackTrace();
        }

    }
}

class Thread6 implements Runnable{
    @Override
    public void run() {
        System.out.println("cuurrent time is open");
    }
}

class Thread7 implements Runnable{
    @Override
    public void run() {
        System.out.println("cuurrent time is end!");
    }
}
