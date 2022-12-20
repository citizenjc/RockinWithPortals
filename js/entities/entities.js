var portal;
var direction;
game.PlayerEntity = me.ObjectEntity.extend({

    /* -----

     constructor

     ------ */
    init: function(x, y, settings) {
        // call the constructor
        this.parent(x, y, settings);
        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(2, 10);


        //hitbox
        this.updateColRect(4, 28, 0, 38);

        //add animations
        this.renderable.addAnimation("walk",[0,1,2,3],150);
        this.renderable.addAnimation("idle",[4,4]);

        //start mouse
        me.input.registerPointerEvent("mousedown", me.game.viewport, this.mouseclick.bind(this));

        //define portals and their initial position
        this.blueSpawn = new game.BluePortal(-200, -200, {});
        this.orangeSpawn = new game.OrangePortal(-300, -300, {});

        //add portals
        me.game.add(this.blueSpawn, 4);
        me.game.add(this.orangeSpawn, 4);


    },

    mouseclick: function(e) {

        //shooting portal sound
        me.audio.play("portalshoot");

        //get spawnable areas and their tiles
        var portalAreaH = me.game.currentLevel.getLayerByName("portalAreaH");
        var portalAreaV = me.game.currentLevel.getLayerByName("portalAreaV");
        var tileV = portalAreaV.getTile(e.gameWorldX, e.gameWorldY);
        var tileH = portalAreaH.getTile(e.gameWorldX, e.gameWorldY);


        var posX;
        var posY;

        //what mouse button
        switch (e.button) {
            case me.input.mouse.LEFT:

                portal = this.blueSpawn;
                break;

            case me.input.mouse.RIGHT:
                portal = this.orangeSpawn;
                break;

            default:
                return;
        }

        //did we click on a spawnable area? If yes, define portal position and direction
        if (tileV) {
            //open portal sound
            me.audio.play("portalopen");
            posX = tileV.pos.x;
            posY = tileV.pos.y + 8;
            direction = "vertical";
        } else if (tileH) {
            me.audio.play("portalopen");
            posX = tileH.pos.x;
            posY = tileH.pos.y + 8;
            direction = "horizontal";
        } else return;

        //portal position
        portal.init(posX, posY, {}, direction);



    },

    update: function () {

        //generic awsd movement
        if (me.input.isKeyPressed("left")) {
            this.doWalk(true);
            // flip the sprite on horizontal axis
            this.flipX(true);

        } else if (me.input.isKeyPressed("right")) {
            this.doWalk(false);
            this.flipX(false);
        } else {
            this.renderable.setCurrentAnimation("idle");
            this.vel.x = 0;
        }

        if (me.input.isKeyPressed("jump")) {
            this.doJump();
        }

        if (this.vel.x != 0 && !this.renderable.isCurrentAnimation("walk")) {
            this.renderable.setCurrentAnimation("walk");
        }
        var distance;

        //update movement
        this.updateMovement();

        //collisions
        res = me.game.collide(this);
        if (res) {
            distance = this.distanceTo(res.obj);

            //if close enough to portal
            if (distance <= 18 && this.blueSpawn.pos.x > 0 && this.orangeSpawn.pos.x > 0) {
                //"pull" player towards portal direction
                if (direction == "vertical") this.vel.x += 10;
                else if (direction == "horizontal") this.vel.y += 10;

                //entering portal sound
                me.audio.play("portalenter");

                //what portal did we collide with?
                switch (res.obj.type) {
                    case "blue":
                        this.pos.x = this.orangeSpawn.pos.x - 8;
                        this.pos.y = this.orangeSpawn.pos.y - 8;
                        break;
                    case "orange":
                        this.pos.x = this.blueSpawn.pos.x - 8;
                        this.pos.y = this.blueSpawn.pos.y - 8;
                        break;
                }
            }

        }

        //check distance to each individual portal to make sure we're not teleported on the end of the portal
        var distBlue = this.distanceTo(this.blueSpawn);
        var distOrange = this.distanceTo(this.orangeSpawn);

        if (distBlue < 12) {
            this.blueSpawn.collidable = false;

        } else if (distOrange < 12) {
            this.orangeSpawn.collidable = false;

        } else {
            this.blueSpawn.collidable = true;
            this.orangeSpawn.collidable = true;
        }

        //I need to always update...
        this.parent();
        return true;
    }

});

//portal objects
game.BluePortal = me.ObjectEntity.extend({
    init: function(x, y, settings, direction) {
        settings.image = "blue";
        settings.spritewidth = 16;
        this.parent(x, y, settings, direction);

        //else the portal would fall
        this.gravity = 0;

        //what type is this portal
        this.type = "blue";

        //hitbox
        this.updateColRect(8, 0, 6, 0);

        //check the received direction and decide it's angle.
        switch (direction) {
            case "vertical":
                this.renderable.angle = 0;
                break;
            case "horizontal":
                this.renderable.angle = 1.57079633;
        }

    }
});

game.OrangePortal = me.ObjectEntity.extend({
    init: function(x, y, settings, direction) {
        settings.image = "orange";
        settings.spritewidth = 16;
        this.parent(x, y, settings, direction);

        this.gravity = 0;
        this.type = "orange";
        this.updateColRect(8, 0, 6, 0);
        switch (direction) {
            case "vertical":
                this.renderable.angle = 0;
                break;
            case "horizontal":
                this.renderable.angle = 1.57079633;
        }
    }
});