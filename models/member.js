const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const memberSchema = new Schema({
    nic: {
        type: String,
        required: true,
    },
    firstName: { type: String, required: true },
    middleName: { type: String, default: true },
    lastName: { type: String, default: null },
    contactNo: { type: String, default: null },
    address: { type: String, default: null },
    userType: { type: String, default: null },
});

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;