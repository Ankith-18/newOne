// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

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
        document.getElementById(pageId).classList.add('active');
        
        // Close mobile menu
        navLinks.classList.remove('active');
        
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
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userMenu').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userMenu').style.display = 'none';
}

// Auth Modal
const authModal = document.getElementById('authModal');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const logoutBtn = document.getElementById('logoutBtn');

// Show auth modal
loginBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
    loginTab.click();
});

signupBtn.addEventListener('click', () => {
    authModal.style.display = 'flex';
    signupTab.click();
});

// Switch between login and signup tabs
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.style.display = 'flex';
    signupForm.style.display = 'none';
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.style.display = 'flex';
    loginForm.style.display = 'none';
});

// Close auth modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    try {
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('swiftRideUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Mock user data
            currentUser = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            
            // Save to localStorage
            localStorage.setItem('swiftRideUser', JSON.stringify(currentUser));
            
            // Update UI
            updateUIForLoggedInUser();
            
            // Close modal
            authModal.style.display = 'none';
            
            // Clear form
            loginForm.reset();
            errorElement.style.display = 'none';
            
            // Show success message
            alert('Login successful!');
        } else {
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
});

// Signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const errorElement = document.getElementById('signupError');

    try {
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('Please fill in all fields');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('swiftRideUsers') || '[]');
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        
        // Create new user
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password
        };
        
        users.push(newUser);
        localStorage.setItem('swiftRideUsers', JSON.stringify(users));
        
        // Mock user data
        currentUser = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        };
        
        // Save to localStorage
        localStorage.setItem('swiftRideUser', JSON.stringify(currentUser));
        
        // Update UI
        updateUIForLoggedInUser();
        
        // Close modal
        authModal.style.display = 'none';
        
        // Clear form
        signupForm.reset();
        errorElement.style.display = 'none';
        
        // Show success message
        alert('Account created successfully!');
    } catch (error) {
        errorElement.textContent = error.message;
        errorElement.style.display = 'block';
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('swiftRideUser');
    updateUIForLoggedOutUser();
    alert('You have been logged out.');
});

// Journey Type Toggle
const oneWayBtn = document.getElementById('oneWayBtn');
const roundTripBtn = document.getElementById('roundTripBtn');
const returnDateGroup = document.getElementById('returnDateGroup');

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

// Sample Bus Data with Indian Cities and Rupee Prices
const buses = [
    {
        id: 1,
        name: "Swift Deluxe",
        type: "AC Sleeper",
        departure: "08:00 AM",
        arrival: "02:00 PM",
        from: "Delhi",
        to: "Jaipur",
        distance: "280 km",
        duration: "6 hours",
        amenities: ["wifi", "charging", "blanket", "water"],
        price: 1200,
        seats: 36,
        bookedSeats: [4, 5, 12, 13, 20, 21],
        busType: "sleeper",
        departureTime: "morning"
    },
    {
        id: 2,
        name: "City Express",
        type: "AC Semi-Sleeper",
        departure: "10:30 AM",
        arrival: "05:30 PM",
        from: "Mumbai",
        to: "Pune",
        distance: "150 km",
        duration: "7 hours",
        amenities: ["wifi", "charging", "water"],
        price: 800,
        seats: 40,
        bookedSeats: [1, 2, 15, 16, 25, 26, 35, 36],
        busType: "semi-sleeper",
        departureTime: "morning"
    },
    {
        id: 3,
        name: "Premium Travels",
        type: "Non-AC Seater",
        departure: "07:00 AM",
        arrival: "12:00 PM",
        from: "Bangalore",
        to: "Chennai",
        distance: "350 km",
        duration: "5 hours",
        amenities: ["charging", "water"],
        price: 600,
        seats: 42,
        bookedSeats: [3, 4, 10, 11, 20, 21, 30, 31, 40, 41],
        busType: "seater",
        departureTime: "morning"
    },
    {
        id: 4,
        name: "Luxury Line",
        type: "AC Sleeper",
        departure: "11:00 PM",
        arrival: "07:00 AM",
        from: "Kolkata",
        to: "Patna",
        distance: "550 km",
        duration: "8 hours",
        amenities: ["wifi", "charging", "blanket", "water", "snacks"],
        price: 1500,
        seats: 32,
        bookedSeats: [5, 6, 12, 13, 20, 21, 28, 29],
        busType: "luxury",
        departureTime: "night"
    },
    {
        id: 5,
        name: "Express Connect",
        type: "AC Semi-Sleeper",
        departure: "02:00 PM",
        arrival: "08:00 PM",
        from: "Hyderabad",
        to: "Bangalore",
        distance: "570 km",
        duration: "6 hours",
        amenities: ["wifi", "charging", "water"],
        price: 1100,
        seats: 38,
        bookedSeats: [7, 8, 15, 16, 25, 26],
        busType: "semi-sleeper",
        departureTime: "afternoon"
    },
    {
        id: 6,
        name: "Comfort Ride",
        type: "Non-AC Seater",
        departure: "06:00 PM",
        arrival: "11:00 PM",
        from: "Ahmedabad",
        to: "Mumbai",
        distance: "530 km",
        duration: "5 hours",
        amenities: ["charging", "water"],
        price: 700,
        seats: 44,
        bookedSeats: [10, 11, 20, 21, 30, 31, 40, 41],
        busType: "seater",
        departureTime: "evening"
    }
];

