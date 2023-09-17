import {
  Avatar,
  Box,
  Button,
  Input,
  ModalCloseButton,
  ModalOverlay,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { Text } from "@chakra-ui/react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { TbUserSearch } from "react-icons/tb";
import { GoChevronDown } from "react-icons/go";
import { AiOutlineBell } from "react-icons/ai";
import ProfilePageModal from "./ProfilePageModal";
import { ChatState } from "../../context/ChatContextProvider";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import axios from "axios";
import Loading from "./Loading";
import UserSearchList from "./UserSearchList";

function SideDrawer() {
  const navigate = useNavigate();
  const { user, setSelectedChat, chats, setChats } = ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [laoding, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const searchHandle = async () => {
    if (!search) {
      return toast.error("Search By Name and Email");
    }
    try {
      setLoading(true);
      const getUsers: any = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/all-users?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      setLoading(false);
      setSearchResult(getUsers.data);
    } catch (error) {
      toast.error("Not Found");
    }
  };

  const logoutHandle = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const accessToChat: any = async (userId: string) => {
    try {
      setChatLoading(true);
      const accessChat = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      //chat exist
      if (!chats.find((c: any) => c._id === accessToChat._id)) {
        setChats([accessToChat, ...chats]);
      }
      setSelectedChat(accessChat);
      setChatLoading(false);
      onClose();
      navigate(0);
    } catch (error) {
      toast.error("Chat Server Exist");
    }
  };

  return (
    <div className="px-2">
      <Box className="px-4 py-4 bg-white w-full  mt-2 flex flex-row justify-between items-center">
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="link" onClick={onOpen}>
            <TbUserSearch size="20px" />
            <Text
              className="text-black"
              display={{ base: "none", md: "flex" }}
              px={4}
            >
              Search User
            </Text>
          </Button>
        </Tooltip>
        <h1 className="text-purple-800 font-bold text-xl logo">Chat Message</h1>

        <div className="flex flex-row justify-center items-center gap-2">
          <Menu>
            <MenuButton p={1}>
              <AiOutlineBell size="20px" />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<GoChevronDown />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name="Sagar"
                src={user?.user.image}
              />
            </MenuButton>
            <MenuList>
              <ProfilePageModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfilePageModal>
              <MenuItem onClick={logoutHandle}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      {/* User Search Modal */}
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="text-center">Search User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box className="flex flex-row justify-between gap-1">
              <Input
                placeholder="Search by name or email"
                focusBorderColor="purple.700"
                onChange={(event: any) => setSearch(event.target.value)}
              />
              <Button onClick={searchHandle} colorScheme="purple">
                Search
              </Button>
            </Box>
            {laoding ? (
              <Loading />
            ) : (
              searchResult?.map((user: any) => (
                <UserSearchList
                  key={user._id}
                  user={user}
                  accessUser={() => accessToChat(user._id)}
                />
              ))
            )}
            <div className="text-center mt-5">
              {chatLoading && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="purple.700"
                  size="md"
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default SideDrawer;
