import { useLocation } from "react-router-dom";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/TableRooms/TableRooms";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import moment from "moment"

let thisMonth = moment(Date.now()).format("M")


const SingleRoom = () => {
  const location = useLocation();
  const path = location.pathname
  const { data, loading, error } = useFetch(`${path}`);
  const [isModifyRoom, setIsModifyRoom] = useState(false);
  const [chartData, setChartData] = useState([]);

  const [roomInfo, setRoomInfo] = useState({
    desc: "",
    maxPeople: 0,
    price: 0,
    roomNumbers: [],
    title: "",
    _id: "",
    isUsed: false,
  })
  useEffect(() => {
    console.log(data)
    if (data.length != 0) {
      let { desc, maxPeople, price, roomNumbers, title, _id, isUsed } = data
      setRoomInfo({ desc, maxPeople, price, roomNumbers, title, _id, isUsed })

      let array = []
      for (let index = 5; index >= 0; index--) {
        let userEachMonth = 0
        data.roomNumbers.forEach((roomNumber) => {
          let orders = roomNumber.unavailableDates.filter(order =>
            moment(order.date[0]).format("M") == thisMonth - index
          )
          userEachMonth += orders.length
        })

        // console.log(moment().month(thisMonth - index).format("MMM"))

        array.push({
          name: moment().month(thisMonth - index -1).format("MMM"),
          Total: userEachMonth
        })

      }
      setChartData(array)

    }


  }, [data])



  const handleUpdate = (e) => {
    try {
      axios.put(`/rooms/${roomInfo._id}`, roomInfo)
      setIsModifyRoom(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCheckOut = (index, indexRow, billId) => {
    try {
      const res = axios.put(`/rooms/checkOut/${billId}`)
      let rooms = roomInfo.roomNumbers
      rooms[index].unavailableDates[indexRow].isCheckOut = true;
      rooms[index].unavailableDates[indexRow].isCheckIn = true;
      setRoomInfo({ ...roomInfo, roomNumbers: rooms })
    } catch (error) {
      console.log(error);
    }

  }


  const handleCheckIn = (index, indexRow, billId) => {
    try {
      const res = axios.put(`/rooms/checkIn/${billId}`)
      let rooms = roomInfo.roomNumbers
      rooms[index].unavailableDates[indexRow].isCheckOut = false;
      rooms[index].unavailableDates[indexRow].isCheckIn = true;
      setRoomInfo({ ...roomInfo, roomNumbers: rooms })
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
            <button className="editButton" onClick={() => setIsModifyRoom(true)} disabled={isModifyRoom}>Chỉnh sửa</button>
            <h1 className="title">Thông tin phòng</h1>

            <div className="item">
              <div className="details">
                {isModifyRoom ?
                  <input className="itemTitle"
                    value={roomInfo.title}
                    onChange={e => setRoomInfo({ ...roomInfo, title: e.target.value })}

                  ></input>
                  :

                  <h1 className="itemTitle">{roomInfo.title}</h1>
                }
                <div className="detailItem">
                  <span className="itemKey">Trạng thái:</span>
                  {isModifyRoom ? <select
                    onChange={(e) => setRoomInfo({
                      ...roomInfo, isUsed: e.target.value
                    })
                    }>
                    <option value={true}>Trong hoạt động</option>
                    <option value={false}>Bảo trì</option>
                  </select> :
                    <span className="itemValue">{roomInfo.isUsed ? "Trong hoạt động" : "Bảo trì"}</span>
                  }

                </div>

                <div className="detailItem">
                  <span className="itemKey">Mô tả:</span>
                  {isModifyRoom ?
                    <input
                      className="itemValue"
                      value={roomInfo.desc}
                      onChange={e => setRoomInfo({ ...roomInfo, desc: e.target.value })}>
                    </input>
                    :
                    <span className="itemValue">{roomInfo.desc}</span>

                  }
                </div>

                <div className="detailItem">
                  <span className="itemKey">Giá:</span>
                  {isModifyRoom ?
                    <input
                      className="itemValue"
                      value={roomInfo.price}
                      onChange={e => setRoomInfo({ ...roomInfo, price: Number(e.target.value) })}>
                    </input>
                    :
                    <span className="itemValue">{roomInfo.price}</span>

                  }
                </div>

                <div className="detailItem">
                  <span className="itemKey">Số lượng người tối đa:</span>
                  {isModifyRoom ?
                    <input
                      className="itemValue"
                      value={roomInfo.maxPeople}
                      onChange={e => {
                        setRoomInfo({ ...roomInfo, maxPeople: Number(e.target.value) })
                      }
                      }
                    >
                    </input>
                    :
                    <span className="itemValue">{roomInfo.maxPeople}</span>

                  }
                </div>

                {isModifyRoom ? <div className="detailItem">
                  <button className="itemValue" onClick={handleUpdate}>Cập nhật</button>
                </div> : null}

              </div>
            </div>
          </div>
          <div className="right">
            <Chart data ={chartData} aspect={3 / 1} title="Số lượng đặt (6 tháng gần nhất)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Các giao dịch gần nhất</h1>
          {roomInfo.roomNumbers.length != 0 ?
            <Tabs>
              <TabList>
                {roomInfo.roomNumbers.map(room => {
                  return (
                    <Tab>{'Phòng ' + room.number}</Tab>
                  )
                })}
              </TabList>
              {roomInfo.roomNumbers.map((room, index) => {
                return (
                  <TabPanel>
                    <List handleCheckIn={(index, indexRow, billId) => handleCheckIn(index, indexRow, billId)}
                      handleCheckOut={(index, indexRow, billId) => handleCheckOut(index, indexRow, billId)}
                      index={index}
                      rows={room.unavailableDates}>

                    </List>
                  </TabPanel>
                )
              })}

            </Tabs>



            : null}


        </div>
      </div>
    </div>
  );
};

export default SingleRoom;
