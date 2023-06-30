// render the home page
const express = require("express");
const router = express.Router();

const port = process.env.PORT || 8000;

router.get('/', function(req, res) {
    res.render(`Server is running ${port}`);
}
);

module.exports = router;