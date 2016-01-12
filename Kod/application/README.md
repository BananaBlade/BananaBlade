
On Ubuntu 14.04 install pip3 not pip via sudo apt-get install python3-pip (I might have forgotten the pkg name)
Instal all things from requirements.txt via pip3 install -r requirements.txt
Use virtualenv if you want to create a separate, local folder for pip packages
Use gunicorn for hosting the app

Read:
http://blog.marksteve.com/deploy-a-flask-application-inside-a-digitalocean-droplet
https://flask-cors.readthedocs.org/en/latest/