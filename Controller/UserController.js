const userModel = require("../model/schema");
const haspass = require("../middleWare/hash");
const jwt = require("jsonwebtoken");
const cloud = require("../middleWare/cloudinary");
const memeModel = require("../model/memeSchema");
const crypto = require("crypto");
const userToken = require("../model/tokenModel");
const Sendemail = require("./Email");
const tokenModel = require("../model/tokenModel");
const genToken = (id) => {
  return jwt.sign({ id }, "GAURAB", { expiresIn: "5d" });
};

const UserRegister = async (resq, resp) => {
  const { username, email, password, cpassword } = resq.body;
  if (!username || !email || !password || !cpassword) {
    return resp.status(400).json({
      sucess: false,
      message: "Please provide all the details",
    });
  }
  if (password != cpassword) {
    return resp.status(400).json({
      sucess: false,
      message: "password and confirm password must be same",
    });
  }
  if (password.length < 6) {
    return resp.status(400).json({
      sucess: false,
      message: "password must up to 6 length",
    });
  }
  if (password.length > 24) {
    return resp.status(400).json({
      sucess: false,
      message: "password must not be over 24 length",
    });
  }
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    return resp.status(400).json({
      sucess: false,
      message: "Email already exist",
    });
  } else {
    try {
      const newpass = await haspass.hash(password);
      // console.log(newpass)
      const regs = await userModel.create({
        username,
        email,
        password: newpass,
      });
      if (regs) {
        return resp.status(201).json({
          sucess: true,
          message: "Account created sucessfully!!",
        });
      } else {
        return resp.status(500).json({
          sucess: false,
          message: "Something wrong!!",
        });
      }
    } catch (error) {
      // console.log(error)
      if (error.code == 11000) {
        return resp.status(400).json({
          sucess: false,
          message: "Username is already exist",
        });
      } else {
        console.log(error);
        return resp.status(400).json({
          sucess: false,
          message: "Please provide valid email",
        });
      }
    }
  }
};

const UserLogin = async (resq, resp) => {
  const { email, password } = resq.body;

  if (!email || !password) {
    return resp.status(400).json({
      sucess: false,
      message: "Please provide email and password",
    });
  }
  const finduser = await userModel.findOne({ email });
  if (!finduser) {
    return resp.status(400).json({
      sucess: false,
      message: "Email not found",
    });
  } else {
    // console.log(finduser.password)
    const compass = await haspass.compare(password, finduser.password);
    // console.log(compass)
    if (!compass) {
      return resp.status(400).json({
        sucess: false,
        message: "Wrong password!!",
      });
    } else {
      const userData = {
        _id: finduser._id,
        username: finduser.username,
        email: finduser.email,
        photo: finduser.photo,
      };
      const token = genToken(finduser._id);
      resp.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 5000 * 86400),
        sameSite: "none",
        secure: true,
      });
      // console.log(token)
      return resp.status(200).json({
        sucess: true,
        message: "Login sucessfully",
        data: userData,
        token: token,
      });
    }
  }
};

const UserProfile = async (resq, resp) => {
  const id = resq.id;
  // console.log(id)
  try {
    const find = await userModel.findById(id, "-password");
    if (find) {
      return resp.status(200).json({
        sucess: true,
        data: find,
      });
    }
  } catch (error) {
    return resp.status(200).json({
      sucess: false,
      message: "",
    });
  }
};

const UserLogout = async (resq, resp) => {
  resp.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return resp.status(200).json({
    sucess: true,
    message: "Logout sucessfully",
  });
};

const UserData = async (resq, resp) => {
  const id = resq.id;
  const search = await userModel.findById(id, "-password");
  if (!search) {
    return resp.status(400).json({
      sucess: false,
      message: "Id is not valid",
    });
  } else {
    return resp.status(200).json({
      sucess: true,
      data: search,
    });
  }
};

