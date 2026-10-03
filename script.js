// ======================================================
// BRIDGEGUARD AI - DASHBOARD
// REAL ESP8266 SENSOR DATA
// ======================================================


// ======================================================
// ESP8266 API
// ======================================================

const ESP8266_IP = "10.168.203.62";

const API_URL =
    `http://${ESP8266_IP}/api/data`;


// ======================================================
// DARK / LIGHT MODE
// ======================================================

function toggleTheme() {

    document.body.classList.toggle("light");

    const themeIcon =
        document.getElementById("themeIcon");

    if (!themeIcon) {
        return;
    }


    if (
        document.body.classList.contains("light")
    ) {

        // LIGHT MODE
        themeIcon.className =
            "fas fa-sun";

    } else {

        // DARK MODE
        themeIcon.className =
            "fas fa-moon";
    }

}


// ======================================================
// SENSOR DATA
// ======================================================

const sensorData = {

    tilt: {

        title: "Tilt Sensor",

        previous: 0,

        current: 0,

        maximum: 5,

        unit: "°"
    },


    vibration: {

        title: "Vibration Sensor",

        previous: 0,

        current: 0,

        maximum: 0.20,

        unit: " g"
    },


    temperature: {

        title: "Temperature Sensor",

        previous: 0,

        current: 0,

        maximum: 45,

        unit: "°C"
    },


    humidity: {

        title: "Humidity Sensor",

        previous: 0,

        current: 0,

        maximum: 90,

        unit: "%"
    }

};


// ======================================================
// SENSOR STATUS
// ======================================================

function getSensorStatus(sensor, value) {


    // TILT

    if (sensor === "tilt") {

        if (value <= 2) {

            return "SAFE";

        }


        if (value <= 5) {

            return "WARNING";

        }


        return "DANGER";
    }


    // VIBRATION

    if (sensor === "vibration") {

        if (value <= 0.10) {

            return "SAFE";

        }


        if (value <= 0.20) {

            return "WARNING";

        }


        return "DANGER";
    }


    // TEMPERATURE

    if (sensor === "temperature") {

        if (
            value >= 15 &&
            value <= 40
        ) {

            return "SAFE";

        }


        if (
            value >= 5 &&
            value <= 45
        ) {

            return "WARNING";

        }


        return "DANGER";
    }


    // HUMIDITY

    if (sensor === "humidity") {

        if (
            value >= 30 &&
            value <= 80
        ) {

            return "SAFE";

        }


        if (
            value >= 20 &&
            value <= 90
        ) {

            return "WARNING";

        }


        return "DANGER";
    }


    return "SAFE";
}


// ======================================================
// SHOW SENSOR DETAILS
// ======================================================

let openedSensor = null;


function showSensor(sensor) {

    const panel =
        document.getElementById(
            "detailsPanel"
        );


    if (!panel) {

        return;
    }


    if (openedSensor === sensor) {

        panel.style.display =
            "none";

        openedSensor = null;

        return;
    }


    openedSensor = sensor;


    const item =
        sensorData[sensor];


    const status =
        getSensorStatus(
            sensor,
            item.current
        );


    document.getElementById(
        "sensorTitle"
    ).innerText =
        item.title;


    document.getElementById(
        "previous"
    ).innerText =
        item.previous.toFixed(2)
        + item.unit;


    document.getElementById(
        "current"
    ).innerText =
        item.current.toFixed(2)
        + item.unit;


    document.getElementById(
        "maximum"
    ).innerText =
        item.maximum
        + item.unit;


    document.getElementById(
        "status"
    ).innerText =
        status;


    panel.style.display =
        "block";
}


// ======================================================
// BRIDGE HEALTH CALCULATION
// ======================================================

function calculateBridgeHealth() {

    const parameters = [

        {
            sensor: "tilt",
            value:
                sensorData.tilt.current
        },


        {
            sensor: "vibration",
            value:
                sensorData.vibration.current
        },


        {
            sensor: "temperature",
            value:
                sensorData.temperature.current
        },


        {
            sensor: "humidity",
            value:
                sensorData.humidity.current
        }

    ];


    let healthScores = [];


    parameters.forEach(
        parameter => {

            const sensorStatus =
                getSensorStatus(
                    parameter.sensor,
                    parameter.value
                );


            let score = 100;


            if (
                sensorStatus ===
                "WARNING"
            ) {

                score = 70;
            }


            if (
                sensorStatus ===
                "DANGER"
            ) {

                score = 20;
            }


            healthScores.push(
                score
            );

        }
    );


    return Math.min(
        ...healthScores
    );
}


