<?php

$appId = 'YOUR_APP_ID';
$deviceId = sha1($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);

/* * *Don't modify below this line*** */
 /*unset($_SESSION); */

session_start();
$backend = 'https://api.polljoy.com/poll/';
header('Access-Control-Allow-Origin: *');

function getDevice() {
    $agent = $_SERVER['HTTP_USER_AGENT'];
    if (stripos($agent, 'iPad') !== false) {
        $agent = 'mobile';
    } elseif (stripos($agent, 'Android') !== false) {
        $agent = 'mobile';
    } else {
        return 'desktop';
    }
    return $agent;
}

function getOs() {
    $agent = $_SERVER['HTTP_USER_AGENT'];
    $agent = explode('(',$_SERVER['HTTP_USER_AGENT']);
    $agent = explode(')',$agent[1]);
    return array_shift(explode(';',$agent[0]));
}

function createCurl() {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($curl, CURLOPT_AUTOREFERER, true);
    curl_setopt($curl, CURLOPT_POST, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
    return $curl;
}

if (isset($_GET['register'])) {


    if(isset($_POST['deviceId']) && !($_POST['deviceId']==$_SESSION['device_id']))
    {
        unset($_SESSION['current_session']);
    }
  
    if (!isset($_SESSION['current_session'])) {
        $data_in = array('appId' => $appId, 'deviceId' => $deviceId);
        if (isset($_POST['deviceId'])) {
            $data_in['deviceId'] = $_POST['deviceId'];
        }
        $curl = createCurl();
        curl_setopt($curl, CURLOPT_URL, $backend . 'registerSession.json');
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data_in));
        $data = json_decode(curl_exec($curl));
        unset($data->app->appId);
        $_SESSION['current_session'] = json_encode($data);
        $_SESSION['device_id'] = $data_in['deviceId'];
        echo json_encode($data);
    } else {
        echo $_SESSION['current_session'];
    }
    die();
}

if (isset($_GET['sg'])) {
    $data = $_POST;
    
    $data['deviceModel'] = getDevice();
    $data['platform'] = 'ios';
    $data['osVersion'] = getOs();
    
    $a = array('appVersion', 'level', 'sessionCount', 'timeSinceInstall', 'Tags');
    foreach ($a as $key) {
        if (trim($data[$key]) == '') {
            unset($data[$key]);
        }
    }
    if (!isset($data['deviceId']) || strlen($data['deviceId']) == 0) {
        $data['deviceId'] = $deviceId;
    }
    $curl = createCurl();
    curl_setopt($curl, CURLOPT_URL, $backend . 'smartget.json');
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    $data = json_decode(curl_exec($curl));
    if (isset($data->polls) && is_array($data->polls)) {
        foreach ($data->polls as $k => $v) {
            unset($data->polls[$k]->PollRequest->appId);
        }
    }
    echo json_encode($data);
    die();
}

if (isset($_GET['response'])) {
    $data = $_POST;
    if (!isset($data['deviceId']) || strlen($data['deviceId']) == 0) {
        $data['deviceId'] = $deviceId;
    }
    $curl = createCurl();
    curl_setopt($curl, CURLOPT_URL, $backend . 'response/' . $_GET['token'] . '.json');
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    echo curl_exec($curl);
    die();
}