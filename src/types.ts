export type Difficulty = 'light' | 'medium' | 'heavy';
export type GameCategory =
  | 'strategy' | 'party' | 'family' | 'coop' | 'deckbuilder' | 'social-deduction';
export type Vibe = 'casual' | 'competitive' | 'social' | 'marathon';
export type MeetupStatus = 'open' | 'full' | 'inProgress' | 'completed' | 'cancelled';
export type AttendanceStatus = 'confirmed' | 'showed' | 'noShow' | 'cancelledEarly';
export type AwardType = 'voted' | 'computed';

export interface BoardGame {
  id: string;
  name: string;
  coverUrl: string;
  difficulty: Difficulty;
  weight: number;
  minPlayers: number;
  maxPlayers: number;
  playTimeMin: number;
  teachTimeMin: number;
  category: GameCategory;
  blurb: string;
  cafeIds: string[];
}

export interface CafeTable {
  id: string;
  label: string;
  seats: number;
}

export interface Review {
  id: string;
  author: string;
  stars: number;
  date: string;
  text: string;
}

export interface Cafe {
  id: string;
  name: string;
  area: string;
  city: string;
  photos: string[];
  rating: number | null;
  reviews: Review[];
  pricePerHour: number;
  perPerson: boolean;
  tables: CafeTable[];
  gameLibraryIds: string[];
  amenities: string[];
  offer?: { text: string; window: string };
  distanceKm: number;
  hours: string;
  lat: number;
  lng: number;
}

export interface MeepleAward {
  id: string;
  awardKey: string;
  title: string;
  subtext: string;
  type: AwardType;
  gameId?: string;
  cafeName?: string;
  meetupId?: string;
  votes?: number;
  earnedCriteria?: string;
  dateWon: string;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  isSuperHost: boolean;
  followers: number;
  following: number;
  reliability: { percent: number; showedUp: number; joined: number };
  preferredDifficulties: Difficulty[];
  preferredVibes: Vibe[];
  topGameIds: string[];
  meeples: MeepleAward[];
}

export interface Attendee {
  userId: string;
  status: AttendanceStatus;
  depositPaid: number;
  depositCredited: number;
  forfeitedToCafe: number;
}

export interface Meetup {
  id: string;
  host: User;
  cafe: Cafe;
  tableId: string;
  gameIds: string[];
  date: string;
  slots: { startTime: string; endTime: string }[];
  estimatedTotalMin: number;
  seatsFilled: number;
  seatsTotal: number;
  depositAmount: number;
  cancelCutoffHours: 2;
  vibes: Vibe[];
  beginnersWelcome: boolean;
  note?: string;
  status: MeetupStatus;
  roster: Attendee[];
}

export interface BillSplit {
  userId: string;
  share: number;
  depositCredit: number;
  amountDue: number;
}

export interface Bill {
  meetupId: string;
  lineItems: { label: string; amount: number }[];
  total: number;
  splits: BillSplit[];
}

export interface Tournament {
  id: string;
  name: string;
  gameId: string;
  cafe: Cafe;
  startDate: string;
  teamsRegistered: number;
  teamsTotal: number;
  entryFee: number;
  prizePool?: number;
}

export interface AwardDef {
  key: string;
  title: string;
  subtext: string;
  type: AwardType;
  surfaceWhen?: {
    categories?: GameCategory[];
    vibes?: Vibe[];
    always?: boolean;
    newcomerRequired?: boolean;
  };
  earnRule?: string;
}

