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
// $search_term will be either color name or hex value
function deleteColor($conn, $table, $search_term) {
    // check if the color exists in the database 
    $sql = "SELECT * FROM $table WHERE color_name = '$search_term' OR hex_value = '$search_term'";
    $result = $conn->query($sql);

    if($result->num_rows > 0) {
        // Delete the color from the database
        $sql_delete = "DELETE FROM $table WHERE color_name = '$search_term' OR hex_value = '$search_term'";
        if($conn->query($sql_delete) === TRUE) {
            echo "Color '$search_term' deleted successfully.";
        } else {
            echo "Error deleting color '$search_term': " . $conn->error;
        }
    } else {
        echo "Color or hex value '$search_term' not found in the database";
    }
}

$conn -> close();
?>