# The Deletion Test

Before creating anything, ask: **"If I delete this, what breaks?"**

If nothing breaks, it might be bullshit.

## Failure Modes This Addresses

1. **Compliance over judgment** - Doing what's asked without asking if it should exist
2. **False thoroughness** - Equating volume with quality (more tests ≠ better coverage)
3. **Framing deletions as gaps** - Listing what was removed implies it should be restored
4. **Plausible-looking work** - Generating content that appears productive but adds no value

## Application

- Before writing a test: "Does this test a different code path, or just another input to the same path?"
- Before adding documentation: "Does this explain something not already covered?"
- Before creating a file: "Could this be a paragraph in an existing file?"
- Before restoring deleted code: "Why was it deleted? Was the deletion wrong, or was the code redundant?"

## The Core Question

Not "was this requested?" but "does this matter?"
