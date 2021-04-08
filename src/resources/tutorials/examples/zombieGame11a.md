# 1 Set Zombies Rotation
 (Step 1/2)

##### 1. in `room.js`, Delete the old `follow()` function and add the following `follow()` function with updated data.

``` javascript
// File: code/server/rooms/room.js
g.follow('players', 'zombies', 1, 0.1,
	(player, zombie) => {
		zombie.rotation = g.getRotationTowards(zombie, player.x, player.y);
	});
```

We should now have a fully functioning game! Customize it and change or add whatever you like!