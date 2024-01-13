## About
This program is a multiplayer web-based Cards Against Humanity(CAH) game.
Users have the ability to create lobbies and join different lobbies to play a fun game of CAH.

### Home Page
Users can create lobbies, they have the option to specify the max number of players, points, and whether to put a password upon joining that lobby. This application also has a built in search functionality with autocomplete that looks up all the available lobbies, this allows for groups of friends to interact with each other.

### In-Game Page
The in-game page is made to look clean and easier to understand. Players can scroll horizontally through their cards, and at max each, player will have 12 answer cards. This was implemented to remove the clutterness of cards being stacked on top of each other upon overflowing. Players are also notified of who is the czar. Chosen answers are highlighted upon selection by the czar at the round, and czars are selected after each round. On the completion of a game, the winner's username is displayed and confetti starts falling from the top. After that users simply leave the game and join another.

## Running the program

#### Local setup
* Install MongoDB
    * `https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#install-mongodb-community-edition`
* Run and connect to mongo
    * `https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/#run-mongodb-community-edition-from-the-command-interpreter`
* Create a file in the `/back_end` called '.env' and based on the 'sample.env' file provided, fill out the details according to your MongoDB (the database itself will have to be setup by you)
* Execute `npm install` in the /front_end and the /back_end folders
* Execute `npm run` in the /front_end and the /back_end folders

## TODO List
- [x] User registration 
- [x] User login
- [x] Lobby creation
- [x] Leaving lobbies
- [x] Joining lobbies
- [x] Submitting answers to prompts
- [x] Point system
- [x] Player limit
- [x] Password protected lobbies
- [x] Searchbar for game searches
- [x] Game stats(e.g num of players) display
- [x] Session Handling (Passport)
