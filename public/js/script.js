document.addEventListener('DOMContentLoaded', function() {
    // Initialize the modal
    M.Modal.init(document.querySelectorAll('.modal'));

     // Socket.io client-side code
     const socket = io();

     // Handle receiving the random number
     socket.on('randomNumber', (number) => {
        console.log('randomNumber event received');
        const randomNumberElement = document.getElementById('randomNumber');
        if (randomNumberElement) {
            console.log(`Received random number: ${number}`);
            randomNumberElement.textContent = `Random Number: ${number}`;
        } else {
            console.error('Element with ID "randomNumber" not found.');
        }
    });
    

   
    document.getElementById('clickMeButton').addEventListener('click', function() {
        const now = new Date();
        const dateTimeString = `Date: ${now.toLocaleDateString()} Time: ${now.toLocaleTimeString()}`;
        alert(`Thanks for clicking me. Today's date and current time is: ${dateTimeString}`);
    });
    

    document.getElementById('multiplyButton').addEventListener('click', function() {
        const number = prompt("Enter a number to see its multiplication table:");
        if (number !== null && !isNaN(number)) {
            const num = parseInt(number);
            let resultHTML = `<h5>Multiplication Table for ${num}:</h5><ul>`;
            for (let i = 1; i <= 10; i++) {
                resultHTML += `<li>${num} x ${i} = ${num * i}</li>`;
            }
            resultHTML += '</ul>';
            document.getElementById('resultContainer').innerHTML = resultHTML;
        } else {
            alert("Please enter a valid number.");
        }
    });

    // Open modal when the 'Leave a Review' button is clicked
    document.getElementById('leaveReviewButton').addEventListener('click', function() {
        M.Modal.getInstance(document.getElementById('reviewModal')).open();
    });

    fetch('/api/reviews')
        .then(response => response.json())
        .then(data => {
            const reviewCardsContainer = document.getElementById('reviewCardsContainer');
            data.forEach(review => {
                const reviewCardHTML = `
                    <div class="card">
                        <div class="card-content">
                            <span class="card-title">${review.firstName} ${review.lastName}</span>
                            <p>${review.reviewText}</p>
                        </div>
                        <div class="card-action">
                            <span>Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                        </div>
                    </div>`;
                reviewCardsContainer.innerHTML += reviewCardHTML;
            });
        })
        .catch(error => console.error('Error fetching reviews:', error));

    // Handle star rating selection
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const rating = this.getAttribute('data-value');
            document.querySelectorAll('.star').forEach(s => {
                s.classList.remove('selected');
            });
            for (let i = 1; i <= rating; i++) {
                document.querySelector(`.star[data-value="${i}"]`).classList.add('selected');
            }
        });
    });

    // Handle form submission
    document.getElementById('submitReviewButton').addEventListener('click', function() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const reviewText = document.getElementById('reviewText').value;
        const selectedRating = document.querySelectorAll('.star.selected').length;

        console.log('Form submission triggered');
        console.log('First Name:', firstName);
        console.log('Last Name:', lastName);
        console.log('Review Text:', reviewText);
        console.log('Selected Rating:', selectedRating);

        if (!firstName || !lastName || !reviewText || selectedRating === 0) {
            alert("Please fill out all fields and select a rating.");
            return;
        }

        const review = { firstName, lastName, reviewText, rating: selectedRating };

        fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(review),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.message); });
            }
            return response.json();
        })
        .then(data => {
            const reviewCardsContainer = document.getElementById('reviewCardsContainer');
            const reviewCardHTML = `
                <div class="card">
                    <div class="card-content">
                        <span class="card-title">${data.firstName} ${data.lastName}</span>
                        <p>${data.reviewText}</p>
                    </div>
                    <div class="card-action">
                        <span>Rating: ${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</span>
                    </div>
                </div>`;
            reviewCardsContainer.innerHTML += reviewCardHTML;
            M.Modal.getInstance(document.getElementById('reviewModal')).close();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was an error submitting your review. Please try again.");
        });
    });
});
