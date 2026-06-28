import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Avatar,
  Stack,
  Typography,
} from "@mui/material";

import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "../services/chatservice";

function ProfileDialog({ open, onClose }) {
  const fileInputRef = useRef(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    dob: "",
    bio: "",
    profile_picture: "",
    username: "",
    email: "",
  });

  useEffect(() => {
    if (!open) return;

    async function loadProfile() {
      try {
        const data = await getUserProfile(currentUser.id);

        setProfile({
          ...data,
          dob: data.dob || "",
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();
  }, [open]);

  async function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    try {
      const uploaded = await uploadProfilePicture(file);

      setProfile((prev) => ({
        ...prev,
        profile_picture: uploaded.url,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSave() {
    try {
      const response = await updateUserProfile(currentUser.id, profile);

      localStorage.setItem("user", JSON.stringify(response.user));

      alert("Profile updated successfully!");

      window.location.reload();
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
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          fontSize: 24,
        }}
      >
        Edit Profile
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={profile.profile_picture}
            onClick={() => fileInputRef.current.click()}
            sx={{
              width: 110,
              height: 110,
              cursor: "pointer",
              bgcolor: "#2563eb",
              fontSize: 42,
              fontWeight: "bold",
            }}
          >
            {!profile.profile_picture &&
              profile.username?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="body2" color="text.secondary">
            Click the picture to change it
          </Typography>

          <input
            hidden
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <TextField
            fullWidth
            label="Username"
            value={profile.username}
            disabled
          />

          <TextField fullWidth label="Email" value={profile.email} disabled />

          <TextField
            fullWidth
            label="Full Name"
            value={profile.full_name || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                full_name: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            label="Phone Number"
            value={profile.phone || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                phone: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            type="date"
            label="Date of Birth"
            value={profile.dob || ""}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) =>
              setProfile({
                ...profile,
                dob: e.target.value,
              })
            }
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Bio"
            value={profile.bio || ""}
            onChange={(e) =>
              setProfile({
                ...profile,
                bio: e.target.value,
              })
            }
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProfileDialog;
