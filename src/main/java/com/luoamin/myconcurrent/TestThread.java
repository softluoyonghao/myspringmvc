package com.luoamin.myconcurrent;

/**
 * Created by Administrator on 2018/7/12.
 */
public class TestThread {

    public static void main(String[]args){
        Thread t1=new Thread(new TestThread1());
        Thread t2=new Thread(new TestThread2(t1));
        t2.start();
    }
    static class TestThread1 implements Runnable{

        public void run(){
            System.out.println("Thread 1 is begin");
        }
    }
    static class TestThread2 implements Runnable{
        private Thread thread;
        public TestThread2 (Thread thread){
            this.thread=thread;
        }
        public void run(){
            System.out.println("Thread 2 is begin");
        }
    }
}
