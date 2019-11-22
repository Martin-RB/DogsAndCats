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
        
        let sql = `select idUsers, name, f.idUsers2 as friend FROM users LEFT JOIN (SELECT * FROM friends WHERE idUsers2 = ?) f ON idUsers = f.idUsers1 WHERE name like ? AND idUsers <> ?`;
        let sql_params = [idActualUser, `%${params.search}%`, idActualUser];
        conn.query(sql, sql_params, function(err, result){
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }


            var finalResult = [];
            result.forEach(el => {
                console.log(el);
                finalResult.push({
                    name: el.name,
                    isFriend: el.friend !== null,
                    idUser: el.idUsers
                });
            });

            res.json(finalResult);
        });
    });

    router.get("/friends", function(req, res){
        let idActualUser = req.cookies["idUser"];
        if(idActualUser === undefined){
            b.l.cerr("You should be logged in", req.cookies);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let sql = "SELECT idUsers, name FROM users u, friends f WHERE f.idUsers1 = ? AND f.idUsers2 = u.idUsers";
        let sql_params = [idActualUser];

        conn.query(sql, sql_params, function(err, result){
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            var finalResult = [];
            result.forEach(el => {
                finalResult.push({
                    name: el.name,
                    isFriend: true,
                    idUser: el.idUsers
                });
            });

            res.json(finalResult);
        });
    });

    router.get("/notifications", function(req, res){
        let idActualUser = req.cookies["idUser"];
        if(idActualUser === undefined){
            b.l.cerr("You should be logged in", params.search);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let sql = "SELECT idFriendSol, u.idUsers, idUsers_dest, status, u.name as name FROM friend_solicitude f, users u WHERE (f.idUsers = ? AND status <> 0 AND idUsers_dest = u.idUsers) OR (f.idUsers_dest = ? AND status = 0 AND f.idUsers = u.idUsers)";
        let sql_params = [idActualUser, idActualUser];
        conn.query(sql, sql_params, function(err, result){
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            let newResult = [];
            result.reverse().forEach(el => {

                if(el.status != 0){
                    newResult.push({
                        isRequest: false,
                        accepted: el.status == 1,
                        id: el.idFriendSol,
                        msg: `${el.name} has ${(el.status == 1)? "accepted": "denied"} your friend request! ${(el.status == 1)? ":D": "D:"}`
                    });
                }
                else{
                    newResult.push({
                        isRequest: true,
                        id: el.idFriendSol,
                        msg: `${el.name} sent you a friend request! :O`
                    });
                }

            });

            res.json(newResult);
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
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            res.send();
        })
    });

    // Accept or deny
    // Receives idFriendSol
    router.put("/friends/:answer", function(req, res){
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
                    b.l.cerr(err);
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
            return;
        }
    });

    router.delete("/friends", function(req, res){
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

        let idUserDest = body.id;

        let sql = "DELETE FROM friends WHERE (idUsers1 = ? AND idUsers2 = ?) OR (idUsers2 = ? AND idUsers1 = ?)";
        let sql_params = [idActualUser, idUserDest, idActualUser, idUserDest];

        conn.query(sql, sql_params, function(err, result){
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            res.send();
        })

    })

    var addFriendship = function(idUser1, idUser2, idFriendSol, res){
        let sql = "INSERT INTO friends values(?, ?)";
        let sql_params = [idUser1, idUser2];
        conn.beginTransaction(function(err){
            if(err){
                conn.rollback(function(){
                    b.l.cerr(err);
                    res.status(500).send("Couldn't add friend");
                    return;
                });
            }

            conn.query(sql, sql_params, function(err, result){
                if(err){
                    conn.rollback(function(){
                        b.l.cerr(err);
                        res.status(500).send("Couldn't add friend");
                        return;
                    });
                }

                conn.query(sql, sql_params.reverse(), function(err){
                    if(err){
                        conn.rollback(function(){
                            b.l.cerr(err);
                            res.status(500).send("Couldn't add friend");
                            return;
                        });
                    }

                    let sql2 = "Update friend_solicitude set status = 1 WHERE idFriendSol = ?";
                    let sql_params2 = [idFriendSol];
                    conn.query(sql2, sql_params2, function(err, result){
                        if(err){
                            conn.rollback(function(){
                                b.l.cerr(err);
                                res.status(500).send("Couldn't add friend");
                                return;
                            });
                        }

                        conn.commit(function(err){
                            if(err){
                                conn.rollback(function(){
                                    b.l.cerr(err);
                                    res.status(500).send("Couldn't add friend");
                                    return;
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