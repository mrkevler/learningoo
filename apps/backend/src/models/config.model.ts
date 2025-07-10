import mongoose, { Document, Schema } from "mongoose";

export interface IConfig extends Document {
  allowRegistration: boolean;
  allowLogin: boolean;
  defaultCredits: number;
}

const configSchema = new Schema<IConfig>({
  allowRegistration: { type: Boolean, default: true },
  allowLogin: { type: Boolean, default: true },
  defaultCredits: { type: Number, default: 100 },
});

export const ConfigModel =
  mongoose.models.Config || mongoose.model<IConfig>("Config", configSchema);
