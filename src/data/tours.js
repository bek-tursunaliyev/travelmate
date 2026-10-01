// Tour packages listed on /tours. SAMPLE DATA: packages, itineraries and prices are illustrative
// placeholders — replace them with each operator's real offer before going live.
// Prices are "from", per person in USD, for 2+ travellers. `wiki` is the photo source.
// `included` / `excluded` / `transport` / `stay` are keys translated under tours.*.

export const tourCities = ['tashkent', 'samarkand', 'bukhara', 'khiva']

export const operators = [
  { id: 'advantour', name: 'Advantour', city: 'tashkent' },
  { id: 'global-connect', name: 'GLOBAL CONNECT', city: 'samarkand' },
  { id: 'afsona-travel', name: 'Afsona Travel LLC', city: 'tashkent' },
  { id: 'travel-system', name: 'Travel System Uzbekistan', city: 'tashkent' },
  { id: 'union-travel', name: 'Union Travel Uzbekistan', city: 'samarkand' },
  { id: 'oasis-travel', name: 'Tours to Uzbekistan-Oasis Travel Int.', city: 'tashkent' },
  { id: 'islambek-travel', name: 'Islambek Travel', city: 'khiva' },
  { id: 'talisman-tour', name: 'Talisman Tour', city: 'tashkent' },
  { id: 'tour-uzbekistan', name: 'Tour Uzbekistan Tour Operator', city: 'samarkand' },
  { id: 'minzifa-travel', name: 'Minzifa Travel', city: 'bukhara' },
  { id: 'tourist-uz', name: 'Tourist.uz', city: 'tashkent' },
  { id: 'stanadventure', name: 'StanAdventure - Uzbekistan Tours', city: 'tashkent' },
  { id: 'silk-road-voyages', name: 'SILK ROAD VOYAGES DMS Uzbekistan', city: 'bukhara' },
  { id: 'anur-tour', name: 'Anur Tour - Tours to Uzbekistan & Central Asia', city: 'tashkent' },
  { id: 'dolores-travel', name: 'Dolores Travel Group', city: 'tashkent' },
]

export const operatorById = Object.fromEntries(operators.map((o) => [o.id, o]))

const BASE_INCLUDED = ['hotels', 'breakfast', 'transfers', 'guide', 'entrance']
const BASE_EXCLUDED = ['intlFlights', 'visa', 'insurance', 'lunchDinner', 'tips']

