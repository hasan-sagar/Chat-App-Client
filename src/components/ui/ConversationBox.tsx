import { Box } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatContextProvider";
import SingleConversation from "./SingleConversation";

interface Props {
  reFetch: any;
  setRefetch: any;
}

function ConversationBox({ reFetch, setRefetch }: Props) {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
    >
      <SingleConversation reFetch={reFetch} setRefetch={setRefetch} />
    </Box>
  );
}

export default ConversationBox;
