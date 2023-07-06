import "./tableHotel.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";
import moment from "moment"

const List = ({ rows = [], hotelId }) => {
  // tí thêm rows vào props
  // console.log(rows);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Tên khách sạn</TableCell>
            <TableCell className="tableCell">Số phòng</TableCell>
            <TableCell className="tableCell">Từ ngày</TableCell>
            <TableCell className="tableCell">Đến ngày</TableCell>
            <TableCell className="tableCell">Giá</TableCell>
            <TableCell className="tableCell">Địa chỉ</TableCell>
            <TableCell className="tableCell">Thành phố</TableCell>
            <TableCell className="tableCell">Trạng thái</TableCell>
            <TableCell className="tableCell"></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, indexRow) => (
            <TableRow key={row.id} className='tableRow' >
              <TableCell className="tableCell"> 
                <Link to={`/hotels/${row.hotelId}`}>
                <div className="">{row.hotelName}</div>
                </Link>
              </TableCell>
              <TableCell className="tableCell">{row.roomNumber}</TableCell>
              <TableCell className="tableCell">{moment(row.from).format("DD/MM/YYYY")}</TableCell>
              <TableCell className="tableCell">{moment(row.to).format("DD/MM/YYYY")}</TableCell>
              <TableCell className="tableCell">{row.price}</TableCell>
              <TableCell className="tableCell">{row.address}</TableCell>
              <TableCell className="tableCell">{row.city}</TableCell>
              {row.isCheckIn ? row.isCheckOut ?
                <TableCell className="tableCell">
                  <span className={`status isCheckOut`}>Đã trả phòng</span>
                </TableCell>
                :
                <TableCell className="tableCell">
                  <span className={`status isCheckIn`}>Đã nhận phòng</span>
                </TableCell> :
                <TableCell className="tableCell">
                  <span className={`status isNotCheckIn`}>Chưa nhận phòng</span>
                </TableCell>

              }

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
