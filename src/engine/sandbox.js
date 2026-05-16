const vm = require('vm');

class Sandbox {
    constructor(filename, manager) {
        this.filename = filename;
        this.manager = manager;
        this.listeners = new Map(); // entityId -> Set of callbacks
        this.timeouts = new Map();  // id -> NodeJS.Timeout
        this.intervals = new Map(); // id -> NodeJS.Timeout

        this.context = this.createContext();
    }

    createContext() {
        // Expose a safe 'ha' object to the user scripts
        const ha = {
            getState: (entityId) => {
                const stateObj = this.manager.getState(entityId);
                return stateObj ? stateObj.state : null;
            },
            getFullState: (entityId) => {
                return this.manager.getState(entityId);
            },
            callService: (domain, service, serviceData) => {
                return this.manager.callService(domain, service, serviceData);
            },
            onStateChange: (entityId, callback) => {
                if (!this.listeners.has(entityId)) {
                    this.listeners.set(entityId, new Set());
                }
                this.listeners.get(entityId).add(callback);
            },
            setTimeout: (id, ms, callback) => {
                this.clearTimeout(id); // Clear existing if any
                const timer = setTimeout(() => {
                    this.timeouts.delete(id);
                    callback();
                }, ms);
                this.timeouts.set(id, timer);
            },
            clearTimeout: (id) => {
                if (this.timeouts.has(id)) {
                    clearTimeout(this.timeouts.get(id));
                    this.timeouts.delete(id);
                }
            },
            setInterval: (id, ms, callback) => {
                this.clearInterval(id); // Clear existing if any
                const timer = setInterval(() => {
                    callback();
                }, ms);
                this.intervals.set(id, timer);
            },
            clearInterval: (id) => {
                if (this.intervals.has(id)) {
                    clearInterval(this.intervals.get(id));
                    this.intervals.delete(id);
                }
            },
            sun: () => {
                const sunState = this.manager.getState('sun.sun');
                if (!sunState || !sunState.attributes) return { elevation: 0, azimuth: 0 };
                return {
                    elevation: sunState.attributes.elevation || 0,
                    azimuth: sunState.attributes.azimuth || 0
                };
            },
            fsm: (config) => {
                return this.manager.createFSMPrimitive(config);
            },
            log: (...args) => {
                console.log(`[${this.filename}]`, ...args);
            }
        };

        return vm.createContext({
            ha,
            console: {
                log: (...args) => console.log(`[${this.filename}]`, ...args),
                error: (...args) => console.error(`[${this.filename}]`, ...args),
                warn: (...args) => console.warn(`[${this.filename}]`, ...args),
            }
        });
    }

    run(code) {
        try {
            const script = new vm.Script(code, { filename: this.filename });
            script.runInContext(this.context);
        } catch (err) {
            console.error(`Error executing script ${this.filename}:`, err);
        }
    }

    emit(type, event) {
        if (type === 'state_change') {
            const entityId = event.entity_id;
            const callbacks = this.listeners.get(entityId);
            if (callbacks) {
                for (const callback of callbacks) {
                    try {
                        const oldStateStr = event.old_state ? event.old_state.state : null;
                        const newStateStr = event.new_state ? event.new_state.state : null;
                        callback(oldStateStr, newStateStr, event.old_state, event.new_state);
                    } catch (err) {
                        console.error(`Error in state_change callback for ${entityId} in ${this.filename}:`, err);
                    }
                }
            }
        }
    }

    cleanup() {
        this.listeners.clear();
        for (const timer of this.timeouts.values()) {
            clearTimeout(timer);
        }
        this.timeouts.clear();
        for (const timer of this.intervals.values()) {
            clearInterval(timer);
        }
        this.intervals.clear();
    }
}

module.exports = Sandbox;
