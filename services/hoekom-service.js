import axios from "axios";
import {parse} from "node-html-parser";
import config from "../config.json" assert { type: "json" };

const HoekomService = () => {
    const getStageNumber = async () => {
        return await axios.get(`${config.BASE_API}/GetStatus`);
    };

    const getMunicipal = async province => {
        const {data} = await axios.get(`${config.BASE_API}/GetMunicipalities/?Id=${province}`);
        
        return data.map(item => {
            return {
                text: item.Text,
                value: item.Value
            };
        });
    };

    const getSuburb = async (municipal, keyword) => {
        let link = `${config.BASE_API}/GetSurburbData/?pageSize=1000&pageNum=1&id=${municipal}`;
        if(keyword) link += `&searchTerm=${keyword.replace(/./, c=>c.toUpperCase())}`;

        const {data} = await axios.get(link);

        const {Results: results} = data;
        
        const arr = results.map(item => {
            return {
                text: item.text,
                value: item.id
            };
        });
        
        return arr;
    };

    const getTimetable = async (suburb, stage, province = 1, total = 1) => {
        const {data} = await axios.get(`${config.BASE_API}/GetScheduleM/${suburb}/${stage}/${province}/${total}`);

        let root = parse(data);

        root = root.querySelectorAll(".scheduleDay").toString();

        root = root.replace(/\,/g, "");

        root = root.replace(/onclick/)

        return root;
    }

    return {
        getStageNumber,
        getMunicipal,
        getSuburb,
        getTimetable
    };
};

export default HoekomService;