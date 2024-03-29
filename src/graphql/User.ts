import { objectType,stringArg,intArg } from "nexus";

export const User = objectType({
    name: "User",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.nonNull.string("email");
      
        t.nonNull.list.nonNull.field("links", {
            type: "Link",
            resolve(parent, args, context) {    
                return context.prisma.user.findUnique({
                    where: {
                        id: parent.id
                    },
                }).links();
                // .links(); 
                // return Link.find({ user: parent.id });
            },
        });
    },
    })