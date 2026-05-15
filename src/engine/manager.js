const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const Sandbox = require('./sandbox');
const { createFSM } = require('../primitives/fsm');

class ScriptManager {
    constructor(directory, connection) {
        this.directory = directory;
        this.connection = connection;
        this.sandboxes = new Map(); // filename -> Sandbox instance
        this.entities = {}; // Cache of current state
    }

    updateEntities(entities) {
        const oldEntities = this.entities;
        this.entities = entities;

        // Trigger state change events
        for (const [entityId, newState] of Object.entries(entities)) {
            const oldState = oldEntities[entityId];
            if (!oldState || oldState.state !== newState.state || oldState.last_updated !== newState.last_updated) {
                this.dispatchEvent('state_change', {
                    entity_id: entityId,
                    old_state: oldState,
                    new_state: newState
                });
            }
        }
    }

    dispatchEvent(type, event) {
        for (const sandbox of this.sandboxes.values()) {
            sandbox.emit(type, event);
        }
    }

    start() {
        if (!fs.existsSync(this.directory)) {
            console.log(`Directory ${this.directory} does not exist. Creating it.`);
            fs.mkdirSync(this.directory, { recursive: true });
        }

        console.log(`Watching for scripts in ${this.directory}`);
        this.watcher = chokidar.watch('**/*.js', {
            cwd: this.directory,
            ignored: /node_modules/,
            persistent: true
        });

        this.watcher
            .on('add', file => this.loadScript(file))
            .on('change', file => this.loadScript(file))
            .on('unlink', file => this.unloadScript(file));
    }

    loadScript(file) {
        const fullPath = path.join(this.directory, file);
        console.log(`Loading script: ${file}`);
        
        this.unloadScript(file);

        try {
            const code = fs.readFileSync(fullPath, 'utf8');
            const sandbox = new Sandbox(file, this);
            sandbox.run(code);
            this.sandboxes.set(file, sandbox);
            console.log(`Successfully loaded: ${file}`);
        } catch (err) {
            console.error(`Error loading script ${file}:`, err);
        }
    }

    unloadScript(file) {
        if (this.sandboxes.has(file)) {
            console.log(`Unloading script: ${file}`);
            const sandbox = this.sandboxes.get(file);
            sandbox.cleanup();
            this.sandboxes.delete(file);
        }
    }

    // Primitives used by sandbox
    getState(entityId) {
        return this.entities[entityId] || null;
    }

    async callService(domain, service, serviceData = {}) {
        return this.connection.sendMessagePromise({
            type: 'call_service',
            domain,
            service,
            service_data: serviceData
        });
    }

    createFSMPrimitive(config) {
        return createFSM(config);
    }
}

module.exports = ScriptManager;
