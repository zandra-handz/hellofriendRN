export interface Hello {
    date: string;
    id: string; // uuid
    past_date_in_words: string;
    user: number;
};

export interface FullHello {
    additional_notes: string;
    created_on: string;
    date: string;
    delete_all_unshared_capsules: boolean;
    friend: number;
    id: string, // uuid
    location: number | null;
    location_name: string | null;
    typed_location: string | null;

};


//  {
//             "additional_notes": "",
//             "created_on": "2025-07-22T23:33:43.889220Z",
//             "date": "2025-07-22",
//             "delete_all_unshared_capsules": false,
//             "friend": 85,
//             "id": "98556b2e-635a-43e1-a56b-3645d1c3f7b2",
//             "location": 167,
//             "location_name": "Whole Foods Market",
//             "past_date_in_words": "Tuesday, July 22",
//             "thought_capsules_shared": {
//                 "5c0d1bde-3559-412b-92d8-afe2c5a9527e": {
//                     "capsule": "Cayenne pepper",
//                     "typed_category": "Uncategorized",
//                     "user_category": 40,
//                     "user_category_name": "Aisles"
//                 },
//                 "71904082-3162-472e-b17c-1d642e2f1004": {
//                     "capsule": "Saltines",
//                     "typed_category": "Uncategorized",
//                     "user_category": 40,
//                     "user_category_name": "Aisles"
//                 },
//                 "bbd0b3df-7d7e-4f7a-b633-5b1c0b6ac4c5": {
//                     "capsule": "Water",
//                     "typed_category": "Uncategorized",
//                     "user_category": 40,
//                     "user_category_name": "Aisles"
//                 },
//                 "fedc1c47-d1a5-42ad-87f7-4b50a4712233": {
//                     "capsule": "Chocolate",
//                     "typed_category": "Uncategorized",
//                     "user_category": 40,
//                     "user_category_name": "Aisles"
//                 }
//             },
//             "type": "in person",
//             "typed_location": null,
//             "updated_on": "2025-07-22T23:33:43.889237Z",
//             "user": 2
//         },
