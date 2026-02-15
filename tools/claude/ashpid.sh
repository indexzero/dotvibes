#!/bin/bash
# Trace up the parent process chain to find the Claude process PID

pid=$$
while true; do
  ppid=$(ps -o ppid= -p $pid | tr -d ' ')
  cmd=$(ps -o comm= -p $ppid 2>/dev/null)
  if [[ "$cmd" == "claude" ]]; then
    echo "$ppid"
    exit 0
  fi
  if [[ -z "$ppid" || "$ppid" == "1" ]]; then
    echo "Claude process not found in parent chain" >&2
    exit 1
  fi
  pid=$ppid
done
