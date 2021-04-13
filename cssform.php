<?php

include("connection.php");
error_reporting(0);
?>

<!DOCTYPE html>
<html>
<body>
<br><br><br><br><br>

<form>
<table border="0" bgcolor="white" align="center" cellspacing="20">

<tr>
<td>Username:</td>
<td><input type="text" placeholder="Username" name="username" required></td>
</tr>

<tr>
<td>Email id:</td>
<td><input type="text" placeholder="Emailid" name="email" required></td>
</tr>

<tr>
<td colspan="2" align="center"><input type="submit" id="button" name="submit"></td>
</tr>
</form>
</table>
</body>
</html>

<?php

$un=$_GET['username'];
$em=$_GET['email'];

$query="INSERT INTO STUDENT VALUES ('$un','$em')";

$data=mysqli_query($conn,$query);

if($data)
{
   //echo "data inserted into database";
}
else
{
   echo "failed to insert data into database";
}

?>