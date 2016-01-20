package me.donut.mobile;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;

// @CodePush
import com.microsoft.codepush.react.CodePush;
import android.support.v4.app.FragmentActivity;

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
import com.parse.ParseInstallation;
import com.parsepushnotification.ParsePushNotificationPackage;

import android.util.Log;

public class MainActivity extends FragmentActivity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    // @FacebookLogin
    private FacebookLoginPackage mFacebookLoginPackage;

    // @ImagePicker
    private ImagePickerPackage mImagePicker;

    // @Parse
    private NotificationAndroidPackage mNotificationAndroid;
    private ParsePushNotificationPackage mParsePushNotification;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);

        // Per-env configuration
        String env = "none";
        Object buildType = getBuildConfigValue("BUILD_TYPE");
        Object ServerIp = getBuildConfigValue("LOCAL_IP");
        Object Version = getBuildConfigValue("DONUT_VERSION");
        Bundle b = new Bundle();
        if (buildType == null) {
            b.putString("DONUT_BUILD", "null");
        } else {
            b.putString("DONUT_BUILD", buildType.toString());
        }
        if (buildType != null && buildType.toString() == "release") {
            b.putString("DONUT_ENVIRONMENT", "production");
            env = "production";
        } else {
            b.putString("DONUT_ENVIRONMENT", "test");
            env = "test";
        }
        if (Version == null) {
            b.putString("DONUT_VERSION", "null");
        } else {
            b.putString("DONUT_VERSION", Version.toString());
        }
        if (ServerIp == null) {
            b.putString("REACT_SERVER_ADDRESS", "null");
        } else {
            b.putString("REACT_SERVER_ADDRESS", ServerIp.toString());
        }

        // @CodePush
        String codePushKey;
        if (env == "production") {
          codePushKey = "QUin28f78rg5cJaf-Ao3bF2APvsyVJgNW_EDe";
        } else {
          codePushKey = "F83XLkIqywhmOu-2Mi-HzsamPn8jVJgNW_EDe";
        }
        CodePush codePush = new CodePush(codePushKey, this);

        // @FacebookLogin
        mFacebookLoginPackage = new FacebookLoginPackage(this);

        // @ImagePicker
        mImagePicker = new ImagePickerPackage(this);

        // @Parse
        mNotificationAndroid = new NotificationAndroidPackage(this);
        mParsePushNotification = new ParsePushNotificationPackage(this);

        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())

                // @CodePush
                //.setBundleAssetName("index.android.bundle")
                .setJSBundleFile(codePush.getBundleUrl("index.android.bundle"))

                .setJSMainModuleName("index.android")
                .addPackage(new MainReactPackage())

                // @CodePush
                .addPackage(codePush.getReactPackage())

                // @Icons
                .addPackage(new ReactNativeIcons())

                 // @FacebookLogin
                .addPackage(mFacebookLoginPackage)

                // @ImagePicker
                .addPackage(mImagePicker)

                // @Parse
                .addPackage(mNotificationAndroid)
                .addPackage(mParsePushNotification)

                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        // register in parse installation with env field
        ParseInstallation installation = ParseInstallation.getCurrentInstallation();
        installation.put("env", env);
        installation.saveInBackground();
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
            Class c = Class.forName("me.donut.mobile.BuildConfig");
            Field f = c.getDeclaredField(fieldName);
            f.setAccessible(true);
            return f.get(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
