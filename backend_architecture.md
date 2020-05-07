This document is an attempt to define the classes and their attributes, properties and methods.

Here, *properties* are "pure" functions (i.e. they do not mutate the state of the object) which have an object of the type as their only argument - you can think of a property as of a dynamic attribute of an object, which is just derived (computed) from the object's other attributes; *methods* are functions which have the object as their first argument and are either impure (i.e. they mutate the object) or have additional parameters; *static methods* are functions related to the Type but not having an object of the Type as parameter. This nomenclature is inspired by OOP Python slang, but I just find it to make a lot of sense. Python slang is also used whenever the variable `self` is used in here. This variabel always refers to the object in talk. So, when we talk about a method of a certain Type, `self` refers to the instance of that Type, on which this method is called, very similar to `this` in JavaScript.


# Game


## Attributes

+ __New__ `() Game`: *The constructor.*
+ __Players__`[]model.Player`: *All Players in the Game, in their seating order.*
+ __DealerId__`int`: *The Id of the dealer of the Game.*
+ __QuestionRounds__ `[]model.QuestionRound`: *The QuestionRounds of the Game.*


## Properties

+ __Dealer__`() model.Player`: *The dealer of the Game. (This will be the dealer of the first QuestionRound in the Game.)*
+ __CurrentQuestionRound__`()`: *The QuestionRound of the Game's QuestionRounds which is currently being played, i.e. the first QuestionRound in the Game's QuestionRounds whose `IsFinished()` property is False.*
+ __OutPlayers__ `() []model.Player`: *All players in the Game who are out (or say: "broke"), i.e. they do not have any money any more.*
+ __InPlayers__ `() []model.Player`: *All players who are still in the game, in their seating order.*


## Methods

+ __New__ `() Game`: *The constructor.*
+ __AddPlayer__`(player models.Player)`: *Append `player` to the Game's `Players`.*
+ __CreatePlayer__`()`: *Create a new Player and pass it to the Game's `AddPlayer()` method.*
+ __CreateNewQuestionRound__`()`: *Append a freshly created QuestionRound to the Game's `QuestionRounds`, ensuring that the Question of that QuestionRound is not a Question of any of the previous QuestionRounds in the Game.*


# QuestionRound


## Attributes

+ __CurrentPlayerId__ `int`: *The id of the current Player.*
+ __Question__ `Question`: *The Question of the QuestionRound.*
+ __Guesses__: `map[Player, Float64]`: *The map naming the guess per each player.*
+ __Bets__ `map[model.Player]int`: *The Bets of the Players.*
+ __FoldedPlayerIds__: `[]int`: *The ids of the Players who have folded in the QuestionRound.*
+ __BettingRounds__ `[]BettingRound`: *The BettingRounds of the QuestionRound.*
+ __CurrentBettingRound__ `int`: *The index of the current BettingRound.*


## Properties

+ __Game__`() model.Game`: *The ("parent") Game of the QuestionRound.*
+ __Index__`() int`: *The position of the QuestionRound in the Game.*
+ __Dealer__`() model.Player`: *The dealer of the QuestionRound.*
+ __IsFinished__`() bool`: *Whether the QuestionRound is finished or not. This is based on the number of Hints of the QuestionRound's Question, and on the `Index()` of the `CurrentBettingRound()` of the QuestionRound (When all Hints are exhausted, i.e. the number of Hints equals the number of BettingRounds - 1, and if the last BettingRound's `IsFinished()` is True, then the QuestionRound is finished.)*
+ __CurrentPlayer__`() model.Player`: *The current Player.*
+ __InPlayers__`() []model.Player`: *All Players who still participate in the QuestionRound, i.e. they still have the chance to win at least a side pot, in their seating order.*
+ __BettingPlayers__ `[]model.Player`: *All Players who still participate in the QuestionRound and have not gone all in yet, in their seating order.*
layer: *All Players who have neither folded yet nor are gone all in.*
+ __NextBettingPlayer__`() model.Player`: *The Player of BettingPlayers who is sitting closest on the "left" to the QuestionRound's CurrentPlayer().*
+ __AllInPlayers__`() []model.Player`: *All players who have gone all in, i.e. all players out of the QuestionRound's `InPlayers()` whose `Amount` equals 0 but who have not folded (i.e. their `Id` is not to be found in the QuestionRound's `FoldedPlayerIds`).*
+ __BetToCall__`() int`: *The amount that needs to be called for a player to stay in the QuestionRound, i.e. the maximum `Amount` in the QuestionRound's `Bets`.*
+ __Pots__`() []map[model.Player]int`: *The (side) pots of the QuestionRound. Each pot is a map that holds the amount each player participating in the pot has committed to that pot. This is based on the QuestionRound's `FoldedPlayerIds` and `Bets` attribute, and uses its `AllInPlayers()` property.*


## Methods

+ __New__ `() QuestionRound`: *The constructor. Sets the `CurrentPlayer` attribute according to the Game's `Dealer()` and `InPlayers()` properties and the QuestionRound's Index().*
+ __AddGuess__`(player: model.Player, guess: Float64) nil`: *Add `guess` for `player` to the QuestionRound's `Guesses`.*
+ __DistributeMoney__ `() nil`: *Distribute the money in the main pot and all side pots to the players, using the `Winners()` method per each of the QuestionRound's `Pots()`.*


## Static Methods

+ __Winners__`(players []model.Player, guesses []model.Guess, answer float64) []Players`: *Those out of `players` who have made the best guess. (This is not a method of QuestionRound, because Winners must be calculated per side pot, and the players committed to a side pot might be different than the InPlayers() of the QuestionRound).*


# BettingRound


## Attributes

+ __CurrentPlayerId__ `int`: *The id of the current Player.*
+ __LastRaisedPlayerId__ `int`: *The id of the player who had raised most recently.*


## Properties

+ __QuestionRound__ `() QuestionRound`: *The ("parent") QuestionRound of the BettingRound.*
+ __IsFinished__ `() bool`: *Whether the BettingRound is finished or not. This is based on the BettingRound's `LastRaisedPlayerId` and `CurrentPlayerId` attributes.*
+ __NextPlayer__ `() model.Player`: *The Player who's next. This is based on the BettingRound's `CurrentPlayerId` and on the `InPlayers()` property of the BettingRound's `QuestionRound()`.*


## Methods

+ __New__ `() BettingRound`: *The constructor.*
+ __MoveToNextPlayer__ `() nil`: *Update the BettingRound's `CurrentPlayerId` attribute to the value of the BettingRound's `NextPlayer()` property.*
+ __Fold__`(player: model.Player) nil`: *Update the `FoldedPlayerIds` attribute of the  BettingRound's `QuestionRound()`. Call the BettingRound's `MoveToNextPlayer()` method.*
+ __Call__`(player: model.Player) nils`: *Update the `Bets` of the BettingRound's `QuestionRound()` and `player.Amount`, based on the QuestionRound's `BetToCall()` property and on `player.Amount`. (The latter is because of the edge case that the `player` is going all in, i.e. the QuestionRound's `BetToCall()` is greater or equal `player.Amount`.) Also, call the BettingRound's `MoveToNextPlayer()` method. "Check" is considered a "Call" as well.*
+ __Raise__`(player: model.Player, amount: int) nil`: *Update the QuestionRounds' `Bets` attribute and the Player's `Amount` attribute and update the QuestionRound's  `LastRaisedPlayerId` attribute. Call the BettingRound's `MoveToNextPlayer()` method.*
