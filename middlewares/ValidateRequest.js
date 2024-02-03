export const validate = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(',');

      if (/postman/ig.test(req.headers['user-agent'])) {
        return res.send({
          status: 409,
          msg: message.replace(/[\\"]/g, ""),
          data: {},
          purpose: "Validation Error"
        })
      } else {
        let pathLocation = req.route.path.split('/').splice(-1)[0];
        
        if (pathLocation == 'register')
          pathLocation = 'signup';
        
        return res.render('index', {
          location: pathLocation,
          loggedIN: (req?.cookies?.access_token) ? true : false,
          errorMessage: message
      });
      }

    }
  }
}