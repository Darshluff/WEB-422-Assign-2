/********************************************************************************
 *  WEB422 – Assignment 2
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name:Darsh Parmar Student ID:151958238 Date:2025-01-31
 *
 *  Link: - https://github.com/Darshluff/WEB422-Assign-1.git
 ********************************************************************************/

document.addEventListener("DOMContentLoaded", function () {
  const listingsTable = document.querySelector("#listingsTable tbody");
  const searchForm = document.querySelector("#searchForm");
  const nameInput = document.querySelector("#name");
  const clearForm = document.querySelector("#clearForm");

  // Function to fetch and display listings
  function fetchListings(searchQuery = "") {
    fetch("data.json") // Fetching data from data.json
      .then((response) => response.json())
      .then((data) => {
        listingsTable.innerHTML = ""; // Clear table before inserting new data
        let filteredData = data;

        if (searchQuery) {
          filteredData = data.filter((listing) =>
            listing.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (filteredData.length === 0) {
          listingsTable.innerHTML = `<tr><td colspan="4"><strong>No data available</strong></td></tr>`;
        } else {
          filteredData.forEach((listing) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                          <td>${listing.name}</td>
                          <td>${listing.room_type}</td>
                          <td>${listing.address.street}</td>
                          <td>${listing.summary || "No summary available"}</td>
                      `;
            listingsTable.appendChild(row);
          });
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }

  // Initial fetch
  fetchListings();

  // Search form event listener
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    fetchListings(nameInput.value);
  });

  // Clear search input
  clearForm.addEventListener("click", function () {
    nameInput.value = "";
    fetchListings();
  });
});
