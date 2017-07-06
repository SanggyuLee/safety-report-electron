const electron = require('electron');
const path = require('path');
const glob = require('glob');

const BrowserWindow = electron.BrowserWindow;
const app = electron.app;

const debug = /--debug/.test(process.argv[2]);

if(process.mas)
	app.setName('Safety Report Creator');

let mainWindow = null;

function initialize() {
	function createWindow() {
		let windowOptions = {
			width: 1080,
			minWidth: 680,
			height: 840,
			title: app.getName()
		};

		mainWindow = new BrowserWindow(windowOptions);
		mainWindow.loadURL(path.join('file://', __dirname, '/index.html'));

		if(debug) {
			mainWindow.webContents.openDevTools();
			mainWindow.maximize();
			require('devtron').install();
		}

		mainWindow.on('closed', function() {
			mainWindow = null;
		});
	}

	app.on('ready', function() {
		createWindow();
	});

	app.on('window-all-closed', function () {
		if(process.platform !== 'darwin') {
			app.quit();
		}
	});

	app.on('activate', function() {
		if(mainWindow === null) {
			createWindow();
		}
	});
}

function loadFiles() {
	let files = glob.sync(path.join(__dirname, 'main-process/**/*.js'));
	files.forEach(function(file) {
		require(file);
	});
}

initialize();
