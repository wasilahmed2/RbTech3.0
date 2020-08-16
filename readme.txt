Term project of Web technologies (Assessment 3) by Wasil and Talal (FA17-BCS-024-A & FA17-BCS-002-B)

Description:
A complete project which is basically a computer parts and accesories store's website (fully responsive) named 'RB Tech & games'
It is based on Restful API implemented in node , express and mongoDB. All requirments of assessment 3 is basically completed.
There is authentication added to multiple pages along with autorization which includes the admin only dashboard.
The dashboard consists of a complete CRUD capabilities.

Installation:
1) Make sure you have mongodb installed on your computer.
2) Clone the repository and open the RBTECH3.0 folder in your vscode
3) Open terminal in the folder and run command 'npm install'
4) Then after that installs run the command 'npm start'
5) After that it should show message of "Connected to Mongo..." and "Welcome"
6) Then you can go to the browser and in the url tpye "localhost:3000" and the webpage should open.

How to Run:
-At first the homepage should open which would have a navbar and motto at the middle and a builds section. [The build section is a gallery of the the pc's built by the shop for their clients]
-You can navigate through the navbar and the 'HOME' or 'RB TECH & GAMES' are links to the homepage.
-The 'COMPUTERS' link does not do anything but the 'PRODUCTS' link directs you to the product page. [The product page is the section where numerious product cards are added to show multiple products and animations are added like when you hover your mouse on a product top right side it will display its description and when you hover on price it will show you the button to add to cart which yet doesn't do anything]
-Now the "DASHBOARD" link redirects you to the admin only accessible dashboard where the CRUD capablities are but first it will redirect you to the Sign In Page i.e. Login Page
-Now when you click on DASHBOARD it will redirect you to Login page where you will first click on SignUp page.
-Now on the SignUp page use the credentials 
Name : admin
Email : admin@admin
Password : admin
-Then when you click on SignUp it will take you to Login page and then enter the email and the password and click on LogIn(SignIn)
-Now when you click on LogIn and if credentials are right it will redirect you to the CRUD page. See the following on how to use crud page.

How to use 'DASHBOARD (CRUD)' :
-You will see 3 input fields and a button with no data. This is because the database is not created yet in mongoDB and there is no data to get.
-So first you need to add some data i.e. products. [You can input Name,Price and Description which are String values.]
-After you write in all the input fiels you will click on the "Add Product" button and it will PUSH (CREATE) the data into the database in mongodb after created its collection automatically.
-After you click the button it will also then GET (READ) the data from database and display it on the screen in coloumns with respect to its name, price and description given.
-Now in order to UPDATE (PUT) the data, you need to first input all three fields that you want to write and then DON'T click the Add products button instead click on "EDIT" button of the field you want to update and it will take values from the fiels and PUT (UPDATE) the values of that product.
-Also to update you need to input all 3 fields otherwise if you write only its name or price or description, only that will be shown in the product and others would become null.
-Now to DELETE the product from the database all you need to do is to click on the "DELETE" button of the product and it will delete the product from the database and refresh the page and show you the updated database from mongodb.
-Now you can click on "LOGOUT" button on the navbar top right and it will take you to the main homepage and get you out of the Dashboard section.


Languages :
--PUG
--HTML
--CSS
--Javascript {JQuery + JSON}

NOTE : node_modules folder is hidden from github so when you npm install every dependencies should install without issues.

NOTE2 : DONOT REMOVE ".env" file because it won't run without it because i added a securtiy authorization to my project that without it the code won't run (it was in .gitignore but as Sir had to run it themselves i have to add it back again)

NOTE3 : All rights reserved to RB TECH & GAMES and myself as this is accquired by them for their use and purpose and do ask before using this. 



