import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import toast from "react-hot-toast";
import axios from "axios";
import { ChatState } from "../../context/ChatContextProvider";
import Loading from "./Loading";
import UserSearchList from "./UserSearchList";
import UserBadge from "./UserBadge";
import { CgMenu } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

function UpdateGroupChatModal() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const renameGroup = async () => {
    if (!groupChatName) {
      return;
    }
    try {
      setRenameLoading(true);
      const updateName = await axios.put(
        `${import.meta.env.VITE_API_URL}/chat/rename/group-chat`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      setSelectedChat(updateName);
      setRenameLoading(false);
      navigate(0);
    } catch (error) {
      toast.error("Server Problem");
      setRenameLoading(false);
    }
  };

  const handleSearchUsers = async (searchValue: string) => {
    if (!searchValue) {
      return;
    }
    try {
      setLoading(true);
      const getUsers: any = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/all-users?search=${searchValue}`,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      setLoading(false);
      setSearchResult(getUsers.data);
    } catch (error) {
      setLoading(false);
      toast.error("Not Found");
    }
  };

  const handleAddUser = async (user1: any) => {
    if (selectedChat.users.find((u: any) => u._id === user1._id)) {
      return toast.error("User Already Added");
    }
    if (selectedChat.groupAdmin._id !== user?.user._id) {
      return toast.error("Admin have access");
    }
    try {
      setLoading(false);
      const addUser = await axios.put(
        `${import.meta.env.VITE_API_URL}/chat/addUser/group-chat`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      setSelectedChat(addUser.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Server problem");
    }
  };

  const handleRemove = async (user1: any) => {
    if (
      selectedChat.groupAdmin._id !== user?.user._id &&
      user1._id !== user?.user._id
    ) {
      return toast.error("Only Admin Have Access");
    }
    try {
      setLoading(true);
      const removeUser = await axios.put(
        `${import.meta.env.VITE_API_URL}/chat/removeUser/group-chat`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      user1._id === user?.user._id
        ? setSelectedChat()
        : setSelectedChat(removeUser);
      setLoading(false);
      navigate(0);
    } catch (error) {
      setLoading(false);
      toast.error("Server problem");
    }
  };

  return (
    <>
      <IconButton
        aria-label=""
        display={{ base: "flex" }}
        icon={<CgMenu />}
        onClick={onOpen}
      />

      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="3xl" textAlign="center" color="purple.700">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalBody pb={6}>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((user: any) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleUser={() => handleRemove(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Update name"
                focusBorderColor="purple.700"
                value={groupChatName}
                onChange={(event: any) => setGroupChatName(event.target.value)}
              />
              <Button isDisabled={renameloading} onClick={renameGroup}>
                Update
              </Button>
            </FormControl>

            <FormControl mt={4}>
              <Input
                placeholder="Search User"
                focusBorderColor="purple.700"
                onChange={(e) => handleSearchUsers(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Loading />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user: any) => (
                  <UserSearchList
                    user={user}
                    key={user._id}
                    accessUser={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user?.user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModal;
