# install
1. npm install

# run
1. node app.js

# description
1. implemented register, login, with express, jwt, mysql

# api endpoint
/auth/register
req: {
  "username",
  "password",
}
res: {
  "success",
}

/auth/login
req: {
  "username",
  "password",
}
res: {
  "success",
  "accessToken",
  "refreshToken",
}

/auth/me
include header['x-access-token']
req: {
}
res: {
  "success",
  "user": {
    "userId",
    "username",
  },
}

/refresh
include header['x-refresh-token']
req: {
}
res: {
  "success",
  "accessToken",
}