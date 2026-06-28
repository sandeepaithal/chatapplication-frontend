import { useState } from "react";

import { Box } from "@mui/material";

import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

function ChatPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedDirectChat, setSelectedDirectChat] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Used to refresh messages
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);

  const refreshMessages = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Rename Room
  const handleRoomUpdated = (data) => {
    setSelectedRoom(data.room);
    setSidebarRefresh((prev) => prev + 1);
  };

  // Delete Room
  const handleRoomDeleted = () => {
    setSelectedRoom(null);
    refreshMessages();
    setSidebarRefresh((prev) => prev + 1);
  };

  // Clear Messages
  const handleMessagesCleared = () => {
    refreshMessages();
  };

  return (
    <Layout>
      <Sidebar
        selectedRoom={selectedRoom}
        setSelectedRoom={setSelectedRoom}
        selectedDirectChat={selectedDirectChat}
        setSelectedDirectChat={setSelectedDirectChat}
        sidebarRefresh={sidebarRefresh}
      />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "#f8fafc",
        }}
      >
        <ChatHeader
          room={selectedRoom}
          directChat={selectedDirectChat}
          searchText={searchText}
          setSearchText={setSearchText}
          onRoomUpdated={handleRoomUpdated}
          onRoomDeleted={handleRoomDeleted}
          onMessagesCleared={handleMessagesCleared}
        />

        <MessageList
          room={selectedRoom}
          directChat={selectedDirectChat}
          refreshKey={refreshKey}
          searchText={searchText}
        />

        <MessageInput
          room={selectedRoom}
          directChat={selectedDirectChat}
          onMessageSent={refreshMessages}
        />
      </Box>
    </Layout>
  );
}

export default ChatPage;
