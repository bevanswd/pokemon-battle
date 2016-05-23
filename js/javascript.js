var charmander = {
	name: "Charmander",
	health: 100,
	lvl: 12,
	effect: null,
	moves: [
		{
			name: "Ember",
			type: "Attack",
			power: 20,
			accuracy: .70
		},
		{
			name: "Scratch",
			type: "Attack",
			power: 10,
			accuracy: .80
		},
		{
			name: "Leer",
			type: "Defense",
			power: .20,
			accuracy: 1.0
		},
		{
			name: "Growl",
			type: "Defense",
			power: .60,
			accuracy: .60
		}
	]
};

var pikachu = {
	name: "Pikachu",
	health: 100,
	lvl: 13,
	effect: null,
	moves: [
		{
			name: "Thunder Shock",
			type: "Attack",
			power: 22,
			accuracy: .70
		},
		{
			name: "Thunder Wave",
			type: "Attack",
			power: 12,
			accuracy: .80
		},
		{
			name: "Tail Whip",
			type: "Defense",
			power: .22,
			accuracy: 1.0
		},
		{
			name: "Growl",
			type: "Defense",
			power: .60,
			accuracy: .60
		}
	]
};

/*STATE MACHINE*/

var currentState;
var cpuPokemon;
var userPokemon;

var cpuTurn = {
	play: function() {
		var randomMove = Math.floor(Math.random() * 4);
		var currentCPUMove = cpuPokemon.moves[randomMove];

		var setUpCPUField = function () {
			$("#chat-text").text("What will " + cpuPokemon.name + " do?");
			prepareToAttack();
		};

		var prepareToAttack = function () {
			$("#pikachu-img").animate({
				top: "-=25",

			}, 200, function() {
				$("#pikachu-img").animate({
					top: "+=25",
				}, 200)
			});
			getAccuracy();
		};

		var getAccuracy = function () {
			var setAccuracy = Math.random();
			if (setAccuracy <= currentCPUMove.accuracy) {
				$("#chat-text").text(cpuPokemon.name + " used " + currentCPUMove.name + "!");
				getMoveType();
			} else {
				$("#chat-text").text(cpuPokemon.name + " missed with " + currentCPUMove.name + "!");
				currentState = playerTurn;
				setTimeout(loop, 1500);
			}
		};

		var getMoveType = function () {
			showMoveAnimation();

			if (currentCPUMove.type == "Attack") {
				setTimeout(attackingMove, 500);
			} else {
				setTimeout(defensiveMove, 1500);
			}
		};

		var showMoveAnimation = function () {
			$("#attack-img").addClass("cpu-attack-img");
			$("#attack-img").removeClass("hide");
			$("#attack-img").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
		};

		var attackingMove = function () {
			$("#attack-img").addClass("hide");
			$("#attack-img").removeClass("cpu-attack-img");
			if (!cpuPokemon.effect) {
				userPokemon.health -= currentCPUMove.power;
			} else {
				userPokemon.health -= (currentCPUMove.power) - (currentCPUMove.power * cpuPokemon.effect);
				cpuPokemon.effect = null;
			}
			$("#user-health-bar").css("width", userPokemon.health + "%");
			currentState = playerTurn;
			loop();
		};

		var defensiveMove = function () {
			$("#attack-img").addClass("hide");
			$("#attack-img").removeClass("cpu-attack-img");
			userPokemon.effect = currentCPUMove.power;
			currentState = playerTurn;
			loop();
		};

		setUpCPUField();

	}
};

