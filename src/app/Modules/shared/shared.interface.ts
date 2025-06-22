import { Schema } from "mongoose";

export type TReviews = {
    reviewerId: Schema.Types.ObjectId;
    reciverId: Schema.Types.ObjectId;
    rating: number;
    review: string;
    report?: boolean;
    like?: number;
    disLike?: number;
}

export type TExchange = {
    senderUserId: Schema.Types.ObjectId;
    reciverUserId: Schema.Types.ObjectId;
    email: string;
    selectedEmail: string;
    isAccepted: 'true' | 'false' | 'decline';
    senderService: string;
    reciverService?: string;
    senderUserAccepted: boolean;
    reciverUserAccepted: boolean;
    my_service: string[];
    createdAt: Date;
    updatedAt: Date;
}

export type TExchangeAcceptedData = {
    senderUserId: Schema.Types.ObjectId;
    reciverUserId: Schema.Types.ObjectId;
    email: string;
    selectedEmail: string;
    isAccepted: 'true' | 'false' | 'decline';
    senderService: string;
    reciverService?: string;
    senderUserAccepted: boolean;
    reciverUserAccepted: boolean;
    my_service: string[];
    createdAt: Date;
    updatedAt: Date;
    isAcceptNotificationRead : boolean
}

export type TReviewReport = {
    reviewId: Schema.Types.ObjectId;
    reporterId: Schema.Types.ObjectId;
    document: string;
    reportDetails: string;
    status: "pending" | "reject" | "accept"
}
