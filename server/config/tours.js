const TOURS = [
  {
    id: "sahara-desert",
    name: "Sahara Desert Adventure",
    price: 299,
    duration: "3 days / 2 nights",
    description: "Experience the magic of the Sahara",
  },
  {
    id: "atlas-mountains",
    name: "Atlas Mountains Trek",
    price: 199,
    duration: "2 days / 1 night",
    description: "Hike through stunning mountain landscapes",
  },
  {
    id: "coastal-explorer",
    name: "Coastal Explorer",
    price: 249,
    duration: "2 days / 1 night",
    description: "Discover Morocco's beautiful coastline",
  },
  {
    id: "marrakech-culture",
    name: "Marrakech Cultural Tour",
    price: 149,
    duration: "1 day",
    description: "Immerse yourself in local culture",
  },
];

function getTourById(id) {
  return TOURS.find((tour) => tour.id === id);
}

function calculatePrice(basePrice, numberOfPeople) {
  let total = basePrice * numberOfPeople;

  if (numberOfPeople >= 4) {
    total *= 0.9;
  }

  return Math.round(total);
}

module.exports = { TOURS, getTourById, calculatePrice };
