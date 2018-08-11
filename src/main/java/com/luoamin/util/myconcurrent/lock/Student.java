package com.luoamin.util.myconcurrent.lock;

/**
 * Created by Administrator on 2018/7/18.
 */
public class Student {
    private String userName;
    private String age;
    public Student(String userName,String age){
        this.userName=userName;
        this.age=age;
    }
    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }
}
