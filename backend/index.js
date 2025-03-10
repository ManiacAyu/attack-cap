import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔹 Fix for form-data
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => console.log("Connected to MongoDB"));

const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
});

const PostSchema = new mongoose.Schema({
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  media: { 
    url: { type: String, default: null },
    mimetype: { type: String, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", UserSchema);
const Post = mongoose.model("Post", PostSchema);

const SECRET_KEY = process.env.JWT_SECRET;

// Signup API
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
});

// Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id }, SECRET_KEY);
  res.json({ token });
});


const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    req.user = jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.post("/post", authenticate, upload.single("media"), async (req, res) => {
  console.log("Received body:", req.body);
  console.log("Received file:", req.file);

  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "Content is required" });

  const newPost = {
    content : content,
    authorId: req.user.userId,
  };

  app.post("/post/:id", authenticate, async (req, res) => {
    const id = req.params.id;
    const posts = await Post.find(authorId = id);
    res.json(posts);
  })

  
  if (req.file) {
    newPost.media = {
      url: `uploads/${req.file.originalname}`,
      mimetype: req.file.mimetype,
    };
  }

  const post = new Post(newPost);
  await post.save();
  res.status(201).json({ message: "Post created successfully", post });
});


app.get("/posts", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  console.log("Heyy");
  res.json(posts);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
