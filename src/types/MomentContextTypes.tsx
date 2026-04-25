export type MomentFromBackendType = {
  id: number;
  friend: number;
  capsule: string;
  created_on: string;
  updated_on?: string;
  pre_added_to_hello: boolean;
  user: number;
  user_category: number;
  user_category_name: string;
  screen_x: number;
  screen_y: number;
  stored_index: number | null;

  // optional / not always returned by backend
  typed_category?: string;
  gecko_game_type?: number;
  match_only?: boolean;

  // derived in CapsuleListContext.transformCapsuleData
  coord?: [number, number];
  uniqueIndex?: number;
  charCount?: number;
};

export type Moment = MomentFromBackendType;
