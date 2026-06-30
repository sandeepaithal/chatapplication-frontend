import { useState } from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import CloseIcon from "@mui/icons-material/Close";

import RoomMenu from "./RoomMenu";

function ChatHeader({
  room,
  directChat,
  searchText,
  setSearchText,
  onRoomUpdated,
  onRoomDeleted,
  onMessagesCleared,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "#111827",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "#2563eb",
              }}
            >
              <TagRoundedIcon />
            </Avatar>

            <Box>
              <Typography fontWeight={700} fontSize={18}>
                {room
                  ? room.name
                  : directChat
                    ? directChat.friend.username
                    : "Select a Chat"}
              </Typography>

              <Typography variant="body2" color="gray">
                {room
                  ? "Chat Room"
                  : directChat
                    ? "Direct Message"
                    : "Choose a room or friend"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {searchOpen ? (
              <TextField
                autoFocus
                size="small"
                placeholder="Search messages..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                sx={{
                  width: 260,

                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#f8fafc",
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSearchText("");
                          setSearchOpen(false);
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <IconButton disabled={!room} onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>
            )}

            <IconButton disabled={!room} onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {room && (
        <RoomMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          room={room}
          onRoomUpdated={onRoomUpdated}
          onRoomDeleted={onRoomDeleted}
          onMessagesCleared={onMessagesCleared}
        />
      )}
    </>
  );
}

export default ChatHeader;