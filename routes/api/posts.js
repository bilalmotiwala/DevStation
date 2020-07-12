//Importing Express
const express = require('express');

//Creating the Router
const router = express.Router();

//Creating various Routes

//@Route:           GET api/posts/test
//@Description:     Tests the Posts Route
//@Access Type:     Public
router.get('/test', (req, res) => res.json({message: "Posts API Works!"}));

//Exporting the router for our Server
module.exports = router;