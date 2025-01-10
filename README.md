# Dynamic Event Calendar Application

A clean, dynamic, and feature-rich Event Calendar application built using **React.js**, **Vite**, **Tailwind CSS**, and **ShadCN UI** components. This app allows users to manage events intuitively while showcasing advanced React logic and clean UI design.

## 🌟 Features

### Calendar View
- Display a calendar grid for the current month with all days properly aligned.
- Navigate between months using **Previous<-** and **Next->** buttons.
- Highlight:
  - The current day.
  - The selected day.

### Event Management
- Add events by clicking on a specific day.
- Edit or delete events for a selected day.
- Each event includes:
  - Event name.
  - Start and end time.
  - Optional description.
- Prevents overlapping events for the same time slot.

### Event List
- View a list of all events for a selected day in a **modal**

### Data Persistence
- All events are stored in **localStorage**, ensuring data is preserved between page refreshes.

## 🚀 Live Demo
[Visit the Deployed App](https://ephemeral-baklava-8404ce.netlify.app/)  
*(Replace `#` with your actual deployment link, e.g., from Vercel or Netlify.)*

## 🛠️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites
Ensure you have the following installed:
- **Node.js** (v16+)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the Repository**:
   ```bash
   git clone git remote add origin https://github.com/AlfiyaSiddique/Cal.git
   cd Cal

2. **Install Dependencies:**:
   ```bash
    npm install 

3. **Run the Development Server:**:
   ```bash
   npm run dev

4. Open your browser and navigate to http://localhost:5173.


## 🧰 Tech Stack

- **React.js**: Frontend framework for building user interfaces.  
- **Vite**: Fast build tool and development server.  
- **Tailwind CSS**: Utility-first CSS framework for custom styling.  
- **ShadCN UI**: Pre-built modern components.  
- **localStorage**: Data persistence.  
