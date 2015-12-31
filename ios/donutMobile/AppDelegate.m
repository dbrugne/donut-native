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

// @FacebookLogin
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>

// @Notifications
#import "RCTPushNotificationManager.h"

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
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  
  // Determine bundle identifier
  NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
  
  // Determine the configuration to load...
  // @source: http://www.itexico.com/blog/bid/99497/iOS-Mobile-Development-Using-Xcode-Targets-to-Reuse-the-Code
  NSString *donutEnvironment;
  #if ENV == 2
  donutEnvironment = @"test";
  #elif ENV == 1
  donutEnvironment = @"production";
  #else
  #warning "UNABLE TO DETERMINE DONUT CONFIGURATION TO LOAD"
  #endif
  
  // ... and force test configuration for Release (test)
  //if ([NSProcessInfo processInfo].environment[@"FORCE_TEST_CONFIGURATION"]) {
  //  donutEnvironment = @"test";
  //}
  
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
  rootView.appProperties = @{@"DONUT_ENVIRONMENT" : donutEnvironment, @"REACT_SERVER_ADDRESS" : reactServerAddress, @"BUNDLE_IDENTIFIER" : bundleIdentifier};
  NSLog(@"%@", rootView.appProperties);

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  //return YES;
  // @FacebookLogin
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                  didFinishLaunchingWithOptions:launchOptions];
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

// @Notifications
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// @Notifications
// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager application:application didReceiveRemoteNotification:notification];
}

@end
