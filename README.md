🛒 Noah’s Ark Shop API

A full-featured e-commerce REST API built with Node.js, Express, PostgreSQL, featuring JWT authentication, role-based access control, transactional order processing, and a clean, scalable backend architecture.

This project was built to deeply understand real-world backend concepts such as authentication, database relationships, foreign keys, transactions, and service-based architecture.

🚀 Features
🔐 Authentication & Authorization

User registration and login

Password hashing with bcrypt

JWT-based authentication

Role-based access control (Admin vs User)

Protected routes with middleware

Clean handling of unauthorized & expired tokens

📦 Products

Create products (Admin only)

Fetch products (Public)

Update product stock automatically on order creation

Soft product control using is_active

🧾 Orders

Create orders for authenticated users

Orders linked to users via foreign keys

Order items stored in a separate table

Transactional order creation (ACID-safe)

Automatic stock deduction per product

Fetch user-specific orders

Admin access to all orders

Order status management (Admin)

🧱 Database Design

PostgreSQL relational schema

Proper use of foreign keys

orders ↔ order_items ↔ products

Cascading deletes

Data integrity enforced at database level

Transactions using BEGIN, COMMIT, ROLLBACK

🏗️ Tech Stack

Node.js

Express.js

PostgreSQL

JWT (jsonwebtoken)

bcrypt / bcryptjs

dotenv

pg (node-postgres)
