import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router";

const useRoomHook = (roomId, displayName) => {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [room, setRoom] = useState(null);
    const [opponentSide, setOpponentSide] = useState(null);
    const [debateStarted, setDebateStarted] = useState(false);
    const [hasJoined, setHasJoined] = useState(false);
    const [messages, setMessages] = useState([]);
    const userId = localStorage.getItem("userId");
    
    useEffect(() => {
        const handleRoomUpdated = ({ room }) => {
            setRoom(room);
        };

        const handleRoomFull = ({ message }) => {
            alert(message);
            navigate("/lobby");
        };

        const handleUserDisconnected = (data) => {
            if (data.room) {
                setRoom(data.room);
            } else {
                setRoom(prevRoom => {
                if (!prevRoom) return prevRoom;
                return {
                    ...prevRoom,
                    messages: [...prevRoom.messages, {
                        displayName: "System",
                        side: null,             
                        text: `${data.user.displayName} has disconnected`,
                        timestamp: Date.now()   
                    }]
                };
            });
            }
        };

        const handleError = (error) => {
            console.error("Socket error:", error);
            alert(error.message || "Failed to join room");
            navigate("/lobby");
        };

        const handleSideSelected = (data) => {
            if (data.socketId !== socket.id) {
                setOpponentSide(data.side);
            }
        }

        const handleDebateStart = (data) => {
            setDebateStarted(true);
        }

        const handleDebateEnded = (data) => {
            alert("The Debate Has Ended");
            navigate("/lobby");
        }

        const handleReceiveMessage = (data) => {
            setMessages(prev => [...prev, data.message])
        }

        socket.on("error", handleError);
        socket.on("room-updated", handleRoomUpdated);
        socket.on("room-full", handleRoomFull);
        socket.on("user-disconnected", handleUserDisconnected);
        socket.on("side-selected", handleSideSelected);
        socket.on("debate-start", handleDebateStart);
        socket.on("debate-ended", handleDebateEnded);
        socket.on("receive-message", handleReceiveMessage);
        
        if (!hasJoined && socket) {
            socket.emit("join-room", { roomId, displayName, userId });
            setHasJoined(true);
        }

        return () => {
            socket.off("room-updated", handleRoomUpdated);
            socket.off("room-full", handleRoomFull);
            socket.off("user-disconnected", handleUserDisconnected);
            socket.off("error", handleError);
            socket.off("side-selected", handleSideSelected);
            socket.off("debate-start", handleDebateStart);
            socket.off("debate-ended", handleDebateEnded);
            socket.off("receive-message", handleReceiveMessage);
        };
    }, [socket, roomId, displayName, navigate, hasJoined]);

    useEffect(() => {
        return () => {
            if (userId) {
                socket.emit("leave-room", { roomId, userId });
            }
        };
    }, [roomId, userId, socket]);

    return { room, opponentSide, debateStarted, socket, messages }
}

export default useRoomHook;