// ======================================================
// UPDATE BRIDGE HEALTH
// ======================================================

function updateBridgeHealth() {

    const health =
        calculateBridgeHealth();


    const status =
        document.getElementById(
            "overallStatus"
        );


    const condition =
        document.getElementById(
            "aiCondition"
        );


    const score =
        document.getElementById(
            "aiScore"
        );


    const recommendation =
        document.getElementById(
            "recommendation"
        );


    const healthBar =
        document.getElementById(
            "bridgeHealth"
        );


    if (
        !status ||
        !condition ||
        !score
    ) {

        return;
    }


    // SCORE

    score.innerText =
        health + "/100";


    if (healthBar) {

        healthBar.style.width =
            health + "%";

        healthBar.innerText =
            health + "%";
    }


    // CONDITION

    if (health >= 70) {

        status.innerText =
            "SAFE";

        status.className =
            "safe-text";


        condition.innerText =
            "Normal";


        recommendation.innerText =
            "No immediate maintenance required.";
    }


    else if (health >= 40) {

        status.innerText =
            "WARNING";

        status.className =
            "warning-text";


        condition.innerText =
            "Abnormal Pattern Detected";


        recommendation.innerText =
            "Schedule bridge inspection and monitor sensor trends.";
    }


    else {

        status.innerText =
            "CRITICAL";

        status.className =
            "danger-text";


        condition.innerText =
            "Critical Condition";


        recommendation.innerText =
            "Immediate structural inspection recommended.";
    }

}


// ======================================================
// LIVE SENSOR GRAPHS
// NORMAL MOVING WINDOW
// ======================================================


// ======================================================
// TILT GRAPH
// ======================================================

const tiltCtx =
    document.getElementById(
        "tiltChart"
    );


const tiltChart =
    new Chart(
        tiltCtx,
        {

            type: "line",


            data: {

                labels: [],


                datasets: [{

                    label:
                        "Tilt (°)",

                    data: [],

                    borderColor:
                        "#00e676",

                    backgroundColor:
                        "rgba(0,230,118,0.2)",

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true

                }]

            },


            options: {

                responsive: true,

                animation: {

                    duration: 300

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Degrees (°)"

                        }

                    }

                }

            }

        }
    );


// ======================================================
// VIBRATION GRAPH
// ======================================================

const vibrationCtx =
    document.getElementById(
        "vibrationChart"
    );


const vibrationChart =
    new Chart(
        vibrationCtx,
        {

            type: "line",


            data: {

                labels: [],


                datasets: [{

                    label:
                        "Vibration (g)",

                    data: [],

                    borderColor:
                        "#ff9800",

                    backgroundColor:
                        "rgba(255,152,0,0.2)",

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true

                }]

            },


            options: {

                responsive: true,

                animation: {

                    duration: 300

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        title: {

                            display: true,

                            text:
                                "Acceleration (g)"

                        }

                    }

                }

            }

        }
    );


// ======================================================
// TEMPERATURE GRAPH
// ======================================================

const temperatureCtx =
    document.getElementById(
        "temperatureChart"
    );


const temperatureChart =
    new Chart(
        temperatureCtx,
        {

            type: "line",


            data: {

                labels: [],


                datasets: [{

                    label:
                        "Temperature (°C)",

                    data: [],

                    borderColor:
                        "#ff5252",

                    backgroundColor:
                        "rgba(255,82,82,0.2)",

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true

                }]

            },


            options: {

                responsive: true,

                animation: {

                    duration: 300

                },


                scales: {

                    y: {

                        beginAtZero: false,

                        title: {

                            display: true,

                            text:
                                "Temperature (°C)"

                        }

                    }

                }

            }

        }
    );


// ======================================================
// HUMIDITY GRAPH
// ======================================================

