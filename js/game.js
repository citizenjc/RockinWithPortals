
/* Game namespace */
var game = {
	
	// Run on page load.
	"onload" : function () {
	// Initialize the video.
	if (!me.video.init("screen", 640, 480, true, 'auto')) {
		alert("Your browser does not support HTML5 canvas.");
		return;
	}

	// add "#debug" to the URL to enable the debug Panel
	if (document.location.hash === "#debug") {
		window.onReady(function () {
			me.plugin.register.defer(debugPanel, "debug");
		});
	}

	// Initialize the audio.
	me.audio.init("mp3,ogg");

	// Set a callback to run when loading is complete.
	me.loader.onload = this.loaded.bind(this);

	// Load the resources.
	me.loader.preload(game.resources);

	// Initialize melonJS and display a loading screen.
	me.state.change(me.state.LOADING);




},

    /* ---

     callback when everything is loaded

     ---  */

    "loaded" : function ()
    {

        // Title
        me.state.set(me.state.MENU, new game.TitleScreen());

        // Controls
        me.state.set(me.state.READY, new game.ControlsScreen());

        // Play
        me.state.set(me.state.PLAY, new game.PlayScreen());


        // set a global fading transition for the screen
        me.state.transition("fade", "#000000", 250);

        // add our player entity in the entity pool
        me.entityPool.add("PlayerDuke", game.PlayerEntity);
        me.entityPool.add("BluePortal", game.BluePortal);
        me.entityPool.add("OrangePortal", game.OrangePortal);

        // keyboard input
        me.input.bindKey(me.input.KEY.A, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.W, "jump", true);

        // start the game
        me.state.change(me.state.MENU);





    }
};

