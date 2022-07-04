import { DeleteOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "./Loading";
import Login from "./Login";
import MeNotLogin from "./MeNotLogin";
import "./Me.css";
import MeShowVotes from "./MeShowVotes";
export default function Me() {
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

  if (response === "init") {
    return <Loading />;
  } else if (response.code === -1) {
    return <MeNotLogin></MeNotLogin>;
  } else {
    return <MeShowVotes avatar={response.avatar}></MeShowVotes>;
  }
}
