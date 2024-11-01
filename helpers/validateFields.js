const {validationResult} = require('express-validator');

module.exports = (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const allErrors = []
        errors.errors.forEach(element => {
            allErrors.push(element.msg)
        });
        return res.status(400).json({msg: allErrors})
    }
    next()
}