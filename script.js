// ======================================================
// BRIDGEGUARD AI - DASHBOARD
// ======================================================


// ======================================================
// DARK / LIGHT MODE
// ======================================================

function toggleTheme() {
    document.body.classList.toggle("light");
}


// ======================================================
// SENSOR DATA
// Temporary simulated values
// Later these will come from ESP32
// ======================================================

const sensorData = {

    tilt: {
        title: "Tilt Sensor",
        previous: 2.8,
        current: 3.2,
        maximum: 5,
        unit: "°"
    },

    vibration: {
        title: "Vibration Sensor",
        previous: 15,
        current: 18,
        maximum: 20,
        unit: " Hz"
    },

    temperature: {
        title: "Temperature Sensor",
        previous: 27,
        current: 28,
        maximum: 45,
        unit: "°C"
    },

    humidity: {
        title: "Humidity Sensor",
        previous: 70,
        current: 72,
        maximum: 90,
        unit: "%"
    }

};


// ======================================================
// SENSOR STATUS CALCULATION
// ======================================================

function getSensorStatus(value, maximum) {

    const percentage = (value / maximum) * 100;

    if (percentage < 70) {
        return "SAFE";
    }

    if (percentage < 90) {
        return "WARNING";
    }

    return "DANGER";
}


// ======================================================
// SHOW SENSOR DETAILS
// ======================================================

let openedSensor = null;

function showSensor(sensor) {

    const panel = document.getElementById("detailsPanel");

    if (openedSensor === sensor) {

        panel.style.display = "none";
        openedSensor = null;

        return;
    }

    openedSensor = sensor;

    const item = sensorData[sensor];

    const status = getSensorStatus(
        item.current,
        item.maximum
    );

    document.getElementById("sensorTitle").innerText =
        item.title;

    document.getElementById("previous").innerText =
        item.previous + item.unit;

    document.getElementById("current").innerText =
        item.current + item.unit;

    document.getElementById("maximum").innerText =
        item.maximum + item.unit;

    document.getElementById("status").innerText =
        status;

    panel.style.display = "block";
}






// ======================================================
// BRIDGE HEALTH CALCULATION
// ======================================================

function calculateBridgeHealth() {

    const tiltScore =
        Math.max(
            0,
            100 -
            (sensorData.tilt.current /
                sensorData.tilt.maximum) * 100
        );

    const vibrationScore =
        Math.max(
            0,
            100 -
            (sensorData.vibration.current /
                sensorData.vibration.maximum) * 100
        );

    const temperatureScore =
        Math.max(
            0,
            100 -
            (sensorData.temperature.current /
                sensorData.temperature.maximum) * 100
        );

    const humidityScore =
        Math.max(
            0,
            100 -
            (sensorData.humidity.current /
                sensorData.humidity.maximum) * 100
        );


    // Weighted health score
    const health = Math.round(

        tiltScore * 0.40 +
        vibrationScore * 0.30 +
        temperatureScore * 0.15 +
        humidityScore * 0.15

    );

    return health;
}


// ======================================================
// UPDATE BRIDGE HEALTH
// ======================================================

function updateBridgeHealth() {

    const health = calculateBridgeHealth();

    const healthBar =
        document.getElementById("bridgeHealth");

    const status =
        document.getElementById("overallStatus");

    const condition =
        document.getElementById("aiCondition");

    const score =
        document.getElementById("aiScore");

    const recommendation =
        document.getElementById("recommendation");


    healthBar.style.width = health + "%";
    healthBar.innerText = health + "%";

    score.innerText = health + "/100";


    if (health >= 70) {

        status.innerText = "SAFE";
        status.className = "safe-text";

        condition.innerText = "Normal";

        recommendation.innerText =
            "No immediate maintenance required.";

    }

    else if (health >= 40) {

        status.innerText = "WARNING";
        status.className = "warning-text";

        condition.innerText = "Abnormal Pattern Detected";

        recommendation.innerText =
            "Schedule bridge inspection and monitor sensor trends.";

    }

    else {

        status.innerText = "CRITICAL";
        status.className = "danger-text";

        condition.innerText = "Critical Condition";

        recommendation.innerText =
            "Immediate structural inspection recommended.";

    }

}


/// ======================================================
// LIVE SENSOR GRAPHS
// ======================================================

// Common time labels
const timeLabels = [
    "10:00",
    "10:05",
    "10:10",
    "10:15",
    "10:20",
    "10:25"
];


// ---------------- TILT GRAPH ----------------

const tiltCtx =
    document.getElementById("tiltChart");

