const mysql = require("mysql");
const dbInfo = {
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "podobot",
};

module.exports = {
  init: function () {
    return mysql.createConnection(dbInfo);
  },
  connect: function (conn) {
    conn.connect(function (err) {
      if (err) console.error("mysql 연결 에러 : " + err);
      else console.log("mysql 연결 성공");
    });
  },
};

// const development = {
//   HOST: "localhost",
//   USER: "root",
//   PASSWORD: "roTlqkf11!",
//   database: "podobot_test",
//   port: "3306",
//   multipleStatements: true, // 다중 쿼리 관련 설정
//   pass_saltRounds: 10,
// };

// let app_config = development;
// //   if (process.env.NODE_ENV === 'production') {
// //     app_config = production;
// //   }

// module.exports = app_config;
