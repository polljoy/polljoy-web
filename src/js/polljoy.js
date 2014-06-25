(function($) {
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

    var methods = {
        init: function init(configuration)
        {
            thisObject = this;
            connector = configuration.endPoint;
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
				
            $(thisObject).html('');
            methods.initPoll.apply(thisObject);
        },
        initPoll: function()
        {
            var registerSesson = $.ajax({
                url: connector + '?register=true',
                type: 'post',
                async: false,
                dataType: 'json',
                data: {deviceId: deviceId}
            }).responseText;

            var response = $.parseJSON(registerSesson);
            if (response.status === 1)
            {
                console.log('registerSession.json returned error!');
                return false;
            }

            app = response.app;

            background = response.app.backgroundColor;
            border = response.app.borderColor;
            font = response.app.fontColor;
            buttonColor = response.app.buttonColor;

            sessionId = response.app.sessionId;
            /*now get the polls for this app*/
            /*url: connector + 'smartget.json',*/
            var smartget = $.ajax({
                url: connector + '?sg=true',
                type: 'post',
                async: false,
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
            }).responseText;

            var sgResponse = $.parseJSON(smartget);

            polls = sgResponse.polls;

            if (typeof polls !== 'undefined' && polls.length > 0)
            {
                if (typeof PJPollIsReady === 'function')
                {
                    PJPollIsReady(polls);
                }
            }
            else
            {
                if (typeof PJPollNotAvailable === 'function')
                {
                    PJPollNotAvailable(sgResponse.status);
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

            if (typeof PJPollDidShow === 'function')
            {
                PJPollDidShow(poll);
            }

            methods.bindEvents.apply(thisObject);
        },
        hide: function()
        {
            var c = current;
            if (c < 0)
                c = 0;
            $('#polljoy_poll').fadeOut(100);//css('display', 'none');

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
            }
        },
        centerThePoll: function()
        {
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

            $('#polljoy_poll').fadeIn(100);

            if (typeof polls === 'undefined' || polls.length === 0)
            {
                return false;
            }
            if (!container)
            {
                $.get('https://res.polljoy.com/PJPollview.php', function(data){
                    container = $(data);
                    $(thisObject).html('');
                    $(thisObject).append(container);
                    methods.adjustLayoutSize.apply(thisObject);
                    methods.switchOrientation.apply(thisObject);
                    methods.layoutView.apply(thisObject);
                    methods.drawNextQuestion.apply(thisObject);
                });
            }
            else
            {
                $(container).css('display', 'block');
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
                    var button = $('<a href="#">' + poll.collectButtonText + '</a>');

                    button = methods.setButtonCss(button);
                    jQuery('#polljoy_pollview_collect').html(button).click(function(e)
                    {
                        methods.drawNextQuestion.apply(thisObject);
                    });
                    jQuery('#polljoy_pollview_mc_choices').hide();
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
                    var button = $('<a href="#">' + poll.collectButtonText + '</a>');
                }
                else
                {
                    var button = $('<a href="#">' + poll.thankyouButtonText + '</a>');
                }

                button = methods.setButtonCss(button);
                jQuery('#polljoy_pollview_collect').html(button).click(function()
                {
                    methods.hide.apply(thisObject);
                });
                jQuery('#polljoy_pollview_mc_choices').hide();
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
                if ((poll.app.closeButtonImageUrl !== null) && (poll.app.closeButtonImageUrl.length > 0)) {
                    jQuery('#polljoy_pollview_close_btn').css('background-image','url("'+poll.app.closeButtonImageUrl+'")');
                    jQuery('#polljoy_pollview_close_btn').css('color','transparent');
                }
                else {
                    jQuery('#polljoy_pollview_close_btn').css('background-image','');
                    jQuery('#polljoy_pollview_close_btn').css('color','#'+poll.app.fontColor);
                }

                jQuery('#polljoy_pollview_close_btn').unbind('click');
                var next = jQuery('#polljoy_pollview_close_btn')
                    .click(function(e)
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

                        $.ajax({
                            url: connector + '?response=true&token=' + poll.pollToken,
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
                    });
            }

            var reward = parseInt(poll.virtualAmount);
            if (reward > 0)
            {
                if ((poll.pollRewardImageUrl !== null) && (poll.pollRewardImageUrl.length > 0)) {
                    jQuery('#polljoy_pollview_reward_image').css('background-image','url("'+poll.pollRewardImageUrl+'")');
                    jQuery('#polljoy_pollview_reward_image2').css('background-image','url("'+poll.pollRewardImageUrl+'")');
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
                    .html($('<textarea required="required"></textarea>')
                        .css('display', 'block')
                        .css('color', '#000')
                        .css('background', '#fff')
                        .css('width', '100%')
                        .css('height','100%')
                        .css('resize','none')
                        .css('border','#000 1px solid')
                        .css('padding','5px')
                        .css('margin','0')
                    );

                jQuery('#polljoy_pollview_mc_choices').hide();
                jQuery('#polljoy_pollview_openend').show();
                jQuery('#polljoy_pollview_thankyou').hide();

                var submit = $('<a href="#">' + poll.submitButtonText + '</a>');
                submit = methods.setButtonCss(submit);
                jQuery('#polljoy_pollview_submit').unbind( 'click' );
                jQuery('#polljoy_pollview_submit').html(submit).click(function()
                {
                    methods.submitCurrentPoll.apply(thisObject);
                });
            }
            else
            {
                var choices = poll.choices;
                var offset = 4 - poll.choices.length;
                var deltaAdjust = orientation == 'L' ? 0.5: 0;

                // hide all button then relayout
                $("[id^='polljoy_pollview_row_button']").each(function() {
                    $(this).hide();
                });

                jQuery('#polljoy_pollview_mc_choices').css('height',(deltaAdjust + poll.choices.length*(100/4)) + '%');
                $('.polljoy-pollview-row-button').css('height',(deltaAdjust + 100/poll.choices.length) + '%');

                $(choices).each(function(k, v)
                {
                    var button = $('<a href="#">' + v + '</a>');
                    var thisButton='polljoy_pollview_button' + offset;
                    button = methods.setButtonCss(button);
                    jQuery('#'+thisButton).html(button).unbind( 'click' );
                    jQuery('#'+thisButton).html(button).click(function(e)
                    {
                        e.preventDefault();
                        $(container).find('a').removeClass('selected');
                        $(button).addClass('selected');
                        methods.submitCurrentPoll.apply(thisObject);
                    });
                    jQuery('#polljoy_pollview_row_button' + offset).show();
                    offset++;
                });
                jQuery('#polljoy_pollview_mc_choices').show();
                jQuery('#polljoy_pollview_openend').hide();
                jQuery('#polljoy_pollview_thankyou').hide();
            }
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
            $("[id^='polljoy_pollview_row_button']").each(function() {
                $(this).hide();
            });

            jQuery('#polljoy_pollview_mc_choices').css('height',(deltaAdjust + poll.choices.length*(100/4)) + '%');
            jQuery('#polljoy_pollview_mc_choices').css('max-height',(deltaAdjust + poll.choices.length*(100/4)) + '%');
            jQuery('.polljoy-pollview-row-button').css('max-height',(deltaAdjust + 100/poll.choices.length) + '%');
            jQuery('.polljoy-pollview-row-button').css('height',(deltaAdjust + 100/poll.choices.length) + '%');

            $(choices).each(function(k, v)
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
                alert('You have to fill this field');
                return false;
            }

            if (poll.type === 'T')
            {
                response = container.find('textarea').val();
            }
            else
            {
                response = container.find('.selected').html();
            }

            if (typeof PJPollDidResponded === 'function')
            {
                poll.response = response;
                PJPollDidResponded(poll);
            }

            $.ajax({
                url: connector + '?response=true&token=' + poll.pollToken,
                type: 'post',
                async: true,
                dataType: 'json',
                data: {
                    sessionId: sessionId,
                    response: response,
                    deviceId: deviceId
                }
            });

            methods.drawFinaliseQuestion.apply(thisObject);

            // open external URL
            var targetUrls=poll.choiceUrl;
            if (poll.type === 'M')
            {
                if ((targetUrls[response]['web'] !== null) && (targetUrls[response]['web'].length > 0))
                {
                    window.open(targetUrls[response]['web'], '_blank');
                }
            }
        },
        finish: function()
        {
            var poll = polls[current - 1].PollRequest;
            jQuery('#polljoy_pollview_question_text').html(poll.customMessage);
            jQuery('#polljoy_pollview_reward').hide();

            var button = $('<a href="#">' + poll.thankyouButtonText + '</a>');
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
            // set close button location
            loc = app.closeButtonLocation;
            offsetX = app.closeButtonOffsetY;
            offsetY = app.closeButtonOffsetX;
            offsetX = offsetX * (jQuery('#polljoy_pollview_main').width() / 1120);
            //offsetY = offsetY * (jQuery('#polljoy_pollview_main').height() / 1500);
            offsetY = offsetY * (jQuery('#polljoy_pollview_main').width() / 1120);

            if (orientation=='L') {
                jQuery('#polljoy_pollview_close_btn').css('height','5%');
                jQuery('#polljoy_pollview_close_btn').css('width',jQuery('#polljoy_pollview_close_btn').css('height'));
                var padding = parseInt($('#polljoy_pollview_main').height() * 0.025);
                var totalWidth = (jQuery('#polljoy_pollview_reward_image').width()+jQuery('#polljoy_pollview_reward_earn').width());
                var padding2 = (jQuery('#polljoy_pollview_thumbnail').width() - totalWidth)/2;
                jQuery('#polljoy_pollview_close_btn').css('margin',padding+'px');
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-top',jQuery('.polljoy-pollview-thumbnail').css('margin'));
            }
            else {
                jQuery('#polljoy_pollview_close_btn').css('height','3.75%');
                jQuery('#polljoy_pollview_close_btn').css('width',jQuery('#polljoy_pollview_close_btn').css('height'));
                var padding = parseInt(jQuery('#polljoy_pollview_main').height() * 0.01875);
                var refWidth = (jQuery('#polljoy_pollview_main').width() - jQuery('#polljoy_pollview_thumbnail').width()) /2;
                var totalWidth = (jQuery('#polljoy_pollview_reward_image').width()+jQuery('#polljoy_pollview_reward_earn').width());
                var padding2 = (refWidth - totalWidth)/2;
                jQuery('#polljoy_pollview_close_btn').css('margin',padding+'px');
            }

            if (loc==0) {
                jQuery('#polljoy_pollview_close_btn').css('left', offsetX + 'px');
                jQuery('#polljoy_pollview_close_btn').css('top', offsetY + 'px');
                jQuery('#polljoy_pollview_close_btn').css('right','');
                jQuery('#polljoy_pollview_close_btn').css('float','left');

                if (orientation=='L') {
                    var rewardCss = $('#polljoy_pollview_reward').css('cssText');
                    if ($("#polljoy_pollview_reward").is(':hidden')) {
                        $('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt($('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important; display:none');
                    }
                    else {
                        $('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt($('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important;');
                    }
                    jQuery('#polljoy_pollview_reward').css('left','auto');
                    jQuery('#polljoy_pollview_reward').css('right',padding2+'px');
                    jQuery('#polljoy_pollview_reward').css('width',totalWidth+'px');
                    jQuery('#polljoy_pollview_reward').css('top','auto');
                    jQuery('.polljoy-pollview-thumbnail-landscape').css('cssText','float: right !important;');
                    jQuery('#polljoy_pollview_question').css('cssText','float: left !important; left: 0% !important; right: auto !important;');
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
                    if ($("#polljoy_pollview_reward").is(':hidden')) {
                        $('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt($('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important; display:none');
                    }
                    else {
                        $('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt($('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important;');
                    }
                    jQuery('#polljoy_pollview_reward').css('left',padding2+'px');
                    jQuery('#polljoy_pollview_reward').css('right','auto');
                    jQuery('#polljoy_pollview_reward').css('width',totalWidth+'px');
                    jQuery('#polljoy_pollview_reward').css('top','auto');
                    jQuery('.polljoy-pollview-thumbnail-landscape').css('cssText','float: left !important;');
                    jQuery('#polljoy_pollview_question').css('cssText','float: right !important; right: 0% !important;');
                    jQuery('#polljoy_pollview_answer').css('cssText','float: right !important; right: 0% !important;');
                }
                else {
                    jQuery('#polljoy_pollview_reward').css('left',padding2+'px');
                    jQuery('#polljoy_pollview_reward').css('right','auto');
                    jQuery('#polljoy_pollview_reward').css('width',totalWidth+'px');
                    jQuery('.polljoy-pollview-thumbnail-landscape').css('float','');
                    jQuery('#polljoy_pollview_question').css('cssText','');
                    jQuery('#polljoy_pollview_answer').css('cssText','');
                }
            }

            jQuery('#polljoy_pollview_close_btn').css('font-size',jQuery('#polljoy_pollview_close_btn').width()+'px');
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
                    jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt($('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important; display:none');
                }
                else {
                    jQuery('#polljoy_pollview_reward').css('cssText', 'bottom: ' + (parseInt(parseInt($('#polljoy_pollview_answer').css('height'))/2)-5) + 'px !important;');
                }

                jQuery('.polljoy-pollview-row-question-landscape').css('fontSize','1.2em');
                jQuery('.polljoy-pollview-row-question-landscape').css('width',$('#polljoy_pollview').width() - $('.polljoy-pollview-thumbnail-landscape').width() - parseInt($('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-left',$('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-right',$('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('width',$('#polljoy_pollview').width() - $('.polljoy-pollview-thumbnail-landscape').width() - parseInt($('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
                jQuery('.polljoy-pollview-answer-landscape').css('margin-left',$('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('margin-right',$('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('bottom',(parseInt($('.polljoy-pollview-thumbnail-landscape').css('margin-left'))/2)+'px');
                jQuery('.polljoy-pollview-row-button-landscape').css('padding-bottom',$('#polljoy_pollview').height() * 0.025);
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
                jQuery('.polljoy-pollview-thumbnail').css('height','21.88%');
                jQuery('.polljoy-pollview-thumbnail').css('width',jQuery('.polljoy-pollview-thumbnail').css('height'));
                var padding = parseInt($('#polljoy_pollview_main').height() * 0.0469);
                jQuery('.polljoy-pollview-thumbnail').css('margin-top',padding+'px');
                jQuery('.polljoy-pollview-thumbnail').css('margin-bottom','0');
                jQuery('.polljoy-pollview-thumbnail').css('margin-left','auto');
                jQuery('.polljoy-pollview-thumbnail').css('margin-right','auto');
            }
            else {
                jQuery('.polljoy-pollview-thumbnail').css('height','29.167%');
                jQuery('.polljoy-pollview-thumbnail').css('width',jQuery('.polljoy-pollview-thumbnail').css('height'));
                var padding = parseInt($('#polljoy_pollview_main').height() * 0.05);
                jQuery('.polljoy-pollview-thumbnail').css('margin',padding+'px');
            }
            
            // question & answer
            if (orientation=='L') {
                jQuery('.polljoy-pollview-row-question-landscape').css('fontSize','1.2em');
                jQuery('.polljoy-pollview-row-question-landscape').css('width',jQuery('#polljoy_pollview_main').width() - $('.polljoy-pollview-thumbnail-landscape').width() - parseInt($('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-left',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-row-question-landscape').css('margin-right',jQuery('.polljoy-pollview-thumbnail-landscape').css('margin-left'));
                jQuery('.polljoy-pollview-answer-landscape').css('width',jQuery('#polljoy_pollview_main').width() - $('.polljoy-pollview-thumbnail-landscape').width() - parseInt($('.polljoy-pollview-thumbnail-landscape').css('margin-left')) * 3 +'px');
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
                jQuery('#polljoy_pollview_answer').css('cssText','');
                jQuery('#polljoy_pollview_openend_asnwer').css('height',jQuery('#polljoy_pollview_answer').height()*0.6374);
            }

            // reward image
            if (orientation=='P') {
                var width=$('#polljoy_pollview_main').height() * 0.0313;
                $('#polljoy_pollview_reward_image').css('width',width+'px');
                $('#polljoy_pollview_reward_image').height($('#polljoy_pollview_reward_image').css('width'));
                $('#polljoy_pollview_reward_image2').width($('#polljoy_pollview_reward_image').css('width'));
                $('#polljoy_pollview_reward_image2').height($('#polljoy_pollview_reward_image').css('height'));
                $('#polljoy_pollview_reward_earn').css('left',(width+2)+'px');
            }
            else {
                var height=$('#polljoy_pollview_main').height()*.06
                $('#polljoy_pollview_reward_image').css('width',height+'px');
                $('#polljoy_pollview_reward_image').height($('#polljoy_pollview_reward_image').css('width'));
                $('#polljoy_pollview_reward_image2').width($('#polljoy_pollview_reward_image').css('width'));
                $('#polljoy_pollview_reward_image2').height($('#polljoy_pollview_reward_image').css('height'));
                $('#polljoy_pollview_reward_earn').css('left',(height*1.2)+'px');
            }
            
            // apply custom settings
            jQuery('#polljoy_pollview_question_text').css('color','#' + app.fontColor);
            jQuery('#polljoy_pollview_reward_earn').css('color','#' + app.fontColor);
            jQuery('#polljoy_pollview_reward_earn2').css('color','#' + app.fontColor);
            jQuery('.polljoy-pollview-btn').css('color','#' + app.buttonFontColor);

            buttonImageUrl = orientation=='L'?app.buttonImageUrl_4x3_L:app.buttonImageUrl_4x3_P;

            if ((buttonImageUrl !== null) && (buttonImageUrl.length > 0)) {
                jQuery('.polljoy-pollview-btn').css('background-image','url("' + buttonImageUrl +'")');
                jQuery('.polljoy-pollview-btn').css('background-color','transparent');
                jQuery('.polljoy-pollview-btn').css('box-shadow','');
            }
            else {
                jQuery('.polljoy-pollview-btn').css('background','#' + app.buttonColor);
                if (app.buttonShadow==1)
                    $('.polljoy-pollview-btn').css('box-shadow','2px 2px #9E9E9E');
                else
                    $('.polljoy-pollview-btn').css('box-shadow','');
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

            var canvasImage = orientation=='L'?app.borderImageUrl_4x3_L:app.borderImageUrl_4x3_P;
            if ((canvasImage !== null) && (canvasImage.length > 0)) {
                jQuery('#polljoy_pollview_border_canvas').css('background-image', 'url("'+ canvasImage + '")');
            }
            jQuery('#polljoy_pollview_border_canvas').css('opacity', app.backgroundAlpha/100);
            jQuery('#polljoy_pollview_border_canvas').css('filter:', "alpha(opacity=" + app.backgroundAlpha +")");

            jQuery('#polljoy_pollview_main').css('border-radius',app.backgroundCornerRadius + 'px' );

            // overlay
            jQuery('#polljoy_pollview_overlay_canvas').css('background-color', (app.overlayAlpha==100?'':'#FFF'));
            jQuery('#polljoy_pollview_overlay_canvas').css('opacity', app.overlayAlpha/100);
            jQuery('#polljoy_pollview_overlay_canvas').css('filter:', "alpha(opacity=" + app.overlayAlpha +")");

            methods.centerThePoll();
        },
        adjustLayoutSize: function()
        {
            var minWidth =window.innerWidth;
            var minHeight = window.innerHeight;
            var newFontSize = 32;
            var newWidth = minWidth;
            var newHeight = minHeight;

            if (screen && (screen.width > 980) && (minWidth >= 800) ) {
                orientation = 'L';
                newHeight  = 600;
                newWidth = 800;
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
            $(window).resize(function() {
                methods.adjustLayoutSize.apply(thisObject);
                methods.switchOrientation.apply(thisObject);
                methods.layoutView.apply(thisObject);
                methods.setButtonSize.apply(thisObject);
            });

            $(window).bind('orientationchange', function() {
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
            $(window).unbind('resize');
            $(window).unbind('orientationchange');
            clearInterval(timer); 
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

})(jQuery);

function polljoy(method)
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
