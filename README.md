# ENSE374-Pulaski

ENSE 374 Project
Group names: Michael, Justine, Cameron

# Project Explanation

This is project P.A.T. the Physical Activity Tracker made by Michael, Justine, Cameron as team Pulaski. The goal of this project is to provide a better web-based tool to track physical activities and assist people in reaching their goals with tracking, as well as finding things that others are doing with sharing and/or suggestions given to them by the application.

# Technologies used

HTML5, CSS3, Node.js, express, ejs, mongoDb,passport, bootstrap

# Install Instructions

Once the repo has been pulled, open a terminal and navigate into the ejs-eg directory. Once there, run the following:

1. Clone the repo to your local machine
2. Navigate into the ejs-eg folder using a terminal that you can use node in, and then
   run the following commands in that terminal:
   i. npm init
   ii. npm i express ejs mongoose passport passport-local passport-local-mongoose express-session dotenv
5. Make a new file named ".env" NOTE: path should be "ejs-eg/.env"
6. In that file write: SECRET=replace_these_letters_with_something_else
7. Ensure that you have replaced the letters asked with something new
8. Ensure mongo is both installed and working
9. Run the command:   node makeDb.js   , to start the database
10. Run the command:   node app.js   , to start the local host
11. Navigate to the console logged URL(http://localhost:3000) in your web browser. You can check the state of your local version of the database using the mongo command "use projectPAT" and then navigating it like you would on any other mongoDb database. If there are errors, ensure all packages are properly installed and that you have both node and mongo working on your local machine. Also make sure that the .env is named ".env" and contains the secret given in steps 6 & 7.
12. Press ctrl+c in the console to stop the app from running, and if you wish to launch it again see step 10.

# MVP 1

The first Minimum Viable Product we have selected to make contains the most basic of
experiences we wish to provide to our users. It allows them to log into our tool so that each and
every log is kept personal and stored in the database rather than on the local device. The next
experience is our calendar functionality, where you can select any day in the past, present or
future and log or plan physical activities. This will allow for tracking of previous activities as
well as providing a clear idea for those who wish to plan ahead for what is coming next. The
final major experience in this MVP is the ability to view progress and set goals. This information
will be stored on the database and will allow users to not only set goals but see the progress they
have made in their journey to achieve their goals. Seeing this progress will help them keep
motivated to complete their goals and ultimately live the way that they set out to do.

# MVP 2

The second iteration of our tool takes away the need for sharing to a third party and
brings it right to the tool. It will bring full profiles where you can share activities, goals, personal
records and anything else you would like to keep yourself and your friends motivated. This is
seen as the second version as it is nice to have in our tool, however, to achieve core functionality
it is not required as sharing to a third-party app is seen as an absolute minimum. The experience
of being social on the app is seen as secondary as it supports the experience given in MVP one,
but it does not hinder those if it is not present.

# Vlog Links

1. Intro Vlog - https://www.youtube.com/watch?v=_nZ_StArH2E
2. Initial Documentation - https://www.youtube.com/watch?v=wQ-DMR_zjoI
3. Design Architecture - https://www.youtube.com/watch?v=QAuIV7RuAFw
4. MVP #1 Demo - https://www.youtube.com/watch?v=leGzvCJ2q-w

# Naming Conventions

1. Pascal case (e.g. PascalCase): Classes (CSS, JS, Tables in database etc), ID’s (Database and HTML), Names/for(HTML) and Directory names
2. Camel case (e.g. camelCase): File names, Table rows, variables, methods/functions
3. Variable names: what its for (e.g. Div, Span, tableId, Object,number etc.) followed by what part of that its for if applicable (e.g. tableIdCounter, numUsers, numColours, navBtn etc.)
4. btn -> whenever you need the word button
5. num -> whenever you would use number
6. temp -> used before more details to denote a temporary storage of something (e.g. tempUser, tempBtn)
