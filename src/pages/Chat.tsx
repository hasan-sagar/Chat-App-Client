import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/ui/SideDrawer";
import { ChatState } from "../context/ChatContextProvider";
import MyChatBar from "../components/ui/MyChatBar";
import ConversationBox from "../components/ui/ConversationBox";
import { useState } from "react";

function ChatPage() {
  const [reFetch, setRefetch] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        className="scale-up-hor-left"
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChatBar reFetch={reFetch} />}
        {user && <ConversationBox reFetch={reFetch} setRefetch={setRefetch} />}
      </Box>
    </div>
  );
}

export default ChatPage;
