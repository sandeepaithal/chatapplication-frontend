import { useEffect, useRef, useState } from "react";

import { Box, CircularProgress, Typography } from "@mui/material";

import MessageBubble from "./MessageBubble";
import { getRoomMessages, getDirectMessages } from "../services/chatservice";

function MessageList({ room, directChat, refreshKey, searchText }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // Initial loading when room/direct chat changes
  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);

        let data = [];

        if (room) {
          data = await getRoomMessages(room.id);
        } else if (directChat) {
          data = await getDirectMessages(directChat.id);
        }

        setMessages(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [room, directChat, refreshKey]);

  // Silent polling every 2 seconds
  useEffect(() => {
    if (!room && !directChat) return;

    async function pollMessages() {
      try {
        let data = [];

        if (room) {
          data = await getRoomMessages(room.id);
        } else if (directChat) {
          data = await getDirectMessages(directChat.id);
        }

        setMessages((prev) => {
          if (JSON.stringify(prev) === JSON.stringify(data)) {
            return prev;
          }

          return data;
        });
      } catch (error) {
        console.error(error);
      }
    }

    const interval = setInterval(pollMessages, 2000);

    return () => clearInterval(interval);
  }, [room, directChat]);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const filteredMessages = messages.filter((msg) => {
    if (!searchText?.trim()) return true;

    return (
      msg.content?.toLowerCase().includes(searchText.toLowerCase()) ||
      msg.file_name?.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  if (!room && !directChat) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a room or friend
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "scroll",
        p: 3,
        bgcolor: "#f8fafc",

        // Hide scrollbar visually while keeping scroll functional
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/old Edge
        "&::-webkit-scrollbar": {
          width: 0,
          height: 0,
          display: "none", // Chrome, Safari, Edge (Chromium)
        },
      }}
    >
      {loading ? (
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : filteredMessages.length === 0 ? (
        <Typography align="center" color="text.secondary">
          {searchText?.trim()
            ? "No matching messages found."
            : room
              ? "No messages yet."
              : "Start your conversation."}
        </Typography>
      ) : (
        <>
          {filteredMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              sender={msg.username}
              message={msg.content}
              time={new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              isOwnMessage={msg.user_id === currentUser.id}
              messageType={msg.message_type}
              fileName={msg.file_name}
              fileUrl={msg.file_url}
              fileSize={msg.file_size}
              mimeType={msg.mime_type}
              profilePicture={msg.profile_picture}
            />
          ))}

          <div ref={bottomRef} />
        </>
      )}
    </Box>
  );
}

export default MessageList;
