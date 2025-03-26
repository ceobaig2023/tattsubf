document.addEventListener("DOMContentLoaded", () => {
    const name1 = JSON.parse(localStorage.getItem('name1')) || "Unknown User";
    document.getElementById("userName").innerText = `Hi ${name1}`;

    fetchLogs();

    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });
});

function fetchLogs() {
    const name1 = JSON.parse(localStorage.getItem('name1')) || "Unknown User";
    const payload = { action: "records",name:name1 };
    fetch(config.API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
  //      if (responce.status === "success") {
            console.log(data);
            displayLogs(data);

        // } else {
        //     console.error("Error fetching logs:", data.message);
        // }
    })
    .catch(error => console.error("Fetch error:", error));
}

// function displayLogs(logs) {
//     const logTable = document.getElementById("logTable");
//     logTable.innerHTML = "";

//     // logs.sort((a, b) => new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)); // Descending order

//     logs.forEach(log => {
//         const row = document.createElement("tr");

//         row.innerHTML = `
//             <td>${log.date}</td>
//             <td>${log.time}</td>
//             <td class="${log.inout === 'in' ? 'green' : 'blue'}">${log.inout.toUpperCase()}</td>
//             <td class="${log.inradious ? 'green' : 'red'}">${log.inradious ? "✔️" : "❌"}</td>
//         `;

//         logTable.appendChild(row);
//     });
// }
function displayLogs(logs) {
    const logTable = document.getElementById("logTable");
    logTable.innerHTML = "";

    logs.forEach(log => {
        const logDate = new Date(log.date);
        const logTime = new Date(log.time);

        // Format Date (e.g., 19-May-2025)
        const formattedDate = logDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).replace(/ /g, '-'); // Replacing spaces with dashes

        // Format Time (e.g., 10:00 AM)
        const formattedTime = logTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${formattedTime}</td>
            <td class="${log.inout === 'in' ? 'green' : 'blue'}">${log.inout.toUpperCase()}</td>
            <td class="${log.inradious ? 'green' : 'red'}">${log.inradious ? "✔️" : "❌"}</td>
        `;

        logTable.appendChild(row);
    });
}
