# QuickDesk - Help Desk Management System

![QuickDesk Logo](https://img.shields.io/badge/QuickDesk-Help%20Desk%20System-orange)
![Django](https://img.shields.io/badge/Django-5.2.4-green)
![Next.js](https://img.shields.io/badge/Next.js-15.2.4-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

QuickDesk is a modern, full-stack help desk management system built with Django REST API backend and Next.js frontend. It provides a comprehensive solution for managing customer support tickets with role-based access control, real-time notifications, and email integration.

## 🌟 Live Demo

- **Frontend**: [https://quickdesk-production.up.railway.app](https://quickdesk-production.up.railway.app)
- **Backend API**: [https://attractive-transformation-production-c76f.up.railway.app](https://attractive-transformation-production-c76f.up.railway.app)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🎯 Core Features

- **Multi-Role System**: Customer, Agent, and Admin roles with specific permissions
- **Ticket Management**: Complete CRUD operations for support tickets
- **Real-time Status Updates**: Automatic status transitions based on actions
- **Comment System**: Public and internal comments with notifications
- **File Attachments**: Support for multiple file types with size limits
- **Advanced Search**: Full-text search with filters and sorting
- **Dashboard Analytics**: Role-specific statistics and performance metrics

### 👥 User Management

- **Authentication**: Secure login/logout with session management
- **Role-based Access Control**: Different permissions for each user type
- **User Profiles**: Customizable user information and preferences
- **Admin Controls**: User management, role changes, and account status

### 🎫 Ticket Features

- **Auto-generated Ticket Numbers**: Sequential ticket numbering (TICK-001, TICK-002...)
- **Priority Levels**: Low, Medium, High, Urgent with visual indicators
- **Categories**: Customizable ticket categories with color coding
- **Status Tracking**: Open, In Progress, Resolved, Closed
- **Assignment System**: Assign tickets to specific agents
- **Voting System**: Upvote/downvote tickets for priority assessment

### 📧 Communication

- **Email Notifications**: Automated emails for ticket events
- **In-app Notifications**: Real-time notification system
- **Comment Threading**: Organized comment discussions
- **Status Notifications**: Automatic updates on status changes

### 🎨 User Interface

- **Modern Design**: Clean, responsive UI with gradient backgrounds
- **Dark Theme Support**: Built-in dark/light theme switching
- **Mobile Responsive**: Optimized for all device sizes
- **Intuitive Navigation**: Role-specific navigation and quick actions

### 📊 Agent Dashboard Features

- **All Tickets View**: Agents can see all tickets, not just assigned ones
- **Quick Status Updates**: Dropdown menus for instant status changes
- **Auto Status Change**: When agents comment, tickets automatically move to "In Progress"
- **Assignment Actions**: Self-assign tickets or assign to other agents
- **Performance Metrics**: Response times, resolution rates, customer satisfaction

### 🔧 Admin Features

- **User Management**: Create, edit, and manage all users
- **Category Management**: Add and customize ticket categories
- **Priority Management**: Configure priority levels and settings
- **System Statistics**: Comprehensive analytics and reporting
- **Email Configuration**: Manage notification settings

## 🛠 Technology Stack

### Backend
- **Framework**: Django 5.2.4 + Django REST Framework
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: Session-based with CSRF protection
- **Email**: SMTP with Gmail integration
- **Deployment**: Railway with Docker

### Frontend
- **Framework**: Next.js 15.2.4 with TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **State Management**: React Hooks + Context API
- **Icons**: Lucide React
- **Deployment**: Railway

### Infrastructure
- **Hosting**: Railway Platform
- **Database**: Railway PostgreSQL
- **Static Files**: WhiteNoise for Django
- **CORS**: Configured for cross-origin requests

## 🏗 System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Django)      │◄──►│  (PostgreSQL)   │
│   Port: 3000    │    │   Port: 8000    │    │   Railway       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Auth     │    │   Email Service │    │   File Storage  │
│   (Session)     │    │   (Gmail SMTP)  │    │   (Local/Media) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- PostgreSQL (for production)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/venkatesh21bit/QuickDesk.git
cd QuickDesk
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
copy .env.example .env  # Windows
# cp .env.example .env  # macOS/Linux

# Configure environment variables (see Environment Variables section)
# Edit .env file with your settings

# Run migrations
python manage.py migrate

# Create default data (categories, priorities)
python manage.py populate_defaults

# Create superuser
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env.local  # Windows
# cp .env.example .env.local  # macOS/Linux

# Configure environment variables
# Edit .env.local with your settings

# Start development server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📖 Usage

### User Roles and Access

#### Customer
- Create and view own tickets
- Add comments to own tickets
- Upload attachments
- View ticket history and status

#### Agent
- **View all tickets** (not just assigned ones)
- **Assign tickets to themselves or other agents**
- **Update ticket status** via dropdown menus
- **Auto-status change**: When agents comment, tickets automatically move to "In Progress"
- Add public and internal comments
- Access performance dashboard

#### Admin
- Full system access
- User management (create, edit, roles)
- Category and priority management
- System analytics and reporting
- Email configuration

### Key Workflows

#### Creating a Ticket (Customer)
1. Navigate to "New Ticket"
2. Fill in subject, description, category, priority
3. Attach files if needed
4. Submit ticket
5. Receive email confirmation

#### Managing Tickets (Agent)
1. View all tickets in agent dashboard
2. Use filters to find specific tickets
3. Click "Update Status" dropdown to change status
4. Assign tickets using "Assign to Me" button
5. Add comments (automatically changes status to "In Progress")
6. Monitor performance metrics

#### System Administration (Admin)
1. Access admin panel for user management
2. Create and manage categories/priorities
3. View system-wide analytics
4. Configure email settings
5. Manage user roles and permissions

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/register/     # User registration
POST /api/auth/login/        # User login
POST /api/auth/logout/       # User logout
GET  /api/auth/profile/      # Get user profile
PUT  /api/auth/profile/      # Update user profile
```

### Ticket Endpoints

```http
GET    /api/tickets/                    # List tickets
POST   /api/tickets/                    # Create ticket
GET    /api/tickets/{id}/               # Get ticket details
PUT    /api/tickets/{id}/               # Update ticket
POST   /api/tickets/{id}/assign/        # Assign ticket
POST   /api/tickets/{id}/update_status/ # Update ticket status
POST   /api/tickets/{id}/vote/          # Vote on ticket
GET    /api/tickets/search/             # Search tickets
```

### Comment Endpoints

```http
GET  /api/tickets/{id}/comments/  # List comments
POST /api/tickets/{id}/comments/  # Add comment
```

### Dashboard Endpoints

```http
GET /api/dashboard/stats/  # Get dashboard statistics
GET /api/admin/stats/      # Get admin statistics
```

## 🔧 Environment Variables

### Backend (.env)

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database (PostgreSQL for production)
DATABASE_URL=postgresql://user:password@host:port/dbname
# OR for local PostgreSQL:
DB_HOST=localhost
DB_NAME=quickdesk_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_PORT=5432

# Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=QuickDesk <your-email@gmail.com>

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com

# QuickDesk Settings
SITE_NAME=QuickDesk
SITE_URL=http://localhost:3000
ENABLE_EMAIL_NOTIFICATIONS=True
MAX_FILE_SIZE=10485760
```

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## 🎯 Gmail Setup for Email Notifications

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification
   - App passwords → Generate password
3. **Use the generated password** in `EMAIL_HOST_PASSWORD`

## 🚀 Deployment

### Railway Deployment

#### Backend Deployment
1. Connect your repository to Railway
2. Add environment variables in Railway dashboard
3. Railway will automatically detect Django and deploy

#### Frontend Deployment
1. Create new Railway service for frontend
2. Connect same repository, set root directory to `frontend`
3. Add environment variables
4. Deploy

### Environment Variables for Production

Update your environment variables for production:
- Set `DEBUG=False`
- Add production domains to `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
- Use production database URL
- Configure email settings with production SMTP

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Check database credentials
   - Verify database exists

2. **Email Not Sending**
   - Check Gmail app password
   - Verify SMTP settings
   - Ensure 2FA is enabled on Gmail

3. **CORS Errors**
   - Add frontend domain to `CORS_ALLOWED_ORIGINS`
   - Check `CSRF_TRUSTED_ORIGINS` settings

4. **Authentication Issues**
   - Clear browser cookies
   - Check session settings
   - Verify CSRF token configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `python manage.py test` (backend)
5. Commit changes: `git commit -am 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Create Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Django REST Framework and Next.js
- UI components from Radix UI
- Icons from Lucide React
- Deployed on Railway Platform

## 📞 Support

For support and questions:
- **Email**: venkatesh.k21062005@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/venkatesh21bit/QuickDesk/issues)

---

**QuickDesk** - Making support ticket management quick and efficient! 🚀
