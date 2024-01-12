<template>
  	<div class="modal-background" v-if="showModal">
      <div class="modal-container">
        <header>
          <h2>Create your own QuackRoom</h2>
        </header>
        <form @submit="createRoom">
          <div class="form_control">
            <label for="room_name" class="regular-label">Room name </label>
            <input id="room_name" v-model="newRoomName" type="text" required/>
          </div>
          <div class="form_control">
            <label for="room_limit" class="regular-label">Room limit </label>
            <input id="room_limit" v-model="newRoomLimit" type="number" required/>
          </div>
          <div class="form_control" v-if="isPrivate">
            <label for="password" class="regular-label">Password </label>
            <input id="password" v-model="newRoomPassword" type="password" />
          </div>
          <div class="form_control">
            <label for="private" class="inline-label">Make private room </label>
            <input id="private" v-model="isPrivate" type="checkbox"/>
          </div>
          <div class="options">
            <button @click="createRoom" type="submit" class="nice-button">Create Room</button>
            <button @click="openRoomCreator" type="button" class="nice-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    <main class="main-container">
      <div class="home_page-container">
      <header>
        <h1>Welcome to the QuackRooms</h1>
      </header>
      <div class="room_list-container">
        <table class="room_list">
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Capacity</th>
              <th>Ducks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in roomList" :key="room.room_id">
              <td>{{ room.room_name }}</td>
              <td>{{ room.limit }}</td>
              <td>{{ room.ducks.length }}</td>
              <td>
                <router-link :to="{ name: 'Room', params: { id: room._id }}">
                  <button>Join Room</button>
                </router-link>
              </td> 
            </tr>
          </tbody>
        </table>
      </div>
        <div class="options">
          <button @click="openRoomCreator" class="nice-button">Create Room</button>
        </div>
      </div>
    </main>
   



  </template>
  
  <script lang="ts">
    import { defineComponent } from 'vue';
    import { Message, QuackRoom } from '../types';
    import router from '../router';
    
    export default defineComponent({
    components: {
    
},
    data() {
      return {
        roomList: [] as QuackRoom[],
        socket: null as WebSocket | null,
        roomStatus: '' as string,
        showModal: false,
        newRoomName: '',
        newRoomPassword: '',
        isPrivate:false,
        newRoomLimit:5
      };
    },
    created() {
      this.handleLobbyWebSocket();
    },
    methods: {
      handleLobbyWebSocket(){
        this.socket = new WebSocket('ws://python-web-seocket-41c1df161133.herokuapp.com/')
        //this.socket = new WebSocket('ws://localhost:8765')

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
            console.log(`Joining Lobby`)
            this.joinLobby();
          };

        this.socket.onmessage = (event) => {
          console.log('Received message:', event.data);
          // Handle incoming WebSocket messages
          const eventData:Message = JSON.parse(event.data)

          switch(eventData.action_type) {
            case 'RoomUpdate':
              const updatedRoomList = eventData.message as QuackRoom[]
              this.roomListUpdate(updatedRoomList)
              break;
            case 'RoomCreated':
              router.push(`/room/${eventData.room_id}`)
              break;
            default:
              console.log(eventData)
          }

        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
            this.roomStatus = "Disconnected"
            // Add your logic when the WebSocket connection is closed
          };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.roomStatus = `Server error: ${error}`
          // Handle WebSocket errors
        };

      },
      joinLobby(){
        const joinRequest: Message = {
          action_type: 'JoinLobby',
          room_id: '',
          sender_id: '',
          sender: '',
          color: '',
          message: ''
          }
        this.socket?.send(JSON.stringify(joinRequest))
      },
      roomListUpdate(updatedRoomList: QuackRoom[]){
        this.roomList = updatedRoomList
      },
      openRoomCreator(){ 
        console.log('Open Window')
        this.showModal = !this.showModal;
      },
      createRoom(e:Event){
        e.preventDefault()

        const newRoom:QuackRoom = {
            limit: this.newRoomLimit,
            room_id: '',
            room_name: this.newRoomName,
            password: this.newRoomPassword,
            ducks: []
          }
        

        const newRoomMessage:Message = {
            action_type: 'CreateRoom',
            room_id: '',
            sender_id: 'Guest',
            sender: 'Guest',
            color: 'none',
            message: newRoom
          }

        console.log('Creating new Room: ')
        console.log(newRoomMessage)
        this.socket?.send(JSON.stringify(newRoomMessage))

      }
    }
  });

    

  </script>


<style>
.duck-pattern {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #f0f0f0;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  border: 1px solid #ddd;
}

th, td {
  text-align: left;
  padding: 8px;
  text-align: center;
}

tr:nth-child(even){background-color: #f2f2f2}

/* Styles for the button */
.nice-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  background-color: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Hover effect */
.nice-button:hover {
  background-color: #2980b9;
}

</style>
  