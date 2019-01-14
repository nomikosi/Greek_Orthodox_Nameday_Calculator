


<h2>What is it? </h2>
  ------------

  CelebrationService is an HTTP web service made with MongoDB NodeJS and Express that handles requests about celebration info either by name or by date.
  All calculations are based on Orthodox Easter. 
  



<h2>Documentation</h2>
  ------------

  CelebrationService has two web methods the findbydate and the findbyname. Both of them return a JSON object containing the required information.


 **findbydate**
    Parameters (numeric): year, month, day. Combining those values the findbydate returns the records which names celebrate that date
    Example: http://localhost:3000/findbydate?year=2015&month=4&day=23

  **findbyname**
    Parameters (alphabetic): name. Returns a list of dates.
    Example: http://localhost:3000/findbyname/?name=Γιώργος
	
	Orthodox namedays are divided in three categories:

		* mobile, which are related to Orthodox Easter
		* static, which are the same each year
		* St. George's nameday, which is celebrated either on 23th of April (if the day is after Orthodox Easter) or the first Monday after Orthodox Easter.


<h2>Installation</h2>
  ------------

  CelebrationService requires to run Node.js and MongoDB.

  **Mongo**. After installing Mongo, create a path to local drive for database ex. C:\data\db. In order to store data files in another path, follow the guides here:
    	 -- https://docs.mongodb.org/manual/tutorial/manage-mongodb-processes/ 

  **Node.js**. After installing Node.js you will need to install the packages express, mongodb, basic-auth.

        * For mongodb package run:  "npm install mongodb" in the local project directory
        * For express package run “npm install express” in the local project directory
        * For basich http authentication run "npm install basic-auth" in the local project directory


<h2>Useful links</h2>
  ------------
  
  1. Mongodb installation guide: https://docs.mongodb.org/manual/tutorial/install-mongodb-on-windows
  2. Basic http authentication npm https://www.npmjs.com/package/basic-auth
  3. In case you are using Netbeans IDE, and want to install NodeJS, download the plugin nbm file from http://timboudreau.com/builds/job/NetBeans-NodeJS-Plugin/lastSuccessfulBuild/. You can then install NodeJS from Tools > Plugins > Downloaded > Add Plugins and then select the downloaded nbm file and click install
  4. The code for calculating the Orthodox Easter was found here: http://stackoverflow.com/questions/3584307/code-golf-calculate-orthodox-easter-date

