'use strict';
const {signUp,update, confirmCode, signIn, signOut,forgotPassword,confirmForgotPassword,changePassword,show } = require("./services/index");

module.exports.signUp = (event, context, callback) => {
  signUp.signUp(event, context, callback )
};
module.exports.update = (event, context, callback) => {
  update.update(event, context, callback )
}
module.exports.confirmCode = (event, context, callback) => {
  confirmCode.confirmCode(event, context, callback )
};
module.exports.signIn = (event, context, callback) => {
  signIn.signIn(event, context, callback )
}
module.exports.signOut = (event, context, callback) => {
  signOut.signOut(event, context, callback )
}
module.exports.forgotPassword = (event, context, callback) => {
  forgotPassword.forgotPassword(event, context, callback )
}
module.exports.confirmForgotPassword = (event, context, callback) => {
  confirmForgotPassword.confirmForgotPassword(event, context, callback )
}
module.exports.changePassword = (event, context, callback) => {
  changePassword.changePassword(event, context, callback )
}
module.exports.show = (event, context, callback) => {
  show.show(event, context, callback )
}