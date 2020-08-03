# Cards_Against_Humanities_React

## About
This program is a multiplayer web-based Cards Against Humanity(CAH) game.
Users have the ability to create lobbies and join different lobbies to play a fun game of CAH.

### Home Page
Users can create lobbies, they have the option to specify the max number of players, points, and whether to put a password upon joining that lobby. This application also has a built in search functionality with autocomplete that looks up all the available lobbies, this allows for groups of friends to interact with each other.

### In-Game Page
The in-game page is made to look clean and easier to understand. Players can scroll horizontally through their cards, and at max each, player will have 12 answer cards. This was implemented to remove the clutterness of cards being stacked on top of each other upon overflowing. Players are also notified of who is the czar. Chosen answers are highlighted upon selection by the czar at the round, and czars are selected after each round. On the completion of a game, the winner's username is displayed and confetti starts falling from the top. After that users simply leave the game and join another.

## For Developers
This is a note for any developers who come accross this.

If you feel the need to add a new feature or change a new feature to this program please feel free to `fork` 
or make a `pull request`.

## Running the program

#### First setup the database:
1. Go to `https://mlab.com/`
2. Sign up if you don't have an account otherwise login.
3. Click on free cluster.
4. Choose a server that would best fit for you, and create the free cluster.
5. After cluster has been made press on `Connect`.
6. Add your IP to the whitelist, and choose a username and password(be sure to remember this), after that move to the next step, by clicking `Choose a Connection Method`.
7. From the options click on `Connect Your Application`.
8. Copy the mongo uri and replace the `<password>` with the password you used earlier.


#### For a simple, native deploy:

1. Clone the repo into a spatious drive or directory of your choosing
2. Change the proxy in frontend/package.json to the correct IP/localhost of your choosing(http://localhost:PORT)
3. Create a file in the /backend called '.env' and based on the 'sample.env' file provided, fill out the details according to your MongoDB (the database itself will have to be setup by you)
4. run 'npm install' in the /frontend and the /backend folders
5. run 'npm run' in the /frontend and the /backend foldershttps://github.com/ckanich-classrooms/final-project-the-foobar-fighters.git


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
- [x] Search Bar for game searches
- [x] Game stats(e.g num of players) display
- [x] Session Handling (Passport)
- [] Friend System (Adding and Removing) ... Optional
- [] Inviting Friends to Lobby ... Optional