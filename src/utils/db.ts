import schema from "@/instant.schema";
import { init } from "@instantdb/react-native";

const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID;

if (!APP_ID) {
  throw new Error("Missing app id");
}

const db = init({ appId: APP_ID, schema: schema, devtool: false });

export default db;