// Search Form Submission
const searchForm = document.getElementById('searchForm');
const busList = document.getElementById('busList');
const filterSection = document.getElementById('filterSection');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const date = document.getElementById('date').value;
    const passengers = document.getElementById('passengers').value;
    const isRoundTrip = roundTripBtn.classList.contains('active');
    const returnDate = document.getElementById('returnDate').value;

    // Show filter section
    filterSection.style.display = 'block';

    // In a real app, you would fetch buses based on search criteria
    // Here we'll filter buses based on from and to
    let filteredBuses = buses;
    if (from && to) {
        filteredBuses = buses.filter(bus => 
            bus.from.toLowerCase().includes(from.toLowerCase()) && 
            bus.to.toLowerCase().includes(to.toLowerCase())
        );
    }
    
    displayBuses(filteredBuses, isRoundTrip);
});

// Filter functionality
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');

applyFiltersBtn.addEventListener('click', () => {
    applyFilters();
});

resetFiltersBtn.addEventListener('click', () => {
    resetFilters();
});

function applyFilters() {
    const busType = document.getElementById('busType').value;
    const departureTime = document.getElementById('departureTime').value;
    const priceRange = document.getElementById('priceRange').value;
    const isRoundTrip = roundTripBtn.classList.contains('active');

    let filteredBuses = buses;

    // Filter by bus type
    if (busType !== 'all') {
        filteredBuses = filteredBuses.filter(bus => bus.busType === busType);
    }

    // Filter by departure time
    if (departureTime !== 'all') {
        filteredBuses = filteredBuses.filter(bus => bus.departureTime === departureTime);
    }

    // Filter by price range
    if (priceRange !== 'all') {
        if (priceRange === 'budget') {
            filteredBuses = filteredBuses.filter(bus => bus.price <= 800);
        } else if (priceRange === 'medium') {
            filteredBuses = filteredBuses.filter(bus => bus.price > 800 && bus.price <= 1500);
        } else if (priceRange === 'premium') {
            filteredBuses = filteredBuses.filter(bus => bus.price > 1500);
        }
    }

    displayBuses(filteredBuses, isRoundTrip);
}

function resetFilters() {
    document.getElementById('busType').value = 'all';
    document.getElementById('departureTime').value = 'all';
    document.getElementById('priceRange').value = 'all';
    
    // Display all buses
    displayBuses(buses, roundTripBtn.classList.contains('active'));
}

