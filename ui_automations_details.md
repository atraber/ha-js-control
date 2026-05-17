# Home Assistant UI Automations Export

Exported on: 2026-05-16T17:45:39.102Z

## Close bedroom blinds
**ID:** `1760640841043`

```yaml
id: "1760640841043"
alias: Close bedroom blinds
description: ""
triggers:
- trigger: time
  at: "21:30:00"
conditions: []
actions:
- action: cover.close_cover
  metadata: {}
  data: {}
  target:
    entity_id: cover.bedroom_blinds
mode: single
```

---

## Open blinds early morning
**ID:** `1760640884693`

```yaml
id: "1760640884693"
alias: Open blinds early morning
description: ""
triggers:
- trigger: time
  at: "08:15:00"
conditions:
- condition: time
  weekday:
  - mon
  - tue
  - wed
  - thu
  - fri
  after: "00:00:00"
  before: "23:00:00"
- condition: device
  device_id: 39d2e8c22b96f0ca08d3e5c01ad17d60
  domain: cover
  entity_id: 682950f22eaa08dfa1679aac47dc7eb0
  type: is_closed
actions:
- action: cover.set_cover_position
  metadata: {}
  data:
    position: 20
  target:
    entity_id: cover.bedroom_blinds
- action: cover.set_cover_tilt_position
  metadata: {}
  data:
    tilt_position: 40
  target:
    entity_id: cover.bedroom_blinds
mode: single
```

---

## Open blinds weekend
**ID:** `1763184253084`

```yaml
id: "1763184253084"
alias: Open blinds weekend
description: ""
triggers:
- trigger: time
  at: "11:00:00"
  weekday:
  - sat
  - sun
conditions:
- condition: device
  device_id: 39d2e8c22b96f0ca08d3e5c01ad17d60
  domain: cover
  entity_id: 682950f22eaa08dfa1679aac47dc7eb0
  type: is_closed
actions:
- action: cover.open_cover
  metadata: {}
  data: {}
  target:
    entity_id: cover.bedroom_blinds
mode: single
```

---

## Vacation Presence Simulation 1
**ID:** `1763184430088`

```yaml
id: "1763184430088"
alias: Vacation Presence Simulation 1
description: ""
triggers:
- trigger: time_pattern
  hours: "18"
  minutes: "35"
conditions:
- condition: state
  entity_id: input_boolean.presence_simulation
  state:
  - "on"
actions:
- action: light.turn_on
  metadata: {}
  data: {}
  target:
    entity_id:
    - light.office_light
    - light.living_room_socket
    - light.stairs_0_1
mode: single
```

---

## Vacation Simulation Presence Off
**ID:** `1763184470634`

```yaml
id: "1763184470634"
alias: Vacation Simulation Presence Off
description: ""
triggers:
- trigger: time_pattern
  hours: "21"
  minutes: "55"
conditions:
- condition: state
  entity_id: input_boolean.presence_simulation
  state:
  - "on"
actions:
- action: light.turn_off
  metadata: {}
  data: {}
  target:
    entity_id:
    - light.office_light
    - light.bedroom_light
    - light.dining_room_light
    - light.kitchen_niche_light
    - light.kitchen_ceiling_spotlight
    - light.stairs_0_1
    - light.stairs_1_2
    - light.hallway_ceiling_spotlight
    - light.living_room_socket
    - light.shower_ceiling_spots
    - light.shower_mirror_cabinet
    - light.wc_light
    - light.wc_mirror_cabinet
    - light.entrance_light
mode: single
```

---

## Vacation Presence Simulation 2
**ID:** `1766568902939`

```yaml
id: "1766568902939"
alias: Vacation Presence Simulation 2
description: ""
triggers:
- trigger: time_pattern
  hours: "20"
  minutes: "03"
conditions:
- condition: state
  entity_id: input_boolean.presence_simulation
  state:
  - "on"
actions:
- action: light.turn_on
  metadata: {}
  data: {}
  target:
    entity_id:
    - light.bedroom_light
    - light.stairs_1_2
    - light.dining_room_light
mode: single
```

---

## Doorbell
**ID:** `1766823701000`

