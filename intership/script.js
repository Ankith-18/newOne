// API Base URL - adjust if your folder name is different
const API_BASE_URL = window.location.origin + '/internship/api';

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Page Navigation
const navLinksElements = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinksElements.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageId = link.getAttribute('data-page') + 'Page';
        
        // Update active nav link
        navLinksElements.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        
        // Show selected page
        pages.forEach(page => page.classList.remove('active'));
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
        
        // Close mobile menu
        if (navLinks) {
            navLinks.classList.remove('active');
        }
        
        // Load page-specific content
        if (pageId === 'bookingsPage') {
            loadUserBookings();
        } else if (pageId === 'routesPage') {
            loadPopularRoutes();
        }
    });
});

// Authentication State
let currentUser = null;

// Check if user is logged in (from localStorage)
function checkAuthStatus() {
    const userData = localStorage.getItem('swiftRideUser');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            updateUIForLoggedInUser();
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('swiftRideUser');
        }
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    if (userName && currentUser) {
        userName.textContent = currentUser.full_name || currentUser.username || 'User';
    }
    if (userAvatar && currentUser) {
        userAvatar.textContent = (currentUser.full_name || currentUser.username || 'U').charAt(0).toUpperCase();
    }
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
}

// Auth Modal elements
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const logoutBtn = document.getElementById('logoutBtn');

// Show auth modal
if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        if (authModal) {
            authModal.style.display = 'flex';
            if (loginTab) loginTab.click();
        }
    });
}

if (signupBtn) {
    signupBtn.addEventListener('click', () => {
        if (authModal) {
            authModal.style.display = 'flex';
            if (signupTab) signupTab.click();
        }
    });
}

// Switch between login and signup tabs
if (loginTab && signupTab) {
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        if (loginForm) loginForm.style.display = 'flex';
        if (signupForm) signupForm.style.display = 'none';
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        if (signupForm) signupForm.style.display = 'flex';
        if (loginForm) loginForm.style.display = 'none';
    });
}

// Close auth modal when clicking outside
window.addEventListener('click', (e) => {
    if (authModal && e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// API Functions
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/users.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'login',
                email: email,
                password: password
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error' };
    }
}

async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/users.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'signup',
                username: userData.username,
                email: userData.email,
                password: userData.password,
                full_name: userData.name,
                phone: userData.phone || ''
            })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Signup error:', error);
        return { success: false, message: 'Network error' };
    }
}

async function searchBuses(from, to, date) {
    try {
        const response = await fetch(`${API_BASE_URL}/search.php?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Search error:', error);
        return [];
    }
}

async function createBooking(bookingData) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Booking error:', error);
        return { success: false, message: 'Network error' };
    }
}

async function getBookedSeats(busId, journeyDate) {
    try {
        const response = await fetch(`${API_BASE_URL}/seats.php?bus_id=${busId}&journey_date=${journeyDate}`);
        const result = await response.json();
        
        if (result.success) {
            return result.booked_seats;
        }
        return [];
    } catch (error) {
        console.error('Seats error:', error);
        return [];
    }
}

async function getUserBookings(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/bookings.php?user_id=${userId}`);
        const result = await response.json();
        
        if (result.success) {
            return result.data;
        }
        return [];
    } catch (error) {
        console.error('Bookings error:', error);
        return [];
    }
}

// Login form submission
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        const errorElement = document.getElementById('loginError');

        if (!email || !password || !errorElement) return;

        try {
            if (!email.value || !password.value) {
                throw new Error('Please fill in all fields');
            }

            const result = await loginUser(email.value, password.value);
            
            if (result.success) {
                currentUser = result.user;
                
                // Save to localStorage
                localStorage.setItem('swiftRideUser', JSON.stringify(currentUser));
                
                // Update UI
                updateUIForLoggedInUser();
                
                // Close modal
                if (authModal) authModal.style.display = 'none';
                
                // Clear form
                loginForm.reset();
                errorElement.style.display = 'none';
                
                // Show success message
                alert('Login successful!');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    });
}

