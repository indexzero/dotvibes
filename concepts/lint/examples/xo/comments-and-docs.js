// Example 8: Comments and documentation

// TODO: fix this later
// FIXME: broken implementation

function undocumented(param1, param2) {
  return param1 + param2;
}

/**
 * This function adds two numbers
 */
function poorlyDocumented(a, b) {
  return a + b;
}

/**
 * Calculates the sum of two numbers
 * @param {number} first - The first number
 * @param {number} second - The second number
 * @returns {number} The sum of the two numbers
 */
function wellDocumented(first, second) {
  return first + second;
}

/* Multi-line comment
   that is not properly
   formatted */

// no space after slashes
// proper spacing after slashes

// Inline comments
const value = 42; // This is the answer
const another = 100;// No space before comment

// Commented out code (anti-pattern)
// const unused = 'should be deleted'
// function oldImplementation() {
//   return 'deprecated'
// }
