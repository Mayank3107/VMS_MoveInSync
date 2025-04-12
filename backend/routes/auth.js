const express = require('express');
const router = express.Router();
const SignUpController = require('../controllers/SignUp');
const LoginController = require('../controllers/Login');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });

router.post('/SignUp', upload.single('Image'), async (req, res) => {
    const { role } = req.body;
    // console.log(role);
    if (role === 'Employee') await SignUpController.EmployeeSignUp(req, res);
    else if (role === 'Visitor') await SignUpController.VisitorSignUp(req, res);
    else if (role === 'Guard') await SignUpController.GuardSignUp(req, res);
    else res.status(400).json({ message: 'Invalid role' });
});

router.post('/Login', async (req, res) => {LoginController.Login(req, res) });

module.exports = router;