// Signup form submission
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const password = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('signupConfirmPassword');
        const errorElement = document.getElementById('signupError');

        if (!name || !email || !password || !confirmPassword || !errorElement) return;

        try {
            if (!name.value || !email.value || !password.value || !confirmPassword.value) {
                throw new Error('Please fill in all fields');
            }

            if (password.value !== confirmPassword.value) {
                throw new Error('Passwords do not match');
            }

            if (password.value.length < 6) {
                throw new Error('Password must be at least 6 characters');
            }

            const result = await registerUser({
                username: email.value.split('@')[0],
                email: email.value,
                password: password.value,
                name: name.value
            });
            
            if (result.success) {
                currentUser = result.user;
                
                // Save to localStorage
                localStorage.setItem('swiftRideUser', JSON.stringify(currentUser));
                
                // Update UI
                updateUIForLoggedInUser();
                
                // Close modal
                if (authModal) authModal.style.display = 'none';
                
                // Clear form
                signupForm.reset();
                errorElement.style.display = 'none';
                
                // Show success message
                alert('Account created successfully!');
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    });
}

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('swiftRideUser');
        updateUIForLoggedOutUser();
        alert('You have been logged out.');
    });
}

// Journey Type Toggle
const oneWayBtn = document.getElementById('oneWayBtn');
const roundTripBtn = document.getElementById('roundTripBtn');
const returnDateGroup = document.getElementById('returnDateGroup');

if (oneWayBtn && roundTripBtn && returnDateGroup) {
    oneWayBtn.addEventListener('click', () => {
        oneWayBtn.classList.add('active');
        roundTripBtn.classList.remove('active');
        returnDateGroup.classList.remove('active');
    });

    roundTripBtn.addEventListener('click', () => {
        roundTripBtn.classList.add('active');
        oneWayBtn.classList.remove('active');
        returnDateGroup.classList.add('active');
    });
}

// Search Form Submission
const searchForm = document.getElementById('searchForm');
const busList = document.getElementById('busList');
const filterSection = document.getElementById('filterSection');

if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const from = document.getElementById('from');
        const to = document.getElementById('to');
        const date = document.getElementById('date');
        
        if (!from || !to || !date) return;
        
        const fromValue = from.value;
        const toValue = to.value;
        const dateValue = date.value;
        const passengers = document.getElementById('passengers');
        const passengersValue = passengers ? passengers.value : '1';
        const isRoundTrip = roundTripBtn ? roundTripBtn.classList.contains('active') : false;
        const returnDate = document.getElementById('returnDate');

        // Show filter section
        if (filterSection) {
            filterSection.style.display = 'block';
        }

        // Show loading
        if (busList) {
            busList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">Loading buses...</p>';
        }

        // Fetch buses from API
        const buses = await searchBuses(fromValue, toValue, dateValue);
        
        if (busList) {
            if (buses.length === 0) {
                busList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No buses found for this route.</p>';
                return;
            }
            
            // Get booked seats for each bus
            const busesWithSeats = [];
            for (let bus of buses) {
                const bookedSeats = await getBookedSeats(bus.bus_id, dateValue);
                bus.bookedSeats = bookedSeats.map(seat => parseInt(seat));
                busesWithSeats.push(bus);
            }
            
            displayBuses(busesWithSeats, isRoundTrip);
        }
    });
}

// Filter functionality
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');

if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', applyFilters);
}

if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', resetFilters);
}

