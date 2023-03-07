import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import * as chrono from "chrono-node";
import { addReminder } from "../models/remindme-table";
import { ButtonComponent } from "../interactions/buttons/button";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "remindme",
      description: "Have Dad remind you of something at a specific time!",
      type: "SLASH_COMMAND",
      category: "utility",
      cooldown: 1,
      options: [
        {
          name: "what",
          type: ApplicationCommandOptionType.String,
          description: "A phrase describing what you want to be reminded about",
          required: true,
        },
        {
          name: "when",
          type: ApplicationCommandOptionType.String,
          description: "A phrase describing when you want to be reminded",
          required: true,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const what = interaction.options.get("what")?.value;

    const when = interaction.options.get("when")?.value;

    if (what == undefined) {
      await interaction.reply({
        content: "You must specify what you want to be reminded about",
        ephemeral: true,
      });
      return;
    }

    if (when == undefined) {
      await interaction.reply({
        content: "You must specify when you want to be reminded",
        ephemeral: true,
      });
      return;
    }

    //TODO: It hates things like "Christmas", figure out why
    const res = chrono.parseDate(when.toString(), { timezone: "EST" });
    //await addReminder(interaction.user.username, interaction.user.id, what.toString(), res, interaction.channelId);

    const row = new ActionRowBuilder().addComponents([
      new ButtonBuilder().setCustomId("remindmeAccept").setLabel("Accept").setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId("remindmeReject").setLabel("Reject").setStyle(ButtonStyle.Danger),
    ]);

    // @ts-ignore
    await interaction.reply({ content: "I think you should,", components: [row] });
  }
}
