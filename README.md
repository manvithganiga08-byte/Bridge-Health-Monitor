# 🌉 Bridge Health Monitor

A web-based bridge health monitoring dashboard designed to visualize sensor data and provide a simple indication of bridge condition.

## 📌 Overview

Bridge Health Monitor is a prototype dashboard for monitoring important bridge parameters such as:

- Tilt
- Vibration
- Temperature
- Humidity

The system calculates an overall bridge health score based on the sensor readings and displays the condition as **Safe, Warning, or Critical**.

> Note: The current version uses simulated sensor data. The system is designed to be connected to an ESP32 in the future for real-time sensor readings.

## ✨ Features

- 📊 Overall bridge health score
- 📈 Live sensor graphs
- 🌡️ Temperature monitoring
- 💧 Humidity monitoring
- 🧭 Tilt monitoring
- 📳 Vibration monitoring
- ⚠️ System alerts
- 🌓 Dark / Light mode
- 🕐 Live date and time
- 🌦️ Current weather information
- 📅 5-day weather forecast
- 📋 Sensor details with previous, current and maximum safe values
- 📱 Responsive web interface

## 🧮 Health Score

The dashboard calculates the bridge health score using weighted sensor values:

- Tilt — 40%
- Vibration — 30%
- Temperature — 15%
- Humidity — 15%

The resulting score is classified as:

| Health Score | Condition |
|---|---|
| 70–100 | SAFE |
| 40–69 | WARNING |
| 0–39 | CRITICAL |

## 🔔 Alerts

The system checks sensor values against predefined safe limits and generates alerts when a parameter enters a warning or danger range.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js
- Font Awesome
- Open-Meteo Weather API

## 📁 Project Structure

```text
Bridge-Health-Monitor/
│
├── index.html
├── style.css
└── script.js
