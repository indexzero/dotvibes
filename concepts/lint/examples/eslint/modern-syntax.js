// Example 7: Modern JavaScript patterns
// Template literals
const name = 'World';
const greeting = 'Hello ' + name + '!';
const better = 'Hello ' + name + '!';

// Object shorthand
const x = 10;
const y = 20;
const point = {
  x: x,
  y: y,
  draw: function() {
    console.log('drawing');
  }
};

// Spread operator
function sum() {
  const args = Array.prototype.slice.call(arguments);
  return args.reduce((a, b) => a + b, 0);
}

// Default parameters
function greet(name) {
  name = name || 'Guest';
  return 'Hello ' + name;
}

// Object.assign vs spread
const merged1 = Object.assign({}, obj1, obj2);
const merged2 = { ...obj1, ...obj2 };

// Promises vs async/await
function loadData() {
  return fetch('/api')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      return data;
    });
}

// Optional chaining and nullish coalescing
const value = obj && obj.prop && obj.prop.nested;
const defaulted = value !== null && value !== undefined ? value : 'default';