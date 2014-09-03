# Samantha server application

## Getting started
### Requirements
* npm
* mosquitto
* bourbon

In case you need to install Mosquitto, the recommended way is via Homebrew:

	brew update
	brew install mosquitto
	
In case you need to install Bourbon, the recommended way is via Homebrew:

	gem install bourbon
	
### Configuration
1. Launch an ```npm install``` and a ```bower install``` in the ```src/main/webapp``` folder:

		cd src/main/webapp
		sudo npm install	
		bower install	
	
2. When Bower requests angular and polymer versions, select answer #5 and #2 respectively.

3. Execute ```grunt```:
		
		grunt watch

4. Then configure conf.json so that web_root points to your ```src/main/resources/public``` folder. Modify the other settings as you wish.

### Launching
1. In order to launch the server, first launch Mosquitto:

		/usr/local/Cellar/mosquitto/<V>/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf
where \<V> is your version number

2. Move to the project root folder and execute the ```run.sh``` script:

	./run.sh
	
3. Connect your browser to the following address:
	
		http://127.0.0.1:8080
	
4. Launch the client application on your Android device and connect to your server address 