const UserUpdate = async (req, res) => {
  try {
    const { image } = req.body;
    const { email, username } = req.body.inputdata;
    const id = req.id;
    const search = await userModel.findById(id);

    if (image != undefined) {
      if (search.photo.public_id === "abc") {
        const upload = await cloud.uploader.upload(image, {
          folder: "UserProfile",
        });
        if (upload) {
          try {
            const update = await userModel.updateOne(
              { _id: id },
              {
                username: username,
                email: email,
                photo: {
                  url: upload.secure_url,
                  public_id: upload.public_id,
                },
              }
            );

            if (update) {
              const updateMeme = await memeModel.updateMany(
                { userid: id },
                { user: username, pic: upload.secure_url }
              );

              // console.log(updateMeme)
              if (updateMeme) {
                return res.status(201).json({
                  success: true,
                  message: "Updated successfully!!",
                });
              }
            }
          } catch (error) {
            console.log(error.message);
            return res.status(500).json({
              success: false,
              message: "Internal server error",
            });
          }
        }
      } else {
        const { public_id } = search.photo;

        const deleteimage = await cloud.uploader.destroy(public_id);
        if (deleteimage) {
          const createimg = await cloud.uploader.upload(image, {
            folder: "UserProfile",
          });
          if (createimg) {
            try {
              const update = await userModel.updateOne(
                { _id: id },
                {
                  username: username,
                  email: email,
                  photo: {
                    url: createimg.url,
                    public_id: createimg.public_id,
                  },
                }
              );
              if (update) {
                const updateMeme = await memeModel.updateMany(
                  { userid: id },
                  { user: username, pic: createimg.secure_url }
                );

                // console.log(updateMeme)
                if (updateMeme) {
                  return res.status(201).json({
                    success: true,
                    message: "Updated successfully!!",
                  });
                }
              }
            } catch (error) {
              console.log(error.message);
              return res.status(500).json({
                success: false,
                message: "Internal server error",
              });
            }
          }
        }
      }
    } else {
      const update = await search.updateOne({
        username: username,
        email: email,
      });
      if (update) {
        const memeupdate = await memeModel.updateMany(
          { userid: id },
          { user: username }
        );
        if (memeupdate) {
          return res.status(201).json({
            success: true,
            message: "Updated successfully!!",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Something went wrong!!",
          });
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const UserPassUpdate = async (resq, resp) => {
  const id = resq.id;
  // console.log(resq.body)
  const { opassword, npassword, cpassword } = resq.body;
  if (npassword != cpassword) {
    return resp.status(200).json({
      sucess: false,
      message: "Password and confirm password must be same",
    });
  }
  if (npassword.length < 6) {
    return resp.status(200).json({
      sucess: false,
      message: "Password must be 6 length!!",
    });
  }
  try {
    const user = await userModel.findOne({ _id: id });
    if (user) {
      const comp = await haspass.compare(opassword, user.password);
      if (!comp) {
        return resp.status(200).json({
          sucess: false,
          message: "Old password is wrong!!",
        });
      } else {
        const newpass = await haspass.hash(cpassword);
        if (newpass) {
          const update = await user.updateOne({ password: newpass });
          if (update) {
            return resp.status(201).json({
              sucess: true,
              message: "Password updated sucessfully!!",
            });
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const ForgetPassword = async (resq, resp) => {
  const { email } = resq.body;
  const check = await userModel.findOne({ email });
  if (!check) {
    return resp.status(400).json({
      sucess: false,
      message: "Email not found!!",
    });
  } else {
    const resettoken = crypto.randomBytes(20).toString("hex");

    const hashtoken = crypto
      .createHash("sha256")
      .update(resettoken)
      .digest("hex");
    if (hashtoken) {
      const update = await userToken.create({
        userid: check._id,
        token: hashtoken,
        expiredAt: Date.now() + 15 * (60 * 1000),
      });
      if (update) {
        const resetUrl = `http://localhost:5173/reset-password/${resettoken}`;
        // console.log(resetUrl)
        const message = `<h3> hi ${check.username}</h3>
        Click <a href=${resetUrl}>Reset</a> to reset your password 
        <br>
        <br>
        If the button didn't work click on this link ${resetUrl}
        <br>
        <br>
        <br>
        Kind regards`;

        const subject = "Password reset token";
        const sendMail = await Sendemail(email, subject, message);
        if (sendMail) {
          // console.log(sendMail)
          // console.log('Mail sended')
          return resp.status(200).json({
            sucess: true,
            message:
              "Reset token been send to your email!! check your inbox :)",
          });
        } else {
          return resp.status(200).json({
            sucess: false,
            message: "Something wrong!! please try again :)",
          });
        }
      }
    }
  }
};

const ResetPassword = async (resq, resp) => {
  const { token } = resq.params;
  const { password, cpassword } = resq.body;
  // console.log(password);
  if (password !== cpassword) {
    return resp.status(400).json({
      sucess: false,
      message: "password and confirm password must be same",
    });
  }
  if (!password || !cpassword) {
    return resp.status(400).json({
      sucess: false,
      message: "Password mustn't be empty",
    });
  }
  if (password.length < 6) {
    return resp.status(400).json({
      sucess: false,
      message: "Password must be at least 6 characters long",
    });
  } else {
    try {
      const hashtoken = crypto.createHash("sha256").update(token).digest("hex");
      const find = await tokenModel.findOne({
        token: hashtoken,
        expiredAt: {
          $gt: Date.now(),
        },
      });
      if (find) {
        const newpass = await haspass.hash(password);
        // console.log(newpass)
        const update = await userModel.findByIdAndUpdate(
          { _id: find.userid },
          { password: newpass }
        );
        if (update) {
          const dels = await tokenModel.deleteOne({ token: hashtoken });
          if (dels) {
            // console.log(dels)
            return resp.status(200).json({
              sucess: true,
              message: "Password updated successfully :)",
            });
          }
        }
      } else {
        return resp.status(400).json({
          sucess: false,
          message: "Token is invalid or expired!!",
        });
      }
    } catch (error) {
      return resp.status(400).json({
        sucess: false,
        message: error.message,
      });
    }
  }
};

module.exports = {
  UserRegister,
  UserLogin,
  UserProfile,
  UserLogout,
  UserData,
  UserUpdate,
  UserPassUpdate,
  ForgetPassword,
  ResetPassword,
};
