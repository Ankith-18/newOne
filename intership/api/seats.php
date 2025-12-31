<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $bus_id = isset($_GET['bus_id']) ? intval($_GET['bus_id']) : 0;
    $journey_date = isset($_GET['journey_date']) ? $_GET['journey_date'] : '';
    
    if($bus_id > 0 && !empty($journey_date)) {
        $conn = getDatabaseConnection();
        
        // Get booked seats for specific bus and date
        $sql = "SELECT seat_number FROM seats 
                WHERE bus_id = $bus_id 
                AND journey_date = '$journey_date' 
                AND status = 'booked'";
        
        $result = $conn->query($sql);
        
        $bookedSeats = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $bookedSeats[] = $row['seat_number'];
            }
        }
        
        echo json_encode([
            'success' => true,
            'booked_seats' => $bookedSeats
        ]);
        
        $conn->close();
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Missing parameters'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>