// Private transfers from Tashkent (/transfers). Prices in USD per vehicle, not per person.
// UI data only — booking still goes through the existing useBook() flow.

export const PICKUP = 'Tashkent'

// km / hours are approximate driving distance and time from Tashkent.
export const transferDestinations = [
  { id: 'airport', name: 'Tashkent Airport (TAS)', km: 12, hours: 0.5 },
  { id: 'samarkand', name: 'Samarkand', km: 310, hours: 4 },
  { id: 'bukhara', name: 'Bukhara', km: 580, hours: 7 },
  { id: 'khiva', name: 'Khiva', km: 1000, hours: 12 },
  { id: 'fergana', name: 'Fergana', km: 320, hours: 5 },
  { id: 'kokand', name: 'Kokand', km: 230, hours: 4 },
  { id: 'shahrisabz', name: 'Shahrisabz', km: 390, hours: 6 },
  { id: 'chimgan', name: 'Chimgan', km: 85, hours: 1.5 },
  { id: 'charvak', name: 'Charvak Lake', km: 80, hours: 1.5 },
]

// `rate` is USD per km; `min` is the minimum fare for short rides.
export const vehicleClasses = [
  { id: 'economy', passengers: 3, luggage: 2, models: 'Chevrolet Cobalt / Nexia', wiki: 'Chevrolet_Cobalt', rate: 0.1, min: 9 },
  { id: 'comfort', passengers: 4, luggage: 3, models: 'Chevrolet Malibu / Kia K5', wiki: 'Kia_K5', rate: 0.14, min: 14 },
  { id: 'business', passengers: 4, luggage: 3, models: 'Mercedes E-Class / BMW 5', wiki: 'Mercedes-Benz_E-Class', rate: 0.26, min: 30 },
  { id: 'premium', passengers: 3, luggage: 3, models: 'Mercedes S-Class', wiki: 'Mercedes-Benz_S-Class', rate: 0.42, min: 55 },
  { id: 'van', passengers: 7, luggage: 7, models: 'Mercedes V-Class / Hyundai Staria', wiki: 'Mercedes-Benz_V-Class', rate: 0.22, min: 25 },
]

export const destinationById = Object.fromEntries(transferDestinations.map((d) => [d.id, d]))
export const vehicleById = Object.fromEntries(vehicleClasses.map((v) => [v.id, v]))

export const transferPrice = (vehicle, destination) =>
  Math.round(Math.max(vehicle.min, vehicle.rate * destination.km))
