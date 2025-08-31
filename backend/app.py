from flask import Flask, jsonify
import pandas as pd

app=Flask(__name__)

data=pd.read_csv('cleaned_dataset.csv')
sales_comparison=pd.read_csv('sales_comp.csv')

@app.route('/')
def home():
    return " Available routes: /get-sales-comparison, /get-data"

@app.route('/get-sales-comparison',methods=['GET'])
def get_sales_comparision():
    result=sales_comparison.to_dict(orient='records')
    return jsonify(result)

@app.route('/get-data',methods=['GET'])
def get_data():
    result=data.to_dict(orient='records')
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)        