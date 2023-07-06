import { useLocation } from "react-router-dom";
import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/Table/Table";
import useFetch from "../../hooks/useFetch";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment"
let thisMonth = moment(Date.now()).format("M")

const Single = () => {

  const location = useLocation();
  const path = location.pathname
  const { data, loading, error } = useFetch(`${path}`);
  const [userInfo, setUserInfo] = useState({
    city: "",
    country: "",
    email: "",
    img: "",
    phone: "",
    username: ""
  })
  const [orders, setOrders] = useState([])
  const [chartData, setChartData] = useState([])
  useEffect(() => {
    let { city, country, email, img, username,phone } = data
    setUserInfo({
      city, country, email, img, username,phone
    })
  }, [data])

  useEffect(() => {
    getOrderUser()
  }, [])
  const getOrderUser = async () => {
    let chart = []
    for (let index = 5; index >= 0; index--) {
      chart.push({
        name: moment().month(thisMonth - index - 1).format("MMM"),
        Total: 0,
      })
    }

    axios.get(`/rooms/${path}`).then(res => res.data)
      .then(rooms => {
        let array = []
        // console.log(chart);
        rooms.forEach(room => {
          room.roomNumbers.forEach(roomNumber => {
            roomNumber.unavailableDates.forEach(order => {
              let obj = {
                from: "",
                to: "",
                hotelName: "",
                city: "",
                address: "",
                roomNumber: 0,
                price: 0,
                isCheckIn: false,
                isCheckOut: false,
                hotelId:'',
                roomId:'',
      
              }
              // console.log()
              chart.forEach(month =>{
                if(month.name == moment(order.date[0]).format("MMM")){
                  month.Total++
                }
              })
              

              obj.price = room.price
              obj.from = order.date[0]
              obj.isCheckIn = order.isCheckIn
              obj.isCheckOut = order.isCheckOut
              obj.to = order.date[order.date.length - 1]
              obj.roomNumber = roomNumber.number
              obj.hotelName = room.hotelInfo[0].name
              obj.city = room.hotelInfo[0].city
              obj.address = room.hotelInfo[0].address
              obj.hotelId = room.hotelInfo[0]._id
              obj.roomId = room._id
              array.push(obj)
            })
          })
        })
        
        array.sort(function(a, b){return moment(b.from).format('x') -moment(a.from).format('x')});
        setChartData(chart)
        setOrders(array)
      })
  }
  // useEffect(()=>{
  // console.log(userInfo)
  // },[orders])
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Edit</div> */}
            <h1 className="title">Thông tin</h1>
            <div className="item">
              <img
                src={userInfo.img}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{userInfo.username}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userInfo.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Số điện thoại:</span>
                  <span className="itemValue">{userInfo.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Địa chỉ:</span>
                  <span className="itemValue">
                    {userInfo.city}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Đất nước:</span>
                  <span className="itemValue">{userInfo.country}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <Chart data={chartData} aspect={3 / 1} title="Số lượng giao dịch (6 tháng)" />
          </div>
        </div>
        <div className="bottom">
          <h1 className="title">Giao dịch gần đây</h1>
          <List rows={orders} />
        </div>
      </div>
    </div>
  );
};

export default Single;
