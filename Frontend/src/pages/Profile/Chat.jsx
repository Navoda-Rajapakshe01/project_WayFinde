import React, { useEffect, useState } from "react";
import { CometChat } from "@cometchat-pro/chat";
import axios from "axios";

const Chat = () => {
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState("");
  const [cometChatReady, setCometChatReady] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Fallback: Try to login to CometChat if not already logged in
  useEffect(() => {
    CometChat.getLoggedinUser().then(user => {
      if (user) {
        setCometChatReady(true);
      } else {
        // Try to login using localStorage user info
        const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
        const userId = userProfile.id || userProfile.userId;
        const userName = userProfile.fullName || userProfile.username || userProfile.name;
        const authKey = import.meta.env.VITE_COMETCHAT_AUTH_KEY;
        if (userId && userName && authKey) {
          CometChat.login(userId, authKey).then(
            user => {
              setCometChatReady(true);
              setLoginError("");
            },
            async err => {
              // If user does not exist, create and retry login
              if (
                err &&
                err.message &&
                err.message.includes("does not exist")
              ) {
                try {
                  await axios.post("http://localhost:5030/api/cometchat/create-user", {
                    uid: userId,
                    name: userName,
                  });
                  // Try login again
                  CometChat.login(userId, authKey).then(
                    user => {
                      setCometChatReady(true);
                      setLoginError("");
                    },
                    err2 => {
                      setCometChatReady(false);
                      setLoginError("Chat is temporarily unavailable. Please try again later.");
                    }
                  );
                } catch (createErr) {
                  setCometChatReady(false);
                  setLoginError("Chat is temporarily unavailable. Please try again later.");
                }
              } else {
                setCometChatReady(false);
                setLoginError("Chat is temporarily unavailable. Please try again later.");
              }
            }
          );
        } else {
          setLoginError("Chat is temporarily unavailable. Please try again later.");
        }
      }
    }, err => {
      setCometChatReady(false);
      setLoginError("Chat is temporarily unavailable. Please try again later.");
    });
  }, []);

  // Fetch recent conversations
  useEffect(() => {
    if (!cometChatReady) return;
    setUserLoading(true);
    setUserError("");
    const limit = 30;
    const conversationsRequest = new CometChat.ConversationsRequestBuilder()
      .setLimit(limit)
      .build();
    conversationsRequest.fetchNext().then(
      (convList) => {
        // Filter out admin from conversations
        const filtered = convList.filter(conv => {
          const otherUser = getOtherUser(conv);
          if (!otherUser) return false;
          const name = (otherUser.name || otherUser.username || "").toLowerCase();
          return name !== "admin";
        });
        setConversations(filtered);
        setUserLoading(false);
      },
      (err) => {
        setUserError("Failed to fetch conversations");
        setUserLoading(false);
      }
    );
  }, [cometChatReady]);

  // Search users
  useEffect(() => {
    if (!cometChatReady || !search.trim()) {
      setSearchResults([]);
      return;
    }
    setUserLoading(true);
    setUserError("");
    const limit = 10;
    const usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .setSearchKeyword(search)
      .build();
    usersRequest.fetchNext().then(
      (userList) => {
        // Filter out admin from search results
        const filtered = userList.filter(user => {
          const name = (user.name || user.username || "").toLowerCase();
          return name !== "admin";
        });
        setSearchResults(filtered);
        setUserLoading(false);
      },
      (err) => {
        setUserError("Failed to search users");
        setUserLoading(false);
      }
    );
  }, [search, cometChatReady]);

  // Fetch previous messages when receiverId changes
  useEffect(() => {
    if (!receiverId) return;
    setLoading(true);
    setError("");
    const limit = 30;
    const messagesRequest = new CometChat.MessagesRequestBuilder()
      .setUID(receiverId)
      .setLimit(limit)
      .build();
    messagesRequest.fetchPrevious().then(
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
      },
      (err) => {
        setError("Failed to fetch messages");
        setLoading(false);
      }
    );
    // Listen for new messages
    const listenerID = "chat-listener-" + receiverId;
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (msg) => {
          if (msg.sender.uid === receiverId || msg.receiverId === receiverId) {
            setMessages((prev) => [...prev, msg]);
          }
        },
      })
    );
    return () => {
      CometChat.removeMessageListener(listenerID);
    };
  }, [receiverId]);

  // Send a message
  const sendMessage = () => {
    if (!input.trim() || !receiverId) return;
    const textMessage = new CometChat.TextMessage(
      receiverId,
      input,
      CometChat.RECEIVER_TYPE.USER
    );
    CometChat.sendMessage(textMessage).then(
      (msg) => setMessages((prev) => [...prev, msg]),
      (err) => setError("Failed to send message")
    );
    setInput("");
  };

  // Helper to get the other user's info from a conversation object
  const getOtherUser = (conv) => {
    if (conv.conversationType === "user") {
      return conv.conversationWith;
    }
    return null;
  };

  // Helper to format message time
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ display: "flex", maxWidth: 900, margin: "40px auto", border: "1px solid #ccc", borderRadius: 8, minHeight: 500 }}>
      {/* Sidebar: Search + Conversations or Search Results */}
      <div style={{ width: 260, borderRight: "1px solid #eee", padding: 12, background: "#fafafa" }}>
        <h3 style={{ marginTop: 0 }}>Chats</h3>
        {loginError && <div style={{ color: "#b00", fontSize: 14, marginBottom: 8 }}>{loginError}</div>}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 6, borderRadius: 4, border: "1px solid #ccc" }}
        />
        {userLoading ? (
          <div>Loading...</div>
        ) : userError ? (
          <div style={{ color: "red" }}>{userError}</div>
        ) : search.trim() ? (
          searchResults.length === 0 ? (
            <div>No users found.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {searchResults.map((user) => (
                <li
                  key={user.uid}
                  style={{
                    padding: "8px 6px",
                    background: receiverId === user.uid ? "#e0e0e0" : "transparent",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginBottom: 2,
                    display: "flex",
                    alignItems: "center"
                  }}
                  onClick={() => {
                    setReceiverId(user.uid);
                    setReceiverName(user.name || user.uid);
                    setSearch("");
                  }}
                >
                  <img
                    src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.name || user.uid)}
                    alt={user.name}
                    style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                  />
                  <span>{user.name || user.uid}</span>
                </li>
              ))}
            </ul>
          )
        ) : (
          conversations.length === 0 ? (
            <div>No conversations yet.</div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {conversations.map((conv) => {
                const otherUser = getOtherUser(conv);
                if (!otherUser) return null;
                return (
                  <li
                    key={otherUser.uid}
                    style={{
                      padding: "8px 6px",
                      background: receiverId === otherUser.uid ? "#e0e0e0" : "transparent",
                      borderRadius: 4,
                      cursor: "pointer",
                      marginBottom: 2,
                      display: "flex",
                      alignItems: "center"
                    }}
                    onClick={() => {
                      setReceiverId(otherUser.uid);
                      setReceiverName(otherUser.name || otherUser.uid);
                    }}
                  >
                    <img
                      src={otherUser.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(otherUser.name || otherUser.uid)}
                      alt={otherUser.name}
                      style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
                    />
                    <span>{otherUser.name || otherUser.uid}</span>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>
      {/* Chat Window */}
      <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column" }}>
        {receiverId ? (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f5f6fa',
                borderBottom: '1px solid #e0e0e0',
                padding: '12px 20px',
                marginBottom: 8,
                minHeight: 56,
              }}
            >
              <img
                src={
                  search.trim()
                    ? (searchResults.find(u => u.uid === receiverId)?.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(receiverName)}`)
                    : (conversations.find(c => getOtherUser(c)?.uid === receiverId)?.conversationWith.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(receiverName)}`)
                }
                alt={receiverName}
                style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 14, objectFit: 'cover', background: '#e0e0e0' }}
              />
              <div style={{ fontWeight: 700, fontSize: 20, color: '#222', letterSpacing: 0.2 }}>{receiverName}</div>
              {/* Optionally, add online status here */}
            </div>
            <div style={{ height: 300, overflowY: "auto", background: "#f9f9f9", padding: 8, marginBottom: 8, borderRadius: 4 }}>
              {loading ? (
                <div>Loading messages...</div>
              ) : error ? (
                <div style={{ color: "red" }}>{error}</div>
              ) : messages.length === 0 ? (
                <div>No messages yet.</div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} style={{ margin: "8px 0", textAlign: msg.receiverId === receiverId ? "right" : "left" }}>
                    <span style={{ background: "#e0e0e0", borderRadius: 4, padding: "4px 8px", display: 'inline-block' }}>
                      {msg.text}
                      <span style={{ fontSize: 10, color: '#888', marginLeft: 8 }}>
                        {formatTime(msg.sentAt)}
                      </span>
                    </span>
                  </div>
                ))
              )}
            </div>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ flex: 1, marginRight: 8 }}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={!receiverId}
              />
              <button onClick={sendMessage} disabled={!receiverId || !input.trim()}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: "#888", marginTop: 40, textAlign: "center" }}>Select a chat or search for a user to start chatting.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;
