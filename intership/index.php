<?php
session_start();

// Check if user is logged in
$currentUser = isset($_SESSION['user']) ? $_SESSION['user'] : null;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SwiftRide - 3D Bus Booking</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <nav>
            <div class="logo">
                <i class="fas fa-bus"></i>
                <span>SwiftRide</span>
            </div>
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <i class="fas fa-bars"></i>
            </button>
            <div class="nav-links" id="navLinks">
                <a href="#" class="nav-link active" data-page="home">Home</a>
                <a href="#" class="nav-link" data-page="bookings">My Bookings</a>
                <a href="#" class="nav-link" data-page="routes">Routes</a>
                <a href="#" class="nav-link" data-page="offers">Offers</a>
                <a href="#" class="nav-link" data-page="contact">Contact</a>
                
                <!-- Auth Buttons (shown when not logged in) -->
                <div class="auth-buttons" id="authButtons" style="display: <?php echo $currentUser ? 'none' : 'flex'; ?>;">
                    <button class="auth-btn login-btn" id="loginBtn">Login</button>
                    <button class="auth-btn signup-btn" id="signupBtn">Sign Up</button>
                </div>
                
                <!-- User Menu (shown when logged in) -->
                <div class="user-menu" id="userMenu" style="display: <?php echo $currentUser ? 'flex' : 'none'; ?>;">
                    <div class="user-avatar" id="userAvatar">
                        <?php 
                            if($currentUser) {
                                $initial = substr($currentUser['full_name'] ?? 'U', 0, 1);
                                echo strtoupper($initial);
                            } else {
                                echo 'U';
                            }
                        ?>
                    </div>
                    <span id="userName">
                        <?php echo $currentUser ? ($currentUser['full_name'] ?? 'User') : 'User'; ?>
                    </span>
                    <button class="auth-btn login-btn" id="logoutBtn">Logout</button>
                </div>
            </div>
        </nav>
    </header>

    <!-- Home Page -->
    <div id="homePage" class="page active">
        <section class="hero">
            <div class="search-card floating">
                <h2>Book Your Bus Journey</h2>
                <div class="journey-type">
                    <button type="button" class="journey-type-btn active" id="oneWayBtn">One Way</button>
                    <button type="button" class="journey-type-btn" id="roundTripBtn">Round Trip</button>
                </div>
                <form class="search-form" id="searchForm">
                    <div class="form-group">
                        <label for="from">From</label>
                        <input type="text" id="from" placeholder="Departure city" required list="cities">
                    </div>
                    <div class="form-group">
                        <label for="to">To</label>
                        <input type="text" id="to" placeholder="Destination city" required list="cities">
                    </div>
                    <div class="form-group">
                        <label for="date">Travel Date</label>
                        <input type="date" id="date" required>
                    </div>
                    <div class="form-group return-date-group" id="returnDateGroup">
                        <label for="returnDate">Return Date</label>
                        <input type="date" id="returnDate">
                    </div>
                    <div class="form-group">
                        <label for="passengers">Passengers</label>
                        <select id="passengers">
                            <option value="1">1 Passenger</option>
                            <option value="2">2 Passengers</option>
                            <option value="3">3 Passengers</option>
                            <option value="4">4 Passengers</option>
                            <option value="5">5 Passengers</option>
                        </select>
                    </div>
                    <button type="submit" class="search-btn">Search Buses <i class="fas fa-search"></i></button>
                </form>
                <datalist id="cities">
                    <option value="Delhi">
                    <option value="Mumbai">
                    <option value="Bangalore">
                    <option value="Chennai">
                    <option value="Kolkata">
                    <option value="Hyderabad">
                    <option value="Pune">
                    <option value="Jaipur">
                    <option value="Ahmedabad">
                    <option value="Lucknow">
                </datalist>
            </div>
        </section>

        <section class="filter-section" id="filterSection" style="display: none;">
            <div class="filter-card">
                <div class="filter-header">
                    <h3 class="filter-title">Filter Buses</h3>
                </div>
                <div class="filter-options">
                    <div class="filter-group">
                        <label for="busType">Bus Type</label>
                        <select id="busType">
                            <option value="all">All Types</option>
                            <option value="sleeper">AC Sleeper</option>
                            <option value="semi-sleeper">AC Semi-Sleeper</option>
                            <option value="seater">Non-AC Seater</option>
                            <option value="luxury">Luxury Bus</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="departureTime">Departure Time</label>
                        <select id="departureTime">
                            <option value="all">Any Time</option>
                            <option value="morning">Morning (6AM - 12PM)</option>
                            <option value="afternoon">Afternoon (12PM - 6PM)</option>
                            <option value="evening">Evening (6PM - 12AM)</option>
                            <option value="night">Night (12AM - 6AM)</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="priceRange">Price Range</label>
                        <select id="priceRange">
                            <option value="all">Any Price</option>
                            <option value="budget">Budget (₹0 - ₹800)</option>
                            <option value="medium">Medium (₹800 - ₹1500)</option>
                            <option value="premium">Premium (₹1500+)</option>
                        </select>
                    </div>
                </div>
                <div class="filter-actions">
                    <button class="reset-filters-btn" id="resetFilters">Reset</button>
                    <button class="apply-filters-btn" id="applyFilters">Apply Filters</button>
                </div>
            </div>
        </section>

        <section class="bus-list" id="busList">
            <!-- Buses will be loaded here by JavaScript -->
        </section>

        <section class="features">
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-shield-alt"></i>
                </div>
                <h3 class="feature-title">Safe Travel</h3>
                <p class="feature-desc">Our buses are regularly sanitized and equipped with safety measures for your secure journey.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-tags"></i>
                </div>
                <h3 class="feature-title">Best Offers</h3>
                <p class="feature-desc">Enjoy exclusive discounts and cashback offers on every booking you make with us.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">
                    <i class="fas fa-headset"></i>
                </div>
                <h3 class="feature-title">24/7 Support</h3>
                <p class="feature-desc">Our customer care team is available round the clock to assist you with any queries.</p>
            </div>
        </section>
    </div>

    <!-- My Bookings Page -->
    <div id="bookingsPage" class="page">
        <div class="my-bookings">
            <div class="bookings-header">
                <h2 class="bookings-title">My Bookings</h2>
            </div>
            <div class="bookings-list" id="bookingsList">
                <!-- Bookings will be loaded here by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Routes Page -->
    <div id="routesPage" class="page">
        <div class="my-bookings">
            <div class="bookings-header">
                <h2 class="bookings-title">Popular Routes</h2>
            </div>
            <div class="bus-list" id="routesList">
                <!-- Routes will be loaded here by JavaScript -->
            </div>
        </div>
    </div>

    <!-- Offers Page -->
    <div id="offersPage" class="page">
        <div class="my-bookings">
            <div class="bookings-header">
                <h2 class="bookings-title">Special Offers</h2>
            </div>
            <div class="features">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <h3 class="feature-title">First Ride Discount</h3>
                    <p class="feature-desc">Get 20% off on your first booking with SwiftRide. Use code: FIRST20</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-gift"></i>
                    </div>
                    <h3 class="feature-title">Weekend Special</h3>
                    <p class="feature-desc">Enjoy 15% off on all weekend travels. Book now and save!</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <h3 class="feature-title">Group Booking</h3>
                    <p class="feature-desc">Travel with 4 or more people and get 25% discount on total fare.</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Contact Page -->
    <div id="contactPage" class="page">
        <div class="my-bookings">
            <div class="bookings-header">
                <h2 class="bookings-title">Contact Us</h2>
            </div>
            <div class="search-card">
                <h2>Get in Touch</h2>
                <form class="search-form" id="contactForm">
                    <div class="form-group">
                        <label for="contactName">Your Name</label>
                        <input type="text" id="contactName" placeholder="Enter your name" required>
                    </div>
                    <div class="form-group">
                        <label for="contactEmail">Email Address</label>
                        <input type="email" id="contactEmail" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group" style="grid-column: 1 / -1;">
                        <label for="contactMessage">Message</label>
                        <textarea id="contactMessage" placeholder="Your message" rows="4" style="padding: 0.7rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; resize: vertical;" required></textarea>
                    </div>
                    <button type="submit" class="search-btn">Send Message <i class="fas fa-paper-plane"></i></button>
                </form>
            </div>
        </div>
    </div>

    <footer>
        <div class="footer-content">
            <div class="footer-column">
                <h3>SwiftRide</h3>
                <p>Your trusted partner for comfortable and affordable bus journeys across the country.</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook-f"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
            <div class="footer-column">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="#" class="nav-link" data-page="home">Home</a></li>
                    <li><a href="#" class="nav-link" data-page="bookings">My Bookings</a></li>
                    <li><a href="#" class="nav-link" data-page="routes">Routes</a></li>
                    <li><a href="#" class="nav-link" data-page="offers">Offers</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Support</h3>
                <ul class="footer-links">
                    <li><a href="#">FAQs</a></li>
                    <li><a href="#">Help Center</a></li>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-column">
                <h3>Contact Us</h3>
                <ul class="footer-links">
                    <li><i class="fas fa-phone"></i> +91 7091844941</li>
                    <li><i class="fas fa-envelope"></i> info@swiftride.in</li>
                    <li><i class="fas fa-map-marker-alt"></i> 123 Bus Street, Transport City</li>
                </ul>
            </div>
        </div>
        <div class="copyright">
            &copy; 2025 SwiftRide. All rights reserved.
        </div>
    </footer>

    <!-- Booking Modal -->
    <div class="modal" id="bookingModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Book Your Seat</h3>
                <button class="close-btn" id="closeModal">&times;</button>
            </div>
            <div class="modal-body">
                <h4 id="modalBusName"></h4>
                <p id="modalBusTiming"></p>
                <div class="seat-selection" id="seatSelection">
                    <!-- Seats will be generated by JavaScript -->
                </div>
                <div class="selected-seats">
                    <strong>Selected Seats:</strong> <span id="selectedSeatsDisplay">None</span>
                </div>
                <div class="total-price">
                    <strong>Total Price:</strong> ₹<span id="totalPrice">0</span>
                </div>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" id="cancelBooking">Cancel</button>
                <button class="confirm-btn" id="confirmBooking">Confirm Booking</button>
            </div>
        </div>
    </div>

    <!-- Cancel Booking Modal -->
    <div class="modal" id="cancelBookingModal">
        <div class="modal-content cancel-modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Cancel Booking</h3>
                <button class="close-btn" id="closeCancelModal">&times;</button>
            </div>
            <div class="modal-body">
                <p>Are you sure you want to cancel this booking?</p>
                <div class="refund-info">
                    <p>Refund Amount: <span class="refund-amount" id="refundAmount">₹0</span></p>
                    <p>Refund will be processed within 5-7 business days.</p>
                </div>
                <textarea class="cancel-reason" id="cancelReason" placeholder="Reason for cancellation (optional)"></textarea>
            </div>
            <div class="modal-footer">
                <button class="cancel-btn" id="closeCancelBtn">No, Keep Booking</button>
                <button class="confirm-btn" id="confirmCancel">Yes, Cancel Booking</button>
            </div>
        </div>
    </div>

    <!-- Auth Modal -->
    <div class="auth-modal" id="authModal">
        <div class="auth-modal-content">
            <button class="close-btn auth-close-btn">&times;</button>
            <div class="auth-tabs">
                <div class="auth-tab active" id="loginTab">Login</div>
                <div class="auth-tab" id="signupTab">Sign Up</div>
            </div>
            <form class="auth-form" id="loginForm">
                <input type="email" id="loginEmail" placeholder="Email" required>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <div class="auth-error" id="loginError"></div>
                <button type="submit" class="auth-submit-btn">Login</button>
            </form>
            <form class="auth-form" id="signupForm" style="display: none;">
                <input type="text" id="signupName" placeholder="Full Name" required>
                <input type="email" id="signupEmail" placeholder="Email" required>
                <input type="password" id="signupPassword" placeholder="Password" required>
                <input type="password" id="signupConfirmPassword" placeholder="Confirm Password" required>
                <div class="auth-error" id="signupError"></div>
                <button type="submit" class="auth-submit-btn">Sign Up</button>
            </form>
        </div>
    </div>

    <!-- Add API Base URL Script -->
    <script>
        // Set API base URL dynamically
        const API_BASE_URL = '<?php 
            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $folder = dirname($_SERVER['PHP_SELF']);
            echo $protocol . "://" . $host . $folder . "/api";
        ?>';
        
        // Pass PHP session data to JavaScript
        const PHP_CURRENT_USER = <?php echo $currentUser ? json_encode($currentUser) : 'null'; ?>;
        
        console.log('API Base URL:', API_BASE_URL);
        console.log('PHP User:', PHP_CURRENT_USER);
    </script>
    
    <script src="script.js"></script>
</body>
</html>