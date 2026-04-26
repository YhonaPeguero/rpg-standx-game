import chapterOne from "@content/chapters/act1-c1-awakening.json";
import charactersJson from "@content/characters.json";
import type { Chapter, Character } from "@/types";
import { chapterSchema, charactersSchema } from "./schemas";

const rawChapters = [chapterOne];

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
