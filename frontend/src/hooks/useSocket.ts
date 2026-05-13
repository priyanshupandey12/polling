import { useEffect } from "react";
import { getSocket } from "../lib/socket";

export const useSocket = (
  pollId: string,
  onNewResponse: (data: { totalResponses: number }) => void
) => {
  useEffect(() => {
    if (!pollId) return;

    const socket = getSocket();

    // ✅ Poll room join karo
    socket.emit("join-poll", pollId);
    console.log("Joined poll room:", pollId);

    // ✅ Naya response aaye toh callback
    socket.on("new-response", onNewResponse);

    return () => {
      // ✅ Cleanup
      socket.emit("leave-poll", pollId);
      socket.off("new-response", onNewResponse);
      console.log("Left poll room:", pollId);
    };
  }, [pollId]);
};