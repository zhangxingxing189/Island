import {useAxios} from "@/api/index";

export function get_user_info(data: { user_id: string }) {
    return useAxios.get("/api/user/detail", {
        params: {
            user_id: data.user_id,
        },
    });
}

export function get_pk_info(data: { room_id: string }) {
    return useAxios.get("/api/pk/room-info", {
        params: {
            room_id: data.room_id,
        },
    });
}

export function pk_submit(data: { room_id: string , question_id: string, answer: any }) {
    console.log(data);
    return useAxios.post("/api/pk/submit", data);
}
