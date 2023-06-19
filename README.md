# Balzy

This is a small game In created as a personal project. I started off following a youtube tutorial for the baic framework of the game mechanics https://www.youtube.com/watch?v=eI9idPTT0c4. The game is avaliable online at https://balzy.onrender.com/ .

## Hosting by Yourself

##### \* This tutorial assumes you're on a personal computer with unlimited command prompt access

1. Install dependencies: [`Visual Studio Code (VSCode)`](https://code.visualstudio.com/download), [`Node.js`](https://nodejs.org/en/download), and [`Git`](https://git-scm.com/downloads)
2. Open your local terminal `VSCode`
   - Type Type **Ctrl + `**
3. Navigate to the directory where you want the project by running the command in the terminal:
   - `cd "C:\Users\[path_to_Desktop]\Desktop"`
4. Clone this Git repository and change to the new project's directory, again in the terminal:
   - `git clone https://github.com/ThreatArizing/balzyCommit.git`
   - `cd balzyCommit`
5. Download the project's `npm` dependencies
   - `npm install`
6. Start the app
   - `node app.js`
7. Visit http://localhost:8080 where the app's page is hosted (NOT _https_).

## Features

1. **Personal Highscore**: Stores your personal best score to the local storage and displays it!
2. **Global Highscore**: Sends your personal best score to the mangoDB database, checks if it the global highest then displays it!
3. **Power-Ups/Boost**: You can speed up, shrink size, refill ammo and even fight a big boss!
