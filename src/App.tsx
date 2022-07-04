import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import "./App.css";
import CreateVote from "./CreateVote";
import Login from "./Login";
import Home from "./Home";
import HomeVote from "./HomeVote";
import ShowVote from "./ShowVote";
import Me from "./Me";
import MeNotLogin from "./MeNotLogin";
import Register from "./Register";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />}></Route>
        <Route path="/home" element={<Home />}>
          <Route path="" element={<Navigate to="create" replace />}></Route>
          <Route path="create" element={<HomeVote />}>
            {" "}
          </Route>
          <Route path="me" element={<Me />}></Route>
        </Route>
        <Route path="/create" element={<CreateVote />}></Route>
        <Route path="/vote/:voteId" element={<ShowVote />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/pleaseLogin" element={<MeNotLogin />}></Route>
        <Route path="/register" element={<Register />}></Route>
      </Routes>
    </div>
  );
}

export default App;
