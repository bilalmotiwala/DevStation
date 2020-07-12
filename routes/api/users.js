//Importing Express
const express = require('express');

//Creating the Router
const router = express.Router();

//Creating various Routes

//@Route:           GET api/users/test
//@Description:     Tests the Users Route
//@Access Type:     Public
router.get('/test', (req, res) => res.json({message: "Users API Works!"}));

//Exporting the router for our Server
module.exports = router;