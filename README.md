# Home Assistant JavaScript Control (ha-js-control)

`ha-js-control` is a flexible, dynamic runtime extension for Home Assistant that allows you to write automations using standard JavaScript.

It bridges the gap between simple UI-based automations and complex AppDaemon setups by providing a lightweight, live-reloading JavaScript engine tailored for Home Assistant.

## Features

- **Live Reloading**: Modify your JavaScript automations at runtime. The engine automatically detects file changes and reloads the specific script without restarting the entire system.
- **Rich Primitives**: Built-in helpers to make writing automations effortless (state querying, event listening, service calling).
- **FSM Primitive**: A built-in Finite State Machine (FSM) abstraction to easily manage complex, multi-state automation flows (e.g., motion lighting with manual overrides and timeouts).
- **Static Shell, Dynamic Code**: The core "shell" maintains a robust WebSocket connection to Home Assistant, while your "user-controlled code" sits in easily editable `.js` files.

## Architecture

The system is split into two components:

1. **The Shell**: A static Node.js application. It connects to Home Assistant via the official WebSocket API. It maintains a state cache and uses file watching (`chokidar`) to monitor your automation directory.
2. **User-Controlled Code**: JavaScript files placed in the watched directory. When a file is loaded or changed, the Shell evaluates it in a sandboxed context (`vm` module), injecting a powerful `ha` object.

## Example Usage

### Simple Automation

```javascript
// automations/greeting.js

ha.onStateChange('binary_sensor.front_door', (oldState, newState) => {
    if (newState === 'on') { // Door opened
        ha.callService('tts', 'google_translate_say', {
            entity_id: 'media_player.living_room',
            message: 'Welcome home!'
        });
    }
});
```

### Complex Automation using the FSM Primitive

The FSM primitive helps avoid "callback hell" and complex nested `if` statements for stateful automations like motion-activated lighting.

```javascript
// automations/motion_light.js

const motionLightFSM = ha.fsm({
    initial: 'idle',
    states: {
        idle: {
            onEntry: () => ha.callService('light', 'turn_off', { entity_id: 'light.hallway' }),
            transitions: [
                { event: 'motion_detected', target: 'active' }
            ]
        },
        active: {
            onEntry: () => ha.callService('light', 'turn_on', { entity_id: 'light.hallway' }),
            transitions: [
                { event: 'motion_cleared', target: 'waiting' }
            ]
        },
        waiting: {
            onEntry: () => ha.setTimeout('motion_timeout', 60000), // Wait 1 minute
            onExit: () => ha.clearTimeout('motion_timeout'),
            transitions: [
                { event: 'motion_detected', target: 'active' },
                { event: 'timeout_reached', target: 'idle' }
            ]
        }
    }
});

// Hook HA events to the FSM
ha.onStateChange('binary_sensor.hallway_motion', (old, current) => {
    if (current === 'on') motionLightFSM.dispatch('motion_detected');
    if (current === 'off') motionLightFSM.dispatch('motion_cleared');
});

ha.onTimeout('motion_timeout', () => {
    motionLightFSM.dispatch('timeout_reached');
});
```

## Installation (Home Assistant OS Add-on)

Since this runs as an Add-on, you install it via the Home Assistant Add-on Store.

1. In Home Assistant, navigate to **Settings** > **Add-ons**.
2. Click **Add-on Store** in the bottom right corner.
3. Click the three dots (menu) in the top right, select **Repositories**.
4. Add the URL of this repository.
5. Search for "HA JS Control" and click **Install**.
6. In the Add-on Configuration tab, ensure `automations_dir` is set (e.g. `/config/js-automations`).
7. Start the Add-on and check the logs.

## Writing Automations

1. Mount your Home Assistant `/config` folder via Samba or edit via VSCode Add-on.
2. Create the `js-automations` directory if it doesn't exist.
3. Add your `.js` files. The add-on will automatically pick them up and execute them immediately.
