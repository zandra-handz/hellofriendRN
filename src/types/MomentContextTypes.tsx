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
  typed_category: string;
  capsule: string;
  created_on: string;
  pre_added_to_hello: string;
  user_category: number;
  user_category_name: string;
};