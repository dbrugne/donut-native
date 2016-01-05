/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"

// @CodePush
#import "CodePush.h"

// @FacebookLogin
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

// @PushNotificationIOS
#import "RCTPushNotificationManager.h"

// @Parse
#import <Parse/Parse.h> // https://parse.com/apps/quickstart#parse_push/ios/native/existing
#import "DonutParse.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Before this, during build phase the app BUNDLE ID, NAME and icon set was set with "Environment Switch Script" task
  
  // Determine where to retrieve the JS bundle
  // @source: http://moduscreate.com/automated-ip-configuration-for-react-native-development/
  NSURL *jsCodeLocation;
  #if DEBUG
    #if TARGET_OS_SIMULATOR
      // simulator: retrieve on localhost:8081
      #warning "DEBUG SIMULATOR"
      jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
    #else
      // device with scheme Debug: retrieve on LAN through current Mac IP
      #warning "DEBUG DEVICE"
      NSString *serverIP = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"SERVER_IP"];
      NSString *jsCodeUrlString = [NSString stringWithFormat:@"http://%@:8081/index.ios.bundle?platform=ios&dev=true", serverIP];
      NSString *jsBundleUrlString = [jsCodeUrlString stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
      jsCodeLocation = [NSURL URLWithString:jsBundleUrlString];
  #endif
  #else
    // device with Release configuration: use embedded bundle
    #warning "STANDALONE BUNDLE"
    //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
    // @CodePush
    jsCodeLocation = [CodePush bundleURL];
  #endif
  
  // Extract data from .plist
  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
  NSDictionary *info = [[NSBundle mainBundle] infoDictionary];
  NSString *donutVersion = [info objectForKey:@"CFBundleShortVersionString"];
  NSString *donutBuild = [info objectForKey:@"CFBundleVersion"];
  NSString *CodePushDeploymentKey = [info objectForKey:@"CodePushDeploymentKey"];
  
  // Determine the configuration to load
  // @source: http://www.itexico.com/blog/bid/99497/iOS-Mobile-Development-Using-Xcode-Targets-to-Reuse-the-Code
  NSString *donutEnvironment;
  #if ENV == 2
  donutEnvironment = @"test";
  #elif ENV == 1
  donutEnvironment = @"production";
  #else
  #warning "UNABLE TO DETERMINE DONUT CONFIGURATION TO LOAD"
  #endif
  
  NSString *reactServerAddress = @"localhost";
  #if DEBUG
  #if !TARGET_OS_SIMULATOR
  reactServerAddress = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"SERVER_IP"];
  #endif
  #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"donutMobile"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  // Pass some properties to application
  // @doc: https://facebook.github.io/react-native/docs/communication-ios.html
  rootView.appProperties = @{
        @"DONUT_ENVIRONMENT" : donutEnvironment,
        @"REACT_SERVER_ADDRESS" : reactServerAddress,
        @"BUNDLE_IDENTIFIER" : bundleIdentifier,
        @"DONUT_VERSION" : donutVersion,
        @"DONUT_BUILD" : donutBuild,
        @"CODE_PUSH_KEY" : CodePushDeploymentKey
  };
  NSLog(@"%@", rootView.appProperties);

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // @Parse
  // only configure Parse, let PushNotificationsIOS trigger native ask permission process
  [Parse setApplicationId:@"HLZpzyuliql75EGfdH1o9En9VwDIp4h8KmRHaQ9g"
                clientKey:@"scK5G6HLyEATHuytp74POetQozngZBhs9eUmnp4q"];
  
  // @FacebookLogin
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                  didFinishLaunchingWithOptions:launchOptions];
  //return YES;
}

// @FacebookLogin
- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

// @FacebookLogin
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                        openURL:url
                                              sourceApplication:sourceApplication
                                                     annotation:annotation];
}

// Required for push notifications (run on every app launch)
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  // @PushNotificationsIOS
  // PushNotificationsIOS 'register' event will be triggered
  [RCTPushNotificationManager application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  
  // @Parse
  // Store the deviceToken in the current installation and save it to Parse
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  [currentInstallation setDeviceTokenFromData:deviceToken];
  #if ENV == 2
    currentInstallation[@"env"] = @"test";
  #elif ENV == 1
    currentInstallation[@"env"] = @"production";
  #else
    #warning "UNABLE TO DETERMINE DONUT CONFIGURATION TO END TO PARSE"
  #endif
  
  [currentInstallation saveInBackground];
}

// Required for push notifications
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  // @Notifications
  // @source: http://stackoverflow.com/questions/11153631/increment-the-push-notification-badge-iphone
  [UIApplication sharedApplication].applicationIconBadgeNumber = [[[notification objectForKey:@"aps"] objectForKey: @"badge"] intValue];
  
  // @PushNotificationsIOS
  [RCTPushNotificationManager application:application didReceiveRemoteNotification:notification];
}

@end
