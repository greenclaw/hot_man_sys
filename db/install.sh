#/bin/bash
psql -c "DROP DATABASE IF EXISTS hot_man_sys;"
psql -c "CREATE DATABASE hot_man_sys;"
psql -d hot_man_sys < setup.sql
psql -d hot_man_sys < stored_procedures.sql
psql -d hot_man_sys -c "copy hotels from '$(pwd)/hotels.csv' with delimiter ',' csv;"
psql -d hot_man_sys -c "copy rooms_types from '$(pwd)/rooms_types.csv' with delimiter ',' csv;"
psql -d hot_man_sys -c "copy rooms from '$(pwd)/rooms.csv' with delimiter ',' csv;"
psql -d hot_man_sys -c "copy guests from '$(pwd)/guests.csv' with delimiter ',' csv;"
psql -d hot_man_sys -c "copy reservations from '$(pwd)/reservations.csv' with delimiter ',' csv;"
psql -d hot_man_sys -c "copy logs from '$(pwd)/logs.csv' with delimiter ',' csv;"
