import React, { useEffect, useState, useRef } from "react"
import { TextInput, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Animated, StyleSheet } from "react-native"
import { Input, Button } from "react-native-elements"
import Icon from "react-native-vector-icons/FontAwesome"
import { View, Text } from "../components/Themed"
import { subscribeRoom, createmessage } from "../apollo/hooks/message"
import { } from "@apollo/client"
import { useMutation, useSubscription } from "@apollo/react-hooks"
import { subsciptionclient } from "../apollo"
import useColorScheme from "../hooks/useColorScheme"
import Colors from "../constants/Colors"
type item = {
    message: { data: string, username: string, id: string, time: string }
}
const Chatroom = () => {
    const color = useColorScheme()
    const flatlist = useRef<FlatList>(null)
    const [list, setlist] = useState<item[]>([{ message: { data: "sad", id: "123124", time: 'now', username: 'HelloKitty' } }, { message: { data: "sad nhi hu bro", id: "1213243124", time: 'now', username: 'HelloKitty' } }])
    const sub = useSubscription<item>(subscribeRoom, {
        variables: { roomID: '1234' },
        fetchPolicy: "network-only",
        shouldResubscribe: true,
        onSubscriptionComplete: () => console.log('comp'),
        onSubscriptionData: ({ subscriptionData }: { subscriptionData: { data: item } }) => {
            console.log(subscriptionData.data)
            setlist([...list, subscriptionData.data])
        }
    })
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 65 : 0
    return <KeyboardAvoidingView style={{ flex: 1, }}
        keyboardVerticalOffset={keyboardVerticalOffset}
        behavior={"position"}>
        <View style={{ flexBasis: '90%', flex: 1, paddingTop: 10, display: 'flex', flexDirection: "column", justifyContent: 'flex-end' }}>
            <FlatList data={list}
                ref={flatlist}

                onContentSizeChange={() => { if (flatlist.current) flatlist.current.scrollToEnd({ animated: true }) }}

                style={{ display: "flex" }}
                keyExtractor={(item) => {
                    return `${item.message.id}`
                }}
                contentContainerStyle={{ justifyContent: 'flex-end' }}
                renderItem={(dat) => {
                    if (dat.index != 0 && list[dat.index - 1].message.username === dat.item.message.username) {
                        return <MessageWithoutUserName item={dat.item} />
                    } else {
                        return <MessageWithUserName item={dat.item} />
                    }
                }} />
            {sub.error && <Text>Error...</Text>}
        </View>
        <TakeInput />

    </KeyboardAvoidingView>
}
export default Chatroom;
const TakeInput: React.FunctionComponent<{}> = () => {
    const [addmessage, mdaata] = useMutation(createmessage)
    const input = useRef<TextInput>(null)
    const [message, setmessage] = useState("")
    return (<Animated.View style={{ display: "flex", flexDirection: "row" }}>
        <View style={{ flexBasis: '80%' }}>
            <Input
                ref={input}
                placeholder="message"
                value={message} onChangeText={(e) => {
                    // input.current?.shake()
                    setmessage(e)
                }}

            />
        </View>
        <View style={{ flexBasis: "20%" }}>
            <Button
                style={{ padding: 5 }}
                icon={<Icon
                    name="arrow-right"
                    size={25}
                    color="white"
                />}
                onPress={() => {
                    if (message != '') {
                        addmessage({ variables: { input: { data: message, username: 'Hellowdawdty', roomID: '1234' } } })
                        setmessage('')
                    }
                    else {
                        input.current.shake()

                    }
                }} />
        </View>
    </Animated.View >)
}
const MessageWithUserName: React.FunctionComponent<{ item: item }> = ({ item }) => {
    return <View style={styles.textout}><View style={styles.textcont}><Text style={styles.text}>{item.message.data}</Text></View>
        <View style={styles.usernamecont}>
            <Text style={styles.usernametext}>{item.message.username}</Text></View></View>
}
const MessageWithoutUserName: React.FunctionComponent<{ item: item }> = ({ item }) => {
    return <View style={styles.textout}><View style={{ ...styles.textcont, marginTop: 2 }}><Text style={styles.text}>{item.message.data}</Text></View>
    </View>

}

const styles = StyleSheet.create({
    textout: {
        display: "flex",
        marginLeft: 10
    },
    textcont: {
        flex: 0.5,
        maxWidth: '70%',
        minWidth: "10%",
        textAlign: 'center',
        marginTop: 15,
        borderRadius: 20,
        display: "flex",
        alignSelf: 'flex-start',
        backgroundColor: Colors.dark.highlight
    },
    text: {

        padding: 10,
        paddingTop: 5,
        paddingBottom: 5,

        flex: 0.5,
        width: "auto",
        color: Colors.light.text,
    },
    usernamecont: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: -2,
    },
    usernametext: {}
})