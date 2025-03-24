// XSG 部分
import {useAxios} from "@/api/index";

export function get_messages(data: { island_id: string, timestamp: number }) {
    return useAxios.get("/api/chat/get", {
        params: {
            island_id: data.island_id,
            timestamp: data.timestamp,
        },
    });
}

export function send_message(data: { island_id: string, message: string }) {
    return useAxios.post("/api/chat/send", data);
}