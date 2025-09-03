const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    apikey: String(process.env.APPWRITE_API_KEY),
    gptApiKey: String(process.env.GPT_API_KEY),
    geminiAPIKey: String(process.env.GEMINI_API_KEY),
  },
};

export default env;