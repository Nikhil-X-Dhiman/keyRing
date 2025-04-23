import { Router } from "express";

const router = Router();

router.get('/', (req, res)=>{
  console.log(req.body);
  res.sendStatus(200).send('Success');
})

export const authRoutes = router;