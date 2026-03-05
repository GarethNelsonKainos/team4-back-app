#!/bin/sh
set -e

# Simple healthcheck that uses wget to check the API endpoint
wget --quiet --tries=1 --spider http://localhost:8080/api/job-roles

