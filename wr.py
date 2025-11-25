import pandas as pd
from sqlalchemy import create_engine

# Load the Woreda Representative Excel file
file_path = r"C:\Users\Remx\Desktop\wr.xlsx"
df_wr = pd.read_excel(file_path)

# Rename columns to match PostgreSQL table
df_wr = df_wr.rename(columns={
    'Woreda Representative name': 'name',
    'Woreda Representative Phone number': 'phone_number'
})

# PostgreSQL connection URL
db_url = "postgresql://Ethiopian%20Map%20System_owner:npg_wLSNX7Qg6hDi@ep-autumn-frost-a8zg2v20-pooler.eastus2.azure.neon.tech/cropin?sslmode=require&channel_binding=require"

# Create SQLAlchemy engine
engine = create_engine(db_url)

# Insert data into the woreda_reps table
df_wr.to_sql('woreda_reps', engine, if_exists='append', index=False)

print("Woreda Representatives data inserted successfully!")
