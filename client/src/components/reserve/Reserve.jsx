import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import moment from "moment"
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from '../../axios'
import { useNavigate } from "react-router-dom";

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data, loading, error } = useFetch(`/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);
  // console.log(data);
  const getDatesInRange = (startDate, endDate) => {

    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    let startMoment = moment(new Date(alldates[0]), 'YYYY-MM-DD');
    let endMoment = moment(new Date(alldates[alldates.length - 1]), 'YYYY-MM-DD');
    console.log(startMoment);
    let isAvailable = true;
    roomNumber.unavailableDates.forEach((order) => {
      let firstDate = moment(new Date(order.date[0]), 'YYYY-MM-DD');
      let lastDate = moment(new Date(order.date[order.date.length - 1]), 'YYYY-MM-DD');
      if (firstDate.isBetween(startMoment, endMoment, null, '[]')
        || lastDate.isBetween(startMoment, endMoment, null, '[]')
      ) {
        isAvailable = false;
      }
    })
    console.log(roomNumber + isAvailable)

    return isAvailable;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    let userId = JSON.parse(localStorage.getItem('user'))._id;
    // console.log(array)
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`/rooms/availability/${roomId}`, {
            dates: {
              date: alldates,
              userId,
            }
          });
          return res.data;
        })
      );
      setOpen(false);
      navigate("/");
    } catch (err) { }
  }

  return (
    <div className="reserve" >
      <div className="rContainer" style={{maxWidth: "80vw", maxHeight: "80vh", overflow: "scroll"}}>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <span>Select your rooms:</span>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rTitle">{item.title}</div>
              <div className="rDesc">{item.desc}</div>
              <div className="rMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rPrice">{item.price}</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room">
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick} className="rButton">
          Reserve Now!
        </button>
      </div>
    </div>
  );
};

export default Reserve;
