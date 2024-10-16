# Contacts Management Application

This project is a **Contacts Management Application** built with **Angular** (frontend) and **.NET Core** (backend). It allows users to Create, Read, Update, and Delete contacts. The application features reactive forms, inline editing, Bootstrap styling, and handles data persistence through a mock JSON-based database.

---

## Setup Instructions

### Prerequisites:

- **Node.js** (Version 14 or higher)
- **Angular CLI** (Version 13 or higher)
- **.NET SDK** (Version 6 or higher)
- A modern web browser like Chrome, Firefox, or Edge

### Installation:

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd contacts-management-app
    ```

2. **Frontend (Angular) Setup**:
    - Navigate to the `client` folder:
        ```bash
        cd contactsapp.client
        ```
    - Install dependencies:
        ```bash
        npm install
        ```

3. **Backend (.NET Core API) Setup**:
    - Navigate to the `server` folder:
        ```bash
        cd contactsapp.server
        ```
    - Restore .NET packages:
        ```bash
        dotnet restore
        ```

4. **Database (Mock JSON Database)**:
    - The project uses a local JSON file as a mock database to store contact information.

---

## Running the Application

1. **Run the Backend API**:
    - Navigate to the `contactsapp.server` folder and run the following command to start the .NET Core API:
        ```bash
        dotnet run
        ```

2. **Run the Frontend (Angular)**:
    - Open another terminal and navigate to the `contactsapp.client` folder:
        ```bash
        cd contactsapp.client
        ```
    - Run the Angular application:
        ```bash
        ng serve
        ```

3. **Open the Application**:
    - After both backend and frontend servers are running, open a browser and visit:
        ```
        http://localhost:4200
        ```

---

## Design Decisions and Application Structure

### Frontend (Angular)

The Angular frontend is built using a component-based architecture with Angular Reactive Forms for managing form inputs. Below is an overview of the key design decisions:

1. **Inline Editing**: 
    - Inline editing is implemented using the `ContactsListComponent` and `ContactFormComponent`. When a user clicks on the "Edit" button, the form is displayed on the same page without navigating away.

2. **Bootstrap for Styling**:
    - Bootstrap is used to style the components and ensure the layout is responsive and user-friendly.

3. **Reactive Forms**:
    - The `ContactFormComponent` uses Angular Reactive Forms, which provide powerful features like form validation and easy handling of dynamic form controls.

4. **Component Communication**:
    - Components communicate using `@Input()` and `@Output()` decorators to handle data flow between parent and child components, ensuring that the list and form are well-integrated.

5. **State Management**:
    - The service `ContactService` uses RxJS's `BehaviorSubject` to manage the state of contacts in the application, ensuring reactivity and synchronization across the app.

### Backend (.NET Core API)

1. **JSON-based Data Storage**:
    - For simplicity, the backend uses a JSON file to store and manage contact data. This acts as a mock database and can be easily switched out for a real database like SQL Server or MongoDB if needed.

2. **Global Error Handling**:
    - The .NET API includes global error handling to catch and handle any issues during CRUD operations. It returns appropriate HTTP status codes and error messages to the frontend.

3. **API Structure**:
    - The API exposes endpoints to perform the following operations:
        - `GET /api/contacts`: Retrieve all contacts.
        - `GET /api/contacts/{id}`: Retrieve a specific contact by ID.
        - `POST /api/contacts`: Add a new contact.
        - `PUT /api/contacts/{id}`: Update an existing contact.
        - `DELETE /api/contacts/{id}`: Delete a contact.

---

## Unit Tests

1. **Frontend Unit Tests**:
    - Unit tests for the Angular components are written using Jasmine and run using Karma. The tests cover:
        - Form submission.
        - Adding and editing contacts.
        - Proper validation and error handling.

2. **Backend Unit Tests**:
    - Unit tests for the .NET Core API are written using XUnit. They cover the basic functionality of the API endpoints and ensure proper data handling and error responses.

---

### Folder Structure

```bash
contacts-management-app/
│
├── contactsapp.client/            # Angular Frontend
│   ├── src/app/
│   │   ├── contact-form/          # Contact form component
│   │   ├── contacts-list/         # Contacts list component
│   │   ├── contact.model.ts       # Contact model
│   │   ├── contact.service.ts     # Contact service for HTTP requests
│   │   └── ...                    # Other Angular project files
│   └── ...                        # Angular config files, assets, etc.
│
├── contactsapp.server/            # .NET Core Backend
│   ├── Controllers/
│   │   └── ContactsController.cs  # API endpoints for managing contacts
│   ├── Models/
│   │   └── Contact.cs             # Contact model
│   ├── Data/
│   │   └── contacts.json          # Mock JSON database
│   └── ...                        # Other backend project files
│
└── README.md                      # Project documentation
