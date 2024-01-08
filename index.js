import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import cookieParser, {signedCookies} from 'cookie-parser';
import cron from 'node-cron';

import passport from './Initialisations/PassportLocal.js';
import passportGoogle from './Initialisations/PassportGoogle.js';
import initializeAdminUser from './Initialisations/AdminUser.js';
import CryptosJobs from './Jobs/UpdateCryptosHistory.js';

import loggerService from './Services/LoggerService.js';

import AuthenticationRoutes from './Routes/AuthenticationRoutes.js';
import UserRoutes from './Routes/UserRoutes.js';
import CryptoRoutes from './Routes/CryptoRoutes.js';
import CrytoDatasRoutes from './Routes/CryptoDatasRoutes.js'
import KeywordRoutes from "./Routes/KeywordRoutes.js";
import RssFeedsRoutes from './Routes/RssFeedsRoutes.js';
import CoinGeckoService from "./Services/CoinGueckoService.js";

const app = express();
console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
      console.log('Connection to MongoDB: SUCCESS !');
      await initializeAdminUser();
    }).catch((err) => console.error('Connection to MongoDB: FAILED...', err));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(loggerService);
app.use(express.urlencoded({extended: true}));
//const whitelist = ['http://localhost:3000', 'http://localhost:5000']
const whitelist = ['https://camille-lecoq.com', 'https://accounts.google.com', 'https://api2.camille-lecoq.com']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true
}

app.use(cors(corsOptions));
app.use((req, res,next) =>
{
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
}
)
app.use(passport.initialize(undefined));
app.use(passportGoogle.initialize(undefined));

var usdToeur = await CoinGeckoService.fetchUSDtoEUR();

export const getUsdToEur = () => {
    return usdToeur;
}

CryptosJobs.updateCryptoDatas().then(() => {
    console.log("Crypto datas updated");
}).catch(() => console.log("error fetching crypto datas"))
cron.schedule('* * * * *', () => {
  console.log('Exécution de la tâche cron pour mettre à jour l’historique des cryptos');
  CoinGeckoService.fetchUSDtoEUR().then((res) => usdToeur = res);
  CryptosJobs.updateCryptoDatas()
      .then(() => console.log('Mise a jour des cryptos terminer'))
      .catch(() => console.log('Erreur lors de la mise a jours des historiques des cryptos'));
});

app.use('/api/auths', AuthenticationRoutes);
app.use('/api/users', UserRoutes);
app.use('/api/cryptos', CryptoRoutes);
app.use('/api/cryptodatas', CrytoDatasRoutes);
app.use('/api/keywords', KeywordRoutes);
app.use('/api/articles', RssFeedsRoutes);

app.listen(process.env.PORT, () => {
  console.log('Server is running on port ' + process.env.PORT);
});
