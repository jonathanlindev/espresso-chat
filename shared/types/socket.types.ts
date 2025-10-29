export interface ServerToClientEvents {
  message: (message: any) => void;
  userJoined: (username: string) => void;
  userLeft: (username: string) => void;
}

export interface ClientToServerEvents {
  sendMessage: (content: string) => void;
  joinRoom: (username: string) => void;
}