# excavator

excavator is a `spadingScript` for KoLmafia (at least r20145) for collaboratively gathering data while playing the Kingdom of Loathing. It collects sends data via kmail to the player `Excavator` when possible (i.e. when you're not in an encounter), otherwise it is cached in the `spadingData` property. The cache can be processed by running the `spade` command in the CLI.

Only data pertinent to the [current projects](#current-projects) are reported (outcomes from combats, state of flags or counters on your player etc) and each packet of data can be reviewed and approved before it is sent. No personal information will ever be transmitted.

These data are pulled every 15 minutes to a [Google Sheet](https://tinyurl.com/excavator-data).

It is maintained by gausie (#1197090).

## Installation and Usage

Install the script using the KoLmafia CLI:

```
git checkout gausie/excavator
```

Set up KoLmafia to use `excavator.js` as your spadingScript:

```
set spadingScript = excavator.js
```

Data will be automatically submitted when possible, but if you want to manually clear the cache in the `spadingData` prop, you can do so using the `spade autoconfirm` command:

```
spade
```

A reminder to do so appears on login and in the Daily Deeds panel.

## Current projects

* **[Autumnaton](packages/excavator-script/src/projects/autumnaton.ts)** - Determine difficulty level of zones `autumnaton` is sent to
* **[Coat of Paint](packages/excavator-script/src/projects/coatOfPaint.ts)** - Determine the relationship between `fresh coat of paint` modifiers and the day seed
* **[Bird-a-Day](packages/excavator-script/src/projects/birdADay.ts)** - Determine the relationship between `Blessing of the Bird` modifiers and the day seed
* **[Genie](packages/excavator-script/src/projects/genie.ts)** - Determine which monsters and effects can be fought/acquired with the `Genie`
* **[Hookah](packages/excavator-script/src/projects/hookah.ts)** - Record instances of an effect obtained through a mechanic like the `ittah bittah hookah` that KoLmafia thinks shouldn't be possible
* **[Continental Juice Bar](packages/excavator-script/src/projects/juiceBar.ash)** - Determine the relationship between `Chateau Mantegna` Continental Juice Bar potions and the day seed
* **[Mumming Trunk](packages/excavator-script/src/projects/mummingTrunk.ash)** - Record instances of a familiar indicating that it has a previous undetected attribute through `mumming trunk` bonuses
* **[Out of Order](packages/excavator-script/src/projects/outOfOrder.ash)** - Determine the relationship between initiative bonus and beeps from the `GPS-tracking wristwatch` during the Out of Order quest

## Retired Projects
* **Beach Comb** - There are more intense spading projects occurring elsewhere and this project spams a lot of data
* **Cargo Cultist Shorts** - We determined [what it has in its pocketses](https://kol.coldfront.net/thekolwiki/index.php/What_has_it_got_in_its_pocketses%3F/contents)
* **Guzzlr** - We worked out [the relationship between Guzzlr deliveries and enchantments](https://kol.coldfront.net/thekolwiki/index.php/Guzzlr_tablet#Notes) on the Guzzlr tablet accessory
* **Monster Parts** - The release of the [Everfull Dart Holster](https://kol.coldfront.net/thekolwiki/index.php/Everfull_Dart_Holster) made future part collection much easier. 
* **PvP Effects** - We found a few effects that don't decrease via PvP turns, but retired this as it was temperamental
* **Voting Booth** - We [backwards-engineered the code](https://kol.coldfront.net/thekolwiki/index.php/Talk:Voting_Booth#Initiative_seeding) that maps day seed to voting initiatives
* **WLF Bunker** - We determined the relationship between WLF Bunker operations and the day seed

## Further information

To get involved in writing a project or if you have any other queries join us on the [Ascension Speed Society Discord server](https://discord.gg/T3rqfve).
