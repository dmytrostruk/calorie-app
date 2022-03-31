const Invitation = require("../models/invitation");
const User = require("../models/user");
const emailService = require("../services/email");
const md5 = require("md5");
const uuidv1 = require("uuidv1");

module.exports.sendInvitation = async function (req, res) {
  const email = req.body.email;
  const name = req.body.name;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      res.status(400);
      res.json({ success: false, message: "Current user already exists." });
      return;
    }

    var code = md5(uuidv1());

    var invitation = new Invitation({
      email: email,
      code: code,
      timestamp: new Date(),
      isUsed: false,
    });

    invitation.save();

    var mailOptions = {
      from: "calorie-app.com",
      to: email,
      subject: "Invitation to Calorie App!",
      text: "",
      html: `<p>Hi, ${name}! You were invited to Calorie App! Please note that invitation link will expire in 24 hours.</p><br><a target="_blank" href="http://localhost:4200/invitation?code=${code}">Register</a>`,
    };

    emailService.sendEmail(mailOptions);

    res.status(200);
    res.json({ success: true, message: `Invitation was sent to "${email}".` });
  } catch (err) {
    res.status(500);
    res.json({ success: false, message: "Something went wrong.", error: err });
  }
};

module.exports.validateInvitationCode = async function (req, res) {
  const code = req.query.code;

  try {
    const invitation = await Invitation.findOne({
      $and: [{ code: code }, { isUsed: false }],
    });

    if (invitation) {
      var hoursDifference = (new Date() - invitation.timestamp) / 36e5;

      if (hoursDifference < 24) {
        res.status(200);
        res.json({ success: true, email: invitation.email });
      } else {
        res.status(200);
        res.json({ success: false, message: "Invitation code is obsolete" });
      }
    } else {
      res.status(200);
      res.json({ success: false, message: "Invalid invitation code" });
    }
  } catch (err) {
    res.status(500);
    res.json({ success: false, message: "Something went wrong", error: err });
  }
};
