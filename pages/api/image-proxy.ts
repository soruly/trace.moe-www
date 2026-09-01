import { handleRequest } from "../../image-proxy";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  return handleRequest(req);
}
