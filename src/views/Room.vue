 <template>

    <div class="modal-background" v-if="passwordRequired">
      <div class="modal-container">
        <header>
          <h2>This room requires a password</h2>
        </header>
        <form @submit="tryPassword">
          <div class="form_control">
            <label for="room_password" class="regular-label">Room password</label>
            <input id="room_password" v-model="password" type="password" required/>
          </div>
          <div class="options">
            <button @click="tryPassword" type="submit" class="nice-button">Submit</button>
            <button @click="goBack" type="button" class="nice-button">Go Back</button>
          </div>
        </form>
      </div>
    </div>

  <main class="room-container">
    <aside class="side_pannel-container">
      <div class="duck_profile-container">
        <div class="duck_portrait-container">
          <DuckPortrait  :color="selectedColor" />
        </div>
        <div class="duck-customization">
          <label for="text-input">Duck name:</label>
          <input id="text-input" type="text" v-model="duckName" @blur="updateDuck"/>
          <label for="color-input">Duck Color:</label>
          <input id="color-input" type="color" v-model="selectedColor" @blur="updateDuck"/>
        </div>
      </div>
      <div class="duck_list-container">
        <div v-for="(value, index) in duckList" :key="index"> 
          <div class="duck_list-item">
            <div class="mini_duck_portrait-container">
              <DuckPortrait  :color="value.color" />
            </div>
            <p>{{ value.duck_name }}</p>
          </div>
        </div>
      </div>
      <div class="side_alerts-container">
        <p>{{ roomStatus }}</p>
      </div>
    </aside>
    <section class="chat-container">
    <div class="message_log-container" ref="messageLog">
      <div v-for="(value, index) in messageArray" :key="index"> 
        <MessageBox 
          :message="value.message"
          :user="value.sender"
          :color="value.color" 
        />
      </div>
    </div>
    <div class="message_sender-container">
        <form class="message_form" action="">
          <input class="message-input" type="text" ref="messageInput" />
          <button class="message-btn" @click="sendQuack" type="button">
            <img src="../../public/quack-01.svg" />
          </button>
          <button class="message-btn" @click="sendMessage" type="submit">
            <img src="../../public/message.svg" />
          </button>
        </form>
    </div>
    </section> 
  </main> 
  </template>
  
<script lang="ts">

import { Howl } from 'howler';
import { defineComponent } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import MessageBox from '../components/Message.vue';
import DuckPortrait from '../components/DuckPortrait.vue';
import { Duck, QuackRoom, Message } from '../types/'
import router from '../router';

  
  export default defineComponent({
    components:{
      MessageBox,
      DuckPortrait
    },
    data() {
        return {
          routeId: null as string | string[] | null,
          socket: null as WebSocket | null,
          messageArray: [] as any[],
          userId:crypto.randomUUID(),
          duckName:"Duck" as string,
          selectedColor: '#e9ff70' as string,
          duckList:[] as Duck[],
          roomStatus: "Connecting to server..." as string,
          passwordRequired: false as boolean,
          password: '' as string
        };
    },
    created() {
      // Accessing route parameter in the script
      const route = this.$route as RouteLocationNormalizedLoaded;
      this.routeId = route.params.id || null;
      this.handleWebSocket();
    },
    watch: {
      '$route.params.id'(newId: string | null) {
        this.routeId = newId;
      },
    },
    methods: {
      handleWebSocket() {
        if (this.routeId !== null) { 
          // Close previous socket connection if exists
          if (this.socket) {
            this.socket.close();
          }

          // Establish a new WebSocket connection
          this.socket = new WebSocket(`wss://python-web-seocket-41c1df161133.herokuapp.com/`);
          //this.socket = new WebSocket('ws://localhost:8765')
          // WebSocket event listeners
          this.socket.onopen = () => {
            console.log('WebSocket connection established');
            console.log(`Joining Room: ${this.routeId}`)
            this.joinRoom();
          };

          this.socket.onmessage = (event) => {
            console.log('Received message:', event.data);
            // Handle incoming WebSocket messages
            const eventData:Message = JSON.parse(event.data)
            
            

            switch(eventData.action_type) {
              case 'MessageToRoom':
                this.newMessage(eventData)
                break;
              case 'RoomUpdate':
                const updatedRoom = eventData.message as QuackRoom
                this.roomUpdate(updatedRoom)
                this.passwordRequired = false
                break;
              case 'RoomFull':
                console.log("Room Full");
                this.roomStatus = "Room Full"
                router.push('/')
                break;
              case 'PasswordRequired':
                console.log("Room Requires password");
                this.roomStatus = "Password Required"
                this.passwordRequired = true
                break;
              case 'WrongPassword':
                console.log("Wrong Password try again");
                this.roomStatus = "Password Required"
                break;
              case 'QuackToRoom':
                this.newMessage(eventData)
                this.quackSound()
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
        } else {
          // Close the socket if routeId becomes null
          if (this.socket) {
            this.socket.close();
            this.socket = null;
            this.roomStatus = 'Room id invalid'
          }
        }
      },
      joinRoom(){

        this.roomStatus = 'Joining Room...'

        const messageInfo = {
          action_type:"JoinRoom",
          room_id:this.routeId,
          sender_id:this.userId,
          sender:this.duckName,
          color:this.selectedColor,
          message: "New duck trying to enter this room"
        }

        this.socket?.send(JSON.stringify(messageInfo))
      },
      tryPassword(e:Event){

        e.preventDefault()

        const passwordMessage:Message = {
            action_type: 'RoomPasswordAttempt',
            room_id: this.routeId as string,
            sender_id: this.userId,
            sender: this.duckName,
            color: this.selectedColor,
            message: this.password
          }

        this.socket?.send(JSON.stringify(passwordMessage))
      },
      sendMessage(e:Event){
        
        e.preventDefault();

        const inputMessage = this.$refs.messageInput as HTMLInputElement
        const messageToSend = inputMessage.value

        const messageInfo = {
          action_type:"MessageToRoom",
          room_id:this.routeId,
          sender_id:this.userId,
          sender:this.duckName,
          color:this.selectedColor,
          message: messageToSend
        }

        this.socket?.send(JSON.stringify(messageInfo))
        inputMessage.value = ''
      },
      sendQuack(){
        const messageInfo = {
          action_type:"QuackToRoom",
          room_id:this.routeId,
          sender_id:this.userId,
          sender:this.duckName,
          color:this.selectedColor,
          message: 'Quack!'
        }

        this.socket?.send(JSON.stringify(messageInfo))
      },
      newMessage(messageData:any){
        this.messageArray.push(messageData)
        const messageContainer = this.$refs.messageLog as HTMLDivElement
        this.$nextTick(() => {
        // Set scrollTop to the maximum scroll height after the next DOM update
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });

      },
      quackSound() {
        const sound = new Howl({
          src: ['/quack-sound-1.mp3'] // Replace with the path to your sound file
        });
        
        sound.play(); // Play the sound
      },
      updateDuck(){
        //Send this information to mongoDB

        const messageInfo = {
          action_type:"UpdateDuck",
          room_id:this.routeId,
          sender_id:this.userId,
          sender:this.duckName,
          color:this.selectedColor,
          message: `Duck ${this.userId} is updating...`
        }
        
        this.socket?.send(JSON.stringify(messageInfo))

      },
      roomUpdate(room:QuackRoom){
        this.roomStatus = "Updating Room information..."
        this.roomStatus = "Connected"
        this.duckList = room.ducks
        console.log('Room updated')
        console.log(room.ducks)
      },
      goBack(){
        router.push('/')
      }
  },
});

</script>