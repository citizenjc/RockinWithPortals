game.TitleScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);

        // title screen image
        this.title = null;

        this.font = null;
    },

    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("title");
            // font to display the menu items
            this.font = new me.BitmapFont("bfont", 32);

        }

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);

        // play something
        me.audio.playTrack("p2sif", 0.5);

    },

    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.READY);
        }
        return true;
    },

    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
        this.font.draw(context, "DEMO", 500, 435);
    },

    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
    }

});

game.ControlsScreen = me.ScreenObject.extend({
    // constructor
    init: function() {
        this.parent(true);

        // title screen image
        this.title = null;
        this.font = null;
    },

    // reset function
    onResetEvent: function() {
        if (this.title == null) {
            // init stuff if not yet done
            this.title = me.loader.getImage("controls");
            // font to display the menu items
        }

        // enable the keyboard
        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    },

    // update function
    update: function() {
        // enter pressed ?
        if (me.input.isKeyPressed('enter')) {
            me.state.change(me.state.PLAY);
        }
        return true;
    },



    // draw function
    draw: function(context) {
        context.drawImage(this.title, 0, 0);
    },

    // destroy function
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);

    }

});