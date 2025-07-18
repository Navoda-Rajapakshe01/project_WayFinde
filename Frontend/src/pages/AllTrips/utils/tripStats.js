function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function calculateTripStats(places = []) {
  const totalSpent = places.reduce(
    (sum, place) => sum + (place.avgSpend || 0),
    0
  );

  let totalDistance = 0;

  for (let i = 0; i < places.length - 1; i++) {
    const a = places[i];
    const b = places[i + 1];

    if (a.lat && a.lng && b.lat && b.lng) {
      totalDistance += haversineDistance(a.lat, a.lng, b.lat, b.lng);
    }
  }

  return {
    totalSpent,
    totalDistance: Math.round(totalDistance),
  };
}
