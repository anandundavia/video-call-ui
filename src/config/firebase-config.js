import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBBLPrpLcm_hCU6n8FnF2eMpKSXFLKRfyg",
	authDomain: "video-call-dev.firebaseapp.com",
	databaseURL: "https://video-call-dev.firebaseio.com",
	projectId: "video-call-dev",
	storageBucket: "video-call-dev.appspot.com",
	messagingSenderId: "735421855481",
	appId: "1:735421855481:web:d4c5f3cd6d8a1aaa"
};

firebase.initializeApp(firebaseConfig);

export default firebase;
