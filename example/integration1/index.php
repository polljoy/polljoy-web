<!DOCTYPE html>
<html>
<script src="http://code.jquery.com/jquery-latest.min.js"
        type="text/javascript"></script>
<script src="js/polljoy.js"></script>


<head>
	<title>polljoy</title>
    <style>
        body {
            background-color: #b0c4de;
        }
    </style>
</head>
<body>
	<p>Hello user!</p>
	<span id="timer"></span>
    <br>

</body>

<script type="text/javascript">
    var count=11;

    var counter; 

    //A simple demo that display the poll after 10 seconds
    function timer()
    {
      count=count-1;
      if (count <= 0)
      {
        clearInterval(counter);
        polljoy('show');
         return;
      }
        $("#timer").text(count + " seconds to the next poll"); 
    }

	function PJPollIsReady(polls)
    {
        //start the countdown when the polls are ready
        console.log("poll is ready");
        counter =setInterval(timer, 1000);
    }
    function PJPollNotAvailable(status){
    	console.log("PJPollNotAvailable : " + status);
    }
    function PJPollWillShow(poll)
    {
    	console.log("PJPollWillShow: ");
    	console.log(poll);
    }
    function PJPollDidShow(poll) 
    {
        console.log("PJPollDidShow: ");
    }
    function PJPollWillDismiss(poll)
    {
    	console.log("PJPollWillDismiss: ");
    	console.log(poll);
    }
    function PJPollDidDismiss(poll)
    {
    	console.log("PJPollDidDismiss: ");
    	console.log(poll);
        $("#timer").text("Thank you for completing the poll!"); 
        $("body").css("background-color", "#888888");

    }
    function PJPollDidResponded(poll){
    	console.log("PJPollDidResponded: ");
    	console.log("User selected: " + poll.response);
    }
    function PJPollDidSkipped(poll)
    {
    	console.log("PJPollDidSkipped: ");
    	console.log(poll);
    }

    jQuery(document).ready(function()
    {

		polljoy({
            endPoint: 'connect.php',
            deviceId: "browser"+Math.floor((Math.random() * 1000) + 1),
            userType: 'Non-Pay',
            appVersion: '1.0'
        });
    });  
</script>

</html>