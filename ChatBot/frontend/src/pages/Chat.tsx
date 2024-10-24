import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import red from "@mui/material/colors/red";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
    deleteUserChats,
    getUserChats,
    sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
type Message = {
    role: "user" | "assistant";
    content: string;
};
const Chat = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const auth = useAuth();
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const handleSubmit = async () => {
        const content = inputRef.current?.value as string;
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        const newMessage: Message = { role: "user", content };
        setChatMessages((prev) => [...prev, newMessage]);
        const chatData = await sendChatRequest(content);
        setChatMessages([...chatData.chats]);

    };
    const handleDeleteChats = async () => {
        try {
            toast.loading("Deleting Chats", { id: "deletechats" });
            await deleteUserChats();
            setChatMessages([]);
            toast.success("Deleted Chats Successfully", { id: "deletechats" });
        } catch (error) {
            console.log(error);
            toast.error("Deleting chats failed", { id: "deletechats" });
        }
    };
    useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth.user) {
            toast.loading("Loading Chats", { id: "loadchats" });
            getUserChats()
                .then((data) => {
                    setChatMessages([...data.chats]);
                    toast.success("Successfully loaded chats", { id: "loadchats" });
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Loading Failed", { id: "loadchats" });
                });
        }
    }, [auth]);
    useEffect(() => {
        if (!auth?.user) {
            return navigate("/login");
        }
    }, [auth]);
    return (
        <Box
            sx={{
                display: "flex",
                flex: 1,
                width: "100%",
                height: "100%",
                mt: 3,
                gap: 3,
            }}
        >
            <Box
                sx={{
                    display: { md: "flex", xs: "none", sm: "none" },
                    flex: 0.2,
                    flexDirection: "column",
                }}
            >
                <Button
                    onClick={handleDeleteChats}
                    sx={{
                        width: "200px",
                        my: "10",
                        color: "#1B1212",
                        fontWeight: "700",
                        borderRadius: 3,
                        mx: "auto",
                        bgcolor: "#8B0000",
                        ":hover": {
                            bgcolor: red.A400,
                        },
                    }}
                >
                    Clear Conversation
                </Button>

            </Box>
            <Box
                sx={{
                    display: "flex",
                    flex: { md: 0.8, xs: 1, sm: 1 },
                    flexDirection: "column",
                    px: 3,
                }}
            >
                <Typography
                    sx={{
                        fontSize: "40px",
                        color: "white",
                        mb: 2,
                        mx: "auto",
                        fontWeight: "600",
                    }}
                >
                    Friedrich, Your German Tutor
                </Typography>
                <Box
                    sx={{
                        width: "100%",
                        height: "60vh",
                        borderRadius: 3,
                        mx: "auto",
                        bgColor: "transparent",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "scroll",
                        overflowX: "hidden",
                        overflowY: "auto",
                        scrollBehavior: "smooth",
                    }}
                >
                    {chatMessages.map((chat, index) => (
                        //@ts-ignore
                        <ChatItem content={chat.content} role={chat.role} key={index} />
                    ))}
                </Box>
                <div
                    style={{
                        width: "100%",
                        borderRadius: 8,
                        backgroundColor: "#8B0000",
                        display: "flex",
                        margin: "auto",
                    }}
                >
                    {" "}
                    <input
                        ref={inputRef}
                        type="text"
                        style={{
                            width: "100%",
                            backgroundColor: "#1B1212",
                            padding: "30px",
                            border: "none",
                            outline: "none",
                            color: "white",
                            fontSize: "20px",
                        }}
                    />
                    <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
                        <IoMdSend />
                    </IconButton>
                </div>
            </Box>
        </Box>
    );
};

export default Chat;