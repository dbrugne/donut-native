// @ImagePicker
package me.donut;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.pm.ResolveInfo;
import android.net.Uri;
import android.os.Environment;
import android.os.Parcelable;
import android.os.Bundle;
import android.provider.MediaStore;
import android.widget.Toast;
import android.database.Cursor;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Iterator;
import android.util.Log;

public class ImagePickerModule extends ReactContextBaseJavaModule implements ActivityResultListener {
  static final int REQUEST_LAUNCH_CAMERA = 1;
  static final int REQUEST_LAUNCH_IMAGE_LIBRARY = 2;

  private final ReactApplicationContext mReactContext;
  private final MainActivity mMainActivity;

  public Uri mCameraCaptureURI;
  public Callback mCallback;

  public ImagePickerModule(ReactApplicationContext reactContext, MainActivity mainActivity) {
    super(reactContext);

    mReactContext = reactContext;
    mMainActivity = mainActivity;

    //mMainActivity.addActivityResultListener(this);
  }

  @Override
  public String getName() {
    return "UIImagePickerManager"; // To coincide with the iOS native module name
  }

  // NOTE: Currently not reentrant / doesn't support concurrent requests
  @ReactMethod
  public void launchCamera(ReadableMap options, Callback callback) {
    Intent cameraIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
    if (cameraIntent.resolveActivity(mMainActivity.getPackageManager()) != null) {
      File imageFile = null;
      try {
        imageFile = File.createTempFile("exponent_capture_", ".jpg",
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES));
      } catch (IOException e) {
        callback.invoke(e.getMessage());
        Log.v("Image Picker DEBUG", "error while launching camera");
        return;
      }
      if (imageFile != null) {
        mCameraCaptureURI = Uri.fromFile(imageFile);

        Log.v("Image Picker DEBUG", "uri = " + mCameraCaptureURI.toString());
        cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(imageFile));
        mCallback = callback;
        mMainActivity.startActivityForResult(cameraIntent, REQUEST_LAUNCH_CAMERA);
      } else {
        Log.v("Image Picker DEBUG", "error while creating tmp file");
        callback.invoke(true, "file not save");
      }
    } else {
      callback.invoke(true, "error resolve activity");
    }
  }

  // NOTE: Currently not reentrant / doesn't support concurrent requests
  @ReactMethod
  public void launchImageLibrary(ReadableMap options, Callback callback) {
    Intent libraryIntent = new Intent();
    libraryIntent.setType("image/");
    libraryIntent.setAction(Intent.ACTION_GET_CONTENT);
    mCallback = callback;
    mMainActivity.startActivityForResult(libraryIntent, REQUEST_LAUNCH_IMAGE_LIBRARY);
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
    Log.v("Image Picker DEBUG", "let s go for result ");

    if (requestCode != REQUEST_LAUNCH_CAMERA && requestCode != REQUEST_LAUNCH_IMAGE_LIBRARY) {
      Log.v("Image Picker DEBUG", "bad request code");
      if (mCallback != null) {
        mCallback.invoke(true, Arguments.createMap());
      }
      return;
    }

    if (resultCode != Activity.RESULT_OK) {
      Log.v("Image Picker DEBUG", "canceled");
      mCallback.invoke(true, Arguments.createMap());
      return;
    }

    WritableMap response = Arguments.createMap();

    Log.v("Image Picker DEBUG", "result ok");
    if (mCameraCaptureURI == null && requestCode == REQUEST_LAUNCH_CAMERA) {
      Log.v("Image Picker DEBUG", "mCameraCaptureURI null");
      response.putString("err", "error uri not available");
      if (mCallback != null) {
        mCallback.invoke(true, response);
      }
      return;
    }
    Uri uri = (requestCode == REQUEST_LAUNCH_CAMERA)
    ? mCameraCaptureURI
    : data.getData();

    if (uri.toString() == null) {
      response.putString("err", "error uri not available");
      mCallback.invoke(true, response);
      return;
    }

    Log.v("Image Picker DEBUG", "uri ok : " + uri.toString());
    response.putString("uri", uri.toString());

    Log.v("Image Picker DEBUG", "get path ");
    response.putString("path", getRealPathFromURI(uri));

    Log.v("Image Picker DEBUG", "before response");
    try {
      mCallback.invoke(false, response);
    } catch (Exception e) {
      return;
    }
  }

  public String getRealPathFromURI(Uri uri) {
  String result = "error";
  Cursor cursor = mMainActivity.getContentResolver().query(uri, null, null, null, null);
  if (cursor == null) { // Source is Dropbox or other similar local file path
      result = uri.getPath();
  } else {
      Log.v("Image Picker DEBUG", "cursor OK");
      cursor.moveToFirst();
      int idx = cursor.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
      result = cursor.getString(idx);
      cursor.close();
  }
  return result;
  }
}