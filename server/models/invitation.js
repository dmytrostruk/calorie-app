const mongoose = require("mongoose");

const InvitationSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
  },
});

module.exports = mongoose.model("Invitation", InvitationSchema, "invitations");