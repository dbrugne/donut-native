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

 // @ImagePicker
import android.content.Intent;
import java.util.ArrayList;
import java.util.List;
import com.rnfs.RNFSPackage;

// @Icons
import com.smixx.reactnativeicons.ReactNativeIcons;
import java.util.Arrays;
import com.smixx.reactnativeicons.IconFont;

// @FacebookLogin
import com.magus.fblogin.FacebookLoginPackage;

// @ImagePicker
import me.donut.ImagePickerPackage;

import android.util.Log;

public class MainActivity extends Activity implements DefaultHardwareBackBtnHandler {

    private ReactInstanceManager mReactInstanceManager;
    private ReactRootView mReactRootView;

    // @FacebookLogin
    private FacebookLoginPackage mFacebookLoginPackage;

    // @ImagePicker
    private ImagePickerPackage mImagePicker;
    private List<ActivityResultListener> mListeners = new ArrayList<>();
    public void addActivityResultListener(ActivityResultListener listener) {
        mListeners.add(listener);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mReactRootView = new ReactRootView(this);

        // @FacebookLogin
        mFacebookLoginPackage = new FacebookLoginPackage(this);

        // @ImagePicker
        mImagePicker = new ImagePickerPackage(this);

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
                .addPackage(new RNFSPackage())

                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        mReactRootView.startReactApplication(mReactInstanceManager, "donutMobile", null);

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
}
