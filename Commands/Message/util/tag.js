import { Pagination } from "pagination.djs";

export default {
  name: "tag",
  description: "Get info on a tag.",
  userPermissions: ["SendMessages"],
  botPermissions: ["SendMessages", "EmbedLinks"],
  category: "util",
  cooldown: 5,

  run: async ({ client, message, args, prefix }) => {
    const db = client.db;
    const userID = message.author.id;
    if (args.length === 0) return;
    const { tags } = db.data
    if (args[0] === "add") {
      if (userID !== client.config.Dev.ID) return;
      const tagName = args[1];
      if (!tagName) return await client.sendEmbed(message, `No tagName - Usage: \`${client.config.PREFIX}tag add <tagName> <tagDescription>\``);
      const tagDescription = args.slice(1).join(" ");
      if (!tagDescription) return await client.sendEmbed(message, `Usage: \`${client.config.PREFIX}tag add <tagName> <tagDescription>\``);
      const tag = {tag: tagName, description: tagDescription }
      await db.update(({ tags }) => tags.push(tag))
      console.log(`Added tag to db`)
      await client.sendEmbed(message, `Added tag: ${tagName} - ${tagDescription}`);
      
    } else if (args[0] === "remove") {
      if (userID !== client.config.Dev.ID) return;
      return client.sendEmbed(message, `Tags have to be removed manually untill further notice.`);
      const tagName = args[1];
      if (!tagName) return await client.sendEmbed(message, `Usage: \`${client.config.PREFIX}tag remove <tagName>\``);
      const tag = tags.find((tag) => tag.tag === tagName);
      if (!tag) return await client.sendEmbed(message, `Tag: ${tagName} not found.`);
      

      await client.sendEmbed(message, `Deleted tag: ${tagName}`);
    } else if (args[0] === "list" || args[0] === "l") {
      const pagination = new Pagination(message);
      pagination.setTitle(`Tags:`).setColor(client.config.embed.color);
      const tagsData = db.data.tags;
      if (!tags || tags.length === 0) return await client.sendEmbed(message, `No tags found.`);
      const tagsList = tagsData.map((tag) => {
        return {
          name: `${tag.tag}`,
          value: `${tag.description}`
        };
      });
      pagination.addFields(tagsList);      
      pagination.paginateFields(true);

      return pagination.render();
    } else {
      const tagName = args[0];
      if (!tagName) return await client.sendEmbed(message, `Usage: \`${client.config.PREFIX}tag <tagName>\``);
      const tag = tags.find((tag) => tag.tag === tagName);
      console.log(tag)
      if (!tag) return await client.sendEmbed(message, `Tag: ${tagName} not found.`);
      await client.sendEmbed(message, `Tag: ${tag.tag}\nDescription: ${tag.description}`);
    }
  },
};