// Display Buses
function displayBuses(buses, isRoundTrip = false) {
    busList.innerHTML = '';
    
    if (buses.length === 0) {
        busList.innerHTML = '<p style="text-align: center; grid-column: 1 / -1; padding: 2rem;">No buses found for your search criteria. Please try different filters.</p>';
        return;
    }
    
    buses.forEach(bus => {
        const busCard = document.createElement('div');
        busCard.className = 'bus-card';
        busCard.innerHTML = `
            <div class="bus-card-header">
                <h3 class="bus-name">${bus.name}</h3>
                <span class="bus-type ${bus.busType === 'sleeper' ? 'type-sleeper' : bus.busType === 'semi-sleeper' ? 'type-semi-sleeper' : bus.busType === 'seater' ? 'type-seater' : 'type-luxury'}">${bus.type}</span>
            </div>
            <div class="bus-card-body">
                <div class="bus-info">
                    <div class="bus-info-item">
                        <i class="fas fa-wifi ${bus.amenities.includes('wifi') ? '' : 'disabled'}"></i>
                        <span>WiFi</span>
                    </div>
                    <div class="bus-info-item">
                        <i class="fas fa-bolt ${bus.amenities.includes('charging') ? '' : 'disabled'}"></i>
                        <span>Charging</span>
                    </div>
                    <div class="bus-info-item">
                        <i class="fas fa-utensils ${bus.amenities.includes('snacks') ? '' : 'disabled'}"></i>
                        <span>Snacks</span>
                    </div>
                    <div class="bus-info-item">
                        <i class="fas fa-blanket ${bus.amenities.includes('blanket') ? '' : 'disabled'}"></i>
                        <span>Blanket</span>
                    </div>
                </div>
                <div class="bus-timings">
                    <div class="timing">
                        <div class="timing-time">${bus.departure}</div>
                        <div class="timing-place">${bus.from}</div>
                    </div>
                    <div class="bus-separator">
                        <i class="fas fa-circle"></i>
                        <i class="fas fa-ellipsis-v"></i>
                        <i class="fas fa-circle"></i>
                    </div>
                    <div class="timing">
                        <div class="timing-time">${bus.arrival}</div>
                        <div class="timing-place">${bus.to}</div>
                    </div>
                </div>
                <div class="distance-info">
                    <div class="distance-item">
                        <div class="distance-value">${bus.distance}</div>
                        <div class="distance-label">Distance</div>
                    </div>
                    <div class="distance-item">
                        <div class="distance-value">${bus.duration}</div>
                        <div class="distance-label">Duration</div>
                    </div>
                    <div class="distance-item">
                        <div class="distance-value">${bus.seats - bus.bookedSeats.length}</div>
                        <div class="distance-label">Seats Available</div>
                    </div>
                </div>
                <div class="bus-price">
                    <div>
                        <span class="price-amount">₹${bus.price}</span>
                        <span>per seat</span>
                    </div>
                    <button class="book-btn" data-id="${bus.id}" data-roundtrip="${isRoundTrip}">Book Now</button>
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
                loginBtn.click();
                return;
            }
            
            const busId = parseInt(e.target.getAttribute('data-id'));
            const isRoundTrip = e.target.getAttribute('data-roundtrip') === 'true';
            const bus = buses.find(b => b.id === busId);
            openBookingModal(bus, isRoundTrip);
        });
    });
}

// Booking Modal
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const cancelBooking = document.getElementById('cancelBooking');
const modalBusName = document.getElementById('modalBusName');
const modalBusTiming = document.getElementById('modalBusTiming');
const seatSelection = document.getElementById('seatSelection');
const selectedSeatsDisplay = document.getElementById('selectedSeatsDisplay');
const totalPrice = document.getElementById('totalPrice');
const confirmBooking = document.getElementById('confirmBooking');

let selectedBus = null;
let selectedSeats = [];
let isRoundTripBooking = false;

function openBookingModal(bus, isRoundTrip = false) {
    selectedBus = bus;
    selectedSeats = [];
    isRoundTripBooking = isRoundTrip;
    
    modalBusName.textContent = `${bus.name} (${bus.type})`;
    modalBusTiming.textContent = `${bus.from} to ${bus.to} | ${bus.departure} - ${bus.arrival}`;
    
    // Generate seats
    seatSelection.innerHTML = '';
    for (let i = 1; i <= bus.seats; i++) {
        const seat = document.createElement('div');
        seat.className = `seat ${bus.bookedSeats.includes(i) ? 'booked' : 'available'}`;
        seat.textContent = i;
        seat.setAttribute('data-seat', i);
        
        if (!bus.bookedSeats.includes(i)) {
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
    if (selectedSeats.length === 0) {
        selectedSeatsDisplay.textContent = 'None';
    } else {
        selectedSeatsDisplay.textContent = selectedSeats.join(', ');
    }
    
    const multiplier = isRoundTripBooking ? 2 : 1;
    totalPrice.textContent = selectedSeats.length * selectedBus.price * multiplier;
}

// Close modal
function closeBookingModal() {
    bookingModal.style.display = 'none';
}

closeModal.addEventListener('click', closeBookingModal);
cancelBooking.addEventListener('click', closeBookingModal);

// Confirm booking
confirmBooking.addEventListener('click', async () => {
    if (selectedSeats.length === 0) {
        alert('Please select at least one seat.');
        return;
    }
    
    try {
        // Simulate booking process
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate a booking ID
        const bookingId = 'SW' + Date.now().toString().slice(-6);
        
        // Calculate total price
        const multiplier = isRoundTripBooking ? 2 : 1;
        const totalPriceValue = selectedSeats.length * selectedBus.price * multiplier;
        
        // Save booking to localStorage
        const booking = {
            id: bookingId,
            bus: selectedBus,
            seats: selectedSeats,
            totalPrice: totalPriceValue,
            date: new Date().toISOString(),
            status: 'confirmed',
            isRoundTrip: isRoundTripBooking
        };
        
        // Get existing bookings or initialize empty array
        const existingBookings = JSON.parse(localStorage.getItem('swiftRideBookings') || '[]');
        existingBookings.push(booking);
        localStorage.setItem('swiftRideBookings', JSON.stringify(existingBookings));
        
        alert(`Booking confirmed! Your booking ID is ${bookingId}. Total: ₹${totalPriceValue}`);
        closeBookingModal();
    } catch (error) {
        alert('There was an error processing your booking. Please try again.');
        console.error('Booking error:', error);
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === bookingModal) {
        closeBookingModal();
    }
});

// Cancel Booking Modal
const cancelBookingModal = document.getElementById('cancelBookingModal');
const closeCancelModal = document.getElementById('closeCancelModal');
const closeCancelBtn = document.getElementById('closeCancelBtn');
const confirmCancel = document.getElementById('confirmCancel');
const refundAmount = document.getElementById('refundAmount');

let bookingToCancel = null;

function openCancelBookingModal(booking) {
    bookingToCancel = booking;
    
    // Calculate refund amount (80% of total price)
    const refund = Math.floor(booking.totalPrice * 0.8);
    refundAmount.textContent = `₹${refund}`;
    
    cancelBookingModal.style.display = 'flex';
}

function closeCancelBookingModal() {
    cancelBookingModal.style.display = 'none';
    bookingToCancel = null;
}

closeCancelModal.addEventListener('click', closeCancelBookingModal);
closeCancelBtn.addEventListener('click', closeCancelBookingModal);

// Confirm cancellation
confirmCancel.addEventListener('click', () => {
    if (!bookingToCancel) return;
    
    // Update booking status
    const bookings = JSON.parse(localStorage.getItem('swiftRideBookings') || '[]');
    const updatedBookings = bookings.map(booking => {
        if (booking.id === bookingToCancel.id) {
            return {
                ...booking,
                status: 'cancelled',
                cancellationDate: new Date().toISOString(),
                refundAmount: Math.floor(booking.totalPrice * 0.8)
            };
        }
        return booking;
    });
    
    localStorage.setItem('swiftRideBookings', JSON.stringify(updatedBookings));
    
    alert(`Booking ${bookingToCancel.id} has been cancelled. Refund of ₹${Math.floor(bookingToCancel.totalPrice * 0.8)} will be processed.`);
    closeCancelBookingModal();
    
    // Reload bookings
    loadUserBookings();
});

// Close cancel modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === cancelBookingModal) {
        closeCancelBookingModal();
    }
});

// Load user bookings
function loadUserBookings() {
    if (!currentUser) {
        document.getElementById('bookingsList').innerHTML = '<p>Please login to view your bookings.</p>';
        return;
    }
    
    const bookingsList = document.getElementById('bookingsList');
    const bookings = JSON.parse(localStorage.getItem('swiftRideBookings') || '[]');
    
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
                <div class="booking-id">Booking ID: ${booking.id}</div>
                <div class="booking-status ${statusClass}">${booking.status}</div>
            </div>
            <div class="booking-details">
                <div class="booking-route">
                    <div class="booking-bus">${booking.bus.name} ${booking.isRoundTrip ? '(Round Trip)' : ''}</div>
                    <div class="booking-date">${new Date(booking.date).toLocaleDateString()}</div>
                </div>
                <div class="booking-route">
                    <div>${booking.bus.from} to ${booking.bus.to}</div>
                    <div>${booking.bus.departure} - ${booking.bus.arrival}</div>
                </div>
                <div class="booking-seats">
                    <div>Seats: ${booking.seats.join(', ')}</div>
                    <div class="booking-price">₹${booking.totalPrice}</div>
                </div>
                <div class="booking-actions">
                    <button class="action-btn view-ticket-btn">View Ticket</button>
                    ${booking.status === 'confirmed' ? '<button class="action-btn cancel-booking-btn" data-id="' + booking.id + '">Cancel</button>' : ''}
                </div>
            </div>
        `;
        bookingsList.appendChild(bookingCard);
    });

    // Add event listeners to cancel buttons
    document.querySelectorAll('.cancel-booking-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookingId = e.target.getAttribute('data-id');
            const booking = bookings.find(b => b.id === bookingId);
            openCancelBookingModal(booking);
        });
    });
}

