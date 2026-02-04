import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";


const app = express();

// Allow multiple origins for development
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.CORS_ORIGIN
].filter(Boolean);

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    console.log(`[HEADERS] Content-Type: ${req.headers['content-type']}`);
    next();
});

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static("public"));
app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js'
import propertyRouter from './routes/property.routes.js'
import wishlistRouter from './routes/wishlist.routes.js'
import interiorRouter from './routes/interior.routes.js'


//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/properties", propertyRouter)
app.use("/api/v1/wishlist", wishlistRouter)
app.use("/api/v1/interiors", interiorRouter)

// common error handling middleware
app.use((err, req, res, next) => {
    console.error("Global Error Handler detected error:", err);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: err.error || []
    });
});

export { app }