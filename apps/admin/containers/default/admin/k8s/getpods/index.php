<?php
// Copyright 2017 Google Inc. All Rights Reserved.

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
	include "../lib.php";

	$ch = getK8sCurlHandle();
	curl_setopt($ch, CURLOPT_URL, "https://kubernetes/api/v1/pods?labelSelector=" . $_GET['labelSelector']);

	$output = curl_exec($ch);
	curl_close($ch);
	header("Content-Type: application/json;charset=utf-8");
	if(isset($_GET['compress'])) {
		$pods_all = json_decode($output);
		$altered_output  = compress_pods($pods_all);
		echo $altered_output;
	} else{
		echo $output;
	}
	
?>