function applyFilters() {
    const busType = document.getElementById('busType');
    const departureTime = document.getElementById('departureTime');
    const priceRange = document.getElementById('priceRange');
    
    if (!busType || !departureTime || !priceRange || !busList) return;
    
    const busTypeValue = busType.value;
    const departureTimeValue = departureTime.value;
    const priceRangeValue = priceRange.value;

    // Get current displayed buses
    const busCards = busList.querySelectorAll('.bus-card');
    let filteredCount = 0;

    busCards.forEach(card => {
        let show = true;
        
        // Filter by bus type
        if (busTypeValue !== 'all') {
            const busTypeElement = card.querySelector('.bus-type');
            if (busTypeElement) {
                const type = busTypeElement.textContent.toLowerCase();
                if (!type.includes(busTypeValue)) {
                    show = false;
                }
            }
        }
        
        // Filter by price range
        if (priceRangeValue !== 'all') {
            const priceElement = card.querySelector('.price-amount');
            if (priceElement) {
                const price = parseInt(priceElement.textContent.replace('₹', ''));
                if (priceRangeValue === 'budget' && price > 800) show = false;
                if (priceRangeValue === 'medium' && (price <= 800 || price > 1500)) show = false;
                if (priceRangeValue === 'premium' && price <= 1500) show = false;
            }
        }
        
        card.style.display = show ? 'block' : 'none';
        if (show) filteredCount++;
    });

    if (filteredCount === 0) {
        busList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No buses found with current filters.</p>';
    }
}

function resetFilters() {
    const busType = document.getElementById('busType');
    const departureTime = document.getElementById('departureTime');
    const priceRange = document.getElementById('priceRange');
    
    if (busType) busType.value = 'all';
    if (departureTime) departureTime.value = 'all';
    if (priceRange) priceRange.value = 'all';
    
    // Show all bus cards
    if (busList) {
        const busCards = busList.querySelectorAll('.bus-card');
        busCards.forEach(card => {
            card.style.display = 'block';
        });
    }
}

// Display Buses
function displayBuses(buses, isRoundTrip = false) {
    if (!busList) return;
    
    busList.innerHTML = '';
    
    if (buses.length === 0) {
        busList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No buses found for your search criteria. Please try different filters.</p>';
        return;
    }
    
    buses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        
        // Format time
        const departureTime = formatTime(bus.departure_time);
        const arrivalTime = formatTime(bus.arrival_time);
        
        // Determine bus type display
        let busTypeDisplay = 'AC Sleeper';
        if (bus.bus_type === 'semi-sleeper') busTypeDisplay = 'AC Semi-Sleeper';
        if (bus.bus_type === 'seater') busTypeDisplay = 'Non-AC Seater';
        if (bus.bus_type === 'luxury') busTypeDisplay = 'Luxury Bus';
        
        busCard.innerHTML = `
            <div class="bus-card-header">
                <h3 class="bus-name">${bus.bus_name || 'Bus'}</h3>
                <span class="bus-type ${bus.bus_type === 'sleeper' ? 'type-sleeper' : bus.bus_type === 'semi-sleeper' ? 'type-semi-sleeper' : bus.bus_type === 'seater' ? 'type-seater' : 'type-luxury'}">${busTypeDisplay}</span>
            </div>
            <div class="bus-card-body">
                <div class="bus-info">
                    <div class="bus-info-item">
                        <i class="fas fa-wifi"></i>
                        <span>WiFi</span>
                    </div>
                    <div class="bus-info-item">
                        <i class="fas fa-bolt"></i>
                        <span>Charging</span>
                    </div>
                    <div class="bus-info-item">
                        <i class="fas fa-blanket"></i>
                        <span>Blanket</span>
                    </div>
                </div>
                <div class="bus-timings">
                    <div class="timing">
                        <div class="timing-time">${departureTime}</div>
                        <div class="timing-place">${bus.source || 'City'}</div>
                    </div>
                    <div class="bus-separator">
                        <i class="fas fa-circle"></i>
                        <i class="fas fa-ellipsis-v"></i>
                        <i class="fas fa-circle"></i>
                    </div>
                    <div class="timing">
                        <div class="timing-time">${arrivalTime}</div>
                        <div class="timing-place">${bus.destination || 'City'}</div>
                    </div>
                </div>
                <div class="distance-info">
                    <div class="distance-item">
                        <div class="distance-value">${bus.total_seats || 40} Seats</div>
                        <div class="distance-label">Capacity</div>
                    </div>
                    <div class="distance-item">
                        <div class="distance-value">${bus.available_seats || bus.total_seats || 40} Available</div>
                        <div class="distance-label">Seats Left</div>
                    </div>
                </div>
                <div class="bus-price">
                    <div>
                        <span class="price-amount">₹${bus.fare || 0}</span>
                        <span>per seat</span>
                    </div>
                    <button class="book-btn" data-id="${bus.bus_id || 0}" data-roundtrip="${isRoundTrip}">Book Now</button>
                </div>
            </div>
        `;
        busList.appendChild(busCard);
    });

    // Add event listeners to book buttons
    document.querySelectorAll('.book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!currentUser) {
                alert('Please login to book a bus.');
                if (loginBtn) loginBtn.click();
                return;
            }
            
            const busId = parseInt(e.target.getAttribute('data-id'));
            const isRoundTrip = e.target.getAttribute('data-roundtrip') === 'true';
            const bus = buses.find(b => b.bus_id === busId);
            if (bus) {
                openBookingModal(bus, isRoundTrip);
            }
        });
    });
}

