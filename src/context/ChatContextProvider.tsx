import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

type User = {
  access_token: any;
  user: any;
  _id: any;
  name: string;
  email: string;
  password?: string;
  image: string;
};

type ChatContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedChat: any;
  setSelectedChat: any;
  chats: any;
  setChats: any;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

type ChatContextProviderProps = {
  children: ReactNode;
};

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userInfoString = localStorage.getItem("user");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
    setUser(userInfo);
    if (!userInfo) navigate("/");
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatState must be used within a ChatContextProvider");
  }
  return context;
};

export default ChatContextProvider;
