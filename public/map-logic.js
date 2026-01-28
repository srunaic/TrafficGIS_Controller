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
    refreshTransit('seoul');
    fetchTrafficData(); // Initial load
}

function refreshTransit(city = 'seoul') {
    routeLayerGroup.clearLayers();
    stopLayerGroup.clearLayers();

    const routes = window.QGIS_Output.getRoutes(city);
    // Stops could also be regional, but using global mock for now
    const stops = window.QGIS_Output.getStops();

    L.geoJSON(routes, {
        style: (feature) => ({
            color: feature.properties.color || '#3388ff',
            weight: 5,
            opacity: 0.8
        }),
        onEachFeature: (feature, layer) => {
            layer.bindPopup(`<strong>🚌 노선 정보</strong><br>노선명: ${feature.properties.route_nm}<br>ID: ${feature.properties.route_id}`);
        }
    }).addTo(routeLayerGroup);

    populateSidebar(routes);
}

/**
 * Real-time Traffic Fetching Logic (Bbox + Time)
 */
function fetchTrafficData() {
    const bbox = map.getBounds().toBBoxString(); // minLng,minLat,maxLng,maxLat

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
                    opacity: 0.9,
                    lineCap: 'round',
                    lineJoin: 'round'
                }),
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(`
                        <div class="traffic-popup">
                            <h3>🚦 도로 체증 정보</h3>
                            <p><strong>링크 ID:</strong> ${feature.properties.link_id}</p>
                            <p><strong>상태:</strong> <span style="font-weight:700; color:${getTrafficColor(feature.properties.congestion)}">${feature.properties.congestion}</span></p>
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

    if (routes.features.length === 0) {
        list.innerHTML = '<p class="empty-msg">이 지역에 등록된 노선이 없습니다.</p>';
        return;
    }

    routes.features.forEach(feature => {
        const item = document.createElement('div');
        item.style.padding = '12px';
        item.style.background = '#f8fafc';
        item.style.borderRadius = '8px';
        item.style.cursor = 'pointer';
        item.style.marginBottom = '8px';
        item.style.border = '1px solid #e2e8f0';
        item.style.transition = 'all 0.2s';

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 4px; height: 16px; background: ${feature.properties.color}"></div>
                <div style="font-weight: 600; font-size: 0.9rem;">${feature.properties.route_nm}</div>
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">ID: ${feature.properties.route_id}</div>
        `;

        item.onmouseover = () => item.style.borderColor = '#3b82f6';
        item.onmouseout = () => item.style.borderColor = '#e2e8f0';
        item.onclick = () => {
            const layer = L.geoJSON(feature);
            map.fitBounds(layer.getBounds(), { padding: [50, 50] });
        };
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
map.on('moveend', () => {
    fetchTrafficData();
});

setInterval(() => {
    fetchTrafficData();
}, 300000);

// Tab Switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.onclick = () => {
        const tab = button.getAttribute('data-tab');
        const panelId = tab === 'routes' ? 'route-panel' : `${tab}-panel`;
        const targetPanel = document.getElementById(panelId);

        if (targetPanel) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            button.classList.add('active');
            targetPanel.classList.add('active');
        }
    };
});

// Region Selection
const citySelect = document.getElementById('city-select');
const cityCoords = {
    seoul: [37.5665, 126.9780],
    busan: [35.1796, 129.0756],
    daegu: [35.8714, 128.6014],
    incheon: [37.4563, 126.7052],
    gwangju: [35.1595, 126.8526],
    daejeon: [36.3504, 127.3845]
};

citySelect.onchange = () => {
    const city = citySelect.value;
    if (cityCoords[city]) {
        map.flyTo(cityCoords[city], 13);
        // NEW: Refresh routes when region changes
        refreshTransit(city);
    }
};

// 7. Initialize
loadInitialData();
