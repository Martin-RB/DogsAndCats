module.exports = function(router, b){

    let conn = b.mysql;

    // whom = all
    // whom = mine
    // whom = other

    // petType = random
    // petType = dogs
    // petType = cats

    router.get("/:petType/:whom/:id", function(req, res, next){
        var idActualUser = req.cookies["idUser"];
        let params = req.params;
        if(params.petType === undefined || params.petType === "" ||
        params.whom === undefined || params.whom === ""){
            b.l.cerr("Invalid input", params);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let petType = params.petType;
        let whom = params.whom;


        if(whom === "all"){
            let imageCount = 18;
            var procs = 18;
            var procReady = 0;
            var imggs = [];
            for (let i = 0; i < procs; i++) {
                getImages(petType, imageCount/procs, imggs, function(imgs){
                    if(procReady < procs - 1){
                        procReady+= 1;
                        return;
                    }

                    setLikedPhoto(idActualUser, imggs, function(resul){
                        res.json(resul);
                    });
                });
            }
        }
        else if(whom === "mine"){
            let sql_params = [idActualUser];

            let typeFragment = "";
            if(petType != "random"){
                typeFragment = " AND type = ?"
                sql_params.push(petType);
            }

            let sql = "SELECT photoUrl, type FROM likesPhotos WHERE idUsers = ?"+typeFragment;
            conn.query(sql, sql_params, function(err, result, fields){
                if(err){
                    b.l.cerr(err);
                    b.processErrorStatus(res);
                    res.send();
                    return;
                }
                let imgs = [];
                result.forEach(el => {
                    imgs.push({url: el.photoUrl, type: el.type, liked: true});
                });

                res.json(imgs.reverse());
            })
        }
        // PENDIENTE
        else if (whom == "other"){

            if(params.id === undefined || params.id === ""){
                b.l.cerr("Invalid input", params.id);
                b.inputErrorStatus(res);
                res.send();
                return;
            }

            let sql_params = [params.id, idActualUser];

            let typeFragment = "";
            if(petType != "random"){
                typeFragment = " AND type = ?"
                sql_params.push(petType);
            }

            let sql = "SELECT photoUrl, type FROM likesPhotos l, friends f WHERE f.idUsers1 = l.idUsers and idUsers = ? and f.idUsers2 = ?"+typeFragment;
            conn.query(sql, sql_params, function(err, result, fields){
                if(err){
                    b.l.cerr(err);
                    b.processErrorStatus(res);
                    res.send();
                    return;
                }

                let imgs = [];
                result.forEach(el => {

                    imgs.push({url: el.photoUrl, type: el.type});
                });

                res.json(imgs.reverse());
            })
        }
        else{
            res.status(500).send();
        }
    });

    var getImages = function(type, count, arr, callback){
        if(count == 0){
            callback(arr);
            return;
        }

        if(type == "dog"){
            getDog(function(url){
                arr.push({url: url, type: "dog"});
                getImages(type, count - 1, arr, callback)
            });
        }
        else if(type == "cat"){
            getCat(function(url){
                arr.push({url: url, type: "cat"});
                getImages(type, count - 1, arr, callback);
            })
        }
        else if(type == "random"){
            var rand = Math.round(Math.random() * 100);
            if(rand >= 50){
                getDog(function(url){
                    arr.push({url: url, type: "dog"});
                    getImages(type, count - 1, arr, callback)
                });
            }
            else{
                getCat(function(url){
                    arr.push({url: url, type: "cat"});
                    getImages(type, count - 1, arr, callback)
                });
            }
        }
        else{
            callback(arr);
        }

    }

    var getDog = function(callback){
        b.request('https://dog.ceo/api/breeds/image/random', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            let url = res.body.message;
            callback(url);
            });
    }

    var getCat = function(callback){
        b.request('https://api.thecatapi.com/v1/images/search', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            let url = res.body[0].url;
            callback(url);
            });
    }

    // arr = {url: url, type: typePet}
    var setLikedPhoto = function(idUser, arr, callback){
        let size = arr.length;
        let qFragment = "idUsers = ? AND (";
        let sql = "SELECT photoUrl FROM likesPhotos WHERE ";
        let sql_params = [idUser];
        for (let i = 0; i < size; i++) {
            if(i !== 0){
                qFragment += " OR ";
            }
            qFragment += "photoUrl = ?";
            sql_params.push(arr[i].url);
        }

        qFragment += ")";

        conn.query(sql + qFragment, sql_params, function(err, result){
            if(err){
                console.log(err);
                callback(arr);
                return;
            }

            arr.forEach((arr_el, arr_idx) =>{
                let result_found = result.find((res_v) => {
                    return res_v.photoUrl == arr_el.url;
                });
                arr[arr_idx].liked = (result_found !== undefined);
            });
            callback(arr);
        });
    }

    // Recibe image: str(link), type: (dogs/cats/random)
    router.post("/likePhoto/", function(req, res){
        let idActualUser = req.cookies["idUser"];
        let body = req.body;
        if(body === undefined || body.image === undefined || body.image === ""
                || body.type === undefined || body.type === ""){
            b.l.cerr("Invalid input", body);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        if(idActualUser === undefined){
            b.l.cerr("No user");
            res.status(403);
            res.send("You must be logged in before liking a photo");
            return;
        }

        let type = body.type;
        if(type !== "dog" && type !== "cat"){
            b.l.cerr("Invalid input", body);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let sql = `insert into likesPhotos (idUsers, photoUrl, type) values(?, ?, ?)`;
        let sql_params = [idActualUser, body.image, type];
        conn.query(sql, sql_params, function(err, result, fields){
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            res.send();
        });
    });

    router.delete("/likePhoto/", function(req, res){
        let idActualUser = req.cookies["idUser"];
        let body = req.body;
        if(body === undefined || body.image === undefined || body.image === ""){
            b.l.cerr("Invalid input", body);
            b.inputErrorStatus(res);
            res.send();
            return;
        }

        let sql = `delete from likesPhotos WHERE idUsers = ? AND photoUrl = ?`;
        let sql_params = [idActualUser, body.image];
        conn.query(sql, sql_params, function(err, result, fields){
            if(err){
                b.l.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            res.send();
        });
    });
    return router;
}
