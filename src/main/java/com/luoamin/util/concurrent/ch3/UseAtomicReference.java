package com.luoamin.util.concurrent.ch3;

/**
 *@author Mark老师   享学课堂 https://enjoy.ke.qq.com 
 *
 *类说明：
 */
public class UseAtomicReference {
    public static void main(String[] args) {
        UserInfo user = new UserInfo("Mark", 15);//要修改的实体的实例
        
        System.out.println(user.getName());
        System.out.println(user.getAge());        
    }
    
    //定义一个实体类
    static class UserInfo {
        private String name;
        private int age;
        public UserInfo(String name, int age) {
            this.name = name;
            this.age = age;
        }
        public String getName() {
            return name;
        }
        public int getAge() {
            return age;
        }
    }

}
