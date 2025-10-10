// Example 5: Array methods and loops
const numbers = [1, 2, 3, 4, 5];

// For...in on array (anti-pattern)
for (const index in numbers) {
  console.log(numbers[index]);
}

// ForEach vs for...of
numbers.forEach((num, i) => {
  console.log(num);
});

// Array method chaining
const result = numbers
  .map(x => x * 2)
  .filter(x => x > 5)
  .reduce((acc, val) => acc + val, 0);

// Callback references
function processItem(item) {
  return item * 2;
}

numbers.map(processItem);
numbers.filter(x => x > 2).map(processItem);

// Array.from vs spread
const copy1 = [...numbers];
const copy2 = [...numbers];

// Find vs filter[0]
const found = numbers.find(x => x > 3);
const betterFound = numbers.find(x => x > 3);
