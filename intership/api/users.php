<?php
require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

switch($method) {
    case 'POST':
        if(isset($input['action'])) {
            if($input['action'] == 'login') {
                loginUser($input);
            } elseif($input['action'] == 'signup') {
                registerUser($input);
            }
        }
        break;
    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

function loginUser($data) {
    $conn = getDatabaseConnection();
    
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    
    $sql = "SELECT user_id, username, email, full_name, phone_number, created_at 
            FROM users 
            WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($sql);
    
    if($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
    }
    
    $conn->close();
}

function registerUser($data) {
    $conn = getDatabaseConnection();
    
    $username = $conn->real_escape_string($data['username']);
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);
    $full_name = $conn->real_escape_string($data['full_name']);
    $phone = $conn->real_escape_string($data['phone'] ?? '');
    
    // Check if user exists
    $check_sql = "SELECT user_id FROM users WHERE email = '$email' OR username = '$username'";
    $check_result = $conn->query($check_sql);
    
    if($check_result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'User already exists with this email or username'
        ]);
        return;
    }
    
    // Insert new user
    $insert_sql = "INSERT INTO users (username, email, password, full_name, phone_number) 
                   VALUES ('$username', '$email', '$password', '$full_name', '$phone')";
    
    if($conn->query($insert_sql) === TRUE) {
        $user_id = $conn->insert_id;
        
        // Get created user data
        $user_sql = "SELECT user_id, username, email, full_name, phone_number 
                     FROM users WHERE user_id = $user_id";
        $user_result = $conn->query($user_sql);
        $user = $user_result->fetch_assoc();
        
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'user' => $user
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Registration failed: ' . $conn->error
        ]);
    }
    
    $conn->close();
}
?>