var playerTurn = {
	play: function() {
		var currentUserMove;

		var setUPUserField = function(){
			var moveButtons = ["#move1-text", "#move2-text", "#move3-text", "#move4-text"];
			$("#user-buttons").removeClass("hide");
			$("#chat-text").text("What will " + userPokemon.name + " do?");

			for (var i = moveButtons.length - 1; i >= 0; i--) {
				$(moveButtons[i]).text(userPokemon.moves[i].name);
			};
		};

		var prepareToAttack = function () {
			$("#user-buttons").addClass("hide");

			$("#charmander-img").animate({
				top: "-=25",

			}, 200, function() {
				$("#charmander-img").animate({
					top: "+=25",
				}, 200)
			});
			getAccuracy();
		};

		var getAccuracy = function () {
			var setAccuracy = Math.random();

			if (setAccuracy <= currentUserMove.accuracy) {
				$("#chat-text").text(userPokemon.name + " used " + currentUserMove.name + "!");
				getMoveType();
			} else {
				$("#chat-text").text(userPokemon.name + " missed with " + currentUserMove.name + "!");
				currentState = cpuTurn;
				setTimeout(loop, 1500);
			}
		};

		var getMoveType = function () {
			showMoveAnimation();

			if (currentUserMove.type == "Attack") {
				setTimeout(attackingMove, 500);
			} else {
				setTimeout(defensiveMove, 1500);
			}
		};

		var showMoveAnimation = function () {
			$("#attack-img").addClass("user-attack-img");
			$("#attack-img").removeClass("hide");
			$("#attack-img").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100);
		};

		var attackingMove = function () {
			$("#attack-img").addClass("hide");
			$("#attack-img").removeClass("user-attack-img");
			if (!userPokemon.effect) {
				cpuPokemon.health -= currentUserMove.power;
			} else {
				cpuPokemon.health -= (currentUserMove.power) - (currentUserMove.power * userPokemon.effect);
				userPokemon.effect = null;
			}
			$("#cpu-health-bar").css("width", cpuPokemon.health + "%");
			currentState = cpuTurn;
			loop();
		};

		var defensiveMove = function () {
			$("#attack-img").addClass("hide");
			$("#attack-img").removeClass("user-attack-img");
			cpuPokemon.effect = currentUserMove.power;
			currentState = cpuTurn;
			loop();
		};

		/*'unbind' is a special function which resets the attribute value*/
		$("#move1-button, #move2-button, #move3-button, #move4-button").unbind().click(function () {
			var move = $(this).attr("value");
			currentUserMove = userPokemon.moves[move];
			prepareToAttack();

		});

		setUPUserField();
	}
};

/*GAME LOOP*/

var loop = function () {
	if (cpuPokemon.health <= 0 || userPokemon.health <= 0) {
		$("#game-over").removeClass("hide");
		$("#reset").click(function () {
			reset();
		});

		if (charmander.health <= 0) {
			$("#chat-text").text("Charmander has fainted! You lose!");

			$("#user-buttons").addClass("hide");

			$("#charmander-img").animate({
				top: "-=25",

			}, 200, function() {
				$("#charmander-img").animate({
					top: "+=300",
				}, 200)
			});

		} else {
			$("#chat-text").text("Pikachu has fainted! You win!");

			$("#user-buttons").addClass("hide");

			$("#pikachu-img").animate({
				top: "-=25",

			}, 200, function() {
				$("#pikachu-img").animate({
					top: "+=500",
				}, 200)
			});
		}

		console.log("Game Over");
	} else {
		currentState.play();
	}
};

/*RESET FUNCTION*/
var reset = function () {
	charmander.health = 100;
	pikachu.health = 100;
	charmander.effect = null;
	pikachu.effect = null;
	$("#cpu-health-bar").css("width", 100 + "%");
	$("#user-health-bar").css("width", 100 + "%");
	$("#pikachu-img").css("top", 40 + "px");
	$("#charmander-img").css("top", 121 + "px");
	$("#game-over").addClass("hide");
	init();
};

/*INIT FUNCTION*/

var init = function () {
	cpuPokemon = pikachu;
	userPokemon = charmander;
	$("#cpu-name").text(cpuPokemon.name);
	$("#cpu-lvl").text("lvl " + cpuPokemon.lvl);
	$("#user-name").text(userPokemon.name);
	$("#user-lvl").text("lvl " + userPokemon.lvl);
	currentState = playerTurn;
	loop();
};

init();