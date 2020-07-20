# Cards_Against_Humanities_React

## About
This program is a multiplayer web-based Cards Against Humanity(CAH) game.
Users have the ability to create lobbies and join different lobbies to play a fun game of CAH.

## For Developers
This is a note for any developers who come accross this.

If you feel the need to add a new feature or change a new feature to this program please feel free to `fork` 
or make a `pull request`.

## Running the program
1. Run `npm install` in `./front_end` and `./back_end` directories.
2. Create a free MongoDB account and retrieve the uri of the cluster.
3. Replicate the sample.env into a .env file with the variables filled in.
4. Execute `npm start` within `./front_end` and `./back_end` to run the program.


## TODO List
- [x] User Registeration 
- [x] User Login
- [x] Lobby Creation
- [x] Leaving Lobbies
- [x] Joinging Lobbies
- [x] Submitting Answers to questions
- [x] Point System
- [x] Player limit
- [x] Password portected lobbies
- [] Search Bar for game searches
- [] Game stats(e.g num of players) display
- [] Friend System (Adding and Removing)
- [] Inviting Friends to Lobby
- [] Session Handling (Passport)