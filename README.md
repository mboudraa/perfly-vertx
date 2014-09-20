# Perfly server application

## Getting started
### Requirements

In case you need to install 
	* Mosquitto -> visit  [ http://mosquitto.org/download](http://mosquitto.org/download) to know how to install mosquitto:
	* npm -> visit [ http://nodejs.org/download/](http://nodejs.org/download/) to know how to install nodeJS

	
### Configuration

1. Move to root project folder and execute the ```install.sh``` script:

	./install.sh	
	
2. When Bower requests angular version, please select 1.3.0-rc.1.

3. Move to ```src/main/webapp``` and execute :
		
		grunt dev

4. Then configure conf.json so that web_root points to your ```src/main/resources/public``` folder. Modify the other settings as you wish.

### Launching

1. In order to launch the server, first launch Mosquitto:

2. Move to the project root folder and execute the ```run.sh``` script:

	./run.sh
	
3. Connect your browser to the following address:
	
		http://localhost:8080
	
4. Launch the client application on your Android device and connect to your server address 
