import mongoose, { Schema, type Document } from "mongoose";

export interface IVolunteer extends Document {
  name: string;
  email: string;
  phone?: string;
  interestedEvent?: string;
  organizer?: string;
  instagram?: string;
  location?: string;
  skills?: string;
  availability?: string;
  status: "pending" | "contacted" | "approved" | "rejected";
  createdAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    interestedEvent: { type: String },
    organizer: { type: String },
    instagram: { type: String },
    location: { type: String },
    skills: { type: String },
    availability: { type: String },
    status: { type: String, enum: ["pending", "contacted", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true },
);

export const Volunteer =
  mongoose.models.Volunteer ?? mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
