# Contributing to QuickDesk

Thank you for your interest in contributing to QuickDesk! We welcome contributions from the community.

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Git
- PostgreSQL (for production testing)

### Setting up Development Environment

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/QuickDesk.git
   cd QuickDesk
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   cp .env.example .env
   python manage.py migrate
   python manage.py populate_defaults
   python manage.py createsuperuser
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   ```

## 📝 Development Guidelines

### Code Style

#### Backend (Python/Django)
- Follow PEP 8 style guidelines
- Use meaningful variable and function names
- Write docstrings for classes and functions
- Keep functions small and focused

#### Frontend (TypeScript/React)
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and reusable

### Commit Messages

Use conventional commit messages:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc
- `refactor:` code change that neither fixes a bug nor adds a feature
- `test:` adding missing tests
- `chore:` updating build tasks, package manager configs, etc

Example:
```
feat: add ticket status update dropdown for agents
fix: resolve CSRF token issues with API calls
docs: update installation instructions
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📋 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   - Run backend tests: `python manage.py test`
   - Test frontend functionality manually
   - Ensure no linting errors

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to GitHub and create a PR
   - Fill out the PR template
   - Link any related issues

## 🐛 Bug Reports

When filing a bug report, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, versions)

## 💡 Feature Requests

For feature requests:
- Check if it's already been requested
- Describe the problem you're trying to solve
- Explain why this feature would be beneficial
- Provide examples if possible

## 🏗 Architecture

### Backend Structure
```
backend/
├── app/
│   └── core/
│       ├── models.py      # Database models
│       ├── views.py       # API views
│       ├── serializers.py # DRF serializers
│       ├── services.py    # Business logic
│       └── urls.py        # URL routing
├── config/
│   ├── settings.py        # Django settings
│   └── urls.py           # Main URL config
└── manage.py
```

### Frontend Structure
```
frontend/
├── app/                   # Next.js app directory
├── components/           # Reusable components
├── contexts/            # React contexts
├── hooks/               # Custom hooks
├── lib/                 # Utilities and API client
└── public/              # Static assets
```

## 📚 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Enforcement

Report any unacceptable behavior to venkatesh.k21062005@gmail.com.

## 📞 Questions?

Feel free to reach out:
- Create an issue for bug reports or feature requests
- Email: venkatesh.k21062005@gmail.com
- Start a discussion for general questions

Thank you for contributing to QuickDesk! 🚀
