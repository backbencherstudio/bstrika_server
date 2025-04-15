// review.schema.ts
import { Schema, model } from 'mongoose';
import { TExchange, TReviews } from './shared.interface';

const reviewSchema = new Schema<TReviews>(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Reviewer ID is required'],
      ref: 'User',
    },
    reciverId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Receiver ID is required'],
      ref: 'User',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
    },
    review: {
      type: String,
      required: [true, 'Review Message is required'],
    },
    report: {
      type: Boolean,
      default: false,
    },
    like: {
      type: Number,
      default: 0,
    },
    disLike: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false
  }
);


const exchangeSchema = new Schema<TExchange>(
  {
    senderUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    reciverUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    isAccepted: {
      type: String,
      enum: ['true', 'false', 'decline'],
      default: 'false',
    },
    isExchange: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
    versionKey : false
  }
);


export const Review = model<TReviews>('Review', reviewSchema);

export const Exchange = model<TExchange>('Exchange', exchangeSchema);