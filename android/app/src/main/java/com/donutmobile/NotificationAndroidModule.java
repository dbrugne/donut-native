package com.notificationandroid;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.parse.ParseInstallation;

import android.util.Log;

public class NotificationAndroidModule extends ReactContextBaseJavaModule {
  private final ReactApplicationContext mReactContext;
  private final Activity mMainActivity;

  private Callback mCallback;

  public NotificationAndroidModule(ReactApplicationContext reactContext, Activity mainActivity) {
    super(reactContext);

    mReactContext = reactContext;
    mMainActivity = mainActivity;
  }

  @Override
  public String getName() {
    return "NotificationAndroidManager";
  }

  @ReactMethod
  public void getParseInstallationObjectId(final Callback callback) {
    callback.invoke((String) ParseInstallation.getCurrentInstallation().getObjectId());
  }
}
