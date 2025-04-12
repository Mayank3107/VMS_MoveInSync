const jwt = require('jsonwebtoken');
const Visitor = require('../models/Visitor');
const Employee = require('../models/Employee');
const Guard = require('../models/Guard');
const Admin = require('../models/Admin');

//Token verification
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization header missing or malformed' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.data = decoded;
    
    let user = null;
    
    switch (decoded.role) {
      case 'Visitor':
        user = await Visitor.findById(decoded.id);
        break;
        case 'Employee':
          user = await Employee.findById(decoded.id);
          break;
          case 'Guard':
            user = await Guard.findById(decoded.id);
            break;
            case 'Admin':
              user = await Admin.findById(decoded.id);
              break;
              default:
                return res.status(403).json({ message: 'Invalid role in token' });
              }
              if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
              req.user = user;
//going to next stage
    next();
  } catch (err) {
//error handling
    console.error('Auth error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
