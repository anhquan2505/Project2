import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect} from "react";
import { roomInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined);
  const [rooms, setRooms] = useState([]);

  const { data, loading, error } = useFetch("/hotels");

  useEffect(()=>{
    if(data.length!=0){
      setHotelId(data[0]._id)
    }
  },[data])
  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };


  const handleClick = async (e) => {
    e.preventDefault();
    const roomNumbers = rooms.split(",").map((room) => ({ number: room }));
    try {
      const res = await axios.post(`/rooms/${hotelId}`, { ...info, roomNumbers });
      if(res.data._id){
        alert("Phòng được thêm mới")
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Thêm phòng mới</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                  />
                </div>
              ))}
              <div className="formInput">
                <label>Các phòng</label>
                <textarea
                  onChange={(e) => setRooms(e.target.value)}
                  placeholder="Ghi số phòng cách nhau bởi dấu phẩy"
                />
              </div>
              <div className="formInput">
                <label>Chọn khách sạn</label>
                <select
                  
                  id="hotelId"
                  onChange={(e) => {setHotelId(e.target.value)}}
                >
                  {loading
                    ? "loading"
                    : data &&
                      data.map((hotel, index) => (
                        <option 
                          key={hotel._id} 
                          value={hotel._id}>{hotel.name}</option>
                      ))}
                </select>
              </div>
              <button onClick={handleClick}>Gửi</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
