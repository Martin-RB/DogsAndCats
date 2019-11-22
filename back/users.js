module.exports = function(router, b){
    let conn = b.mysql;

    router.get("/people/:search", function(req, res){
        let idActualUser = req.cookies["idUser"];
        if(idActualUser === undefined){
            b.l.cerr("You should be logged in", params.search);
            b.inputErrorStatus(res);
            res.send();
            return;
        }
        let params = req.params;
        if(params === undefined || params.search === undefined || params.search === ""){
            b.l.cerr("Bad input", params.search);
            b.inputErrorStatus(res);
            res.send();
            return;
        }
        
        let sql = `select idUsers, name, f.idUsers2 as friend FROM users LEFT JOIN (SELECT * FROM friends WHERE idUsers2 = ?) f ON idUsers = f.idUsers1 WHERE name like '%?%' AND idUsers <> ?`;
        let sql_params = [idActualUser, params.search, idActualUser];
        conn.query(sql, sql_params, function(err, result){
            if(err){
                b.f.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }


            var finalResult = [];
            result.forEach(el => {
                console.log(el);
                finalResult.push({
                    name: el.name,
                    isFriend: el.friend !== null
                });
            });

            res.json(finalResult);

        })
    });

    router.get("/friends", function(req, res){
        let idActualUser = req.cookies["idUser"];
        if(idActualUser === undefined){
            b.l.cerr("You should be logged in", params.search);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let sql = "SELECT name FROM users u, friends f WHERE f.idUsers1 = ? AND f.idUsers2 = u.idUsers";
        let sql_params = [idActualUser];

        conn.query(sql, sql_params, function(err, result){
            if(err){
                b.f.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            var finalResult = [];
            result.forEach(el => {
                finalResult.push({
                    name: el.name,
                    isFriend: true
                });
            });

            res.json(finalResult);
        });
    });

    // Make friend request
    router.post("/friends/", function(req, res){
        let idActualUser = req.cookies["idUser"];
        if(idActualUser === undefined){
            b.l.cerr("You should be logged in", params.search);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let body = req.body;
        if(body === undefined || body.id === undefined || body.id === ""){
            b.l.cerr("Bad input", body.id);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let sql = "INSERT INTO friend_solicitude (idUsers, idUsers_dest, status) VALUES (?,?,0)";
        let sql_params = [idActualUser, body.id];

        conn.query(sql, sql_params, function(err, result){
            
        })
    });

    // Accept or deny
    // Receives idFriendSol
    router.put("friends/:answer", function(){
        let idActualUser = req.cookies["idUser"];
        if(idActualUser === undefined){
            b.l.cerr("You should be logged in", req.cookies);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let body = req.body;
        if(body === undefined || body.id === undefined || body.id === ""
                || req.params.answer === undefined || req.params.answer === ""){
            b.l.cerr("Bad input", body.id, req.params.answer);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        if(req.params.answer === "yes"){
            conn.query("SELECT idUsers, idUsers_dest FROM friend_solicitude WHERE idFriendSol = ?", [body.id], function(err, result){
                if(err){
                    b.f.cerr(err);
                    b.processErrorStatus(res);
                    res.send();
                    return;
                }

                if(result.length === 0){
                    b.l.cerr("Bad input", body.search);
                    b.inputErrorStatus(res);
                    res.send();
                    return;
                }

                if(idActualUser != result[0].idUsers_dest){
                    b.l.cerr("Bad input", body.search);
                    b.inputErrorStatus(res);
                    res.send();
                    return;
                }

                addFriendship(result[0].idUsers, result[0].idUsers_dest, body.id, res);
            })
        }
        else if (req.params.answer === "no"){
            let sql2 = "Update friend_solicitude set status = 2 WHERE idFriendSol = ?";
            let sql_params2 = [body.id];
            conn.query(sql2, sql_params2, function(err, result){
                if(err){
                    conn.rollback(function(){
                        b.l.cerr(err);
                        res.status(500).send("Couldn't add friend");
                    });
                }
                
                res.send();
            });
        }
        else{
            res.status(500).send();
        }
    })

    var addFriendship = function(idUser1, idUser2, idFriendSol, res){
        let sql = "INSERT INTO friends (?, ?)";
        let sql_params = [idUser1, idUser2];
        conn.beginTransaction(function(err){
            if(err){
                conn.rollback(function(){
                    b.l.cerr(err);
                    res.status(500).send("Couldn't add friend");
                });
            }

            conn.query(sql, sql_params, function(err, result){
                if(err){
                    conn.rollback(function(){
                        b.l.cerr(err);
                        res.status(500).send("Couldn't add friend");
                    });
                }

                conn.query(sql, sql_params.reverse(), function(err){
                    if(err){
                        conn.rollback(function(){
                            b.l.cerr(err);
                            res.status(500).send("Couldn't add friend");
                        });
                    }

                    let sql2 = "Update friend_solicitude set status = 1 WHERE idFriendSol = ?";
                    let sql_params2 = [idFriendSol];
                    conn.query(sql2, sql_params2, function(err, result){
                        if(err){
                            conn.rollback(function(){
                                b.l.cerr(err);
                                res.status(500).send("Couldn't add friend");
                            });
                        }

                        conn.commit(function(err){
                            if(err){
                                conn.rollback(function(){
                                    b.l.cerr(err);
                                    res.status(500).send("Couldn't add friend");
                                });
                            }
    
                            res.send();
                        })
                    });
                })
            })
        })
    }

    return router;
}