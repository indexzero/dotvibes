// Example 6: Error handling patterns
try {
  doSomething();
} catch (err) {
  console.log(err);
}

try {
  riskyOperation();
} catch (err) {
  console.error(err.message);
}

// Promise handling
somePromise()
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async without try-catch
async function noErrorHandling() {
  const data = await fetchData();
  return data;
}

// With error handling
async function withErrorHandling() {
  try {
    const data = await fetchData();
    return data;
  } catch (err) {
    console.error('Error:', err);
    throw err;
  }
}

// Throwing errors
function validate(input) {
  if (!input) {
    throw new Error('Input required');
  }

  if (typeof input !== 'string') {
    throw new TypeError('Input must be string');
  }
}
