
const checkEmailExistsQueries = 'SELECT email from users where email=$1;';
const passwordReset= 'UPDATE users SET password =$1 where id=$2;';
const checkEmailExistsQueriesByid = 'SELECT * from users where id=$1;';
const userLogin = `SELECT * from users where email=$1;`;
const userSignUp = `INSERT into  users(email,password) values($1, $2);`;





module.exports ={
    userLogin,
    userSignUp,
    checkEmailExistsQueries,
    passwordReset,
    checkEmailExistsQueriesByid
}