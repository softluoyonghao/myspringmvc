package com.luoamin.concurrent;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.concurrent.*;

/**
 * Created by Administrator on 2018/7/5.
 * 每天8点准时执行调度任务
 */
public class ScheduleTask {

    public void exeTask(){
        ScheduledExecutorService scheduledExecutorService=new ScheduledThreadPoolExecutor(10);
        long oneDay = 24 * 60 * 60 * 1000;
        long initDelay  = getTimeMillis("20:00:00") - System.currentTimeMillis();
        initDelay = initDelay > 0 ? initDelay : oneDay + initDelay;
        //scheduleAtFixedRate方式第一个参数是线程所执行的任务，第二个参数是初始化延时
        //第三个参数是两次开始执行最小间隔时间，第四个参数计时单位
        scheduledExecutorService.scheduleAtFixedRate(
                new EccTask(),
                initDelay,
                oneDay,
                TimeUnit.MILLISECONDS);

    }

    /**
     * 获取指定时间对应的毫秒数
     * @param time "HH:mm:ss"
     * @return
     */
    private static long getTimeMillis(String time) {
        try {
            DateFormat dateFormat = new SimpleDateFormat("yy-MM-dd HH:mm:ss");
            DateFormat dayFormat = new SimpleDateFormat("yy-MM-dd");
            Date curDate = dateFormat.parse(dayFormat.format(new Date()) + " " + time);
            return curDate.getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }

    class  EccTask implements  Runnable{
        public void run(){
            System.out.print("ssssssssss");
        }
    }

}
