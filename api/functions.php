<?php 
include 'config.php';
session_start();

if (isset($_POST['username']) && $_POST['username'] && isset($_POST['password']) && $_POST['password'] && isset($_POST['email']) && $_POST['email']) {
	$username = $_POST['username'];
	$_SESSION['userName'] = $username;
	$email = $_POST['email'];
	$rawPass = $_POST['password'];
	
	$sql = "INSERT INTO `Users`(`ID`, `UserName`, `Email`, `Password`) VALUES (null, '$username' , '$email' , '".md5($rawPass)."')";

		if ($mysqli->query($sql) === TRUE) {
		  
		   $loginSuccess->success = 1;
  	$loginResponse = json_encode($loginSuccess);
    echo $loginResponse;
		} else {
		  echo "Error: " . $sql . "<br>" . $mysqli->error;
		}
    
}

if (isset($_POST['username']) && $_POST['username'] && isset($_POST['password']) && $_POST['password'] && !isset($_POST['email']) && !$_POST['email']) {
	 $userName = mysqli_real_escape_string($mysqli,$_POST['username']);

     $rawPass = stripslashes($_POST['password']);
	
	$query = "SELECT COUNT(*) FROM `Users` WHERE `UserName` = '$userName' and `Password` = '" .md5($rawPass). "'";
	$result = $mysqli->query($query);
	$rows = $result->fetch_row();

      if($rows[0] == 1){
     	   $_SESSION['loggedin'] = true;
        
         $_SESSION['userName'] = $userName;
         
          $loginSuccess->success = 1;
  	$loginResponse = json_encode($loginSuccess);
    echo $loginResponse;
      }
      else{
      	  $loginSuccess->success = 0;
  	$loginResponse = json_encode($loginSuccess);
    echo $loginResponse;
      }

	
    
}

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] == true) {
   if(isset($_POST['getLogin'])){
   	$username = $_SESSION['userName'];
   	$result = $mysqli->query("SELECT `Email` FROM `Users` WHERE `UserName` = '$username'");
  	$row = $result->fetch_assoc();
  	$email = $row['Email'];

	$size = 40;
	$grav_url = "https://www.gravatar.com/avatar/" . md5( strtolower( trim( $email ) ) ) . "?s=" . $size;

	$profileDetails->profileImg = $grav_url;
	$profileDetails->username = $_SESSION['userName'];
	$profileJSON = json_encode($profileDetails);
	echo $profileJSON;

	}

	if (isset($_POST['content'])) {
		$content = ($_POST['content']);
		$user = $_SESSION['userName'];
		$sql = "INSERT INTO `Posts`(`ID`, `Content`, `Images`, `UserName` , `DateCreated`) VALUES (null, '$content' , null, '$user' , now())";

		if ($mysqli->query($sql) === TRUE) {
		  echo "New record created successfully";
		} else {
		  echo "Error: " . $sql . "<br>" . $mysqli->error;
		}
	}

	if (isset($_POST['getPosts'])) {
		$result = $mysqli->query("SELECT * FROM `Posts`");
		$Posts = array();
		 while ( $row = $result->fetch_assoc())  {
			$Posts[]=$row;
		  }
		$revPosts = array_reverse($Posts);
		   echo json_encode($revPosts);
	}



} 


  $mysqli->close();
?>