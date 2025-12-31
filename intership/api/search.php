<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $conn = getDatabaseConnection();
    
    $from = isset($_GET['from']) ? $conn->real_escape_string($_GET['from']) : '';
    $to = isset($_GET['to']) ? $conn->real_escape_string($_GET['to']) : '';
    $date = isset($_GET['date']) ? $conn->real_escape_string($_GET['date']) : '';
    
    $sql = "SELECT * FROM buses WHERE 1=1";
    
    if (!empty($from)) {
        $sql .= " AND source LIKE '%$from%'";
    }
    
    if (!empty($to)) {
        $sql .= " AND destination LIKE '%$to%'";
    }
    
    $result = $conn->query($sql);
    
    $buses = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $buses[] = $row;
        }
    }
    
    echo json_encode([
        'success' => true,
        'data' => $buses
    ]);
    
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?>