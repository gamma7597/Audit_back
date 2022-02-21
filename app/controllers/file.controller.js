const uploadFile = require("../middleware/upload");
const fs = require('fs');
const baseUrl = "https://10.56.255.2:8081/api/partners/";

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    res.status(200).send({
      message: "Uploaded the file successfully: " + req.file.originalname,
    });
  } catch (err) {
    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const getListFiles = (req, res) => {
  const company = req.params.company;
  const directoryPath = __basedir + "/resources/static/assets/uploads/" + company;

  fs.readdir(directoryPath, function (err, files) {
    console.log(directoryPath)
    if (err) {
      res.status(500).send({
        message: "Unable to scan files!",
      });
    }

    let fileInfos = [];

    console.log(files)

    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + company + "/files/" + file,
      });
    });

    res.status(200).send(fileInfos);
  });
};

const deleteFile = (req, res) => {
  const filename = req.params.fileName;
  const company = req.params.company;
  const filePath = __basedir + "/resources/static/assets/uploads/" + company + "/" + filename;

  fs.unlink(filePath, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not find the file. " + err
      })
    }
  });
}

const download = (req, res) => {
  const fileName = req.params.name;
  const company = req.params.company;
  const directoryPath = __basedir + "/resources/static/assets/uploads/" + company + "/";

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  upload,
  getListFiles,
  download,
  deleteFile
};
