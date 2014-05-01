(function($) {


    var connector = '';
    var background = '';
    var border = '';
    var font = '';
    var buttonColor = '';
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
    var Tags;
    var deviceId;

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

            Tags = configuration.Tags;
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
                    Tags: Tags,
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
            setInterval(function() {
                methods.centerThePoll();
            }, 100);

        },
        show: function()
        {
            var c = current;
            if (c < 0)
                c = 0;
            if (typeof polls[c] === 'undefined')
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
        },
        hide: function()
        {
            var c = current;
            if (c < 0)
                c = 0;
            $('#poll').fadeOut(300);//css('display', 'none');

            if (typeof polls[c] === 'undefined' || typeof polls[c].PollRequest === 'undefined')
            {
                return false;
            }

            var poll = polls[c].PollRequest;

            if (typeof PJPollWillDismiss === 'function')
            {
                PJPollWillDismiss(poll);
            }



            if (typeof PJPollDidDismiss === 'function')
            {
                PJPollDidDismiss(poll);
            }
        },
        centerThePoll: function()
        {
            var height = jQuery('.pollContainer').height();
            var windowHeight = jQuery(window).height();
            var positionTop = parseInt((windowHeight - height) / 2);
            if(windowHeight<height)
                {
                    jQuery('body').css('min-height',(height+10)+'px');
                    jQuery('#poll').css('position','absolute');
                    jQuery('#poll').css('height',(height+30)+'px');
                   jQuery('.pollContainer').css('top', '0px');
                    
                }
                else
                    {
                        jQuery('#poll').css('position','fixed');
                    jQuery('#poll').css('height','100%');
                        jQuery('.pollContainer').css('top', positionTop + 'px');
                    }
            
        },
        drawPlotsContainer: function()
        {
            $('#poll').fadeIn(300);

            if (typeof polls === 'undefined' || polls.length === 0)
            {
                return false;
            }
            if (!container)
            {
                container = $('<div></div>')
                        .addClass('pollContainer')
                        .css('padding', '10px')
                        .css('max-width', '300px')
                        .css('width', 'calc(90% - 26px)')
                        .css('background', '#' + background)
                        .css('border', '3px solid #' + border)
                        .css('border-radius', '5px')
                        .css('position', 'relative')
                        .css('margin', 'auto')
                        .css('top', '100px')
                        .css('color', '#' + font);
                $(thisObject).html('');
                $(thisObject).append(container);
                methods.drawNextQuestion.apply(thisObject);
            }
            else
            {
                $(container).css('display', 'block');
            }
        },
        getCloseButton: function()
        {
            return $('<a href="#">✖</a>')
                    .css('position', 'absolute')
                    .css('right', '10px')
                    .css('top', '10px')
                    .css('color', '#' + font)
                    .css('text-decoration', 'none').click(function()
            {
                methods.hide.apply(thisObject);
            });
        },
        drawFinaliseQuestion: function()
        {
            var poll = polls[current].PollRequest;
            container.html(polls[current].PollRequest.customMessage);

            if (typeof(polls[current + 1]) !== 'undefined')
            {
                /*collect or next question*/
                var reward = parseInt(poll.virtualAmount);
                if (reward > 0)
                {
                    var button = $('<input type="button" value="Collect">');
                }
                else
                {
                    var close = methods.getCloseButton(button);
                    if (typeof PJPollDidResponded === 'function')
                    {
                        poll.response = response;
                        PJPollDidResponded(poll);
                    }
                    
                    
                    methods.drawNextQuestion.apply(thisObject);
                    return true;
                    var button = $('<input type="button" value="Next poll">');
                }

                button.click(function(e)
                {
                    if (typeof PJPollDidResponded === 'function')
                    {
                        poll.response = response;
                        PJPollDidResponded(poll);
                    }
                    methods.drawNextQuestion.apply(thisObject);
                });
                var p = $('<p></p>').append(button);
                button = methods.setButtonCss(button);
                container.append(p);
            }
            else
            {
                var reward = parseInt(poll.virtualAmount);
                if (reward > 0)
                {
                    var button = $('<input type="button" value="collect">').click(function()
                    {
                        if (typeof PJPollDidResponded === 'function')
                        {
                            poll.response = response;
                            PJPollDidResponded(poll);
                        }
                        methods.hide.apply(thisObject);
                    });
                    button = methods.setButtonCss(button);
                }
                else
                {
                    if (typeof PJPollDidResponded === 'function')
                    {
                        poll.response = response;
                        PJPollDidResponded(poll);
                    }
                    
                    var close = methods.getCloseButton(button);
                    var button = $('<p></p>');

                }

                var p = $('<p></p>').append(button);

                container.append(p);
            }

            if (typeof close !== undefined)
            {
                container.append(close);
            }


        },
        drawNextQuestion: function()
        {
            current++;
            container.html('');
            if (typeof polls[current] === 'undefined')
            {
                methods.finish.apply(thisObject);
                return true;
            }
            var poll = polls[current].PollRequest;
            var image;

            if (poll.pollImageUrl !== null)
            {
                image = poll.pollImageUrl;
            }
            else if (poll.appImageUrl !== null)
            {
                image = poll.appImageUrl;
            }
            else
            {
                image = 'https://s3-us-west-1.amazonaws.com/polljoydev/library/1/d613d961eac572be972627eb4a60af91baeb31a8.png';
            }
            if (!poll.mandatory)
            {
                var next = $('<a href="#">✖</a>')
                        .css('position', 'absolute')
                        .css('right', '10px')
                        .css('top', '10px')
                        .css('color', '#' + font)
                        .css('text-decoration', 'none')
                        .click(function(e)
                {

                    e.preventDefault();
                    methods.drawNextQuestion.apply(thisObject);
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
                container.append(next);
            }

            var reward = parseInt(poll.virtualAmount);
            if (reward > 0)
            {
                var rewObject = $('<div>Reward:<p>' + reward + '</p></div>').css('float', 'right').css('margin-right', '50px').css('text-align', 'center');
                rewObject.find('p').css('margin', '4px 0').css('font-weight', 'bold').css('font-size', '16px');
                container.append(rewObject);
            }

            container.append($('<img src="' + image + '"></img>').css('float', 'left').css('max-width', '20%').css('height', 'auto').css('display', 'block'));
            container.append($('<div></div>').css('clear', 'both'));
            container.append($('<p>' + poll.pollText + '</p>'));
            if (poll.type === 'T')
            {
                container.append($('<textarea required="required"></textarea>').css('display', 'block').css('color', '#000').css('background', '#fff').css('min-height', '80px'));
                var submit = $('<input type="button" value="Submit"></input>').click(function()
                {
                    methods.submitCurrentPoll.apply(thisObject);
                });
                submit = methods.setButtonCss(submit);
                container.append(submit);
            }
            else
            {
                var choices = poll.choice.split(',');
                $(choices).each(function(k, v)
                {
                    var button = $('<a href="#">' + v + '</a>').click(function(e)
                    {
                        e.preventDefault();
                        $(container).find('a').removeClass('selected');
                        $(this).addClass('selected');
                        methods.submitCurrentPoll.apply(thisObject);
                    });
                    button = methods.setButtonCss(button);
                    button.css('width', '95%').css('display', 'block');
                    var con = $('<p></p>').append(button).css('margin', '10px auto');
                    $(container).append(con);
                });
            }


        },
        setButtonCss: function(object)
        {
            return object.css('border', '0px').css('cursor', 'pointer').css('padding', '4px').css('border-radius', '4px').css('background', '#' + buttonColor).css('color', '#' + font).css('text-decoration', 'none');
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

            $(container).find('input[type="button"]').after($('<img src="http://4.bp.blogspot.com/-u4GSUmmuOr0/UCJtVBoV_RI/AAAAAAAAAO0/pChKQuf82EE/s1600/ajax-loader.gif"></img>'));
            $(container).find('input[type="button"]').remove();

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

        },
        finish: function()
        {
            var close = methods.getCloseButton();

            container.html(polls[current - 1].PollRequest.customMessage);
            container.append(close);
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
    var div = jQuery('#poll');
    if (div.length === 0)
    {
        jQuery('body').append('<div id="poll"></div>');
    }

    jQuery('#poll')
            .css('position', 'fixed')
            .css('width', '100%')
            .css('height', '100%')
            .css('top', '0')
            .css('left', '0')
            .css('display', 'none')
            .css('z-index', '1000')
            .css('background', 'rgba(32,32,32,0.7)')
    jQuery('#poll').polljoy(method);

}