```yaml
id: "1766823701000"
alias: Doorbell
description: ""
triggers:
- type: turned_on
  device_id: 6b8bb7812b7d9d2daa7f4bca81b176b5
  entity_id: 1d179bc3df2bbc7624fef8e44c34cbc2
  domain: binary_sensor
  trigger: device
conditions: []
actions:
- action: script.doorbell_sonos_kitchen
  metadata: {}
  data: {}
- action: notify.mobile_app_pixel_9
  metadata: {}
  data:
    message: Doorbell
- action: notify.all_devices
  metadata: {}
  data:
    message: Doorbell
    data:
      ttl: 0
      priority: high
- type: turn_on
  device_id: bfd22ea67fa76d6b2399f9126b9d746f
  entity_id: 147d5c70e06b5b2ad88509ca0f8a355b
  domain: switch
- delay:
    hours: 0
    minutes: 0
    seconds: 1
    milliseconds: 0
- type: turn_off
  device_id: bfd22ea67fa76d6b2399f9126b9d746f
  entity_id: 147d5c70e06b5b2ad88509ca0f8a355b
  domain: switch
mode: single
```

---

## Close blinds at night
**ID:** `1768844163636`

```yaml
id: "1768844163636"
alias: Close blinds at night
description: ""
triggers:
- trigger: time
  at: "21:30:00"
  weekday:
  - sat
  - fri
  - thu
  - wed
  - tue
  - mon
  - sun
conditions:
- condition: device
  device_id: c549ef43a53c99d177059b315ad03eee
  domain: cover
  entity_id: 825e5901ba6f93479654e0c5bd5688ac
  type: is_open
- condition: device
  device_id: a5c975ba9856939c1ad10efb0cd5c62f
  domain: cover
  entity_id: e9ed627ead52fc71907ae0269ed5a5a9
  type: is_open
- condition: state
  entity_id: input_boolean.blinds_closed_by_automation
  state:
  - "off"
  enabled: false
actions:
- device_id: c549ef43a53c99d177059b315ad03eee
  domain: cover
  entity_id: 825e5901ba6f93479654e0c5bd5688ac
  type: close
- device_id: a5c975ba9856939c1ad10efb0cd5c62f
  domain: cover
  entity_id: e9ed627ead52fc71907ae0269ed5a5a9
  type: close
mode: single
```

---

## Bathroom window left open
**ID:** `1769373611516`

```yaml
id: "1769373611516"
alias: "\U0001F6AA Contact Sensor Left Open Notification by Malte"
description: ""
use_blueprint:
  path: Raukze/contact-sensor-left-open-notification.yaml
  input:
    trigger_entity: binary_sensor.living_room_west_window_opening
    friendly_name: Bathroom window
    notify_services_string: notify.mobile_app_pixel_9,notify.all_devices
    duration_issue_state:
      hours: 0
      minutes: 10
      seconds: 0
      days: 0
```

---

## Vacation Presence Simulation 3
**ID:** `1769979650708`

```yaml
id: "1769979650708"
alias: Vacation Presence Simulation 3
description: ""
triggers:
- trigger: time_pattern
  hours: "21"
  minutes: "10"
conditions:
- condition: state
  entity_id: input_boolean.presence_simulation
  state:
  - "on"
actions:
- action: light.toggle
  metadata: {}
  target:
    entity_id:
    - light.bedroom_light
    - light.office_light
    - light.dining_room_light
    - light.stairs_0_1
    - light.kitchen_ceiling_spotlight
  data: {}
mode: single
```

---

## Turn entrance light on when someone opens the door
**ID:** `1770483735691`

```yaml
id: "1770483735691"
alias: Turn entrance light on when someone opens the door
description: ""
triggers:
- type: opened
  device_id: 0116162ebc7fb9e052e815243ef011c6
  entity_id: 872eeb4255c079a0b7a4903df54ca218
  domain: binary_sensor
  trigger: device
conditions:
- condition: sun
  before: sunrise
  after: sunset
- condition: state
  entity_id: binary_sensor.someone_home
  state:
  - "off"
actions:
- action: light.turn_on
  metadata: {}
  target:
    entity_id: light.entrance_light
  data: {}
mode: single
```

---

## Sync living room socket with Hue Signe
**ID:** `1771096863558`

