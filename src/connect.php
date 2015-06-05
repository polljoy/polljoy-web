<?php

/* Please update with YOUR_APP_ID that available it admin panel */

$appId = 'Please put your APP_ID here';
$deviceId = sha1($_SERVER['HTTP_USER_AGENT'] . $_SERVER['REMOTE_ADDR']);

/* * *Don't modify below this line*** */
/* unset($_SESSION); */

session_start();
$backend = 'https://api.polljoy.com/3.0/poll/';
//$backend = 'https://apisandbox.polljoy.com/3.0/poll/';
header('Access-Control-Allow-Origin: *');

function getDevice() {
    $agent = $_SERVER['HTTP_USER_AGENT'];
    if (stripos($agent, 'iPad') !== false) {
        $agent = 'mobile';
    } elseif (stripos($agent, 'iPhone') !== false) {
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
    $agent = explode('(', $_SERVER['HTTP_USER_AGENT']);
    $agent = explode(')', $agent[1]);
    return @array_shift(explode(';', $agent[0]));
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

function crypt1($text, $key, $alg, $crypt)
{
    $encrypted_data="";
    switch($alg)
    {
        case "3des":
            $td = mcrypt_module_open('tripledes', '', 'ecb', '');
            break;
        case "cast-128":
            $td = mcrypt_module_open('cast-128', '', 'ecb', '');
            break;
        case "gost":
            $td = mcrypt_module_open('gost', '', 'ecb', '');
            break;
        case "rijndael-128":
            $td = mcrypt_module_open('rijndael-128', '', 'ecb', '');
            break;
        case "twofish":
            $td = mcrypt_module_open('twofish', '', 'ecb', '');
            break;
        case "arcfour":
            $td = mcrypt_module_open('arcfour', '', 'ecb', '');
            break;
        case "cast-256":
            $td = mcrypt_module_open('cast-256', '', 'ecb', '');
            break;
        case "loki97":
            $td = mcrypt_module_open('loki97', '', 'ecb', '');
            break;
        case "rijndael-192":
            $td = mcrypt_module_open('rijndael-192', '', 'ecb', '');
            break;
        case "saferplus":
            $td = mcrypt_module_open('saferplus', '', 'ecb', '');
            break;
        case "wake":
            $td = mcrypt_module_open('wake', '', 'ecb', '');
            break;
        case "blowfish-compat":
            $td = mcrypt_module_open('blowfish-compat', '', 'ecb', '');
            break;
        case "des":
            $td = mcrypt_module_open('des', '', 'ecb', '');
            break;
        case "rijndael-256":
            $td = mcrypt_module_open('rijndael-256', '', 'ecb', '');
            break;
        case "xtea":
            $td = mcrypt_module_open('xtea', '', 'ecb', '');
            break;
        case "enigma":
            $td = mcrypt_module_open('enigma', '', 'ecb', '');
            break;
        case "rc2":
            $td = mcrypt_module_open('rc2', '', 'ecb', '');
            break;
        default:
            $td = mcrypt_module_open('blowfish', '', 'ecb', '');
            break;
    }

    $iv = mcrypt_create_iv(mcrypt_enc_get_iv_size($td), MCRYPT_RAND);
    $key = substr($key, 0, mcrypt_enc_get_key_size($td));
    mcrypt_generic_init($td, $key, $iv);

    if($crypt)
    {
        $encrypted_data = urlsafe_b64encode(mcrypt_generic($td, $text));
    }
    else
    {
        $encrypted_data = mdecrypt_generic($td, urlsafe_b64decode($text));
    }

    mcrypt_generic_deinit($td);
    mcrypt_module_close($td);

    return $encrypted_data;
}

function urlsafe_b64encode($string) {
    $data = base64_encode($string);
    $data = str_replace(array('+','/','='),array('-','_',''),$data);
    return $data;
}

function urlsafe_b64decode($string) {
    $data = str_replace(array('-','_'),array('+','/'),$string);
    $mod4 = strlen($data) % 4;
    if ($mod4) {
        $data .= substr('====', $mod4);
    }
    return base64_decode($data);
}

if (isset($_GET['register'])) {

    if (isset($_POST['deviceId']) && isset($_SESSION['device_id']) && !($_POST['deviceId'] == $_SESSION['device_id'])) {
        unset($_SESSION['current_session']);
    }

    if (!isset($_SESSION['current_session'])) {
        $data_in = array('appId' => $appId, 'deviceId' => $deviceId, 'deviceModel' => 'web', 'osVersion' => getOs() );
        if (isset($_POST['deviceId'])) {
            $data_in['deviceId'] = $_POST['deviceId'];
        }

        $curl = createCurl();
        curl_setopt($curl, CURLOPT_URL, $backend . 'registerSession.json');
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data_in));
        if (isset($_SERVER['HTTP_USER_AGENT'])) {
            curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
        }
        $data = json_decode(curl_exec($curl));
        unset($data->session->appId);
        $_SESSION['current_session'] = json_encode($data);
        $_SESSION['device_id'] = $data_in['deviceId'];
        echo json_encode($data);
    } else {
        echo $_SESSION['current_session'];
    }
    die();
}

if (isset($_GET['sg'])) {
    $default = array(
        'userType' => 'Non-Pay',
        'appVersion' => '',
        'deviceId' => '',
        'level' => '',
        'sessionCount' => '',
        'timeSinceInstall' => '',
        'tags' => '');
    $data = $_POST;
    foreach ($default as $k => $v) {
        if (!isset($data[$k])) {
            $data[$k] = $v;
        }
    }

    $data['deviceModel'] = getDevice();
    $data['platform'] = 'web';
    $data['osVersion'] = getOs();

    $a = array('appVersion', 'level', 'sessionCount', 'timeSinceInstall', 'tags');
    foreach ($a as $key) {
        if (trim($data[$key]) == '') {
            unset($data[$key]);
        }
    }
    if (!isset($data['deviceId']) || strlen($data['deviceId']) == 0) {
        $data['deviceId'] = $deviceId;
        $data['deviceId'] = $_SESSION['device_id'];
    }
    $curl = createCurl();
    curl_setopt($curl, CURLOPT_URL, $backend . 'smartget.json');
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    $data = json_decode(curl_exec($curl));
    if (isset($data->polls) && is_array($data->polls)) {
        unset($data->app->appId);
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
        $data['deviceId'] = $_SESSION['device_id'];
    }
    $curl = createCurl();
    curl_setopt($curl, CURLOPT_URL, $backend . 'response/' . $_GET['token'] . '.json');
    curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($data));
    echo curl_exec($curl);
    die();
}