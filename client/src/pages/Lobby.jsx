import { useEffect, useState, useContext } from "react";
import LobbyPage from "../components/Lobby/LobbyPage"
import { SocketContext } from "../context/SocketContext";
import { useLocation } from "react-router-dom";

export default function Lobby() {
    const [roomsList, setRoomsList] = useState([]);
    const [topicsList, setTopicsList] = useState([]);
    const [error, setError] = useState(null)
    const socket = useContext(SocketContext);
    const location = useLocation();

    const fetchRooms = async () => {
        try {
            const roomsResponse = await fetch("http://localhost:3000/api/rooms");
            if (!roomsResponse.ok) {
                throw new Error(`Rooms API error: ${roomsResponse.status}`);
            }
            const roomsData = await roomsResponse.json();
            setRoomsList(roomsData);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            setError(error.message);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const roomsResponse = await fetch("http://localhost:3000/api/rooms");
                if (!roomsResponse.ok) {
                    throw new Error(`Rooms API error: ${roomsResponse.status}`);
                }
                const roomsData = await roomsResponse.json();
                setRoomsList(roomsData);
                
                const topicsResponse = await fetch("http://localhost:3000/api/topics");
                if (!topicsResponse.ok) {
                    throw new Error(`Topics API error: ${topicsResponse.status}`);
                }
                const topicsData = await topicsResponse.json();
                setTopicsList(topicsData.debateTopics);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error.message);
            }
        }
        
        fetchData();
    }, [])

    useEffect(() => {
        if (!socket) return;

        const handleRoomUpdated = () => {
            fetchRooms();
        };

        const handleUserDisconnected = () => {
            fetchRooms();
        };

        socket.on("room-updated", handleRoomUpdated);
        socket.on("user-disconnected", handleUserDisconnected);

        return () => {
            socket.off("room-updated", handleRoomUpdated);
            socket.off("user-disconnected", handleUserDisconnected);
        };
    }, [socket])

    useEffect(() => {
        fetchRooms();
    }, [location.pathname]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <LobbyPage roomsList={roomsList} topicsList={topicsList} ></LobbyPage>
    );
};