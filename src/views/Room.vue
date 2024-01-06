 <template>
  <main class="room-container">
    <aside class="side_pannel-container">
      
    </aside>
    <section class="chat-container">
      <div class="title-container">
      <h1>Room Id: {{ $route.params.id }}</h1>
      <p>User: {{ userId }}</p>
      </div>
    <div class="message_log-container">
      <div v-for="(value, index) in messageArray" :key="index"> 
        <Message 
          :message="value.message"
          :user="value.sender"
          :color="value.color" 
        />
      </div>
    </div>
    <div class="message_sender-container">
        <form class="message_form" action="">
          <input class="message-input" type="text" ref="messageInput"/>
          <button class="message-btn" @click="sendMessage" type="submit">Send Message</button>
        </form>
    </div>
    </section>
   
  </main> 
  </template>
  

<script lang="ts">

import { defineComponent } from 'vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';
import Message from '../components/Message.vue';
  
  export default defineComponent({
    components:{
      Message
    },
    data() {
    return {
      routeId: null as string | string[] | null,
      socket: null as WebSocket | null,
      messageArray: [] as any[],
      userId:crypto.randomUUID()
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
        //this.socket = new WebSocket(`ws://python-web-seocket-41c1df161133.herokuapp.com/`);
        this.socket = new WebSocket('ws://localhost:8765')
        // WebSocket event listeners (you can add your own)
        this.socket.onopen = () => {
          console.log('WebSocket connection established');
          console.log(`Joining Room: ${this.routeId}`)
          this.joinRoom();
        };

        this.socket.onmessage = (event) => {
          console.log('Received message:', event.data);
          // Handle incoming WebSocket messages
          const eventData = JSON.parse(event.data)
          if(eventData.action_type == 'MessageToRoom'){
            this.newMessage(eventData)
          }
        };

        this.socket.onclose = () => {
          console.log('WebSocket connection closed');
          // Add your logic when the WebSocket connection is closed
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          // Handle WebSocket errors
        };
      } else {
        // Close the socket if routeId becomes null
        if (this.socket) {
          this.socket.close();
          this.socket = null;
        }
      }
    },
    joinRoom(){

      const messageInfo = {
        action_type:"JoinRoom",
        room_id:this.routeId,
        sender_id:this.userId,
        sender:"Pedro",
        color:'Yellow',
        message: "New duck in the room"
      }

      this.socket?.send(JSON.stringify(messageInfo))
    },
    sendMessage(e:Event){
      
      e.preventDefault();

      const inputMessage = this.$refs.messageInput as HTMLInputElement
      const messageToSend = inputMessage.value

      const messageInfo = {
        action_type:"MessageToRoom",
        room_id:this.routeId,
        sender_id:this.userId,
        sender:"Pedro",
        color:'Yellow',
        message: messageToSend
      }

      this.socket?.send(JSON.stringify(messageInfo))
      inputMessage.value = ''
    },
    newMessage(messageData:any){
      this.messageArray.push(messageData)
    }
  },
});

</script>