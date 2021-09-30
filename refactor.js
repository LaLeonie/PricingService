// ============ BRIEF ============
//
// Refactor the PricingService class below to improve its readability, performance and safety.
//
// The intended functionality of the service is to calculate the prices for a given list of meeting rooms and meeting
// lengths, based upon per [min|hour|day|week] tariffs. For example:
//
//   - If the length of the proposed meeting is greater than an hour and less than a day, the hourly tariff is used.
//
//   - If the length of the proposed meeting is precisely a day, the daily tariff is used. The same applies for each tariff.
//
// ============ NOTES ============
//
// - Feel free to add your own classes if you think it improves clarity.
//
// - Feel free to add test cases to aid your refactor, you <i>may</i> even find some bugs!
//
// - The tests are ran using an inMemory database. However, once in production a SQL implementation will be injected with the same API.
//
// ============ TESTING ==========
//
// To test the sample, with the latest version of node installed (https://nodejs.org), run "node ./refactor.js".
//
// CHANGE CODE BELOW THIS LINE

const MINUTE = 1;
const HOUR = 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;

const calculatePrice = (length, rates) => {
  let price = 0;
  if (!rates) {
    return price;
  }

  if (length >= WEEK) {
    price += Math.floor(length / WEEK) * rates[4];
    length = length % WEEK;
  }

  if (length >= DAY) {
    price += Math.floor(length / DAY) * rates[3];
    length = length % DAY;
  }

  if (length >= HOUR) {
    price += Math.floor(length / HOUR) * rates[2];
    length = length % HOUR;
  }

  price += length * rates[2];
  return price;
};

class PricingService {
  constructor(pricingRulesDatabase) {
    this.pricingRulesDatabase = pricingRulesDatabase;
  }

  //takes array of objects [{id, lengthInMins}, ...]
  //returns array of integers
  getPrices(pricingRequest) {
    const database = this.pricingRulesDatabase;
    const prices = [];
    for (let i = 0; i < pricingRequest.length; i++) {
      const tarrifs = database.getPricingForId(pricingRequest[i].id); //array of tarrifs
      const length = pricingRequest[i].lengthInMins;
      const price = calculatePrice(length, tarrifs);
      prices.push(price);
    }

    return prices;
  }
}

// READ-ONLY CLASS
// Don't change any code in this class, but do pay attention to the available methods!
class InMemoryPricingRulesDatabase {
  constructor(initRows) {
    this.rows = initRows;
  }

  getPricingForId(roomId) {
    return this.rows.find((row) => row[0] === roomId);
  }

  getPricing(roomIds) {
    return this.rows.filter((row) => roomIds.includes(row[0]));
  }
}

// ======= TESTS =======
// Setup
console.log("--- Running test cases ---");
var seedData = [
  [3, 2, 22, 60, 105],
  [4, 4, 40, 70, 150],
];
const database = new InMemoryPricingRulesDatabase(seedData);
const service = new PricingService(database);

// ===== TEST CASES =====

// One day
console.log(
  service.getPrices([{ id: 3, lengthInMins: 60 * 24 }])[0] === 60
    ? "pass"
    : "fail"
);

// Two weeks
console.log(
  service.getPrices([{ id: 3, lengthInMins: 60 * 24 * 14 }])[0] === 105 * 2
    ? "pass"
    : "fail"
);

//Three hours in room 4
console.log(
  service.getPrices([{ id: 4, lengthInMins: 60 * 3 }])[0] === 120
    ? "pass"
    : "fail"
);

// One day in room 3 and 9 days in room 4
const firstTestArray = service.getPrices([
  { id: 3, lengthInMins: DAY },
  { id: 4, lengthInMins: DAY * 8 },
]);

console.log(
  firstTestArray[0] === 60 && firstTestArray[1] === 220 ? "pass" : "fail"
);

//One hour in room that isn't available
console.log(
  service.getPrices([{ id: 6, lengthInMins: 60 }])[0] === 0 ? "pass" : "fail"
);

//0 minutes in room 3
console.log(
  service.getPrices([{ id: 6, lengthInMins: 0 }])[0] === 0 ? "pass" : "fail"
);