```yaml
id: "1771096863558"
alias: Sync living room socket with Hue Signe
description: ""
triggers:
- trigger: state
  entity_id:
  - switch.living_room_socket
  from:
  - "off"
  to:
  - "on"
- trigger: state
  entity_id:
  - switch.living_room_socket
  from:
  - "on"
  to:
  - "off"
conditions: []
actions:
- type: toggle
  device_id: 5d1b8607346ecae1f8f7cc77f4500a26
  entity_id: 0d8fe0505106d3175fca14cc6ca417cc
  domain: light
mode: single
```

---

## Lower brightness in the evening
**ID:** `1771185466313`

```yaml
id: "1771185466313"
alias: Lower brightness in the evening
description: ""
triggers: []
conditions: []
actions:
- action: knx.send
  metadata: {}
  data:
    response: false
    address: 0/5/43
    type: percent
    payload: 30
mode: single
```

---

## Wake tablet
**ID:** `1771617851536`

```yaml
id: "1771617851536"
alias: Wake tablet
description: ""
triggers: []
conditions: []
actions:
- device_id: b72680da3d9b1a49e33d9e71c9986fe0
  domain: mobile_app
  type: notify
  message: command_screen_on
mode: single
```

---

## Button turns all lights off
**ID:** `1771691329447`

```yaml
id: "1771691329447"
alias: Button turns all lights off
description: ""
triggers:
- domain: knx
  device_id: 5f24ce761f48a88a4355d29c58e2600a
  type: telegram
  trigger: device
  group_value_write: true
  group_value_response: true
  group_value_read: true
  incoming: true
  outgoing: true
  destination:
  - 1/2/2
  enabled: true
conditions: []
actions:
- action: light.turn_off
  metadata: {}
  target:
    floor_id:
    - "0"
    - "2"
    - "1"
  data: {}
mode: single
```

---

## Bathroom Shower sync on 
**ID:** `1771779874432`

```yaml
id: "1771779874432"
alias: 'Bathroom Shower sync on '
description: ""
triggers:
- type: turned_on
  device_id: f11d9f48f80ba1f1f639c6ba1f43319b
  entity_id: 7fe6ee5faa139ebfd4b99c5dbdccef14
  domain: light
  trigger: device
conditions: []
actions:
- type: turn_on
  device_id: 90426996ce169ec23a9bdfa98940a4f6
  entity_id: fda4ade8ee0ec9cf6fae2c6a44c67048
  domain: light
mode: single
```

---

## Bathroom Shower sync off 
**ID:** `1771779898287`

```yaml
id: "1771779898287"
alias: 'Bathroom Shower sync off '
description: ""
triggers:
- type: turned_off
  device_id: f11d9f48f80ba1f1f639c6ba1f43319b
  entity_id: 7fe6ee5faa139ebfd4b99c5dbdccef14
  domain: light
  trigger: device
conditions: []
actions:
- type: turn_off
  device_id: 90426996ce169ec23a9bdfa98940a4f6
  entity_id: fda4ade8ee0ec9cf6fae2c6a44c67048
  domain: light
mode: single
```

---

## Toilet light sync on
**ID:** `1772092034409`

```yaml
id: "1772092034409"
alias: Toilet light sync on
description: ""
triggers:
- type: turned_on
  device_id: c1530a580edc53b357ffcf86053024bf
  entity_id: c56f7f21f1f707aac17296153ce3adf9
  domain: light
  trigger: device
conditions: []
actions:
- type: turn_on
  device_id: 1991778e32588bc41b8552c5c84cc700
  entity_id: a5f6d644387ae0188da55f87ce428f36
  domain: light
mode: single
```

---

## Toilet light sync off
**ID:** `1772092076295`

```yaml
id: "1772092076295"
alias: Toilet light sync off
description: ""
triggers:
- type: turned_off
  device_id: c1530a580edc53b357ffcf86053024bf
  entity_id: c56f7f21f1f707aac17296153ce3adf9
  domain: light
  trigger: device
conditions: []
actions:
- type: turn_off
  device_id: 1991778e32588bc41b8552c5c84cc700
  entity_id: a5f6d644387ae0188da55f87ce428f36
  domain: light
mode: single
```

---

## Retract Markise in the evening
**ID:** `1775484056539`

