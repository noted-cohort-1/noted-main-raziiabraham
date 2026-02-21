export default {
  providers: [
    {
      domain:
        process.env.CLERK_DOMAIN ||
        "https://daring-lemming-98.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
