const memeModel = require("../model/memeSchema");
const userModel = require("../model/schema");
const cloud = require("../middleWare/cloudinary");
const File = require("./typeFinder");

// import fileType from 'file-type'

const CreateMemes = async (resq, resp) => {
  const { title, file } = resq.body;
  // console.log(resq.body);

  if (!title || !file) {
    return resp.status(400).json({
      sucess: false,
      message: "Provide full details",
    });
  } else {
    let type = "unknown";

    if (file.startsWith("data:video/")) {
      type = "video";
    }
    if (file.startsWith("data:image/")) {
      type = "image";
    }

    // console.log('File type:', type);

    const id = resq.id;
    const check = await userModel.findById(id);
    if (!check) {
      return resp.status(400).json({
        sucess: false,
        message: "Id is not valid",
      });
    } else {
      if (type === "video") {
        const upload = await cloud.uploader.upload(file, {
          resource_type: "video",
          folder: "MemesVideo",
        });
        //   console.log(upload)
        if (upload) {
          try {
            const create = await memeModel.create({
              userid: id,
              user: check.username,
              pic: check.photo.url,
              title: title,
              file: {
                public_id: upload.public_id,
                url: upload.secure_url,
              },
            });
            if (create) {
              return resp.status(200).json({
                sucess: true,
                message: "post successfully!!",
              });
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      }
      if (type === "image") {
        const upload = await cloud.uploader.upload(file, {
          folder: "MemeImage",
        });
        //   console.log(upload)
        if (upload) {
          try {
            const create = await memeModel.create({
              userid: id,
              user: check.username,
              pic: check.photo.url,
              title: title,
              file: {
                public_id: upload.public_id,
                url: upload.secure_url,
              },
            });
            if (create) {
              return resp.status(200).json({
                sucess: true,
                message: "post successfully!!",
              });
            }
          } catch (error) {
            console.log(error.message);
          }
        }
      } else {
        return resp.status(404).json({ Error: true });
      }
    }
  }
};

const GetMemes = async (resq, resp) => {
  try {
    const data = await memeModel.find({}).sort({ createdAt: -1 });
    // console.log(data)
    if (!data) {
      return resp.status(400).json({
        sucess: false,
        message: "Database is empty",
      });
    } else {
      return resp.status(200).json({
        sucess: true,
        data: data,
      });
    }
  } catch (error) {
    return resp.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
};

const PostData = async (resq, resp) => {
  const { id } = resq.params;
  const search = await memeModel.findById(id);

  if (!search) {
    return resp.status(400);
  } else {
    return resp.status(200).json({
      sucess: true,
      data: search,
    });
  }
};

const TrendMemes = async (resq, resp) => {
  try {
    const data = await memeModel.aggregate([{ $sample: { size: 10 } }]);
    // console.log(data)
    if (!data) {
      return resp.status(400).json({
        sucess: false,
        message: "Database is empty",
      });
    } else {
      return resp.status(200).json({
        sucess: true,
        data: data,
      });
    }
  } catch (error) {
    return resp.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
};

const PopularMemes = async (resq, resp) => {
  try {
    const data = await memeModel.aggregate([{ $sample: { size: 5 } }]);
    // console.log(data)
    if (!data) {
      return resp.status(400).json({
        sucess: false,
        message: "Database is empty",
      });
    } else {
      return resp.status(200).json({
        sucess: true,
        data: data,
      });
    }
  } catch (error) {
    return resp.status(400).json({
      sucess: false,
      message: error.message,
    });
  }
};

const Like = () => {};

const DisLike = () => {};

module.exports = {
  CreateMemes,
  GetMemes,
  PostData,
  TrendMemes,
  PopularMemes,
  Like,
  DisLike,
};
