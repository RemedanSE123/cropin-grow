import pandas as pd
from sqlalchemy import create_engine

# Load the Excel file
file_path = r"C:\Users\Remx\Desktop\da.xlsx"
df = pd.read_excel(file_path)

# Rename columns to match PostgreSQL table (all lowercase recommended)
df = df.rename(columns={
    'Region': 'region',
    'Zone': 'zone',
    'Woreda': 'woreda',
    'Kebele': 'kebele',
    'contactNumber': 'contactnumber',  # lowercase
    'name': 'name',
    'Reporting manager_name': 'reporting_manager_name',
    'Reporting manager_mobile': 'reporting_manager_mobile',
    'language': 'language'
})

# Optional: add total_collected_data column if needed
df['total_collected_data'] = 0

# PostgreSQL connection URL
db_url = "postgresql://Ethiopian%20Map%20System_owner:npg_wLSNX7Qg6hDi@ep-autumn-frost-a8zg2v20-pooler.eastus2.azure.neon.tech/cropin?sslmode=require&channel_binding=require"

# Create SQLAlchemy engine
engine = create_engine(db_url)

# Insert data into the da_users table
df.to_sql('da_users', engine, if_exists='append', index=False)

print("Data inserted successfully!")
