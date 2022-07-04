import { DeleteOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { message } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AvatarHeader from "./AvatarHeader";
import MeNoVotes from "./MeNoVotes";
interface IProps {
  avatar: string;
}
export default function MeShowVotes(props: IProps) {
  const [myVotes, setMyVotes] = useState<any[]>();
  const [chosenIndex, setChosenIndex] = useState<number>();

  useEffect(() => {
    axios.get("/vote").then((res) => {
      setMyVotes(res.data.result);
      console.log(res.data.result);
    });
  }, []);
  function clickVoteCard(index: number) {
    if (index === chosenIndex) {
      setChosenIndex(-1);
    } else {
      setChosenIndex(index);
    }
  }

  async function deleteVote(index: number, id: string) {
    await axios.delete("/vote/" + id);
    await axios.get("/vote").then((res) => {
      setMyVotes(res.data.result);
      console.log(res.data.result);
    });
    setChosenIndex(-1);
    console.log("delete successfully");
  }

  if (!myVotes) {
    return <></>;
    // Dismiss manually and asynchronously
  } else {
    if (myVotes.length === 0) {
      return <MeNoVotes avatar={props.avatar}></MeNoVotes>;
    } else {
      return (
        <div className="MeContainer">
          <AvatarHeader avatar={props.avatar}></AvatarHeader>
          {myVotes.map((vote, index) => {
            let voteId: string = vote.voteId;
            return (
              <div className="MyVoteCardContainer" key={index}>
                <div
                  className="MyVoteCard"
                  onClick={() => {
                    clickVoteCard(index);
                  }}
                >
                  {vote.title}
                </div>
                {chosenIndex === index && (
                  <div className="Choices">
                    <Link to={"/vote/" + voteId}>
                      <div className="iconBox">
                        <MenuUnfoldOutlined style={{ fontSize: "1.2em" }} />
                        <span>查看</span>
                      </div>
                    </Link>

                    <div
                      className="iconBox"
                      onClick={() => {
                        deleteVote(index, voteId);
                      }}
                    >
                      <DeleteOutlined style={{ fontSize: "1.2em" }} />
                      <span>删除</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  }
}
