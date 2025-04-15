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

export type TExchange = {
    senderUserId : Schema.Types.ObjectId;
    reciverUserId : Schema.Types.ObjectId;
    email : string;
    isAccepted: 'true' | 'false' | 'decline';
    isExchange : boolean;
    serviceRequested : string
}