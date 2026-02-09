export interface Moment {
    id: number;
    // typedCategory: string;
    user_category: number;
    user_category_name: string;
    capsule: string;
    created: string;
    preAdded: boolean;

}

export type MomentFromBackendType = {
  id: number;
  friend: number;
  typed_category: string;
  capsule: string;
  created_on: string;
  pre_added_to_hello: string;
  user_category: number;
  user_category_name: string;
  screen_x: number;
  screen_y: number;
  stored_index: number | null;

  // new score fields
  easy_score: number;
  hard_score: number;
  quick_score: number;
  long_score: number;
  relevant_score: number;
  random_score: number;
  unique_score: number;
  generic_score: number;
};
