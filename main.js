const nconf = require('nconf');
const fs = require("fs");
const { app, BrowserWindow, ipcMain } = require('electron') 
const path = require('path') 
const fetch = require('node-fetch')

accountId = "a2f6172c-aaac-4545-8929-9f30270e2b00";
productId = "f756bc83-66da-4ca0-b2f0-6fff4a5eb296";

nconf.use('file', { file: 'C:/ProgramData/config.json' });   //Read conifg.json
nconf.load();
wizard = nconf.get("wizard") //whether to run wizard or not

async function validateLicenseByActivationToken(token) {
  const validation = await fetch(`https://api.keygen.sh/v1/accounts/${accountId}/licenses/actions/validate-key`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      meta: {
        scope: { product: productId },
        "key": token,
      }
    }),
  })
  const { meta, data, errors } = await validation.json()
  if (errors) {
    return { status: validation.status, errors }
  }

  return {
    status: validation.status,
    meta,
    data,
  }
}

async function gateCreateWindowWithLicense(createWindow) {
    const gateWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: { 
        preload: path.join(__dirname, 'gate.js'), 
        devTools: !app.isPackaged
      },
    })
   
    gateWindow.loadFile('gate.html')

    ipcMain.on('GATE_SUBMIT', async (_event, { token }) => { 
      const code = await validateLicenseByActivationToken(token)
      if (code['meta']['valid'] == true) {
        createWindow();
        gateWindow.close()
      }
    })
  }
function createWindow() {
    const mainWindow = new BrowserWindow({ 
      width: 1200,
      height: 800,
      maxHeight: 800,
      maxWidth: 1200,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        contextIsolation: false,
        devTools: !app.isPackaged
      },
    })
   
    
    if (wizard == null){
      nconf.use('file', { file: 'C:/ProgramData/config.json' });   //Read conifg.json
      nconf.load();
      nconf.set('wizard', false); //change so wizard doesn't open next time

      nconf.save();

      mainWindow.loadFile('welcome.html') //for first time users
    }
    else if (wizard == false){
      mainWindow.loadFile('index.html') //Load main bot page 
    }
    else if (wizard == "Error") {
      mainWindow.loadFile('error.html')
    }
}


app.whenReady().then(() => gateCreateWindowWithLicense(createWindow)) 
