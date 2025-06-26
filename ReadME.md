Hello, this is a basic digi wallet app that allows a person to deposit, withdraw and transfer their money. The system has the capability to handle 4 different currencies namely VCASH, VINR, VUSD and VLESS. Each currency has a fixed value as follows : 
1 VCASH = 10 VINR = 50 VUSD = 100 VLESS. If the currency is not changed, the default value is VCASH. All the wallet transactions are dealt in VCASH and all the currencies are first converted to VCASH at the backend. 

BACKEND ENV REQUIREMENTS 
    1) PORT : 0702
    2) MONGO_URI : A mongodb url to connect to the database
    3) JWT_SECRET : A secret key that is used for password hashing
    
CORE USER FUNCTIONALITIES
    1) Register themselves on our system : 
        1.1) The system asks for basic information from the user and stores it in a local mongo database. The user also gets an auto generated account number and IFSC code which is essential for making any kind of transfer. The password created by the user is stored in an encrypted way using bcrypt and 10 salt rounds.
        1.2) Postman endpoint : http://localhost:0702/api/auth/register
        1.3) React based URL : localhost:3000/register

    2) Login into our system : 
        2.1) User is asked for their username and password. Password is hashed and compared to the hashed password available in the database before providing access. If the username and password are correct, a JWT token is generated that is valid for one hour. 
        2.2) This Bearer Token is supposed to be added in the Authorisation tab of the Postman. 
        2.3) If we are using the frontend, the user is redirected to the dashboard page and his 
        2.4) Postman endpoint : http://localhost:0702/api/auth/login
        2.5) React based URL : localhost:3000/login
    
    3) Deposit : 
        3.1) After the user is logged into the system and a bearer token is generated, only then is the deposit access granted. Then, the user can enter the amount and the currency of transaction.
        3.2) Postman endpoint : http://localhost:0702/api/wallet/deposit
        3.3) React based URL : localhost:3000/deposit
        3.4) Ensured atomicity
    
    4) Withdraw : 
        4.1) After the user is logged into the system and a bearer token is generated, only then is the withdraw access granted. Then, the user can enter the amount and the currency of transaction.
        4.2) Postman endpoint : http://localhost:0702/api/wallet/withdraw
        4.3) React based URL : localhost:3000/withdraw
        5.4) Ensured atomicity

    5) Transfer : 
        5.1) After the user is logged into the system and a bearer token is generated, only then is the transfer access granted. Then, the user can enter the recipient account number, recipient IFSC code, amount and the currency of transaction.
        5.2) Postman endpoint : http://localhost:0702/api/wallet/transfer
        5.3) React based URL : localhost:3000/withdraw
        5.4) Ensured atomicity

    6) Transaction history : 
        6.1) After the user is logged into the system and a bearer token is generated, only then is the transaction history access granted.
        5.2) Postman endpoint : http://localhost:0702/api/wallet/history
        5.3) React based URL : localhost:3000/history
    
    7) Soft deletion of account : 
        7.1) If more than 3 flags are placed within 1 hour of the latest flag, the account with that bearer token is automatically soft deleted. The admin has the privilege to undo this deletion. 


CORE ADMIN FUNCTIONALITIES (accessible only via Postman and not by the frontend)
    1) View all flagged transactions. Postman endpoint : http://localhost:0702/api/admin/flagged
    2) Undo soft delete of the user. Postman endpoint : http://localhost:0702/api/admin/undo-delete
    3) View top 5 users according to the balance in account. Postman endpoint : http://localhost:0702/api/admin/top-users
    4) View total money in the whole MongoDB(sum of all wallet balances). Postman endpoint : http://localhost:0702/api/admin/balance-summary


CORE SYSTEM FEATURES (UTILITY FUNCTIONS)
    1) Fraud detection : 
        1.1) Rules applied : 
            1.1.1) Bot like behaviour : More than 3 transactions(deposit, withdraw, tranfer) on one account within a minute.
            1.1.2) Unusually High transfer or withdrawal : If withdrawal or transfer amount is more than 80% of available balance.
            1.1.3) Suspicious funding on new account : If an amount of > 50000 is deposited in a account that was created within 1 hour of deposit
        1.2) Result : 
            1.2.1) Flagged in database and reason is put in the MongoDB

    2) Currency Conversion :
        2.1) The system offers 4 different currencies with each currency having a fixed value(as of now). 
        2.2) All the currencies are first converted into VCASH and then all the operations are performed. Mongo DB stores VCASH amount. 
        2.3) Currency values : 
            2.3.1) 1 VCASH
            2.3.2) 1 VCASH = 10 VINR
            2.3.3) 1 VCASH = 50 VUSD
            2.3.4) 1 VCASH = 100 VLESS
        
    3) Account number generator : A random 5 digit account number is created whenever a new user is created. 

    4) IFSC number generator : A random 5 character alphanumeric IFSC code is created whenever a new user is created. 
    

PREREQUISITES
    1) A shared temporary duplicate cluster of mongodb is needed to perform atomic transactions. It can be either done locally by creating such a db or using Atlas which already provides this service. 
    2) Method for local database : 
        2.1) First terminal : brew services stop mongodb-community@6.0 
        2.2) First terminal : mkdir -p ~/mongodb/rs0
        2.3) First terminal : mongod --dbpath ~/mongodb/rs0 --replSet rs0 --port 27017
        2.4) Second terminal : mongosh --port 27017
        2.5) Second terminal : rs.initiate()
        2.6) Second terminal : rs.status()
        2.7) Let both terminals run

See the guide directory for starting up and loading the web app from scratch
