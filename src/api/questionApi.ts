import {useAxios} from "@/api/index";


export function get_question_bank(data: { question_bank_id: string }) {
    return useAxios.get("/api/question/get-question-bank", {
        params: {
            question_bank_id: data.question_bank_id
        },
    });
}

export function get_question_list(data: { question_bank_id: string }) {
    return useAxios.get("/api/question/get-question-list", {
        params: {
            question_bank_id: data.question_bank_id,
            page: 1,
            page_size: 1000
        },
    });
}

export function get_question(data: { question_id: string }) {
    return useAxios.get("/api/question/get-question", {
        params: {
            question_id: data.question_id,
        },
    });
}

export function get_island(data: { island_id: string }) {

}

export function get_question_bank_list(data: { island_id: string }) {
    return useAxios.get("/api/question/get-question-bank-list", {
        params: {
            island_id : data.island_id,
        }
    })
}

export function create_question(data: {
    type: number,
    title: string,
    content: string,
    options: string[],
    answers: string[],
    question_bank_id: string,
    difficulty: number,
}) {
    return useAxios.post("/api/question/create-question", data);
}