const tiltChart = new Chart(tiltCtx, {

    type: "line",

    data: {

        labels: [...timeLabels],

        datasets: [{
            label: "Tilt (°)",

            data: [
                2.1,
                2.4,
                2.8,
                3.0,
                3.2,
                3.2
            ],

            borderColor: "#00e676",
            backgroundColor: "rgba(0,230,118,0.2)",

            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]

    },

    options: {
        responsive: true,

        animation: {
            duration: 500
        },

        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Degrees (°)"
                }
            }
        }
    }

});


// ---------------- VIBRATION GRAPH ----------------

const vibrationCtx =
    document.getElementById("vibrationChart");

const vibrationChart = new Chart(vibrationCtx, {

    type: "line",

    data: {

        labels: [...timeLabels],

        datasets: [{
            label: "Vibration (Hz)",

            data: [
                12,
                14,
                15,
                16,
                17,
                18
            ],

            borderColor: "#ff9800",
            backgroundColor: "rgba(255,152,0,0.2)",

            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]

    },

    options: {
        responsive: true,

        animation: {
            duration: 500
        },

        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Frequency (Hz)"
                }
            }
        }
    }

});


// ---------------- TEMPERATURE GRAPH ----------------

const temperatureCtx =
    document.getElementById("temperatureChart");

const temperatureChart = new Chart(temperatureCtx, {

    type: "line",

    data: {

        labels: [...timeLabels],

        datasets: [{
            label: "Temperature (°C)",

            data: [
                26,
                26.5,
                27,
                27.5,
                28,
                28
            ],

            borderColor: "#ff5252",
            backgroundColor: "rgba(255,82,82,0.2)",

            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]

    },

    options: {
        responsive: true,

        animation: {
            duration: 500
        },

        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: "Temperature (°C)"
                }
            }
        }
    }

});


// ---------------- HUMIDITY GRAPH ----------------

const humidityCtx =
    document.getElementById("humidityChart");

const humidityChart = new Chart(humidityCtx, {

    type: "line",

    data: {

        labels: [...timeLabels],

        datasets: [{
            label: "Humidity (%)",

            data: [
                68,
                69,
                70,
                71,
                72,
                72
            ],

            borderColor: "#2196f3",
            backgroundColor: "rgba(33,150,243,0.2)",

            borderWidth: 3,
            tension: 0.4,
            fill: true
        }]

    },

    options: {
        responsive: true,

        animation: {
            duration: 500
        },

        scales: {
            y: {
                beginAtZero: true,
                max: 100,

                title: {
                    display: true,
                    text: "Humidity (%)"
                }
            }
        }
    }

});



// ======================================================
// SIMULATED LIVE SENSOR UPDATE
// ======================================================

setInterval(() => {

    // Temporary simulation
    // Later these values will come from ESP32

    sensorData.tilt.current =
        Math.max(
            0,
            sensorData.tilt.current +
            (Math.random() * 0.4 - 0.2)
        );


    sensorData.vibration.current =
        Math.max(
            0,
            sensorData.vibration.current +
            (Math.random() * 2 - 1)
        );


    sensorData.temperature.current =
        sensorData.temperature.current +
        (Math.random() * 0.4 - 0.2);


    sensorData.humidity.current =
        Math.max(
            0,
            Math.min(
                100,
                sensorData.humidity.current +
                (Math.random() * 2 - 1)
            )
        );


    // Update parameter cards

    document.getElementById("humidityValue").innerText =
    sensorData.humidity.current.toFixed(1) + "%";


document.getElementById("tiltGraphValue").innerText =
    sensorData.tilt.current.toFixed(2) + "°";

document.getElementById("vibrationGraphValue").innerText =
    sensorData.vibration.current.toFixed(1) + " Hz";

document.getElementById("temperatureGraphValue").innerText =
    sensorData.temperature.current.toFixed(1) + "°C";

document.getElementById("humidityGraphValue").innerText =
    sensorData.humidity.current.toFixed(1) + "%";


    // Current time

    const now =
        new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });


    // Add new time to all graphs

    tiltChart.data.labels.push(now);
    vibrationChart.data.labels.push(now);
    temperatureChart.data.labels.push(now);
    humidityChart.data.labels.push(now);


    // Add new sensor values

    tiltChart.data.datasets[0].data.push(
        sensorData.tilt.current
    );

    vibrationChart.data.datasets[0].data.push(
        sensorData.vibration.current
    );

    temperatureChart.data.datasets[0].data.push(
        sensorData.temperature.current
    );

    humidityChart.data.datasets[0].data.push(
        sensorData.humidity.current
    );


    // Keep only latest 10 readings

    if (tiltChart.data.labels.length > 10) {

        tiltChart.data.labels.shift();
        tiltChart.data.datasets[0].data.shift();

        vibrationChart.data.labels.shift();
        vibrationChart.data.datasets[0].data.shift();

        temperatureChart.data.labels.shift();
        temperatureChart.data.datasets[0].data.shift();

        humidityChart.data.labels.shift();
        humidityChart.data.datasets[0].data.shift();
    }


    // Update all graphs

    tiltChart.update();
    vibrationChart.update();
    temperatureChart.update();
    humidityChart.update();


    // Update AI health and alerts

    updateBridgeHealth();
    updateAlerts();

}, 3000);