export const AWARD_CATALOG: AwardDef[] = [
  { key: 'tablemaster', title: 'The Tablemaster', subtext: 'Voted the standout of the whole meetup.', type: 'voted', surfaceWhen: { always: true } },
  { key: 'mastermind', title: 'The Mastermind', subtext: 'For the sharpest tactical play at the table.', type: 'voted', surfaceWhen: { categories: ['strategy'], vibes: ['competitive', 'marathon'] } },
  { key: 'grand-architect', title: 'The Grand Architect', subtext: "Built the slow-burn engine no one saw coming.", type: 'voted', surfaceWhen: { categories: ['strategy', 'deckbuilder'] } },
  { key: 'master-of-deception', title: 'Master of Deception', subtext: "Lied through their teeth and got away with all of it.", type: 'voted', surfaceWhen: { categories: ['social-deduction', 'party'] } },
  { key: 'mind-reader', title: 'The Mind Reader', subtext: "Saw through every bluff before it left your mouth.", type: 'voted', surfaceWhen: { categories: ['social-deduction'] } },
  { key: 'kingmaker', title: 'The Kingmaker', subtext: "Didn't win — but decided who did.", type: 'voted', surfaceWhen: { vibes: ['competitive'] } },
  { key: 'closer', title: 'The Closer', subtext: 'Dead last, then sealed it on the final turn.', type: 'voted', surfaceWhen: { vibes: ['competitive'] } },
  { key: 'giant-slayer', title: 'The Giant Slayer', subtext: "Toppled the table's reigning champion.", type: 'voted', surfaceWhen: { vibes: ['competitive'] } },
  { key: 'heart-of-the-table', title: 'Heart of the Table', subtext: 'The one everyone wanted to keep playing with.', type: 'voted', surfaceWhen: { vibes: ['casual', 'social'] } },
  { key: 'hype-engine', title: 'The Hype Engine', subtext: 'Kept the energy roaring from setup to teardown.', type: 'voted', surfaceWhen: { vibes: ['social'] } },
  { key: 'grace-under-fire', title: 'Grace Under Fire', subtext: 'Lost without sulking, won without gloating.', type: 'voted', surfaceWhen: { vibes: ['casual', 'competitive'] } },
  { key: 'the-glue', title: 'The Glue', subtext: 'Held the team together when the game tried to break it.', type: 'voted', surfaceWhen: { categories: ['coop'] } },
  { key: 'peacekeeper', title: 'The Peacekeeper', subtext: 'Made it fun for every age and skill level at the table.', type: 'voted', surfaceWhen: { categories: ['family'] } },
  { key: 'the-natural', title: 'The Natural', subtext: 'A first-timer who played like a seasoned veteran.', type: 'voted', surfaceWhen: { newcomerRequired: true } },
  { key: 'lady-lucks-favourite', title: "Lady Luck's Favourite", subtext: 'The dice and the deck were clearly on their side.', type: 'voted', surfaceWhen: { always: true } },
  { key: 'comeback-kid', title: 'The Comeback Kid', subtext: 'Written off early, came roaring back to the front.', type: 'voted', surfaceWhen: { always: true } },
  { key: 'ever-present', title: 'Ever-Present', subtext: 'Shows up, every single time. 95%+ reliability.', type: 'computed', earnRule: 'reliability.percent >= 95 over >= 10 completed meetups' },
  { key: 'marathoner', title: 'The Marathoner', subtext: 'Went the full distance on a 3-hour epic.', type: 'computed', earnRule: 'completed a meetup with estimatedTotalMin >= 180' },
  { key: 'convener', title: 'The Convener', subtext: 'A born host — ran 10+ meetups for the community.', type: 'computed', earnRule: 'hosted >= 10 meetups' },
  { key: 'city-explorer', title: 'City Explorer', subtext: 'Rolled dice at 10 different cafes across Chennai.', type: 'computed', earnRule: 'played at >= 10 distinct cafes' },
  { key: 'polymath', title: 'The Polymath', subtext: 'Took the crown across Light, Medium and Heavy games alike.', type: 'computed', earnRule: 'won voted awards in light, medium and heavy meetups' },
];

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: string;
  type: 'direct' | 'group';
  meetupId?: string;
  name: string;
  avatarUrl?: string;
  participants: string[];
  messages: Message[];
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
}
