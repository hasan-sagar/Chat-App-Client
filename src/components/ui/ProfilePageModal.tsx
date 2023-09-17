import { Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { AiOutlineEye } from "react-icons/ai";
import { Image } from "@chakra-ui/react";
interface Props {
  children?: React.ReactNode;
  user?: any;
}
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";

function ProfilePageModal({ children, user }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          aria-label=""
          display={{ base: "flex" }}
          icon={<AiOutlineEye />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent className="h-96">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col justify-center items-center">
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.user.image}
              />
              <Button
                colorScheme="gray"
                size="xs"
                className="mt-2 text-purple-800"
              >
                User
              </Button>
              <h1
                className="text-purple-800 mt-5 mb-2
              font-bold text-3xl logo uppercase"
              >
                {user.user.name}
              </h1>
              <p className="font-semibold tracking-wider">
                Email: {user.user.email}
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
export default ProfilePageModal;
