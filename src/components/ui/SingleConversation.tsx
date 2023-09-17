import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatContextProvider";
import { BiSolidLeftArrowAlt } from "react-icons/bi";
import { getSender, getSenderFull } from "../chat-logic/ChatLogic";
import ChatProfile from "./ChatProfile";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useState } from "react";

function SingleConversation() {
  const [message, setMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const { selectedChat, setSelectedChat, user } = ChatState();

  const sendMessage = () => {
    
  };

  const typingHandler = (event: any) => {
    setNewMessage(event.target.value);
  };

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
          >
            {loading ? (
              <Spinner
                thickness="2px"
                speed="0.65s"
                emptyColor="gray.200"
                color="purple.700"
                size="md"
              />
            ) : (
              <>{/* Message */}</>
            )}
            <FormControl isRequired onKeyDown={sendMessage} mt={3}>
              <Input
                onChange={typingHandler}
                focusBorderColor="purple.700"
                size="md"
                fontWeight="medium"
                variant="filled"
                bg="white"
                placeholder="Send Hi ..."
                value={newMessage}
              />
            </FormControl>
          </Box>
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
