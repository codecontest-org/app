# 1 Add Zombies
 (Step 5/7)

##### 5. In `room.js`, add a `setInterval()` function to randomly spawn zombies across the map inside the `onInit()` function.

``` javascript
// File: code/server/rooms/room.js
setInterval(() => g.createACharacter('zombies',
	g.nextCharacterId('zombies'), {
		x: Math.floor((Math.random() * 2000) + 1),
		y: Math.floor((Math.random() * 2000) + 1)
	}), 2500);
```

> **The number at the end will determine how long to wait until it spawns another zombie, and the two 2000 numbers are the bounds for where the zombies should spawn.**