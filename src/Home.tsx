import { FileAddFilled, SmileFilled } from "@ant-design/icons";
import { NavLink, Outlet } from "react-router-dom";
import "./Home.css";
export default function Home() {
  return (
    <div className="HomeContainer">
      <div className="HomeBody">
        <Outlet />
      </div>
      <div className="HomeFooter">
        <NavLink to="create">
          <FileAddFilled style={{ fontSize: "30px" }} />
          <div>新建</div>
        </NavLink>
        <NavLink to="me">
          <SmileFilled style={{ fontSize: "30px" }} />
          <div>我的</div>
        </NavLink>
      </div>
    </div>
  );
}
