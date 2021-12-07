const { Router } = require("express");
const router = Router();
const messagesCtrl = require("./messages.controller");
const { browserName, browserVersion, userDevice } = require("./helpers");
const { writeLog } = require("./writeLog.js");

router.use((req, res, next) => {
  res.locals.log = {
    bName: browserName(req.headers["user-agent"]),
    bVersion: browserVersion(req.headers["user-agent"]),
    uDevice: userDevice(req.headers["user-agent"]),
    startTime: new Date(),
    headers: req.headers,
    method: req.method,
    url: req.url
  };

  res.once("finish", () => {
    res.locals.log.statusCode = res.statusCode;
    res.locals.log.endTime = new Date();
    writeLog(res.locals.log);
    req.app.locals.logs.push(res.locals.log);
  });

  res.once("close", () => {
    res.locals.log.statusCode = 500;
    writeLog(res.locals.log);
    req.app.locals.logs(push(req.local.log));
  });

  next();
});

router.get("/", messagesCtrl.renderIndex);
router.get("/messages", messagesCtrl.getMessages);
router.get("/messages/:id", messagesCtrl.getMessageById);
router.get("/info", messagesCtrl.getInfoPage);
router.get(["/*?jpg", "/*?png", "/*?mp4", "/*?ico"], messagesCtrl.getFile);
router.post("/messages", messagesCtrl.addNewMessage);

// Глобальный обработчик ошибок
router.use((err, req, res, next) => {
  console.error("Some err", err);
  res.status(500).json({ message: err.message });
});

module.exports = router;
