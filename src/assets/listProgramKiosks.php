<?php
header('content-type: application/json; charset=utf-8');
header("access-control-allow-origin: *");

if(isset($_GET['program'])  && $_GET['program'] != ""){
	$url = 'https://publicapi.bcycle.com/api/1.0/ListProgramKiosks/' . $_GET['program'];
} else {
	echo 'Must include program parameter';
}

$ch = curl_init($url);

curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'ApiKey: F7E5F2EE-50E3-4102-8300-CD859A4E81DD'
));

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

echo $result;

?>