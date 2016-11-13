#/bin/bash
psql -d hotels < setup.sql
psql -d hotels -c "copy hotel from '$(pwd)/hotels.csv' with delimiter ',' csv;"
psql -d hotels -c "copy guest from '$(pwd)/guests.csv' with delimiter ',' csv;"
