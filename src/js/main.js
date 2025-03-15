const apiKey = "f3412f5e885e5169ac31efc42fcbc23b";  // API Key
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Peringatan!',
            text: 'Masukkan nama kota!',
            confirmButtonText: 'OK'
        });
        return;
    }
    

    document.getElementById("loading-indicator").style.display = "block";
    
    const weatherItems = document.querySelectorAll('.weather-item');
    weatherItems.forEach(item => item.style.display = 'none');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error("Kota tidak ditemukan!");
        }

        document.getElementById("loading-indicator").style.display = "none";

        displayCurrentWeather(data);

        const { lat, lon } = data.coord; 
        displayMap(lat, lon, data); 

        getForecast(lat, lon);
    } catch (error) {
        console.error("Error fetching data:", error);
        if (city !== "") {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan!',
                text: 'Tolong tekan tombol reset terlebih dahulu di bawah.',
                confirmButtonText: 'OK'
            });
        }
    

        document.getElementById("loading-indicator").style.display = "none";
    }
}

function displayCurrentWeather(data) {
    document.getElementById("city-name").textContent = `Cuaca di: ${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `Suhu: ${data.main.temp}°C`;
    document.getElementById("description").textContent = `Deskripsi: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Kelembapan: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Kecepatan Angin: ${data.wind.speed} m/s`;

    const weatherItems = document.querySelectorAll('.weather-item');
    weatherItems.forEach(item => item.style.display = 'block');
}

function displayMap(lat, lon, data) {
    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(`
            <b>${data.name}</b><br>
            <strong>Lokasi:</strong> (${lat.toFixed(2)}, ${lon.toFixed(2)})<br>
        `)
        .openPopup();
}
async function getForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;

    try {
        document.getElementById("forecast-loader").style.display = "flex"; 
        document.getElementById("forecast").style.display = "none"; 

        const response = await fetch(forecastUrl);

        if (!response.ok) {
            throw new Error(`Error fetching forecast data: ${response.statusText}`);
        }

        const forecastData = await response.json();

        if (forecastData.cod !== "200") {
            throw new Error(`API Error: ${forecastData.message}`);
        }

        displayForecast(forecastData);  
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert(`Terjadi kesalahan saat mengambil ramalan cuaca: ${error.message}`);
    }
}

function displayForecast(forecastData) {
    const forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = "";  

    forecastData.list.forEach((forecast, index) => {
        if (index % 8 === 0) { 
            const date = new Date(forecast.dt * 1000);
            const dateString = date.toLocaleDateString();
    
            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-item");
    
            const weatherDescription = forecast.weather[0].description.toLowerCase();
            const weatherImage = getWeatherImage(weatherDescription);
    
            forecastDiv.innerHTML = `
                <p><strong>${dateString}</strong></p>
                <p><strong>Suhu:</strong> ${forecast.main.temp}°C</p>
                <p><strong>Deskripsi:</strong> ${forecast.weather[0].description}</p>
                <p><strong>Kecepatan Angin:</strong> ${forecast.wind.speed} m/s</p>
                <img src="${weatherImage}" alt="${forecast.weather[0].description}" class="forecast-image">
            `;
            forecastElement.appendChild(forecastDiv);
        }
    });
    
    function getWeatherImage(description) {
        const weatherMapping = {
            cerah: "src/img/cerah.png",
            "langit cerah": "src/img/cerah.png",
            berawan: "src/img/berawan.png",
            "sedikit berawan": "src/img/berawan.png",
            hujan: "src/img/hujan.png",
            gerimis: "src/img/hujan.png",
            badai: "src/img/petir.png",
            petir: "src/img/petir.png",
            salju: "src/img/salju.png",
            angin: "src/img/berangin.png",
            "angin sepoi-sepoi": "src/img/berangin.png",
            kabut: "src/img/kabut.png",
            kabur: "src/img/kabut.png",
        };
    
        description = description.toLowerCase();
    
        for (const [key, image] of Object.entries(weatherMapping)) {
            if (description.includes(key)) {
                return image; 
            }
        }
    
        return "src/img/default.png";
    }
    
    
    
    
    

    setTimeout(function() {
        document.getElementById("forecast-loader").style.display = "none"; 
        document.getElementById("forecast").style.display = "block";  
    }, 2000); 
}


/* const apiKey = "f3412f5e885e5169ac31efc42fcbc23b";  // API Key
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Peringatan!',
            text: 'Masukkan nama kota!',
            confirmButtonText: 'OK'
        });
        return;
    }
    

    document.getElementById("loading-indicator").style.display = "block";
    
    const weatherItems = document.querySelectorAll('.weather-item');
    weatherItems.forEach(item => item.style.display = 'none');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error("Kota tidak ditemukan!");
        }

        document.getElementById("loading-indicator").style.display = "none";

        displayCurrentWeather(data);

        const { lat, lon } = data.coord; 
        displayMap(lat, lon, data); 

        getForecast(lat, lon);
    } catch (error) {
        console.error("Error fetching data:", error);
        if (city !== "") {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan!',
                text: 'Tolong tekan tombol reset terlebih dahulu di bawah.',
                confirmButtonText: 'OK'
            });
        }
    

        document.getElementById("loading-indicator").style.display = "none";
    }
}

function displayCurrentWeather(data) {
    document.getElementById("city-name").textContent = `Cuaca di: ${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `Suhu: ${data.main.temp}°C`;
    document.getElementById("description").textContent = `Deskripsi: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Kelembapan: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Kecepatan Angin: ${data.wind.speed} m/s`;

    const weatherItems = document.querySelectorAll('.weather-item');
    weatherItems.forEach(item => item.style.display = 'block');
}

function displayMap(lat, lon, data) {
    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(`
            <b>${data.name}</b><br>
            <strong>Lokasi:</strong> (${lat.toFixed(2)}, ${lon.toFixed(2)})<br>
        `)
        .openPopup();
}
async function getForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;

    try {
        document.getElementById("forecast-loader").style.display = "flex"; 
        document.getElementById("forecast").style.display = "none"; 

        const response = await fetch(forecastUrl);

        if (!response.ok) {
            throw new Error(`Error fetching forecast data: ${response.statusText}`);
        }

        const forecastData = await response.json();

        if (forecastData.cod !== "200") {
            throw new Error(`API Error: ${forecastData.message}`);
        }

        displayForecast(forecastData);  
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert(`Terjadi kesalahan saat mengambil ramalan cuaca: ${error.message}`);
    }
}

