export const userColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "Người dùng",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img || "https://i.ibb.co/MBtjqXQ/no-avatar.gif"} alt="avatar" />
          {params.row.username}
        </div>
      );
    },
  },
  {
    field: "isAdmin",
    headerName: "Vai trò",
    width: 100,
    renderCell: (params) => {
      let status = ''
      if(params.row.isAdmin){
        status = 'Quản trị viên'
      }else{
        status = "Người dùng"
      }
      return <div>{status}</div>
    },
  },

  {
    field: "email",
    headerName: "Email",
    width: 230,
  },

  {
    field: "country",
    headerName: "Đất nước",
    width: 100,
  },
  {
    field: "city",
    headerName: "Thành phố",
    width: 100,
  },
  {
    field: "phone",
    headerName: "Số điện thoại",
    width: 100,
  },
];

export const hotelColumns = [
  { field: "_id", headerName: "ID", width: 250 },
  {
    field: "name",
    headerName: "Tên khách sạn",
    width: 150,
  },
  {
    field: "type",
    headerName: "Loại nơi ở",
    width: 100,
  },
  {
    field: "title",
    headerName: "Tiêu đề",
    width: 230,
  },
  {
    field: "city",
    headerName: "Thành phố",
    width: 100,
  },
];

export const roomColumns = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "title",
    headerName: "Tiêu đề",
    width: 230,
  },
  {
    field: "isUsed",
    headerName: "Trạng thái",
    width: 100,
    renderCell: (params) => {
      let status = ''
      if(params.row.isUsed){
        status = 'Trong hoạt động'
      }else{
        status = "Bảo trì"
      }
      return <div>{status}</div>
    },
  },
  {
    field: "desc",
    headerName: "Mô tả",
    width: 200,
  },
  {
    field: "price",
    headerName: "Giá",
    width: 100,
  },
  {
    field: "maxPeople",
    headerName: "Sức chứa",
    width: 100,
  },
];
