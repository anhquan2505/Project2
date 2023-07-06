import "./tableHotel.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link } from "react-router-dom";

const List = ({ rows = [], hotelId}) => {
  // tí thêm rows vào props
  // console.log(rows);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">ID phòng</TableCell>
            <TableCell className="tableCell">Tên phòng</TableCell>
            <TableCell className="tableCell">Các phòng</TableCell>
            <TableCell className="tableCell">Giá</TableCell>
            <TableCell className="tableCell">Sức chứa</TableCell>
            <TableCell className="tableCell">Trạng thái</TableCell>
            <TableCell className="tableCell"></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, indexRow) => (
            <TableRow key={row.id} className='tableRow' >
              <TableCell className="tableCell">{row._id}</TableCell>
              <TableCell className="tableCell">{row.title}</TableCell>
              <TableCell className="tableCell">
                {row.roomNumbers.map((room, index) => {
                  return <span className="status">{room.number}{index == row.roomNumbers.length - 1 ? "" : ","}</span>
                })}
              </TableCell>

              <TableCell className="tableCell">{row.price}</TableCell>
              <TableCell className="tableCell">{row.maxPeople}</TableCell>
              {row.isUsed ?
                <TableCell className="tableCell">
                  <span className={`status isWork`}>Trong hoạt động</span>
                </TableCell>
                :
                <TableCell className="tableCell">
                  <span className={`status isMaintain`}>Bảo trì</span>
                </TableCell>
              }
              <TableCell className="tableCell">
                <Link to={`/rooms/${row._id}`} style={{ textDecoration: "none" }}>
                  <div className="viewButton">Xem</div>
                </Link>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
