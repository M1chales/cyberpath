export interface LessonSection {
  heading: string
  paragraphs: string[]
  bullets?: string[]
  code?: string
  codeLabel?: string
  callout?: { label: string; text: string }
}

export interface Lesson {
  intro: string
  builtOn?: string[]
  sections: LessonSection[]
  takeaways: string[]
}