const humidityCtx =
    document.getElementById(
        "humidityChart"
    );


const humidityChart =
    new Chart(
        humidityCtx,
        {

            type: "line",


            data: {

                labels: [],


                datasets: [{

                    label:
                        "Humidity (%)",

                    data: [],

                    borderColor:
                        "#2196f3",

                    backgroundColor:
                        "rgba(33,150,243,0.2)",

                    borderWidth: 3,

                    tension: 0.4,

                    fill: true

                }]

            },


            options: {

                responsive: true,

                animation: {

                    duration: 300

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        max: 100,

                        title: {

                            display: true,

                            text:
                                "Humidity (%)"

                        }

                    }

                }

            }

        }
    );


// ======================================================
// REAL ESP8266 DATA
// ======================================================

async function getESP8266Data() {

    try {

        const response =
            await fetch(
                API_URL,
                {
                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "ESP8266 API error"
            );
        }


        const data =
            await response.json();


        // SAVE PREVIOUS VALUES

        sensorData.tilt.previous =
            sensorData.tilt.current;


        sensorData.vibration.previous =
            sensorData.vibration.current;


        sensorData.temperature.previous =
            sensorData.temperature.current;


        sensorData.humidity.previous =
            sensorData.humidity.current;


        // REAL SENSOR VALUES

        sensorData.tilt.current =

            Math.sqrt(

                data.roll *
                data.roll +

                data.pitch *
                data.pitch

            );


        sensorData.vibration.current =
            data.vibration;


        sensorData.temperature.current =
            data.temperature;


        sensorData.humidity.current =
            data.humidity;


        // ==================================================
        // UPDATE SENSOR CARDS
        // ==================================================

        const tiltValue =
            document.getElementById(
                "tiltValue"
            );


        if (tiltValue) {

            tiltValue.innerText =
                sensorData.tilt.current
                    .toFixed(2)
                + "°";
        }


        const vibrationValue =
            document.getElementById(
                "vibrationValue"
            );


        if (vibrationValue) {

            vibrationValue.innerText =
                sensorData.vibration.current
                    .toFixed(3)
                + " g";
        }


        const temperatureValue =
            document.getElementById(
                "temperatureValue"
            );


        if (temperatureValue) {

            temperatureValue.innerText =
                sensorData.temperature.current
                    .toFixed(2)
                + "°C";
        }


        const humidityValue =
            document.getElementById(
                "humidityValue"
            );


        if (humidityValue) {

            humidityValue.innerText =
                sensorData.humidity.current
                    .toFixed(2)
                + "%";
        }


        // ==================================================
        // GRAPH CURRENT VALUES
        // ==================================================

        const tiltGraphValue =
            document.getElementById(
                "tiltGraphValue"
            );


        if (tiltGraphValue) {

            tiltGraphValue.innerText =
                sensorData.tilt.current
                    .toFixed(2);
        }


        const vibrationGraphValue =
            document.getElementById(
                "vibrationGraphValue"
            );


        if (vibrationGraphValue) {

            vibrationGraphValue.innerText =
                sensorData.vibration.current
                    .toFixed(3);
        }


        const temperatureGraphValue =
            document.getElementById(
                "temperatureGraphValue"
            );


        if (temperatureGraphValue) {

            temperatureGraphValue.innerText =
                sensorData.temperature.current
                    .toFixed(2);
        }


        const humidityGraphValue =
            document.getElementById(
                "humidityGraphValue"
            );


        if (humidityGraphValue) {

            humidityGraphValue.innerText =
                sensorData.humidity.current
                    .toFixed(2);
        }


        // ==================================================
        // TIME
        // ==================================================

        const now =
            new Date()
                .toLocaleTimeString(
                    [],
                    {

                        hour:
                            "2-digit",

                        minute:
                            "2-digit",

                        second:
                            "2-digit"

                    }
                );


        // ==================================================
        // ADD DATA TO GRAPHS
        // ==================================================

        tiltChart.data.labels.push(now);

        vibrationChart.data.labels.push(now);

        temperatureChart.data.labels.push(now);

        humidityChart.data.labels.push(now);


        tiltChart
            .data
            .datasets[0]
            .data
            .push(
                sensorData
                    .tilt.current
            );


        vibrationChart
            .data
            .datasets[0]
            .data
            .push(
                sensorData
                    .vibration.current
            );


        temperatureChart
            .data
            .datasets[0]
            .data
            .push(
                sensorData
                    .temperature.current
            );


        humidityChart
            .data
            .datasets[0]
            .data
            .push(
                sensorData
                    .humidity.current
            );


        // ==================================================
        // KEEP LAST 20 READINGS
        // ==================================================

        if (
            tiltChart.data.labels.length >
            20
        ) {

            tiltChart
                .data
                .labels
                .shift();

            tiltChart
                .data
                .datasets[0]
                .data
                .shift();


            vibrationChart
                .data
                .labels
                .shift();

            vibrationChart
                .data
                .datasets[0]
                .data
                .shift();


            temperatureChart
                .data
                .labels
                .shift();

            temperatureChart
                .data
                .datasets[0]
                .data
                .shift();


            humidityChart
                .data
                .labels
                .shift();

            humidityChart
                .data
                .datasets[0]
                .data
                .shift();

        }


        // ==================================================
        // UPDATE GRAPHS
        // ==================================================

        tiltChart.update();

        vibrationChart.update();

        temperatureChart.update();

        humidityChart.update();


        // ==================================================
        // UPDATE HEALTH + ALERTS
        // ==================================================

        updateBridgeHealth();

        updateAlerts();


        // ==================================================
        // UPDATE OPEN SENSOR DETAILS
        // ==================================================

        if (openedSensor) {

            const item =
                sensorData[
                    openedSensor
                ];


            const status =
                getSensorStatus(
                    openedSensor,
                    item.current
                );


            const previous =
                document.getElementById(
                    "previous"
                );


            const current =
                document.getElementById(
                    "current"
                );


            const statusElement =
                document.getElementById(
                    "status"
                );


            if (previous) {

                previous.innerText =
                    item.previous
                        .toFixed(2)
                    + item.unit;
            }


            if (current) {

                current.innerText =
                    item.current
                        .toFixed(2)
                    + item.unit;
            }


            if (statusElement) {

                statusElement.innerText =
                    status;
            }

        }


        // CONSOLE

        console.log(
            "ESP8266 DATA:",
            data
        );

    }


    catch (error) {

        console.error(
            "ESP8266 CONNECTION ERROR:",
            error
        );


        const overallStatus =
            document.getElementById(
                "overallStatus"
            );


        if (overallStatus) {

            overallStatus.innerText =
                "ESP OFFLINE";


            overallStatus.className =
                "danger-text";
        }

    }

}


