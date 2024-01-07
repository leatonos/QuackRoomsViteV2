interface Duck {
    duck_id: string;
    duck_name: string;
    color: string;
  }
  
  // QuackRoom type
  interface QuackRoom {
    limit: number;
    room_id: string;
    room_name: string;
    password: string;
    ducks: Duck[];
  }
  
  // Message type
  interface Message {
    action_type: string;
    room_id: string;
    sender_id: string;
    sender: string;
    color: string;
    message: string | QuackRoom;
  }

  export type { Duck, QuackRoom, Message };
