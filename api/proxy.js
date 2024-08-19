const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (req, res) => {
    const targetUrl = req.query.url; // Extract the target URL from the query parameter
    if (!targetUrl) {
        return res.status(400).json({ error: "Invalid URL" });
    }

    // Use http-proxy-middleware to forward the request
    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: {
            "^/api/proxy": "", // Adjust the path based on the actual API endpoint
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
    })(req, res);
};
