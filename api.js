import axios from "axios";

export default {
    getIPTrackerAPI(input) {
        return axios.get(`https://geo.ipify.org/api/v2/country,city?apiKey=at_cMv3mkg34GIYbPkF4tpfLuOa6IQzw&ipAddress=${ input }`)
    }
};