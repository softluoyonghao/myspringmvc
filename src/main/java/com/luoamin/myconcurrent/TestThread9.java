package com.luoamin.myconcurrent;

/**
 * Created by Administrator on 2018/7/12.
 */
public class TestThread9 {
    public static void main(String[]args){
        for (int i=0;i<100;i++){
            Thread t1=new Thread(new TestThread10());
            t1.start();
        }
    }

    static class TestThread10 implements Runnable{
        @Override
        public void run() {
            System.out.println("TestClass is running...");
            instance();
        }

        public synchronized   void instance(){
            System.out.println("instance thread is success!");
        }
    }

}
