#!/bin/bash
cd /vercel/share/v0-project
git add -A
git commit -m "Update location text: Remove USA countdown, update Australia message to 'Coming to Australia…then the USA…'"
git push origin update-location-text
