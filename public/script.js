document.getElementById("placeForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const placeId = document.getElementById("placeInput").value;
    const resultsDiv = document.getElementById("results");

    const url = `/api/places?id=${encodeURIComponent(placeId)}`;

    try {
        const response = await fetch(url);
        const placeData = await response.json();

        resultsDiv.innerHTML = "";
        console.log("Fetched place data:", placeData);

        if (placeData.length > 0) {
            const place = placeData[0];
            const placeCard = document.createElement("div");
            placeCard.classList.add("place");
            placeCard.innerHTML = `
                <h3>${place.display_name}</h3>
                <p>Type: ${place.place_type}</p> 
                <p>Latitude, Longitude: ${place.location}</p>
            `;
            resultsDiv.appendChild(placeCard);
        
            getIdentifications(place.id, place.display_name);
        } else {
            resultsDiv.innerHTML = "<p>No places found.</p>";
        }
        
        
    } catch (error) {
        console.error("Error fetching places:", error);
        resultsDiv.innerHTML = "<p>Failed to load data.</p>";
    }
});


async function getIdentifications(placeId, placeName) {
    const identificationsResultsDiv = document.getElementById("identificationsResults");

    const response = await fetch(`/api/identifications?place_id=${placeId}`);
    const identifications = await response.json();
    console.log(identifications); 

    identificationsResultsDiv.innerHTML = "";

    if (identifications.length === 0) {
        identificationsResultsDiv.innerHTML = "<p>No identifications found.</p>";
    } else {
        identifications.forEach(id => {
            const idCard = document.createElement("div");
            idCard.classList.add("identification-card");
        
            const imageUrl = id.taxon.iconic_taxon_photo ? id.taxon.iconic_taxon_photo.url : 'default-image.jpg';
        
            idCard.innerHTML = `
                <h4>${id.taxon.name}</h4>
                <img src="${imageUrl}" alt="${id.taxon.name}">
                <p>By: ${id.user.login}</p>
            `;
            identificationsResultsDiv.appendChild(idCard);
        });
    }
}
