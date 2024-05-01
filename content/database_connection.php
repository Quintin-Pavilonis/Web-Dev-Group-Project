<?php
$servername = "faure";
//change these to proper EID !!!
$username = "kade5";
$database = "kade5";
//change to 'colors' for actual table !!
$table = "colors_test";
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
    $colors[] = $row['color_name'];
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
        $sql_add = "INSERT INTO $table (color_name, hex_value) VALUES ('$color_name', '$hex_value')";
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
if(isset($_GET['delete_color_name']) && isset($_GET['delete_color_hex'])) {
    $deleted_color_name = $_GET['delete_color_name'];
    $deleted_color_hex = $_GET['delete_color_hex'];

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
    if(($color_exists) && ($hex_exists)) {
        $sql_delete = "DELETE FROM $table WHERE color_name = '$deleted_color_name' OR hex_value = '$deleted_color_hex'";
        if($conn->query($sql_delete) === TRUE) {
            echo "Color deleted successfully.";
        } else {
            echo "Error deleting color: " . $conn->error;
        }
    }
}

$conn -> close();
?>