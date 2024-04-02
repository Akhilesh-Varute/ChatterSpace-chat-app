import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore, getDoc, onSnapshot, collection, addDoc, orderBy, query, serverTimestamp } from "firebase/firestore";
import { auth, app } from "../firebase.js";
import { useState, useEffect } from "react";
import "./App.css"; // Import CSS file

const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data()
      })).reverse()); // Reverse the order of messages to display latest message at the bottom
    });
    return () => unsubscribe(); // Clean up function that will run when component is unmounted
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const sendMessage = async () => {
    await addDoc(collection(db, "messages"), {
      uid: user.uid,
      photoURL: user.photoURL,
      displayName: user.displayName,
      text: newMessage,
      timestamp: serverTimestamp()
    });
    setNewMessage("");
  };

  const handlegoogleLogin = async () => {
    const auth = getAuth(); // Get the auth object
    const provider = new GoogleAuthProvider(); // Instantiate the GoogleAuthProvider

    try {
      const result = await signInWithPopup(auth, provider); // signInWithPopup function
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <h1 className="header">ChatterSpace</h1>

      {!user ? (
        <button className="loginBtn" onClick={handlegoogleLogin}>Login with Google</button>
      ) : (
        <div className="chatContainer">
          <div className="userInfo">Logged In as {user.displayName}</div>
          <div className="chatMessages">
            {messages.map(msg => (
              <div key={msg.id} className={msg.data.uid === user.uid ? "sentMessage" : "receivedMessage"}>
                {msg.data.uid !== user.uid && (
                  <img className="userAvatar" src={msg.data.photoURL} alt="user" />
                )}
                <div className="messageContainer">
                  <div className="messageText">{msg.data.text}</div>
                </div>
                {msg.data.uid === user.uid && (
                  <img className="userAvatar" src={user.photoURL} alt="user" />
                )}
              </div>
            ))}
          </div>
          <div className="inputContainer">
            <input
              className="messageInput"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              type='text' placeholder='Enter your message...' />
            <button className="sendBtn" onClick={sendMessage}>Send</button> <hr />
            <hr /><hr /><hr />
            <button className="logoutBtn" onClick={() => auth.signOut()}>LogOut</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
