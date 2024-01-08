// import { Link } from './Link';
import {
  enumType,
  objectType,
  extendType,
  nonNull,
  stringArg,
  intArg,
  inputObjectType,
  arg,
  list,
} from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
import { Prisma, prisma } from "@prisma/client";
import { JSONObject } from "graphql-scalars/typings/mocks";

export const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition(t) {
    t.field("url", { type: "Sort" });
    t.field("description", { type: "Sort" });
    t.field("createdAt", { type: "Sort" });
    t.field("id", { type: "Sort" });
  },
});
export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});

export const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: Link }); // 1
    t.nonNull.int("count"); // 2
    t.id("id"); // 3
  },
});

export const Link = objectType({
  name: "Link",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("url");
    t.nonNull.string("description");
    t.nonNull.dateTime("createdAt");
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, ctx) {
        return ctx.prisma.link
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .postedBy();
      },
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve(parent, args, ctx) {
        return ctx.prisma.link
          .findUnique({
            where: {
              id: parent.id,
            },
          })
          .voters();
      },
    });
    // t.nonNull.string("name")
  },
});

// let Links: NexusGenObjects["Link"][] = [
//   {
//     id: 1,
//     url: "https://www.google.com",
//     description: "Google",
//   },
//   {
//     id: 2,
//     url: "https://www.yahoo.com",
//     description: "Yahoo",
//   },
// ];

export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    // t.nonNull.list.nonNull.field("feed", {
    //   type: "Link",
    t.nonNull.field("feed", {
      type: "Feed",
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }), // 1
      },
      async resolve(parent, args, context) {
        const where = args.filter
          ? {
              OR: [
                {
                  description: {
                    contains: args.filter,
                  },
                },
                {
                  url: {
                    contains: args.filter,
                  },
                },
              ],
            }
          : {};
        const links = context.prisma.link.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
            | undefined, // 2
        });
        const count = await context.prisma.link.count({ where });
        const id = `main-feed:${JSON.stringify(args)}`;

        return {
          links,
          count,
          id,
        };
      },
    });
  },
});

export const SingleLink = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("singleLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      async resolve(parent, args, context, info) {
        const { id } = args;
        // return Links.filter((link) => link.id == id);
        const link = await context.prisma.link.findUnique({
          where: {
            id: id,
          },
        });

        if (!link) {
          throw new Error("link not found !");
        }
        return [link];
      },
    });
  },
});

export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      type: "Link",
      args: {
        url: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      async resolve(parent, args, context, info) {
        const { description, url } = args;
        const { userId } = context;

        // let idCount = Links.length + 1;
        // const link = {
        //   id: idCount,
        //   description: description,
        //   url: url,
        // };
        // Links.push(link);
        const newLink = await context.prisma.link.create({
          data: {
            description: description,
            url: url,
            postedBy: {
              connect: {
                id: userId,
              },
            },
          },
        });
        return newLink;
      },
    });
  },
});

export const updateLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("update", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        url: nonNull(stringArg()),
        description: nonNull(stringArg()),
      },
      resolve(parent, args, context, info) {
        const { id, description, url } = args;
        //  let idx  = Links.findIndex((link) => link.id == id);
        //   if(idx == -1){
        //     throw new Error("Link not found");
        //   }
        //   Links[idx] = {
        //     id: id,
        //     description: description,
        //     url: url,
        //   };
        //   return Links[idx];
        const updateLink = context.prisma.link.update({
          where: {
            id: id,
          },
          data: {
            description: description,
            url: url,
          },
        });
        if (!updateLink) {
          throw new Error("Link not found");
        }
        return updateLink;
      },
    });
  },
});

export const deleteLinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("delete", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context, info) {
        const { id } = args;
        //  let idx  = Links.findIndex((link) => link.id == id);
        //   if(idx == -1){
        //     throw new Error("Link not found");
        //   }
        //   const deletedLink  = Links.splice(idx,1) [0];
        const deletedLink = context.prisma.link.delete({
          where: {
            id: id,
          },
        });
        if (!deletedLink) {
          throw new Error("Link not found");
        }
        return deletedLink;
      },
    });
  },
});
