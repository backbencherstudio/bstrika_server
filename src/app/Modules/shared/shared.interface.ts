import { Schema } from "mongoose";

export type TReviews = {
    reviewerId : Schema.Types.ObjectId;
    reciverId: Schema.Types.ObjectId;
    rating:number;
    review : string;
    report ?: boolean;
    like ?: number;
    disLike ?: number; 
}