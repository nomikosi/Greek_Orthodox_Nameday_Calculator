Mongo Import guide
===================

Our database has the following documents :

	-CelebrationNames
	This includes all possible names of the record
	-IsEasterRelated
	This flag is used to seperate St. George's nameday to others
	-CelebrationMonth
	If nameday is static CelebrationMonth has a value
	-CelebrationDay
	Same as above
	-IsStatic
	If the nameday is static flag is 1 else 0
	-Difference
	Difference from Easter in days in case a nameday is non static

The database must contain both the nameday records and the authentication. For this to happen you must run the mongoimport command like :
"mongoimport -d database_name -c collection_name --jsonArray < my.json . If the database_name and collection_name do not already exist, they are automatically generated with this command

Specifically run:

    "mongoimport -d local -c namedays --jsonArray < nameday_1.json" for static namedays
    "mongoimport -d local -c namedays --jsonArray < nameday_2.json" for non static namedays
    "mongoimport -d local -c namedays --jsonArray < nameday_3.json" for St. George case
    "mongoimport -d local -c authentication --jsonArray < credentials.json" for credentials collection
