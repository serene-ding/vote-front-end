import AvatarHeader from "./AvatarHeader";

interface IProps {
  avatar: string;
}
export default function MeNoVotes(props: IProps) {
  return (
    <div
      className="MeNoVotesContainer"
      style={{ textAlign: "center", fontSize: "2em", padding: "0 2em" }}
    >
      <AvatarHeader avatar={props.avatar}></AvatarHeader>
      <div style={{ lineHeight: "600px", minHeight: "600px" }}>
        您还未创建过投票😜
      </div>
    </div>
  );
}
