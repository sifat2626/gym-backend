# **Gym Class Management System**

## **Project Overview**
The **Gym Class Management System** is designed to manage and schedule gym classes effectively. It provides functionalities for admins to create, update, and delete class schedules, trainers to view and manage their assigned classes, and trainees to book classes. The system ensures smooth and structured operations with role-based access.

---

## **Relation Diagram**
Below is the relational diagram illustrating the structure of the backend database:

![Relational Diagram](./relation-diagram.png)  
*(Replace `relation-diagram.png` with your image or provide a [link to the diagram](https://example.com/relation-diagram))*

---

## **Technology Stack**
- **Backend:** TypeScript, Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** Cookie-based authentication with JSON Web Tokens (JWT)
- **Utilities:** Moment.js
- **Dev Tools:** ESLint, Prettier

---

## **API Endpoints**

### **Auth Routes**
| Method | Endpoint                   | Description                              | Parameters                            |
|--------|----------------------------|------------------------------------------|----------------------------------------|
| POST   | `/auth/register`           | Register a new user (Trainee)            | `name`, `email`, `password`            |
| POST   | `/auth/login`              | Log in to the system                     | `email`, `password`                    |
| GET    | `/auth/profile`            | Get user profile (requires authentication) | N/A                                  |
| POST   | `/auth/logout`             | Log out the user                         | N/A                                    |
| POST   | `/auth/register/trainer`   | Register a new trainer (Admin only)      | `name`, `email`, `password`            |
| PUT    | `/auth/modify/trainer/:id` | Update trainer details (Admin only)      | `name`, `email`                        |

### **Class Routes**
| Method | Endpoint                   | Description                              | Parameters                            |
|--------|----------------------------|------------------------------------------|----------------------------------------|
| POST   | `/classes/create`          | Create a new class (Admin only)          | `title`, `trainer`, `startTime`, `date` |
| GET    | `/classes`                 | Get all class schedules                  | `date` (optional query parameter)      |
| GET    | `/classes/trainer/:id`     | Get classes by trainer (Admin only)      | `trainerId` (path parameter)           |
| POST   | `/classes/:id/book`        | Book a class (Trainee only)              | `classId` (path parameter)             |
| PUT    | `/classes/:id/update`      | Update class details (Admin only)        | `title`, `startTime`, `date`           |
| DELETE | `/classes/:id/delete`      | Delete a class schedule (Admin only)     | `classId` (path parameter)             |

---

## **Database Schema**

### **User Model**
```typescript
type User = {
    name: string;
    email: string;
    password: string;
    role: "Admin" | "Trainer" | "Trainee";
};
```

### **Class Model**

```typescript
type Class = {
  title: string;
  trainer: User; // Reference to a Trainer
  startTime: Date;
  endTime: Date;
  date: Date;
  trainees: User[]; // References to Trainees
};
```

---

## **Admin Credentials**
- **Email:** admin@example.com
- **Password:** admin123

---

## **Instructions to Run Locally**

### **1. Prerequisites**
- **Node.js** (v14+)
- **MongoDB** (local or cloud-based)
- **Git**

### **2. Clone the Repository**
```bash
git clone https://github.com/your-username/gym-class-management.git
cd gym-class-management
```

### **3. Install Dependencies**
```bash
npm install
```

### **4. Set Environment Variables**

Create a .env file in the root directory and add the following:

```bash
PORT=5000
DATABASE=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### **5. Run the Server**

```bash
npm run dev
```

### **6. Test API Endpoints**
Use a tool like Postman or cURL to test the API endpoints.

Live Hosting Link
Gym Class Management System
