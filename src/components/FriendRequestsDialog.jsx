import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Typography,
} from "@mui/material";

import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/chatservice";

function FriendRequestsDialog({ open, onClose }) {
  const [requests, setRequests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  async function loadRequests() {
    try {
      const data = await getFriendRequests(user.id);
      setRequests(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (open) {
      loadRequests();
    }
  }, [open]);

  async function handleAccept(requestId) {
    try {
      await acceptFriendRequest(requestId);
      loadRequests();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleReject(requestId) {
    try {
      await rejectFriendRequest(requestId);
      loadRequests();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Friend Requests</DialogTitle>

      <DialogContent>
        {requests.length === 0 ? (
          <Typography align="center">No pending friend requests.</Typography>
        ) : (
          <List>
            {requests.map((request) => (
              <ListItem
                key={request.request_id}
                secondaryAction={
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAccept(request.request_id)}
                    >
                      Accept
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleReject(request.request_id)}
                    >
                      Reject
                    </Button>
                  </Box>
                }
              >
                <ListItemText
                  primary={request.username}
                  secondary={request.email}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FriendRequestsDialog;