// Helper function to format time
function formatTime(timeString) {
    if (!timeString) return 'N/A';
    try {
        const time = new Date(`2000-01-01T${timeString}`);
        return time.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return timeString;
    }
}

// Booking Modal elements
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const cancelBookingBtn = document.getElementById('cancelBooking');
const modalBusName = document.getElementById('modalBusName');
const modalBusTiming = document.getElementById('modalBusTiming');
const seatSelection = document.getElementById('seatSelection');
const selectedSeatsDisplay = document.getElementById('selectedSeatsDisplay');
const totalPrice = document.getElementById('totalPrice');
const confirmBookingBtn = document.getElementById('confirmBooking');

let selectedBus = null;
let selectedSeats = [];
let isRoundTripBooking = false;

async function openBookingModal(bus, isRoundTrip = false) {
    if (!bookingModal || !modalBusName || !modalBusTiming || !seatSelection) return;
    
    selectedBus = bus;
    selectedSeats = [];
    isRoundTripBooking = isRoundTrip;
    
    modalBusName.textContent = `${bus.bus_name || 'Bus'}`;
    modalBusTiming.textContent = `${bus.source || 'City'} to ${bus.destination || 'City'} | ${formatTime(bus.departure_time)} - ${formatTime(bus.arrival_time)}`;
    
    // Get booked seats for this bus
    const journeyDate = document.getElementById('date');
    const journeyDateValue = journeyDate ? journeyDate.value : new Date().toISOString().split('T')[0];
    const bookedSeats = await getBookedSeats(bus.bus_id, journeyDateValue);
    
    // Generate seats
    seatSelection.innerHTML = '';
    const totalSeats = bus.total_seats || 40;
    
    for (let i = 1; i <= totalSeats; i++) {
        const seat = document.createElement('div');
        seat.className = `seat ${bookedSeats.includes(i.toString()) ? 'booked' : 'available'}`;
        seat.textContent = i;
        seat.setAttribute('data-seat', i);
        
        if (!bookedSeats.includes(i.toString())) {
            seat.addEventListener('click', toggleSeatSelection);
        }
        
        seatSelection.appendChild(seat);
    }
    
    updateSelectionDisplay();
    bookingModal.style.display = 'flex';
}

function toggleSeatSelection(e) {
    const seatNum = parseInt(e.target.getAttribute('data-seat'));
    const index = selectedSeats.indexOf(seatNum);
    
    if (index === -1) {
        selectedSeats.push(seatNum);
        e.target.classList.add('selected');
    } else {
        selectedSeats.splice(index, 1);
        e.target.classList.remove('selected');
    }
    
    updateSelectionDisplay();
}

