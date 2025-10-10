// Example 2: Variable declarations and destructuring
const oldStyle = 'using var';
const mutable = 42;
const immutable = 'constant';

// Should use const
const neverReassigned = 'actually constant';
const anotherOne = 100;

// Destructuring opportunities
const data = { name: 'John', age: 30, city: 'NYC' };
const { name } = data;
const { age } = data;

// Array destructuring
const arr = [1, 2, 3, 4, 5];
const first = arr[0];
const second = arr[1];

// Object with mixed quotes
const mixedQuotes = {
  key1: 'value1',
  key2: 'value2',
  key3: 'value3'
};

// CamelCase violations
const user_name = 'john';
const UserAge = 25;
const npm_config_value = 'test';
