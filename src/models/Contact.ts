import { model, models, Schema, type Document } from "mongoose";

export interface ContactDocument extends Document {
  client: Schema.Types.ObjectId;
  hr: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<ContactDocument>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hr: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ client: 1, hr: 1 }, { unique: true });

const ContactModel = models.Contact || model<ContactDocument>("Contact", ContactSchema);

export default ContactModel;


