import { useState } from "react";

import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";

import {
  renameRoom,
  deleteRoom,
  clearRoomMessages,
} from "../services/chatservice";

function RoomMenu({
  anchorEl,
  open,
  onClose,
  room,
  onRoomUpdated,
  onRoomDeleted,
  onMessagesCleared,
}) {
  const [renameDialog, setRenameDialog] = useState(false);
  const [roomName, setRoomName] = useState(room?.name || "");

  const handleRename = async () => {
    try {
      const updatedRoom = await renameRoom(room.id, {
        name: roomName,
      });

      //   onRoomUpdated(updatedRoom);
      onRoomUpdated({
        action: "rename",
        room: {
          ...room,
          ...updatedRoom,
        },
      });

      setRenameDialog(false);
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoom(room.id);

      onRoomDeleted(room.id);

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearMessages = async () => {
    try {
      await clearRoomMessages(room.id);

      onMessagesCleared();

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
        <MenuItem
          onClick={() => {
            setRoomName(room?.name || "");
            setRenameDialog(true);
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText>Rename Room</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleClearMessages}>
          <ListItemIcon>
            <CleaningServicesRoundedIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText>Clear Messages</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={handleDelete}
          sx={{
            color: "error.main",
          }}
        >
          <ListItemIcon>
            <DeleteRoundedIcon fontSize="small" color="error" />
          </ListItemIcon>

          <ListItemText>Delete Room</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={renameDialog} onClose={() => setRenameDialog(false)}>
        <DialogTitle>Rename Room</DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            autoFocus
            margin="dense"
            label="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRenameDialog(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleRename}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RoomMenu;
