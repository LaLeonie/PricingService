# PricingService
Tech challenge for Kitt appliation: Refactor of this [original code](https://gist.github.com/timrcoulson/994c33f544a189b79d7279cb9214c7c0)

# Considerations
## Readability 
- [x] Removed nested for-loop 
- [x] Extracted logic into helper functions
- [x] Avoided code repetition (DRY) by adding variables and functions 
- [x] Improved output message for tests


## Security 
- [x] Replaced var with let/const 
- [x] Added more tests to verify edge cases

Stretch Goal: 
- [ ] Add some sort of type checking, such as TypeScript

## Performance 
- [x] Removed unused price property
- [x] Moved variables outside of loop block 
- [x] Added early returns to if conditions

Stretch Goal:
- [ ] Improve logic to get tarrifs, i.e. if multiple requests are made to the same room, avoid getting tarrif again in each loop iteration  


