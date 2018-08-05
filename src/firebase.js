import firebase from 'firebase';
import credentials from 'credentials';

const config = {...credentials};

firebase.initializeApp(config);

export const auth = firebase.auth();

export default firebase;

