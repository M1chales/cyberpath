export interface Resource {
  label: string
  url?: string
}

export interface CoreModule {
  kind: 'core'
  id: string
  week: number
  title: string
  tagline: string
  objectives: string[]
  topics: string[]
  handsOn: string[]
  resources: Resource[]
  deliverable: string
  certAlignment?: string[]
  relatedGame?: string
}

export interface Phase {
  id: string
  title: string
  weekRange: [number, number]
  summary: string
  color: string
  modules: CoreModule[]
}

export interface MasteryModule {
  kind: 'mastery'
  id: string
  title: string
  tagline: string
  objectives: string[]
  topics: string[]
  practice: string[]
  resources: Resource[]
  realWorldNote: string
  relatedGame?: string
}

export interface MasteryTrackDef {
  id: string
  title: string
  color: string
  summary: string
  modules: MasteryModule[]
}

export type AnyModule = CoreModule | MasteryModule
