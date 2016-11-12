#/bin/bash
psql -d hotels < setup.sql
psql -d hotels -c "copy hotel from '$(pwd)/hot.csv' with delimiter ',' csv;"
