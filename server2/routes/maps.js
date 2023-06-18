const express = require("express");
// Router function of express
const router = express.Router();

const { provinces } = require("../controllers/maps");

router.get("/italy-provinces", provinces);

module.exports = router;
