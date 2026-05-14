document.addEventListener('DOMContentLoaded', () => {
    const loginLink = document.getElementById('login-link');
    const placesList = document.getElementById('places-list');
    const priceFilter = document.getElementById('price-filter');

    // 1. Cookie-ni oxumaq üçün funksiya
    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    // 2. Authentication yoxla
    function checkAuthentication() {
        const token = getCookie('token');
        if (!token) {
            loginLink.style.display = 'block';
        } else {
            loginLink.style.display = 'none';
            fetchPlaces(token);
        }
    }

    // 3. Məkanları API-dan çək
    async function fetchPlaces(token) {
        try {
            const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if (response.ok) {
                const places = await response.json();
                displayPlaces(places);
            }
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    }

    // 4. Məkanları ekranda göstər
    function displayPlaces(places) {
        placesList.innerHTML = '';
        places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';
            card.dataset.price = place.price; // Filtr üçün qiyməti saxla
            card.innerHTML = `
                <h3>${place.title}</h3>
                <p>Price per night: $${place.price}</p>
                <p>Location: ${place.latitude}, ${place.longitude}</p>
                <button class="details-button" onclick="window.location.href='place.html?id=${place.id}'">View Details</button>
            `;
            placesList.appendChild(card);
        });
    }

    // 5. Client-side filtrasiya
    priceFilter.addEventListener('change', (event) => {
        const selectedPrice = event.target.value;
        const cards = document.querySelectorAll('.place-card');

        cards.forEach(card => {
            const cardPrice = parseFloat(card.dataset.price);
            if (selectedPrice === 'all' || cardPrice <= parseFloat(selectedPrice)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });

    checkAuthentication();
});

// URL-dən Place ID-ni götürür
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            alert('Could not fetch place details');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayPlaceDetails(place) {
    const detailsSection = document.getElementById('place-details');
    if (!detailsSection) return;

    // Amenity-ləri və Rəyləri list şəklində hazırla
    const amenities = place.amenities.map(a => `<li>${a.name}</li>`).join('');
    const reviews = place.reviews.map(r => `
        <div class="review-card">
            <p><strong>${r.user_name}:</strong> ${r.text}</p>
            <p>Rating: ${r.rating}/5</p>
        </div>
    `).join('');

    detailsSection.innerHTML = `
        <div class="place-info">
            <h1>${place.title}</h1>
            <p><strong>Host:</strong> ${place.owner_name}</p>
            <p><strong>Price:</strong> $${place.price} per night</p>
            <p><strong>Description:</strong> ${place.description}</p>
        </div>
        <div class="amenities">
            <h3>Amenities</h3>
            <ul>${amenities || '<li>No amenities listed</li>'}</ul>
        </div>
        <div class="reviews">
            <h3>Reviews</h3>
            ${reviews || '<p>No reviews yet.</p>'}
        </div>
    `;
}

// Səhifə yüklənəndə Place Details səhifəsində olub-olmadığımızı yoxla
document.addEventListener('DOMContentLoaded', () => {
    const placeId = getPlaceIdFromURL();
    const detailsSection = document.getElementById('place-details');

    if (placeId && detailsSection) {
        const token = getCookie('token');
        const addReviewSection = document.getElementById('add-review');

        if (token) {
            if (addReviewSection) addReviewSection.style.display = 'block';
        }
        fetchPlaceDetails(token, placeId);
    }
});

// Rəy forması üçün xüsusi məntiq
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    
    // Əgər rəy səhifəsindəyiksə
    if (reviewForm) {
        const token = getCookie('token');
        const placeId = getPlaceIdFromURL();

        // 1. Authentication Check
        if (!token) {
            alert('You must be logged in to add a review.');
            window.location.href = 'index.html';
            return;
        }

        // 2. Form Submission
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const text = document.getElementById('review-text').value;
            const rating = document.getElementById('rating').value;

            try {
                const response = await fetch('http://127.0.0.1:5000/api/v1/reviews/', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        place_id: placeId,
                        text: text,
                        rating: parseInt(rating)
                    })
                });

                if (response.ok) {
                    alert('Review submitted successfully!');
                    window.location.href = `place.html?id=${placeId}`;
                } else {
                    const error = await response.json();
                    alert('Error: ' + (error.msg || 'Failed to submit review'));
                }
            } catch (err) {
                console.error('Submission error:', err);
                alert('An error occurred while submitting your review.');
            }
        });
    }
});
