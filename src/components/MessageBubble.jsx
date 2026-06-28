import { Box, Avatar, Typography, Paper, Button } from "@mui/material";

function MessageBubble({
    sender,
    message,
    time,
    isOwnMessage,
    messageType,
    fileName,
    fileUrl,
    fileSize,
    mimeType,
    profilePicture,
}) {
  const isImage = mimeType?.startsWith("image/");
  const isVideo = mimeType?.startsWith("video/");
  const isAudio = mimeType?.startsWith("audio/");
  const isPDF = mimeType === "application/pdf";
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isOwnMessage ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        gap: 1.5,
        mb: 2.5,
      }}
    >
      {!isOwnMessage && (
        <Avatar
          src={profilePicture || ""}
          sx={{
            width: 42,
            height: 42,
            bgcolor: "#2563eb",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {!profilePicture && sender?.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: isOwnMessage ? "flex-end" : "flex-start",
          maxWidth: "70%",
        }}
      >
        <Typography
          sx={{
            mb: 0.5,
            fontSize: 13,
            fontWeight: 700,
            color: "#475569",
          }}
        >
          {isOwnMessage ? "You" : sender}
        </Typography>

        <Paper
          elevation={1}
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 3,
            bgcolor: isOwnMessage ? "#2563eb" : "#ffffff",
            color: isOwnMessage ? "#ffffff" : "#111827",
            border: isOwnMessage ? "none" : "1px solid #e5e7eb",

            width: "fit-content",
            maxWidth: "100%",
            wordBreak: "break-word",
          }}
        >
          <>
            {/* ---------- TEXT ---------- */}

            {messageType === "text" && (
              <Typography
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                }}
              >
                {message}
              </Typography>
            )}

            {/* ---------- IMAGE ---------- */}

            {messageType === "file" && isImage && (
              <Box>
                <img
                  src={fileUrl}
                  alt={fileName}
                  style={{
                    maxWidth: "300px",
                    borderRadius: "12px",
                  }}
                />

                {message && <Typography mt={1}>{message}</Typography>}
              </Box>
            )}

            {/* ---------- VIDEO ---------- */}

            {messageType === "file" && isVideo && (
              <Box>
                <video
                  controls
                  width="300"
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  <source src={fileUrl} type={mimeType} />
                </video>

                {message && <Typography mt={1}>{message}</Typography>}
              </Box>
            )}

            {/* ---------- AUDIO ---------- */}

            {messageType === "file" && isAudio && (
              <Box>
                <audio controls>
                  <source src={fileUrl} type={mimeType} />
                </audio>

                {message && <Typography mt={1}>{message}</Typography>}
              </Box>
            )}

            {/* ---------- PDF ---------- */}

            {messageType === "file" && isPDF && (
              <Box>
                <Typography fontWeight={700} mb={1}>
                  📄 {fileName}
                </Typography>

                <Button
                  href={fileUrl}
                  target="_blank"
                  variant="contained"
                  size="small"
                >
                  Open PDF
                </Button>

                {message && <Typography mt={1}>{message}</Typography>}
              </Box>
            )}

            {/* ---------- OTHER FILES ---------- */}

            {messageType === "file" &&
              !isImage &&
              !isVideo &&
              !isAudio &&
              !isPDF && (
                <Box>
                  <Typography fontWeight={700}>📎 {fileName}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {(fileSize / 1024).toFixed(1)} KB
                  </Typography>

                  <Button
                    href={fileUrl}
                    target="_blank"
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Download
                  </Button>

                  {message && <Typography mt={1}>{message}</Typography>}
                </Box>
              )}
          </>
        </Paper>

        <Typography
          sx={{
            mt: 0.6,
            px: 0.5,
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          {time}
        </Typography>
      </Box>

      {isOwnMessage && (
        <Avatar
          src={profilePicture || ""}
          sx={{
            width: 42,
            height: 42,
            bgcolor: "#2563eb",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {!profilePicture && sender?.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Box>
  );
}

export default MessageBubble;
