import { model, Schema } from "mongoose";

interface CounterRecord {
  _id: string;
  sequence: number;
}

const counterSchema = new Schema<CounterRecord>({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true, default: 0 }
}, { versionKey: false });

const CounterModel = model<CounterRecord>("Counter", counterSchema);

export async function nextNumericId(name: string): Promise<number> {
  const counter = await CounterModel.findByIdAndUpdate(
    name,
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean().exec();

  if (!counter) {
    throw new Error(`Unable to allocate ${name} ID`);
  }
  return counter.sequence;
}