```yaml
id: "1775484056539"
alias: Retract Markise in the evening
description: ""
triggers:
- trigger: sun
  event: sunset
  offset: 0
conditions: []
actions:
- device_id: 6c5f14006c4d7ab3918a5668f82a7710
  domain: cover
  entity_id: 8186a40b56079ca067110bc327119ab7
  type: open
mode: single
```

---

## Close living room blinds during the day
**ID:** `1775682975099`

```yaml
id: "1775682975099"
alias: Close living room blinds during the day
description: ""
triggers:
- trigger: time
  at: "12:30:00"
conditions:
- condition: device
  device_id: 679558d49952e94b45259804183f5fb8
  domain: cover
  entity_id: b48addc3a6b20ddd495e0f6397b3940d
  type: is_open
actions:
- device_id: 679558d49952e94b45259804183f5fb8
  domain: cover
  entity_id: b48addc3a6b20ddd495e0f6397b3940d
  type: set_position
  position: 25
- device_id: 679558d49952e94b45259804183f5fb8
  domain: cover
  entity_id: b48addc3a6b20ddd495e0f6397b3940d
  type: set_tilt_position
  position: 60
mode: single
```

---

## Open living room blinds during the day
**ID:** `1775683087949`

```yaml
id: "1775683087949"
alias: Open living room blinds during the day
description: ""
triggers:
- trigger: time
  at: "19:15:00"
conditions:
- condition: device
  device_id: 679558d49952e94b45259804183f5fb8
  domain: cover
  entity_id: b48addc3a6b20ddd495e0f6397b3940d
  type: is_position
  above: 8
  below: 31
actions:
- device_id: 679558d49952e94b45259804183f5fb8
  domain: cover
  entity_id: b48addc3a6b20ddd495e0f6397b3940d
  type: open
mode: single
```

---

## Close loggia shutters during the day
**ID:** `1775714730516`

```yaml
id: "1775714730516"
alias: Close loggia shutters during the day
description: ""
triggers:
- trigger: time
  at: "10:30:00"
conditions:
- condition: device
  device_id: f58bc46e8c328a7fb545271d47069769
  domain: cover
  entity_id: cdd46dcca8b1bfc1dd4fab3120d45649
  type: is_open
actions:
- device_id: f58bc46e8c328a7fb545271d47069769
  domain: cover
  entity_id: cdd46dcca8b1bfc1dd4fab3120d45649
  type: set_position
  position: 40
mode: single
```

---

## Open loggia shutters during the day
**ID:** `1775714773958`

```yaml
id: "1775714773958"
alias: Open loggia shutters during the day
description: ""
triggers:
- trigger: time
  at: "17:30:00"
conditions:
- condition: device
  device_id: f58bc46e8c328a7fb545271d47069769
  domain: cover
  entity_id: cdd46dcca8b1bfc1dd4fab3120d45649
  type: is_position
  above: 0
  below: 47
actions:
- device_id: f58bc46e8c328a7fb545271d47069769
  domain: cover
  entity_id: cdd46dcca8b1bfc1dd4fab3120d45649
  type: open
mode: single
```

---

## Close office blinds during the day
**ID:** `1775804633092`

```yaml
id: "1775804633092"
alias: Close office blinds during the day
description: ""
triggers:
- trigger: time
  at: "13:00:00"
conditions: []
actions:
- device_id: ccf6f4ab4cef122f0f888547c409be43
  domain: cover
  entity_id: 1198f39680e11e8db940067329a00cb8
  type: set_position
  position: 31
- device_id: ccf6f4ab4cef122f0f888547c409be43
  domain: cover
  entity_id: 1198f39680e11e8db940067329a00cb8
  type: set_tilt_position
  position: 40
mode: single
```

---

## Open office blinds in the evening
**ID:** `1775805228029`

```yaml
id: "1775805228029"
alias: Open office blinds in the evening
description: ""
triggers:
- trigger: time
  at: "18:00:00"
conditions: []
actions:
- device_id: ccf6f4ab4cef122f0f888547c409be43
  domain: cover
  entity_id: 1198f39680e11e8db940067329a00cb8
  type: open
mode: single
```

---

## Close sliding door shutter
**ID:** `1775806057266`

