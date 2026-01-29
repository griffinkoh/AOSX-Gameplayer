import { supabase } from '../lib/supabase'

export type CategoryQuestion = {
  id: number
  game_code: string
  category: string
  points: number
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: "A" | "B" | "C" | "D"
}

export async function loadCategoryQuestions(gameCode: string): Promise<CategoryQuestion[]> {
  const { data, error } = await supabase
    .from('category_questions')
    .select('*')
    .eq('game_code', gameCode)
    .order('category')
    .order('points')

  if (error) throw error
  return data as CategoryQuestion[]
}
