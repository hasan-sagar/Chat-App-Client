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
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import OnlyConversation from "./OnlyConversation";

function SingleConversation() {
  const [message, setMessage] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, setSelectedChat, user } = ChatState();

  const sendMessage = async (event: any) => {
    if (event.key === "Enter" && newMessage) {
      try {
        setNewMessage("");
        const sendMessage: any = await axios.post(
          `${import.meta.env.VITE_API_URL}/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.access_token}`,
            },
          }
        );
        setMessage([...message, sendMessage.data]);
      } catch (error) {
        toast.error("Message send failed");
      }
    }
  };

  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const fetchChat = await axios.get(
        `${import.meta.env.VITE_API_URL}/message/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      setMessage(fetchChat.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch chat");
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [selectedChat]);

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
                <UpdateGroupChatModal fetchMessage={fetchMessage} />
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
                className="flex mx-auto"
                thickness="2px"
                speed="1s"
                emptyColor="gray.200"
                color="purple.700"
                size="lg"
              />
            ) : (
              <div className="flex flex-col overflow-y-scroll customscroll">
                <OnlyConversation message={message} />
              </div>
            )}
            <FormControl isRequired onKeyDown={sendMessage} mt={3}>
              <Input
                autoComplete="off"
                onChange={typingHandler}
                focusBorderColor="purple.700"
                size="lg"
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
