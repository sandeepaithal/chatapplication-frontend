import { Box } from "@mui/material";

function Layout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f8fafc",
      }}
    >
      {children}
    </Box>
  );
}

export default Layout;
