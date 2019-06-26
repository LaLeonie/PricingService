// ============ BRIEF ============
//
// Refactor the PricingService class below to improve its readability, performance and safety.
//
// The intended functionality of the service is to calculate the prices for a given list of meeting rooms and meeting
// lengths, based upon per [min|hour|day|week] tariffs. For example:
//
//   - If the length of the proposed meeting is greater than an hour and less than a week, the hourly tariff is used.
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
// =========== SUBMISSION ========
//
// Once you are happy with your refactor, please send a link to your gist back to tim@kittoffices.com.
//
// CHANGE CODE BELOW THIS LINE
class PricingService {
  constructor(pricingRulesDatabase) {
    this.pricingRulesDatabase = pricingRulesDatabase
    this.prices = []
  }

  getPrices(pricingRequest) { // [{id, lengthInMins}, ...]
    for (var i = 0; i < pricingRequest.length; i++) {
      var database = this.pricingRulesDatabase
      var pricing = database.getPricingForId(pricingRequest[i].id)

      var price = 0
      if (pricingRequest[i].lengthInMins >= 60) {
        if (pricingRequest[i].lengthInMins >= 60 * 24) {
          if (pricingRequest[i].lengthInMins >= 60 * 24 * 7) {
            price = (pricingRequest[i].lengthInMins / (60 * 24 * 7)) * pricing[4]
          } else {
            price = (pricingRequest[i].lengthInMins / (60 * 24)) * pricing[3]
          }
        } else {
          price = (pricingRequest[i].lengthInMins / 60) * pricing[2]
        }
      } else {
        price = (pricingRequest[i].lengthInMins * pricing[1])
      }

      this.prices[i] = price
    }

    var prices = this.prices

    this.prices = []

    return prices
  }
}

// READ-ONLY CLASS
// Don't change any code in this class
class InMemoryPricingRulesDatabase {
  constructor(initRows) {
    this.rows = initRows;
  }

  getPricingForId(roomId) {
    return this.rows.find(row => row[0] === roomId)
  }

  getPricing(roomIds) {
    return this.rows.filter(row => roomIds.includes(row[0]))
  }
}

// ======= TESTS =======
// Setup
console.log("--- Running test cases ---")
var seedData = [
  [3, 2, 22, 60, 105],
]
var database = new InMemoryPricingRulesDatabase(seedData)
service = new PricingService(database)

// ===== TEST CASES =====
// One day
console.log(service.getPrices([{id: 3, lengthInMins: 60 * 24}])[0] === 60 ? "pass" : "fail")

// Two weeks
console.log(service.getPrices([{id: 3, lengthInMins: 60 * 24 * 14}])[0] === 105 * 2 ? "pass" : "fail")
