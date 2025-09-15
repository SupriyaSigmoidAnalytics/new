import pandas as pd
from sqlalchemy import create_engine


engine = create_engine('sqlite:///sales.db')  


dataset_path = '/home/sigmoid/Downloads/dataset.csv'
data = pd.read_csv(dataset_path)


data['Date'] = pd.to_datetime(data['Date'], errors='coerce')
data['Customer_Name'].fillna('Unknown', inplace=True)

data['Discount'] = data['Discount'].str.replace('%', '', regex=True)
data['Discount'] = pd.to_numeric(data['Discount'], errors='coerce')  
data['Discount'] = data['Discount'] / 100
data['Discount'].fillna(0, inplace=True)

data = data.dropna(subset=['Date'])
data['Quantity'] = data['Quantity'].astype(int)
data['Price'] = data['Price'].astype(float)

data['sales_before_discount'] = (data['Price'] * data['Quantity']).round(2)
data['sales_after_discount'] = (data['Price'] * (1 - data['Discount']) * data['Quantity']).round(2)


sales_comp = data.groupby('Product')[['sales_before_discount','sales_after_discount']].sum().reset_index()


data.to_csv('cleaned_dataset.csv', index=False)
sales_comp.to_csv('sales_comp.csv', index=False)


data.to_sql('cleaned_data', engine, index=False, if_exists='replace')
sales_comp.to_sql('sales_comparison', engine, index=False, if_exists='replace')

print(" Cleaned data and sales comparison stored in sales.db (SQLite).")
