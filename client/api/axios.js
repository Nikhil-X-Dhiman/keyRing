import axios from "axios";

const baseURL = "http://localhost:3000/";

export const instance = axios.create({
	baseURL,
});

export const privateInstance = axios.create({
	baseURL,
	headers: { "Content-Type": "application/json" },
	withCredentials: true,
});