```yaml
id: "1775806057266"
alias: Close sliding door shutter
description: ""
triggers:
- trigger: time
  at: "13:00:00"
conditions:
- condition: device
  device_id: d9c64ce605f553a0f5878ee01cb713d6
  domain: cover
  entity_id: e6d92d15eae0e517a43158944dd32298
  type: is_open
actions:
- device_id: d9c64ce605f553a0f5878ee01cb713d6
  domain: cover
  entity_id: e6d92d15eae0e517a43158944dd32298
  type: set_position
  position: 50
mode: single
```

---

## Retract Markise during high winds
**ID:** `1778697368047`

```yaml
id: "1778697368047"
alias: Retract Markise during high winds
description: ""
triggers:
- trigger: numeric_state
  entity_id:
  - sensor.sbws_90cm_ecf9_speed_2
  for:
    hours: 0
    minutes: 10
    seconds: 0
  above: 12
- trigger: numeric_state
  entity_id:
  - sensor.sbws_90cm_ecf9_precipitation
  above: 2
conditions: []
actions:
- device_id: 6c5f14006c4d7ab3918a5668f82a7710
  domain: cover
  entity_id: 8186a40b56079ca067110bc327119ab7
  type: open
mode: single
```

---

## Open loggia shutters during high winds
**ID:** `1778757988458`

```yaml
id: "1778757988458"
alias: Open loggia shutters during high winds
description: ""
triggers:
- type: speed
  device_id: 05fbf01ce1b79851f7655ba8d878de90
  entity_id: 5fe6f230fe6d1f2fd287f818924488b0
  domain: sensor
  trigger: device
  above: 5
  for:
    hours: 0
    minutes: 5
    seconds: 0
conditions: []
actions:
- device_id: f58bc46e8c328a7fb545271d47069769
  domain: cover
  entity_id: cdd46dcca8b1bfc1dd4fab3120d45649
  type: open
- device_id: d9c64ce605f553a0f5878ee01cb713d6
  domain: cover
  entity_id: e6d92d15eae0e517a43158944dd32298
  type: open
mode: single
```

---

## Reduit door opening turns on light
**ID:** `1778831937979`

```yaml
id: "1778831937979"
alias: Reduit door opening turns on light
description: ""
triggers:
- type: opened
  device_id: f7c0f3fda97ad866f88d35f01a57d082
  entity_id: cff8b0589fc470b757dceb4ebb627deb
  domain: binary_sensor
  trigger: device
conditions: []
actions:
- type: turn_on
  device_id: 3c5831b28e5a40425d86e02068f9f543
  entity_id: a08662c7fe8bc5616177e34f01ae4a61
  domain: light
mode: single
```

---

## Reduit door closing turns off light
**ID:** `1778831969166`

```yaml
id: "1778831969166"
alias: Reduit door closing turns off light
description: ""
triggers:
- type: not_opened
  device_id: f7c0f3fda97ad866f88d35f01a57d082
  entity_id: cff8b0589fc470b757dceb4ebb627deb
  domain: binary_sensor
  trigger: device
conditions: []
actions:
- type: turn_off
  device_id: 3c5831b28e5a40425d86e02068f9f543
  entity_id: a08662c7fe8bc5616177e34f01ae4a61
  domain: light
mode: single
```

---

## Under the stairs door opening turns on light
**ID:** `1778832170345`

```yaml
id: "1778832170345"
alias: Under the stairs door opening turns on light
description: ""
triggers:
- type: opened
  device_id: 2894ec6b78c1c3f193450490bf26e9be
  entity_id: 928b89811529c5fd67537574a83a6472
  domain: binary_sensor
  trigger: device
conditions: []
actions:
- type: turn_on
  device_id: 0d3386f349dbf379ad2ae62a90dd8905
  entity_id: 7570a93e932fe3b208f686bf6c0f54a6
  domain: light
mode: single
```

---

## Under the stairs door closed turns off light
**ID:** `1778832200502`

```yaml
id: "1778832200502"
alias: Under the stairs door closed turns off light
description: ""
triggers:
- type: not_opened
  device_id: 2894ec6b78c1c3f193450490bf26e9be
  entity_id: 928b89811529c5fd67537574a83a6472
  domain: binary_sensor
  trigger: device
conditions: []
actions:
- type: turn_off
  device_id: 0d3386f349dbf379ad2ae62a90dd8905
  entity_id: 7570a93e932fe3b208f686bf6c0f54a6
  domain: light
mode: single
```

---

