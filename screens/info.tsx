import React from "react"
import { KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native"
import { View } from "../components/Themed"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { Input, Button } from "react-native-elements"
import { StackScreenProps } from "@react-navigation/stack"
import { useState } from "react"
import { useEffect } from "react"
import useColorScheme from "../hooks/useColorScheme"
const Info: React.FunctionComponent<StackScreenProps<any>> = ({ navigation }) => {
    const user = useAsyncStorage('username')
    const room = useAsyncStorage('room')
    const [username, setusername] = useState('')
    const [roomcode, setroomcode] = useState('')
    const scheme = useColorScheme()
    useEffect(() => {
        user.getItem((err, res) => {
            if (!err && res) {
                setusername(res)
            }
        })
        room.getItem((err, res) => {
            if (!err && res) {
                setroomcode(res)
            }
        })
    }, [])
    return <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        <View style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

            <Input placeholder="username" value={username} onChangeText={setusername} style={{ color: scheme === 'dark' ? 'white' : 'black' }} />
            <Input placeholder="roomcode" value={roomcode} onChangeText={setroomcode} style={{ color: scheme === 'dark' ? 'white' : 'black' }} />
            <Button title="go to room" onPress={() => {
                user.setItem(username)
                room.setItem(roomcode)
                navigation.navigate('Chatroom')
            }} />
        </View>
    </KeyboardAvoidingView>
}
export default Info