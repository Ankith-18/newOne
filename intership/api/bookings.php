<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'GET':
        getBookings();
        break;
    case 'POST':
        createBooking($input);
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function getBookings() {
    $conn = getDatabaseConnection();
    
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
    
    if($user_id > 0) {
        $sql = "SELECT b.*, bus.bus_name, bus.bus_number, bus.source, bus.destination,
                       bus.departure_time, bus.arrival_time, bus.fare
                FROM bookings b
                JOIN buses bus ON b.bus_id = bus.bus_id
                WHERE b.user_id = $user_id
                ORDER BY b.booking_date DESC";
    } else {
        $sql = "SELECT b.*, bus.bus_name, bus.bus_number, bus.source, bus.destination,
                       bus.departure_time, bus.arrival_time, bus.fare
                FROM bookings b
                JOIN buses bus ON b.bus_id = bus.bus_id
                ORDER BY b.booking_date DESC";
    }
    
    $result = $conn->query($sql);
    
    $bookings = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $bookings
    ]);
    
    $conn->close();
}

function createBooking($data) {
    $conn = getDatabaseConnection();
    
    $user_id = intval($data['user_id']);
    $bus_id = intval($data['bus_id']);
    $seat_numbers = $conn->real_escape_string($data['seat_numbers']);
    $journey_date = $conn->real_escape_string($data['journey_date']);
    $total_passengers = intval($data['total_passengers']);
    $total_amount = floatval($data['total_amount']);
    
    // Generate booking ID
    $booking_id = 'SW' . date('Ymd') . rand(1000, 9999);
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Insert booking
        $sql = "INSERT INTO bookings (booking_id, user_id, bus_id, seat_numbers, journey_date, total_passengers, total_amount) 
                VALUES ('$booking_id', $user_id, $bus_id, '$seat_numbers', '$journey_date', $total_passengers, $total_amount)";
        
        if (!$conn->query($sql)) {
            throw new Exception('Booking failed: ' . $conn->error);
        }
        
        $booking_db_id = $conn->insert_id;
        
        // Update seat status
        $seats = explode(',', $seat_numbers);
        foreach ($seats as $seat) {
            $seat = trim($seat);
            $seat_sql = "INSERT INTO seats (bus_id, seat_number, journey_date, status, booking_id) 
                         VALUES ($bus_id, '$seat', '$journey_date', 'booked', $booking_db_id)";
            
            if (!$conn->query($seat_sql)) {
                throw new Exception('Seat update failed: ' . $conn->error);
            }
        }
        
        // Update available seats in bus
        $update_bus_sql = "UPDATE buses SET available_seats = available_seats - $total_passengers WHERE bus_id = $bus_id";
        if (!$conn->query($update_bus_sql)) {
            throw new Exception('Bus update failed: ' . $conn->error);
        }
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Booking successful',
            'booking_id' => $booking_id
        ]);
        
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
    
    $conn->close();
}
?>