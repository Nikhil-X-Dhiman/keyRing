import { Router } from "express";
import { addPasswdData, getPasswdData } from "../services/data.services.js";

const router = Router();

router.get("/api/passwd", async (req, res) => {
  if (!req.user) {
    return res.send("Not Authenticated");
  }
  console.log("hit");

  const result = await getPasswdData();
  console.log(result);

  res.send("all data");
});

router.post("/api/passwd", async (req, res) => {
  if (!req.user) {
    return res.send("Not Authenticated");
  }
  console.log(req.body);
  let userID = req.user.id;
  const { serviceName, username, password, website, uri } = req.body;
  const result = await addPasswdData({
    serviceName,
    username,
    password,
    website,
    uri,
    userID,
  });
  console.log(result);
  return res.send("inserted");
});

router.post("/api/alt/passwd", async (req, res) => {
  if (!req.user) return res.send("Not Authenticated");
  await altPasswdRecord({
    serviceName,
    username,
    password,
    website,
    uri,
    userID,
  });
});

router.post("/api/del/passwd", async (req, res) => {
  if (!req.user) return res.send("Not Authenticated");
  await delPasswdRecord(id, userID);
});

export const appRoutes = router;
