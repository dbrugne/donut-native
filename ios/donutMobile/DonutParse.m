//
//  DonutParse.m
//  donutMobile
//
//  Created by Damien Brugne on 01/01/2016.
//  Copyright © 2016 DONUT SAS. All rights reserved.
//

// @doc: https://facebook.github.io/react-native/docs/native-modules-ios.html#content
// @doc: https://www.parse.com/docs/ios/guide/

#import "DonutParse.h"
#import "RCTLog.h"

#import <Parse/Parse.h>

@implementation DonutParse

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getParseInstallationObjectId:(RCTResponseSenderBlock)callback)
{
  PFInstallation *currentInstallation = [PFInstallation currentInstallation];
  NSString *objectId = currentInstallation.objectId;
  
  RCTLogInfo(@"getParseInstallationObjectId %@", objectId);
  if (!objectId) {
    callback(@[@"no parse objectId"]);
  } else {
    callback(@[[NSNull null], objectId]);
  }
}

@end