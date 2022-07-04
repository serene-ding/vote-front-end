import { Button } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AvatarHeader.css";
interface IProps {
  avatar: string;
}

export default function AvatarHeader(props: IProps) {
  const navigate = useNavigate();
  async function logout() {
    await axios.get("/account/logout");
    navigate("/");
  }
  return (
    <div className="AvatarHeaderContainer">
      <img src={props.avatar} alt="avatar" />
      <Button
        type="primary"
        size="small"
        onClick={() => {
          logout();
        }}
      >
        登出
      </Button>
    </div>
  );
}