// ======================================================
// GET REAL SENSOR DATA EVERY 1 SECOND
// ======================================================

getESP8266Data();


setInterval(
    getESP8266Data,
    1000
);


// ======================================================
// ALERT SYSTEM
// ======================================================

function updateAlerts() {

    const alertList =
        document.getElementById(
            "alertList"
        );


    if (!alertList) {

        return;
    }


    alertList.innerHTML = "";


    // SENSOR STATUS

    const tiltStatus =
        getSensorStatus(
            "tilt",
            sensorData.tilt.current
        );


    const vibrationStatus =
        getSensorStatus(
            "vibration",
            sensorData.vibration.current
        );


    const temperatureStatus =
        getSensorStatus(
            "temperature",
            sensorData.temperature.current
        );


    const humidityStatus =
        getSensorStatus(
            "humidity",
            sensorData.humidity.current
        );


    // ALL SAFE

    if (

        tiltStatus === "SAFE" &&

        vibrationStatus === "SAFE" &&

        temperatureStatus === "SAFE" &&

        humidityStatus === "SAFE"

    ) {

        alertList.innerHTML =
            "<li>✅ All monitored parameters are within safe limits.</li>";

        return;
    }


    // TILT ALERT

    if (
        tiltStatus !== "SAFE"
    ) {

        alertList.innerHTML +=

            `<li>⚠️ Tilt level is ${tiltStatus.toLowerCase()}.</li>`;
    }


    // VIBRATION ALERT

    if (
        vibrationStatus !== "SAFE"
    ) {

        alertList.innerHTML +=

            `<li>⚠️ Vibration level is ${vibrationStatus.toLowerCase()}.</li>`;
    }


    // TEMPERATURE ALERT

    if (
        temperatureStatus !== "SAFE"
    ) {

        alertList.innerHTML +=

            `<li>⚠️ Temperature level is ${temperatureStatus.toLowerCase()}.</li>`;
    }


    // HUMIDITY ALERT

    if (
        humidityStatus !== "SAFE"
    ) {

        alertList.innerHTML +=

            `<li>⚠️ Humidity level is ${humidityStatus.toLowerCase()}.</li>`;
    }

}


