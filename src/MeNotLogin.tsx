import { Button } from "antd";
import { Link } from "react-router-dom";
import "./MeNotLogin.css";
export default function MeNotLogin() {
  return (
    <div className="MeNotLoginContainer">
      <Button type="primary" size="large">
        <Link to="/login">您还未登录，请登录</Link>
      </Button>
      <div className="registerContainer">
        <Link to="/register">没有账号？先注册个😉</Link>
      </div>
    </div>
  );
}
