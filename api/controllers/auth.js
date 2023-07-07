import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { faker } from '@faker-js/faker';


export const createFakeModel =  async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync("1", salt);
    let arrayUser = [];
    let arrayCity = ['Hà Nội',"Đà Nẵng", "TP HCM"];
    let amount = 100
    for (let index = 0; index < amount; index++) {
      let user = {
        username: faker.internet.userName(),
        email: faker.internet.email(),
        country: "Việt Nam",
        city: arrayCity[index%(arrayCity.length)],
        phone: faker.phone.number('0#########'),
        isAdmin: false,
        password: hash,
      }
      arrayUser.push(user)
    }
    const insertMany = await User.insertMany(arrayUser) 
    res.status(200).json(insertMany);
  } catch (err) {
    next(err);
  }
};
export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(req.body)
    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin });
  } catch (err) {
    next(err);
  }
};
