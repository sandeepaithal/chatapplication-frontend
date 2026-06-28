import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
} from "@mui/material";

import {
  searchUsers,
  sendFriendRequest,
} from "../services/chatservice";

function SearchUserDialog({ open, onClose }) {
  const [username, setUsername] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function handleSearch() {
    if (!username.trim()) return;

    try {
      setResults([]);

      const data = await searchUsers(username);

      const filtered = data.filter((u) => u.id !== user.id);

      setResults(filtered);
      setSearched(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAddFriend(receiverId) {
    try {
      await sendFriendRequest({
        sender_id: user.id,
        receiver_id: receiverId,
      });

      alert("Friend request sent!");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Search Users</DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setSearched(false);
            setResults([]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          sx={{
            mt: 1,
            mb: 2,
          }}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
        >
          Search
        </Button>

        <List sx={{ mt: 2 }}>
          {results.map((user) => (
            <ListItem
              key={user.id}
              secondaryAction={
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAddFriend(user.id)}
                >
                  Add Friend
                </Button>
              }
            >
              <ListItemText
                primary={user.username}
                secondary={user.email}
              />
            </ListItem>
          ))}

          {searched && results.length === 0 && (
            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              No users found.
            </Typography>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default SearchUserDialog;