// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAe3Ds40992d55G9_H0zqDff0nbi9zkS4I",
    authDomain: "aviaa-e4a59.firebaseapp.com",
    databaseURL: "https://aviaa-e4a59-default-rtdb.firebaseio.com",
    projectId: "aviaa-e4a59",
    storageBucket: "aviaa-e4a59.appspot.com",
    messagingSenderId: "41825275937",
    appId: "1:41825275937:web:e1ce96aecaa5dd8fff9360"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// State variables to keep track of user selections
let selectedRegion = '';
let selectedStatus = '';

// Function to handle region selection
function selectRegion(region) {
    selectedRegion = region;
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('endangered').style.display = 'block';
}

// Function to handle status selection and fetch data
function selectStatus(status) {
    selectedStatus = status;
    document.getElementById('endangered').style.display = 'none';
    document.getElementById('loading').style.display = 'block'; // Show loading indicator
    fetchBirdData();
}

// Function to fetch bird data from Firebase based on selections
function fetchBirdData() {
    const path = `birds/${selectedRegion === 'nz' ? 'nzBirds' : 'nonNzBirds'}/${selectedStatus}`;
    const birdsRef = ref(database, path);

    onValue(birdsRef, (snapshot) => {
        document.getElementById('loading').style.display = 'none'; // Hide loading indicator
        document.getElementById('birdInfo').style.display = 'block'; // Show bird information
        const data = snapshot.val();
        displayBirds(data);
    }, {
        onlyOnce: true
    });
}

// Function to display bird data in the UI
function displayBirds(birds) {
    const birdList = document.getElementById('birdList');
    birdList.innerHTML = '';
    if (birds) {
        for (const bird in birds) {
            const birdData = birds[bird];
            const li = document.createElement('li');
            li.textContent = `${bird}: Habitat - ${birdData.habitat}, Diet - ${birdData.diet}`;
            birdList.appendChild(li);
        }
    } else {
        birdList.innerHTML = '<li>No birds found</li>';
    }
}

// Function to submit feedback
function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    if (feedbackText.trim() === "") {
        alert("Please enter your feedback.");
        return; // Don't submit empty feedback
    }
    
    const feedbackRef = ref(database, 'feedback/'); // Adjust the path as needed

    // Create a new feedback entry with a unique key
    const newFeedbackRef = push(feedbackRef);
    set(newFeedbackRef, {
        feedback: feedbackText,
        timestamp: new Date().toISOString() // Optional: Add a timestamp
    })
    .then(() => {
        // Clear the textarea and show a success message
        document.getElementById('feedbackText').value = '';
        document.getElementById('feedbackResponse').innerText = "Feedback submitted successfully!";
        document.getElementById('feedbackResponse').style.display = 'block';
    })
    .catch((error) => {
        console.error("Error submitting feedback:", error);
        document.getElementById('feedbackResponse').innerText = "Error submitting feedback. Please try again.";
        document.getElementById('feedbackResponse').style.display = 'block';
    });
}

// Attach functions to the window object to make them globally accessible
window.selectRegion = selectRegion;
window.selectStatus = selectStatus;
window.submitFeedback = submitFeedback; // Ensure this function is available globally
