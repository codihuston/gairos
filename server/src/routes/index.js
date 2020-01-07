import express from "express";
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  console.log("session", req.session);
  res.render("index", { title: "Express" });
});

router.get("/login", function(req, res, next) {
  console.log("session", req.session);
  res.render("index", { title: "Please log back in" });
});

export { router };
