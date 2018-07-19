package com.luoamin.myconcurrent.lock;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

/**
 * Created by Administrator on 2018/7/19.
 */
public class UserLock implements Goodservice {

    private ReentrantReadWriteLock lock=new ReentrantReadWriteLock();
    private final Lock readLock=lock.readLock();
    private final Lock writeLock=lock.writeLock();

    private GoodInfo goodInfo;
    public UserLock(GoodInfo goodInfo){
        this.goodInfo=goodInfo;
    }
    @Override
    public int getNum() {
        readLock.lock();
        try {
            return goodInfo.getTotalNumber();
        }finally {
            readLock.unlock();
        }
    }

    @Override
    public void setNum(int sellNumber) {
        writeLock.lock();
        try {
            goodInfo.changeNumber(sellNumber);
        }finally {
            writeLock.unlock();
        }
    }
}
