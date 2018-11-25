import firebase from 'firebase';
import credentials from './credentials';

firebase.initializeApp(credentials);

export const auth = firebase.auth();

export default firebase;

