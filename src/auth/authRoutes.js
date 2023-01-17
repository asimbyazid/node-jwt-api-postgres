const {Router} = require('express');
const controller = require('./authController')
const router = Router();


router.post("/login",controller.authLoginController);
router.post("/signup",controller.authSignUpController);
router.put("/",controller.authpassResetController);


module.exports = router;