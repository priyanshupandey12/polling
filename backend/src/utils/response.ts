import type { Response } from "express";
import type { ApiResponsePayload } from "../types/response.type.js";

class ApiResponse {

    static ok(
        res: Response,
        message: string,
        data: unknown = null
    ) {

        const response: ApiResponsePayload = {
            success: true,
            message,
            data
        };

        return res.status(200).json(response);
    }

    static created(
        res: Response,
        message: string,
        data: unknown = null
    ) {

        const response: ApiResponsePayload = {
            success: true,
            message,
            data
        };

        return res.status(201).json(response);
    }

    static noContent(res: Response) {
        return res.status(204).send();
    }
}

export default ApiResponse;