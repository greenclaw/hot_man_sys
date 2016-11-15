select table_name, column_name, data_type, character_maximum_length
from INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = 'public' 
ORDER BY table_name;