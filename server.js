const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Allow CORS for all routes
app.use(cors());

app.get("/", (req, res) => {
    res.send("Welcome to your custom CORS Proxy server!");
});

// Create a proxy middleware to forward requests
app.use("/proxy/:url(*)", (req, res, next) => {
    const targetUrl = req.params.url; // Extract the target URL from the request
    if (!targetUrl) {
        return res.status(400).json({ error: "Invalid URL" });
    }
    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            "^/proxy/": "/", // Remove '/proxy' prefix when making the request to the target server
        },
        onProxyReq: (proxyReq, req, res) => {
            // Modify headers if needed
            proxyReq.setHeader("Origin", req.headers.origin || "");
        },
        onProxyRes: (proxyRes, req, res) => {
            // Modify CORS headers for the response
            proxyRes.headers["Access-Control-Allow-Origin"] = "*";
            proxyRes.headers["Access-Control-Allow-Headers"] =
                "Origin, X-Requested-With, Content-Type, Accept";
        },
    })(req, res, next);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CORS Proxy server running on port ${PORT}`);
});
