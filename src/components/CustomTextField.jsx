import { TextField } from "@mui/material";

function CustomTextField(props) {
  return (
    <TextField
      {...props}
      fullWidth
      margin="normal"
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: "rgba(255,255,255,0.05)",

          "& fieldset": {
            borderColor: "rgba(255,255,255,.2)",
          },

          "&:hover fieldset": {
            borderColor: "#60a5fa",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#3b82f6",
          },
        },

        "& .MuiInputLabel-root": {
          color: "#d1d5db",
        },

        "& .MuiInputBase-input": {
          color: "white",
        },
      }}
    />
  );
}

export default CustomTextField;
