package me.donut;

import com.parse.ParsePushBroadcastReceiver;

import android.util.Log;
import android.content.Intent;
import android.content.Context;
import android.graphics.Bitmap;
import android.app.Notification;
import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.support.v4.app.NotificationCompat.Builder;
import android.support.v4.app.NotificationCompat;
import android.app.NotificationManager;
import android.app.PendingIntent;
import java.io.InputStream;
import java.net.HttpURLConnection;
import me.donut.R;
import android.os.AsyncTask;
import java.util.UUID;
import java.util.Date;
import java.net.URL;

import org.json.JSONObject;
import org.json.JSONException;

public class ParsePushNotificationReceiver extends ParsePushBroadcastReceiver {
    private final String TAG = "ParsePushBroadcastReceiver";
    public static final String PARSE_DATA_KEY = "com.parse.Data";

    @Override
    public void onReceive(Context context, Intent intent) {
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
    }

    @Override
    protected void onPushOpen(Context context, Intent intent) {
        Log.d(TAG, "onPushOpen() fired.");
        
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
                notificationIntent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP
                        | Intent.FLAG_ACTIVITY_SINGLE_TOP);

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
    }
}