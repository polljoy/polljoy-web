/* SDK version 2.2.1, use api version 2.2 */

var PJPollIsReady;
var PJPollNotAvailable;
var PJPollWillShow;
var PJPollDidShow;
var PJPollWillDismiss;
var PJPollDidDismiss;
var PJPollDidResponded;
var PJPollDidSkipped;

(function (polljoyFactory) {
    /* If the project supports AMD (Asynchronous Module Definition), */
    /* define the polljoy into module. */
    /* If not, populate the polljoy function to the window object. */
    if (typeof define === 'function' && define.amd)
    {
        define(['jquery'], polljoyFactory);
    }
    else
    {
        window.polljoy = polljoyFactory(jQuery);
    }
})(function(jQuery) {
    var $ = jQuery; // Dependency Injection

    var connector = '';
    var background = '';
    var border = '';
    var font = '';
    var buttonColor = '';
    var app;
    var polls;
    var sessionId;
    var current = -1;
    var container = false;
    var thisObject;
    var response;
    var userType;
    var appVersion;
    var level;
    var sessionCount;
    var timeSinceInstall;
    var tags;
    var deviceId;
    var orientation;
    var timer;
    var loadedImages = {
        defaultImage:false,
        closeButtonImage:null,
        rewardImage:null,
        borderImage_4x3_L:null,
        borderImage_4x3_P:null,
        buttonImage_4x3_L:null,
        buttonImage_4x3_P:null
    };
    var borderImage_L;
    var borderImage_P;
    var buttonImage_L;
    var buttonImage_P;
    var viewDeviceName='';
    var viewMode='';
    var testMode='0';
    var answeredButton;
    var msgToShow;
    var customSound=null;
    var msgShowTime = 2.0;
    var devices = {
        'iphone6-portrait':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'263px',
                'height':'544px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/iphone6_portrait.png")'
            },
            'overlaySettings': {
                'position' : 'relative',
                // 'right' : '25px',
                'top' : '61.5px',
                // 'border': 'none',
                'width': '240px',
                'height': '426px'
            }
        },
        'iphone6-landscape':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'438.5px',
                'height':'211.5px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/iphone6_landscape.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                'top' : '9.5px',
                'width': '341px',
                'height': '192px'
            }
        },
        'iphone5-portrait':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'291px',
                'height':'603px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/iphone5_portrait.png")'
            },
            'overlaySettings': {
                'position' : 'relative',
                // 'right' : '25px',
                'top' : '89px',
                // 'border': 'none',
                'width': '240px',
                'height': '426px'
            }
        },
        'iphone5-landscape':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'483.5px',
                'height':'231px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/iphone5_landscape.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '70px',
                'top' : '18px',
                //'border': 'none',
                'width': '341px',
                'height': '192px'
            }
        },
        'iphone4-portrait':{
            'aspectRatio' : '3x2',
            'deviceSettings': {
                'width':'290.5px',
                'height':'562.5px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/iphone4_portrait.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '25px',
                'top' : '102px',
                //'border': 'none',
                'width': '240px',
                'height': '360px'
            }
        },
        'iphone4-landscape':{
            'aspectRatio' : '3x2',
            'deviceSettings': {
                'width':'521.5px',
                'height':'277.5px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/iphone4_landscape.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '90.25px',
                'top' : '22px',
                //'border': 'none',
                'width': '341px',
                'height': '227px'
            }
        },
        'ipad-portrait':{
            'aspectRatio' : '4x3',
            'deviceSettings': {
                'width':'285px',
                'height':'423.5px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/ipad_portrait.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '14px',
                'top' : '41px',
                //'border': 'none',
                'width': '256px',
                'height': '341px'
            }
        },
        'ipad-landscape':{
            'aspectRatio' : '4x3',
            'deviceSettings': {
                'width':'423.5px',
                'height':'285px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/ipad_landscape.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '41px',
                'top' : '14px',
                //'border': 'none',
                'width': '341px',
                'height': '256px'
            }

        },
        'nexus-portrait':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'268.5px',
                'height':'526px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/nexus_portrait.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '14.25px',
                'top' : '50px',
                //'border': 'none',
                'width': '240px',
                'height': '426px'
            }
        },
        'nexus-landscape':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'421.5px',
                'height':'214.5px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/nexus_landscape.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '40.25px',
                'top' : '11.25px',
                //'border': 'none',
                'width': '341px',
                'height': '192px'
            }

        },
        'galaxy-portrait':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'276.5px',
                'height':'532.5px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/galaxy_portrait.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '18.25px',
                'top' : '53.25px',
                //'border': 'none',
                'width': '240px',
                'height': '426px'
            }
        },
        'galaxy-landscape':{
            'aspectRatio' : '16x9',
            'deviceSettings': {
                'width':'427px',
                'height':'222px',
                'right': '0',
                'left': '0',
                'top': '0',
                'bottom':'0',
                'margin': 'auto',
                'background-image':'url("https://cdn.polljoy.com/img/device/galaxy_landscape.png")'
            },
            'overlaySettings' :{
                'position' : 'relative',
                //'right' : '43px',
                'top' : '15px',
                //'border': 'none',
                'width': '341px',
                'height': '192px'
            }

        }
    };
    var methods = {
        init: function init(configuration)
        {
            thisObject = this;
            connector = configuration.endPoint;
            //connector = (connector.substr(connector.length - 1) == '?')?connector:(connector + '?');
            connector = (connector.indexOf("?") > 0)?connector:(connector + '?');
            if (typeof configuration.userType !== 'undefined')
                userType = configuration.userType;
            if (typeof configuration.appVersion !== 'undefined')
                appVersion = configuration.appVersion;
            if (typeof configuration.level !== 'undefined')
                level = configuration.level;
            if (typeof configuration.sessionCount !== 'undefined')
                sessionCount = configuration.sessionCount;
            if (typeof configuration.timeSinceInstall !== 'undefined')
                timeSinceInstall = configuration.timeSinceInstall;
            if (typeof configuration.deviceId !== 'undefined')
                deviceId = configuration.deviceId;
            if (typeof configuration.tags !== 'undefined')
                tags = configuration.tags;

            // mobile view settings if any
            if (typeof configuration.viewDeviceName !== 'undefined')
                viewDeviceName = configuration.viewDeviceName;
            if (typeof configuration.viewMode !== 'undefined')
                viewMode = configuration.viewMode;
            if ((viewDeviceName === '') || (viewMode === '')) {
                viewDeviceName = '';
                viewMode = '';
            }
            if (typeof configuration.testMode !== 'undefined')
                testMode = configuration.testMode;

            jQuery(thisObject).html('');
            methods.initPoll.apply(thisObject);
        },
        initPoll: function()
        {
            // clear global variables;
            app = undefined;
            polls = undefined;
            loadedImages = {
                defaultImage:false,
                closeButtonImage:null,
                rewardImage:null,
                borderImage_4x3_L:null,
                borderImage_4x3_P:null,
                buttonImage_4x3_L:null,
                buttonImage_4x3_P:null
            };

            var registerSession = jQuery.ajax({
                url: connector + '&register=true',
                type: 'post',
                dataType: 'json',
                data: {deviceId: deviceId}
            });

            registerSession.done(function(response){
                if (response.status === 1)
                {
                    console.log('registerSession.json returned error!');
                    if (typeof PJPollNotAvailable === 'function')
                    {
                        PJPollNotAvailable(response.status);
                    }
                    return false;
                }
                else {
                    app = response.app;

                    background = response.app.backgroundColor;
                    border = response.app.borderColor;
                    font = response.app.fontColor;
                    buttonColor = response.app.buttonColor;

                    sessionId = response.app.sessionId;
                    deviceId = response.app.deviceId;

                    //preload app images
                    //preload app default image
                    if ((app.defaultImageUrl !== null) && (app.defaultImageUrl.length > 0)){
                        loadedImages.defaultImage=false;
                        jQuery('<img/>').attr('src', app.defaultImageUrl).load(function() {
                            jQuery(this).remove();
                            loadedImages.defaultImage=true;
                            methods.imageLoaded();
                        });
                    }
                    else {
                        loadedImages.defaultImage=false;
                        jQuery('<img/>').attr('src', 'https://res.polljoy.com/img/filler.png').load(function() {
                            jQuery(this).remove();
                            loadedImages.defaultImage=true;
                            methods.imageLoaded();
                        });
                    }
                    //preload border image
                    if (viewDeviceName !== '') {
                        orientation = viewMode.substring(0,1).toUpperCase();
                        var deviceName = viewDeviceName + '-' + viewMode;

                        borderImage_L = app['borderImageUrl_' + devices[deviceName]['aspectRatio'] + '_L'];
                        borderImage_P = app['borderImageUrl_' + devices[deviceName]['aspectRatio'] + '_P'];
                        buttonImage_L = app['buttonImageUrl_' + devices[deviceName]['aspectRatio'] + '_L'];
                        buttonImage_P = app['buttonImageUrl_' + devices[deviceName]['aspectRatio'] + '_P'];
                    }
                    else {
                        borderImage_L = app.borderImageUrl_4x3_L;
                        borderImage_P = app.borderImageUrl_4x3_P;
                        buttonImage_L = app.buttonImageUrl_4x3_L;
                        buttonImage_P = app.buttonImageUrl_4x3_P;
                    }

                    if ((borderImage_L != null) && (borderImage_L.length > 0)) {
                        loadedImages.borderImage_4x3_L=false;
                        jQuery('<img/>').attr('src', borderImage_L).load(function() {
                            jQuery(this).remove();
                            loadedImages.borderImage_4x3_L=true;
                            methods.imageLoaded();
                        });
                    }
                    if ((borderImage_P != null) && (borderImage_P.length > 0)) {
                        loadedImages.borderImage_4x3_P=false;
                        jQuery('<img/>').attr('src', borderImage_P).load(function() {
                            jQuery(this).remove();
                            loadedImages.borderImage_4x3_P=true;
                            methods.imageLoaded();
                        });
                    }
                    //preload button image
                    if ((buttonImage_L != null) && (buttonImage_L.length > 0)) {
                        loadedImages.buttonImage_4x3_L=false;
                        jQuery('<img/>').attr('src', buttonImage_L).load(function() {
                            jQuery(this).remove();
                            loadedImages.buttonImage_4x3_L=true;
                            methods.imageLoaded();
                        });
                    }
                    if ((buttonImage_P != null) && (buttonImage_P.length > 0)) {
                        loadedImages.buttonImage_4x3_P=false;
                        jQuery('<img/>').attr('src', buttonImage_P).load(function() {
                            jQuery(this).remove();
                            loadedImages.buttonImage_4x3_P=true;
                            methods.imageLoaded();
                        });
                    }
                    //preload close button image
                    if ((app.closeButtonImageUrl != null) && (app.closeButtonImageUrl.length > 0)) {
                        loadedImages.closeButtonImage=false;
                        jQuery('<img/>').attr('src', app.closeButtonImageUrl).load(function() {
                            jQuery(this).remove();
                            loadedImages.closeButtonImage=true;
                            methods.imageLoaded();
                        });
                    }
                    //preload close button image
                    if ((app.rewardImageUrl != null) && (app.rewardImageUrl.length > 0)) {
                        loadedImages.rewardImageUrl=false;
                        jQuery('<img/>').attr('src', app.rewardImageUrl).load(function() {
                            jQuery(this).remove();
                            loadedImages.rewardImageUrl=true;
                            methods.imageLoaded();
                        });
                    }

                    // load custom sound
                    if ((app.customSoundUrl != null) && (app.customSoundUrl.length > 0)) {
                        customSound = new Audio(app.customSoundUrl);
                    }

                    /*now get the polls for this app*/
                    /*url: connector + 'smartget.json',*/
                    var smartget = jQuery.ajax({
                        url: connector + '&sg=true',
                        type: 'post',
                        dataType: 'json',
                        data: {
                            sessionId: sessionId,
                            userType: userType,
                            appVersion: appVersion,
                            level: level,
                            sessionCount: sessionCount,
                            timeSinceInstall: timeSinceInstall,
                            tags: tags,
                            deviceId: deviceId
                        }
                    });
                    smartget.done(function(sgResponse){
                        polls = sgResponse.polls;
                        if (typeof polls !== 'undefined' && polls.length > 0)
                        {
                            var imagePreloadComplete = function(key) {
                                jQuery(this).remove();
                                loadedImages[key] = true;
                                methods.imageLoaded();
                            };
                            // set preload image queue
                            var pollImagesCount=0;
                            for (var i = 0; i < polls.length; i++) {
                                if ((polls[i].PollRequest.pollImageUrl != null) && (polls[i].PollRequest.pollImageUrl.length > 0)){
                                    loadedImages["poll"+(i+1).toString()+"Image"] = polls[i].PollRequest.pollImageUrl;
                                    pollImagesCount++;
                                }
                                //preload poll reward currency image
                                if ((polls[i].PollRequest.pollRewardImageUrl != null) && (polls[i].PollRequest.pollRewardImageUrl.length > 0)){
                                    loadedImages["poll"+(i+1).toString()+"CurrencyImage"] = polls[i].PollRequest.pollRewardImageUrl;
                                    pollImagesCount++;
                                }

                                //preload image poll images
                                if (polls[i].PollRequest.type == "I"){
                                    for (var j = 0; j < polls[i].PollRequest.choices.length; j++) {
                                        loadedImages["poll"+(i+1).toString()+"ChoiceImage"+(j+1).toString()] = polls[i].PollRequest.choiceImageUrl[polls[i].PollRequest.choices[j]];
                                        pollImagesCount++;
                                    }
                                }

                                if (polls[i].PollRequest.childPolls !== 'undefined') {
                                    if (polls[i].PollRequest.childPolls !== null) {
                                        methods.preloadChildPollImages(polls[i].PollRequest.childPolls);
                                    }
                                }
                            }

                            //preload poll images
                            for (var i = 0; i < polls.length; i++) {
                                if ((polls[i].PollRequest.pollImageUrl != null) && (polls[i].PollRequest.pollImageUrl.length > 0)){
                                    jQuery('<img/>').attr('src', polls[i].PollRequest.pollImageUrl).load(imagePreloadComplete("poll"+(i+1).toString()+"Image"));
                                }
                                //preload poll reward currency image
                                if ((polls[i].PollRequest.pollRewardImageUrl != null) && (polls[i].PollRequest.pollRewardImageUrl.length > 0)){
                                    jQuery('<img/>').attr('src', polls[i].PollRequest.pollRewardImageUrl).load(imagePreloadComplete("poll"+(i+1).toString()+"CurrencyImage"));
                                }

                                //preload image poll images
                                if (polls[i].PollRequest.type == "I"){
                                    for (var j = 0; j < polls[i].PollRequest.choices.length; j++) {
                                        // cross domain not allow in cdn.                                         jQuery.ajax({url:polls[i].PollRequest.choiceImageUrl[polls[i].PollRequest.choices[j]],type: "GET", success:imagePreloadComplete("poll"+(i+1).toString()+"ChoiceImage"+(j+1).toString())});
                                        jQuery('<img/>').attr('src', polls[i].PollRequest.choiceImageUrl[polls[i].PollRequest.choices[j]]).load(imagePreloadComplete("poll"+(i+1).toString()+"ChoiceImage"+(j+1).toString()));
                                    }
                                }
                            }

                            if (pollImagesCount === 0) methods.imageLoaded();
                        }
                        else
                        {
                            if (typeof PJPollNotAvailable === 'function')
                            {
                                PJPollNotAvailable(sgResponse.status);
                            }
                        }
                    });
                }
            });
        },
        imageLoaded: function(image) {
            if (typeof polls !== 'undefined') {
                var allLoaded = true;
                for(var key in loadedImages) {
                    var value = loadedImages[key];
                    if (value !== true && value !== null){
                        allLoaded = false;
                    }
                }
                if (allLoaded == true) {
                    if (typeof PJPollIsReady === 'function')
                    {
                        PJPollIsReady(polls);
                    }
                    //jQuery("#polljoy_poll").css("visibility", "visible");
                }
            }
        },
        show: function()
        {
            var c = current;
            if (c < 0)
                c = 0;
            if (typeof polls === 'undefined' || typeof polls[c] === 'undefined')
            {
                return false;
            }
            var poll = polls[c].PollRequest;

            if (typeof PJPollWillShow === 'function')
            {
                PJPollWillShow(poll);
            }

            methods.drawPlotsContainer.apply(thisObject);
        },
        hide: function()
        {
            var c = current;
            if (c < 0)
                c = 0;
            jQuery('#polljoy_poll').fadeOut(100);//css('display', 'none');

            if (typeof polls[c] === 'undefined' || typeof polls[c].PollRequest === 'undefined')
            {
                return false;
            }

            var poll = polls[c].PollRequest;

            if (typeof PJPollWillDismiss === 'function')
            {
                PJPollWillDismiss(poll);
            }

            methods.unbindEvents.apply(thisObject);

            if (typeof PJPollDidDismiss === 'function')
            {
                PJPollDidDismiss(poll);
                container = false;
                current = -1;
                jQuery('#polljoy_poll').html('');

            }
        },
        centerThePoll: function()
        {
            if (viewDeviceName !== '') {

                return;
            }

            var height = jQuery('.pollContainer').height();
            var windowHeight = window.innerHeight;
            var positionTop = parseInt((windowHeight - height) / 2);
            if (windowHeight < height)
            {
                jQuery('#polljoy_poll').css('position', 'absolute');
                jQuery('#polljoy_poll').css('height', (height + 30) + 'px');
                jQuery('.pollContainer').css('top', '0px');
            }
            else
            {
                jQuery('#polljoy_poll').css('position', 'fixed');
                jQuery('#polljoy_poll').css('height', '100%');
                jQuery('.pollContainer').css('top', positionTop + 'px');
            }

        },
        drawPlotsContainer: function()
        {
            orientation = 'L';
            jQuery('#polljoy_poll').fadeIn(100);

            if (typeof polls === 'undefined' || polls.length === 0)
            {
                return false;
            }
            if (!container)
            {
                jQuery.get('https://res.polljoy.com/PJPollview.php', function(data){
                    container = jQuery(data);
                    jQuery(thisObject).html('');
                    if ( jQuery(thisObject).attr("visibility") == "undefined" ){
                        jQuery(thisObject).css("visibility", "hidden");
                    }
                    jQuery(thisObject).append(container);
                    methods.adjustLayoutSize.apply(thisObject);
                    methods.switchOrientation.apply(thisObject);
                    methods.layoutView.apply(thisObject);
                    methods.drawNextQuestion.apply(thisObject);

                    if (typeof PJPollDidShow === 'function')
                    {
                        PJPollDidShow(polls[current]['PollRequest']);
                    }

                    methods.bindEvents.apply(thisObject);

                });
            }
            else
            {
                jQuery(container).css('display', 'block');
                if (typeof PJPollDidShow === 'function')
                {
                    PJPollDidShow(polls[current]['PollRequest']);
                }
            }
        },
        getCloseButton: function()
        {
            return jQuery('#polljoe_pollview_close_btn').click(function()
            {
                methods.hide.apply(thisObject);
            });
        },
        drawFinaliseQuestion: function()
        {
            var poll = polls[current].PollRequest;
            jQuery('#polljoy_pollview_question_text').html(poll.customMessage);
            jQuery('#polljoy_pollview_reward').hide();
            jQuery('#polljoy_pollview_collect').unbind('click');

            if (typeof(polls[current + 1]) !== 'undefined')
            {
                /*collect or next question*/
                var reward = parseInt(poll.virtualAmount);
                if (reward > 0)
                {
                    var button = jQuery('<a href="#">' + poll.collectButtonText + '</a>');

                    button = methods.setButtonCss(button);
                    jQuery('#polljoy_pollview_collect').html(button).click(function(e)
                    {
                        jQuery('#polljoy_pollview_thankyou').hide();
                        methods.drawNextQuestion.apply(thisObject);
                    });
                    jQuery('#polljoy_pollview_mc_choices').hide();
                    jQuery('#polljoy_pollview_ip_choices').hide();
                    jQuery('#polljoy_pollview_openend').hide();
                    jQuery('#polljoy_pollview_thankyou').show();
                }
                else
                {
                    methods.drawNextQuestion.apply(thisObject);
                    return true;
                }
            }
            else
            {
                var reward = parseInt(poll.virtualAmount);
                if (reward > 0)
                {
                    var button = jQuery('<a href="#">' + poll.collectButtonText + '</a>');
                }
                else
                {
                    var button = jQuery('<a href="#">' + poll.thankyouButtonText + '</a>');
                }

                button = methods.setButtonCss(button);
                jQuery('#polljoy_pollview_collect').html(button).click(function()
                {
                    methods.hide.apply(thisObject);
                });
                jQuery('#polljoy_pollview_mc_choices').hide();
                jQuery('#polljoy_pollview_ip_choices').hide();
                jQuery('#polljoy_pollview_openend').hide();
                jQuery('#polljoy_pollview_thankyou').show();
            }

            jQuery('#polljoy_pollview_close_btn').hide();
        },
        drawNextQuestion: function()
        {

            current++;
            if (typeof polls[current] === 'undefined')
            {
                methods.finish.apply(thisObject);
                return true;
            }
            var poll = polls[current].PollRequest;
            var image;

            app = poll.app;
            methods.layoutView.apply(thisObject);

            if ((poll.pollImageUrl !== null) && (poll.pollImageUrl.length > 0))
            {
                image = poll.pollImageUrl;
                jQuery('#polljoy_pollview_thumbnail').css('border-radius',poll.imageCornerRadius + 'px' );
            }
            else if ((poll.app.defaultImageUrl !== null) && (poll.app.defaultImageUrl.length > 0))
            {
                image = poll.appImageUrl;
                jQuery('#polljoy_pollview_thumbnail').css('border-radius',poll.app.imageCornerRadius + 'px');
            }
            else {
                image = 'https://res.polljoy.com/img/filler.png';
            }
            jQuery('#polljoy_pollview_thumbnail').attr('src',image);

            if (!poll.mandatory)
            {
                jQuery('#polljoy_pollview_close_btn').show();
                if ((poll.app.closeButtonImageUrl !== null) && (poll.app.closeButtonImageUrl.length > 0)) {
                    jQuery('#polljoy_pollview_close_btn').css('background-image','url("'+poll.app.closeButtonImageUrl+'")');
                    jQuery('#polljoy_pollview_close_btn').css('color','transparent');
                }
                else {
                    jQuery('#polljoy_pollview_close_btn').css('background-image','');
                    jQuery('#polljoy_pollview_close_btn').css('color','#'+poll.app.fontColor);
                }

                jQuery('#polljoy_pollview_close_btn').unbind('click');
                jQuery('#polljoy_pollview_overlay').unbind('click');
                jQuery('#polljoy_pollview_border_canvas').unbind('click');
                var skip = function(e)
                    //function skip (e)
                {

                    e.preventDefault();

                    if ((current + 1) === polls.length)
                    {
                        methods.hide.apply(thisObject);
                    }
                    else
                    {
                        methods.drawNextQuestion.apply(thisObject);
                    }

                    jQuery.ajax({
                        url: connector + '&response=true&token=' + poll.pollToken,
                        type: 'post',
                        async: true,
                        dataType: 'json',
                        data: {
                            sessionId: sessionId,
                            response: '',
                            deviceId: deviceId
                        }
                    });

                    if (typeof PJPollDidSkipped === 'function')
                    {
                        PJPollDidSkipped(poll);
                    }
                };

                var next = jQuery('#polljoy_pollview_close_btn').click(skip);

                if (app.closeButtonEasyClose==1) {
                    jQuery('#polljoy_pollview_overlay_canvas').click(function(e) {
                        skip(e);
                    });
                    jQuery('#polljoy_pollview_border_canvas').click(function(e) {
                        skip(e);
                    });
                }
            }
            else {
                jQuery('#polljoy_pollview_close_btn').hide();
            }

            var reward = parseInt(poll.virtualAmount);
            if (reward > 0)
            {
                if ((poll.pollRewardImageUrl !== null) && (poll.pollRewardImageUrl.length > 0)) {
                    jQuery('#polljoy_pollview_reward_image').css('background-image','url("'+poll.pollRewardImageUrl+'")');
                    jQuery('#polljoy_pollview_reward_image2').css('background-image','url("'+poll.pollRewardImageUrl+'")');
                }
                else if ((poll.app.rewardImageUrl !== null) && (poll.app.rewardImageUrl.length > 0)) {
                    jQuery('#polljoy_pollview_reward_image').css('background-image','url("'+poll.app.rewardImageUrl+'")');
                    jQuery('#polljoy_pollview_reward_image2').css('background-image','url("'+poll.app.rewardImageUrl+'")');
                }
                else {
                    jQuery('#polljoy_pollview_reward_image').css('background-image','');
                    jQuery('#polljoy_pollview_reward_image2').css('background-image','');
                }

                jQuery('#polljoy_pollview_reward_earn_amount').html(reward);
                jQuery('#polljoy_pollview_reward_earn_amount2').html(reward);
                jQuery('#polljoy_pollview_reward').show();
                jQuery('#polljoy_pollview_thankyou_reward').show();
            }
            else {
                jQuery('#polljoy_pollview_reward').hide();
                jQuery('#polljoy_pollview_thankyou_reward').hide();
            }

            jQuery('#polljoy_pollview_question_text').html(poll.pollText);

            if (poll.type === 'T')
            {
                jQuery('#polljoy_pollview_openend_asnwer')
                    .html(jQuery('<textarea id="polljoy_pollview_openend_asnwer_answer" required="required"></textarea>')
                        .css('display', 'block')
                        .css('color', '#000')
                        .css('background', '#fff')
                        .css('width', '100%')
                        .css('height','100%')
                        .css('resize','none')
                        .css('border','#000 1px solid')
                        .css('padding','5px')
                        .css('margin','0')
                        .css('box-sizing','border-box')
                    );

                jQuery('#polljoy_pollview_mc_choices').hide();
                jQuery('#polljoy_pollview_openend').show();
                jQuery('#polljoy_pollview_ip_choices').hide();
                jQuery('#polljoy_pollview_thankyou').hide();

                var submit = jQuery('<a href="#">' + poll.submitButtonText + '</a>');
                submit = methods.setButtonCss(submit);
                jQuery('#polljoy_pollview_submit').unbind( 'click' );
                jQuery('#polljoy_pollview_submit').html(submit).click(function()
                {
                    answeredButton = submit.parent();
                    methods.submitCurrentPoll.apply(thisObject);
                });
            }
            else if (poll.type === 'M')
            {
                var choices = poll.choices;
                var offset = 4 - poll.choices.length;
                var deltaAdjust = orientation == 'L' ? 0.5: 0;

                // hide all button then relayout
                jQuery("[id^='polljoy_pollview_row_button']").each(function() {
                    jQuery(this).hide();
                });

                jQuery('#polljoy_pollview_mc_choices').css('height',(deltaAdjust + poll.choices.length*(100/4)) + '%');
                jQuery('#polljoy_pollview_mc_choices').css('max-height',(deltaAdjust + poll.choices.length*(100/4)) + '%');
                jQuery('.polljoy-pollview-row-button').css('height',(deltaAdjust + 100/poll.choices.length) + '%');
                jQuery('.polljoy-pollview-row-button').css('max-height',(deltaAdjust + 100/poll.choices.length) + '%');

                jQuery(choices).each(function(k, v)
                {
                    var button = jQuery('<a href="#">' + v + '</a>');
                    var thisButton='polljoy_pollview_button' + offset;
                    button = methods.setButtonCss(button);
                    jQuery('#'+thisButton).html(button).unbind( 'click' );
                    jQuery('#'+thisButton).html(button).click(function(e)
                    {
                        e.preventDefault();
                        jQuery(container).find('a').removeClass('selected');
                        jQuery(button).addClass('selected');
                        answeredButton = button.parent();
                        methods.submitCurrentPoll.apply(thisObject);
                    });
                    jQuery('#polljoy_pollview_row_button' + offset).show();
                    offset++;
                });
                jQuery('#polljoy_pollview_mc_choices').show();
                jQuery('#polljoy_pollview_openend').hide();
                jQuery('#polljoy_pollview_ip_choices').hide();
                jQuery('#polljoy_pollview_thankyou').hide();
            }
            else if (poll.type === 'I')
            {
                var choices = poll.choices;
                var offset = 4 - poll.choices.length;
                var deltaAdjust = orientation == 'L' ? 0.5: 0;

                // hide all button then relayout
                jQuery("[id^='polljoy_pollview_ip_img_button']").each(function() {
                    jQuery(this).hide();
                    jQuery(this).children().html('');
                });


                jQuery(choices).each(function(k, v)
                {
                    var imgSrc = poll.choiceImageUrl[v];
                    var button = jQuery('<a href="#" data-index="' + k.toString() + '"><img src="' + imgSrc + '" id="polljoy_pollview_ip_image' + k.toString() + '" style="width:100%;height:100%;"></a>');
                    var thisButton='#polljoy_pollview_ip_button' + offset;
                    //button = methods.setButtonCss(button);
                    jQuery(thisButton).html(button).unbind( 'click' );
                    jQuery(thisButton).html(button).click(function(e)
                    {
                        e.preventDefault();
                        jQuery(container).find('a').removeClass('selected');
                        jQuery(button).addClass('selected');
                        var index = jQuery(button).data('index');
                        var src = jQuery('#polljoy_pollview_ip_image'+index).attr('src');
                        var selected=jQuery('#polljoy_pollview_ip_preview_button').css('background-image').slice(4, -1);;

                        if (src==selected) {
                            jQuery('#polljoy_pollview_ip_confirm_button').show();
                        }
                        else {
                            jQuery('#polljoy_pollview_ip_confirm_button').hide();
                            jQuery('#polljoy_pollview_ip_preview_button').css('background-image','url(' + src + ')');
                        }
                    });

                    if (k===0) {
                        jQuery('#polljoy_pollview_ip_preview_button').css('background-image','url('+imgSrc+')');
                        jQuery(button).addClass('selected');
                    }

                    jQuery('#polljoy_pollview_ip_img_button' + offset).show();
                    offset++;
                });
                var previewButton = jQuery('#polljoy_pollview_ip_preview_button');
                previewButton.click(function(e){
                    jQuery('#polljoy_pollview_ip_confirm_button').show();
                });
                var confirmButton = jQuery('#polljoy_pollview_ip_confirm_button');
                confirmButton.hide();
                confirmButton.unbind( 'click' );
                confirmButton.click(function(e) {
                    answeredButton = jQuery('#polljoy_pollview_ip_preview_button');
                    methods.submitCurrentPoll.apply(thisObject);
                    //jQuery('#polljoy_pollview_answer').css('width','');
                    //jQuery('#polljoy_pollview_answer').css('right','');

                });
                jQuery('#polljoy_pollview_mc_choices').hide();
                jQuery('#polljoy_pollview_ip_choices').show();
                jQuery('#polljoy_pollview_openend').hide();
                jQuery('#polljoy_pollview_thankyou').hide();
                jQuery('.polljoy-pollview-thumbnail').hide();
                jQuery('.polljoy-pollview-ip-confirm-btn').css('width','75%');
                jQuery('.polljoy-pollview-ip-confirm-btn').css('height','25%');
                jQuery('.polljoy-pollview-ip-confirm-btn').css('margin-left','12.5%');
                jQuery('.polljoy-pollview-ip-confirm-btn').css('margin-right','auto');
                jQuery('.polljoy-pollview-ip-confirm-btn').css('margin-top','37.5%');
                jQuery('.polljoy-pollview-ip-confirm-btn').css('text-decoration', 'none');
            }

            jQuery("#polljoy_poll").show();
        },
        setButtonCss: function(object)
        {
            return object.css('color', 'inherit').css('text-decoration', 'none').css('width','100%').css('height','100%');;
        },
        setButtonSize: function()
        {
            var poll = polls[current].PollRequest;
            var choices = poll.choices;
            var offset = 4 - poll.choices.length;
            var deltaAdjust = orientation == 'L' ? 0.5: 0;

            // hide all button then relayout
            jQuery("[id^='polljoy_pollview_row_button']").each(function() {
                jQuery(this).hide();
            });

            jQuery('#polljoy_pollview_mc_choices').css('height',(deltaAdjust + poll.choices.length*(100/4)) + '%');
            jQuery('#polljoy_pollview_mc_choices').css('max-height',(deltaAdjust + poll.choices.length*(100/4)) + '%');
            jQuery('.polljoy-pollview-row-button').css('max-height',(deltaAdjust + 100/poll.choices.length) + '%');
            jQuery('.polljoy-pollview-row-button').css('height',(deltaAdjust + 100/poll.choices.length) + '%');

            jQuery(choices).each(function(k, v)
            {
                jQuery('#polljoy_pollview_row_button' + offset).show();
                offset++;
            });
        },
        submitCurrentPoll: function()
        {
            var poll = polls[current].PollRequest;
            if (poll.type === 'T' && container.find('textarea').val() === '')
            {
                alert('To submit, please enter something');
                return false;
            }

            if (poll.type === 'T')
            {
                response = container.find('textarea').val();
            }
            else if (poll.type === 'M')
            {
                response = container.find('.selected').html();
            }
            else if (poll.type === 'I') {
                var index = container.find('.selected').data('index');
                response = poll.choices[index];
            }

            if (poll.virtualRewardAnswer != '') {
                if (poll.virtualRewardAnswer != response) {
                    poll.virtualAmount = 0;
                }
            }

            if (typeof PJPollDidResponded === 'function')
            {
                poll.response = response;
                PJPollDidResponded(poll);
            }

            if (testMode==='0') {
                jQuery.ajax({
                    url: connector + '&response=true&token=' + poll.pollToken,
                    type: 'post',
                    async: true,
                    dataType: 'json',
                    data: {
                        sessionId: sessionId,
                        response: response,
                        deviceId: deviceId
                    }
                });
            }
            else {
                console.log("polljoy: testmode, no data saved");
            }

            // check for prerequisite
            if (poll.childPolls !== 'undefined') {
                var childPoll = null;
                if (poll.childPolls !== null) {
                    var childPolls = poll.childPolls
                    if (childPolls[poll.response] !== 'undefined') {
                        childPoll = childPolls[poll.response];
                    }
                    else if (childPolls['polljoyPollAnyAnswer'] !== 'undefined') {
                        childPoll = childPolls['polljoyPollAnyAnswer'];
                    }
                }
                if (childPoll !== null) {
                    //insert into queue
                    polls.splice(current+1, 0, childPoll);
                }
            }

            methods.showThankyouMsg(answeredButton);

            /*
            methods.drawFinaliseQuestion.apply(thisObject);

            // open external URL
            var targetUrls=poll.choiceUrl;
            if ((poll.type === 'M') || (poll.type === 'I'))
            {
                if ((targetUrls[response]['web'] !== null) && (targetUrls[response]['web'].length > 0))
                {
                    window.open(targetUrls[response]['web'], '_blank');
                }
            }
            */
        },
        finish: function()
        {
            var poll = polls[current - 1].PollRequest;
            jQuery('#polljoy_pollview_question_text').html(poll.customMessage);
            jQuery('#polljoy_pollview_reward').hide();

            var button = jQuery('<a href="#">' + poll.thankyouButtonText + '</a>');
            button = methods.setButtonCss(button);
            jQuery('#polljoy_pollview_collect').html(button).click(function()
            {
                methods.hide.apply(thisObject);
            });
            jQuery('#polljoy_pollview_mc_choices').hide();
            jQuery('#polljoy_pollview_openend').hide();
            jQuery('#polljoy_pollview_thankyou').show();
        },
        setCloseButtonLocation: function()
        {
            if (current == -1) {
                var poll = polls[current+1].PollRequest;
            }
            else {
                var poll = polls[current].PollRequest;
            }

            // set close button location
            loc = app.closeButtonLocation;
            offsetX = app.closeButtonOffsetY;
            offsetY = app.closeButtonOffsetX;
            offsetX = offsetX * (jQuery('#polljoy_pollview_main').width() / 1120);
            offsetY = offsetY * (jQuery('#polljoy_pollview_main').width() / 1120);

            if (orientation=='L') {
                jQuery('#polljoy_pollview_close_btn').css('height','10%');
                jQuery('#polljoy_pollview_close_btn').css('width',jQuery('#polljoy_pollview_close_btn').css('height'));
                var padding = parseInt(jQuery('#polljoy_pollview_main').height() * 0.025);
                var totalWidth = (jQuery('#polljoy_pollview_reward_image').width()+jQuery('#polljoy_pollview_reward_earn').width());
                var padding2 = (jQuery('#polljoy_pollview_thumbnail').width() - totalWidth)/2;
                jQuery('#polljoy_pollview_close_btn').css('margin',padding+'px');
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-top',jQuery('.polljoy-pollview-thumbnail').css('margin'));
            }
            else {
                jQuery('#polljoy_pollview_close_btn').css('height','7.5%');
                jQuery('#polljoy_pollview_close_btn').css('width',jQuery('#polljoy_pollview_close_btn').css('height'));
                var padding = parseInt(jQuery('#polljoy_pollview_main').height() * 0.01875);
                var refWidth = (jQuery('#polljoy_pollview_main').width() - jQuery('#polljoy_pollview_thumbnail').width()) /2;
                var totalWidth = (jQuery('#polljoy_pollview_reward_image').width()+jQuery('#polljoy_pollview_reward_earn').width());
                var padding2 = (refWidth - totalWidth)/2;
                jQuery('#polljoy_pollview_close_btn').css('margin',padding+'px');
            }

            if (loc==0){
                jQuery('#polljoy_pollview_close_btn').css('left', offsetX + 'px');
                jQuery('#polljoy_pollview_close_btn').css('top', offsetY + 'px');
                jQuery('#polljoy_pollview_close_btn').css('right','');
                jQuery('#polljoy_pollview_close_btn').css('float','left');

                if (orientation=='L') {
                    var rewardCss = jQuery('#polljoy_pollview_reward').css('cssText');
                    if (jQuery("#polljoy_pollview_reward").is(':hidden')) {
                        jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt(jQuery('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important; display:none');
                    }
                    else {
                        jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt(jQuery('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important;');
                    }
                    jQuery('#polljoy_pollview_reward').css('left','auto');
                    jQuery('#polljoy_pollview_reward').css('right',padding2+'px');
                    jQuery('#polljoy_pollview_reward').css('width',totalWidth+'px');
                    jQuery('#polljoy_pollview_reward').css('top','auto');
                    jQuery('.polljoy-pollview-thumbnail-landscape').css('cssText','float: right !important;');
                    if (poll.type == 'I') {
                        jQuery('#polljoy_pollview_question').css('cssText','float: right !important; right: 0% !important;');
                    }
                    else {
                        jQuery('#polljoy_pollview_question').css('cssText','float: left !important; left: 0% !important; right: auto !important;');
                    }

                    jQuery('#polljoy_pollview_answer').css('cssText','float: left !important; right: auto !important;');

                }
                else {
                    jQuery('#polljoy_pollview_reward').css('left','auto');
                    jQuery('#polljoy_pollview_reward').css('width',totalWidth+'px');
                    jQuery('#polljoy_pollview_reward').css('right',padding2+'px');
                    jQuery('.polljoy-pollview-thumbnail-landscape').css('float','');
                    jQuery('#polljoy_pollview_question').css('cssText','');
                    jQuery('#polljoy_pollview_answer').css('cssText','');
                }
            }
            else {
                jQuery('#polljoy_pollview_close_btn').css('right', offsetX + 'px');
                jQuery('#polljoy_pollview_close_btn').css('top', offsetY + 'px');
                jQuery('#polljoy_pollview_close_btn').css('left','');
                jQuery('#polljoy_pollview_close_btn').css('float','right');

                if (orientation=='L') {
                    if (jQuery("#polljoy_pollview_reward").is(':hidden')) {
                        jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt(jQuery('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important; display:none');
                    }
                    else {
                        jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt(jQuery('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important;');
                    }
                    // TODO: jQuery('#polljoy_pollview_reward').css('left',padding2+'px');
                    jQuery('#polljoy_pollview_reward').css('left',(padding2 /2 )+'px');
                    jQuery('#polljoy_pollview_reward').css('right','auto');
                    jQuery('#polljoy_pollview_reward').css('width',totalWidth+'px');
                    jQuery('#polljoy_pollview_reward').css('top','auto');
                    jQuery('.polljoy-pollview-thumbnail-landscape').css('cssText','float: left !important;');
                    jQuery('#polljoy_pollview_question').css('cssText','float: right !important; right: 0% !important;');
                    jQuery('#polljoy_pollview_answer').css('cssText','float: right !important; right: 0% !important;');
                }
                else {
                    //jQuery('#polljoy_pollview_reward').css('left',padding2+'px');
                    jQuery('#polljoy_pollview_reward').css('left',(padding2/2)+'px');
                    jQuery('#polljoy_pollview_reward').css('right','auto');
                    jQuery('#polljoy_pollview_reward').css('width',totalWidth+'px');
                    jQuery('.polljoy-pollview-thumbnail-landscape').css('float','');
                    jQuery('#polljoy_pollview_question').css('cssText','');
                    jQuery('#polljoy_pollview_answer').css('cssText','');
                }
            }

            jQuery('#polljoy_pollview_close_btn').css('font-size',jQuery('#polljoy_pollview_close_btn').width()+'px');
            jQuery('#polljoy_pollview_close_btn').css('line-height',jQuery('#polljoy_pollview_close_btn').width()+'px');
        },
        switchOrientation: function()
        {
            if (orientation=='L') {
                jQuery('#polljoy_pollview_overlay').addClass('polljoy-pollview-size-web-landscape');
                jQuery('#polljoy_pollview_background').addClass('polljoy-pollview-inner-web-landscape');
                jQuery('#polljoy_pollview_main').addClass('polljoy-pollview-inner-web-landscape');
                jQuery('#polljoy_pollview_reward').addClass('polljoy-pollview-reward-landscape');
                jQuery('.polljoy-pollview-thumbnail').addClass('polljoy-pollview-thumbnail-landscape');
                jQuery('.polljoy-pollview-row-question').addClass('polljoy-pollview-row-question-landscape');
                jQuery('.polljoy-pollview-answer').addClass('polljoy-pollview-answer-landscape');
                jQuery('.polljoy-pollview-row-button').addClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-openend').addClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-submit').addClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-collect').addClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-thankyou').addClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-collect').addClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-reward').addClass('polljoy-pollview-reward-landscape');
                if (jQuery("#polljoy_pollview_reward").is(':hidden')) {
                    jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt(jQuery('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important; display:none');
                }
                else {
                    jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt(jQuery('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important;');
                }

                jQuery('.polljoy-pollview-row-question-landscape').css('fontSize','1.2em');
                jQuery('.polljoy-pollview-row-question-landscape').css('width',jQuery('#polljoy_pollview').width() - jQuery('.polljoy-pollview-thumbnail-landscape').width() - parseInt(jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-left',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-right',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('width',jQuery('#polljoy_pollview').width() - jQuery('.polljoy-pollview-thumbnail-landscape').width() - parseInt(jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
                jQuery('.polljoy-pollview-answer-landscape').css('margin-left',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('margin-right',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('bottom',(parseInt(jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'))/2)+'px');
                jQuery('.polljoy-pollview-row-button-landscape').css('padding-bottom',jQuery('#polljoy_pollview').height() * 0.025);
                jQuery('.polljoy-pollview-row-button-landscape').css('height','25.5%');
                jQuery('#polljoy_pollview_row_openend').css('height','');
            }
            else {
                jQuery('.polljoy-pollview-row-button-landscape').css('cssText','');
                jQuery('#polljoy_pollview_overlay').removeClass('polljoy-pollview-size-web-landscape');
                jQuery('#polljoy_pollview_background').removeClass('polljoy-pollview-inner-web-landscape');
                jQuery('#polljoy_pollview_main').removeClass('polljoy-pollview-inner-web-landscape');
                jQuery('#polljoy_pollview_reward').removeClass('polljoy-pollview-reward-landscape');
                jQuery('.polljoy-pollview-thumbnail').removeClass('polljoy-pollview-thumbnail-landscape');
                jQuery('.polljoy-pollview-row-question').removeClass('polljoy-pollview-row-question-landscape');
                jQuery('.polljoy-pollview-answer').removeClass('polljoy-pollview-answer-landscape');
                jQuery('.polljoy-pollview-row-button').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-openend').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-submit').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-collect').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-thankyou').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-collect').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-reward').removeClass('polljoy-pollview-reward-landscape');
                jQuery('#polljoy_pollview_reward').css('bottom','');
                jQuery('.polljoy-pollview-thumbnail').css('float','');
                jQuery('#polljoy_pollview_question').css('cssText','');
                jQuery('#polljoy_pollview_answer').css('cssText','');
                //setCloseButtonLocation();
            }
        },
        layoutView: function()
        {
            if (current == -1) {
                var poll = polls[current+1].PollRequest;
            }
            else {
                var poll = polls[current].PollRequest;
            }

            // close button
            if (orientation=='P') {
                jQuery('#polljoy_pollview_close_btn').css('height','3.75%');
                jQuery('#polljoy_pollview_close_btn').css('width',jQuery('#polljoy_pollview_close_btn').css('height'));
                var padding = parseInt(jQuery('#polljoy_pollview_main').height() * 0.01875);
                jQuery('#polljoy_pollview_close_btn').css('margin',padding+'px');
            }
            else {
                jQuery('#polljoy_pollview_close_btn').css('height','5%');
                jQuery('#polljoy_pollview_close_btn').css('width',jQuery('#polljoy_pollview_close_btn').css('height'));
                var padding = parseInt(jQuery('#polljoy_pollview_main').height() * 0.025);
                jQuery('#polljoy_pollview').css('margin',padding+'px');
            }

            // set close button location
            methods.setCloseButtonLocation.apply(thisObject);

            // poll image
            if (orientation=='P') {
                jQuery('.polljoy-pollview-thumbnail').show();
                jQuery('.polljoy-pollview-thumbnail').css('height','21.88%');
                jQuery('.polljoy-pollview-thumbnail').css('width',jQuery('.polljoy-pollview-thumbnail').css('height'));
                var padding = parseInt(jQuery('#polljoy_pollview_main').height() * 0.0469);
                jQuery('.polljoy-pollview-thumbnail').css('margin-top',padding+'px');
                jQuery('.polljoy-pollview-thumbnail').css('margin-bottom','0');
                jQuery('.polljoy-pollview-thumbnail').css('margin-left','auto');
                jQuery('.polljoy-pollview-thumbnail').css('margin-right','auto');
            }
            else {
                jQuery('.polljoy-pollview-thumbnail').show();
                jQuery('.polljoy-pollview-thumbnail').css('height','29.167%');
                jQuery('.polljoy-pollview-thumbnail').css('width',jQuery('.polljoy-pollview-thumbnail').css('height'));
                var padding = parseInt(jQuery('#polljoy_pollview_main').height() * 0.05);
                jQuery('.polljoy-pollview-thumbnail').css('margin',padding+'px');
            }

            // question & answer
            if (orientation=='L') {
                jQuery('.polljoy-pollview-row-question-landscape').css('fontSize','1.2em');
                jQuery('.polljoy-pollview-row-question-landscape').css('width',jQuery('#polljoy_pollview_main').width() - jQuery('.polljoy-pollview-thumbnail-landscape').width() - parseInt(jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-left',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-right',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('width',jQuery('#polljoy_pollview_main').width() - jQuery('.polljoy-pollview-thumbnail-landscape').width() - parseInt(jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
                jQuery('.polljoy-pollview-answer-landscape').css('margin-left',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('margin-right',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('bottom',(parseInt(jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'))/2)+'px');
                jQuery('.polljoy-pollview-row-button-landscape').css('padding-bottom',jQuery('#polljoy_pollview_main').height() * 0.025);
                jQuery('.polljoy-pollview-row-button-landscape').css('height','25.5%');
                jQuery('#polljoy_pollview_row_openend').css('height','');
                jQuery('#polljoy_pollview_row_thankyou').css('height','');
                jQuery('#polljoy_pollview_openend_asnwer').css('height',jQuery('#polljoy_pollview_answer').height()*0.6374);
            }
            else {
                jQuery('.polljoy-pollview-row-button-landscape').css('cssText','');
                jQuery('.polljoy-pollview-thumbnail').removeClass('polljoy-pollview-thumbnail-landscape');
                jQuery('.polljoy-pollview-row-question').removeClass('polljoy-pollview-row-question-landscape');
                jQuery('.polljoy-pollview-answer').removeClass('polljoy-pollview-answer-landscape');
                jQuery('.polljoy-pollview-row-button').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-reward').removeClass('polljoy-pollview-reward-landscape');
                jQuery('.polljoy-pollview-row-openend').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-submit').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('.polljoy-pollview-row-collect').removeClass('polljoy-pollview-row-button-landscape');
                jQuery('#polljoy_pollview_reward').css('bottom','');
                jQuery('.polljoy-pollview-thumbnail').css('float','');
                jQuery('#polljoy_pollview_question').css('cssText','');
                if (poll.type=="I") {
                    jQuery('.polljoy-pollview-row-question').css('margin-top',(0.0566 * jQuery('#polljoy_pollview_main').height()) + 'px');
                }
                jQuery('#polljoy_pollview_answer').css('cssText','');
                jQuery('#polljoy_pollview_openend_asnwer').css('height',jQuery('#polljoy_pollview_answer').height()*0.6374);
            }

            // reward image
            if (orientation=='P') {
                var width=jQuery('#polljoy_pollview_main').height() * 0.0313 * 2;
                jQuery('#polljoy_pollview_reward_image').css('width',width+'px');
                jQuery('#polljoy_pollview_reward_image').height(jQuery('#polljoy_pollview_reward_image').css('width'));
                jQuery('#polljoy_pollview_reward_image2').width(jQuery('#polljoy_pollview_reward_image').css('width'));
                jQuery('#polljoy_pollview_reward_image2').height(jQuery('#polljoy_pollview_reward_image').css('height'));
                jQuery('#polljoy_pollview_reward_earn').css('left',(width+2)+'px');
            }
            else {
                var height=jQuery('#polljoy_pollview_main').height()*.06 * 2
                jQuery('#polljoy_pollview_reward_image').css('width',height+'px');
                jQuery('#polljoy_pollview_reward_image').height(jQuery('#polljoy_pollview_reward_image').css('width'));
                jQuery('#polljoy_pollview_reward_image2').width(jQuery('#polljoy_pollview_reward_image').css('width'));
                jQuery('#polljoy_pollview_reward_image2').height(jQuery('#polljoy_pollview_reward_image').css('height'));
                jQuery('#polljoy_pollview_reward_earn').css('left',(height*1.2)+'px');
            }

            // apply custom settings
            jQuery('#polljoy_pollview_question_text').css('color','#' + app.fontColor);
            jQuery('#polljoy_pollview_reward_earn').css('color','#' + app.fontColor);
            jQuery('#polljoy_pollview_reward_earn2').css('color','#' + app.fontColor);
            jQuery('.polljoy-pollview-btn').css('color','#' + app.buttonFontColor);
            jQuery('.polljoy-pollview-ip-confirm-btn').css('color','#' + app.buttonFontColor);
            jQuery('.polljoy-pollview-ip-confirm-btn').css('background','#' + app.buttonColor);

            buttonImageUrl = orientation=='L'?buttonImage_L:buttonImage_P;
            if ((buttonImageUrl !== null) && (buttonImageUrl.length > 0)) {
                jQuery('.polljoy-pollview-btn').css('background-image','url("' + buttonImageUrl +'")');
                jQuery('.polljoy-pollview-btn').css('background-color','transparent');
                jQuery('.polljoy-pollview-btn').css('box-shadow','');
            }
            else {
                jQuery('.polljoy-pollview-btn').css('background','#' + app.buttonColor);
                if (app.buttonShadow==1)
                    jQuery('.polljoy-pollview-btn').css('box-shadow','2px 2px #9E9E9E');
                else
                    jQuery('.polljoy-pollview-btn').css('box-shadow','');
            }

            // image poll
            if (poll.type=='I') {
                if (jQuery("#polljoy_pollview_thankyou").is(':hidden')) {
                    jQuery('.polljoy-pollview-thumbnail').hide();
                    jQuery('#polljoy_pollview_ip_choices').show();

                    if (orientation=="L") {
                        jQuery('.polljoy-pollview-answer-landscape').css('width','100%');
                        jQuery('.polljoy-pollview-answer-landscape').css('height','');
                        jQuery('.polljoy-pollview-answer-landscape').css('margin-left','0');
                        jQuery('.polljoy-pollview-answer-landscape').css('margin-right','0');
                        jQuery('.polljoy-pollview-answer-landscape').css('bottom','0');

                        jQuery('.polljoy-pollview-ip-preview-button').height(jQuery('#polljoy_pollview_main').height() * 0.55);
                        jQuery('.polljoy-pollview-ip-preview-button').width(jQuery('.polljoy-pollview-ip-preview-button').height());
                        var marginV=(jQuery('.polljoy-pollview-answer-landscape').height() - jQuery('.polljoy-pollview-ip-preview-button').height())/2;
                        var marginH=(jQuery('.polljoy-pollview-answer-landscape').width() - 2 * jQuery('.polljoy-pollview-ip-preview-button').width())/3;
                        var marginV2=0.03 * jQuery('.polljoy-pollview-answer-landscape').height();
                        var marginH2=marginV2;
                        jQuery('.polljoy-pollview-ip-preview-button').css('margin-top',marginV+'px');
                        jQuery('.polljoy-pollview-ip-preview-button').css('margin-left',marginH+'px');

                        jQuery('.polljoy-pollview-ip-images-button-container').width(jQuery('.polljoy-pollview-ip-preview-button').width()+marginH2);
                        jQuery('.polljoy-pollview-ip-images-button-container').height(jQuery('.polljoy-pollview-ip-preview-button').height()+marginV2);
                        jQuery('.polljoy-pollview-ip-images-button-container').css('margin-top',marginV+'px');
                        jQuery('.polljoy-pollview-ip-images-button-container').css('margin-left',marginH+'px');

                        var marginV2=0.03 * jQuery('.polljoy-pollview-answer-landscape').height();
                        var marginH2=marginV2;
                        jQuery('.polljoy-pollview-ip-img-button').width(jQuery('.polljoy-pollview-ip-images-button-container').width()/2 - marginV2 - 1);
                        jQuery('.polljoy-pollview-ip-img-button').height(jQuery('.polljoy-pollview-ip-img-button').width());
                        jQuery('.polljoy-pollview-ip-img-button').css('padding-bottom',marginV2+'px');
                        jQuery('.polljoy-pollview-ip-img-button').css('padding-right',marginH2+'px');
                        jQuery('.polljoy-pollview-ip-img-button').css('padding-left', '0');
                        jQuery('#polljoy_pollview_reward').css('cssText','bottom:auto !important;');
                        jQuery('#polljoy_pollview_reward').css('right','auto');
                        jQuery('#polljoy_pollview_reward').css('width','auto');
                        jQuery('#polljoy_pollview_reward').css('top',(jQuery('.polljoy-pollview-thumbnail').width()/2) + 'px');
                        jQuery('#polljoy_pollview_reward').css('left',((jQuery('.polljoy-pollview-thumbnail').width() - jQuery('#polljoy_pollview_reward').width())/2) + 'px');
                        //jQuery('#polljoy_pollview_reward').css('left',((jQuery('.polljoy-pollview-thumbnail').width() - jQuery('#polljoy_pollview_reward').width())) + 'px');

                    }
                    else {
                        jQuery('.polljoy-pollview-answer').css('width','100%');
                        jQuery('.polljoy-pollview-answer').css('margin-left','0');
                        jQuery('.polljoy-pollview-answer').css('margin-right','0');
                        jQuery('.polljoy-pollview-answer').css('bottom','0');
                        jQuery('.polljoy-pollview-answer').css('height','67.4%');

                        jQuery('.polljoy-pollview-ip-preview-button').css('width','60%');
                        jQuery('.polljoy-pollview-ip-preview-button').height(jQuery('.polljoy-pollview-ip-preview-button').width());
                        var marginH=(jQuery('.polljoy-pollview-answer').width() - jQuery('.polljoy-pollview-ip-preview-button').width())/2;
                        jQuery('.polljoy-pollview-ip-preview-button').css('margin-top','0');
                        jQuery('.polljoy-pollview-ip-preview-button').css('margin-left',marginH+'px');
                        jQuery('.polljoy-pollview-ip-preview-button').css('margin-right','auto');

                        jQuery('.polljoy-pollview-ip-images-button-container').width(0.9666 * jQuery('.polljoy-pollview-answer').width());
                        jQuery('.polljoy-pollview-ip-images-button-container').height(0.2 * jQuery('.polljoy-pollview-answer').width());
                        var marginV=(jQuery('.polljoy-pollview-answer').height() - jQuery('.polljoy-pollview-ip-preview-button').height() - 0.2 * jQuery('.polljoy-pollview-answer').width() ) /2;
                        jQuery('.polljoy-pollview-ip-images-button-container').css('margin-top',marginV+'px');
                        jQuery('.polljoy-pollview-ip-images-button-container').css('margin-left',(0.0133 * jQuery('.polljoy-pollview-answer').width())+'px');

                        jQuery('.polljoy-pollview-ip-img-button').width(0.2 * jQuery('.polljoy-pollview-answer').width());
                        jQuery('.polljoy-pollview-ip-img-button').height(jQuery('.polljoy-pollview-ip-img-button').width());
                        var marginH = (jQuery('.polljoy-pollview-ip-images-button-container').width() - poll.choices.length * jQuery('.polljoy-pollview-ip-img-button').width() ) / (poll.choices.length + 1);
                        jQuery('.polljoy-pollview-ip-img-button').css('padding-left', marginH+'px');
                        jQuery('.polljoy-pollview-ip-img-button').css('padding-right', '0');
                        jQuery('.polljoy-pollview-ip-img-button').css('padding-bottom', '0');

                        jQuery('#polljoy_pollview_reward').css('cssText','bottom:auto !important;');
                        jQuery('#polljoy_pollview_reward').css('right','auto');
                        jQuery('#polljoy_pollview_reward').css('width','auto');
                        jQuery('#polljoy_pollview_reward').css('margin-top',((0.2174 *  jQuery('#polljoy_pollview_main').height()) + ((0.1085 * jQuery('#realtime_preview').height()) - jQuery('#realtime_preview_reward').height()) / 2) + 'px');
                        jQuery('#polljoy_pollview_reward').css('margin-left',((jQuery('#polljoy_pollview_main').width() - jQuery('#polljoy_pollview_reward').width())/2) + 'px');
                        //jQuery('#polljoy_pollview_reward').css('margin-left',((jQuery('#polljoy_pollview_main').width() - jQuery('#polljoy_pollview_reward').width())) + 'px');
                    }

                    jQuery('.polljoy-pollview-ip-confirm-btn').css('width','75%');
                    jQuery('.polljoy-pollview-ip-confirm-btn').css('height','25%');
                    jQuery('.polljoy-pollview-ip-confirm-btn').css('margin-left','12.5%');
                    jQuery('.polljoy-pollview-ip-confirm-btn').css('margin-right','auto');
                    jQuery('.polljoy-pollview-ip-confirm-btn').css('margin-top','37.5%');
                    jQuery('.polljoy-pollview-ip-confirm-btn').css('text-decoration', 'none');
                }
            }

            // background & border
            jQuery('#polljoy_pollview_background').css('background','#'+app.backgroundColor);
            jQuery('#polljoy_pollview_background').css('opacity', app.backgroundAlpha/100);
            jQuery('#polljoy_pollview_background').css('filter:', "alpha(opacity=" + app.backgroundAlpha +")");
            jQuery('#polljoy_pollview_background').css('border-radius',app.backgroundCornerRadius + 'px' );
            jQuery('#polljoy_pollview_background').css('border-color', '#' + app.borderColor);
            var frameWidth=jQuery('#polljoy_pollview_main').width()+(2*parseInt(app.borderWidth));
            var frameHeight=jQuery('#polljoy_pollview_main').height()+(2*parseInt(app.borderWidth));
            var borderWidth=parseInt(app.borderWidth)+'px';
            jQuery('#polljoy_pollview_background').css('min-width',frameWidth+'px');
            jQuery('#polljoy_pollview_background').css('min-height',frameHeight+'px');
            jQuery('#polljoy_pollview_background').css('border-width',borderWidth + ' ' + borderWidth + ' ' + borderWidth + ' ' + borderWidth + ' ');

            var canvasImage = orientation=='L'?borderImage_L:borderImage_P;
            if ((canvasImage !== null) && (canvasImage.length > 0)) {
                jQuery('#polljoy_pollview_border_canvas').css('background-image', 'url("'+ canvasImage + '")');
            }
            jQuery('#polljoy_pollview_border_canvas').css('opacity', app.backgroundAlpha/100);
            jQuery('#polljoy_pollview_border_canvas').css('filter:', "alpha(opacity=" + app.backgroundAlpha +")");

            jQuery('#polljoy_pollview_main').css('border-radius',app.backgroundCornerRadius + 'px' );

            // overlay
            jQuery('#polljoy_pollview_overlay_canvas').css('background-color', (app.overlayAlpha==100?'':'#000'));
            jQuery('#polljoy_pollview_overlay_canvas').css('opacity', app.overlayAlpha/100);
            jQuery('#polljoy_pollview_overlay_canvas').css('filter:', "alpha(opacity=" + app.overlayAlpha +")");

            methods.centerThePoll();
        },
        adjustLayoutSize: function()
        {
            if ((viewDeviceName !== '') && ((viewMode == 'landscape') || (viewMode == 'portrait'))) {
                methods.setMobileView();

                return;
            }

            // normal web view
            var minWidth =window.innerWidth;
            var minHeight = window.innerHeight;
            var newFontSize = 32;
            var newWidth = minWidth;
            var newHeight = minHeight;

            if (screen && (screen.width > 980) && (minWidth >= 600) ) {
                orientation = 'L';
                newHeight  = 450;
                newWidth = 600;
                //newHeight  = 192;
                //newWidth = 341;
                do {
                    newHeight = newHeight * 0.99;
                    newWidth = newHeight * (4/3);
                } while ((newHeight > minHeight) || (newWidth > minWidth));

                newFontSize = newFontSize * (newHeight / 600);
            }
            else {
                if (newHeight > newWidth) {
                    orientation = 'P';
                    do {
                        newWidth = newWidth * 0.99;
                        newHeight = newWidth * (4/3);
                    } while ((newHeight > minHeight) || (newWidth > minWidth));

                    newFontSize = newFontSize * (newHeight / 600) * 0.8;
                }
                else {
                    orientation = 'L';
                    do {
                        newHeight = newHeight * 0.99;
                        newWidth = newHeight * (4/3);
                    } while ((newHeight > minHeight) || (newWidth > minWidth));

                    newFontSize = newFontSize * (newHeight / 600);
                }
            }

            jQuery('.pollContainer').css('width',newWidth).css('height',newHeight).css('font-size',newFontSize+'px');

        },
        bindEvents: function()
        {
            jQuery(window).resize(function() {
                methods.adjustLayoutSize.apply(thisObject);
                methods.switchOrientation.apply(thisObject);
                methods.layoutView.apply(thisObject);
                methods.setButtonSize.apply(thisObject);
            });

            jQuery(window).bind('orientationchange', function() {
                methods.adjustLayoutSize.apply(thisObject);
                methods.switchOrientation.apply(thisObject);
                methods.layoutView.apply(thisObject);
                methods.setButtonSize.apply(thisObject);
            });

            timer = setInterval(function() {
                methods.centerThePoll();
            }, 100);
        },
        unbindEvents: function()
        {
            jQuery(window).unbind('resize');
            jQuery(window).unbind('orientationchange');
            clearInterval(timer);
        },
        setMobileView: function() {

            orientation = viewMode.substring(0,1).toUpperCase();
            var deviceName = viewDeviceName + '-' + viewMode;
            var targetInnerClass = 'polljoy-pollview-inner-' + devices[deviceName]['aspectRatio'] + '-' + viewMode;
            var newFontSize = 32;
            var newHeight  = devices[deviceName]['overlaySettings']['height'];
            var newWidth = devices[deviceName]['overlaySettings']['width'];
            newFontSize = newFontSize * (newHeight / 600) * ((orientation == "L")?0.8:1.0);
            jQuery('.pollContainer').css('width',newWidth).css('height',newHeight).css('font-size',newFontSize+'px');

            jQuery('#polljoy_pollview_device').addClass('polljoy-pollview-device');
            jQuery('#polljoy_pollview_device').css(devices[deviceName]['deviceSettings']);
            jQuery('#polljoy_pollview_overlay').css(devices[deviceName]['overlaySettings']);
            jQuery('#polljoy_pollview_border').css('border','1px solid #d6d6d6');
            jQuery('#polljoy_pollview_background').removeClass('polljoy-pollview-inner-web-portrait');
            jQuery('#polljoy_pollview_background').removeClass('polljoy-pollview-inner-web-landscape');
            jQuery('#polljoy_pollview_background').addClass(targetInnerClass);
            jQuery('#polljoy_pollview_main').removeClass('polljoy-pollview-inner-web-portrait');
            jQuery('#polljoy_pollview_main').removeClass('polljoy-pollview-inner-web-landscape');
            jQuery('#polljoy_pollview_main').addClass(targetInnerClass);
        },
        preloadChildPollImages: function(childPolls) {
            var imagePreloadComplete = function(key) {
                jQuery(this).remove();
                loadedImages[key] = true;
                methods.imageLoaded();
            };

            // set preload image queue
            var pollImagesCount=0;
            for(var k in childPolls) {
                if ((childPolls[k].PollRequest.pollImageUrl != null) && (childPolls[k].PollRequest.pollImageUrl.length > 0)){
                    loadedImages["poll-"+(k)+"-Image"] = childPolls[k].PollRequest.pollImageUrl;
                    pollImagesCount++;
                }
                //preload poll reward currency image
                if ((childPolls[k].PollRequest.pollRewardImageUrl != null) && (childPolls[k].PollRequest.pollRewardImageUrl.length > 0)){
                    loadedImages["poll-"+(k)+"-CurrencyImage"] = childPolls[k].PollRequest.pollRewardImageUrl;
                    pollImagesCount++;
                }

                //preload image poll images
                if (childPolls[k].PollRequest.type == "I"){
                    for (var j = 0; j < childPolls[k].PollRequest.choices.length; j++) {
                        loadedImages["poll-"+(k)+"-ChoiceImage"+(j+1).toString()] = childPolls[k].PollRequest.choiceImageUrl[childPolls[k].PollRequest.choices[j]];
                        pollImagesCount++;
                    }
                }

                if (childPolls[k].PollRequest.childPolls !== 'undefined') {
                    if (childPolls[k].PollRequest.childPolls !== null) {
                        methods.preloadChildPollImages(childPolls[k].PollRequest.childPolls);
                    }
                }
            };

            //preload poll images
            for(var k in childPolls) {
                if ((childPolls[k].PollRequest.pollImageUrl != null) && (childPolls[k].PollRequest.pollImageUrl.length > 0)){
                    jQuery('<img/>').attr('src', childPolls[k].PollRequest.pollImageUrl).load(imagePreloadComplete("poll-"+(k)+"-Image"));
                }
                //preload poll reward currency image
                if ((childPolls[k].PollRequest.pollRewardImageUrl != null) && (childPolls[k].PollRequest.pollRewardImageUrl.length > 0)){
                    jQuery('<img/>').attr('src', childPolls[k].PollRequest.pollRewardImageUrl).load(imagePreloadComplete("poll-"+(k)+"-CurrencyImage"));
                }

                //preload image poll images
                if (childPolls[k].PollRequest.type == "I"){
                    for (var j = 0; j < childPolls[k].PollRequest.choices.length; j++) {
                        jQuery('<img/>').attr('src', childPolls[k].PollRequest.choiceImageUrl[childPolls[k].PollRequest.choices[j]]).load(imagePreloadComplete("poll-"+(k)+"-ChoiceImage"+(j+1).toString()));
                    }
                }
            };
        },
        showThankyouMsg: function(target) {
            var poll = polls[current].PollRequest;
            var reward = parseInt(poll.virtualAmount);

            if (poll.type == "I") {
                $('#polljoy_pollview_ip_preview_button').css('background-image','');
                if (reward > 0) {
                    var rewardImgUrl = $('#polljoy_pollview_reward_image').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
                    $('#polljoy_pollview_ip_confirm_button').html('<div style="display:table-cell; vertical-align: middle">'+'<div style="float:left"><img id="polljoy_pollview_message_reward_image" src="' +  rewardImgUrl +  '" style="vertical-align: middle; height: 65%; width:65%; float:right "></div><div style="text-align: left; padding-left: 5px;vertical-align: middle; display: table-cell;">' + poll.virtualAmount + "<br>" + poll.collectMsgText+'</div></div>');
                    if (customSound!=null) customSound.play();
                }
                else {
                    $('#polljoy_pollview_ip_confirm_button').html('<div style="display:table-cell; vertical-align: middle">'+poll.thankyouMsgText+'</div>');
                }
                jQuery('.polljoy-pollview-ip-confirm-btn').css('background','');
                jQuery('.polljoy-pollview-ip-confirm-btn').css('color','#' + app.fontColor);
            }
            else {
                var msg = '<div class="polljoy-pollview-btn center-block" id="polljoy_pollview_message_button" style="color: #' + app.fontColor + '; background-color: transparent;">'
                msg += '</div>';
                msgToShow = jQuery(msg);

                if (reward > 0) {
                    var rewardImgUrl = $('#polljoy_pollview_reward_image').css('background-image').replace(/^url\(['"]?/,'').replace(/['"]?\)$/,'');
                    // collect msg
                    msgToShow.html('<img id="polljoy_pollview_message_reward_image" src="' +  rewardImgUrl +  '" style="vertical-align: middle; height: 80%">' + ' ' + poll.virtualAmount + ((poll.type == "I")?"<br>":" ") + poll.collectMsgText);
                    if (customSound!=null) customSound.play();
                }
                else {
                    // thank you msg
                    msgToShow.html(poll.thankyouMsgText);
                }

                target.parent().append(msgToShow);
                target.hide();
            }

            // disabe all other input
            jQuery('#polljoy_pollview_close_btn').hide()
            jQuery('#polljoy_pollview_reward').hide()
            jQuery("[id*=_button]").each(function() {
               jQuery(this).unbind('click');
            });
            jQuery('#polljoy_pollview_overlay_canvas').unbind('click');
            jQuery('#polljoy_pollview_border_canvas').unbind('click');

            if ((reward > 0) || (typeof(polls[current + 1]) == 'undefined'))
            {
                // open external URL
                setTimeout( function() {

                    // move to next poll
                    if (typeof(polls[current + 1]) == 'undefined') {
                       methods.hide.apply(thisObject);
                    }
                    else {
                        methods.drawNextQuestion(thisObject);
                    }

                    if (poll.type === "I") {
                        $('#polljoy_pollview_ip_confirm_button').html('<div style="display:table-cell; vertical-align: middle">Confirm</div>');
                    }
                    else  {
                        target.show();
                        msgToShow.remove();
                    }

                    var targetUrls=poll.choiceUrl;
                    console.log(poll);
                    if ((poll.type === 'M') || (poll.type === 'I'))
                    {
                        if ((targetUrls[response]['web'] !== null) && (targetUrls[response]['web'].length > 0))
                        {
                            window.open(targetUrls[response]['web'], '_blank');
                        }
                    }
                }, msgShowTime *1000);
            }
            else {
                if (typeof(polls[current + 1]) == 'undefined') {
                   methods.hide.apply(thisObject);
                }
                else {
                    methods.drawNextQuestion(thisObject);
                }

                if (poll.type === "I") {
                    $('#polljoy_pollview_ip_confirm_button').html('<div style="display:table-cell; vertical-align: middle">Confirm</div>');
                }
                else  {
                    target.show();
                    msgToShow.remove();
                }
            }
        }
    };

    $.fn.polljoy = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.polljoy');
        }
    };

    /* Return the function and then it will be defined as module or populated to the window object. */
    return function(method)
    {
        var div = jQuery('#polljoy_poll');
        if (div.length === 0)
        {
            var cssLink='<link rel="stylesheet" type="text/css" href="https://res.polljoy.com/css/PJPollview.css">';
            jQuery('head').append(cssLink);
            jQuery('body').append('<div id="polljoy_poll"></div>');
        }

        jQuery('#polljoy_poll')
                .css('position', 'fixed')
                .css('width', '100%')
                .css('height', '100%')
                .css('top', '0')
                .css('left', '0')
                .css('display', 'none')
                .css('z-index', '1000');
        jQuery('#polljoy_poll').polljoy(method);

    }

});
