import "./register.css";

import { useState } from "react";
import axios from "axios";
import { userInputs } from "../../formSource"
import {
    faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const New = () => {
    const [file, setFile] = useState("");
    const [info, setInfo] = useState({});

    const handleChange = (e) => {
        setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "upload");
        try {
            const uploadRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dr5a2uwpd/image/upload",
                data,
            );
      console.log(uploadRes);

            const { url } = uploadRes.data;

            const newUser = {
                ...info,
                img: url,
            };

            const res = await axios.post("/auth/register", newUser);
            if (res.data == "User has been created.") {
                alert("A new user has been added")
            }
        } catch (err) {
            alert(err);
        }
    };

    // console.log(info);
    return (
        <div className="new">

            <div className="newContainer">

                <div className="top">
                    <h1>Đăng kí</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Ảnh:   <FontAwesomeIcon icon={faUpload} />
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{ display: "none" }}
                                />
                            </div>

                            {userInputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        onChange={handleChange}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        id={input.id}
                                    />
                                </div>
                            ))}
                            <button onClick={handleClick}>Gửi</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;
