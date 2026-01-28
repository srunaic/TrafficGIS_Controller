/**
 * Map Logic for QGIS-centric Web GIS
 */

// 1. Initialize Map
const map = L.map('map', {
    center: [37.5665, 126.9780],
    zoom: 12,
    zoomControl: false
});

// Add Zoom Control to Bottom Right
L.control.zoom({ position: 'bottomright' }).addTo(map);

// 2. Base Layers (OSM)
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 3. Layer Groups
const routeLayerGroup = L.layerGroup().addTo(map);
const stopLayerGroup = L.layerGroup().addTo(map);

// 4. Data Loading Logic
function loadData() {
    const routes = window.QGIS_Output.getRoutes();
    const stops = window.QGIS_Output.getStops();

    // Render Routes
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

    // Render Stops
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

// 5. Sidebar Interaction
function populateSidebar(routes) {
    const list = document.getElementById('route-list');
    list.innerHTML = '';

    routes.features.forEach(feature => {
        const item = document.createElement('div');
        item.style.padding = '12px';
        item.style.background = '#f8fafc';
        item.style.borderRadius = '8px';
        item.style.cursor = 'pointer';
        item.style.marginBottom = '8px';
        item.style.border = '1px solid #e2e8f0';

        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="width: 4px; height: 16px; background: ${feature.properties.color}"></div>
                <div style="font-weight: 600; font-size: 0.9rem;">${feature.properties.route_nm}</div>
            </div>
            <div style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">ID: ${feature.properties.route_id}</div>
        `;

        item.onclick = () => {
            // Find and zoom to route (simplified)
            map.fitBounds(L.geoJSON(feature).getBounds());
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active')); // UI feedback simplified
        };
        list.appendChild(item);
    });
}

// Tab Switching Logic
document.querySelectorAll('.tab-btn').forEach(button => {
    button.onclick = () => {
        const tab = button.getAttribute('data-tab');
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

        button.classList.add('active');
        document.getElementById(`${tab}-panel`).classList.add('active');
    };
});

// 6. Initialize
loadData();
