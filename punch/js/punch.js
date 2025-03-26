// document.addEventListener("DOMContentLoaded", function () {
//     // Retrieve user data from localStorage
//     const name1 = JSON.parse(localStorage.getItem("name1"));
//     const user1 = JSON.parse(localStorage.getItem("user1"));

//     // Display user data
//     document.getElementById("userName").textContent = name1 || "Unknown";
//     document.getElementById("userId").textContent = user1 || "N/A";

//     // If user is not logged in, redirect to login page
//     if (!name1 || !user1) {
//         window.location.href = "login.html";
//     }

//     // Logout button event
//     document.getElementById("logoutBtn").addEventListener("click", function () {
//         localStorage.removeItem("name1");
//         localStorage.removeItem("user1");
//         window.location.href = "login.html"; // Redirect to login
//     });

//     // Function to get current date & time
//     function getCurrentDateTime() {
//         const now = new Date();
//         const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
//         const time = now.toTimeString().split(" ")[0]; // HH:MM:SS
//         return { date, time };
//     }

//     // Function to get user's current location
//     function getLocation(callback) {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     callback(position.coords.latitude, position.coords.longitude);
//                 },
//                 (error) => {
//                     console.error("Error getting location:", error);
//                     document.getElementById("statusMessage").innerText = "Location access denied.";
//                 }
//             );
//         } else {
//             document.getElementById("statusMessage").innerText = "Geolocation is not supported.";
//         }
//     }

//     // Function to send Punch In/Out request
//     function sendPunchData(inout) {
//         getLocation((latitude, longitude) => {
//             const { date, time } = getCurrentDateTime();
            
//             const payload = {
//                 action: "inout",
//                 date: date,
//                 time: time,
//                 name: name1,
//                 latitude: latitude,
//                 longitude: longitude,
//                 inout: inout,
//                 inradious: true
//             };

//             fetch("https://script.google.com/macros/s/AKfycbyxbKEIeEy1g0e1ktTP8OmYv_-PS4As6w9Utyb4qh-hOTEY3zWcJzJ9vftoP0O4Mzk6Mg/exec", {
//                 method: "POST",
//                // headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(payload),
//             })
//             .then(response => response.json())
//             .then(data => {
//                 if (data.status === "success") {
//                     document.getElementById("statusMessage").innerText = `Punch ${inout} successful!`;
//                 } else {
//                     document.getElementById("statusMessage").innerText = "Punch failed!";
//                 }
//             })
//             .catch(error => console.error("Error:", error));
//         });
//     }

//     // Attach Punch In/Out button events
//     document.getElementById("punchInBtn").addEventListener("click", function () {
//         sendPunchData("in");
//     });

//     document.getElementById("punchOutBtn").addEventListener("click", function () {
//         sendPunchData("out");
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve user data from localStorage
    const name1 = JSON.parse(localStorage.getItem("name1"));
    const user1 = JSON.parse(localStorage.getItem("user1"));

    // Office Coordinates
    const officeLat = 17.3818009;
    const officeLng = 78.5020713;
    const radiusLimit = 0.4; // 0.4 km (400 meters)

    // Display user data
    document.getElementById("userName").textContent = name1 || "User";
    document.getElementById("userId").textContent = user1 || "N/A";

    // If user is not logged in, redirect to login page
    if (!name1 || !user1) {
        window.location.href = "login.html";
    }

    // Logout button event
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("name1");
        localStorage.removeItem("user1");
        window.location.href = "login.html"; // Redirect to login
    });

    // Function to calculate distance using Haversine formula
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    // Function to get user's current location and check in-radius status
    // function getLocation(callback) {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const latitude = position.coords.latitude;
    //                 const longitude = position.coords.longitude;
    //                 const distance = getDistance(latitude, longitude, officeLat, officeLng);

    //                 // Check if user is within the radius
    //                 const inRadius = distance <= radiusLimit;

    //                 // Update UI
    //                 document.getElementById("locationStatus").innerText = inRadius ? "In Office" : "Out of Office";
    //                 document.getElementById("radiusDistance").innerText = `Distance: ${distance.toFixed(2)} km`;

    //                 callback(latitude, longitude, inRadius);
    //             },
    //             (error) => {
    //                 console.error("Error getting location:", error);
    //                 document.getElementById("statusMessage").innerText = "Location access denied.";
    //                 document.getElementById("statusMessage").classList.add("error-message");
    //                 callback(0,0,0);
    //             }
    //         );
    //     } else {
    //         document.getElementById("statusMessage").innerText = "Geolocation is not supported.";
    //         document.getElementById("statusMessage").classList.add("error-message");
    //     }
    // }
    function getLocation(callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const distance = getDistance(latitude, longitude, officeLat, officeLng);
    
                    // Check if user is within the radius
                    const inRadius = distance <= radiusLimit;
    
                    // Update UI based on location status
                    const locationStatus = document.getElementById("locationStatus");
                    const radiusDistance = document.getElementById("radiusDistance");
    
                    locationStatus.innerText = inRadius ? "In Office" : "Out of Office";
                    locationStatus.classList.remove("error-message", "status-message"); // Reset previous styles
    
                    if (inRadius) {
                        locationStatus.classList.add("status-message"); // Blue for "In Office"
                    } else {
                        locationStatus.classList.add("error-message"); // Red for "Out of Office"
                    }
    
                    radiusDistance.innerText = `Distance: ${distance.toFixed(2)} km`;
    
                    callback(latitude, longitude, inRadius);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    
                    const statusMessage = document.getElementById("statusMessage");
                    statusMessage.innerText = "Location access denied.";
                    statusMessage.classList.remove("status-message"); // Remove blue if present
                    statusMessage.classList.add("error-message"); // Set red color
    
                    callback(0, 0, "Location");
                }
            );
        } else {
            const statusMessage = document.getElementById("statusMessage");
            statusMessage.innerText = "Geolocation is not supported.";
            statusMessage.classList.add("error-message");
            callback(1, 1, "GeoError");
        }
    }
    

    // Function to send Punch In/Out request
    function sendPunchData(inout) {
        getLocation((latitude, longitude, inRadius) => {
            const now = new Date();
            const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
            const time = now.toTimeString().split(" ")[0]; // HH:MM:SS
            const distance = getDistance(latitude, longitude, officeLat, officeLng);
            const payload = {
                action: "inout",
                date: date,
                time: time,
                name: name1,
                latitude: latitude,
                longitude: longitude,
                inout: inout,
                inradious: inRadius,
                distance: distance
            };

            fetch(config.API_URL, {
                method: "POST",
              //  headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    document.getElementById("statusMessage").innerText = `Punch ${inout} successful!`;
                } else {
                    document.getElementById("statusMessage").innerText = "Punch failed!";
                }
            })
            .catch(error => console.error("Error:", error));
        });
    }

    // Attach Punch In/Out button events
    document.getElementById("punchInBtn").addEventListener("click", function () {
        sendPunchData("in");
    });

    document.getElementById("punchOutBtn").addEventListener("click", function () {
        sendPunchData("out");
    });

    // Fetch and display location status on page load
    getLocation(() => {});
});
