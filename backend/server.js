const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['goal-field-4shm-hymivu61o-braulio-rosarios-projects.vercel.app', 'https://goal-field-git-main-braulio-rosarios-projects.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
});
app.use(cors({ 
  origin: ['goal-field-4shm-hymivu61o-braulio-rosarios-projects.vercel.app', 'https://goal-field-git-main-braulio-rosarios-projects.vercel.app'], 
  credentials: true,
  optionsSuccessStatus: 200 // Para compatibilidad con navegadores antiguos
}));
app.use(express.json());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
      }
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.use(passport.initialize());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

io.on('connection', (socket) => {
  console.log('Socket.io client connected:', socket.id);
  socket.on('disconnect', () => console.log('Socket.io client disconnected:', socket.id));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('CORS origins:', ['goal-field-4shm-hymivu61o-braulio-rosarios-projects.vercel.app', 'https://goal-field-git-main-braulio-rosarios-projects.vercel.app']);
});

module.exports = { server, io };