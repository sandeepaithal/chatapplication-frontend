import { Box } from "@mui/material";

function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",

        background: `
          linear-gradient(
            135deg,
            #0f172a 0%,
            #1e293b 35%,
            #2563eb 100%
          )
        `,

        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        p: 3,
      }}
    >
      {children}
    </Box>
  );
}

export default AuthLayout;
