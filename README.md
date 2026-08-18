Banka - A Banking System API

📌 Project Overview

Banka is a simple banking system APIs that allows users to create accounts,
perform transactions (credit, debit), and view transaction history. 
The system includes authentication, authorization, and different user roles (client, staff, admin).

============================================================

🚀 Features

User (client) can sign up.

All Users can log in.

User (client) can create an account.

User (client) can view account transaction history.

User (client) can view a specific account transaction.

Staff (cashier) can debit user (client) account.

Staff (cashier) can credit user (client) account.

Admin/staff can view all user accounts.

Admin/staff can view a specific user account.

Admin/staff can activate or deactivate an account.

Admin/staff can delete a specific user account.

Admin can create staff and admin user accounts.

User can reset the password

=========================================================

🛠️ Technologies Used

Backend: Node.js with Express.js

Database: MongoDB with Mongoose ORM

Authentication: JWT (JSON Web Tokens)

Testing: Jest, Supertest, MongoMemoryServer

Development Tools: Git, Postman, dotenv

=======================================================

📂 Project Structure
Banka/
|-- coverage
|-- node_modules
│-- src/
│   │-- controllers/
|   |   |-- accountController.js
|   |   |-- authController.js
|   |   |-- transactionController.js
│   │-- middleware/
|   |   |-- authMiddleware.js
│   │-- models/
|   |   |-- Account.js
|   |   |-- Transaction.js
|   |   |-- User.js
│   │-- routes/
|   |   |-- accountRoutes.js
|   |   |-- authRoutes.js
|   |   |-- transactionRoutes.js
│   │-- utils/
|   |   |-- generateToken.js
│   |-- app.js
|   |-- server.js
│-- tests/
│   │-- auth.test.js
│   │-- account.test.js
│   │-- transaction.test.js
│   │-- authMiddleware.test.js
│   │-- setup.js
│-- .env
|-- .gitignore
│-- package-lock.json
│-- package.json
└-- README.md

================================================
🛠️ Setup and Installation

Prerequisites

Ensure you have the following installed:

Node.js 19+

MongoDB (if using a local database)

Git

VS Code

===============================================

Installation Steps

1. Clone the repository:

git clone https://github.com/markerson7/banka.git
cd banka

2. Install dependencies:

npm install

3. Set up environment variables:

Create a .env file in the root directory.

Copy the contents of .env.example into .env

Fill in the required values (e.g., JWT_SECRET, MONGO_URI).

4. Start the development server:

npm start

5. Run tests:

npm test

================================================

🔑 Authentication & Authorization

Users must authenticate using JWT tokens.

Clients can only manage their own accounts.

Staff/Admins have additional permissions (e.g., updating account status).

========================================================================

📖 API Endpoints

🧑‍💻 Authentication

Method              Endpoint                    Description

POST            /api/v1/auth/signup           User Registration

POST            /api/v1/auth/signin           User Login


🏦 Account Management

Method              Endpoint                       Description

POST             /api/v1/accounts                Create an account

GET              /api/v1/accounts/:accountNo     Get account details

PATCH            /api/v1/accounts/:accountNo      Update account status

DELETE           /api/v1/accounts/:accountNo       Delete an account


💸 Transactions

Method                     Endpoint                            Description

POST            /api/v1/transactions/:accountNo/credit          Credit an account

POST            /api/v1/transactions/:accountNo/debit           Debit an account

GET             /api/v1/transactions/:transactionId             Get transaction details

========================================================================================

✅ Testing

The project includes unit and integration tests using Jest and Supertest.

Run tests using:

npm test

NOTICE:..........