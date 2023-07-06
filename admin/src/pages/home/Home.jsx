import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
// import Table from "../../components/table/Table";
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment"


const Home = () => {
  let thisMonth = moment(Date.now()).format("M") // => aug
  let oneMonthAgo = moment(Date.now()).subtract(1, 'months').format("M");
  let twoMonthAgo = moment(Date.now()).subtract(2, 'months').format("M");
  let threeMonthAgo = moment(Date.now()).subtract(3, 'months').format("M");
  let fourMonthAgo = moment(Date.now()).subtract(4, 'months').format("M");
  let fiveMonthAgo = moment(Date.now()).subtract(5, 'months').format("M");

  const [data, setData] = useState([])

  // const data = [
  //   { name: "January", Total: 1200 },
  //   { name: "February", Total: 2100 },
  //   { name: "March", Total: 800 },
  //   { name: "April", Total: 1600 },
  //   { name: "May", Total: 900 },
  //   { name: "June", Total: 1700 },
  // ];
  useEffect(() => {
    getEarningData()
    // console.log(moment().month(thisMonth- 1).format("MMM"))
  }, [])
  useEffect(() => {
    console.log(data)
  }, [data])

  const getEarningData = () => {
    axios.get('/rooms').then(res => {
      return res.data
    }).then(rooms => {
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
        let earningEachMonth = 0
        roomsFilter.forEach(room => {
          room.roomNumbers.forEach((roomNumber) => {
            let orders = roomNumber.unavailableDates.filter(order =>
              moment(order.date[0]).format("M") == thisMonth - index && order.isCheckOut
            )
            orders.forEach(order => {
              earningEachMonth += order.date.length * room.price
            })

          })
        })
        console.log(moment().month(thisMonth - index).format("MMM"))

        array.push({
          name: moment().month(thisMonth - index -1).format("MMM"),
          Total: earningEachMonth
        })
      }
      setData(array)
      // -----------------
    })
  }


  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />

        </div>
        <div className="charts">
          {/* <Featured /> */}
          <Chart data={data} title="Doanh thu 6 tháng" aspect={3 / 1} />
     
        </div>
        {/* <div className="listContainer"> */}
        {/* <div className="listTitle">Latest Transactions</div> */}
        {/* <Table /> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default Home;
