// This is just a sample.  This should be in your .gitignore file as it may contain sensitive information (password, secret keys, etc.).
module.exports = {
  "development" : {
    MANDRILL_USERNAME : 'ashdowning@gmail.com',
    MANDRILL_API_KEY : '6nsbN1tfhGSKxhyGFstpOA'
  },
  "production" : {
    // Set these env variables in your hosted environment
    // MANDRILL_USERNAME : process.env.MANDRILL_USERNAME,
    // MANDRILL_API_KEY : process.env.MANDRILL_API_KEY
    MANDRILL_USERNAME : 'ashdowning@gmail.com',
    MANDRILL_API_KEY : '6nsbN1tfhGSKxhyGFstpOA'
  }
}