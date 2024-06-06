.........................................................................................................................................................................................
How to use this code is also mentioned after the basic introduction.
.........................................................................................................................................................................................
Thank you for providing me the opportunity to explain my code.
My name is Harsh saxena and here is my
Project Overview:

A. Note and Task Creation:
  1. This project allows users to create notes or tasks.
  2. Each task includes properties such as tags, descriptions, and titles.
  3. Users can update these properties as needed.
     
B User Authentication and Management:
  1. Users can create accounts and log in to access their tasks.
  2. Passwords are securely stored using bcryptjs, ensuring they are saved in hash form rather than plain text.

c. Task Authorization:
  1. Only authorized users can update their tasks.
  2. Authorization is managed using JSON Web Tokens (JWT).

D. Validation and Verification:
  1. Input validation and verification are handled using express-validator to ensure data integrity and security.

E. Schema Design:
  1. The noteSchema uses a reference key (ref) as user, linking notes to their respective users.
  2. The userSchema designates email as the primary key, ensuring unique identification of users.


This structure ensures that the application is secure, efficient, and user-friendly, providing robust functionality for task management while maintaining high standards of data     protection and user authentication.

...........................................................................................................................................................................................
Now lets Talk about the apis
So basically there are total 7 apis that are working 

A. Authentication Routes
  1. Create user - signup/Creating an account
  2. usercredentials - For login/signin
  3. get all user - Fetch all user details except passwords

B. Task Routes
  1. getallnotes - Fetch all notes from the user database
  2. addnote - Add/upload new notes/tasks
  3. updatenote - Update an existing note by its _id
  4. deletenote - Delete a specific note using its _id

...........................................................................................................................................................................................
So this code contains folders like->

Middleware
  fetchUser.js
node_modules
routes
  auth.js
  notes.js
src
  database
    conn.js
  models
    noteschema.js
    userschema.js
  index.js
package-lock.json
package.json

...........................................................................................................................................................................................
Dependencies to install in order to run this code 
1. express
2. cors
3. bcryptjs
4. express-validaotr
5. jsonwebtoken
6. mongoose
7. nodemon

...........................................................................................................................................................................................
Steps to run

1. Download the whole source code: Skip the node_modules, package-lock.json, package.json.
2. Install all dependencies: Use npm i <dependencyname> for each dependency.
3. Navigate to the src folder: Use the cd command and run nodemon index.js.

Further you can test my apis using postman or thunderclient
...........................................................................................................................................................................................
Thank You
...........................................................................................................................................................................................
