<?php
header('Content-Type: application/json');

/**
 * Enterprise Traffic API (Mock for Docker Environment)
 * In production, this would query MariaDB using spatial functions.
 */

$time = $_GET['time'] ?? '08';
$bbox = $_GET['bbox'] ?? null;

// Simulate DB Fetch
$data = [
    '08' => [
        ['id' => 'L1', 'congestion' => '정체', 'speed' => 15, 'coords' => [[126.97, 37.56], [126.98, 37.56]]],
        ['id' => 'L2', 'congestion' => '정체', 'speed' => 12, 'coords' => [[126.98, 37.56], [126.98, 37.57]]]
    ],
    '18' => [
        ['id' => 'L1', 'congestion' => '정체', 'speed' => 10, 'coords' => [[126.97, 37.56], [126.98, 37.56]]],
        ['id' => 'L2', 'congestion' => '서행', 'speed' => 25, 'coords' => [[126.98, 37.56], [126.98, 37.57]]]
    ]
];

$selected = $data[$time] ?? $data['08'];

$features = array_map(function($item) {
    return [
        'type' => 'Feature',
        'properties' => [
            'link_id' => $item['id'],
            'congestion' => $item['congestion'],
            'avg_speed' => $item['speed']
        ],
        'geometry' => [
            'type' => 'LineString',
            'coordinates' => $item['coords']
        ]
    ];
}, $selected);

echo json_encode([
    'type' => 'FeatureCollection',
    'features' => $features
]);