function displayForecast(forecastData) {
    const forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = "";  

    forecastData.list.forEach((forecast, index) => {
        if (index % 8 === 0) { 
            const date = new Date(forecast.dt * 1000);
            const dateString = date.toLocaleDateString();
    
            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-item");
    
            const weatherDescription = forecast.weather[0].description.toLowerCase();
            const weatherImage = getWeatherImage(weatherDescription);
    
            forecastDiv.innerHTML = `
                <p><strong>${dateString}</strong></p>
                <p><strong>Suhu:</strong> ${forecast.main.temp}°C</p>
                <p><strong>Deskripsi:</strong> ${forecast.weather[0].description}</p>
                <p><strong>Kecepatan Angin:</strong> ${forecast.wind.speed} m/s</p>
                <img src="${weatherImage}" alt="${forecast.weather[0].description}" class="forecast-image">
            `;
            forecastElement.appendChild(forecastDiv);
        }
    });
    
    function getWeatherImage(description) {
        const weatherMapping = {
            cerah: "src/img/cerah.png",
            "langit cerah": "src/img/cerah.png",
            berawan: "src/img/berawan.png",
            "sedikit berawan": "src/img/berawan.png",
            hujan: "src/img/hujan.png",
            gerimis: "src/img/hujan.png",
            badai: "src/img/petir.png",
            petir: "src/img/petir.png",
            salju: "src/img/salju.png",
            angin: "src/img/berangin.png",
            "angin sepoi-sepoi": "src/img/berangin.png",
            kabut: "src/img/kabut.png",
            kabur: "src/img/kabut.png",
        };
    
        description = description.toLowerCase();
    
        for (const [key, image] of Object.entries(weatherMapping)) {
            if (description.includes(key)) {
                return image; 
            }
        }
    
        return "src/img/default.png";
    }
    
    
    
    
    

    setTimeout(function() {
        document.getElementById("forecast-loader").style.display = "none"; 
        document.getElementById("forecast").style.display = "block";  
    }, 2000); 
}

// Test 

const apiKey = "f3412f5e885e5169ac31efc42fcbc23b";  // API Key
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

searchBtn.addEventListener("click", getWeather);