function updateSelectionDisplay() {
    if (selectedSeatsDisplay && totalPrice && selectedBus) {
        if (selectedSeats.length === 0) {
            selectedSeatsDisplay.textContent = 'None';
        } else {
            selectedSeatsDisplay.textContent = selectedSeats.join(', ');
        }
        
        const multiplier = isRoundTripBooking ? 2 : 1;
        const price = selectedBus.fare || 0;
        totalPrice.textContent = selectedSeats.length * price * multiplier;
    }
}

// Close modal
function closeBookingModal() {
    if (bookingModal) {
        bookingModal.style.display = 'none';
    }
}

// Event listeners for booking modal
if (closeModal) {
    closeModal.addEventListener('click', closeBookingModal);
}

if (cancelBookingBtn) {
    cancelBookingBtn.addEventListener('click', closeBookingModal);
}

// Confirm booking
if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', async () => {
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat.');
            return;
        }
        
        if (!currentUser) {
            alert('Please login to book a bus.');
            if (loginBtn) loginBtn.click();
            return;
        }
        
        if (!selectedBus) return;
        
        try {
            const journeyDate = document.getElementById('date');
            const journeyDateValue = journeyDate ? journeyDate.value : new Date().toISOString().split('T')[0];
            
            const bookingData = {
                user_id: currentUser.user_id || currentUser.id || 0,
                bus_id: selectedBus.bus_id || 0,
                seat_numbers: selectedSeats.join(', '),
                journey_date: journeyDateValue,
                total_passengers: selectedSeats.length,
                total_amount: selectedSeats.length * (selectedBus.fare || 0)
            };
            
            const result = await createBooking(bookingData);
            
            if (result.success) {
                alert(`Booking confirmed! Your booking ID is ${result.booking_id}. Total: ₹${bookingData.total_amount}`);
                closeBookingModal();
                
                // Reload user bookings
                loadUserBookings();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (bookingModal && e.target === bookingModal) {
        closeBookingModal();
    }
});

// Load user bookings
async function loadUserBookings() {
    if (!currentUser) {
        const bookingsList = document.getElementById('bookingsList');
        if (bookingsList) {
            bookingsList.innerHTML = '<p>Please login to view your bookings.</p>';
        }
        return;
    }
    
    const bookingsList = document.getElementById('bookingsList');
    if (!bookingsList) return;
    
    try {
        const bookings = await getUserBookings(currentUser.user_id || currentUser.id);
        
        if (bookings.length === 0) {
            bookingsList.innerHTML = '<p>You have no bookings yet.</p>';
            return;
        }
        
        bookingsList.innerHTML = '';
        bookings.forEach(booking => {
            const bookingCard = document.createElement('div');
            bookingCard.className = 'booking-card';
            
            // Determine status class
            let statusClass = 'status-confirmed';
            if (booking.status === 'cancelled') {
                statusClass = 'status-cancelled';
            } else if (booking.status === 'pending') {
                statusClass = 'status-pending';
            }
            
            bookingCard.innerHTML = `
                <div class="booking-header">
                    <div class="booking-id">Booking ID: ${booking.booking_id || 'N/A'}</div>
                    <div class="booking-status ${statusClass}">${booking.status || 'confirmed'}</div>
                </div>
                <div class="booking-details">
                    <div class="booking-route">
                        <div class="booking-bus">${booking.bus_name || 'Bus'} ${booking.isRoundTrip ? '(Round Trip)' : ''}</div>
                        <div class="booking-date">${new Date(booking.booking_date || booking.date).toLocaleDateString()}</div>
                    </div>
                    <div class="booking-route">
                        <div>${booking.source || 'City'} to ${booking.destination || 'City'}</div>
                        <div>${formatTime(booking.departure_time)} - ${formatTime(booking.arrival_time)}</div>
                    </div>
                    <div class="booking-seats">
                        <div>Seats: ${booking.seat_numbers || 'N/A'}</div>
                        <div class="booking-price">₹${booking.total_amount || 0}</div>
                    </div>
                    <div class="booking-actions">
                        <button class="action-btn view-ticket-btn">View Ticket</button>
                        ${(booking.status === 'confirmed' || !booking.status) ? '<button class="action-btn cancel-booking-btn" data-id="' + (booking.booking_id || '') + '">Cancel</button>' : ''}
                    </div>
                </div>
            `;
            bookingsList.appendChild(bookingCard);
        });

        // Add event listeners to cancel buttons
        document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookingId = e.target.getAttribute('data-id');
                alert(`Cancel functionality for booking ${bookingId} would be implemented here.`);
            });
        });
    } catch (error) {
        console.error('Error loading bookings:', error);
        if (bookingsList) {
            bookingsList.innerHTML = '<p>Error loading bookings. Please try again.</p>';
        }
    }
}

