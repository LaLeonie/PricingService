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
  if (!rates) {
    return 0;
  }

  if (length >= WEEK) {
    return (length / WEEK) * rates[4];
  }

  if (length >= DAY) {
    return (length / DAY) * rates[3];
  }

  if (length >= HOUR) {
    return (length / HOUR) * rates[2];
  }

  return length * rates[1];
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
      const tarrifs = database.getPricingForId(pricingRequest[i].id);
      const length = pricingRequest[i].lengthInMins;
      const price = +calculatePrice(length, tarrifs).toFixed(2);
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
const seedData = [
  [3, 2, 22, 60, 105],
  [4, 4, 40, 70, 150],
];
const database = new InMemoryPricingRulesDatabase(seedData);
const service = new PricingService(database);

// ===== TEST CASES =====
//helper functions
const testSingleRequest = (desc, { id, length }, expectedResult) => {
  console.log(
    service.getPrices([{ id, lengthInMins: length }])[0] === +expectedResult
      ? `PASS: ${desc} correctly`
      : `FAIL: ${desc} incorrectly`
  );
};

const testMultipleRequests = (desc, requestArray, resultArray) => {
  const prices = service.getPrices(requestArray);
  if (prices.length !== resultArray.length) {
    console.log(`FAIL: ${desc} incorrectly`);
    return;
  }

  if (!prices.every((p, i) => p === +resultArray[i])) {
    console.log(`FAIL: ${desc} incorrectly`);
    return;
  }

  console.log(`PASS: ${desc} correctly`);
};

//single requests
testSingleRequest("Calculates price for one day", { id: 3, length: DAY }, 60);

testSingleRequest(
  "Calculates price for two weeks",
  { id: 3, length: DAY * 14 },
  105 * 2
);

testSingleRequest(
  "Calculates price for 30 minutes in room 4",
  { id: 4, length: MINUTE * 30 },
  4 * 30
);

const priceForEightDays = ((8 / 7) * 150).toFixed(2);

testSingleRequest(
  "Calculates price for 8 days in room 4",
  { id: 4, length: 8 * DAY },
  priceForEightDays
);

testSingleRequest(
  "Calculates price for unavailble room",
  { id: 0, length: HOUR },
  0
);

testSingleRequest("Calculates price for no time", { id: 3, length: 0 }, 0);

//multiple requests
testMultipleRequests(
  "Calculates prices for same time in two different rooms",
  [
    { id: 3, lengthInMins: DAY },
    { id: 4, lengthInMins: DAY },
  ],
  [60, 70]
);

testMultipleRequests(
  "Calculates prices for two times in same room",
  [
    { id: 3, lengthInMins: WEEK },
    { id: 3, lengthInMins: 30 * MINUTE },
  ],
  [105, 30 * 2]
);
