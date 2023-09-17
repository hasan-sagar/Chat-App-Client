import { Badge } from "@chakra-ui/react";
import { IoIosClose } from "react-icons/io";
interface Props {
  user: any;
  handleUser?: () => void;
}
function UserBadge({ user, handleUser }: Props) {
  return (
    <Badge
      className="flex flex-row justify-center items-center"
      px={3}
      py={1}
      borderRadius="lg"
      m={1}
      mt={3}
      variant="outline"
      fontSize={15}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleUser}
    >
      {user.name}
      <IoIosClose pl={1} />
    </Badge>
  );
}

export default UserBadge;
