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
