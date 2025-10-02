// Example 5: Array methods and loops
const numbers = [1, 2, 3, 4, 5];

// for...in on array (anti-pattern)
for (const index in numbers) {
  console.log(numbers[index]);
}

// forEach vs for...of
numbers.forEach(function(num, i) {
  console.log(num);
});

// Array method chaining
const result = numbers
  .map(function(x) { return x * 2; })
  .filter(function(x) { return x > 5; })
  .reduce(function(acc, val) { return acc + val; }, 0);

// Callback references
function processItem(item) {
  return item * 2;
}

numbers.map(processItem);
numbers.filter(x => x > 2).map(processItem);

// Array.from vs spread
const copy1 = Array.from(numbers);
const copy2 = [...numbers];

// Find vs filter[0]
const found = numbers.filter(x => x > 3)[0];
const betterFound = numbers.find(x => x > 3);