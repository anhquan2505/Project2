import "./widget.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import moment from "moment"
const Widget = ({ type }) => {
  let data;
  let thisMonth = moment(Date.now()).format("M")
  let lastMonth = moment(Date.now()).format("M") - 1;
  //temporary
  // let amount = 100;
  // const diff = 20;
  const [diff, setDiff] = useState(0)

  const [amount, setAmount] = useState(0)

  switch (type) {
    case "user":
      axios.get("users").then(res => {
        return res.data
      }).then(resData => {
        let userCreateThisMonth = resData.filter(elem => moment(elem.createdAt).format("M") == thisMonth).length
        let userCreateLastMonth = resData.filter(elem => moment(elem.createdAt).format("M") == lastMonth).length
      

        if (userCreateLastMonth > 0) {
          setDiff(userCreateThisMonth / (userCreateLastMonth) * 100)
        }
        console.log("ABC" + userCreateThisMonth);
        setAmount(userCreateThisMonth)
      });
      data = {
        url: '/users',
        title: "USERS",
        isMoney: false,
        link: "Xem tất cả người dùng",
        icon: (
          <PersonOutlinedIcon
            className="icon"
            style={{
              color: "crimson",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
            }}
          />
        ),
      };
      break;
    case "order":
      axios.get('/rooms').then(res => {
        return res.data
      }).then(rooms => {
        // console.log(rooms)
        let roomsFilter = rooms.filter(room => moment(room.updatedAt).format("M") == thisMonth
          || moment(room.updatedAt).format("M") == lastMonth)
        let orderThisMonth = []
        // console.log(roomsFilter)
        roomsFilter.forEach(room => {
          room.roomNumbers.forEach((roomNumber, index) => {
            let orders = roomNumber.unavailableDates.filter(order =>
              moment(order.createAt).format("M") == thisMonth
            )
            // console.log(index);
            // console.log(orders)
            orderThisMonth = orderThisMonth.concat(orders)
            // console.log(orderThisMonth)
          })
        })


        let orderLastMonth = []
        roomsFilter.forEach(room => {
          room.roomNumbers.forEach((roomNumber, index) => {
            let orders = roomNumber.unavailableDates.filter(order =>
              moment(order.createAt).format("M") == lastMonth
            )
            orderLastMonth = orderLastMonth.concat(orders)
          })
        })

        if (orderLastMonth.length > 0) {
          setDiff(orderThisMonth.length / (orderLastMonth.length) * 100)
        }
        setAmount(orderThisMonth.length)
      })
      data = {
        url: '/',
        title: "ORDERS",
        isMoney: false,
        link: "",
        icon: (
          <ShoppingCartOutlinedIcon
            className="icon"
            style={{
              backgroundColor: "rgba(218, 165, 32, 0.2)",
              color: "goldenrod",
            }}
          />
        ),
      };
      break;
    case "earning":

      axios.get('/rooms').then(res => {
        return res.data
      }).then(rooms => {
        // console.log(rooms)
        let roomsFilter = rooms.filter(room => moment(room.updatedAt).format("M") == thisMonth
          || moment(room.updatedAt).format("M") == lastMonth)

        // ----------------------------
        let earningThisMonth = 0
        roomsFilter.forEach(room => {
          room.roomNumbers.forEach((roomNumber, index) => {
            let orders = roomNumber.unavailableDates.filter(order =>
              moment(order.date[0]).format("M") == thisMonth && order.isCheckOut
            )
            orders.forEach(order => {
              earningThisMonth += order.date.length * room.price
            })

          })
        })
        // --------------------------
        let earningLastMonth = 0
        roomsFilter.forEach(room => {
          room.roomNumbers.forEach((roomNumber, index) => {
            let orders = roomNumber.unavailableDates.filter(order =>
              moment(order.date[0]).format("M") == lastMonth && order.isCheckOut
            )
            orders.forEach(order => {
              earningLastMonth += order.date.length * room.price
            })
          })
        })
        if (earningLastMonth > 0) {
          setDiff(earningThisMonth / (earningLastMonth) * 100)
        }
        setAmount(earningThisMonth)
        // -----------------
      })

      data = {
        url: '/',
        title: "EARNINGS",
        isMoney: true,
        link: "",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ backgroundColor: "rgba(0, 128, 0, 0.2)", color: "green" }}
          />
        ),
      };
      break;

    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && ""} {amount}
        </span>
        <Link to={data.url} style={{ textDecoration: "none" }}>
          <span className="link">{data.link}</span>
        </Link>
      </div>
      <div className="right">
        {diff >= 100 ?
          <div className="percentage positive">
            <KeyboardArrowUpIcon />
            {diff} %
          </div>
          :
          diff == 0 ?
            <div className="percentage ">
              {/* <KeyboardArrowUpIcon /> */}
             - 
            </div>
            :
            <div className="percentage negative">
              <KeyboardArrowDownIcon />
              {diff} %
            </div>

        }
        {data.icon}
      </div>
    </div >
  );
};

export default Widget;
