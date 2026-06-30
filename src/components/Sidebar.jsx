import { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import CreateRoomDialog from "./CreateRoomDialog";
import ProfileDialog from "./ProfileDialog";
import SearchUserDialog from "./SearchUserDialog";
import FriendRequestsDialog from "./FriendRequestsDialog";

import {
  createOrGetDirectChat,
  getFriends,
  getRooms,
} from "../services/chatservice";

const drawerWidth = 360;

function Sidebar({
  mobileOpen,
  handleDrawerToggle,
  isMobile,
  selectedRoom,
  setSelectedRoom,
  selectedDirectChat,
  setSelectedDirectChat,
  sidebarRefresh,
}) {
  const [rooms, setRooms] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [openRequests, setOpenRequests] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  async function loadRooms() {
    try {
      setLoading(true);

      const roomData = await getRooms();
      setRooms(roomData);

      const friendData = await getFriends(user.id);
      setFriends(friendData);

      if (roomData.length > 0 && !selectedRoom) {
        setSelectedRoom(roomData[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFriendClick(friend) {
    try {
      const chat = await createOrGetDirectChat(user.id, friend.id);

      setSelectedRoom(null);

      setSelectedDirectChat({
        ...chat,
        friend,
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadRooms();
  }, [sidebarRefresh]);

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0F172A",
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* ================= HEADER ================= */}

      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            sx={{
              width: 62,
              height: 62,
              bgcolor: "#2563EB",
              boxShadow: "0 10px 30px rgba(37,99,235,.45)",
            }}
          >
            <ChatRoundedIcon sx={{ fontSize: 34 }} />
          </Avatar>

          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 28,
                lineHeight: 1,
              }}
            >
              ChatSphere
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                color: "#94A3B8",
                fontSize: 14,
              }}
            >
              Connect • Chat • Collaborate
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ================= SEARCH ================= */}

      <Box px={3} sx={{ flexShrink: 0 }}>
        <TextField
          fullWidth
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{
                    color: "#94A3B8",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#1E293B",
              borderRadius: "16px",
              color: "white",
              height: 52,

              "& fieldset": {
                border: "none",
              },

              "&:hover": {
                bgcolor: "#273449",
              },

              "&.Mui-focused": {
                bgcolor: "#273449",
              },
            },

            "& input::placeholder": {
              color: "#94A3B8",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* ================= ACTION BUTTONS ================= */}

      <Box
        sx={{
          px: 3,
          mt: 3,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          flexShrink: 0,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpenCreateRoom(true)}
          sx={{
            height: 52,
            borderRadius: 3,
            fontWeight: 700,
            fontSize: 15,
            textTransform: "none",
          }}
        >
          Create Room
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setOpenSearchUser(true)}
          sx={{
            height: 50,
            borderRadius: 3,
            textTransform: "none",
            color: "white",
            borderColor: "#334155",

            "&:hover": {
              borderColor: "#60A5FA",
              bgcolor: "#1E293B",
            },
          }}
        >
          Add Friend
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setOpenRequests(true)}
          sx={{
            height: 50,
            borderRadius: 3,
            textTransform: "none",
            color: "white",
            borderColor: "#334155",

            "&:hover": {
              borderColor: "#60A5FA",
              bgcolor: "#1E293B",
            },
          }}
        >
          Friend Requests
        </Button>
      </Box>

      <Divider
        sx={{
          my: 3,
          bgcolor: "#1E293B",
          flexShrink: 0,
        }}
      />

      {/* ================= ROOMS + DIRECT MESSAGES (shared scroll) ================= */}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",

          "&::-webkit-scrollbar": {
            width: 6,
          },

          "&::-webkit-scrollbar-thumb": {
            background: "#334155",
            borderRadius: 20,
          },
        }}
      >
        <Typography
          sx={{
            px: 3,
            pb: 1.5,
            color: "#94A3B8",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          ROOMS
        </Typography>

        <Box
          sx={{
            px: 2,
            pr: 1.5,
          }}
        >
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 6,
            }}
          >
            <CircularProgress color="inherit" size={30} />
          </Box>
        ) : filteredRooms.length === 0 ? (
          <Typography
            sx={{
              color: "#94A3B8",
              textAlign: "center",
              mt: 6,
            }}
          >
            No rooms found
          </Typography>
        ) : (
          <List disablePadding>
            {filteredRooms.map((room) => (
              <ListItemButton
                key={room.id}
                selected={selectedRoom?.id === room.id}
                onClick={() => {
                  setSelectedRoom(room);
                  setSelectedDirectChat(null);

                  if (isMobile) {
                    handleDrawerToggle();
                  }
                }}
                sx={{
                  mb: 1,
                  px: 2,
                  py: 1.5,
                  borderRadius: 4,
                  transition: ".25s",

                  "&:hover": {
                    bgcolor: "#1E293B",
                    transform: "translateX(4px)",
                  },

                  "&.Mui-selected": {
                    bgcolor: "#2563EB",
                    boxShadow: "0 10px 25px rgba(37,99,235,.35)",
                  },

                  "&.Mui-selected:hover": {
                    bgcolor: "#1D4ED8",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: selectedRoom?.id === room.id ? "white" : "#60A5FA",
                  }}
                >
                  <TagRoundedIcon />
                </ListItemIcon>

                <ListItemText
                  primary={room.name}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    fontSize: 15,
                    color: "white",
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
        </Box>

        <Divider
          sx={{
            bgcolor: "#1E293B",
            mt: 1,
          }}
        />

        {/* ================= DIRECT MESSAGES ================= */}

        <Typography
          sx={{
            px: 3,
            py: 2,
            color: "#94A3B8",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
          }}
        >
          DIRECT MESSAGES
        </Typography>

        <Box
          sx={{
            px: 2,
            pb: 2,
          }}
        >
        {friends.length === 0 ? (
          <Typography
            sx={{
              color: "#94A3B8",
              px: 2,
              fontSize: 13,
            }}
          >
            No friends yet
          </Typography>
        ) : (
          <List disablePadding>
            {friends.map((friend) => (
              <ListItemButton
                key={friend.id}
                selected={selectedDirectChat?.friend?.id === friend.id}
                onClick={() => handleFriendClick(friend)}
                sx={{
                  borderRadius: 4,
                  mb: 1,
                  py: 1.2,

                  "&:hover": {
                    bgcolor: "#1E293B",
                  },

                  "&.Mui-selected": {
                    bgcolor: "#1E40AF",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 50,
                  }}
                >
                  <Avatar
                    src={friend.profile_picture || ""}
                    sx={{
                      width: 42,
                      height: 42,
                      bgcolor: "#22C55E",
                      fontWeight: 700,
                    }}
                  >
                    {!friend.profile_picture &&
                      friend.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={friend.username}
                  secondary={friend.email}
                  primaryTypographyProps={{
                    fontWeight: 600,
                    color: "white",
                    fontSize: 14,
                  }}
                  secondaryTypographyProps={{
                    sx: {
                      color: "#94A3B8",
                      fontSize: 11,
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
        </Box>
      </Box>

      <Divider
        sx={{
          bgcolor: "#1E293B",
          flexShrink: 0,
        }}
      />

      {/* ================= PROFILE SECTION ================= */}

      <Box
        sx={{
          p: 2.5,
          bgcolor: "#111827",
          borderTop: "1px solid #1E293B",
          flexShrink: 0,
        }}
      >
        {/* User Card */}
        <Box
          onClick={() => setOpenProfile(true)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderRadius: 4,
            cursor: "pointer",
            transition: ".25s",

            "&:hover": {
              bgcolor: "#1E293B",
            },
          }}
        >
          <Avatar
            src={user?.profile_picture || ""}
            sx={{
              width: 56,
              height: 56,
              bgcolor: "#2563EB",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            {!user?.profile_picture &&
              (user?.username ? user.username.charAt(0).toUpperCase() : "G")}
          </Avatar>

          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {user?.username || "Guest"}
            </Typography>

            <Typography
              noWrap
              sx={{
                color: "#94A3B8",
                fontSize: 12,
              }}
            >
              {user?.email || "No Email"}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mt: 0.8,
              }}
            >
              <Box
                sx={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  bgcolor: "#22C55E",
                }}
              />

              <Typography
                sx={{
                  color: "#22C55E",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Online
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Logout Button */}

        <Button
          fullWidth
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{
            mt: 2.5,
            height: 50,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 15,
            boxShadow: "none",

            "&:hover": {
              boxShadow: "0 10px 20px rgba(239,68,68,.35)",
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: "block",
              md: "none",
            },

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: "none",
              bgcolor: "#0F172A",
              height: "100vh",
              maxHeight: "100vh",
              overflow: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <CreateRoomDialog
          open={openCreateRoom}
          handleClose={() => setOpenCreateRoom(false)}
          onRoomCreated={async (room) => {
            await loadRooms();
            setSelectedRoom(room);
          }}
        />

        <SearchUserDialog
          open={openSearchUser}
          onClose={() => setOpenSearchUser(false)}
        />

        <FriendRequestsDialog
          open={openRequests}
          onClose={() => setOpenRequests(false)}
        />

        <ProfileDialog open={openProfile} onClose={() => setOpenProfile(false)} />
      </>
    );
  }

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: "none",
            md: "block",
          },

          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
            bgcolor: "#0F172A",
            boxSizing: "border-box",
            boxShadow: "8px 0 30px rgba(0,0,0,.18)",
            height: "100vh",
            maxHeight: "100vh",
            overflow: "hidden",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <CreateRoomDialog
        open={openCreateRoom}
        handleClose={() => setOpenCreateRoom(false)}
        onRoomCreated={async (room) => {
          await loadRooms();
          setSelectedRoom(room);
        }}
      />

      <SearchUserDialog
        open={openSearchUser}
        onClose={() => setOpenSearchUser(false)}
      />

      <FriendRequestsDialog
        open={openRequests}
        onClose={() => setOpenRequests(false)}
      />

      <ProfileDialog open={openProfile} onClose={() => setOpenProfile(false)} />
    </>
  );
}

export default Sidebar;