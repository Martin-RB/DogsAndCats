module.exports = function(router, b){
    let conn = b.mysql;

    router.get("/:search", function(req, res){
        let params = req.params;
        if(params.search === undefined){
            b.l.cerr("Invalid input", params.search);
            inputErrorStatus(res);
            res.send();
            return;
        }
        let search = params.search;

        if(search == ""){
            res.json([]);
            return;
        }
        let sql = `SELECT * FROM users WHERE name = ?%`;
        conn.query(sql, [search], (err, result, fields) =>{
            if(err){
                b.f.cerr(err);
                b.processErrorStatus(res);
                res.send();
                return;
            }

            var finalResult = [];
            result.forEach(r =>{
                finalResult.push({
                    name: r.name,
                    email: r.email
                });
            });
            res.json(finalResult);
        });
    });

    return router;
}