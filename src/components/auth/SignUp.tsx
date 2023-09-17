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

function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setcPassword] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const passwordFunction = () => setShow(!show);

  //form submit register
  const formSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !cpassword) {
      toast.error("Fill The Form Correctly Please");
      setLoading(false);
      return;
    }
    //check password
    if (password !== cpassword) {
      toast.error("Incorrect Password");
      setLoading(false);
      return;
    }

    //save to api
    try {
      const userData = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register`,
        {
          name,
          email,
          password,
          image,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("User Registration Success");
      localStorage.setItem("user", JSON.stringify(userData.data));
      setLoading(false);
      navigate("/chat");
    } catch (error: any) {
      const errormessage = error.response.data;
      toast.error(errormessage);
      setLoading(false);
    }
  };

  //image upload
  const imageUpload = async (image: any) => {
    setLoading(true);
    if (image === undefined) {
      return toast.error("Image Required!");
    }
    if (image.type === "image/jpeg" || "image/png") {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dkrupki89");
      await axios
        .post("https://api.cloudinary.com/v1_1/dkrupki89/image/upload", data)
        .then((response: any) => response.data)
        .then((data) => {
          setImage(data.url.toString());
          setLoading(false);
        })
        .catch((error: any) => {
          toast.error("Server Problem");
          console.log(error);
          setLoading(false);
        });
    } else {
      toast.error("Image Required!");
      setLoading(false);
      return;
    }
  };

  return (
    <div>
      <FormControl className="mb-3">
        <FormLabel fontWeight="semibold">User Name</FormLabel>
        <Input
          onChange={(event: any) => setName(event.target.value)}
          fontWeight="medium"
          type="text"
          placeholder="Enter your name"
          focusBorderColor="purple.700"
        />
      </FormControl>
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
            onChange={(event: any) => setPassword(event.target.value)}
            fontWeight="medium"
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
      <FormControl id="password" className="mb-3">
        <FormLabel fontWeight="semibold">Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            onChange={(event: any) => setcPassword(event.target.value)}
            fontWeight="medium"
            type={show ? "text" : "password"}
            placeholder="Retype password"
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
      <FormControl id="image">
        <FormLabel fontWeight="semibold">Upload Image</FormLabel>
        <Input
          accept="image/*"
          type="file"
          border={"antiquewhite"}
          onChange={(event: any) => imageUpload(event.target.files[0])}
        />
      </FormControl>
      <Button
        className="w-full mt-5 mb-2"
        colorScheme="purple"
        onClick={formSubmit}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </div>
  );
}

export default SignUp;
