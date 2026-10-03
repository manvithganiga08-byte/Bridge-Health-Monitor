# BridgeGuard

### Smart Bridge Health Monitoring System

BridgeGuard is an IoT-based bridge health monitoring system designed to continuously monitor important environmental and structural parameters and present the collected data through a web-based dashboard.

The system uses sensors connected to an ESP8266 to collect real-time bridge monitoring data. The data is transmitted to a web dashboard where sensor values, graphs, alerts, weather information, and an overall bridge condition are displayed.

## Features

- Real-time bridge condition monitoring
- Tilt monitoring using an IMU sensor
- Vibration monitoring
- Temperature monitoring
- Humidity monitoring
- ESP8266-based IoT data acquisition
- Live sensor graphs
- Automatic parameter status detection
- Bridge health score
- Warning and critical alerts
- Weather information
- Dark/Light dashboard interface
- Web-based monitoring dashboard

## Hardware Used

- ESP8266 NodeMCU
- IMU sensor
- BME280 sensor
- Connecting wires and power supply

## Software & Technologies

- HTML
- CSS
- JavaScript
- Chart.js
- ESP8266
- Arduino IDE
- REST API
- Open-Meteo Weather API

## System Architecture

```text
Sensors
   ↓
ESP8266
   ↓
Wi-Fi
   ↓
REST API
   ↓
BridgeGuard Web Dashboard
   ↓
Sensor Graphs + Alerts + Health Status
