import axios from "axios";

const webLinksInstance = axios.create({
  baseURL: "https://link-shorter-eight.vercel.app/",
});

export const webLinksApi = {
  createLink(body: { longLink: string; description: string }) {
    return webLinksInstance.post<any, any>("api/links-conversion/short-link", {
      ...body,
    });
  },
  convertLink(body: { longLink?: string; shortLink?: string }) {
    return webLinksInstance.post<any, any>("api/links-conversion", { ...body });
  },
  searchLink(substring: string) {
    return webLinksInstance.get<any>(
      `api/links-conversion/links-by-substring?substring=${substring}`
    );
  },
};

export default webLinksApi;
