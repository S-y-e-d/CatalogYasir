require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const db = require("./db");
const { login } = require("./auth");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("./products");

const app = express();
const PORT = 3000;

const uploadDirectory = path.join(
  __dirname,
  "uploads",
  "products",
);

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, PNG, and WebP images are allowed"));
    }

    cb(null, true);
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

function requireAdmin(req, res, next) {
  if (req.session.isAdmin !== true) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  next();
}

function deleteImage(imagePath) {
  if (!imagePath) {
    return;
  }

  const filename = path.basename(imagePath);
  const filePath = path.join(uploadDirectory, filename);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is working!",
  });
});

app.post("/api/auth/login", async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      message: "Password is required",
    });
  }

  const valid = await login(password);

  if (!valid) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  req.session.isAdmin = true;

  res.json({
    success: true,
  });
});

app.get("/api/auth/me", (req, res) => {
  res.json({
    authenticated: req.session.isAdmin === true,
  });
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Could not log out",
      });
    }

    res.clearCookie("connect.sid");

    res.json({
      success: true,
    });
  });
});

function validateProduct(product) {
  const { name, price, category, status } = product;

  if (!name || !category || price === undefined || !status) {
    return "Name, price, category, and status are required";
  }

  if (!["Available", "Limited", "Unavailable"].includes(status)) {
    return "Invalid product status";
  }

  if (Number.isNaN(Number(price)) || Number(price) < 0) {
    return "Price must be a valid positive number";
  }

  return null;
}

app.get("/api/products", (req, res) => {
  const products = getProducts();
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = getProduct(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.json(product);
});

app.post(
  "/api/products",
  requireAdmin,
  upload.single("image"),
  (req, res) => {
    const error = validateProduct(req.body);

    if (error) {
      if (req.file) {
        deleteImage(`/uploads/products/${req.file.filename}`);
      }

      return res.status(400).json({
        message: error,
      });
    }

    const imagePath = req.file
      ? `/uploads/products/${req.file.filename}`
      : null;

    const product = createProduct({
      ...req.body,
      image_path: imagePath,
    });

    res.status(201).json(product);
  },
);

app.put(
  "/api/products/:id",
  requireAdmin,
  upload.single("image"),
  (req, res) => {
    const existingProduct = getProduct(req.params.id);

    if (!existingProduct) {
      if (req.file) {
        deleteImage(`/uploads/products/${req.file.filename}`);
      }

      return res.status(404).json({
        message: "Product not found",
      });
    }

    const error = validateProduct(req.body);

    if (error) {
      if (req.file) {
        deleteImage(`/uploads/products/${req.file.filename}`);
      }

      return res.status(400).json({
        message: error,
      });
    }

    const imagePath = req.file
      ? `/uploads/products/${req.file.filename}`
      : existingProduct.image_path;

    const product = updateProduct(req.params.id, {
      ...req.body,
      image_path: imagePath,
    });

    if (req.file && existingProduct.image_path) {
      deleteImage(existingProduct.image_path);
    }

    res.json(product);
  },
);

app.delete("/api/products/:id", requireAdmin, (req, res) => {
  const product = getProduct(req.params.id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const deleted = deleteProduct(req.params.id);

  if (!deleted) {
    return res.status(500).json({
      message: "Could not delete product",
    });
  }

  deleteImage(product.image_path);

  res.json({
    success: true,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});