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
import {bomTagsCompare} from "../../../lib/support/github/bom";

describe("bomTagsCompare", () => {

  it("correctly compares versions", async () => {
    assert(bomTagsCompare("1.5.14.Alpha1", "1.5.14.Beta1") === -1);
    assert(bomTagsCompare("1.5.14.Alpha99", "1.5.14.Beta1") === -1);
    assert(bomTagsCompare("1.5.14.Beta1", "1.5.14.Beta2") === -1);
    assert(bomTagsCompare("1.5.14.Beta1", "1.5.14.Beta99") === -1);

    assert(bomTagsCompare("1.5.15.Final", "1.5.15.Beta1") === 1);
    assert(bomTagsCompare("1.5.14.Final", "1.5.14.Beta99") === 1);
    assert(bomTagsCompare("1.5.14.Final", "1.5.14.SP1") === -1);
    assert(bomTagsCompare("1.5.14.Final", "1.5.14.SP2") === -1);
    assert(bomTagsCompare("1.5.14.Final", "1.5.14.SP10") === -1);

    assert(bomTagsCompare("1.5.15.Alpha1", "1.5.14.Alpha1") === 1);
    assert(bomTagsCompare("1.5.15.Alpha1", "1.5.14.Alpha99") === 1);
    assert(bomTagsCompare("1.5.15.Alpha1", "1.5.14.Beta1") === 1);
    assert(bomTagsCompare("1.5.15.Alpha1", "1.5.14.Final") === 1);
    assert(bomTagsCompare("1.5.15.Alpha1", "1.5.14.SP99") === 1);

    assert(bomTagsCompare("1.5.15.SP2", "1.6.0.Alpha1") === -1);
    assert(bomTagsCompare("1.5.15.SP2", "1.6.0.Alpha99") === -1);
    assert(bomTagsCompare("1.5.15.SP2", "1.6.0.Beta1") === -1);
    assert(bomTagsCompare("1.5.15.SP2", "1.6.0.Final") === -1);
    assert(bomTagsCompare("1.5.15.SP2", "1.6.0.SP99") === -1);

    assert(bomTagsCompare("1.5.15.SP2", "2.0.0.Alpha1") === -1);
    assert(bomTagsCompare("1.5.15.SP2", "2.0.0.Beta10") === -1);
    assert(bomTagsCompare("1.5.15.SP2", "2.0.0.Final") === -1);
    assert(bomTagsCompare("1.5.15.SP2", "2.0.0.SP1") === -1);
  });

});
