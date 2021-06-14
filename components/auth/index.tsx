import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Text,
    Button,
    TextInput,
} from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import firebase, { auth } from '../../firebase';
const LoginPage = () => {
    const [user, setuser] = useState(auth.currentUser)
    useEffect(() => {
        initAsync();
    }, []);

    const initAsync = async () => {
        await GoogleSignIn.initAsync({
            clientId:
                '500571869292-89jbo4i0ef22o94sk7i52v1n6ookms1f.apps.googleusercontent.com',
        });
        _syncUserWithStateAsync();
    };
    const _syncUserWithStateAsync = async () => {
        const user = await GoogleSignIn.signInSilentlyAsync();
        if (user?.auth?.idToken) {
            const googleCredential = firebase.auth.GoogleAuthProvider.credential(
                user.auth.idToken
            );
            // auth.GoogleAuthProvider.credential(
            //   user.auth.idToken
            // );
            await auth.signInWithCredential(googleCredential);
        }
    };
    const signOutAsync = async () => {
        await GoogleSignIn.signOutAsync();
        auth.signOut();
    };

    const signInAsync = async () => {
        try {
            await GoogleSignIn.askForPlayServicesAsync();
            const { type } = await GoogleSignIn.signInAsync();
            if (type === 'success') {
                _syncUserWithStateAsync();
            }
        } catch ({ message }) {
            alert('login: Error:' + message);
        }
    };
    return <View><Button title="login" onPress={() => { signInAsync() }} /></View>
}
export default LoginPage