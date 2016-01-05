package com.parsepushnotification;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.util.Set;
import org.json.*;

import android.content.Context;

public class ParsePushNotificationReceiverModule extends ReactContextBaseJavaModule {
    private ReactContext mReactContext;
    private Activity mActivity;
    private String TAG = "ParsePushNotificationModule";

    public ParsePushNotificationReceiverModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);

        mActivity = activity;
        mReactContext = reactContext;
        registerNotificationsOnOpen();
        ParsePushNotificationListener.setInitialTrue();
    }

    @Override
    public String getName() {
        return "ParsePushNotification";
    }

    @ReactMethod
    public void popInitialNotification(final Callback callback) {
        JSONObject infos = ParsePushNotificationListener.getInitialNotification();
        if (infos == null) {
            callback.invoke(false, null);
            return;
        }

        WritableMap params = Arguments.createMap();
        String bundleString = infos.toString();
        params.putString("notification", bundleString);
        callback.invoke(false, params);
    }
    
    private void sendEvent(String eventName, Object params) {
        Log.d(TAG, "sending event to react..");
        mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void registerNotificationsOnOpen() {
        IntentFilter intentFilter = new IntentFilter("PushNotificationsOpen");

        mReactContext.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Log.d(TAG, "onReceive event on press");
                notifyNotification(intent.getBundleExtra("notification"));
            }
        }, intentFilter);
    }

    private void notifyNotification(Bundle bundle) {
        String bundleString = convertJSON(bundle);

        WritableMap params = Arguments.createMap();
        params.putString("dataJSON", bundleString);

        sendEvent("remoteNotificationOpen", params);
    }

    private String convertJSON(Bundle bundle) {
        JSONObject json = new JSONObject();
        Set<String> keys = bundle.keySet();
        for (String key : keys) {
            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    json.put(key, JSONObject.wrap(bundle.get(key)));
                } else {
                    json.put(key, bundle.get(key));
                }
            } catch(JSONException e) {
                return null;
            }
        }
        return json.toString();
    }

}