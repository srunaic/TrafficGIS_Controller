/**
 * Map Logic for QGIS-centric Web GIS - Real-time Edition
 */

// 1. Initialize Map
const map = L.map('map', {
    center: [37.5665, 126.9780],
    zoom: 12,
    zoomControl: false
});

L.control.zoom({ position: 'bottomright' }).addTo(map);

// 2. Base Layers
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Layer Groups
const routeLayerGroup = L.layerGroup().addTo(map);
const stopLayerGroup = L.layerGroup().addTo(map);
const trafficLayerGroup = L.layerGroup().addTo(map);

let currentTrafficLayer;
let currentTrafficTime = '08';

// 4. Data Loading Logic
function loadInitialData() {
    refreshTransit();
    fetchTrafficData(); // Initial load
}

function refreshTransit() {
    routeLayerGroup.clearLayers();
    stopLayerGroup.clearLayers();

    const routes = window.QGIS_Output.getRoutes();
    const stops = window.QGIS_Output.getStops();

    L.geoJSON(routes, {
        style: (feature) => ({
            color: feature.properties.color || '#3388ff',
            weight: 4,
            opacity: 0.7
        }),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>노선명: ${feature.properties.route_nm}</strong><br>ID: ${feature.properties.route_id}`);
        }
    }).addTo(routeLayerGroup);

    L.geoJSON(stops, {
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
                radius: 6,
                fillColor: "#ffffff",
                color: "#3b82f6",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>정류장: ${feature.properties.stop_nm}</strong><br>ID: ${feature.properties.stop_id}`);
        }
    }).addTo(stopLayerGroup);

    populateSidebar(routes);
}

/**
 * Real-time Traffic Fetching Logic (Bbox + Time)
 */
function fetchTrafficData() {
    const bbox = map.getBounds().toBBoxString(); // minLng,minLat,maxLng,maxLat

    console.log(`Fetching traffic for: ${currentTrafficTime}, Bbox: ${bbox}`);

    fetch(`/api/traffic?time=${currentTrafficTime}&bbox=${bbox}`)
        .then(res => res.json())
        .then(data => {
            if (currentTrafficLayer) {
                trafficLayerGroup.removeLayer(currentTrafficLayer);
            }

            currentTrafficLayer = L.geoJSON(data, {
                style: (feature) => ({
                    color: getTrafficColor(feature.properties.congestion),
                    weight: 6,
                    opacity: 0.8,
                    lineJoin: 'round'
                }),
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(`
                        <div class="traffic-popup">
                            <h3>🚦 도로 체증 정보</h3>
                            <p><strong>링크 ID:</strong> ${feature.properties.link_id}</p>
                            <p><strong>상태:</strong> <span style="color:${getTrafficColor(feature.properties.congestion)}">${feature.properties.congestion}</span></p>
                            <p><strong>평균 속도:</strong> ${feature.properties.avg_speed} km/h</p>
                            <p><strong>갱신 시각:</strong> ${new Date(feature.properties.timestamp).toLocaleTimeString()}</p>
                        </div>
                    `);
                }
            }).addTo(trafficLayerGroup);

            updateDataStatus(`Traffic Updated: ${data.features.length} links`);
        })
        .catch(err => console.error('Traffic API Error:', err));
}

function getTrafficColor(level) {
    switch (level) {
        case '정체': return '#dc2626'; // Red
        case '서행': return '#f59e0b'; // Orange
        case '원활': return '#10b981'; // Green
        default: return '#94a3b8';
    }
}

function updateDataStatus(msg) {
    const statusText = document.querySelector('.data-status span');
    if (statusText) statusText.innerText = msg;
}

// 5. Sidebar & UI Events
function populateSidebar(routes) {
    const list = document.getElementById('route-list');
    list.innerHTML = '';
    routes.features.forEach(feature => {
        const item = document.createElement('div');
        item.className = 'route-item-custom';
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 4px; height: 16px; background: ${feature.properties.color}"></div>
                <div style="font-weight: 600; font-size: 0.9rem;">${feature.properties.route_nm}</div>
            </div>
        `;
        item.onclick = () => map.fitBounds(L.geoJSON(feature).getBounds());
        list.appendChild(item);
    });
}

// Time Slider
const timeSlider = document.getElementById('time-slider');
const timeBadge = document.getElementById('selected-time');

timeSlider.oninput = () => {
    let hour = timeSlider.value.padStart(2, '0');
    timeBadge.innerText = `${hour}:00`;
    currentTrafficTime = hour;
    fetchTrafficData();
};

// 6. Real-time Events
// A. Map Move End -> Refresh Bbox Data
map.on('moveend', () => {
    fetchTrafficData();
});

// B. Auto Refresh (Every 5 minutes)
setInterval(() => {
    console.log('Auto-refreshing traffic data...');
    fetchTrafficData();
}, 300000);

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.onclick = () => {
        const tab = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(`${tab}-panel`).classList.add('active');
    };
});

// 7. Initialize
loadInitialData();
