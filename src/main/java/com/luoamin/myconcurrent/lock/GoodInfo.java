package com.luoamin.myconcurrent.lock;

/**
 * Created by Administrator on 2018/7/18.
 */
public class GoodInfo {
    private String name;
    private double money;
    private int totalNumber;

    public GoodInfo(String name,double money,int totalNumber){
        this.name=name;
        this.money=money;
        this.totalNumber=totalNumber;
    }
    public String getName() {
        return name;
    }

    public double getMoney() {
        return money;
    }

    public int getTotalNumber() {
        return totalNumber;
    }

    public void changeNumber(int sellNumber){
        this.totalNumber+=sellNumber*25;
        this.money-=sellNumber*25;
    }
}
