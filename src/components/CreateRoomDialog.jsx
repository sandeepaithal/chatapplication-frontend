import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";

import { createRoom } from "../services/chatservice";

function CreateRoomDialog({ open, handleClose, onRoomCreated }) {
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setSeverity("error");
      setSnackbarMessage("Room name is required");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);

      const room = await createRoom({
        name: roomName,
      });

      setSeverity("success");
      setSnackbarMessage("Room created successfully");
      setSnackbarOpen(true);

      setRoomName("");

      if (onRoomCreated) {
        onRoomCreated(room);
      }

      handleClose();
    } catch (error) {
      console.error(error);

      const message = error.response?.data?.message || "Failed to create room";

      setSeverity("error");
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>Create Room</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Room Name"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateRoom}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default CreateRoomDialog;
