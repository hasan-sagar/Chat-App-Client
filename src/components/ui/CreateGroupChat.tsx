import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
import { useNavigate } from "react-router-dom";

interface User {
  access_token: any;
  user: any;
  _id: any;
  name: string;
  email: string;
  password?: string;
  image: string;
}

interface Props {
  children: React.ReactNode;
}

function CreateGroupChat({ children }: Props) {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = ChatState();

  const searchUsers = async (searchValue: string) => {
    setSearch(searchValue);
    if (!searchValue) {
      return toast.error("Search by name or email");
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

  const accessToChat = (userToAdd: any) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast.error("User already added to group");
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const createGroup = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error("Fill Forms Correctly");
    }
    try {
      setLoading(true);
      const createGroup = await axios.post(
        `${import.meta.env.VITE_API_URL}/chat/group-chat`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        }
      );
      toast.success(`Group ${createGroup?.data.chatName} created`);
      setLoading(false);
      onClose();
      navigate(0);
    } catch (error) {
      toast.error("Server Problem");
    }
  };

  const deleteSelectUser = (user: any) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== user._id));
  };

  return (
    <div>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="3xl" textAlign="center" color="purple.700">
            Create Group Chat Now!
          </ModalHeader>
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Chat group name</FormLabel>
              <Input
                placeholder="First name"
                focusBorderColor="purple.700"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Search User</FormLabel>
              <Input
                placeholder="Last name"
                focusBorderColor="purple.700"
                onChange={(e) => searchUsers(e.target.value)}
              />
            </FormControl>
            {/* search users result here */}
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleUser={() => deleteSelectUser(user)}
                />
              ))}
            </Box>
            {loading ? (
              <Loading />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user: any) => (
                  <UserSearchList
                    user={user}
                    key={user._id}
                    accessUser={() => accessToChat(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              mr={3}
              onClick={createGroup}
              isDisabled={loading}
            >
              Create Group
            </Button>
            <Button colorScheme="red" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default CreateGroupChat;
