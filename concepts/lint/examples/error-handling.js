// Example 6: Error handling patterns
try {
  doSomething()
} catch (e) {
  console.log(e)
}

try {
  riskyOperation()
} catch(error) {
  console.error(error.message)
}

// Promise handling
somePromise()
  .then(data => console.log(data))
  .catch(e => console.error(e))

// Async without try-catch
async function noErrorHandling() {
  const data = await fetchData()
  return data
}

// With error handling
async function withErrorHandling() {
  try {
    const data = await fetchData()
    return data
  } catch (err) {
    console.error('Error:', err)
    throw err
  }
}

// Throwing errors
function validate(input) {
  if (!input) {
    throw new Error("Input required")
  }
  if (typeof input !== 'string') {
    throw Error('Input must be string')
  }
}