// Load popular routes
function loadPopularRoutes() {
    const routesList = document.getElementById('routesList');
    
    // Display some sample popular routes with Indian cities
    const popularRoutes = [
        { from: 'Delhi', to: 'Jaipur', price: 1200, duration: '6h', distance: '280 km' },
        { from: 'Mumbai', to: 'Pune', price: 800, duration: '3h', distance: '150 km' },
        { from: 'Bangalore', to: 'Chennai', price: 1000, duration: '6h', distance: '350 km' },
        { from: 'Kolkata', to: 'Patna', price: 1500, duration: '12h', distance: '550 km' },
        { from: 'Hyderabad', to: 'Bangalore', price: 1200, duration: '10h', distance: '570 km' },
        { from: 'Ahmedabad', to: 'Mumbai', price: 900, duration: '8h', distance: '530 km' }
    ];
    
    routesList.innerHTML = '';
    popularRoutes.forEach(route => {
        const routeCard = document.createElement('div');
        routeCard.className = 'bus-card';
        routeCard.innerHTML = `
            <div class="bus-card-header">
                <h3 class="bus-name">${route.from} to ${route.to}</h3>
                <span class="bus-type">Popular Route</span>
            </div>
            <div class="bus-card-body">
                <div class="bus-timings">
                    <div class="timing">
                        <div class="timing-place">${route.from}</div>
                    </div>
                    <div class="bus-separator">
                        <i class="fas fa-arrow-right"></i>
                    </div>
                    <div class="timing">
                        <div class="timing-place">${route.to}</div>
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
                        <span class="price-amount">From ₹${route.price}</span>
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
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;
    
    try {
        // Simulate sending message
        await new Promise(resolve => setTimeout(resolve, 800));
        
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    } catch (error) {
        alert('There was an error sending your message. Please try again.');
    }
});

// Initialize the application
function init() {
    checkAuthStatus();
    displayBuses(buses);
    
    // Set minimum date for date inputs to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').min = today;
    document.getElementById('returnDate').min = today;
}

// Start the application
init();