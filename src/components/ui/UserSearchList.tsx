import { Avatar, Box } from "@chakra-ui/react";

interface Props {
  user?: any;
  accessUser?: any;
}
function UserSearchList({ user, accessUser }: Props) {
  return (
    <div>
      <Box
        onClick={accessUser}
        w="100%"
        p={4}
        bg="blackAlpha.100"
        className="mt-5 rounded-lg flex flex-row justify-start gap-5 cursor-pointer hover:bg-purple-100"
      >
        <Avatar size="md" cursor="pointer" name="Sagar" src={user.image} />
        <div>
          <h1 className="text-purple-700 font-semibold text-base uppercase">
            {user.name}
          </h1>
          <p className="font-medium">{user.email}</p>
        </div>
      </Box>
    </div>
  );
}

export default UserSearchList;
