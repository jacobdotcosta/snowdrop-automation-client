import axios from "axios";
import * as compareVersions from "compare-versions";
import {BOM_REPO} from "../../constants";
import {getTags} from "./refUtils";

export async function getContentOfLatestNTags(
    tagFilter: (t: string) => boolean, numOfTags: number, token?: string): Promise<string[]> {

  const latestNTags = (await getMatchingTags(tagFilter, token)).reverse().slice(0, numOfTags);
  return await Promise.all(latestNTags.map(async t => await getPomContentOfTag(t)));
}

function getMatchingTags(tagFilter: (t: string) => boolean, token?: string): Promise<string[]> {
  return getTags(BOM_REPO, token, tagFilter, bomTagsCompare);
}

async function getPomContentOfTag(tag: string): Promise<string> {
  const axiosResponse =
      await axios.get(`https://raw.githubusercontent.com/snowdrop/spring-boot-bom/${tag}/pom.xml`);

  if (axiosResponse.status !== 200) {
    return Promise.reject(`Non-existent BOM tag: '${tag}'`);
  }

  return axiosResponse.data;
}

export function bomTagsCompare(v1: string, v2: string): 1 | 0 | -1 {
  return compareVersions(convertToSemver(v1), convertToSemver(v2));
}

function convertToSemver(version: string) {
  return version
          .replace("Alpha", "1")
          .replace("Beta", "100")
          .replace("Final", "100000")
          .replace("SP", "100000000");
}
