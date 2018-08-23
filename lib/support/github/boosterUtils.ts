import * as _ from "lodash";
import {REDHAT_QUALIFIER} from "../../constants";
import {getTags} from "./refUtils";

export interface LatestTagRetriever {
  getLatestTags(booster: string,
                tagFilter?: (t: string) => boolean, token?: string): Promise<BoosterTagTuple>;
}

export interface BoosterTagTuple {
  community: string;
  prod: string;
}

export class DefaultLatestTagRetriever implements LatestTagRetriever {

  public async getLatestTags(booster: string,
                             tagFilter: (t: string) => boolean,
                             token?: string): Promise<BoosterTagTuple> {

    const allTagsSorted = await getTags(booster, token, tagFilter);

    const allTagsGroupedAndSorted =
        _.groupBy(allTagsSorted, t => t.includes(REDHAT_QUALIFIER));
    const allCommunityTags = allTagsGroupedAndSorted.false;
    const allProdTags = allTagsGroupedAndSorted.true;

    return {community: _.last(allCommunityTags), prod: _.last(allProdTags)};
  }
}
