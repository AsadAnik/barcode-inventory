import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Cors Config ---
const whitelist = ['https://barcode-inventory-chi.vercel.app', 'http://localhost:3000', 'http://0.0.0.0:3000'];
const corsConfig: cors.CorsOptions = {
    credentials: true,
    // origin: process.env.NODE_ENV === 'production' ? 'https://barcode-inventory-chi.vercel.app' : true,
    origin: function (origin: any, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

const middleware: any = [
    morgan('dev'),
    cors(corsConfig),
    bodyParser.json(),
    cookieParser()
];

export default middleware;