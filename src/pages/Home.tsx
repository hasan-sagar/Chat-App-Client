import { Box, Container } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  useEffect(() => {
    const userInfoString = localStorage.getItem("user");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    if (userInfo) return navigate("/chat");
  }, [navigate]);
  return (
    <div className="custom-bg bg-black w-full">
      <Container maxW="xl" centerContent>
        <h1 className="text-white mt-10 font-bold text-5xl logo tracking-widest">
          Chat Message
        </h1>
        <Box bg="white" w="100%" p={4} borderRadius="lg" className="mt-10">
          <Tabs
            isFitted
            variant="line"
            colorScheme="purple"
            className="fade-in-top"
          >
            <TabList mb="1em">
              <Tab fontWeight="semibold">Login</Tab>
              <Tab fontWeight="semibold">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel className="fade-in-top">
                <Login />
              </TabPanel>
              <TabPanel className="fade-in-top">
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    </div>
  );
}

export default HomePage;
