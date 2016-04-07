module.exports = function (req, res, next) {
  var userName = req.body.user_name;

  Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  }

  var weekNumber = (new Date()).getWeek();
  var botPayload = {
    text : 'Hello, ' + userName + '! This is week ' + weekNumber
  };

  // avoid infinite loop
  if (userName !== 'slackbot') {
    return res.status(200).json(botPayload);
  } else {
    return res.status(200).end();
  }
}
