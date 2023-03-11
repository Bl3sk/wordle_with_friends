import axios from "axios";

let url;
if (process.env.NODE_ENV === "production") {
    url = "https://wordlewithfriendsbackend.onrender.com"
} else {
    url = "http://localhost:8080"
}


export const axiosInstance = axios.create({
    baseURL: url
})
