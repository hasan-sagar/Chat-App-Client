import { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatContextProvider";
import toast from "react-hot-toast";
import axios from "axios";
import { Avatar, Box, Button, Stack } from "@chakra-ui/react";
import { AiOutlinePlus } from "react-icons/ai";
import Loading from "./Loading";
import { Text } from "@chakra-ui/react";
import { getSender, getSenderImage } from "../chat-logic/ChatLogic";
import CreateGroupChat from "./CreateGroupChat";

interface Props {
  reFetch: any;
}

function MyChatBar({ reFetch }: Props) {
  const [loggedUser, setLoggedUser] = useState();
  const { chats, setChats, user, selectedChat, setSelectedChat } = ChatState();

  const fetchChatData = async () => {
    try {
      const chatData = await axios.get(`${import.meta.env.VITE_API_URL}/chat`, {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      setChats(chatData.data);
    } catch (error) {
      toast.error("Server Error");
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("user") as string;
    const loggedInUser = JSON.parse(userString);
    setLoggedUser(loggedInUser);
    fetchChatData();
  }, [reFetch]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        Chats
        <CreateGroupChat>
          <Button
            colorScheme="purple"
            className="flex flex-row gap-2 justify-start items-center"
          >
            <AiOutlinePlus />
            Group Chat
          </Button>
        </CreateGroupChat>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={4}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat: any) => (
              <Box
                className="hover:bg-purple-200 transition duration-300"
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "purple.700" : "blackAlpha.100"}
                px={5}
                py={3}
                borderRadius="lg"
                key={chat._id}
              >
                <div className="flex flex-row justify-start items-center gap-5">
                  <Avatar
                    src={
                      !chat.isGroupChat
                        ? getSenderImage(loggedUser, chat.users)
                        : chat.chatName
                    }
                  />
                  <Text
                    color={selectedChat === chat ? "white" : "black"}
                    fontWeight={selectedChat === chat ? "semibold" : "medium"}
                  >
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </div>
              </Box>
            ))}
          </Stack>
        ) : (
          <Loading />
        )}
      </Box>
    </Box>
  );
}

export default MyChatBar;
