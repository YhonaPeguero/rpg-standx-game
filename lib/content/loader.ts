import chapterOne from "@content/chapters/act1-c1-awakening.json";
import chapterTwo from "@content/chapters/act1-c2-discord-plaza.json";
import chapterThree from "@content/chapters/act1-c3-event-arena.json";
import chapterFour from "@content/chapters/act1-c4-content-district.json";
import chapterFive from "@content/chapters/act1-c5-moderator-gate.json";
import chapterSix from "@content/chapters/act1-c6-seed-hall.json";
import charactersJson from "@content/characters.json";
import type { Chapter, Character } from "@/types";
import { chapterSchema, charactersSchema } from "./schemas";

const rawChapters = [chapterOne, chapterTwo, chapterThree, chapterFour, chapterFive, chapterSix];

export const chapters: Chapter[] = rawChapters.map((chapter) => chapterSchema.parse(chapter));
export const characters: Character[] = charactersSchema.parse(charactersJson);

export function getChapters() {
  return chapters;
}

export function getChapterById(id: string) {
  return chapters.find((chapter) => chapter.id === id) ?? null;
}

export function getCharacterById(id: string) {
  return characters.find((character) => character.id === id) ?? null;
}
