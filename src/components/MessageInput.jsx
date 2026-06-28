import { useRef, useState } from "react";

import {
  Box,
  TextField,
  IconButton,
  Paper,
  Tooltip,
  Popover,
} from "@mui/material";

import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import EmojiPicker from "emoji-picker-react";

import {
  sendMessage,
  sendDirectMessage,
  uploadFile,
} from "../services/chatservice";

function MessageInput({ room, directChat, onMessageSent }) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [emojiAnchor, setEmojiAnchor] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function handleFileSelect(event) {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    event.target.value = "";
  }

  async function handleSend() {
    if (!room && !directChat) return;

    // Don't send if both are empty
    if (!message.trim() && !selectedFile) return;

    try {
      setSending(true);

      // ---------- TEXT MESSAGE ----------
      if (message.trim() && !selectedFile) {
        const payload = {
          user_id: user.id,
          content: message,

          room_id: room?.id || null,
          direct_chat_id: directChat?.id || null,

          message_type: "text",
        };

        if (room) {
          await sendMessage(room.id, payload);
        } else {
          await sendDirectMessage(directChat.id, payload);
        }
      }

      // ---------- FILE MESSAGE ----------
      if (selectedFile) {
        // Upload the selected file
        const uploadedFile = await uploadFile(selectedFile);

        // Send the file message
        const payload = {
          user_id: user.id,

          room_id: room?.id || null,
          direct_chat_id: directChat?.id || null,

          message_type: "file",

          file_name: selectedFile.name,
          file_url: uploadedFile.url,
          file_size: selectedFile.size,
          mime_type: selectedFile.type,

          content: message.trim() || null,
        };

        if (room) {
          await sendMessage(room.id, payload);
        } else {
          await sendDirectMessage(directChat.id, payload);
        }
      }

      // Clear everything
      setMessage("");
      setSelectedFile(null);

      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleEmojiClick(emojiData) {
    setMessage((prev) => prev + emojiData.emoji);
  }

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          borderRadius: 0,
          borderTop: "1px solid #e5e7eb",
          bgcolor: "white",
        }}
      >
        {selectedFile && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              px: 2,
              py: 1,
              bgcolor: "#f1f5f9",
              borderRadius: 2,
            }}
          >
            <Box>
              <strong>📎 {selectedFile.name}</strong>

              <Box
                sx={{
                  fontSize: 12,
                  color: "#64748b",
                  mt: 0.5,
                }}
              >
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Box>
            </Box>

            <IconButton size="small" onClick={() => setSelectedFile(null)}>
              ✕
            </IconButton>
          </Box>
        )}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Emoji">
            <IconButton
              onClick={(event) => setEmojiAnchor(event.currentTarget)}
            >
              <EmojiEmotionsOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Attach File">
            <>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileSelect}
              />

              <IconButton
                disabled={(!room && !directChat) || sending}
                onClick={() => fileInputRef.current.click()}
              >
                <AttachFileRoundedIcon />
              </IconButton>
            </>
          </Tooltip>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={
              room
                ? "Type your message..."
                : directChat
                  ? "Type your message..."
                  : "Select a room or friend first..."
            }
            value={message}
            disabled={(!room && !directChat) || sending}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 4,
                bgcolor: "#f8fafc",
              },
            }}
          />

          <Tooltip title="Send">
            <span>
              <IconButton
                onClick={handleSend}
                disabled={(!room && !directChat) || sending}
                sx={{
                  bgcolor: "#2563eb",
                  color: "white",
                  width: 48,
                  height: 48,

                  "&:hover": {
                    bgcolor: "#1d4ed8",
                  },

                  "&.Mui-disabled": {
                    bgcolor: "#94a3b8",
                    color: "white",
                  },
                }}
              >
                <SendRoundedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>

      <Popover
        open={Boolean(emojiAnchor)}
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} width={320} height={400} />
      </Popover>
    </>
  );
}

export default MessageInput;
