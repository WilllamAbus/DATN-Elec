const express = require('express');
const router = express.Router();

const recommendations = require('../../../controler/client/recommendation/recomController');

const middlewareController = require("../../../middleware/auth");

router.get('/getByID', middlewareController.verifyToken, recommendations.getRecommendationsByUserId);

module.exports = router;