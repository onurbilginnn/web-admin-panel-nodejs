const path = require('path');

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bodyParser = require('body-parser');
const multer = require('multer');
const csrf = require('csurf');

const sequelize = require('./util/database');

const User = require('./models/user');
const Article = require('./models/article');

const app = express();
app.locals.companyName = 'OB';

app.set('view engine', 'ejs');
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images');
    },
    filename: (req, file, cb) => {
      cb(null, new Date().toISOString() + '-' + file.originalname)
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }

  const sequelizeSessionStore = new SequelizeStore({
    db: sequelize,
});

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

app.use(session({
  secret: 'keep it secret, keep it safe.',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: false,
}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(csrfProtection);


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(authRoutes);

Article.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Article);

sequelizeSessionStore.sync()
.then(result => {

    app.listen(3333);
})
.catch(err => console.log(err));
