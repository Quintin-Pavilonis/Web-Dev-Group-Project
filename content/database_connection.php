<?php


// just for testing locally, remove when remote
/*if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}*/

// remote when remote
/*if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}*/


$servername = "faure";
//change these to proper EID !!!
$username = "quinpav";
$database = "quinpav";
//change to 'colors' for actual table !!
$table = "colors";
include 'password.php';

$conn = new mysqli($servername, $username, $password, $database);

if ($conn -> connect_error) {
    die("Connection failed: " . $conn->connect_error);
    exit();
}

$sql = "SELECT * FROM $table";
$result = $conn -> query($sql);

//put table data into arrays
$ids = array();
$colors = array();
$hexs = array();



while($row = $result -> fetch_assoc()) {
    //if columns are different names change these !!
    $ids[] = $row['id'];
    $colors[] = $row['name'];
    $hexs[] = $row['hex_value'];
}

//for adding a color
if (isset($_GET['add_color_name']) && isset($_GET['add_hex_value'])) {
    $color_name = $_GET['add_color_name'];
    $hex_value = $_GET['add_hex_value'];

    //check if name already exists
    $color_exists = false;
    foreach ($colors as $c) {
        if ($c == $color_name) {
            $color_exists = true;
        }
    }
    //check if hex already exists
    $hex_exists = false;
    foreach ($hexs as $h) {
        if ($h == $hex_value) {
            $hex_exists = true;
        }
    }
    
    if ((!$color_exists) && (!$hex_exists)) {
        $sql_add = "INSERT INTO $table (name, hex_value) VALUES ('$color_name', '$hex_value')";
        if ($conn -> query($sql_add) === true) {
            echo "Color added successfully.";
        }
        else {
            echo "Error when adding color occurred.";
        }
    }
    else {
        echo "Color name or hex value already exists.";
    }
}
// for deleting a color 
if(isset($_GET['delete_color_name']) || isset($_GET['delete_color_hex'])) {
    $deleted_color_name = $_GET['delete_color_name'];
    $deleted_color_hex = $_GET['delete_color_hex'];

    $colorCounter = 0;
    foreach($colors as $c) {
        $colorCounter += 1;
    }

    //check if name already exists
    $color_exists = false;
    foreach ($colors as $c) {
        if ($c == $deleted_color_name) {
            $color_exists = true;
        }
    }
    //check if hex already exists
    $hex_exists = false;
    foreach ($hexs as $h) {
        if ($h == $deleted_color_hex) {
            $hex_exists = true;
        }
    }

     if(($color_exists) && ($hex_exists) && ($colorCounter > 2) ) {
        $sql_delete = "DELETE FROM $table WHERE name = '$deleted_color_name' OR hex_value = '$deleted_color_hex'";
        if($conn->query($sql_delete) === true) {
            echo "Color deleted successfully.";
        } else {
            echo "Error deleting color: " . $conn->error;
        }
    } else {
        echo "Cannot delete color: the database needs more than 2 colors.";
    }
}



// Editing color
if (isset($_GET['old_color_name']) && isset($_GET['new_color_name']) && isset($_GET['new_hex_value'])) {
    $oldColorName = $_GET['old_color_name']; 
    $newName = $_GET['new_color_name'];
    $newHex = $_GET['new_hex_value'];

    $stmt = $conn->prepare("UPDATE $table SET name = ?, hex_value = ? WHERE name = ?");
    $stmt->bind_param("sss", $newName, $newHex, $oldColorName);

    if ($stmt->execute()) {
        echo "Color updated successfully.";
    } else {
        echo "Error updating color: " . $stmt->error;
    }

    $stmt->close();
}


// Fetch colors from the database
$sql = "SELECT name FROM $table"; 
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $colors = array();
    
    while ($row = $result->fetch_assoc()) {
        $colors[] = $row["name"];
    }
    // Return colors as JSON
    echo json_encode(["colors" => $colors]);
} else {
    echo "0 results";
}



$conn -> close();
?>
