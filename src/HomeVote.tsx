import { FolderTwoTone } from "@ant-design/icons";
import { Button } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomeVote.css";
export default function HomeVote() {
  let navigate = useNavigate();
  const [response, setResponse] = useState<any>("init");
  useEffect(() => {
    axios.get("/account/current-user").then(
      (res) => {
        setResponse(res.data.result);
        console.log(res.data.result);
      },
      (e) => {
        setResponse(e.response.data);
        console.log(e.response.data);
      }
    );
  }, []);
  function toCreateVote(type: string) {
    console.log(response);
    if (response.code === -1) {
      navigate("/pleaseLogin");
    } else {
      navigate("/create?type=" + type);
    }
  }
  return (
    <div className="HomeVoteContainer">
      <div className="Vote">
        <FolderTwoTone style={{ fontSize: "100px" }} />
        <Button
          type="primary"
          onClick={() => {
            toCreateVote("single");
          }}
        >
          单选投票
        </Button>
      </div>
      <div className="Vote">
        <FolderTwoTone style={{ fontSize: "100px" }} />
        <Button
          type="primary"
          onClick={() => {
            toCreateVote("multiple");
          }}
        >
          多选投票
        </Button>
      </div>
    </div>
  );
}
