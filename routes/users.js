const express = require("express");
const bcrypt = require("bcrypt");

const {auth} = require("../middlewares/auth")
const { validateUser, UserModel, validateLogin, genToken } = require("../models/user_model");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "Users work" })
})



router.get("/checkToken", auth ,async(req,res) => {
  res.json({status:"ok"})
})  

router.get("/myInfo", auth ,async(req,res) => {
  try{
   
    let data = await UserModel.findOne({_id:req.tokenData._id},{password:0})
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json(err)
  }
})  


router.post("/", async (req, res) => {
  let validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = new UserModel(req.body);
    
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    
    user.password = "Hidden ***";
    res.json(user);

  }
  catch (err) {
    
    if (err.code == 11000) {
      return res.status(500).json({ msg: "Email already in system , try login" })
    }
    console.log(err)
    res.status(500).json(err)
  }
})

router.post("/login", async (req, res) => {
  let validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ msg: "Email not found 11" });
    }
   
    let validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) {
      return res.status(401).json({ msg: "Password or email is worng ! 22" });
    }
  
    let newToken = genToken(user._id);
    res.json({ token: newToken });
  }
  catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
})


router.delete("/:idusers", auth, async (req, res) => {
  let idusers = req.params.idusers;
  let data = await UserModel.deleteOne({
      _id: idusers, user_id: req.tokenData._id
  });
  res.json(data)
});


module.exports = router;