export const tours = [
  {
    slug: 'classic-uzbekistan', operator: 'advantour', title: 'Classic Uzbekistan', days: 8, price: 890,
    wiki: 'Registan', route: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'], group: 'small', stay: 'comfort',
    transport: ['train', 'flight', 'car'], season: 'Mar – Nov',
    highlights: ['Registan square at sunset', 'Old Bukhara trading domes', 'Itchan Kala inside Khiva’s walls', 'Afrosiyob high-speed train'],
    itinerary: [
      ['Arrival in Tashkent', 'Airport meeting, Khast Imam complex, Chorsu bazaar and the metro stations.'],
      ['Tashkent → Samarkand', 'Morning Afrosiyob train. Registan, Gur-e-Amir and Bibi-Khanym Mosque.'],
      ['Samarkand', 'Shah-i-Zinda necropolis, Ulugh Beg Observatory and a paper-making workshop.'],
      ['Samarkand → Bukhara', 'Train to Bukhara. Lyab-i Hauz and the trading domes in the evening.'],
      ['Bukhara', 'Ark fortress, Po-i-Kalyan, Samanid Mausoleum and Chor Minor.'],
      ['Bukhara → Khiva', 'Drive across the Kyzylkum desert with a stop at the Amu Darya river.'],
      ['Khiva', 'Full day in Itchan Kala: Kalta Minor, Tash-Hauli palace and the city walls.'],
      ['Departure', 'Flight from Urgench to Tashkent and onward connection.'],
    ],
    included: [...BASE_INCLUDED, 'train', 'flight'], excluded: BASE_EXCLUDED,
  },
  {
    slug: 'samarkand-shahrisabz', operator: 'global-connect', title: 'Samarkand & Shahrisabz', days: 3, price: 260,
    wiki: 'Ak-Saray_Palace', route: ['Samarkand', 'Shahrisabz'], group: 'private', stay: 'comfort',
    transport: ['car'], season: 'All year',
    highlights: ['Amir Temur’s Ak-Saray palace', 'Takhtakaracha mountain pass', 'Samarkand’s three madrasas'],
    itinerary: [
      ['Samarkand', 'Registan, Gur-e-Amir and Siyob bazaar.'],
      ['Day trip to Shahrisabz', 'Scenic drive over the Takhtakaracha pass to Ak-Saray and Dorut Tilavat.'],
      ['Samarkand → departure', 'Shah-i-Zinda in the morning light, then transfer.'],
    ],
    included: BASE_INCLUDED, excluded: BASE_EXCLUDED,
  },
  {
    slug: 'silk-road-highlights', operator: 'afsona-travel', title: 'Silk Road Highlights', days: 5, price: 540,
    wiki: 'Po-i-Kalyan', route: ['Tashkent', 'Samarkand', 'Bukhara'], group: 'small', stay: 'comfort',
    transport: ['train', 'car'], season: 'Mar – Nov',
    highlights: ['Three Silk Road cities in five days', 'Afrosiyob train between cities', 'Plov cooking class'],
    itinerary: [
      ['Tashkent', 'Arrival, Amir Temur square and Chorsu bazaar.'],
      ['Tashkent → Samarkand', 'Train to Samarkand, Registan and Gur-e-Amir.'],
      ['Samarkand', 'Shah-i-Zinda, Bibi-Khanym and a plov cooking class.'],
      ['Samarkand → Bukhara', 'Train to Bukhara, walk through the old town.'],
      ['Bukhara → departure', 'Ark fortress and Po-i-Kalyan, train back to Tashkent.'],
    ],
    included: [...BASE_INCLUDED, 'train'], excluded: BASE_EXCLUDED,
  },
  {
    slug: 'tashkent-mountains', operator: 'travel-system', title: 'Tashkent City & Mountains', days: 4, price: 340,
    wiki: 'Charvak_Reservoir', route: ['Tashkent', 'Chimgan', 'Charvak'], group: 'private', stay: 'comfort',
    transport: ['car'], season: 'May – Oct',
    highlights: ['Cable car up Chimgan', 'Lake Charvak shore', 'Modern and Soviet Tashkent'],
    itinerary: [
      ['Tashkent', 'Arrival and a relaxed city walk.'],
      ['Chimgan mountains', 'Drive to Chimgan, cable car and an easy hike.'],
      ['Lake Charvak', 'Lake day with lunch on the shore.'],
      ['Departure', 'Tashkent metro tour and transfer to the airport.'],
    ],
    included: BASE_INCLUDED, excluded: BASE_EXCLUDED,
  },
  {
    slug: 'samarkand-weekend', operator: 'union-travel', title: 'Samarkand Heritage Weekend', days: 2, price: 180,
    wiki: 'Shah-i-Zinda', route: ['Samarkand'], group: 'private', stay: 'comfort',
    transport: ['walking', 'car'], season: 'All year',
    highlights: ['Registan light show', 'Shah-i-Zinda tilework', 'Meros paper mill'],
    itinerary: [
      ['Samarkand', 'Registan, Gur-e-Amir and the evening light show.'],
      ['Samarkand', 'Shah-i-Zinda, Ulugh Beg Observatory and the Meros paper mill.'],
    ],
    included: BASE_INCLUDED, excluded: BASE_EXCLUDED,
  },
  {
    slug: 'great-silk-road', operator: 'oasis-travel', title: 'Great Silk Road Grand Tour', days: 12, price: 1490,
    wiki: 'Khiva', route: ['Tashkent', 'Fergana', 'Samarkand', 'Nurata', 'Bukhara', 'Khiva'], group: 'small', stay: 'comfort',
    transport: ['train', 'flight', 'car'], season: 'Apr – Oct',
    highlights: ['Fergana Valley silk and ceramics', 'Night in a desert yurt camp', 'All four Silk Road cities'],
    itinerary: [
      ['Arrival in Tashkent', 'Airport meeting and city tour.'],
      ['Tashkent → Fergana Valley', 'Train over the Kamchik pass to Kokand and the Khudayar Khan palace.'],
      ['Fergana Valley', 'Rishtan ceramics and Margilan silk factory.'],
      ['Fergana → Tashkent', 'Return train and free evening.'],
      ['Tashkent → Samarkand', 'Afrosiyob train, Registan and Gur-e-Amir.'],
      ['Samarkand', 'Shah-i-Zinda, Bibi-Khanym and Siyob bazaar.'],
      ['Samarkand → Nurata', 'Drive to Nurata, overnight in a yurt camp near Aydar Lake.'],
      ['Nurata → Bukhara', 'Camel ride at sunrise, drive to Bukhara.'],
      ['Bukhara', 'Ark fortress, Po-i-Kalyan and the trading domes.'],
      ['Bukhara → Khiva', 'Desert drive along the Amu Darya.'],
      ['Khiva', 'Itchan Kala and its minarets.'],
      ['Departure', 'Flight from Urgench to Tashkent.'],
    ],
    included: [...BASE_INCLUDED, 'train', 'flight', 'yurt'], excluded: BASE_EXCLUDED,
  },
  {
    slug: 'khiva-desert-fortresses', operator: 'islambek-travel', title: 'Khiva & Desert Fortresses', days: 3, price: 290,
    wiki: 'Itchan_Kala', route: ['Urgench', 'Khiva', 'Ayaz-Kala'], group: 'private', stay: 'guesthouse',
    transport: ['offroad', 'car'], season: 'Mar – Nov',
    highlights: ['Itchan Kala at sunrise', 'Ancient Khorezm fortresses', 'Dinner in a local family'],
    itinerary: [
      ['Khiva', 'Arrival in Urgench, afternoon in Itchan Kala.'],
      ['Desert fortresses', 'Off-road trip to Ayaz-Kala and Toprak-Kala.'],
      ['Khiva → departure', 'Morning on the city walls, transfer to Urgench.'],
    ],
    included: [...BASE_INCLUDED, 'dinner'], excluded: BASE_EXCLUDED.filter((k) => k !== 'lunchDinner'),
  },
  {
    slug: 'fergana-valley-crafts', operator: 'talisman-tour', title: 'Fergana Valley Crafts', days: 5, price: 520,
    wiki: 'Palace_of_Khudayar_Khan', route: ['Tashkent', 'Kokand', 'Rishtan', 'Margilan', 'Fergana'], group: 'small', stay: 'comfort',
    transport: ['train', 'car'], season: 'Apr – Oct',
    highlights: ['Hands-on ceramics in Rishtan', 'Ikat silk weaving in Margilan', 'Khudayar Khan palace'],
    itinerary: [
      ['Tashkent → Kokand', 'Train over the Kamchik pass, Khudayar Khan palace.'],
      ['Rishtan', 'Ceramics masters and a pottery class.'],
      ['Margilan', 'Yodgorlik silk factory and Kumtepa bazaar.'],
      ['Fergana', 'City walk and local cuisine.'],
      ['Fergana → Tashkent', 'Return train and departure.'],
    ],
    included: [...BASE_INCLUDED, 'train', 'workshops'], excluded: BASE_EXCLUDED,
  },
  {
    slug: 'uzbekistan-in-a-week', operator: 'tour-uzbekistan', title: 'Uzbekistan in a Week', days: 7, price: 790,
    wiki: 'Gur-e-Amir', route: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'], group: 'small', stay: 'comfort',
    transport: ['train', 'car'], season: 'Mar – Nov',
    highlights: ['Four cities in seven days', 'Evening in Bukhara’s old town', 'Khiva’s Kalta Minor'],
    itinerary: [
      ['Tashkent', 'Arrival and city tour.'],
      ['Samarkand', 'Morning train, Registan and Gur-e-Amir.'],
      ['Samarkand', 'Shah-i-Zinda and Ulugh Beg Observatory.'],
      ['Bukhara', 'Train to Bukhara, Lyab-i Hauz.'],
      ['Bukhara', 'Ark, Po-i-Kalyan and the trading domes.'],
      ['Khiva', 'Drive to Khiva through the desert.'],
      ['Khiva → departure', 'Itchan Kala walk and transfer.'],
    ],
    included: [...BASE_INCLUDED, 'train'], excluded: BASE_EXCLUDED,
  },
  {
    slug: 'bukhara-slow-travel', operator: 'minzifa-travel', title: 'Bukhara Slow Travel', days: 4, price: 360,
    wiki: 'Ark_of_Bukhara', route: ['Bukhara'], group: 'private', stay: 'guesthouse',
    transport: ['walking', 'car'], season: 'All year',
    highlights: ['Boutique stay in a merchant’s house', 'Suzani and blacksmith workshops', 'Sitorai Mohi-Xosa palace'],
    itinerary: [
      ['Bukhara', 'Arrival and an evening at Lyab-i Hauz.'],
      ['Bukhara', 'Ark fortress, Bolo-Hauz and Po-i-Kalyan.'],
      ['Crafts day', 'Suzani embroidery and blacksmith workshops.'],
      ['Bukhara → departure', 'Sitorai Mohi-Xosa summer palace and transfer.'],
    ],
    included: [...BASE_INCLUDED, 'workshops'], excluded: BASE_EXCLUDED,
  },
  {
    slug: 'budget-silk-road-train', operator: 'tourist-uz', title: 'Budget Silk Road by Train', days: 6, price: 420,
    wiki: 'Bibi-Khanym_Mosque', route: ['Tashkent', 'Samarkand', 'Bukhara'], group: 'small', stay: 'guesthouse',
    transport: ['train', 'walking'], season: 'All year',
    highlights: ['Every leg by train', 'Family-run guesthouses', 'Local street food'],
    itinerary: [
      ['Tashkent', 'Arrival and metro tour.'],
      ['Tashkent → Samarkand', 'Train, Registan and Siyob bazaar.'],
      ['Samarkand', 'Shah-i-Zinda and Bibi-Khanym.'],
      ['Samarkand → Bukhara', 'Train and an old-town walk.'],
      ['Bukhara', 'Ark fortress and the trading domes.'],
      ['Bukhara → Tashkent', 'Return train and departure.'],
    ],
    included: ['hotels', 'breakfast', 'train', 'guide'], excluded: [...BASE_EXCLUDED, 'entrance'],
  },
  {
    slug: 'desert-yurt-aydar-lake', operator: 'stanadventure', title: 'Desert Yurt & Aydar Lake', days: 3, price: 250,
    wiki: 'Aydar_Lake', route: ['Samarkand', 'Nurata', 'Aydar Lake'], group: 'small', stay: 'yurt',
    transport: ['offroad', 'car'], season: 'Apr – Oct',
    highlights: ['Night under the stars in a yurt', 'Camel ride in the Kyzylkum', 'Swim in Aydar Lake'],
    itinerary: [
      ['Samarkand → Nurata', 'Drive to Nurata fortress, then on to the yurt camp.'],
      ['Aydar Lake', 'Camel ride, swim in the lake and an evening around the campfire.'],
      ['Return', 'Drive back to Samarkand or Bukhara.'],
    ],
    included: ['yurt', 'allMeals', 'transfers', 'guide', 'camel'], excluded: ['intlFlights', 'visa', 'insurance', 'tips'],
  },
  {
    slug: 'bukhara-khiva-caravan', operator: 'silk-road-voyages', title: 'Bukhara – Khiva Caravan Route', days: 4, price: 410,
    wiki: 'Lyab-i_Hauz', route: ['Bukhara', 'Kyzylkum', 'Khiva'], group: 'private', stay: 'comfort',
    transport: ['car'], season: 'Mar – Nov',
    highlights: ['Follow the old caravan road', 'Two oasis cities', 'Picnic by the Amu Darya'],
    itinerary: [
      ['Bukhara', 'Old town walk and the trading domes.'],
      ['Bukhara', 'Ark, Po-i-Kalyan and Chor Minor.'],
      ['Bukhara → Khiva', 'Desert drive with a picnic by the Amu Darya.'],
      ['Khiva → departure', 'Itchan Kala and transfer to Urgench.'],
    ],
    included: BASE_INCLUDED, excluded: BASE_EXCLUDED,
  },
  {
    slug: 'ugam-chatkal-hiking', operator: 'anur-tour', title: 'Ugam-Chatkal Hiking', days: 5, price: 480,
    wiki: 'Ugam-Chatkal_National_Park', route: ['Tashkent', 'Chimgan', 'Ugam-Chatkal'], group: 'small', stay: 'guesthouse',
    transport: ['car', 'walking'], season: 'May – Sep',
    highlights: ['Hikes in Ugam-Chatkal National Park', 'Mountain guesthouses', 'Beldersay and Chimgan peaks'],
    itinerary: [
      ['Tashkent → Chimgan', 'Drive to the mountains, warm-up hike.'],
      ['Chimgan', 'Full-day hike with views of the Chatkal range.'],
      ['Ugam-Chatkal', 'Trek to mountain waterfalls.'],
      ['Ugam-Chatkal', 'Lake hike and picnic.'],
      ['Return to Tashkent', 'Drive back and departure.'],
    ],
    included: ['hotels', 'allMeals', 'transfers', 'guide', 'entrance'], excluded: ['intlFlights', 'visa', 'insurance', 'tips'],
  },
  {
    slug: 'luxury-uzbekistan', operator: 'dolores-travel', title: 'Luxury Uzbekistan', days: 9, price: 1890,
    wiki: 'Bukhara', route: ['Tashkent', 'Samarkand', 'Bukhara', 'Khiva'], group: 'private', stay: 'luxury',
    transport: ['train', 'flight', 'car'], season: 'All year',
    highlights: ['5★ hotels throughout', 'Private dinner in a Bukhara madrasa', 'Business class Afrosiyob train'],
    itinerary: [
      ['Tashkent', 'VIP airport meeting and private city tour.'],
      ['Tashkent', 'Museum of Applied Arts and a gourmet dinner.'],
      ['Samarkand', 'Business class train, Registan and Gur-e-Amir.'],
      ['Samarkand', 'Shah-i-Zinda and a private paper-making session.'],
      ['Bukhara', 'Train to Bukhara, sunset at Po-i-Kalyan.'],
      ['Bukhara', 'Ark fortress and a private dinner in a madrasa.'],
      ['Khiva', 'Flight to Urgench, Itchan Kala by evening.'],
      ['Khiva', 'Desert fortresses and a farewell dinner.'],
      ['Departure', 'Flight to Tashkent and VIP transfer.'],
    ],
    included: [...BASE_INCLUDED, 'train', 'flight', 'allMeals'], excluded: BASE_EXCLUDED.filter((k) => k !== 'lunchDinner'),
  },
]

export const tourBySlug = Object.fromEntries(tours.map((t) => [t.slug, t]))

export const DEPOSIT_RATE = 0.3
export const MAX_TRAVELERS = 12
// Earliest start date offered, so the operator has time to arrange hotels and trains.
export const LEAD_DAYS = 7

export const durationFilters = [
  { id: 'short', test: (d) => d <= 3 },
  { id: 'medium', test: (d) => d >= 4 && d <= 7 },
  { id: 'long', test: (d) => d >= 8 },
]
