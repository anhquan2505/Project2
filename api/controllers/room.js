import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";
import mongoose from "mongoose";
import { faker } from '@faker-js/faker';

export const modifyAttachRoomtoHotel = async (req, res, next) => {
  try {
    const roomsFound= await Room.find();
    let hotelSet = {}
    roomsFound.forEach(room =>{
      if(hotelSet[room.hotelId.toString()]){
        hotelSet[room.hotelId.toString()].push(room._id.toString())
      }else{
        hotelSet[room.hotelId.toString()] = [room._id.toString()]
      }
    })
    const updateHotels = async () => {
      try {
        for (const hotelId in hotelSet) {
          const roomIds = hotelSet[hotelId];
          await Hotel.updateOne({ _id: hotelId }, { rooms: roomIds });
          console.log(`Hotel with ID ${hotelId} updated successfully`);
        }
      } catch (error) {
        console.error('Error updating hotels:', error);
      }
    };
    let response = await updateHotels();
    if(response){
      res.status(200).json(true)
    }else{
      res.status(200).json(false)
    }
  } catch (err) {
    next(err);
  }

}

export const createFakeModel = async (req, res, next) => {
  const hotelsFound = await Hotel.find({})
  let hotelsID = hotelsFound.map(hotel=> hotel._id);
  // mỗi hotel 10 phòng
  let perHotel = 5
  let amount = hotelsID.length * perHotel;
  let roomList = [];
  for (let index = 0; index < amount; index++) { 
    let hotelIdForRoom = hotelsID[Math.floor(index/10)];
    let roomNumbers = [];
    for (let roomNumIndex = 0; roomNumIndex < 3; roomNumIndex++) {
      let roomNumberObj = {
        number: faker.phone.number("####"),
        unavailableDates: []
      }
      // let min = Math.ceil(1);
      // let max = Math.floor(6);
      // let randAmountOrder =  Math.floor(Math.random() * (max - min) + min)
     // nạp các order vào từng room Number
      // for (let orderIndex = 0; orderIndex < randAmountOrder ; orderIndex++) {
      //   let minStatus = Math.ceil(1);
      //   let maxStatus = Math.floor(3);
      //   let randStatus =  Math.floor(Math.random() * (maxStatus - minStatus) + minStatus)
        
      //   let order = {
      //     isCheckIn: false,
      //     isCheckOut: false,
      //     date: [],
      //   };
      //   // random status của đơn
      //   if(randStatus == 2){
      //     order.isCheckIn = true;
      //   }
      //   if(randStatus == 3){
      //     order.isCheckIn = true;
      //     order.isCheckOut = true;
      //   }
      //   // random các ngày đặt

        

      //   roomNumberObj.unavailableDates.push(order)
      // }
      // // nạp roomNumber 
      roomNumbers.push(roomNumberObj)
    }
    let room = {
      isUsed: true,
      hotelId: hotelIdForRoom,
      title: faker.person.fullName({ firstName: 'Phòng '}),
      price: faker.phone.number("###"),
      maxPeople: faker.phone.number("#"),
      desc: "Mô tả: " +  faker.commerce.productDescription(),
      roomNumbers: roomNumbers
    }
    roomList.push(room)
    
  }
  // sau đó thì insert many vào trong 
  try {
    const insertManyRoom = await Room.insertMany(roomList);
    let hotelSet = {}
    insertManyRoom.forEach(room =>{
      if(hotelSet[room.hotelId.toString()]){
        hotelSet[room.hotelId.toString()].push(room._id.toString())
      }else{
        hotelSet[room.hotelId.toString()] = [room._id.toString()]
      }
    })
    for (const hotelId in hotelSet) {
      if (Object.hasOwnProperty.call(hotelSet, hotelId)) {
        const arrayRoomId = hotelSet[hotelId];
        let hotelPushRoom =  Hotel.findByIdAndUpdate(hotelId, 
          {
            $push: {
              rooms: arrayRoomId,
            },
        })
      }
    }
    // const savedRoom = await newRoom.save();
    if(insertManyRoom){
      res.status(200).json(true);
    }else{
      res.status(400).json(false);

    }
  } catch (err) {
    next(err);
  }
};

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  let room = req.body;
  room.hotelId = hotelId;
  console.log(room)
  const newRoom = new Room(room);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomCheckIn = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers.unavailableDates._id": req.params.id },
      {
        $set: {
          "roomNumbers.$.unavailableDates.$[j].isCheckIn": true,
          "roomNumbers.$.unavailableDates.$[j].isCheckOut": false,
        },
      },
      {
        arrayFilters: [{
          "j._id": mongoose.Types.ObjectId(req.params.id)
        }]
      }
    );
    res.status(200).json("User check in");
  } catch (err) {
    next(err);
  }
};


export const updateRoomCheckOut = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers.unavailableDates._id": req.params.id },
      {
        $set: {
          "roomNumbers.$.unavailableDates.$[j].isCheckIn": true,
          "roomNumbers.$.unavailableDates.$[j].isCheckOut": true,
        },
      },
      {
        arrayFilters: [{
          "j._id": mongoose.Types.ObjectId(req.params.id)
        }]
      }
    );
    res.status(200).json("User check out.");
  } catch (err) {
    next(err);
  }
};


export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,

        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};


export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('roomNumbers.unavailableDates.userId', { "roomNumbers.unavailableDates.userId.password": 0 })
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const getRoomsByUserId = async (req, res, next) => {
  try {
    let rooms = await Room.aggregate([
      {
        $project: {
          "isUsed": 1,
          "hotelId": 1,
          "title": 1,
          "price": 1,
          "maxPeople": 1,
          "roomNumbers": {
            "$map": {
              "input": "$roomNumbers",
              "as": "array",
              "in": {
                "number": "$$array.number",
                "unavailableDates": {
                  "$filter": {
                    "input": "$$array.unavailableDates",
                    "as": "nestedArray",
                    "cond": {
                      "$eq": [
                        "$$nestedArray.userId",
                        mongoose.Types.ObjectId(req.params.id)
                      ],
                      
                    }
                  }
                }
              }
            }
          }
        }
      },
    
    ]).graphLookup({
      from:"hotels",
      startWith: "$hotelId",
      connectFromField: "hotelId",
      connectToField:"_id",
      as:"hotelInfo",
      maxDepth:1,
      
    })
    const roomsData = rooms.filter(room=> {
      let roomNumberFilter = room.roomNumbers.filter(roomNumber => roomNumber.unavailableDates.length != 0);
      room.roomNumbers = roomNumberFilter
      return room.roomNumbers.length!=0
    })
    res.status(200).json(roomsData);
  } catch (error) {
    next(error);
  }
}


// Room.aggregate([
//   {
//     $project: {
//       "roomNumbers": {
//         "$map": {
//           "input": "$roomNumbers",
//           "as": "array",
//           "in": {
          
//             "unavailableDates": {
//               "$filter": {
//                 "input": "$$array.unavailableDates",
//                 "as": "nestedArray",
//                 "cond": {
//                   "$eq": [
//                     "$$nestedArray.userId",
//                     "62e8ed1228b3344a661fa04f"
//                   ]
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// ])