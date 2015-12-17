package me.donut;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

// to retrieve config
import java.lang.reflect.Field;

// @Icons
import com.smixx.reactnativeicons.ReactNativeIcons;
import java.util.Arrays;
import com.smixx.reactnativeicons.IconFont;

// @FacebookLogin
import com.magus.fblogin.FacebookLoginPackage;

// @ImagePicker
import com.imagepicker.ImagePickerPackage;

// @ImagePicker and @FacebookLogin
import android.content.Intent;

// @Parse
import com.parse.Parse;
import com.notificationandroid.NotificationAndroidPackage;

import android.util.Log;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    // @FacebookLogin
    private FacebookLoginPackage mFacebookLoginPackage;

    // @ImagePicker
    private ImagePickerPackage mImagePicker;

    // @Parse
    private NotificationAndroidPackage mNotificationAndroid;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);

        // @FacebookLogin
        mFacebookLoginPackage = new FacebookLoginPackage(this);

        // @ImagePicker
        mImagePicker = new ImagePickerPackage(this);

        // @Parse
        mNotificationAndroid = new NotificationAndroidPackage(this);
        try {
            Parse.initialize(this, "HLZpzyuliql75EGfdH1o9En9VwDIp4h8KmRHaQ9g", "scK5G6HLyEATHuytp74POetQozngZBhs9eUmnp4q");
        } catch (IllegalStateException e) {
            // Parse already initialized
            e.printStackTrace();
        }

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())

                // @Icons
                .addPackage(new ReactNativeIcons())

                 // @FacebookLogin
                .addPackage(mFacebookLoginPackage)

                // @ImagePicker
                .addPackage(mImagePicker)

                // @Parse
                 .addPackage(mNotificationAndroid)

                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        // Options
        Object buildType = getBuildConfigValue("BUILD_TYPE");
        Object ServerIp = getBuildConfigValue("LOCAL_IP");
        Bundle b = new Bundle();
        if (buildType == null) {
            b.putString("BUILD_TYPE", "null");
        } else {
            b.putString("BUILD_TYPE", buildType.toString());
        }
        if (buildType != null && buildType.toString() == "release") {
            b.putString("DONUT_ENVIRONMENT", "production");
        } else {
            b.putString("DONUT_ENVIRONMENT", "test");
        }
        if (ServerIp == null) {
            b.putString("REACT_SERVER_ADDRESS", "null");
        } else {
            b.putString("REACT_SERVER_ADDRESS", ServerIp.toString());
        }
        mReactRootView.startReactApplication(mReactInstanceManager, "donutMobile", b);

        setContentView(mReactRootView);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onBackPressed() {
      if (mReactInstanceManager != null) {
        mReactInstanceManager.onBackPressed();
      } else {
        super.onBackPressed();
      }
    }

    @Override
    public void invokeDefaultOnBackPressed() {
      super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onPause();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onResume(this, this);
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // @FacebookLogin
        mFacebookLoginPackage.handleActivityResult(requestCode, resultCode, data);

        // @ImagePicker
        mImagePicker.handleActivityResult(requestCode, resultCode, data);
    }

    private static Object getBuildConfigValue(String fieldName) {
        try {
            Class c = Class.forName("me.donut.BuildConfig");
            Field f = c.getDeclaredField(fieldName);
            f.setAccessible(true);
            return f.get(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
