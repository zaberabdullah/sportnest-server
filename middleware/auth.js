const { getAuth } = require("../lib/auth");
const { fromNodeHeaders } = require("better-auth/node");

const requireAuth = async (req, res, next) => {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers), 
    });
    
    if (!session) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    
    req.user = session.user; 
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = { requireAuth };