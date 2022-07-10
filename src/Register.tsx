import { Button, Checkbox, Form, Input } from "antd";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
export default function Register() {
  const navigate = useNavigate();
  let uploadRef = useRef<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<any>(null);
  async function HandleUploadAvatar(e: any) {
    let avatarFile = e.target.files[0];
    console.log(avatarFile);
    let fd = new FormData();
    fd.append("avatar", avatarFile);
    let res = await axios.post("/upload", fd);
    console.log(res.data[0], "res");
    setAvatarUrl(res.data[0]);
  }
  async function onFinish(values: any) {
    values["avatar"] = avatarUrl;
    await axios.post("/account/register", values);
    console.log(values);
    await axios.post("/account/login", values);
    navigate("/home/me");
  }
  return (
    <div className="RegisterContainer">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>
        <div className="AvatarUploader">
          <input
            type="file"
            ref={uploadRef}
            style={{ display: "none" }}
            onChange={(e: any) => {
              HandleUploadAvatar(e);
            }}
          />
          <svg
            onClick={() => {
              if (uploadRef.current) {
                uploadRef.current.click();
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            className="bi bi-upload"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z" />
          </svg>
          <span className="text">上传头像</span>
          {avatarUrl && <img src={avatarUrl} alt=""></img>}
        </div>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
