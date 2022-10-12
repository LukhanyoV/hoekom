const Routes = (HoekomService) => {
    const {getStageNumber, getMunicipal, getSuburb, getTimetable} = HoekomService();

    const index = async (req, res) => {
        let { data: statusCode } = await getStageNumber();
        statusCode = Math.abs(statusCode);
        let province;
        let municipal;
        let suburb;
        let timetable;
        let searchFail;
    
        if(!req.query){
            province = !req.query;
        }
        
        if(req.query.province){
            if(req.query.province >= 1 && req.query.province <= 9){
                municipal = await getMunicipal(req.query.province);
            }
        }
    
        if(req.query.municipal){
            if(req.query.municipal >= 100 && req.query.municipal <= 360){
                suburb = await getSuburb(req.query.municipal, req.query?.search);
                if(!suburb){
                    searchFail = true;
                }
            }
        }
    
        if(req.query.suburb){
            if(req.query.suburb >= 1000000){
                timetable = await getTimetable(req.query.suburb, statusCode);
            }
        }
    
        res.render("index", {
            province,
            statusCode,
            municipal,
            suburb,
            timetable,
            searchFail
        });
    }

    return {
        index
    }
};

export default Routes;