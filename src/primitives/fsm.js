function createFSM(config) {
    if (!config || !config.initial || !config.states) {
        throw new Error("FSM requires 'initial' and 'states' configuration.");
    }

    let currentState = config.initial;

    const fsm = {
        get state() {
            return currentState;
        },
        dispatch: (eventName, payload) => {
            const stateConfig = config.states[currentState];
            if (!stateConfig) return;

            const transitions = stateConfig.transitions || [];
            const transition = transitions.find(t => t.event === eventName);

            if (transition) {
                // Execute onExit of current state
                if (stateConfig.onExit) {
                    try { stateConfig.onExit(); } catch (e) { console.error("FSM onExit error:", e); }
                }

                // Change state
                currentState = transition.target;

                // Execute onEntry of new state
                const newStateConfig = config.states[currentState];
                if (newStateConfig && newStateConfig.onEntry) {
                    try { newStateConfig.onEntry(); } catch (e) { console.error("FSM onEntry error:", e); }
                }
            }
        }
    };

    // Execute initial onEntry if present
    const initialStateConfig = config.states[currentState];
    if (initialStateConfig && initialStateConfig.onEntry) {
        try { initialStateConfig.onEntry(); } catch (e) { console.error("FSM onEntry error:", e); }
    }

    return fsm;
}

module.exports = {
    createFSM
};
