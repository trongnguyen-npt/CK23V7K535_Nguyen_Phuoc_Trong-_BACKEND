const express = require("express");
const cors = require("cors");
const contactsRouter = require("./app/routes/contact.route");
const ApiError = require("./app/api-error");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to contact book application." });
});

// Middleware xử lý lỗi 404 - Không tìm thấy tài nguyên
app.use((req, res, next) => {
    return next(new ApiError(404, "Resource not found"));
});

// Middleware xử lý lỗi tập trung
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        message: error.message || "Internal Server Error",
    });
});

module.exports = app;
