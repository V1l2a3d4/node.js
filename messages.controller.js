const { sortAsc, sortDesc, arrayLimit, arraySkip } = require("./helpers");
const path = require("path");
const fs = require("fs");
const { promisifyAll } = require("bluebird");
promisifyAll(fs);
const MessagesModel = require("./message.model");

exports.renderIndex = (req, res) => {
  res.render("index.nunjucks", {
    arr: req.app.locals.messages,
    urlInfo: "/info"
  });
};

exports.getMessages = async (req, res, next) => {
  try {
    const docs = await MessagesModel.find({}).exec();
    res.json(docs);
  } catch (e) {
    next(e);
  }
};

exports.getInfoPage = (req, res) => {
  res.render("info.nunjucks", res.locals.log);
};

exports.getFile = async (req, res, next) => {
  // req.app.locals.messages
  try {
    const fileName = req.url.slice(1);
    console.log("Filename", fileName);
    let filePath = path.join(__dirname, fileName);
    const isFileExists = fs.existsSync(filePath);
    if (!isFileExists) {
      const fileList = await fs.readdirAsync(__dirname);
      filePath = fileList.find(el => path.extname(el) === `.${fileName}`);
      if (!filePath) {
        res.statusCode = 404;
        return res.send("404");
      }
    }
    res.sendFile(path.join(__dirname, filePath));
  } catch (e) {
    next(e);
  }
};

exports.addNewMessage = async (req, res, next) => {
  try {
    const result = await MessagesModel.create(req.body);
    res.json(result);
  } catch (e) {
    next(e);
  }
};

exports.getMessageById = (req, res) => {
  // db.find({_id: req.param.id})
};
