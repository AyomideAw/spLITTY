#!/bin/bash

aptos move publish \
  --package-dir ./move \
  --named-addresses GroupSplitter=YOUR_TESTNET_ADDRESS_HERE \
  --profile testnet
