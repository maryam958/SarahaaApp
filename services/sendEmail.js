import nodeoutlook from 'nodejs-nodemailer-outlook'

export function sendEmail(dest, message) {
  nodeoutlook.sendEmail({
    auth: {
      user: "routeAlex123@outlook.com",
      pass: "routeAlex@123",
    },
    from: "routeAlex123@outlook.com",
    to: dest,
    subject: "Hey you, awesome!",
    html: message,
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i),
  });
}