// Load popular routes
function loadPopularRoutes() {
    const routesList = document.getElementById('routesList');
    if (!routesList) return;
    
    // Display sample popular routes
    const popularRoutes = [
        { source: 'Delhi', destination: 'Jaipur', fare: 1200, duration: '6h', distance: '280 km' },
        { source: 'Mumbai', destination: 'Pune', fare: 800, duration: '3h', distance: '150 km' },
        { source: 'Bangalore', destination: 'Chennai', fare: 1000, duration: '6h', distance: '350 km' },
        { source: 'Kolkata', destination: 'Patna', fare: 1500, duration: '12h', distance: '550 km' }
    ];
    
    routesList.innerHTML = '';
    popularRoutes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.className = 'bus-card';
        routeCard.innerHTML = `
            <div class="bus-card-header">
                <h3 class="bus-name">${route.source} to ${route.destination}</h3>
                <span class="bus-type">Popular Route</span>
            </div>
            <div class="bus-card-body">
                <div class="bus-timings">
                    <div class="timing">
                        <div class="timing-place">${route.source}</div>
                    </div>
                    <div class="bus-separator">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="timing">
                        <div class="timing-place">${route.destination}</div>
                    </div>
                </div>
                <div class="distance-info">
                    <div class="distance-item">
                        <div class="distance-value">${route.distance}</div>
                        <div class="distance-label">Distance</div>
                    </div>
                    <div class="distance-item">
                        <div class="distance-value">${route.duration}</div>
                        <div class="distance-label">Duration</div>
                    </div>
                </div>
                <div class="bus-price">
                    <div>
                        <span class="price-amount">From ₹${route.fare}</span>
                        <span>per seat</span>
                    </div>
                    <button class="book-btn">View Buses</button>
                </div>
            </div>
        `;
        routesList.appendChild(routeCard);
    });
}

// Contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('contactName');
        const email = document.getElementById('contactEmail');
        const message = document.getElementById('contactMessage');
        
        if (!name || !email || !message) return;
        
        try {
            // Simulate sending message
            await new Promise(resolve => setTimeout(resolve, 800));
            
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            alert('There was an error sending your message. Please try again.');
        }
    });
}

// Initialize the application
function init() {
    checkAuthStatus();
    
    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    const returnDateInput = document.getElementById('returnDate');
    
    if (dateInput) dateInput.min = today;
    if (returnDateInput) returnDateInput.min = today;
    
    // Load initial buses
    loadInitialBuses();
}

async function loadInitialBuses() {
    try {
        const response = await fetch(`${API_BASE_URL}/buses.php`);
        const result = await response.json();
        
        if (result.success && busList) {
            displayBuses(result.data);
        }
    } catch (error) {
        console.error('Error loading initial buses:', error);
        // Fallback to sample data if API fails
        if (busList) {
            busList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">Unable to load buses. Please try again later.</p>';
        }
    }
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);