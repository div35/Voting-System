import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./bootstrap.min.css";
import {initializeApp} from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBrgwUuzNcX-KbvmaBMXe9h7zc4ko8cFSg",
  authDomain: "voting-system-c971b.firebaseapp.com",
  projectId: "voting-system-c971b",
  storageBucket: "voting-system-c971b.appspot.com",
  messagingSenderId: "718021897684",
  appId: "1:718021897684:web:801a4055a39b09871afa41",
};

initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
