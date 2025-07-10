import { ConfigModel, IConfig } from "../models/config.model";

let cached: IConfig | null = null;

export const getConfig = async (): Promise<IConfig> => {
  if (cached) return cached;
  let cfg = await ConfigModel.findOne();
  if (!cfg) {
    cfg = await ConfigModel.create({});
  }
  cached = cfg;
  return cfg;
};

export const invalidateConfigCache = () => {
  cached = null;
};
