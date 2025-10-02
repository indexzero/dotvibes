// Example 3: Function styles and patterns
const myFunc = function (x, y) {
  return x + y;
};

// Inconsistent arrow functions
const arrow1 = x => x * 2;
const arrow2 = x => x * 2;
const arrow3 = (x, y) => x + y;

// Function declaration vs expression
function goodFunction(param1, param2) {
  console.log(param1, param2);
}

const badFunction = function () {
  console.log('anonymous function expression');
};

// Async patterns
async function fetchData() {
  const result = await fetch('/api/data');
  return await result.json();
}

const fetchMore = async () => await Promise.resolve('data');

// Callback without arrow
arr.map(item => item * 2);
arr.filter(x => x > 5);
