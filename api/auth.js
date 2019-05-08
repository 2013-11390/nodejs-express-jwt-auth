const express = require('express');
const router = express.Router();
const models = require("../models");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const secretObj = require("../config/jwt");

router.post('/register', async function(req, res, next) {
  let body = req.body;
  let password = body.password;
  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

  try {
    await models.user.create({
      username: body.username,
      password: hashPassword,
      salt,
    });
    res.json({
      success: true,
    });
  } catch (e) {
    console.log(e);
    res.json({
      success: false,
    });
  }
});

router.post('/login', async function(req, res, next) {
  let body = req.body;

  const user = await models.user.findOne({
    where: {
      username: body.username,
    }
  });
  if (user.password === crypto.createHash("sha512").update(body.password + user.salt).digest("hex")) {
    let accessToken = jwt.sign({
      userId: user.id,
      username: body.username,
    },
    secretObj.secret,
    {
      expiresIn: '1h',
    });
    let refreshToken = jwt.sign({
      userId: user.id,
      username: body.username,
    },
    secretObj.secret,
    {
      expiresIn: '2w',
    });

    res.json({
      success: true,
      accessToken,
      refreshToken,
    });
  } else {
    res.json({
      success: false,
      message: "wrong password",
    })
  }
});

router.get('/refresh', async function(req, res, next) {
  const token = req.headers['x-refresh-token'];
  if(!token) {
    return res.json({
      success: false,
      message: "not logged in",
    });
  }
  try {
    const decoded = await jwt.verify(token, secretObj.secret);
    let accessToken = jwt.sign({
      userId: decoded.userId,
      username: decoded.username,
    },
    secretObj.secret,
    {
      expiresIn: '1h',
    });
    return res.json({
      success: true,
      accessToken,
    })
  } catch (e) {
    return res.json({
      success: false,
      message: "refrest token expired",
    })
  }
})

router.get('/me', async function(req, res, next) {
  const token = req.headers['x-access-token'];
  if(!token) {
    return res.json({
      success: false,
      message: "not logged in",
    });
  }
  try{
    const decoded = await jwt.verify(token, secretObj.secret);
    res.json({
      success: true,
      user: decoded,
    });
  } catch (e) {
    res.json({
      success: false,
      message: "token expired",
    })
  }
});

module.exports = router;