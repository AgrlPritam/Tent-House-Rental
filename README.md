# Tent-House-Rental
A rental service to rent various furniture and other non-consumable items developed using MERN Stack Development

To run the project in your system (experienced person can directly go to Step 5,6,10,11):
1) Download the zip project from the repository (You can also clone it)
2) Extract the project in your folder
3) Open any IDE (VSCode suggested for its ease of use)
4) Click on File --> Open folder --> Select Tent-House-Rental-master
5) Create a new file and name it exactly as ".env". A gear like icon will show on the side of this file in your VSCode
6) Open it and declare two variables: 
    SECRET=AnyTextHere
    JWT_TOKEN=AnyRandomeSentenceHere
You can use any text for above two variables but ensure the capitalized secret and jwt_token variable name and no whitespace in between your sentence
7) Be cautious to not to push those in your git repository as these are as important (rather more important) as passwords
8) Click on Terminal --> New Terminal in your VSCode
9) Ensure you have installed nodeJS in your system. Link: https://nodejs.org/en/
10) Now install all dependent packages by executing below command in terminal
     npm i 
11) Download and install mongodb Atlas in your system and define the bash_profile to use mongod and mongo aliases for ease of bringing up the database.
12) After all packages are installed in current folder, and mongodb is up, you are good to fire up the Server. Execute below:
    npm run dev
13) Wait till you get a response "Server is up on port 3000"

Software involved and required:
1)Git
2)IDE
3)Mongodb Atlas
4)Robo3T (optional for data viewing)
5)Postman (optional for APIs)
6)NodeJS
