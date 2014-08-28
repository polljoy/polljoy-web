![Picture](http://www.polljoy.com/assets/images/logo/polljoy-logo-github.png)

In-app polls made easy. Just 2 API calls. Find out why users leave and get instant user feedback. Stats tell you what, polljoy tells you why.


#Intro
Hi friend! Let's add polljoy to your wondeful website or mobile web app. 

It's simple, you'll be up in minutes. 

Questions? - email help@polljoy.com and one of our devs will assist!

#Web console
Polls are created and managed through our web interface - https://admin.polljoy.com

Please note - polljoy web plug-in requires **JQuery** 1.6 or later  and **PHP** with **curl mod** enabled at your server end.

#Steps
1. Copy the files under src folder to your server end which is accessible from your web app.

```
src\connect.php
src\js\polljoy.js
```

NOTE: If you need more secure control, you should store `connect.php` in a controlled area that can only be accessed after user login.

2. Edit `connect.php` to add your **App ID** (they are available in the web [admin panel](https://admin.polljoy.com/applications/app)), and save

``` php
$appId = 'YOUR_APP_ID';
$deviceId = sha1($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);
```

3. Assign JQuery and polljoy.js in your website where you want to integrate polljoy
 
``` html
<script src="URL/PATH/TO/JQuery"></script>
<script src="URL/PATH/TO/polljoy.js"></script>
```

###Get polls
So you have installed the PHP file in your server end and included the Javascript files. In the webpage where you want to get the polls, include the following code in the HTML file:

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

This is the simplest way to connect your webapp to the server end and start a session to polljoy. When polls are returned, you will need to handle them and present the polls with the callbacks (see below).

You can pass more selection criteria that match your poll settings in [admin panel](https://admin.polljoy.com). Syntax:

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
                    tags: 'TAGNAME,TAGNAME#RANGE'
                });
            });
</script>
```

`DEVICE_ID` (optional) your can pass your user's id, email or whatever unique key to identify your user. If you webapp is running on mobile, it can be the mobile UUID. Your if you skip this, our plug-in will automatically create one for you from the HTTP AGENT and IP Address

`USER_TYPE` - select either **Pay** or **Non-Pay** users of your service.

`APP_VERSION` (optional) Set to nil if you prefer not to send it.  Or you can choose to pass it. eg 1.0.35

`LEVEL` (optional) Set as 0 if you prefer not to send it. If your app has levels you can pass them here. eg 34 

`SESSION_COUNT` (optional) Set it as 0 or you can manually send it. eg 3 

`TIME_SINCE_INSTALL` (optional) If your app tracks how long your users have been using your app, you can pass this if desired.

`TAGNAME,TAGNAME#RANGE` - (optional) Set to null if you aren't using them.  If your app uses tags to select polls, pass them in string format with as many as you want to send - `TAG,TAG, ... ,TAG`.  TAG is either in the format TAGNAME or TAGNAME:VALUE.  They should match what you defined in the web console. An example of sending back user gender, number of friends and where the poll is being called from could be: `FEMALE,FRIENDS#88,SHOPSCREEN`

### Callbacks (optional)
polljoy will inform your app at different stages when polls are downloaded, ready to show, user responded etc. Your app can optionally implement the javascript functions to control the app logic via callbacks from 'polljoy' object. The javascript functions are:

 ``` javascript
 function PJPollNotAvailable(status);
 ```

When there is no poll matching your selection criteria or no more polls to show in the current session.

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
 
When poll/s is/are ready to show (including all associated images). Friendly tip - If you are displaying the poll in the middle of an active game or app session that needs real time control, consider to pause your app before presenting the poll UI as needed. 

The polls array returned are all the matched polls for the request. Please refer `PJPoll.h` for the data structure.
When you’re ready to present the poll, call:
 
 ``` javascript
 polljoy('show');
 ```
 
This will present the polljoy UI according to your app style and poll settings. Then the SDK will handle all the remaining tasks for you. These include handling the user’s response, informing delegate for any virtual amount user received, uploading the result to the console … etc.

For example, the following code snippets will load the poll for the app once it is ready: 
 
  
 ``` javascript
function PJPollIsReady(polls)
{
	console.log("poll is ready");
	polljoy('show');
}
 ```
 
We recommend you implement the above callback function so that you know polls are ready and call polljoy plugin to show the poll or do whatever control you need.
 
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
 
User has responded to the poll. The poll will contain all the poll data including user’s responses. You can ignore this (the results are displayed in the web admin console and able to be exported) or use it as you wish.
If you issue a virtual currency amount to user, you MUST implement this method to handle the virtual amount issued. This is the only callback from SDK that informs the app the virtual amount that the user collected.

 ``` java
 function PJPollDidSkipped(poll);
 ```
 
 If the poll is not mandatory, the user can choose to skip the poll. You can handle this case or simply ignore it safely.

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
 
 it will be an array of `Poll`


### Example
Please see the example folder in the SDK for a simple integration. 

-
That's it!  Email us at help@polljoy.com if you have questions or suggestions!

ps - want to see some cute animals? [It's ok - we all do](https://polljoy.com/world.html)
