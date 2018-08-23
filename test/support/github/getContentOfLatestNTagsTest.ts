/*
 * Copyright © 2018 Atomist, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from "power-assert";
import * as parser from "xml2json";
import {getContentOfLatestNTags} from "../../../lib/support/github/bom";
import {githubToken} from "../../github";

describe("getContentOfLatestNTags", () => {

  it("should correctly fetch the tags", async () => {
    const contentArray = await getContentOfLatestNTags(t => (t === "1.5.15.Final"  || t === "1.5.14.Final"),
        2,
        githubToken(),
    );

    assert(contentArray.length === 2);
    assert(pomAsJson(contentArray[0]).project.version === "1.5.15.Final");
    assert(pomAsJson(contentArray[1]).project.version === "1.5.14.Final");
  }).timeout(10000);

});

function pomAsJson(content: string): any {
  return parser.toJson(content, {object: true}) as any;
}
