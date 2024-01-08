import { json } from "d3";

export default async function fetchData(url1, url2) {
  try {
    const data = await Promise.all([url1, url2].map((d) => json(d)));

    return data;
  } catch (error) {
    return [null, null]; // Return nulls to handle error in consuming function
  }

}
