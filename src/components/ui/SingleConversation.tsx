import { Box, IconButton, Text } from "@chakra-ui/react";
import { ChatState } from "../../context/ChatContextProvider";
import { BiSolidLeftArrowAlt } from "react-icons/bi";
import { getSender, getSenderFull } from "../chat-logic/ChatLogic";
import ChatProfile from "./ChatProfile";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
interface Props {
  reFetch: any;
  setRefetch: any;
}
function SingleConversation() {
  const { selectedChat, setSelectedChat, user } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              aria-label=""
              display={{ base: "flex", md: "none" }}
              icon={<BiSolidLeftArrowAlt />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ChatProfile
                  user={getSenderFull(user, selectedChat.users)}
                  children={undefined}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#F4F6FB"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          ></Box>
        </>
      ) : (
        <Box className="h-full flex justify-center items-center">
          <Text className="font-medium logo text-4xl">
            Select a friend to say Hi
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleConversation;
