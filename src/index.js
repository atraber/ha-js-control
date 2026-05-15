require('dotenv').config();
const ws = require('ws');
const {
    createConnection,
    createLongLivedTokenAuth,
    subscribeEntities
} = require('home-assistant-js-websocket');
const ScriptManager = require('./engine/manager');

// In HA Add-ons, the SUPERVISOR_TOKEN is injected via env.
const token = process.env.SUPERVISOR_TOKEN || process.env.HA_TOKEN;
const url = process.env.HA_URL || 'ws://supervisor/core/websocket';
const automationsDir = process.env.AUTOMATIONS_DIR || './automations';

global.WebSocket = ws;

async function start() {
    console.log(`Starting ha-js-control...`);
    
    if (!token) {
        console.error('No SUPERVISOR_TOKEN or HA_TOKEN provided.');
        process.exit(1);
    }

    try {
        const auth = createLongLivedTokenAuth(url, token);
        const connection = await createConnection({ auth });
        console.log('Connected to Home Assistant');

        const scriptManager = new ScriptManager(automationsDir, connection);
        
        // Subscribe to all entity state changes and update the script manager
        subscribeEntities(connection, (entities) => {
            scriptManager.updateEntities(entities);
        });

        // Add a connection error handler
        connection.addEventListener('disconnected', () => {
            console.log('Disconnected from Home Assistant');
        });

        connection.addEventListener('ready', () => {
            console.log('Reconnected to Home Assistant');
        });

        scriptManager.start();

    } catch (err) {
        console.error('Error connecting to Home Assistant:', err);
        process.exit(1);
    }
}

start();
