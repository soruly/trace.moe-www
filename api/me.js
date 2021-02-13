import fetch from "node-fetch";

export default async (req, res) => {
  let user_id = null;
  let email = req.ip;
  if (req.query.token) {
    const response = await fetch(`https://api.trace.moe/me?token=${req.query.token}`).then((e) =>
      e.json()
    );
    console.log(response);
    email = response.email;
    user_id = response.id;
  }

  res.json({
    user_id,
    email,
    limit: 10,
    limit_ttl: 60,
    quota: 1000,
    quota_ttl: 86400,
    user_limit: 10,
    user_limit_ttl: 60,
    user_quota: 1000,
    user_quota_ttl: 86400,
  });
};
