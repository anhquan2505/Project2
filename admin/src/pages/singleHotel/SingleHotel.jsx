import { useLocation } from "react-router-dom";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/TableHotel/TableHotel.jsx";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"

let thisMonth = moment(Date.now()).format("M")
let oneMonthAgo = moment(Date.now()).subtract(1, 'months').format("M");
let twoMonthAgo = moment(Date.now()).subtract(2, 'months').format("M");
let threeMonthAgo = moment(Date.now()).subtract(3, 'months').format("M");
let fourMonthAgo = moment(Date.now()).subtract(4, 'months').format("M");
let fiveMonthAgo = moment(Date.now()).subtract(5, 'months').format("M");
const Single = () => {
  
  const location = useLocation();
  const path = location.pathname
  const { data, loading, error } = useFetch(`${path}`);
  const [isModifyHotel, setIsModifyHotel] = useState(false);
  const [chartData, setChartData] = useState([]);

  const [hotelnfo, setHotelnfo] = useState({
    address: "",
    cheapestPrice: 0,
    city: "",
    desc: "",
    distance: "0",
    featured: true,
    name: "",
    photos: ['https://scr.vn/wp-content/uploads/2020/08/M%E1%BA%ABu-nh%C3%A0-vu%C3%B4ng.jpg'],
    rating: 4,
    rooms: [],
    title: "",
    type: "",
    _id: ""
  })

  const [rooms, setRooms] = useState([])

  useEffect(() => {
    if (data._id) {
      setHotelnfo(data)
      getRoomsById(data._id)
    }
  }, [data])

  const getRoomsById = async (id) => {
    const res = await axios.get(`/hotels/room/${id}`)
    if (res.data.length != 0) {
      setRooms(res.data);
    }
  }

  useEffect(() => {
    // console.log(hotelnfo);
  }, [hotelnfo])

  useEffect(() => {
    // axios.get('/rooms').then(res => {
    //   return res.data
    // }).then(rooms => {
      // console.log(rooms)
      let roomsFilter = rooms.filter(room => moment(room.updatedAt).format("M") == thisMonth
        || moment(room.updatedAt).format("M") == oneMonthAgo
        || moment(room.updatedAt).format("M") == twoMonthAgo
        || moment(room.updatedAt).format("M") == threeMonthAgo
        || moment(room.updatedAt).format("M") == fourMonthAgo
        || moment(room.updatedAt).format("M") == fiveMonthAgo
      )

      // ----------------------------
      let array = []
      for (let index = 5; index >= 0; index--) {
        let userEachMonth = 0
        roomsFilter.forEach(room => {
          room.roomNumbers.forEach((roomNumber) => {
            let orders = roomNumber.unavailableDates.filter(order =>
              moment(order.date[0]).format("M") == thisMonth - index
            )
            userEachMonth += orders.length
          })
        })
        // console.log(moment().month(thisMonth - index).format("MMM"))
        
        array.push({
          name: moment().month(thisMonth - index - 1).format("MMM"),
          Total: userEachMonth
        })

      }
      setChartData(array)
      // -----------------
    }
  
  , [rooms])


  const handleUpdate = (e) => {
    try {
      axios.put(`/hotels/${hotelnfo._id}`, hotelnfo)
      setIsModifyHotel(false);
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={() => setIsModifyHotel(true)} disabled={isModifyHotel}>Chỉnh sửa</div>
            <h1 className="title">Thông tin</h1>
            <div className="item">
              <img
                src={hotelnfo.photos[0]}
                alt=""
                className="itemImg"
              />
              <div className="details">
                {isModifyHotel ?
                  <input className="itemTitle"
                    value={hotelnfo.title}
                    onChange={e => setHotelnfo({ ...hotelnfo, title: e.target.value })}

                  ></input>
                  :

                  <h1 className="itemTitle">{hotelnfo.title}</h1>
                }
                <div className="detailItem">
                  <span className="itemKey">Địa chỉ:</span>
                  {isModifyHotel ?
                    <input
                      className="itemValue"
                      value={hotelnfo.address}
                      onChange={e => setHotelnfo({ ...hotelnfo, address: e.target.value })}>
                    </input>
                    :
                    <span className="itemValue">{hotelnfo.address}</span>

                  }
                </div>

                <div className="detailItem">
                  <span className="itemKey">Thành phố:</span>
                  {isModifyHotel ?
                    <input
                      className="itemValue"
                      value={hotelnfo.city}
                      onChange={e => setHotelnfo({ ...hotelnfo, city: e.target.value })}>
                    </input>
                    :
                    <span className="itemValue">{hotelnfo.city}</span>

                  }
                </div>


                <div className="detailItem">
                  <span className="itemKey">Khoảng cách tới trung tâm:</span>
                  {isModifyHotel ?
                    <input
                      className="itemValue"
                      value={hotelnfo.distance}
                      onChange={e => setHotelnfo({ ...hotelnfo, distance: Number(e.target.value) })}>
                    </input>
                    :
                    <span className="itemValue">{hotelnfo.distance}</span>

                  }
                </div>

                {isModifyHotel ? null :
                  <div className="detailItem">
                    <span className="itemKey">Hạng:</span>
                    <span className="itemValue">{hotelnfo.rating}</span>
                  </div>
                }

                <div className="detailItem">
                  <span className="itemKey">Mô tả:</span>
                  {isModifyHotel ?
                    <input
                      className="itemValue"
                      value={hotelnfo.desc}
                      onChange={e => setHotelnfo({ ...hotelnfo, desc: e.target.value })}>
                    </input>
                    :
                    <span className="itemValue">{hotelnfo.desc}</span>

                  }
                </div>
                {isModifyHotel ? <div className="detailItem">
                  <button className="itemValue" onClick={handleUpdate}>Cập nhật</button>
                </div> : null}

              </div>
            </div>
          </div>
          <div className="right">
            <Chart data={chartData} aspect={3 / 1} title="Số lượng đặt (6 tháng gần nhất)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Các phòng của khách sạn</h1>
          <List rows={rooms} />
        </div>
      </div>
    </div>
  );
};

export default Single;
