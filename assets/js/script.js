document.addEventListener("DOMContentLoaded", () => {
    const appsFile = "assets/database/apps.json";

    // Load JSON database
    async function loadApps() {
        const response = await fetch(appsFile);
        return response.json();
    }

    // Handle search functionality
    const searchForm = document.getElementById("searchForm");
    const searchQuery = document.getElementById("searchQuery");
    const resultsList = document.getElementById("resultsList");

    if (searchForm) {
        searchForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const query = searchQuery.value.toLowerCase();
            resultsList.innerHTML = "";

            const apps = await loadApps();
            const filteredApps = apps.apps.filter((app) =>
                app.name.toLowerCase().includes(query)
            );

            if (filteredApps.length > 0) {
                filteredApps.forEach((app) => {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `
                        <h3>${app.name}</h3>
                        <a href="view.html?id=${app.id}">View Details</a>
                    `;
                    resultsList.appendChild(listItem);
                });
            } else {
                resultsList.innerHTML = `<p>No apps found for "${query}"</p>`;
            }
        });
    }

    // Handle app upload functionality
    const uploadForm = document.getElementById("uploadForm");
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const appName = document.getElementById("appName").value;
            const appURL = document.getElementById("appURL").value;

            const apps = await loadApps();
            const newApp = {
                id: apps.apps.length + 1,
                name: appName,
                url: appURL
            };
            apps.apps.push(newApp);

            // Save updated apps to JSON (only works on a server with server-side API)
            console.log("New app added:", newApp);
            alert("App uploaded successfully!");
        });
    }

    // Handle viewing app details
    const appDetails = document.getElementById("appDetails");
    if (appDetails) {
        const params = new URLSearchParams(window.location.search);
        const appId = parseInt(params.get("id"));

        loadApps().then((apps) => {
            const app = apps.apps.find((app) => app.id === appId);
            if (app) {
                appDetails.innerHTML = `
                    <h2>${app.name}</h2>
                    <a href="${app.url}" download>Download</a>
                `;
            } else {
                appDetails.innerHTML = `<p>App not found.</p>`;
            }
        });
    }
});
