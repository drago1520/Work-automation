#!/bin/bash

# Start 5 Node.js servers in separate Git Bash windows
start bash -c "node script1.js 1 60; exec bash"
start bash -c "node script1.js 60 120; exec bash"
start bash -c "node script1.js 120 180; exec bash"
start bash -c "node script1.js 180 240; exec bash"
start bash -c "node script1.js 240 301; exec bash"
