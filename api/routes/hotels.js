import express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  searchHotels,
  updateHotel,
  createFakeModel
} from "../controllers/hotel.js";

import {verifyAdmin} from "../utils/verifyToken.js"
const router = express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);
//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);
//GET

router.get("/:id", getHotel);
//GET ALL

router.get("/", getHotels);
router.get("/search/search", searchHotels)
router.get("/getCount/countByCity", countByCity);
router.get("/getCount/countByType", countByType);
router.get("/room/:id", getHotelRooms);

router.get('/fake/create-fake-model', createFakeModel)

export default router;
