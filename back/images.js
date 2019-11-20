module.exports = function(router, b){

    let conn = b.mysql;

    // whom = all
    // whom = mine
    // whom = other

    // petType = random
    // petType = dogs
    // petType = cats

    router.get("/:petType/:whom/:id", function(req, res, next){
        var idActualUser = 1; //!Replace with cookie
        let params = req.params;
        if(params.petType === undefined || params.petType === "" ||
        params.whom === undefined || params.whom === ""){
            b.l.cerr("Invalid input", params);
            inputErrorStatus(res);
            res.send();
            return;
        }

        let petType = params.petType;
        let whom = params.whom;


        if(whom === "all"){
            let imageCount = 18;
            getImages(petType, imageCount, [], function(imgs){
                if(imgs.length != imageCount){
                    b.l.cerr("Invalid input", params.id);
                    inputErrorStatus(res);
                    res.send();
                    return;
                }

                res.json(imgs);
            });
        }
        else if(whom === "mine"){
            let sql_params = [idActualUser];

            let typeFragment = "";
            if(petType == "dogs"){
                typeFragment = " AND type = ?"
                sql_params.push("dog");
            }
            else if(petType == "cats"){
                typeFragment = " AND type = ?"
                sql_params.push("cat");
            }

            let sql = "SELECT photoUrl FROM likesPhotos WHERE idUsers = ?"+typeFragment;
            conn.query(sql, sql_params, function(err, result, fields){
                if(err){
                    b.l.cerr(err);
                    b.processErrorStatus(res);
                    res.send();
                    return;
                }

                let imgs = [];
                result.forEach(el => {
                    imgs.push(el.photoUrl);
                });

                res.json(imgs);
            })
        }
        else if (whom == "other"){

            if(params.id === undefined || params.id === ""){
                b.l.cerr("Invalid input", params.id);
                inputErrorStatus(res);
                res.send();
                return;
            }

            let sql_params = [params.id, idActualUser];

            let typeFragment = "";
            if(petType == "dogs"){
                typeFragment = " AND type = ?"
                sql_params.push("dog");
            }
            else if(petType == "cats"){
                typeFragment = " AND type = ?"
                sql_params.push("cat");
            }

            let sql = "SELECT photoUrl FROM likesPhotos l, friends f WHERE f.idUsers1 = l.idUsers and idUsers = ? and f.idUsers2 = ?"+typeFragment;
            conn.query(sql, sql_params, function(err, result, fields){
                if(err){
                    b.l.cerr(err);
                    b.processErrorStatus(res);
                    res.send();
                    return;
                }

                let imgs = [];
                result.forEach(el => {
                    imgs.push(el.photoUrl);
                });

                res.json(imgs);
            })
        }
    });

    var getImages = function(type, count, arr, callback){
        if(count == 0){
            callback(arr);
            return;
        }

        if(type == "dogs"){
            getDog(function(url){
                arr.push(url);
                getImages(count - 1, arr, callback)
            });
        }
        else if(type == "cats"){
            getCat(function(){
                arr.push(url);
                getImages(count - 1, arr, callback);
            })
        }
        else if(type == "random"){
            var rand = Math.round(Math.random() * 100);
            if(rand >= 50){
                getDog(function(url){
                    arr.push(url);
                    getImages(count - 1, arr, callback)
                });
            }
            else{
                getCat(function(url){
                    arr.push(url);
                    getImages(count - 1, arr, callback)
                });
            }
        }

    }

    var getDog = function(callback){
        request('https://dog.ceo/api/breeds/image/random', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            url = res.message;
            callback(url);
            });
    }

    var getCat = function(callback){
        request('https://api.thecatapi.com/v1/images/search', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            url = res[0].url;
            callback(url);
            });
    }

    // Recibe image: str(link), type: (dogs/cats/random)
    router.post("/likePhoto/", function(req, res){
        let idActualUser = 1; //! Replace with cookie
        let body = req.body;
        if(body === undefined || body.image === undefined || body.image === ""
                || body.type === undefined || body.type === ""){
            b.l.cerr("Invalid input", body);
            inputErrorStatus(res);
            res.send();
            return;
        }

        let type;
        if(body.type === "dogs"){
            type = "dog";
        }
        else if(body.type === "cats"){
            type = "cat";
        }
        else{
            type = "ran";
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
    return router;
}