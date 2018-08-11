package com.luoamin.util.myconcurrent.lock;

/**
 * Created by Administrator on 2018/7/19.
 */
public class UserSyn implements Goodservice {
    private GoodInfo goodInfo;
    public UserSyn(GoodInfo goodInfo){
        this.goodInfo=goodInfo;
    }
    @Override
    public synchronized int getNum() {
        return goodInfo.getTotalNumber();
    }

    @Override
    public synchronized void setNum(int sellNumber) {
        goodInfo.changeNumber(sellNumber);
    }
}
