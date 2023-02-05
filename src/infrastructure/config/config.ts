export const config = () => ({
  ApiServerConfig: {
    API_HOST: process.env.API_HOST,
    API_PORT: process.env.API_PORT,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    API_LOGIN_USERNAME_FIELD: process.env.API_LOGIN_USERNAME_FIELD,
    API_LOGIN_PASSWORD_FIELD: process.env.API_LOGIN_PASSWORD_FIELD,
    API_ACCESS_TOKEN_HEADER: process.env.API_ACCESS_TOKEN_HEADER,
  },
});
