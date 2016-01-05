package me.donut.mobile;

import com.parse.Parse;
import android.app.Application;

public class DonutMobile extends Application 
{
    @Override
    public void onCreate() {
        super.onCreate();
        Parse.initialize(getApplicationContext(), "HLZpzyuliql75EGfdH1o9En9VwDIp4h8KmRHaQ9g", "scK5G6HLyEATHuytp74POetQozngZBhs9eUmnp4q");
    }
}