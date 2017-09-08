### Overview:
This repository is an app that takes a .csv file, converts it to .json,
and outputs on the web page with the google maps API.
Included in this README is directions on how to run this program.
Languages used:
- Python
- JavaScript
- HTML
- CSS

### Requirements:
- Windows OS
- Python 3 >= 3.4
- Up-to-date Chrome browser

### Instructions to run the program:
- Install Python 3.4 or greater
- Open up commandline and cd into user-api
- Enter the following commands:
- ```python -m venv flask```
- ```flask\scripts\pip install flask```
- ```python app.py```
- Open up a new tab in Chrome, and open up the index.html file
- Verify HTTP endpoints in another tab with
  ```localhost:5000/users/api/v1.0/users```
  ```localhost:5000/users/api/v1.0/users/id``` where id = 1 - 101

### Improvements that can be made:
- Make table and map responsive/mobile-first
- for mobile-first, collapse table into accordian tabs to display info
- output a list of users given id param or range for params
- row selection in table makes infowindow for selected user pop-up
- selecting marker in map highlights corresponding user in table