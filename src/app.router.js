

import userRouter from "./modules/User/user.router.js"
import authRouter from "./modules/Auth/auth.router.js"
import postRouter from "./modules/Post/post.router.js"
import connectDB from './../DB/connection.js';
import { globalErrorHandling } from "./utils/errorHandling.js";
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const initApp = (app, express) => {

    // convert Buffer Data
    app.use(express.json({}));

    // Media Routing
    const fullPath = path.join(__dirname, './uploads')
    app.use("/uploads", express.static(fullPath));

    // App Routing
    app.get('/', (req, res)=> res.send("Hello Word!"));
    app.use("/user", userRouter);
    app.use("/auth", authRouter);
    app.use("/post", postRouter);
    app.all("*", (req, res, next)=>{
        return res.json({message: "In-valid routing"});
    }); 

    // Error handling middleware
    app.use(globalErrorHandling);

    // Connection DB
    connectDB();
}

export default initApp