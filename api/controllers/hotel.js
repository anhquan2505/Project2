import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import moment from "moment"


export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
export const updateHotel = async (req, res, next) => {
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
};
export const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    try {
      let count = await Room.deleteMany({ hotelId: req.params.id });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Hotel has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, ...others } = req.query;

  try {
    const hotels = await Hotel.find({
      ...others,
      cheapestPrice: { $gt: min | 1, $lt: max || 10000000 },
    }).limit(req.query.limit);
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};



export const searchHotels = async (req, res, next) => {
  const { min, max, city, startDate, endDate, options } = req.query;
  let queryObj = {}
  if (city) {
    queryObj.city = city;
  }
  let { room, adult, children } = JSON.parse(options);
  if(!adult){
    adult = 0;
  }
  if(!children){
    children = 0;
  }
  let peopleSize = parseInt(adult) + parseInt(children);
  try {
    const hotels = await Hotel.find({
      ...queryObj,
      cheapestPrice: { $gt: min | 1, $lt: max || 10000000 },
    })
    
    let hotelId = hotels.map(hotel => hotel._id);
    // console.log(parseInt(peopleSize));
    const rooms = await Room.find({ hotelId: { $in: hotelId }, maxPeople: { $gte : peopleSize} })
   

    let newRooms = rooms.filter((room, index) => {

      let count = 0;
      room.roomNumbers.forEach((roomNumber, index) => {
        // kiểm tra lịch sử xem dính không, nếu có thì vứt
        let check = false;
        roomNumber.unavailableDates.forEach((order, index) => {
          // kiểm tra date trùng từng room number, nếu không có hết thì mới bỏ cái room này đi
          
          const startMoment = moment(new Date(startDate), 'YYYY-MM-DD');
          const endMoment = moment(new Date(endDate), 'YYYY-MM-DD');
          const firstDate = moment(new Date(order.date[0]), 'YYYY-MM-DD');
          const lastDate = moment(new Date(order.date[order.date.length - 1]), 'YYYY-MM-DD');
          if (firstDate.isBetween(startMoment, endMoment, null, '[]')
            || lastDate.isBetween(startMoment, endMoment, null, '[]')
          ) {
            check = true;
            
          }
          // console.log(check)
        })
        
        if (check) {
          count++;
        }
        // console.log(count)
      })
      
      return room.roomNumbers.length != count;
    })
    const hotelsId = new Set();
    for (let i = 0; i < newRooms.length; i++) {
      const id = newRooms[i].hotelId.toString();
      if (!hotelsId.has(id)) {
        hotelsId.add(id);
      }
    }
    
    let newHotels = hotels.filter(hotel => {
      // console.log(hotel._id);
      return hotelsId.has(hotel._id.toString())
    })
    
   
    res.status(200).json(newHotels);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};
export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list)
  } catch (err) {
    next(err);
  }
};
