# Admin Dashboard

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction
The Admin Dashboard is a web application designed to provide administrators with a comprehensive interface to manage and monitor various aspects of their system. It includes features such as user management, analytics, and reporting.

## Features
- User Management: Add, edit, and delete users.
- Analytics: View real-time data and statistics.
- Reporting: Generate and export reports.a# Admin Dashboard

A responsive, optimized, and feature-rich admin dashboard built with Next.js, Tailwind CSS, and Redux Toolkit. This project includes API integration, state management, and data visualization.


## 🚀 Features

- **Modern UI/UX** - Built with Next.js and Tailwind CSS
- **Dark/Light Mode** - Toggle between themes with state persistence
- **Data Visualization** - Dynamic charts using Recharts
- **API Integration** - Fetch and display real user and post data
- **State Management** - Global state with Redux Toolkit
- **User Management** - View and manage user data with pagination
- **Post Management** - View and manage post data 
- **Performance Optimized** - Code splitting and lazy loading
- **Mobile Responsive** - Fully responsive on all device sizes
- **TypeScript Integration** - Type-safe development experience

## 📋 Tech Stack

- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **API Fetching**: Fetch API with Redux Thunks
- **Charts/Visualizations**: Recharts
- **Type Safety**: TypeScript
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 🔧 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/jigar-padhiyar/NextAdmin.git
cd admin-dashboard
```

2. **Install dependencies**

```bash
npm install
```

or if any conflicts occurs 

```bash
npm install --legacy-peer-deps
```

3. **Run the development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

5. **Run the production server**

```bash
npm start
```

## 📊 Project Structure

```
admin-dashboard/
├── next/                 # Next.js configuration files
├── .vercel/              # Vercel deployment configuration
├── app/                  # Main application directory
│   └── api/auth/[...nextauth]/ # Next.js authentication routes
├── routes.ts             # Application routes configuration
├── pages/                # Application pages
│   ├── auth/             # Authentication related pages
│   │   ├── signin/       # Sign-in page
│   │   │   └── page.tsx  # Sign-in page component
│   │   └── signin.tsx    # Sign-in component
│   ├── dashboard/        # Dashboard pages
│   │   ├── users/        # User management page
│   │   ├── dashboard.tsx # Main dashboard component
│   │   └── page.tsx      # Dashboard page component
│   ├── posts/            # Post management pages
│   └── page.tsx          # Main page component
├── components/           # Reusable UI components
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── DataChart.tsx # Data visualization chart component
│   │   └── RecentActivity.tsx # Recent activity component
│   ├── layout/           # Layout components
│   │   ├── DashboardLayout.tsx # Dashboard layout wrapper
│   │   ├── header.tsx    # Header component
│   │   ├── sidebar.tsx   # Sidebar navigation component
│   │   └── themeToggle.tsx # Theme toggle component
│   ├── posts/            # Post-related components
│   │   ├── PostItem.tsx  # Individual post component
│   │   └── PostList.tsx  # Post listing component
│   └── ui/               # UI components
│       └── Pagination.tsx # Pagination component
├── users/                # User-related components
│   ├── DraggableUserList.tsx # Draggable user list component
│   └── UserItem.tsx      # Individual user component
├── context/              # React context providers
│   └── authProvider.tsx  # Authentication context provider
├── node_modules/         # Node.js dependencies
├── public/               # Static assets
├── state/store/          # State management
│   └── feature/          # Feature-specific state slices
│       ├── postSlice.ts  # Posts state management
│       ├── themeSlice.ts # Theme state management
│       └── userSlice.ts  # Users state management
├── types/                # TypeScript type definitions
│   └── next-auth.d.ts    # NextAuth type definitions
├── utils/                # Utility functions
├── .env.local            # Local environment variables
├── .gitignore            # Git ignore configuration
├── .npmrc                # NPM configuration
├── eslint.config.mjs     # ESLint configuration
├── next-env.d.ts         # Next.js TypeScript declarations
├── next.config.js        # Next.js configuration
├── package-lock.json     # Dependency lock file
├── package.json          # Project dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── postcss.config.mjs    # PostCSS configuration module
├── README.md             # Project documentation
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## ✨ Key Features

### Dashboard Metrics Visualization

The dashboard provides real-time visualization of key metrics:

- API response time with change indicators
- Total users count with percentage of capacity
- Total posts count with percentage of capacity
- Additionally for UI check implemented a switch which toggle the data for data chart should be from API or math random which will update on every 3 seconds

The metrics can be displayed using either:
- Simulated data (with random variations over time)
- Real API data from the JSONPlaceholder API

### User & Post Management

- View all users fetched from JSONPlaceholder API
- View all posts with associated user information
- Recent activity feed showing latest user and post updates

### Theme Support

- Toggle between dark and light modes
- Theme preference is saved to Redux state

## 🔒 Authentication

This project uses NextAuth.js for authentication with the following features:

- Secure login and registration
- Protected routes and API endpoints
- Role-based access control

## 🌐 API Integration

The application integrates with:

- JSONPlaceholder API for users and posts data
- Custom API endpoints for dashboard metrics

## 🔍 State Management

Redux Toolkit is used for global state management with the following slices:

- User state: Manages user data and loading states
- Post state: Manages post data and loading states
- Theme state: Manages dark/light mode preference
- Auth state: Manages authentication state

## 📱 Responsive Design

The dashboard is fully responsive with:

- Mobile-first approach
- Adaptive layouts using Flexbox and Grid
- Collapsible sidebar for mobile devices
- Optimized charts and tables for small screens

## 🚀 Performance Optimizations

- Code splitting with Next.js dynamic imports
- Lazy loading of components and routes
- Image optimization with Next.js Image component
- Memoization of expensive calculations with useMemo and useCallback

## 👨‍💻 Development Practices

- TypeScript for type safety
- Component-based architecture
- Git workflow with feature branches and pull requests
- Consistent coding style with ESLint and Prettier

## 📈 Future Enhancements

- Add real-time data updates with WebSockets
- Implement drag-and-drop for user list rearrangement
- Add more advanced data visualization options
- Create a comprehensive admin panel with CRUD operations
- Add unit and integration tests

## 🌟 Live Demo

Visit the live demo: [Admin Dashboard Demo](https://next-admin-dashboard-puce.vercel.app/)

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
- Responsive Design: Works on both desktop and mobile devices.

## Installation
To get a local copy up and running, follow these simple steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/jigar-padhiyar/NextAdmin.git
    ```
2. Navigate to the project directory:
    ```bash
    cd admin-dashboard
    ```
3. Install dependencies:
    ```bash
    npm install or npm install --legacy-peer-deps if any issue or conflicts in installing node modules
    ```
4. Start the development server:
    ```bash
    npm start
    ```

## Usage
Once the server is running, you can access the application at `http://localhost:3000`. Use the dashboard to manage users, view analytics, and generate reports.

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Jigar Padhiyar - [jigar.padhiyar@techsierra.in]

Project Link: [https://github.com/your-username/admin-dashboard](https://github.com/jigar-padhiyar/NextAdmin.git)