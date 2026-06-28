import api from "./api";

/* ---------------- Rooms ---------------- */

export async function getRooms() {
  const response = await api.get("/rooms");
  return response.data;
}

export async function createRoom(data) {
  const response = await api.post("/rooms", data);
  return response.data;
}

/* ---------------- Messages ---------------- */

export async function getRoomMessages(roomId) {
  const response = await api.get(`/rooms/${roomId}/messages`);
  return response.data;
}

export async function sendMessage(roomId, data) {
  let url;

  if (roomId && roomId !== 0) {
    url = `/rooms/${roomId}/messages`;
  } else {
    // Dummy room id because backend route requires one
    url = `/rooms/0/messages`;
  }

  const response = await api.post(url, data);

  return response.data;
}
/* ---------------- Room Actions ---------------- */

export async function renameRoom(roomId, data) {
  const response = await api.put(`/rooms/${roomId}`, data);

  return response.data;
}

export async function deleteRoom(roomId) {
  const response = await api.delete(`/rooms/${roomId}`);

  return response.data;
}

export async function clearRoomMessages(roomId) {
  const response = await api.delete(`/rooms/${roomId}/messages`);

  return response.data;
}
export async function uploadFile(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
/* ---------------- Friends ---------------- */

export async function searchUsers(username) {
  const response = await api.get("/users/search", {
    params: {
      username,
    },
  });

  return response.data;
}

export async function sendFriendRequest(data) {
  const response = await api.post("/friends/request", data);

  return response.data;
}

export async function getFriendRequests(userId) {
  const response = await api.get(`/friends/requests/${userId}`);

  return response.data;
}

export async function acceptFriendRequest(requestId) {
  const response = await api.put(`/friends/${requestId}/accept`);

  return response.data;
}

export async function rejectFriendRequest(requestId) {
  const response = await api.put(`/friends/${requestId}/reject`);

  return response.data;
}

export async function getFriends(userId) {
  const response = await api.get(`/friends/${userId}`);

  return response.data;
}
export async function createOrGetDirectChat(senderId, receiverId) {
  const response = await api.post("/direct-chats", null, {
    params: {
      sender_id: senderId,
      receiver_id: receiverId,
    },
  });

  return response.data;
}
export async function getDirectMessages(chatId) {
  const response = await api.get(`/direct-chats/${chatId}/messages`);
  return response.data;
}
export async function sendDirectMessage(chatId, data) {
  const response = await api.post(
    `/direct-chats/${chatId}/messages`,
    data
  );

  return response.data;
}
/* ---------------- Profile ---------------- */

export async function getUserProfile(userId) {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}

export async function updateUserProfile(userId, data) {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
}

export async function uploadProfilePicture(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}