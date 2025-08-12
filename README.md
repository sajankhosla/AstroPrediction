# Vedic Astrology Prediction Engine with Positivity Sinusoid

A full-stack web application that combines ancient Vedic astrology principles with modern technology to provide personalized cosmic insights and visualize life events through a unique positivity sinusoid.

## 🌟 Features

### Core Functionality
- **Vedic Astrology Engine**: Advanced calculations based on ancient Vedic principles
- **Positivity Sinusoid**: Visualize cosmic energy cycles and their alignment with life events
- **Milestone Tracking**: Add and analyze significant life events
- **Real-time Predictions**: Get instant predictions based on current planetary transits
- **Planetary Positions**: View current positions of all major planets
- **Aspect Analysis**: Understand planetary relationships and their influences

### User Interface
- **Modern Design**: Beautiful, responsive UI with cosmic theme
- **Interactive Charts**: Dynamic visualization using Recharts
- **Tabbed Interface**: Organized sections for different types of insights
- **Mobile Responsive**: Works seamlessly on all devices
- **Smooth Animations**: Framer Motion powered transitions

### Technical Features
- **Full-Stack Architecture**: React frontend with Node.js backend
- **SQLite Database**: Lightweight data storage for user information
- **Swiss Ephemeris**: Accurate astronomical calculations
- **RESTful API**: Clean, documented API endpoints
- **Security**: Rate limiting, input validation, and secure data handling

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vedic-astrology-engine
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   ```
   
   Add your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   # The database will be automatically created on first run
   npm run server
   ```

5. **Start the application**
   ```bash
   # Development mode (runs both server and client)
   npm run dev
   
   # Or run separately:
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

## 📊 Positivity Score Algorithm

The core innovation of this application is the **Positivity Score Algorithm**, which calculates a numerical value representing cosmic favorability for any given date.

### Algorithm Components

1. **Planetary Weights**
   - Benefic planets (Jupiter, Venus, Mercury): Positive weights (0.6-0.9)
   - Malefic planets (Saturn, Mars): Negative weights (-0.4 to -0.6)
   - Neutral planets (Sun, Moon): Balanced weights (0.2-0.8)

2. **House Weights**
   - Auspicious houses (1st, 5th, 9th): High positive weights (0.8-0.9)
   - Challenging houses (6th, 8th, 12th): Negative weights (-0.3 to -0.5)
   - Neutral houses: Moderate weights (0.3-0.7)

3. **Dasha Influence**
   - Current dasha period adds 50% additional weight
   - Vimshottari dasha system implementation

4. **Aspect Analysis**
   - Harmonious aspects (trines, sextiles): Positive influence
   - Challenging aspects (squares, oppositions): Negative influence
   - Conjunctions: Variable influence based on planet combinations

### Mathematical Formula
```
Positivity Score = (Σ(Planet Weight + House Weight) / Planet Count + Dasha Weight * 0.5) / (Planet Count + 0.5)
```

The score ranges from -1 (highly challenging) to +1 (highly favorable).

## 🏗️ Architecture

### Backend Structure
```
server/
├── index.js              # Main server file
├── routes/
│   ├── astrology.js      # Astrology API endpoints
│   └── users.js          # User management endpoints
├── utils/
│   ├── vedicEngine.js    # Core astrology calculations
│   └── database.js       # Database operations
└── data/
    └── astrology.db      # SQLite database
```

### Frontend Structure
```
client/
├── src/
│   ├── components/
│   │   ├── LandingPage.js    # Homepage
│   │   ├── PredictionForm.js # Input form
│   │   └── ResultsPage.js    # Results visualization
│   ├── App.js               # Main app component
│   └── index.js             # Entry point
├── public/
│   └── index.html           # HTML template
└── package.json
```

## 🔌 API Endpoints

### Astrology Endpoints
- `POST /api/astrology/prediction` - Generate comprehensive prediction
- `GET /api/astrology/user/:userId` - Retrieve user data
- `POST /api/astrology/update-milestones` - Update user milestones
- `GET /api/astrology/planetary-positions` - Get current planetary positions
- `GET /api/astrology/positivity-score` - Calculate positivity score
- `GET /api/astrology/sinusoid-data` - Generate sinusoid data

### User Endpoints
- `GET /api/users/all` - Get all users (admin)
- `DELETE /api/users/:userId` - Delete user data
- `GET /api/users/statistics` - Get application statistics

## 🎨 Customization

### Styling
The application uses Tailwind CSS with custom configurations:
- Custom color palette for cosmic theme
- Responsive design breakpoints
- Custom animations and transitions

### Adding New Features
1. **New Planetary Calculations**: Extend `vedicEngine.js`
2. **Additional Charts**: Add new chart components in `ResultsPage.js`
3. **Custom Predictions**: Modify prediction algorithms in the engine
4. **New API Endpoints**: Add routes in the appropriate route files

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start both server and client in development
npm run server       # Start backend server only
npm run client       # Start frontend development server
npm run build        # Build frontend for production
npm run install-all  # Install all dependencies
```

### Database Operations
The application uses SQLite for simplicity. For production, consider:
- PostgreSQL for better performance
- Redis for caching
- MongoDB for flexible data structures

### Testing
```bash
# Frontend tests
cd client
npm test

# Backend tests (to be implemented)
npm run test
```

## 🌐 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

### Deployment Platforms
- **Heroku**: Easy deployment with Procfile
- **Vercel**: Great for frontend deployment
- **AWS**: EC2 for backend, S3 for frontend
- **DigitalOcean**: App Platform for full-stack deployment

## 📚 Technical Details

### Dependencies
- **Backend**: Express, SQLite3, Swiss Ephemeris, Moment.js
- **Frontend**: React, Recharts, Framer Motion, Tailwind CSS
- **Development**: Nodemon, Concurrently

### Performance Considerations
- Caching of planetary calculations
- Lazy loading of chart components
- Optimized database queries
- CDN for static assets

### Security Features
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration
- Helmet.js for security headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Swiss Ephemeris**: For accurate astronomical calculations
- **Vedic Astrology Community**: For traditional knowledge and principles
- **Open Source Community**: For the amazing tools and libraries used

## 📞 Support

For questions, issues, or contributions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Note**: This application is for educational and entertainment purposes. Astrological predictions should not be considered as professional advice for life decisions.
