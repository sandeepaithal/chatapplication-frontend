import { useState } from "react";

import {
  Card,
  CardContent,
  Link,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import Authlayout from "../components/Authlayout";
import Logo from "../components/Logo";
import CustomTextField from "../components/CustomTextField";
import CustomButton from "../components/CustomButton";

import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setSeverity("error");
      setSnackbarMessage("Please fill all fields.");
      setOpenSnackbar(true);
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/register", {
        username,
        email,
        password,
      });

      console.log(response.data);

      setSeverity("success");
      setSnackbarMessage("Registration Successful!");

      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error(error);

      let message = "Registration failed.";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      setSeverity("error");
      setSnackbarMessage(message);

      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Authlayout>
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 5,
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255,255,255,.15)",
          boxShadow: "0 20px 50px rgba(0,0,0,.35)",
          color: "white",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 3,
              md: 5,
            },
          }}
        >
          <Logo subtitle="Create your account and start chatting." />

          <CustomTextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <CustomTextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <CustomTextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <CustomButton onClick={handleRegister} disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </CustomButton>

          <Typography
            align="center"
            sx={{
              mt: 4,
              color: "rgba(255,255,255,.8)",
            }}
          >
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              sx={{
                color: "#60a5fa",
                fontWeight: "bold",
              }}
            >
              Sign In
            </Link>
          </Typography>
        </CardContent>
      </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Authlayout>
  );
}

export default RegisterPage;
