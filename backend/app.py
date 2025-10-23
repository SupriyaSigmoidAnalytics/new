# backend/app.py
from flask import Flask, jsonify, request
import pandas as pd
from sqlalchemy import create_engine
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

engine = create_engine("sqlite:///sales.db")

@app.route('/get-sales-comparison', methods=['GET'])
def get_sales_comparison():
    query = "SELECT * FROM sales_comparison"
    df = pd.read_sql(query, engine)
    return jsonify(df.to_dict(orient='records'))

@app.route('/get-data', methods=['GET'])
def get_data():
    limit = int(request.args.get('limit', 50))   
    offset = int(request.args.get('offset', 0))  
    
    query = f"SELECT * FROM cleaned_data LIMIT {limit} OFFSET {offset}"
    df = pd.read_sql(query, engine)

    
    count_query = "SELECT COUNT(*) AS total FROM cleaned_data"
    total = pd.read_sql(count_query, engine)['total'][0]

   
    return jsonify({
        "total": int(total),
        "limit": limit,
        "offset": offset,
        "rows": df.astype(object).where(pd.notnull(df), None).to_dict(orient='records')
    })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
 