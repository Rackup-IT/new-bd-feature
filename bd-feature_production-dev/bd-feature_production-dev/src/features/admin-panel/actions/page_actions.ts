import { ApiError } from "@/lib/error";
import { getDb } from "../../../lib/mongodb";
import { PageResponseType } from "../hooks/api/usePageApi";

export const uploadPageToDBAction = async (data: PageResponseType) => {
  const { edition, navLink } = data;

  if (!edition || !navLink)
    throw new ApiError(400, "Missing edition or navLink");

  try {
    const db = await getDb();
    const result = await db
      .collection("pages")
      .replaceOne({ edition: edition, navLink: navLink }, data, {
        upsert: true,
      });

    const successful =
      result.matchedCount > 0 || result.modifiedCount > 0 || result.upsertedId;
    if (!successful) {
      throw new Error("Failed to insert page into database.");
    }

    return result;
  } catch (error) {
    throw new ApiError(500, "Database insert error", error);
  }
};

export const getSinglePageAction = async (edition: string, navLink: string) => {
  try {
    const db = await getDb();
    // Use aggregation to populate posts and their writers in one pipeline
    const pipeline = [
      { $match: { edition, navLink } },
      // collect all post ids from sections into a single array
      {
        $addFields: {
          allPostIds: {
            $reduce: {
              input: { $ifNull: ["$sections", []] },
              initialValue: [],
              in: {
                $concatArrays: ["$$value", { $ifNull: ["$$this.posts", []] }],
              },
            },
          },
        },
      },
      // normalize ids to strings then to ObjectId
      {
        $addFields: {
          allPostIdStrs: {
            $map: { input: "$allPostIds", as: "p", in: { $toString: "$$p" } },
          },
        },
      },
      {
        $addFields: {
          allPostObjectIds: {
            $map: {
              input: {
                $filter: {
                  input: "$allPostIdStrs",
                  as: "s",
                  cond: {
                    $regexMatch: { input: "$$s", regex: /^[0-9a-fA-F]{24}$/ },
                  },
                },
              },
              as: "s",
              in: { $toObjectId: "$$s" },
            },
          },
        },
      },
      // lookup posts
      {
        $lookup: {
          from: "posts",
          let: { postIds: "$allPostObjectIds" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$postIds"] } } }],
          as: "posts",
        },
      },
      // collect writer ids from posts
      {
        $addFields: {
          writerIdStrs: {
            $map: {
              input: { $ifNull: ["$posts", []] },
              as: "p",
              in: { $toString: { $ifNull: ["$$p.writter", ""] } },
            },
          },
        },
      },
      {
        $addFields: {
          writerObjectIds: {
            $map: {
              input: {
                $filter: {
                  input: "$writerIdStrs",
                  as: "s",
                  cond: {
                    $regexMatch: { input: "$$s", regex: /^[0-9a-fA-F]{24}$/ },
                  },
                },
              },
              as: "s",
              in: { $toObjectId: "$$s" },
            },
          },
        },
      },
      // lookup authors
      {
        $lookup: {
          from: "authors",
          let: { writerIds: "$writerObjectIds" },
          pipeline: [{ $match: { $expr: { $in: ["$_id", "$$writerIds"] } } }],
          as: "authors",
        },
      },
      // attach author objects into posts array
      {
        $addFields: {
          posts: {
            $map: {
              input: { $ifNull: ["$posts", []] },
              as: "p",
              in: {
                $let: {
                  vars: { widStr: { $toString: "$$p.writter" } },
                  in: {
                    $let: {
                      vars: {
                        matched: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: { $ifNull: ["$authors", []] },
                                as: "a",
                                cond: {
                                  $eq: [{ $toString: "$$a._id" }, "$$widStr"],
                                },
                              },
                            },
                            0,
                          ],
                        },
                      },
                      in: {
                        $mergeObjects: [
                          "$$p",
                          {
                            writter: {
                              $cond: [
                                { $ifNull: ["$$matched", false] },
                                {
                                  _id: "$$matched._id",
                                  name: "$$matched.name",
                                  bio: "$$matched.bio",
                                  email: "$$matched.email",
                                  occupation: "$$matched.occupation",
                                  location: "$$matched.location",
                                  website: "$$matched.website",
                                  isApproved: "$$matched.isApproved",
                                  approvalStatus: "$$matched.approvalStatus",
                                  requestedAt: "$$matched.requestedAt",
                                  profileImage: "$$matched.profileImage",
                                },
                                "$$p.writter",
                              ],
                            },
                          },
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // reconstruct sections replacing post ids with full post objects (preserve original ordering; fall back to original id if not found)
      {
        $addFields: {
          sections: {
            $map: {
              input: { $ifNull: ["$sections", []] },
              as: "sec",
              in: {
                $mergeObjects: [
                  "$$sec",
                  {
                    posts: {
                      $map: {
                        input: { $ifNull: ["$$sec.posts", []] },
                        as: "pid",
                        in: {
                          $let: {
                            vars: { pidStr: { $toString: "$$pid" } },
                            in: {
                              $let: {
                                vars: {
                                  matched: {
                                    $arrayElemAt: [
                                      {
                                        $filter: {
                                          input: { $ifNull: ["$posts", []] },
                                          as: "pp",
                                          cond: {
                                            $eq: [
                                              { $toString: "$$pp._id" },
                                              "$$pidStr",
                                            ],
                                          },
                                        },
                                      },
                                      0,
                                    ],
                                  },
                                },
                                in: { $ifNull: ["$$matched", "$$pid"] },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      // remove helper fields
      {
        $project: {
          allPostIds: 0,
          allPostIdStrs: 0,
          allPostObjectIds: 0,
          writerIdStrs: 0,
          writerObjectIds: 0,
          authors: 0,
        },
      },
    ];

    const agg = (await db
      .collection("pages")
      .aggregate(pipeline)
      .toArray()) as PageResponseType[];
    const page = agg[0];
    if (!page) throw new ApiError(404, "Page not found");

    return page;
  } catch (error) {
    throw new ApiError(500, "Database read error", error);
  }
};
