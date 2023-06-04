from flask import Flask

app = Flask(__name__)

@app.route('/diff')
def diff():
    with open('static/ce.txt', 'r') as file:
        ce = file.read().replace('\n', '')
    with open('static/ne.txt', 'r') as file:
        ne = file.read().replace('\n', '')
    return """<h1>Cloud Duplicate Error Differences</h1><p>"""+ce+"""</p><p><h2>NAS</h2><br/><img style='max-width:800px;' src='static/cenas.JPG'></img></p><p><h2>Cloud</h2><br/><img style='max-width:800px;' src='static/cecloud.JPG'></img></p><p><h2>Local</h2><br/><img style='max-width:800px;' src='static/celocal.JPG'></img></p>"""                   +    """<h1>NAS Duplicate Error Differences</h1><p>"""+ne+"""</p><p><h2>NAS</h2><br/><img style='max-width:800px;' src='static/nenas.JPG'></img></p><p><h2>Cloud</h2><br/><img style='max-width:800px;' src='static/necloud.JPG'></img></p><p><h2>Local</h2><br/><img style='max-width:800px;' src='static/nelocal.JPG'></img></p>"""

# "<h1>Cloud Duplicate Error Differences</h1>"+<p>ce</p>+"<p><h2>NAS</h2><br/><img style='max-width:800px;' src='static/cenas.JPG'></img></p>"+"<p><h2>Cloud</h2><br/><img style='max-width:800px;' src='static/cecloud.JPG'></img></p>"+"<p><h2>Local</h2><br/><img style='max-width:800px;' src='static/celocal.JPG'></img></p>"

@app.route('/')
def browse():
    html = ""
    for i in range(50):
        html = html + "<p><img style='max-width:800px' src='static/browse/"+str(i)+".JPG'></img></p>"
    return html
