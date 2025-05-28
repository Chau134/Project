import subprocess
import os
import time
from flask import Flask, jsonify, request
from flask_restx import Api, Resource, fields
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
api = Api(app, version='1.0', description="API for searching")
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# search_model = api.model('Search', {
#     'detail_key': fields.String(required= True, description= 'Detail key for the detail search'),
#     'lower_key': fields.String(required=True, description='Lower key for the credit search'),
#     'upper_key': fields.String(required=True, description='Upper key for the credit search')
# })

response_model = api.model('Response', {
    'date_time': fields.String(required=True, description='Date and time of the transaction'),
    'trans_no': fields.String(required=True, description='Transaction number'),
    'credit': fields.Integer(required=True, description='Credit amount'),
    'debit': fields.Integer(required=True, description='Debit amount'),
    'detail': fields.String(required=True, description='Details of the transaction')
})

full_response_model = api.model('FullResponse', {
    'total': fields.String(required=True, description='Total number of records as string'),
    'records': fields.List(fields.Nested(response_model), required=True, description='List of transaction records')
})

@api.route('/query')
@api.param('q', 'Detail key for the search query')
class Credit(Resource):
    @api.doc('search')
    # @api.expect(search_model, validate=True)
    @api.response(200, 'Success', model=full_response_model)
    @api.response(500, 'Internal Server Error')
    def get(self):
        # data = request.json
        # detail_key = data.get('detail_key')
        # lower_key = data.get('lower_key')
        # upper_key = data.get('upper_key')
        detail_key = request.args.get('q')
        
        start = time.time()
         
        try:
            # Pass the parameters to the subprocess command
            result = subprocess.run([os.path.join(os.getcwd(), 'credit'),detail_key], capture_output=True, text=True, check=True)
            end = time.time()
            elapsed = end - start
            print("Total run time:", elapsed)
            return jsonify(result.stdout)
        except subprocess.CalledProcessError as e:
            return jsonify({"error": e.stderr}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(port=port, host='0.0.0.0')  
