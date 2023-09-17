import {
  FormControl,
  FormLabel,
  Input,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const passwordFunction = () => setShow(!show);

  //form submit login
  const formSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("Wrong Credentials");
      setLoading(false);
      return;
    }
    try {
      const loginUser = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Welcome User");
      localStorage.setItem("user", JSON.stringify(loginUser.data));
      navigate("/chat");
      setLoading(false);
    } catch (error: any) {
      const errormessage = error.response.data;
      toast.error(errormessage);
      setLoading(false);
    }
  };

  return (
    <div>
      <FormControl className="mb-3">
        <FormLabel fontWeight="semibold">Email</FormLabel>
        <Input
          onChange={(event: any) => setEmail(event.target.value)}
          fontWeight="medium"
          type="email"
          placeholder="Enter your valid email"
          focusBorderColor="purple.700"
        />
      </FormControl>
      <FormControl className="mb-3">
        <FormLabel fontWeight="semibold">Password</FormLabel>
        <InputGroup size="md">
          <Input
            fontWeight="medium"
            onChange={(event: any) => setPassword(event.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
            focusBorderColor="purple.700"
          />
          <InputRightElement
            width="4.5rem"
            onClick={passwordFunction}
            className="cursor-pointer"
          >
            {show ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        onClick={formSubmit}
        className="w-full mt-5 mb-2"
        colorScheme="purple"
      >
        Login
      </Button>
      <Button className="w-full" colorScheme="green" isLoading={loading}>
        Guest User
      </Button>
    </div>
  );
}

export default Login;
