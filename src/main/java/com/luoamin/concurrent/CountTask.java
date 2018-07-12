package com.luoamin.concurrent;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.FutureTask;

/**
 * Created by Administrator on 2018/7/5.
 */
public class CountTask {
    public static void executeTask(){
        ExecutorService executorService= Executors.newFixedThreadPool(10);
        long currentTime=System.currentTimeMillis();
        List<FutureTask<Integer>> futureTasks = new ArrayList<FutureTask<Integer>>();
        //创建一个线程
        Callable<Integer> callable=new Callable<Integer>(){
            @Override
            public Integer call() throws Exception {
                Integer res = new Random().nextInt(100);
                Thread.sleep(1000);
                System.out.println("任务执行:获取到结果 :"+res);
                return  res;
            }
        };

        for (int i=0;i<10;i++){
            //创建一个异步任务FutureTask
            FutureTask<Integer> futureTask=new FutureTask<Integer>(callable);
            futureTasks.add(futureTask);
            //通过线程池提交一个异步任务，由于是异步的，线程并不会阻塞。
            executorService.submit(futureTask);
        }

        int count=0;
        for(FutureTask<Integer>task:futureTasks){
            try {
                count+=task.get();
                System.out.println(count);
            }catch (Exception e){
                e.printStackTrace();
            }
        }

        long endTime=System.currentTimeMillis();
        long time=endTime-currentTime;
        System.out.print("线程消耗时间："+time);
        System.out.print("线程池任务全部完成，结果为："+count);
        //关闭线程池
        executorService.shutdown();
    }


    public  static  void  main(String[]args){
        executeTask();
    }

}
