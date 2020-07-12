//Importing Express
const express = require('express');

//Creating the Router
const router = express.Router();

//Creating various Routes

//@Route:           GET api/profiles/test
//@Description:     Tests the Profiles Route
//@Access Type:     Public
router.get('/test', (req, res) => res.json({message: "Profiles API Works!"}));

//Exporting the router for our Server
module.exports = router;