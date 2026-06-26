export interface GardenProfile {
  id: string
  user_id: string
  zip_code: string | null
  hardiness_zone: string | null
  frost_date_last: string | null
  frost_date_first: string | null
  family_size: number
  garden_sqft: number | null
  pasture_acres: number | null
  space_type: 'backyard' | 'small_farm' | 'large_farm' | 'urban'
  experience_level: 'beginner' | 'intermediate' | 'experienced'
  goals: string[]
  water_source: 'municipal' | 'well' | 'rainwater' | 'creek' | 'mixed'
  created_at: string
  updated_at: string
}

export interface GardenBed {
  id: string
  user_id: string
  name: string
  layout_type: 'rows' | 'raised_bed' | 'circular' | 'keyhole' | 'perennial_zone'
  width_ft: number
  length_ft: number
  sun_exposure: 'full_sun' | 'partial_shade' | 'full_shade'
  notes: string | null
  position_x: number
  position_y: number
  created_at: string
}

export interface GardenPlanting {
  id: string
  bed_id: string | null
  user_id: string
  plant_name: string
  plant_family: PlantFamily | null
  plant_type: 'annual' | 'perennial'
  year: number
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'year_round' | null
  start_date: string | null
  harvest_date: string | null
  notes: string | null
  created_at: string
}

export interface GardenTask {
  id: string
  user_id: string
  planting_id: string | null
  bed_id: string | null
  title: string
  task_type: TaskType
  due_date: string
  completed_at: string | null
  notes: string | null
  created_at: string
}

export interface HomesteadAnimal {
  id: string
  user_id: string
  animal_type: AnimalType
  breed: string | null
  count: number
  setup_date: string | null
  notes: string | null
  created_at: string
}

export interface RoadmapCompletion {
  id: string
  user_id: string
  phase: number
  item_key: string
  completed_at: string
  created_at: string
}

export type PlantFamily =
  | 'nightshade'
  | 'brassica'
  | 'legume'
  | 'allium'
  | 'cucurbit'
  | 'root'
  | 'herb'
  | 'fruit'
  | 'grain'
  | 'other'

export type TaskType =
  | 'water'
  | 'weed'
  | 'fertilize'
  | 'harvest'
  | 'start_seeds'
  | 'transplant'
  | 'custom'

export type AnimalType =
  | 'chickens'
  | 'cows'
  | 'rabbits'
  | 'fish'
  | 'ducks'
  | 'quail'
  | 'goats'
  | 'pigs'
  | 'bees'

export const PLANT_FAMILY_COLORS: Record<PlantFamily, string> = {
  nightshade: 'bg-purple-100 text-purple-800 border-purple-200',
  brassica:   'bg-green-100 text-green-800 border-green-200',
  legume:     'bg-lime-100 text-lime-800 border-lime-200',
  allium:     'bg-blue-100 text-blue-800 border-blue-200',
  cucurbit:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  root:       'bg-orange-100 text-orange-800 border-orange-200',
  herb:       'bg-teal-100 text-teal-800 border-teal-200',
  fruit:      'bg-red-100 text-red-800 border-red-200',
  grain:      'bg-amber-100 text-amber-800 border-amber-200',
  other:      'bg-gray-100 text-gray-800 border-gray-200',
}

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  water:       'Water',
  weed:        'Weed',
  fertilize:   'Fertilize',
  harvest:     'Harvest',
  start_seeds: 'Start Seeds',
  transplant:  'Transplant',
  custom:      'Custom',
}

export const ANIMAL_EMOJIS: Record<AnimalType, string> = {
  chickens: '🐔',
  cows:     '🐄',
  rabbits:  '🐇',
  fish:     '🐟',
  ducks:    '🦆',
  quail:    '🐦',
  goats:    '🐐',
  pigs:     '🐖',
  bees:     '🐝',
}

export const HARDINESS_ZONES: Record<string, { zone: string; lastFrost: string; firstFrost: string }> = {
  '1':  { zone: '1', lastFrost: 'June 15', firstFrost: 'July 15' },
  '2':  { zone: '2', lastFrost: 'May 15', firstFrost: 'August 15' },
  '3':  { zone: '3', lastFrost: 'May 15', firstFrost: 'September 15' },
  '4':  { zone: '4', lastFrost: 'May 1', firstFrost: 'October 1' },
  '5':  { zone: '5', lastFrost: 'April 15', firstFrost: 'October 15' },
  '6':  { zone: '6', lastFrost: 'April 1', firstFrost: 'November 1' },
  '7':  { zone: '7', lastFrost: 'March 15', firstFrost: 'November 15' },
  '8':  { zone: '8', lastFrost: 'February 15', firstFrost: 'December 1' },
  '9':  { zone: '9', lastFrost: 'February 1', firstFrost: 'December 15' },
  '10': { zone: '10', lastFrost: 'January 15', firstFrost: 'December 31' },
  '11': { zone: '11', lastFrost: 'Frost-free', firstFrost: 'Frost-free' },
  '12': { zone: '12', lastFrost: 'Frost-free', firstFrost: 'Frost-free' },
}

export function zipToZone(zip: string): string {
  const n = parseInt(zip.slice(0, 3))
  if (n <= 50)  return '3'
  if (n <= 100) return '4'
  if (n <= 200) return '5'
  if (n <= 300) return '7'
  if (n <= 400) return '6'
  if (n <= 500) return '5'
  if (n <= 600) return '5'
  if (n <= 700) return '8'
  if (n <= 800) return '5'
  if (n <= 850) return '9'
  if (n <= 900) return '10'
  if (n <= 960) return '9'
  return '6'
}
