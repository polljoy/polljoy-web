![Picture](http://www.polljoy.com/assets/images/logo/logo.png)

> In-app polls made easy. Integrate in 2 lines of code.


#Polljoy Web app Integration Guide

Welcome friend! This guide will get you started with polljoy, fast & easy.

Got questions?  Email us at help@polljoy.com

-

<b>Simple</b> - polljoy is designed to be simple for users and especially developers. Just 2 API calls, you can get your polls running.

<b>Open</b> - The polljoy API is open. The SDK comes with all source code and a test app. You can simply install the SDK as-is to integrate the polljoy service.

<b>Easy</b> - polljoy is easy to use. Check out the test App in the SDK. Test with your own user id and app id. You can see how polljoy works. 

<b>Flexible</b> - the polljoy SDK comes with the required UI to present the poll and do all the tasks for you. But if you want to implement your own UI, you can. The poll data is open. Enjoy!


# The polljoy Admin Console

You can setup and manage all your polls through a web interface here https://admin.polljoy.com

NOTE: Please note - PollJoy web plug-in requires **JQuery** 1.6 or later  and **PHP** with **curl mod** enabled at your server end.


# Setup

1. Copy the files under src folder to your server end which can be accessible from your web app.

```
src\connect.php
src\js\polljoy.js
```

NOTE: If you need more secure control, you should store `connect.php` in a controlled area that can only be accessed after user login.

2. Edit `connect.php` to add your **App ID** and save

``` php
$appId = 'YOUR_APP_ID';
$deviceId = sha1($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);
```

3. Assign JQuery and polljoy.js in your website where you want to integrate polljoy
 
``` html
<script src="URL/PATH/TO/JQuery"></script>
<script src="URL/PATH/TO/polljoy.js"></script>
```


### Get polls

After you installed the PHP file in your server end and include the Javascript files, at where you want to get poll, include:

``` html
<script type="text/javascript">
    jQuery(document).ready(function()
    {
        jQuery('#poll').polljoy({
            endPoint: 'URL/TO/YOUR/SERVER/END/connect.php'
        });
    });  
</script>
```

This is the simplest way to connect your webapp to the server end and start session to polljoy. And get polls from polljoy. When polls are returned, you will need to handle them and present the polls with the callbacks (check below).

You can pass more selection criteria that match your poll settings in [admin panel](https://admin.polljoy.com). It looks like:

``` html
<script type="text/javascript">
	 jQuery(document).ready(function()
            {
                polljoy({
                    endPoint: 'URL/TO/YOUR/SERVER/END/connect.php',
                    deviceId: 'DEVICE_ID',
                    userType: 'USER_TYPE',
                    appVersion: 'APP_VERSION',
                    level: 'LEVEL',
                    sessionCount: 'SESSION_COUNT',
                    timeSinceInstall: 'TIME_SINCE_INSTALL',
                    tags: 'TAGS,TAGS#1-123'
                });
            });
</script>
```

All the parameters are optional.

`DEVICE_ID` - your can pass your user's id, email or whatever unique key to identify your user. If you webapp is running on mobile, it can be the mobile UUID. Your don't can skip this, plug-in will automatically create one for your from the HTTP AGENT and IP Address

`USER_TYPE` - your app user type either **Pay** or **Non-Pay**.
`APP_VERSION` - your app's version to be used as a poll selection criteria. This should match with your poll setting. Or set it as nil if you are not using.

`LEVEL` - if your app is a game app, this is your game level. This should match with your poll setting. Or set it as 0 if you are not using.

`SESSION_COUNT` - if you have session control, you can pass this to match with your poll setting to get the correct poll for your user.

`TIME_SINCE_INSTALL` - if your app track how long your users have been using your app, you can pass this to select the right poll.

`TAGS,TAGS#1-123` - if you app use tags to select polls, you pass the tags here. Please remember this needs to match your settings in admin panel.

### Handle callbacks from plug-in (optional)

polljoy will inform your app at different stages when polls are downloaded, ready to show, user responded etc. App can optionally implement the javascript functions to control the app logic via callbacks from 'polljoy' object. The javascript functions are:

 ``` javascript
 function PJPollNotAvailable(status);
 ```

When there is no poll match with your selection criteria or no more polls to show in the current session.

Status can be:
0 - session registration success
1 - session registration fail
100 - No match poll found
101 - Exception: app is missing
102 - Session Quota Reached
103 - Daily Quota Reached
104 - User Quota Reached
110 - Invalid request
999- User Account Problem

 ``` javascript
 function PJPollIsReady(polls);
 ```
 
 After you request for poll and poll/s is/are ready to show (including all defined images are downloaded). Friendly tip - If you are displaying the poll in the middle of an active game or app session that needs real time control, consider to pause your app before presenting the poll UI as needed. 
 
 polls array returned are all the matched polls for the request. Please check below for the data structure.
 
 When you're ready to present the poll, call:
 
 ``` javascript
 polljoy('show');
 ```
 
 This will present the polljoy UI according to your app color and poll settings. Then polljoy plugin will handle all the remaining tasks for you. These include handling the user's response, informing delegate for any virtual amount user received, upload result to polljoy service ... etc.

For example, the following code snippets will load the poll for the app once it is ready: 
 
  
 ``` javascript
function PJPollIsReady(polls)
{
	console.log("poll is ready");
	polljoy('show');
}
 ```
 
  
We highly recommend you implement the above callback function so that you know polls are ready and call polljoy plugin to show the poll or do whatever control you need.
 
 
 
 
 ``` javascript
 function PJPollWillShow(poll);
 ```
 
 The polljoy poll UI is ready and will show. You can do whatever UI control as needed. Or simply ignore this implementation.
 
 ``` javascript
 function PJPollDidShow:(poll);
 ```
 
 The polljoy poll UI is ready and has shown. You can do whatever UI control as needed. Or simply ignore this implementation.
 
 ``` javascript
 function PJPollWillDismiss:(poll);
 ```
 
 The polljoy poll UI is finished and will dismiss. You can do whatever UI control as needed. Or simply ignore this implementation. You can prepare your own UI before resuming your app before the polljoy poll UI is dismissed.
 
 ``` javascript
 function PJPollDidDismiss(poll);
 ```
 
 The polljoy poll UI is finished and has dismissed. You can do whatever UI control as needed. Or simply ignore this implementation. You can prepare your own UI to resume your app before the polljoy UI is dismissed. This is the last callback from polljoy and all polls are completed. You should resume your app if you have paused.
 
 ``` javascript
 function PJPollDidResponded(poll);
 ```
 
 User has responded to the poll. The poll will contain all the poll data including user's responses. You can ignore this (the results are displayed in the polljoy.com admin console and able to be exported) or use it as you wish.
 
 If you issue a virtual currency amount to user, you MUST implement this function to handle the virtual amount issued (especially if your app is game). This is the only callback from SDK that informs the app the virtual amount that the user collected.
 
 ``` java
 function PJPollDidSkipped(poll);
 ```
 
 If the poll is not mandatory, user can choose to skip the poll. You can handle this case or simply ignore it safely.
 
### Poll object data structure

All callbacks will return the associated poll in JSON format. data structure will look like:

```
active: true
appImageUrl: "https://s3-us-west-1.amazonaws.com/polljoydev/library/1/623428766a188a2086432612fcfb3cba5070fad4.png"
appName: "Polljoy"
backgroundColor: "147f5b"
borderColor: "147f5b"
buttonColor: "106b4d"
choice: "NA,A bit,Yes,No"
customMessage: "Thanks for the feedback!"
deleted: false
desiredResponses: "100"
deviceId: "antony@grandheart.com"
fontColor: "ffffff"
levelEnd: null
levelStart: null
mandatory: false
maxPollsInARow: "1"
maxPollsPerDay: "100"
maxPollsPerSession: "50"
osVersion: "Windows NT 6.3"
platform: "ios"
pollId: "214"
pollImageUrl: null
pollPlatform: "ios,android,web"
pollText: "Do you like this feature?"
pollToken: "3205"
priority: "Medium"
randomOrder: true
sendDate: "2014-05-01 12:31:04"
session: "214"
sessionEnd: null
sessionId: "2urgutid32tocnbmsled91asa6"
sessionStart: null
tags: null
timeSinceInstallEnd: null
timeSinceInstallStart: null
totalResponses: "4"
type: "M"
userId: "1"
userType: "Pay,Non-Pay"
versionEnd: null
versionStart: null
virtualAmount: null
virtualCurrency: null
```

note: The API will regularly update to open more data. Please always check the returned JSON data for the latest data structure if you need to use it.

 For callback:

 ``` javascript
 function PJPollIsReady(polls);
 ```
 
 it will be array of `Poll`


-
#### Got questions? Email us at help@polljoy.com

## Version History

### Version 1.2.1
- Add var for callbacks to handle different callbacks implementation scenario

### Version 1.2
- Production release

### Version 1.1.1-BETA
- UI improvement for desktop

### Version 1.1-BETA
- Pre-release for new UI custom settings & features.
- Currently available in SANDBOX only (not for production)
- Please contact help@polljoy.com if you want to beta test

### Version 0.1
- Initial beta release
