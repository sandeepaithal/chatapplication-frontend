import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Drawer,
} from "@mui/material";

import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CreateRoomDialog from "./CreateRoomDialog";
import ProfileDialog from "./ProfileDialog";
import {
  getRooms,
  getFriends,
  createOrGetDirectChat,
} from "../services/chatservice";
import SearchUserDialog from "./SearchUserDialog";
import FriendRequestsDialog from "./FriendRequestsDialog";

const drawerWidth = 300;

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
  const [searchTerm, setSearchTerm] = useState("");
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [openRequests, setOpenRequests] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  function handleLogout() {
    localStorage.clear();

    window.location.href = "/";
  }

  async function loadRooms() {
    try {
      setLoading(true);

      const data = await getRooms();

      setRooms(data);
      const friendData = await getFriends(user.id);
      setFriends(friendData);

      if (data.length > 0 && !selectedRoom) {
        setSelectedRoom(data[0]);
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
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadRooms();
  }, [sidebarRefresh]);

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        bgcolor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 3,
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            sx={{
              width: 54,
              height: 54,
              bgcolor: "#2563eb",
            }}
          >
            <ChatRoundedIcon />
          </Avatar>

          <Box>
            <Typography fontWeight={700} fontSize={24}>
              ChatSphere
            </Typography>

            <Typography fontSize={13} color="#94a3b8">
              Connect & Collaborate
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Search */}
      <Box px={3}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search rooms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{
                    color: "#94a3b8",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#1e293b",
              borderRadius: 3,
              color: "white",

              "& fieldset": {
                border: "none",
              },
            },

            "& input": {
              color: "white",
            },

            "& input::placeholder": {
              color: "#94a3b8",
              opacity: 1,
            },
          }}
        />
      </Box>
      {/* Create Room */}
      <Box px={3}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpenCreateRoom(true)}
          sx={{
            py: 1.3,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Create Room
        </Button>
      </Box>
      <Box px={3} mt={1}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setOpenSearchUser(true)}
          sx={{
            py: 1.2,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            color: "white",
            borderColor: "#475569",

            "&:hover": {
              borderColor: "#60a5fa",
              bgcolor: "#1e293b",
            },
          }}
        >
          Add Friend
        </Button>
      </Box>
      <Box px={3} mt={1}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => setOpenRequests(true)}
          sx={{
            py: 1.2,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 700,
            color: "white",
            borderColor: "#475569",

            "&:hover": {
              borderColor: "#60a5fa",
              bgcolor: "#1e293b",
            },
          }}
        >
          Friend Requests
        </Button>
      </Box>
      <Divider
        sx={{
          my: 3,
          bgcolor: "#1e293b",
        }}
      />
      {/* Room Title */}
      <Typography
        sx={{
          px: 3,
          pb: 1,
          color: "#94a3b8",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 1.2,
        }}
      >
        ROOMS
      </Typography>
      {/* Rooms List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          pb: 2,

          "&::-webkit-scrollbar": {
            width: 6,
          },

          "&::-webkit-scrollbar-thumb": {
            background: "#334155",
            borderRadius: 10,
          },
        }}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={6}
          >
            <CircularProgress color="inherit" size={30} />
          </Box>
        ) : filteredRooms.length === 0 ? (
          <Box
            sx={{
              mt: 6,
              textAlign: "center",
              color: "#94a3b8",
            }}
          >
            <Typography fontSize={14}>No matching rooms</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredRooms.map((room) => (
              <ListItemButton
                key={room.id}
                selected={selectedRoom?.id === room.id}
                onClick={() => {
                  setSelectedRoom(room);

                  if (isMobile) {
                    handleDrawerToggle();
                  }
                }}
                sx={{
                  borderRadius: 3,
                  mb: 0.7,
                  px: 2,
                  py: 1.3,
                  transition: ".2s",

                  "& .MuiListItemIcon-root": {
                    color: "#60a5fa",
                  },

                  "&:hover": {
                    bgcolor: "#1e293b",
                  },

                  "&.Mui-selected": {
                    bgcolor: "#2563eb",
                    boxShadow: "0 6px 20px rgba(37,99,235,.35)",
                  },

                  "&.Mui-selected:hover": {
                    bgcolor: "#1d4ed8",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 36,
                  }}
                >
                  <TagRoundedIcon />
                </ListItemIcon>

                <ListItemText
                  primary={room.name}
                  primaryTypographyProps={{
                    fontWeight: selectedRoom?.id === room.id ? 600 : 500,
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <Divider
        sx={{
          bgcolor: "#1e293b",
        }}
      />{" "}
      {/* Direct Messages */}
      <Typography
        sx={{
          px: 3,
          py: 1,
          color: "#94a3b8",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: 1.2,
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
              color: "#94a3b8",
              fontSize: 13,
              px: 2,
            }}
          >
            No friends yet
          </Typography>
        ) : (
          <List disablePadding>
            {friends.map((friend) => (
              <ListItemButton
                key={friend.id}
                selected={selectedDirectChat?.id === friend.id}
                onClick={() => handleFriendClick(friend)}
                sx={{
                  borderRadius: 3,
                  mb: 0.7,

                  "&:hover": {
                    bgcolor: "#1e293b",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#22c55e",
                      fontSize: 15,
                    }}
                  >
                    {friend.username.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemIcon>

                <ListItemText
                  primary={friend.username}
                  secondary={friend.email}
                  secondaryTypographyProps={{
                    sx: {
                      color: "#94a3b8",
                      fontSize: 11,
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Box>
      <Divider
        sx={{
          bgcolor: "#1e293b",
        }}
      />
      {/* Logged In User */}
      <Box
        onClick={() => setOpenProfile(true)}
        sx={{
          p: 2,
          bgcolor: "#111827",
          cursor: "pointer",

          "&:hover": {
            bgcolor: "#1f2937",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            pt: 0,
            bgcolor: "#111827",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="error"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              borderRadius: 3,
            }}
          >
            Logout
          </Button>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={user?.profile_picture || ""}
            sx={{
              width: 48,
              height: 48,
              bgcolor: "#2563eb",
              fontWeight: "bold",
              fontSize: 20,
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
            <Typography fontWeight={700} noWrap>
              {user?.username || "Guest"}
            </Typography>

            <Typography
              variant="body2"
              noWrap
              sx={{
                color: "#94a3b8",
                fontSize: 12,
              }}
            >
              {user?.email || "No Email"}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#22c55e",
                }}
              />

              <Typography
                sx={{
                  color: "#22c55e",
                  fontSize: 12,
                }}
              >
                Online
              </Typography>
            </Box>
          </Box>
        </Box>
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
              bgcolor: "#0f172a",
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
        <ProfileDialog
          open={openProfile}
          onClose={() => setOpenProfile(false)}
        />
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
            bgcolor: "#0f172a",
            boxSizing: "border-box",
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
