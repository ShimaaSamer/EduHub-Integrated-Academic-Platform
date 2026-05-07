# 📸 Snap Poster: Advanced Image Processing Hub

## 📝 Overview

Snap Poster is a professional-grade mobile application designed to bridge the gap between advanced image processing and intuitive user experience. Developed as part of our academic journey at Helwan University, the project focuses on delivering high-fidelity UI/UX design combined with efficient and optimized image filtering algorithms.

The application enables users to upload images, apply professional filters with adjustable intensity levels, and experience smooth real-time interactions through a modern mobile interface.

---

# ✨ Key Features

* 🔐 Secure Authentication System (Sign In / Sign Up)
* 🎨 Professional Image Filters with Intensity Control
* ⚡ Optimized Image Rendering for Smooth Performance
* 🖼️ Gallery Upload & Drag-and-Drop Simulation
* 🌙 Premium Dark Mode UI
* 📱 Responsive Mobile-First Design
* ❌ Custom Error Handling States
* 🧩 Reusable Atomic Design Components

---

# 📂 Project Structure

```bash
Snap-Poster/
│
├── src/                 # Core application logic and state management
├── screens/             # High-fidelity UI screens and navigation flows
├── images/              # UX_Phase_images / frames_image / design_system
├── demo/                # Recorded previews and walkthrough videos
├── doc/                 # Technical documentation and UX research
├── backend/             # Flask backend services
├── README.md
└── requirements.txt
```

### Folder Breakdown

### 📁 src/

Contains the main application logic including:

* API integrations
* Filter intensity state management
* Navigation handling
* Reusable helper functions

### 📁 screens/
         
Includes:

* Screens for sign_in 
* Screens for register
* Screens for  home
* Screens for  filter

### 📁 images/

Stores:

* UX_Phase_images
* frames_image
* design_system

### 📁 demo/

Contains:

* Application walkthrough videos
* Navigation transition previews
* Snap Classic filter demonstrations

### 📁 doc/

Includes:

* UI/UX research
* Empathy maps
* Personas
* API documentation
* Technical specifications
* User feedback analysis

---

# 🎨 UI/UX Design System

The application is built using a custom Design System created in Figma, ensuring visual consistency and scalability.

## 🎯 Design Principles

* Minimalist and modern user experience
* Pixel-perfect alignment using an 8pt grid system
* Accessible typography and contrast ratios
* Reusable atomic components

## 🎨 Color Palette

| Color           | Hex       |
| --------------- | --------- |
| Navy Midnight   | `#121B2E` |
| Electric Purple | `#7065F0` |
| Soft White      | `#F5F7FA` |
| Gray Accent     | `#8E9AAF` |

## ✍️ Typography

Fonts used:

* Inter
* Poppins

Optimized for readability across mobile devices.

## 🧩 Components

Reusable UI Components include:

* Buttons
* Dropdown Menus
* Input Fields
* Filter Sliders
* Cards
* Navigation Bars

---

# ⚙️ Technical Specifications

## 🔐 Authentication Flow

* Secure Sign In / Sign Up
* Input validation
* Error handling
* Session management

## 🎛️ Filter Engine

### Intensity Control

Users can dynamically adjust filter intensity using a custom-built slider logic.

### Image Processing

Image rendering is optimized to minimize lag during heavy processing operations.

## 📤 Upload & Interaction

Supports:

* Native gallery browsing
* Drag-and-drop simulation
* Smooth upload experience

## ❌ Error Handling

Custom-designed error states such as:

```text
Something went wrong. Please try again.
```

maintain a seamless user experience.

---

# 🛠️ Tech Stack

## Frontend

* React 
* JavaScript / TypeScript

## Backend

* Python
* Flask

## Image Processing

* OpenCV
* PIL (Pillow)

## Design

* whimsical
* AI-assisted UI workflows

## Version Control

* Git
* GitHub

---

# 🏗️ System Architecture

```text
    React Web App
            ↓
    Flask API
            ↓
    OpenCV/Pillow Engine
            ↓
    Processed Image Output
```

---

# 📱 Screenshots

> Add your application screenshots here.

```md
![Login Screen](images/login.png)
![Home Screen](images/home.png)
![Filter Screen](images/filter.png)
```


## Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

---

# 📊 User Research & Feedback

This project follows a user-centric approach.

Research materials include:

* Empathy Maps
* User Personas
* Feedback Analysis
* Usability Testing Reports

All documentation is available inside the `doc/` folder.

---

# 🚀 Future Improvements

* AI-powered smart filters
* Real-time camera effects
* Cloud image storage
* Social media sharing integration
* Advanced editing tools
* Performance optimization for large images

---

# 👨‍💻 Team & Supervision

**Shimaa Samir**
**Shorouk Mostafa**
**Manar Ahmed**
**Maryam Ahmed**
**Nada Mohamed**

## Academic Supervisor

**Dr. Rania**

## Institution

**Helwan University**

---

# 🌟 Project Vision

Snap Poster aims to combine modern mobile engineering, advanced image processing, and high-end UI/UX principles into one seamless platform.

The project reflects our passion for building creative, user-centered digital experiences.

---

# ⭐ Support

If you like this project, feel free to star the repository and support our work.
