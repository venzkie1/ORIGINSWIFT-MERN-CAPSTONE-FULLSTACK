import express from 'express'; 
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/user.route.js';
import gigRoute from './routes/gig.route.js';
import orderRoute from './routes/order.route.js';
import conversationRoute from './routes/conversation.route.js';
import messageRoute from './routes/message.route.js';
import reviewRoute from './routes/review.route.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import helmet from "helmet";
// import Message from './models/message.model.js';


const app = express();

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"]
  }
}));

dotenv.config(); //enable process.env.MONGO
mongoose.set('strictQuery', true);

const connect = async ()=> {
try {
    await mongoose.connect(process.env.MONGO); //URI, yarn add dotenv to prevent error 
console.log('connected to MongoDB');

  // await Message.deleteMany({}); (delete all the data from the table Messages)
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ 
  origin:"http://localhost:5173", 
  credentials: true 
}));


app.use(express.json());
app.use(cookieParser());//middleware


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/home", (req, res) => {
  res.status(200).send('welcome to my originswift api');
});

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;  
  const errorMessage = err.message || "Something went wrong!"

  return res.status(errorStatus).send(errorMessage);
})

app.listen(8800, () => {
    connect()
    console.log(`Backend Server running`);
});