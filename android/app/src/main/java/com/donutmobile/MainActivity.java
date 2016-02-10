package me.donut.mobile;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

// @CodePush
import com.microsoft.codepush.react.CodePush;

// to retrieve config
import java.lang.reflect.Field;

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

// @VectorIcons
import com.oblador.vectoricons.VectorIconsPackage;

// @RNGL
import com.projectseptember.RNGL.RNGLPackage;

public class MainActivity extends ReactActivity {

    // @ImagePicker
    private ImagePickerPackage mImagePicker;

    // @Codepush
    private CodePush _codePush;

    /**
     * We override onCreate for parse installation
     */
    @Override
    protected void onCreate(Bundle savedInstanceState) {
      if (!isTaskRoot()) {
          finish();
          return;
      }

      super.onCreate(savedInstanceState);

      String env = "none";
      Object buildType = getBuildConfigValue("BUILD_TYPE");
      if (buildType != null && buildType.toString() == "release") {
          env = "production";
      } else {
          env = "test";
      }

      // register in parse installation with env field
      ParseInstallation installation = ParseInstallation.getCurrentInstallation();
      installation.put("env", env);
      installation.saveInBackground();
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "donutMobile";
    }

    /**
     * Returns the launchOptions which will be passed to the {@link ReactInstanceManager}
     * when the application is started. By default, this will return null and an empty
     * object will be passed to your top level component as its initial props.
     * If your React Native application requires props set outside of JS, override
     * this method to return the Android.os.Bundle of your desired initial props.
     */
     @Override
    protected Bundle getLaunchOptions() {
      Object buildType = getBuildConfigValue("BUILD_TYPE");
      Object ServerIp = getBuildConfigValue("LOCAL_IP");
      Object Version = getBuildConfigValue("DONUT_VERSION");
      String env = "none";
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
      return b;
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

   /**
   * A list of packages used by the app. If the app uses additional views
   * or modules besides the default ones, add more packages here.
   */
    @Override
    protected List<ReactPackage> getPackages() {
      Object buildType = getBuildConfigValue("BUILD_TYPE");

      // @CodePush
      String codePushKey;
      if (buildType != null && buildType.toString() == "release") {
          codePushKey = "QUin28f78rg5cJaf-Ao3bF2APvsyVJgNW_EDe";
      } else {
          codePushKey = "F83XLkIqywhmOu-2Mi-HzsamPn8jVJgNW_EDe";
      }
      this._codePush = new CodePush(codePushKey, this);

      // @ImagePicker
      mImagePicker = new ImagePickerPackage(this);

      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        this._codePush.getReactPackage(),
        new FacebookLoginPackage(),
        new NotificationAndroidPackage(this),
        new ParsePushNotificationPackage(this),
        mImagePicker,
        new VectorIconsPackage(),
        new RNGLPackage()
      );
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // @ImagePicker
        mImagePicker.handleActivityResult(requestCode, resultCode, data);
    }

    //@Codepush
    @Override
    protected String getJSBundleFile() {
        return this._codePush.getBundleUrl("index.android.bundle");
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
