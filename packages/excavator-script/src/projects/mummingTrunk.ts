/**
 * @author gausie
 * Record instances of a familiar indicating that it has a previous undetected attribute through mumming trunk bonuses.
 */
import { myFamiliar } from "kolmafia";
import { $item, get, have, notNull } from "libram";

import { ExcavatorProject } from "../type";

const ATTRIBUTE_INDICATORS = {
  "1": {
    hands: [
      "Captain <name> waves <pronoun-pos> hands at you until you notice the Meat <pronoun-subj>'s found\\.",
      "Captain <name> distracts your opponent with <pronoun-pos> left hand while punching the Meat out of their pockets with the other\\.",
      'Captain <name> emits an enthusiastic "Arrrr," grabs a shovel, and digs up some extra Meat for you\\.',
      "Captain <name> rubs <pronoun-pos> hands together gleefully, thinking about all the Meat <pronoun-subj>'s gonna carve off your foe\\.",
    ],
    undead: [
      "<name> shows your opponent what's under <pronoun-pos> Captain's eyepatch\\. They shudder\\.",
      "Moonlight hits <name>, revealing The Captain's terrible curse! Your opponent reels in horror\\.",
      "Captain <name> threatens to send your foe to Mickey Dolenz's locker, which makes them a little nervous\\.",
      "Captain <name> threatens to make your opponent kiss the gunner's daughter\\. They seem a bit shaken by this\\.",
    ],
  },
  "2": {
    wings: [
      "<name> beats <pronoun-pos> wings, building up a static charge in <pronoun-pos> little Beelzebub pitchfork, which <pronoun-subj> then jabs you in the skull with\\.",
      "<name> flaps <pronoun-pos> wings until <pronoun-subj> builds up a good static charge, then jabs you with <pronoun-pos> little Beelzebub pitchfork\\. Zzzap!",
      "<name> flies up above you and fires little lightning bolts from <pronoun-pos> little pitchfork at your head, painfully refilling your MP\\.",
      "<name> waggles <pronoun-pos> wings at you to distract you, then jabs you with <pronoun-pos> Beelzebub pitchfork\\. This refills your MP, somehow\\.",
    ],
    hot: [
      "<name>'s little Beelzebub pitchfork glows red hot as <pronoun-subj> plunges it into your foe's <part>, dealing <elemental> damage\\.",
      "<name>'s little devil pitchfork heats up with the fires of hell, or possibly some sort of electrical heating coil, and causes <elemental> damage to your foe\\.",
      "<name> pours kerosene on <pronoun-pos> Beelzebub pitchfork and lights it on fire before stabbing your opponent for <elemental> damage\\.",
      "<name> lights <pronoun-pos> pitchfork on fire before stabbing your foe, adding injury to more injury\\. <elemental> more\\.",
    ],
  },
  "3": {
    animal: [
      "<name> growls and roars in typical Saint Patrick fashion, encouraging you to action\\.",
      "<name> roars like a savage beast, straining against <pronoun-pos> Saint Patrick costume\\. It's very inspiring!",
      "Saint <name> barks or howls or makes whatever sort of excited animal noise is appropriate for a thing like <name>, and this gets you pumped up\\.",
      "You give Saint <name> a pat on the head, which might possibly be sacrilegious, and uh\\.\\.\\. I guess that results in you getting a little stronger somehow\\.",
    ],
    biting: [
      "<name> bares her fangs at your foe in a not-particularly-saintly way; your foe hesitates for a moment\\.",
      "and shakes them violently, as Saint Patrick was famous for doing all the time\\.",
      "<name> chomps your foe on the head and refuses to let go\\. That's that famous Saint Patrick tenacity at work\\.",
      "<name>, clad in <pronoun-pos> already-intimidating Saint Patrick costume, bares <pronoun-pos> teeth even more intimidatingly\\. Your opponent is far too intimidated to attack\\.",
    ],
  },
  "4": {
    clothes: [
      "<name> smooths <pronoun-pos> purple crushed velvet suit and adjusts <pronoun-pos> lace cravat, then does an elaborate sexy dance for you\\. Unless you have put this costume on an underage familiar, in which case the dance is not sexy\\.",
      "<name>, dressed to the nines in <pronoun-pos> fancy Prince George costume, orders a random passerby to bring <pronoun-obj> some extra items\\. So haughty!",
      "Prince <name> does a regal dance\\. Some kind of waltz or something I guess\\? One of those dances with a lot of bowing and turning around\\.",
      "Prince <name> orders <pronoun-pos> servants to bring a mirror so <pronoun-subj> can adjust <pronoun-pos> clothes, then orders some more servants to bring <pronoun-obj> some new clothes\\.",
    ],
    quick: [
      "As quick as a wink, <name> sneaks up behind your opponent and stabs <pronoun-obj> with a tiny sword, dealing <number> damage\\. So much blood!",
      "Prince <name> charges in and impales your foe on <pronoun-pos> sword before they can even react, causing <number> damage!",
      "<name> swoops in like a bolt of regal lightning and stabs your opponent for <number> damage!",
      "Prince <name> dashingly dashes in and dashes your foe to the ground - - - for <number> damage!",
    ],
  },
  "5": {
    eyes: [
      "<name> peers at a tactical map of the area and pushes some little toy soldiers around it with a bent stick\\.",
      "<name> scans the horizon with her little field binoculars and gives you some Oliver Cromwellian intelligence updates\\.",
      "<name> blinks her eyes intelligently, like Oliver Cromwell would\\. Some of that intelligence rubs off on you\\.",
      "<name> adjusts her little Oliver Cromwell glasses and makes some helpful adjustments to your to-do list\\.",
    ],
    flying: [
      "From <pronoun-pos> position above the battlefield, <name> helps you get the jump on your foe in typical Oliver Cromwell style\\.",
      "<name> shouts some intel about enemy troop formations down at you from <pronoun-pos> position over the battlefield\\. Because that's something Oliver Cromwell did\\.",
      "<name> dissolves the Rump Parliament and is elected Lord Protector of England by your other familiars\\. Also, you win initiative\\.",
      "<name> waves her saber in the air and orders a cavalry charge, taking your foe by surprise\\.",
    ],
  },
  "6": {
    mechanical: [
      "<name>, dressed as The Doctor, gives you a quick MRI\\.",
      "<name> consults some bleeping Doctor-type machines and writes you a prescription\\.",
      "Doctor <name> puts a stick in your mouth and shines a light-up gadget in your eyes\\. For some reason, you feel better\\.",
      "<name>, dressed as The Doctor, jumps into <pronoun-pos> time machine and\\.\\.\\. what\\? Just a regular doctor\\? Oh\\.",
      "\\.\\.\\.I guess <pronoun-subj> just gives you some pills or something then\\.",
    ],
    evil: [
      "Doctor <name> writes your opponent a prescription for <number> cc of damage, delivered anally\\.",
      "Doctor <name> gets an evil glint in <pronoun-pos> eye, and another in <pronoun-pos> scalpel, and <number> of them in your foe's arm\\.",
      "<name> puts a pinky \\(or pinky-analogue\\) to the corner of <pronoun-pos> mouth and sneers something about a billion Meat\\. Your opponent sighs so heavily, they cause <number> damage to themself\\.",
      "With an evil grin, <name> pulls a wicked-looking medical instrument out of the coat of <pronoun-pos> Doctor costume and jabs your opponent for <number> damage\\.",
    ],
  },
  "7": {
    sleazy: [
      "<name> tells you a joke so dirty, you're pretty sure even Miss Funny wouldn't stand for it\\.",
      "<name>, in <pronoun-pos> Miss Funny costume, tells you a joke so filthy you barely even understand it\\.",
      '<name> tells you Miss Funny\'s version of "The Aristocrats", which is way filthier than you might expect\\.',
      "<name>, dressed as Miss Funny, tells an extremely bawdy joke\\. Far too bawdy to include here\\. Just\\.\\.\\. very very bawdy\\.",
    ],
    bug: [
      "<name> plays a great Miss Funny-style trick on your opponent, filling their pants with live bees\\. <elemental> damage worth of hilarity ensues\\.",
      "<name> plays a hilarious Miss Funny prank on your foe, laying a clutch of eggs in <pronoun-pos> mouth and dealing <elemental> damage\\.",
      "<name> vomits corrosive stomach secretions onto your opponent, causing <elemental> damage\\. What a hilarious prank!",
      "<name> tricks your foe by summoning a swarm of greasy locusts to devour them for <elemental> damage\\. Guess that's why they call <pronoun-obj> Miss Funny!",
    ],
  },
};

export const MUMMING_TRUNK: ExcavatorProject = {
  name: "Mumming Trunk",
  hooks: {
    COMBAT_ROUND: (encounter: string, page: string) => {
      if (!have($item`mumming trunk`)) return null;
      const fam = myFamiliar();
      if (!get("_mummeryMods").includes(fam.toString())) return null;
      return get("_mummeryUses")
        .split(",")
        .filter(
          (costume): costume is keyof typeof ATTRIBUTE_INDICATORS =>
            costume in ATTRIBUTE_INDICATORS,
        )
        .map((costume) => {
          const match = Object.entries(ATTRIBUTE_INDICATORS[costume]).find(
            ([attribute, indicators]) =>
              !fam.attributes.includes(attribute) &&
              indicators
                .map((i) => new RegExp(i.replace(/<name>/, fam.name)))
                .some((i) => i.test(page)),
          );

          if (!match) return null;

          return {
            attribute: match[0],
            familiar: fam.toString(),
          };
        })
        .filter(notNull);
    },
  },
};