async function getWeather() {
    const city = cityInput.value.trim();
    if (city === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Peringatan!',
            text: 'Masukkan nama kota!',
            confirmButtonText: 'OK'
        });
        return;
    }
    

    document.getElementById("loading-indicator").style.display = "block";
    
    const weatherItems = document.querySelectorAll('.weather-item');
    weatherItems.forEach(item => item.style.display = 'none');

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=id`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error("Kota tidak ditemukan!");
        }

        document.getElementById("loading-indicator").style.display = "none";

        displayCurrentWeather(data);

        const { lat, lon } = data.coord; 
        displayMap(lat, lon, data); 

        getForecast(lat, lon);
    } catch (error) {
        console.error("Error fetching data:", error);
        if (city !== "") {
            Swal.fire({
                icon: 'error',
                title: 'Terjadi Kesalahan!',
                text: 'Tolong tekan tombol reset terlebih dahulu di bawah.',
                confirmButtonText: 'OK'
            });
        }
    

        document.getElementById("loading-indicator").style.display = "none";
    }
}

function displayCurrentWeather(data) {
    document.getElementById("city-name").textContent = `Cuaca di: ${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `Suhu: ${data.main.temp}°C`;
    document.getElementById("description").textContent = `Deskripsi: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Kelembapan: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Kecepatan Angin: ${data.wind.speed} m/s`;

    const weatherItems = document.querySelectorAll('.weather-item');
    weatherItems.forEach(item => item.style.display = 'block');
}

function displayMap(lat, lon, data) {
    const map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
        .bindPopup(`
            <b>${data.name}</b><br>
            <strong>Lokasi:</strong> (${lat.toFixed(2)}, ${lon.toFixed(2)})<br>
        `)
        .openPopup();
}
async function getForecast(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;

    try {
        document.getElementById("forecast-loader").style.display = "flex"; 
        document.getElementById("forecast").style.display = "none"; 

        const response = await fetch(forecastUrl);

        if (!response.ok) {
            throw new Error(`Error fetching forecast data: ${response.statusText}`);
        }

        const forecastData = await response.json();

        if (forecastData.cod !== "200") {
            throw new Error(`API Error: ${forecastData.message}`);
        }

        displayForecast(forecastData);  
    } catch (error) {
        console.error("Error fetching forecast data:", error);
        alert(`Terjadi kesalahan saat mengambil ramalan cuaca: ${error.message}`);
    }
}

function displayForecast(forecastData) {
    const forecastElement = document.getElementById("forecast");
    forecastElement.innerHTML = "";  

    forecastData.list.forEach((forecast, index) => {
        if (index % 8 === 0) { 
            const date = new Date(forecast.dt * 1000);
            const dateString = date.toLocaleDateString();
    
            const forecastDiv = document.createElement("div");
            forecastDiv.classList.add("forecast-item");
    
            const weatherDescription = forecast.weather[0].description.toLowerCase();
            const weatherImage = getWeatherImage(weatherDescription);
    
            forecastDiv.innerHTML = `
                <p><strong>${dateString}</strong></p>
                <p><strong>Suhu:</strong> ${forecast.main.temp}°C</p>
                <p><strong>Deskripsi:</strong> ${forecast.weather[0].description}</p>
                <p><strong>Kecepatan Angin:</strong> ${forecast.wind.speed} m/s</p>
                <img src="${weatherImage}" alt="${forecast.weather[0].description}" class="forecast-image">
            `;
            forecastElement.appendChild(forecastDiv);
        }
    });
    
    function getWeatherImage(description) {
        const weatherMapping = {
            cerah: "src/img/cerah.png",
            "langit cerah": "src/img/cerah.png",
            berawan: "src/img/berawan.png",
            "sedikit berawan": "src/img/berawan.png",
            hujan: "src/img/hujan.png",
            gerimis: "src/img/hujan.png",
            badai: "src/img/petir.png",
            petir: "src/img/petir.png",
            salju: "src/img/salju.png",
            angin: "src/img/berangin.png",
            "angin sepoi-sepoi": "src/img/berangin.png",
            kabut: "src/img/kabut.png",
            kabur: "src/img/kabut.png",
        };
    
        description = description.toLowerCase();
    
        for (const [key, image] of Object.entries(weatherMapping)) {
            if (description.includes(key)) {
                return image; 
            }
        }
    
        return "src/img/default.png";
    }
    
    
    
    
    

    setTimeout(function() {
        document.getElementById("forecast-loader").style.display = "none"; 
        document.getElementById("forecast").style.display = "block";  
    }, 2000); 
}
