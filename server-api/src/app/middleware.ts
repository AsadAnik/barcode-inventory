import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

// Cors Config ---
const corsConfig: cors.CorsOptions = {
    credentials: true,
    origin: process.env.NODE_ENV === 'production' ? 'https://barcode-inventory-chi.vercel.app' : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

const middleware: any = [
    morgan('dev'),
    cors(corsConfig),
    bodyParser.json(),
    cookieParser()
];

export default middleware;