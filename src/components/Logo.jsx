import { Avatar, Box, Typography } from "@mui/material";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

function Logo({ title = "ChatSphere", subtitle }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
      <Avatar
        sx={{
          bgcolor: "#2563eb",
          width: 72,
          height: 72,
          mb: 2,
        }}
      >
        <ChatRoundedIcon fontSize="large" />
      </Avatar>

      <Typography variant="h4" fontWeight="bold" color="white">
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            color: "rgba(255,255,255,.75)",
            mt: 1,
            textAlign: "center",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

export default Logo;