// ======================================================
// ALERT SYSTEM
// ======================================================

function updateAlerts() {

    const alertList =
        document.getElementById("alertList");

    alertList.innerHTML = "";


    const tiltStatus =
        getSensorStatus(
            sensorData.tilt.current,
            sensorData.tilt.maximum
        );


    const vibrationStatus =
        getSensorStatus(
            sensorData.vibration.current,
            sensorData.vibration.maximum
        );


    if (
        tiltStatus === "SAFE" &&
        vibrationStatus === "SAFE"
    ) {

        alertList.innerHTML =
            "<li>✅ All monitored parameters are within safe limits.</li>";

        return;
    }


    if (tiltStatus !== "SAFE") {

        alertList.innerHTML +=
            `<li>⚠️ Tilt level is ${tiltStatus.toLowerCase()}.</li>`;

    }


    if (vibrationStatus !== "SAFE") {

        alertList.innerHTML +=
            `<li>⚠️ Vibration level is ${vibrationStatus.toLowerCase()}.</li>`;

    }

}


// ======================================================
// DATE & TIME
// ======================================================

function updateDateTime() {

    const now = new Date();

    document.getElementById("date").innerText =
        now.toLocaleDateString();

    document.getElementById("time").innerText =
        now.toLocaleTimeString();

}

updateDateTime();

setInterval(updateDateTime, 1000);


// ======================================================
// INITIALIZE
// ======================================================

updateBridgeHealth();

updateAlerts();
// ======================================================
// LIVE WEATHER + FORECAST
// ======================================================

const bridgeLatitude = 12.9141;
const bridgeLongitude = 74.8560;

async function updateWeather() {

    const currentBox = document.getElementById("weatherCurrent");
    const forecastBox = document.getElementById("weatherForecast");

    try {

        const url =
            `https://api.open-meteo.com/v1/forecast?` +
            `latitude=${bridgeLatitude}` +
            `&longitude=${bridgeLongitude}` +
            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
            `&timezone=auto` +
            `&forecast_days=5`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Weather API failed");
        }

        const data = await response.json();

        // CURRENT WEATHER

        const current = data.current;

        currentBox.innerHTML = `
            <div class="currentWeather">

                <strong>
                    ${weatherName(current.weather_code)}
                </strong>

                <div class="currentTemperature">
                    ${current.temperature_2m}°C
                </div>

                <div>
                    Humidity: ${current.relative_humidity_2m}%
                </div>

                <div>
                    Wind: ${current.wind_speed_10m} km/h
                </div>

            </div>
        `;


        // FORECAST

        let forecastHTML = `
            <div class="forecastTitle">
                5-Day Forecast
            </div>
        `;

        for (let i = 0; i < data.daily.time.length; i++) {

            const date = new Date(data.daily.time[i]);

            const day = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            forecastHTML += `
                <div class="forecastItem">

                    <strong>${day}</strong>

                    <span>
                        ${weatherName(data.daily.weather_code[i])}
                    </span>

                    <span>
                        ${data.daily.temperature_2m_max[i]}° /
                        ${data.daily.temperature_2m_min[i]}°
                    </span>

                    <small>
                        Rain:
                        ${data.daily.precipitation_probability_max[i]}%
                    </small>

                </div>
            `;
        }

        forecastBox.innerHTML = forecastHTML;

    }

    catch (error) {

        console.error("WEATHER ERROR:", error);

        currentBox.innerHTML =
            "⚠️ Unable to load weather";

        forecastBox.innerHTML =
            "Forecast unavailable";
    }
}


// Weather description

function weatherName(code) {

    if (code === 0)
        return "☀️ Clear Sky";

    if (code <= 3)
        return "🌤️ Partly Cloudy";

    if (code <= 48)
        return "🌫️ Fog";

    if (code <= 67)
        return "🌧️ Rain";

    if (code <= 77)
        return "❄️ Snow";

    if (code <= 82)
        return "🌦️ Rain Showers";

    return "⛈️ Thunderstorm";
}


// Start weather

updateWeather();


// Refresh every 10 minutes

setInterval(updateWeather, 600000);