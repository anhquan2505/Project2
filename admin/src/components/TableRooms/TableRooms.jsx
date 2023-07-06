import "./tableRooms.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment"
const List = ({ rows = [], index, handleCheckOut, handleCheckIn }) => {
  // tí thêm rows vào props
  // console.log(rows);
  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell"></TableCell>
            <TableCell className="tableCell">Tên khách</TableCell>
            <TableCell className="tableCell">Số điện thoại</TableCell>

            <TableCell className="tableCell">Từ ngày</TableCell>
            <TableCell className="tableCell">Đến ngày</TableCell>
            <TableCell className="tableCell">Trạng thái</TableCell>
            <TableCell className="tableCell">Chuyển tiếp trạng thái</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, indexRow) => (
            <TableRow key={row.id}>
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img src={row.userId.img} alt="" className="image" />
                </div>
              </TableCell>
              <TableCell className="tableCell">{row.userId.username}</TableCell>
              <TableCell className="tableCell">{row.userId.phone}</TableCell>

              <TableCell className="tableCell">{moment(row.date[0]).format("DD/MM/YYYY")}</TableCell>
              <TableCell className="tableCell">{moment(row.date[row.date.length - 1]).format("DD/MM/YYYY")}</TableCell>
              {row.isCheckIn ? row.isCheckOut ?
                <TableCell className="tableCell">
                  <span className={`status isCheckOut`}>Đã trả phòng </span>
                </TableCell>
                :
                <TableCell className="tableCell">
                  <span className={`status isCheckIn`}>Đã nhận phòng</span>
                </TableCell> :
                <TableCell className="tableCell">
                  <span className={`status isNotCheckIn`}>Chưa nhận phòng</span>
                </TableCell>

              }
              <TableCell className="tableCell">
                {row.isCheckOut ? null :
                  row.isCheckIn ?
                    <button onClick={() => handleCheckOut(index, indexRow, row._id)} className={`statusButton `}>Trả phòng</button>
                    :
                    <button onClick={() => handleCheckIn(index, indexRow, row._id)} className={`statusButton `}>Nhận phòng</button>
                }
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default List;
