import { Button } from "@mui/material";

function CustomButton({ children, ...props }) {
  return (
    <Button
      {...props}
      fullWidth
      variant="contained"
      size="large"
      sx={{
        mt: 3,

        py: 1.5,

        borderRadius: 3,

        textTransform: "none",

        fontSize: 16,

        fontWeight: 700,

        background: "linear-gradient(90deg,#2563eb,#3b82f6)",

        "&:hover": {
          background: "linear-gradient(90deg,#1d4ed8,#2563eb)",
        },
      }}
    >
      {children}
    </Button>
  );
}

export default CustomButton;
