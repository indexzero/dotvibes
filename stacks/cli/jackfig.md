The primary stack for this CLI will be:

- package manager: pnpm
- CLI arguments parser:
[jackspeak](https://raw.githubusercontent.com/isaacs/jackspeak/refs/heads/main/README.md)
- CLI rendering: [ink](https://raw.githubusercontent.com/vadimdemedes/ink/refs/heads/master/readme.md), with
[ink ui](https://raw.githubusercontent.com/vadimdemedes/ink-ui/refs/heads/main/readme.md)
- Command Pattern: from `src/core`
```
src/
  commands/
    <command-a>.js
    <command-b>/
      <subcommand-a>.js
      <subcommand-b>.js
