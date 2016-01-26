package com.parsepushnotification;

import com.parse.ParsePushBroadcastReceiver;
import com.parse.ParseAnalytics;

import android.util.Log;
import android.content.Intent;
import android.content.Context;
import android.graphics.Bitmap;
import android.app.Notification;
import android.app.Activity;
import android.app.IntentService;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v4.app.NotificationCompat.Builder;
import android.support.v4.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.PendingIntent;
import java.io.InputStream;
import java.net.HttpURLConnection;
import me.donut.mobile.R;
import android.os.AsyncTask;
import android.os.Bundle;
import java.util.UUID;
import java.util.Date;
import java.net.URL;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

import org.json.JSONObject;
import org.json.JSONException;

public class ParsePushNotificationListener extends ParsePushBroadcastReceiver {
    private final String TAG = "ParsePushBroadcastListener";
    public static final String PARSE_DATA_KEY = "com.parse.Data";
    private static JSONObject initialNotification;
    private static boolean initial = true;
    
    @Override
    public void onReceive(Context context, Intent intent) {
        /**
         * Code not used (for custom largeImage on notif)
        JSONObject data = getDataFromIntent(intent);
        Log.d(TAG, "received message");
        String title = "Donut.me";
        String message = "Donut.me";
        String imgUrl = null;
        try {
            title = data.getString("title");
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            message = data.getString("alert");
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            if (data.has("img") != false) {
                imgUrl = data.getString("img");
                Log.e(TAG, "Image Url :" + imgUrl); //it shows correct url
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        new sendNotification(context)
                .execute(title, message, imgUrl);
        */
        ParseAnalytics.trackAppOpened(intent);
        super.onReceive(context, intent);
    }

    public static void setInitialTrue () {
        initial = true;
    }
    
    public static JSONObject getInitialNotification () {
        JSONObject response = null;
        if (initial == true) {
            if (initialNotification == null) {
                Log.d("1 2 3 4 5 6 7", "initial notif is null :'(");
            } else {
                response = new JSONObject();
                response = initialNotification;
                initialNotification = null;
                initial = false;
            }
        }
        return response;
    }
    
    private static void setInitialNotification (final JSONObject obj) {
        initialNotification = obj;
    }
    
    @Override
    protected void onPushOpen(Context context, Intent intent) {
        JSONObject data = getDataFromIntent(intent);
        if (initial == true) {
            setInitialNotification(getDataFromIntent(intent));
        }
        Bundle b = new Bundle();
        b.putString("jsonObj", data.toString());

            
        // try to open the app
        Intent i = context.getPackageManager().getLaunchIntentForPackage(context.getApplicationContext().getPackageName());
        ParseAnalytics.trackAppOpenedInBackground(intent);

        i.putExtra("notification", b);
        // only if not in foreground, focus it if it's in background
        i.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(i);

        // try to broadcast event to js (only succes if app is open back/forground)
        try {
            Intent i2 = new Intent("PushNotificationsOpen");
            i2.putExtra("notification", b);
            context.sendBroadcast(i2);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //super.onPushOpen(context, intent);
    }

    @Override
    protected int getSmallIconId(Context context, Intent intent) {
        boolean useWhiteIcon = (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.LOLLIPOP);
        return useWhiteIcon ? R.drawable.ic_silhouette : R.mipmap.ic_launcher;
    }

    @Override
    protected Class<? extends Activity> getActivity(Context context, Intent intent) {
        Log.d(TAG, "getActivity() fired.");
        return super.getActivity(context, intent);
    }

    @Override
    protected Notification getNotification(Context context, Intent intent) {
        return super.getNotification(context, intent);
        // desactivate standard notification
        //return null;
    }

/******************************************************************************/
/*                                                                            */
/*                                 TOOLS                                      */
/*                                                                            */
/******************************************************************************/

    private JSONObject getDataFromIntent(Intent intent) {
      JSONObject data = null;
      try {
         data = new JSONObject(intent.getExtras().getString(PARSE_DATA_KEY));
      } catch (JSONException e) {
          e.printStackTrace();
         // Json was not readable...
      }
      return data;
    }

    /* not used (for custom largeImage on notif)
    private class sendNotification extends AsyncTask<String, Void, Bitmap> {
        Context ctx;
        String message;
        String title;

        public sendNotification(Context context) {
            super();
            this.ctx = context;
        }

        @Override
        protected Bitmap doInBackground(String... params) {
            InputStream in;
            title = params[0];
            message = params[1];
            if (params[2] == null) {
                return null;
            }
            try {
               URL url = new URL(params[2]);
               HttpURLConnection connection = (HttpURLConnection) url.openConnection();
               connection.setDoInput(true);
               connection.connect();
               in = connection.getInputStream();
               Bitmap myBitmap = BitmapFactory.decodeStream(in);
               return myBitmap;
            } catch (Exception e) {
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(Bitmap result) {
            super.onPostExecute(result);
            try {
                long time = new Date().getTime();
                String tmpStr = String.valueOf(time);
                String last4Str = tmpStr.substring(tmpStr.length() - 5);
                int notificationId = Integer.valueOf(last4Str);

                NotificationManager notificationManager = (NotificationManager) ctx
                        .getSystemService(Context.NOTIFICATION_SERVICE);
                Notification notification = new Notification.Builder(ctx)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setSmallIcon(R.mipmap.ic_launcher)
                        .setLargeIcon(result).build();

                Intent notificationIntent = new Intent(ctx, MainActivity.class);
                notificationIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

                PendingIntent intent = PendingIntent.getActivity(ctx, notificationId,
                    notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
                notification.contentIntent = intent;
                // hide the notification after its selected
                notification.flags |= Notification.FLAG_AUTO_CANCEL;

                Log.d(TAG, "notify : " + notificationId);
                notificationManager.notify(notificationId, notification);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }*/
}
