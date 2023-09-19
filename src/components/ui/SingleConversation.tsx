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
import { ImSpinner11 } from "react-icons/im";
import { io } from "socket.io-client";
import Lottie from "lottie-react";
import typingAnimation from "../../assets/typing.json";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT as string;
let socket: any, selectedChatCompare: any;

interface Props {
  reFetch: any;
  setRefetch: any;
}

function SingleConversation({ reFetch, setRefetch }: Props) {
  const [msgrefetch, setmsgrefetc] = useState(false);
  const [message, setMessage] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { selectedChat, setSelectedChat, user } = ChatState();

  const [typing, setTyping] = useState(false);
  const [checkTyping, setCheckTyping] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);

  const sendMessage = async (event: any) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
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
        socket.emit("new message", sendMessage.data);
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
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error("Failed to fetch chat");
    }
  };

  useEffect(() => {
    socket = io(API_ENDPOINT);
    socket.emit("setup", user?.user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setCheckTyping(true);
    });
    socket.on("stop typing", () => {
      setCheckTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
    setmsgrefetc(false);
    setRefetch(!reFetch);
  }, [selectedChat, msgrefetch === true]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved: any) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });

  const typingHandler = (event: any) => {
    setNewMessage(event.target.value);
    if (!socketConnected) {
      return;
    }
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
            <button
              onClick={() => {
                setmsgrefetc(true);
              }}
            >
              <ImSpinner11 size="15px" />
            </button>
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user?.user, selectedChat.users)}
                <ChatProfile
                  user={getSenderFull(user, selectedChat.users)}
                  children={undefined}
                />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessage={fetchMessage}
                  reFetch={reFetch}
                  setRefetch={setRefetch}
                />
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
              {checkTyping ? (
                <>
                  <Lottie
                    className="h-14 w-14"
                    animationData={typingAnimation}
                    loop={true}
                  />
                </>
              ) : (
                <></>
              )}
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
