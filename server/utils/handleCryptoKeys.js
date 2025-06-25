// TODO: handle error
import { readFileSync } from "fs";

export const publicKey = readFileSync("../publicKey.pem", {
	encoding: "utf-8",
});

export const privateKey = readFileSync("../privateKey.pem", {
	encoding: "utf-8",
});
