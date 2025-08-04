import env from "@/app/env";

import { Client, Account, Avatars, Databases, Storage } from "appwrite";

const client = new Client()
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId);

const databases = new Databases(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const account = new Account(client);

export {client, databases, account, avatars, storage};