import { Spinner } from "@chakra-ui/react";

function Loading() {
  return (
    <div className="text-center mt-5">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="purple.700"
        size="md"
      />
    </div>
  );
}

export default Loading;
