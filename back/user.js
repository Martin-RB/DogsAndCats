module.exports = function(router, b){

    let conn = b.mysql;

    router.get("/:id", function(req, res, next){
        let params = req.params;
        if(params.id === undefined){
            b.l.cerr("Invalid input", params.id);
            inputErrorStatus(res);
            res.send();
            return;
        }
        let id = params.id;
        let sql = `SELECT * FROM users WHERE idUsers = ? LIMIT 1`;
        conn.query(sql, [id], (err, result, fields) =>{
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            var finalResult = [];
            result.forEach(r =>{
                finalResult.push({
                    id: r.idUsers,
                    name: r.name,
                    email: r.email
                });
            });
            res.json(finalResult);
        });
    });

    router.post("/login", function(req, res){
        let body = req.body;

        if(body === undefined || body.username === undefined || body.username === ""
        || body.password === undefined || body.password === ""){
            b.l.cerr("Invalid input", params.id);
            inputErrorStatus(res);
            res.send();
            return;
        }

        let username = body.username;
        let password = b.md5(body.password);
        let sql = `select idUsers from users where name = ? and password = ?`;

        conn.query(sql, [username, password], function(err, result){
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            if(result.length === 0){
                res.statusMessage = "Bad credentials";
                res.status(404);
                res.send();
            }

            res.send();
        });
    })

    router.post("/", function(req, res){
        let body = req.body;
        let sql = "";
        let sql_params = [];
        
        if(body === undefined || body.email === undefined || body.email === ""){
            b.l.cerr("Invalid input", body);
            inputErrorStatus(res);
            res.send();
            return;
        }

        let email = body.email;
        let username = email.substr(0, email.indexOf("@"));
        let password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        password = b.md5(password);

        sql = `insert into users (name, password, email) values(?, ?, ?);`;
        sql_params = [username, password, email];

        conn.query(sql, sql_params, (err, result) =>{
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            // Send email
            sendEmail(email, "Successful register", `<h2>Dogs&Cats</h2>
                    <br><h3>Registration completed</h3>
                    <br><p>Your registration has been completed. We have sent you temporal credentials for you to login:</p>
                    <br><p>Username: ${username}</p>
                    <p>Password: ${password}</p>
                    <br><p>Don't worry. You can change them once logged in on the profile section</p>
                    <br><p>Regards. The Dogs&Pets team :)</p>`, 
                    function(error){
                        b.l.cerr("Error sending email", error);
                        b.processErrorStatus(res, "Error sending email");
                        res.send();
                        return;
                    }, function(info){
                        b.l.clog("Email sent", info);
                        res.status(200).send();
                    });
            
        });
    });


    router.put("/:id", function(req, res){
        let body = req.body;
        let params = req.params;
        let sql = "";
        let sqlFragments = "";
        let sql_params = [];
        if(body === undefined){
            b.l.cerr("Invalid input", body);
            inputErrorStatus(res);
            res.send();
            return;
        }
        
        if(params.id === undefined || params.id === ""){
            b.l.cerr("Invalid input", body);
            inputErrorStatus(res);
            res.send();
            return;
        }
        if(!(body.email === undefined || body.email === "")){
            sqlFragments += "email = ?";
            sql_params.push(body.email);
        }
        if(!(body.username === undefined || body.username === "")){
            if(sqlFragments !== ""){
                sqlFragments += ", ";
            }
            sqlFragments += "name = ?";
            sql_params.push(body.username);
        }
        if(!(body.password === undefined || body.password === "")){
            if(sqlFragments !== ""){
                sqlFragments += ", ";
            }
            sqlFragments += "password = ?";
            sql_params.push(b.md5(body.password));
        }

        if(sql_params.length === 0){
            b.l.cerr("Invalid input", body);
            inputErrorStatus(res);
            res.send();
            return;
        }

        let id = params.id;
        sql_params.push(id);
        sql = `update users set ${sqlFragments} where idUsers = ?`;

        conn.query(sql, sql_params, (err,result) =>{
            if(err){
                b.l.cerr(err, sql);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            res.status(200).send();
        })

    });







    var sendEmail = function(to, subject, html, onErrorCallback, onSuceesCallback){
        let transport = b.mailer.createTransport({
            host: "smtp-mail.outlook.com",
            secureConnection: false,
            port: 587,
            tls: {
                ciphers:'SSLv3'
            },
            auth: {
                user: 'martin.riv.ben@hotmail.com',
                pass: 'martinrb1'
            }
        });
        let mailOptions = {
            from: "Dogs&Cats",
            to: to,
            subject: subject,
            html: html
        };
        transport.sendMail(mailOptions, function(error, info){
            if(error){
                onErrorCallback(error);
            }
            else{
                onSuceesCallback(info);
            }
        })
    };

    return router;
}