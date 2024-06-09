export default
{
  "/api/**": {
    "target": "http://localhost:3000/",
    "secure": false,
    "logLevel": "debug",
    "pathRewrite": {
      "^/api": ""
    }, "bypass": function (req, res, proxyOptions) {
      console.log("bypass");
    }
  }
}
