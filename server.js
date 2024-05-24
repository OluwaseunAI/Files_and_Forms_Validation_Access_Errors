const http = require('node:http');
const fs = require('fs');
const path = require('path');

if (!fs.existsSync("database.json")){
  fs.writeFile("database.json", "", ()=>{})
}


function validateForm(data){
  const {firstName, lastName, email, phone, gender} = data;
  const error = [];

  if (!firstName || !lastName){
    error.push("First name and last name required.");
  }

  if (firstName.length <= 1 || lastName.length <= 1){
    error.push("First name and last name can not be less than one character")
  }

  if(!/^[a-zA-Z]+$/.test(firstName) || !/[^a-zA-Z]+$/.test(lastName)){
    error.push("First name and last name can not contain numbers.")
  }

  if(!/\S+\@\S+\.S+/.test(email)){
    error.push('Email must contain "@". Invalid format.')
  }

  if(phone.length < 10 || phone.length > 10){
    error.push("Phone number must be 10 characteracters")
  }
  if(!gender){
    error.push("Gender is required, cannot be blank.")
  }

  return error;
}
const serverRequestHandler = (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    fs.readFile(path.join(__dirname, 'forms_to_files.html'), (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
        return;
      }
      res.writeHead(200, {"Content-Type": "text/html"});
      res.end(data);
      });
 } else if (req.url === '/submit' && (req.method === 'POST' || req.method === 'GET')){

    let body = [];

    res.on('data', (chunk)=>{
      body.push(chunk);
    }).on('end', ()=>{
          const parsed_body = Buffer.concat(body).toString();
          const data = JSON.parse(parsed_body);
          const error = validateForm(data)

          if (errors.length > 0) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ errors }));
            return;
          }

          fs.readFile('database.json', 'utf8', (err, jsonString) => {
            if (err) {
              console.log("Reading file failed:", err);
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Internal Server Error" }));
              return;
            }
            const validData = jsonString ? JSON.parse(jsonString) : [];
            validData.push(data);
            fs.writeFile('database.json', JSON.stringify(validData), (err) => {
              if (err) {
                console.log("Cannot write to file", err);
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Server Side Error" }));
                return;
              }
              res.writeHead(200, { "Content-Type": "application/json" });

              res.end(JSON.stringify({ success: true }));
            });
          });
      })
  };

}
const server = http.createServer(serverRequestHandler);

server.listen("10000", "0.0.0.0", ()=>{
  console.log("Server running")
  console.log(`4-6`)

})



// const http = require('node:http');
// const fs = require('fs');

// let db_reg = './db_reg';

// if (!fs.existsSync(db_reg)){
//   fs.mkdir(db_reg, ()=>{})
// }

// if (!fs.existsSync("./db_reg/database.json")){
//   fs.writeFile("./db_reg/database.json", "", ()=>{})
// }


// function validateForm(formData){
//   const {firstName, lastName, Email, phone, gender} = formData;
//   const errors_db = [];

//   if (!firstName || !lastName){
//     errors_db.push("First name and last name are required.");
//   }

//   if (firstName.length <= 1 || lastName.length <= 1){
//     errors_db.push("Firat and LAst names can not be less than one charceter")
//   }

//   if(!/^[a-zA-Z]+$/.test(firstName) || !/[^a-zA-Z]+$/.test(lastName)){
//     errors_db.push("First name and last name can not contain numbers.")
//   }

//   if(!/\S+\@\S+\.S+/.test(Email)){
//     errors_db.push('Email must contain "@". Email Address contains invalid format.')
//   }

//   if(phone.length < 11 || phone.length > 11){
//     errors_db.push("Phone number must be 11 characteracters")
//   }
//   if(!gender){
//     errors_db.push("Gender is required, cannot be blank.")
//   }

//   return errors_db;
// }
// const serverRequestHandler = (req, res)=>{
//   let errors_db = [];
//   if(errors_db.length > 0 &&  req.url === '/submit' && req.method === 'POST'){
//     res.writeHead(400, {"Content-Type": "application/json"})
//   res.end(JSON.stringify({errors: errors_db}));
//   }else if (req.url === '/submit' && req.method === 'POST' && (errors_db.length === 0)){
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "POST");
//    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     let body = [];

//     res.on('data', (chunk)=>{
//       body.push(chunk);}).on('end', ()=>{
//           const parsedBody = Buffer.concat(body).toString();
//           const formData = JSON.parse(parsedBody);
//           const errors_db = validateForm(formData)

//           fs.readFile('./db_reg/database.json', 'utf8', (err, jsonString) => {
//             if (err) {
//               console.log("File read failed:", err);
//               res.writeHead(500, { "Content-Type": "application/json" });
//               res.end(JSON.stringify({ error: "Internal Server Error" }));
//               return;
//             }
//             const existingData = jsonString ? JSON.parse(jsonString) : [];
//             existingData.push(formData);
//             fs.writeFile('./db_reg/database.json', JSON.stringify(existingData), (err) => {
//               if (err) {
//                 console.log("File write failed:", err);
//                 res.writeHead(500, { "Content-Type": "application/json" });
//                 res.end(JSON.stringify({ error: "Internal Server Error" }));
//                 return;
//               }
//               res.writeHead(200, { "Content-Type": "application/json" });

//               res.end(JSON.stringify({ success: true }));
//             });
//           });
//       })
//   };

// }
// const server = http.createServer(serverRequestHandler);

// server.listen("8000", "127.0.0.1", ()=>{
//   console.log("I'm listeneing")

// })

