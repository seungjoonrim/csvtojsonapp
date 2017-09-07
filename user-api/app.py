# Convert user.csv to JSON object, then store it in users --------------------------------
import csv
import json
from collections import OrderedDict

with open('../data/user.csv','r') as f:	# open user.csv
	reader = csv.reader(f)	# store all lines in reader
	headerlist = next(reader)	# first line is headers (keys), *iterators now starts @ 2nd line*
	latLng = []
	users = []
	for row in reader:
			d = OrderedDict()		# each user will be a dictionary with preserved order
			for i, x in enumerate(row):		# for counter, and element in enumerate(row)
				d[headerlist[i]] = x	# use headerlist as key, x in row will be the value
			users.append(d)		# append the user dictionary to the list of users

with open('../data/user.json', 'w') as f:
	json.dump(users, f)

# Convert user.json to GeoJSON
data = json.load(open('../data/user.json'))

GeoJSON = {
	"type": "FeatureCollection",
	"features": [
	{
		"type": "Feature",
		"geometry": {
			"type": "Point",
			"coordinates": [float(d[" long"]), float(d[" lat"])],
		},
		"properties": d,
	} for d in data]
}

with open('../data/user.geojson', 'w') as f:
	json.dump(GeoJSON, f)

# RESTful API using Flask framework -------------------------------------------------------
from flask import Flask, jsonify, abort, make_response, url_for

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False	# so jsonify preserves original order

@app.errorhandler(404)
def not_found(error):
	return make_response(jsonify({'error': 'Not found'}), 404)	# so 404 error outputs proper JSON format

@app.route('/users/api/v1.0/users', methods=['GET'])	# HTTP method to GET all tasks
def get_users():
	response = jsonify({'users': users})	# return JSON object with all tasks
	response.headers.add('Access-Control-Allow-Origin', '*')	# fixes "No 'Access-Control-Allow-Origin' issue"
	return response

@app.route('/users/api/v1.0/users.geojson', methods=['GET'])	# return GeoJSON object for
def get_usersGeoJSON():				# Google Map API
	response = jsonify(GeoJSON)
	response.headers.add('Access-Control-Allow-Origin', '*')
	return response

@app.route('/users/api/v1.0/users/<string:user_id>', methods=['GET'])	# HTTP method to GET a single task
def get_user(user_id):
	user = [user for user in users if user["id"] == user_id]	# loop through users and GET
	if len(user) == 0:				# if no match (length of dict = 0), return 404
		abort(404)
	return jsonify({'user': user[0]})	# else, return the 0th elem in user (single user)

if __name__ == '__main__':
	app.run(debug=True)
