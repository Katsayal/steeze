# Steeze - AI-Powered Wardrobe & Outfit Recommendation App

![Steeze](https://img.shields.io/badge/Steeze-Fashion%20Tech-purple)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen)

Steeze is a modern web application that helps you manage your wardrobe and generate outfit recommendations based on weather conditions, mood, and personal style preferences.

## 🌟 Features

### 👕 Wardrobe Management
- **Upload clothing items** with images (stored on Cloudinary)
- **Categorize items** by type (shirt, pants, jacket, shoes, accessories)
- **Tag items** with style attributes (casual, formal, streetwear, etc.)
- **Edit and delete** wardrobe items
- **Filter and search** through your collection

### ✨ Smart Outfit Generation
- **Weather-based recommendations** using real-time weather data from OpenWeather API
- **Mood-based styling** (confident, chill, creative, sporty)
- **Style tag filtering** for personalized suggestions
- **Auto-save generated outfits** to your collection
- **Geolocation integration** for accurate weather detection

### 📊 Dashboard
- **Real-time weather widget** showing current conditions
- **Wardrobe statistics** (item count, saved outfits, style score)
- **Quick action buttons** for easy navigation
- **Recent items display** with visual previews

### 👤 User Profile
- **Email and preferences management**
- **Style preferences** customization
- **Password change** functionality
- **Gender and location** settings

### 💾 Saved Outfits
- **View all generated outfits** with details
- **Delete unwanted outfits**
- **Mood and weather tags** for each outfit
- **Item previews** in grid layout

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File upload handling
- **Cloudinary** - Image storage
- **Bcrypt** - Password hashing

### External APIs
- **OpenWeather API** - Real-time weather data
- **Cloudinary API** - Image hosting and transformation

## 📁 Project Structure

```
steeze/
├── backend/
│   ├── config/
│   │   └── cloudinary.js          # Cloudinary configuration
│   ├── controllers/
│   │   ├── auth.controller.js     # Authentication logic
│   │   ├── outfit.controller.js   # Outfit generation logic
│   │   └── user.controller.js     # User & wardrobe logic
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   └── upload.js              # Multer/Cloudinary setup
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── WardrobeItem.js        # Wardrobe item schema
│   │   └── Outfit.js              # Outfit schema
│   ├── routes/
│   │   ├── auth.routes.js         # Auth endpoints
│   │   ├── user.routes.js         # User & wardrobe endpoints
│   │   ├── outfit.routes.js       # Outfit endpoints
│   │   └── weather.routes.js      # Weather endpoints
│   ├── services/
│   │   └── weather.js             # OpenWeather API integration
│   ├── .env                       # Environment variables
│   ├── app.js                     # Express app setup
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Authentication state
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Signup.jsx         # Signup page
│   │   │   ├── Dashboard.jsx      # Dashboard with weather
│   │   │   ├── Upload.jsx         # Upload wardrobe items
│   │   │   ├── Wardrobe.jsx       # View/edit wardrobe
│   │   │   ├── OutfitGenerator.jsx # Generate outfits
│   │   │   ├── SavedOutfits.jsx   # View saved outfits
│   │   │   └── Profile.jsx        # User profile settings
│   │   ├── services/
│   │   │   └── api.js             # Axios instance with interceptors
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- OpenWeather API key

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
OPENWEATHER_API_KEY=your_openweather_api_key
JWT_SECRET=your_jwt_secret
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/steeze.git
cd steeze
```

2. **Install backend dependencies**
```bash
cd backend
npm install
npm install axios  # Required for weather service
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Start the backend server**
```bash
cd backend
npm run dev
```

5. **Start the frontend development server**
```bash
cd frontend
npm run dev
```

6. **Open your browser**
Navigate to `http://localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### User & Wardrobe
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password
- `POST /api/user/wardrobe` - Upload wardrobe item
- `GET /api/user/wardrobe` - Get wardrobe items (with filters)
- `PUT /api/user/wardrobe/:id` - Update wardrobe item
- `DELETE /api/user/wardrobe/:id` - Delete wardrobe item

### Outfits
- `POST /api/outfit/generate` - Generate outfit with weather
- `GET /api/outfit` - Get saved outfits
- `DELETE /api/outfit/:id` - Delete outfit

### Weather
- `GET /api/weather?lat=&lon=` - Get current weather

## 🎨 Key Features Explained

### Weather Integration
The app uses the OpenWeather API to fetch real-time weather data based on the user's geolocation. This data influences outfit recommendations:
- **Cold weather** (≤10°C): Suggests warmer clothing
- **Hot weather** (≥25°C): Suggests lighter clothing
- **Rainy conditions**: Filters appropriate items

### Outfit Generation Algorithm
1. Fetches user's wardrobe items
2. Filters by style tags (if provided)
3. Considers current weather conditions
4. Randomly selects up to 4 items (shirt, pants, jacket, shoes)
5. Saves the outfit to the database
6. Returns outfit with weather information

### Image Upload & Storage
- Images are uploaded via multipart/form-data
- Multer handles file processing
- Cloudinary stores and transforms images
- Supports: JPG, PNG, JPEG, WEBP, GIF, BMP
- Max file size: 5MB
- Auto-resize to 1000x1000px

## 🔐 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Token stored in localStorage
- Auth interceptor for API requests
- Loading state prevents premature redirects

## 🎯 Future Enhancements
- [ ] AI-powered style recommendations
- [ ] Social features (share outfits)
- [ ] Calendar integration for outfit planning
- [ ] Color matching algorithm
- [ ] Outfit rating system
- [ ] Mobile app (React Native)
- [ ] Virtual try-on with AR
- [ ] Seasonal wardrobe analytics

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.

## 👨‍💻 Author
Built with ❤️ by the Steeze team

## 🙏 Acknowledgments
- OpenWeather API for weather data
- Cloudinary for image hosting
- MongoDB Atlas for database hosting
- React and Express communities

---

**Happy Styling! 👔✨**
