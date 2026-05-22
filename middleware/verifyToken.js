const { getAuth } = require("../lib/auth");

const verifyToken = async (req, res, next) => {
  try {
    const auth = getAuth();
    
    // Better Auth er JWT session verify korbe
    const session = await auth.api.getSession({
      headers: req.headers // cookie auto jabe
    });

    if (!session) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: Please login first" 
      });
    }

    req.user = session.user; // Route e req.user paba
    next();
  } catch (error) {
    console.log("Token verify error:", error);
    return res.status(403).json({ 
      success: false, 
      message: "Invalid or expired token" 
    });
  }
};

module.exports = verifyToken;