package com.luoamin.myconcurrent.lock;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Created by Administrator on 2018/7/18.
 */
public class TestLock {
//    static AtomicReference<Student>studentAtomicReference=new AtomicReference<Student>();

    static AtomicInteger number=new AtomicInteger(10);
    public static void main(String[] args) {
//        Student studentExpect=new Student("luoamin","18");
//        studentAtomicReference.set(studentExpect);
//        System.out.println("用户名："+studentAtomicReference.get().getUserName()+"年龄："+studentAtomicReference.get().getAge());
//        Student studentUpdate=new Student("zhangjian","16");
//        studentAtomicReference.compareAndSet(studentExpect,studentUpdate);
//        System.out.println("用户名："+studentAtomicReference.get().getUserName()+"年龄："+studentAtomicReference.get().getAge());
//        System.out.println("用户名："+studentExpect.getUserName()+"年龄："+studentExpect.getAge());

        System.out.println(number.get());
        System.out.println(number.incrementAndGet());
        System.out.println(number.getAndIncrement());
        System.out.println(number.get());


    }
}
