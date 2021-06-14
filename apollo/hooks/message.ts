import gql from "graphql-tag";

export const createmessage = gql`
mutation($input:MessageInput){
  message(input:$input){
    id
    username
    data
    time
    roomID
  }
}
`
export const subscribeRoom = gql`
subscription mesageRecieved($roomID:String){
  message(roomID:$roomID){
    id
    data
    time
    username

  }
}
`