// ======================================================
// DATE & TIME
// ======================================================

function updateDateTime() {

    const now =
        new Date();


    const dateElement =
        document.getElementById(
            "date"
        );


    const timeElement =
        document.getElementById(
            "time"
        );


    if (dateElement) {

        dateElement.innerText =
            now.toLocaleDateString();
    }


    if (timeElement) {

        timeElement.innerText =
            now.toLocaleTimeString();
    }

}


updateDateTime();


setInterval(
    updateDateTime,
    1000
);


// ======================================================
// INITIALIZE
// ======================================================

updateBridgeHealth();

updateAlerts();


// ======================================================
// LIVE WEATHER + FORECAST
// ======================================================

const bridgeLatitude =
    12.9141;


const bridgeLongitude =
    74.8560;


async function updateWeather() {

    const currentBox =
        document.getElementById(
            "weatherCurrent"
        );


    const forecastBox =
        document.getElementById(
            "weatherForecast"
        );


    if (
        !currentBox ||
        !forecastBox
    ) {

        return;
    }


    try {

        const url =

            `https://api.open-meteo.com/v1/forecast?` +

            `latitude=${bridgeLatitude}` +

            `&longitude=${bridgeLongitude}` +

            `&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m` +

            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +

            `&timezone=auto` +

            `&forecast_days=5`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Weather API failed"
            );
        }


        const data =
            await response.json();


        const current =
            data.current;


        // ==================================================
        // CURRENT WEATHER
        // ==================================================

        currentBox.innerHTML = `

            <div class="currentWeather">

                <strong>

                    ${weatherName(
                        current.weather_code
                    )}

                </strong>


                <div class="currentTemperature">

                    ${current.temperature_2m}°C

                </div>


                <div>

                    Humidity:

                    ${current.relative_humidity_2m}%

                </div>


                <div>

                    Wind:

                    ${current.wind_speed_10m} km/h

                </div>

            </div>

        `;


        // ==================================================
        // 5-DAY FORECAST
        // ==================================================

        let forecastHTML = `

            <div class="forecastTitle">

                5-Day Forecast

            </div>

        `;


        for (

            let i = 0;

            i < data.daily.time.length;

            i++

        ) {

            const date =

                new Date(
                    data.daily.time[i]
                );


            const day =

                date.toLocaleDateString(

                    "en-US",

                    {
                        weekday:
                            "short"
                    }

                );


            forecastHTML += `

                <div class="forecastItem">

                    <strong>

                        ${day}

                    </strong>


                    <span>

                        ${weatherName(
                            data.daily.weather_code[i]
                        )}

                    </span>


                    <span>

                        ${data.daily.temperature_2m_max[i]}°

                        /

                        ${data.daily.temperature_2m_min[i]}°

                    </span>


                    <small>

                        Rain:

                        ${data.daily.precipitation_probability_max[i]}%

                    </small>

                </div>

            `;

        }


        forecastBox.innerHTML =
            forecastHTML;

    }


    catch (error) {

        console.error(
            "WEATHER ERROR:",
            error
        );


        currentBox.innerHTML =
            "⚠️ Unable to load weather";


        forecastBox.innerHTML =
            "Forecast unavailable";
    }

}


// ======================================================
// WEATHER DESCRIPTION
// ======================================================

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


// ======================================================
// START WEATHER
// ======================================================

updateWeather();


// ======================================================
// REFRESH WEATHER EVERY 10 MINUTES
// ======================================================

setInterval(
    updateWeather,
    600000
);