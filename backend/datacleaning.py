import pandas as pd

dataset_path = '/home/sigmoid/Downloads/dataset.csv'
data= pd.read_csv(dataset_path)

data['Date']=pd.to_datetime(data['Date'],errors='coerce')
data['Customer_Name'].fillna('Unkown', inplace=True)
data['Discount'].fillna(0, inplace=True)
data['Discount']=data['Discount'].str.replace('%','',regex=True)
data['Discount'] = pd.to_numeric(data['Discount'], errors='coerce')  
data['Discount'] = data['Discount'] / 100 
data = data.dropna(subset=['Date'])
data['Quantity']=data['Quantity'].astype(int)
data['Price']=data['Price'].astype(float)



data['sales_before_discount']=data['Price']*data['Quantity']
data['sales_after_discount']=data['Price']*(1-data['Discount'])*data['Quantity']

sales_comp=data.groupby('Product')[['sales_before_discount','sales_after_discount']].sum().reset_index()

data.to_csv('cleaned_dataset.csv',index=False)
sales_comp.to_csv('sales_comp.csv',index=False)


