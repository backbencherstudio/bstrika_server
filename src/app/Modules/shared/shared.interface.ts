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
    senderService : string;
    reciverService ?: string;
    senderUserAccepted : boolean;
    reciverUserAccepted : boolean;
    my_service:string[]
}

export type TReviewReport = {
    reviewId : Schema.Types.ObjectId;
    reporterId : Schema.Types.ObjectId;
    document : string;
    reportDetails:string;  
}
