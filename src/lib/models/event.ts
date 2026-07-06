import mongoose, { Schema, type Document } from "mongoose";

export type EventStatus = "activo" | "cerrado" | "pendiente" | "pospuesto";

export interface IEventData {
  id: string;
  title: string;
  organizer?: string;
  image?: string;
  date: Date;
  time?: string;
  description?: string;
  location?: string;
  flyer?: string;
  logo?: string;
  instagram?: string;
  googleMaps?: string;
  phone?: string;
  status?: EventStatus;
}

export interface IEvent extends Document, IEventData {}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    organizer: { type: String },
    image: { type: String },
    date: { type: Date, required: true, index: true },
    time: { type: String },
    description: { type: String },
    location: { type: String },
    flyer: { type: String },
    logo: { type: String },
    instagram: { type: String },
    googleMaps: { type: String },
    phone: { type: String },
    status: { type: String, enum: ["activo", "cerrado", "pendiente", "pospuesto"], default: "activo" },
  },
  { timestamps: true },
);

export const Event = mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);
