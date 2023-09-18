import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatContextProvider";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../chat-logic/ChatLogic";

interface Props {
  message: any;
}
function OnlyConversation({ message }: Props) {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {message &&
        message.map((m: any, i: any) => (
          <div className="flex items-center justify-start gap-1" key={m._id}>
            {(isSameSender(message, m, i, user?.user._id) ||
              isLastMessage(message, i, user?.user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.image}
                />
              </Tooltip>
            )}
            <span
              className={`${
                m?.sender?._id === user?.user?._id
                  ? "bg-slate-300 font-medium"
                  : "bg-purple-700 text-white font-medium"
              }`}
              style={{
                marginLeft: isSameSenderMargin(message, m, i, user?.user._id),
                marginTop: isSameUser(message, m, i) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}

export default OnlyConversation;
