<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        getBuses();
        break;
    case 'POST':
        addBus();
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function getBuses() {
    $conn = getDatabaseConnection();
    
    // Get query parameters
    $from = isset($_GET['from']) ? $_GET['from'] : '';
    $to = isset($_GET['to']) ? $_GET['to'] : '';
    $date = isset($_GET['date']) ? $_GET['date'] : '';
    
    // Build query
    $sql = "SELECT * FROM buses WHERE 1=1";
    
    if (!empty($from)) {
        $sql .= " AND source LIKE '%" . $conn->real_escape_string($from) . "%'";
    }
    
    if (!empty($to)) {
        $sql .= " AND destination LIKE '%" . $conn->real_escape_string($to) . "%'";
    }
    
    $result = $conn->query($sql);
    
    $buses = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Calculate available seats
            $bus_id = $row['bus_id'];
            $booked_seats_sql = "SELECT COUNT(*) as booked_count FROM bookings WHERE bus_id = $bus_id";
            $booked_result = $conn->query($booked_seats_sql);
            $booked_count = $booked_result->fetch_assoc()['booked_count'];
            
            $row['available_seats'] = $row['total_seats'] - $booked_count;
            $buses[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $buses
    ]);
    
    $conn->close();
}

function addBus() {
    $conn = getDatabaseConnection();
    $input = json_decode(file_get_contents('php://input'), true);
    
    $bus_number = $conn->real_escape_string($input['bus_number']);
    $bus_name = $conn->real_escape_string($input['bus_name']);
    $source = $conn->real_escape_string($input['source']);
    $destination = $conn->real_escape_string($input['destination']);
    $departure_time = $conn->real_escape_string($input['departure_time']);
    $arrival_time = $conn->real_escape_string($input['arrival_time']);
    $total_seats = intval($input['total_seats']);
    $fare = floatval($input['fare']);
    $bus_type = $conn->real_escape_string($input['bus_type'] ?? 'sleeper');
    
    $sql = "INSERT INTO buses (bus_number, bus_name, source, destination, departure_time, arrival_time, total_seats, fare, bus_type) 
            VALUES ('$bus_number', '$bus_name', '$source', '$destination', '$departure_time', '$arrival_time', $total_seats, $fare, '$bus_type')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'success' => true,
            'message' => 'Bus added successfully',
            'bus_id' => $conn->insert_id
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error adding bus: ' . $conn->error
        ]);
    }
    
    $conn->close();
}
?>