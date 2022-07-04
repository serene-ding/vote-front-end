import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "./Loading";
import _ from "lodash";
import "./ShowVote.css";
import { Button, Progress } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";

import { useImmer } from "use-immer";
import { Dialog } from "antd-mobile";
import { useToggle } from "ahooks";
import MeNotLogin from "./MeNotLogin";
export default function ShowVote() {
  const params = useParams();
  const voteId = params.voteId;
  const [voteInfo, setVoteInfo] = useState<any>();
  const [currentUser, setCurrentUser] = useState<any>();
  const [AnonymousShowImage, { toggle: AnonymousShowImageToggle }] =
    useToggle(false);
  const [pleaseLogin, setPleaseLogin] = useState<boolean>(false);
  console.log(voteId);
  console.log(voteInfo, "voteInfo");

  useEffect(() => {
    axios.get("/vote/" + voteId).then((res) => {
      setVoteInfo(res.data.result);
    });
  }, [voteId]);
  let host = window.location.host;
  let isAnonymous: boolean;
  useEffect(() => {
    let ws = new WebSocket(`ws://${host}/realtime-voteinfo/${voteId}`);

    ws.onmessage = function (e) {
      let realTimeVoteInfo = JSON.parse(e.data);
      console.log(realTimeVoteInfo, "websocket");
      setVoteInfo((voteInfo: any) => {
        return {
          ...voteInfo,
          userVotes: realTimeVoteInfo,
        };
      });
    };
    ws.onopen = () => {
      console.log("open", ws.readyState);
    };
    ws.onclose = function (e) {
      console.log(
        "websocket 断开: " + e.code + " " + e.reason + " " + e.wasClean
      );
      console.log(e);
    };

    return () => {
      ws.close();
      ws.onmessage = null;
    };
  }, [voteId, host]);
  useEffect(() => {
    axios.get("/account/current-user").then(
      (res) => {
        setCurrentUser(res.data.result);
        console.log(res.data.result, "current-user");
      },
      (e) => {
        setCurrentUser(e.response.data);
        console.log(typeof e.response.data.code, "e");
      }
    );
  }, []);

  async function VoteForThis(option: any) {
    let optionId = option.optionId;
    let res = await axios.post("/vote/" + voteId, {
      optionIds: [optionId],
    });
    console.log(
      {
        optionIds: [optionId],
      },
      "投票成功",
      res
    );
  }
  const [anonymousOptions, updateAnonymousOptions] = useImmer<any[]>([]);
  console.log(anonymousOptions, "anonymous options");
  let currentUserVoted = false;
  let isVoteCreator = false;
  if (voteInfo && currentUser) {
    currentUserVoted = voteInfo.userVotes.find((it: any) => {
      return it.userId === currentUser.userId;
    })
      ? true
      : false;
    console.log(currentUserVoted, "currentUserVoted");
    isVoteCreator = voteInfo.vote.userId === currentUser.userId;
    console.log(isVoteCreator, "isVoteCreator");
  }

  async function HandleOptionClick(option: any) {
    if (currentUser === undefined || currentUser.code === -1) {
      setPleaseLogin(true);
      return;
    }
    if (isAnonymous) {
      if (currentUserVoted) {
        Dialog.alert({
          content: "你已经投过票啦",
          onConfirm: () => {
            console.log("Confirmed");
          },
        });
      } else {
        updateAnonymousOptions((draft) => {
          if (draft.includes(option.optionId)) {
            return draft.filter((it) => it !== option.optionId);
          } else {
            if (voteInfo.vote.multiple === 0) {
              draft.pop();
              draft.push(option.optionId);
            } else {
              draft.push(option.optionId);
            }
          }
        });
      }
    } else {
      VoteForThis(option);
    }
  }
  async function submitAnonymousVotes() {
    let res = await axios.post("/vote/" + voteId, {
      optionIds: anonymousOptions,
    });
    console.log(
      {
        optionIds: anonymousOptions,
      },

      "投票成功",
      res
    );
  }
  if (pleaseLogin) {
    return <MeNotLogin></MeNotLogin>;
  }
  if (!voteInfo) {
    return <Loading></Loading>;
  } else {
    const UsersPerOption = _.groupBy(voteInfo.userVotes, "optionId");

    if (voteInfo.vote.anonymous === 0) {
      isAnonymous = false;
    } else {
      isAnonymous = true;
    }
    console.log("isAnonymous", isAnonymous);
    return (
      <div className="ShowVoteContainer">
        <div className="VoteHeader">
          <h2>{voteInfo!.vote.title}</h2>
          <span style={{ display: "block" }}>{voteInfo!.vote.desc}</span>
          <span className="voteKind">
            [{voteInfo!.vote.multiple === 0 ? "单选" : "多选"}]
          </span>
        </div>
        <div className="VoteBody">
          {voteInfo!.options.map((option: any, index: number) => {
            let usersForOption = UsersPerOption[option.optionId] ?? [];
            let optionCount = UsersPerOption[option.optionId]?.length ?? 0;
            // console.log(typeof optionCount);
            let optionCountPercentage: number;
            let showChecked = false;
            //匿名且未投票时的票数只在前端处理
            //没有与后端交互
            //变量anonymousVoteCount是为了处理这种情况
            //当不属于匿名且未投票时 它的值为0
            //当属于匿名且未投票时 如果用户有投这一票 它的值为1 否则也为0
            let anonymousVoteCount = 0;
            if (isAnonymous && !currentUserVoted) {
              if (anonymousOptions.includes(option.optionId)) {
                anonymousVoteCount = 1;
              }
            }
            //判断是否有人投票
            if (isAnonymous) {
              if (
                anonymousOptions.length !== 0 ||
                voteInfo.userVotes.length !== 0
              ) {
                let p = (
                  ((optionCount + anonymousVoteCount) /
                    (voteInfo.userVotes.length + anonymousOptions.length)) *
                  100
                ).toFixed(2);
                optionCountPercentage = Number(p);

                if (currentUser) {
                  showChecked = usersForOption.find((it) => {
                    return it.userId === currentUser.userId;
                  });
                }
              } else {
                optionCountPercentage = 0;
              }
            } else {
              if (voteInfo.userVotes.length === 0) {
                optionCountPercentage = 0;
                showChecked = false;
              } else {
                // anonymousVoteCount  anonymousOptions.length 默认为0
                //只有在匿名且未投票时 这些值才会随着用户点击而变化
                //其他情况完全可以不考虑这两个变量
                // ((optionCount) /
                // (voteInfo.userVotes.length)) *
                // 100
                // .toFixed(2);
                let p = (
                  (optionCount / voteInfo.userVotes.length) *
                  100
                ).toFixed(2);
                optionCountPercentage = Number(p);

                if (currentUser) {
                  showChecked = usersForOption.find((it) => {
                    return it.userId === currentUser.userId;
                  });
                }
              }
            }

            return (
              <div className="CardContainer" key={index}>
                <div
                  className="VoteOptionCard"
                  onClick={() => {
                    HandleOptionClick(option);
                  }}
                >
                  <div className="content">
                    {option.content}
                    {!isAnonymous && showChecked ? (
                      <CheckCircleTwoTone
                        style={{ fontSize: "20px", color: "#1890ff" }}
                      />
                    ) : (
                      ""
                    )}
                    {isAnonymous && currentUserVoted && showChecked ? (
                      <CheckCircleTwoTone
                        style={{ fontSize: "20px", color: "#1890ff" }}
                      />
                    ) : (
                      ""
                    )}
                    {isAnonymous &&
                    !currentUserVoted &&
                    anonymousOptions.includes(option.optionId) ? (
                      <CheckCircleTwoTone
                        style={{ fontSize: "20px", color: "#1890ff" }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div className="stat">
                    <span className="voteCount">
                      {optionCount + anonymousVoteCount}票
                    </span>
                    <span className="optionId">{option.optionId}</span>
                    <span className="votePercentage">
                      {optionCountPercentage}%
                    </span>
                  </div>
                </div>
                <Progress
                  percent={optionCountPercentage}
                  showInfo={false}
                ></Progress>
                {(!isAnonymous || (isAnonymous && AnonymousShowImage)) && (
                  <div className="avatarContainer">
                    {usersForOption.map((info, index) => {
                      return (
                        <img
                          className="avatar"
                          src={info.avatar}
                          alt="avatar"
                          key={index}
                        ></img>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          <div className="anonymousButtonContainer">
            {isAnonymous && !currentUserVoted && (
              <Button
                type="primary"
                disabled={anonymousOptions.length === 0}
                onClick={() => {
                  submitAnonymousVotes();
                }}
              >
                投票
              </Button>
            )}
            {isAnonymous && currentUserVoted && isVoteCreator && (
              <Button type="primary" onClick={AnonymousShowImageToggle}>
                {!AnonymousShowImage ? "显示详情" : "隐藏详情"}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
