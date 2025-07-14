







// NOT CURRENTLY IN USE BUT AVAILABLE IF NEED TO SEPARATE CATEGORIES FRM SETTNIGS! (comment out on backend too)

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
  useState,
} from "react"; 
import { useUser } from "./UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {  
  createUserCategory,
  updateUserCategory,
  deleteUserCategory, 
  getUserCategories, 
} from "../calls/api";

import * as Notifications from "expo-notifications";
import * as SecureStore from "expo-secure-store";
 

interface Categories {
//   id: number | null;
//   user: number | null;
//   expo_push_token: string | null;
//   high_contrast_mode: boolean;
//   interests: string | null;
//   language_preference: string | null;
//   large_text: boolean;
//   manual_dark_mode: boolean;
//   receive_notifications: boolean;
//   screen_reader: boolean;
}

interface CategoriesContextType {}

const CategoriesContext = createContext<Categories | undefined>(
  undefined
);

export const useCategories = (): CategoriesContextType => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error(
      "useCategories must be used within a UserCategoriesProvider"
    );
  }
  return context;
};

interface CategoriesProviderProps {
  children: ReactNode;
}

export const CategoriesProvider: React.FC<CategoriesProviderProps> = ({
  children,
}) => {
  const { user, isInitializing, isAuthenticated } = useUser();
  // console.log("CATEGORIES CONTEXT");

 
  const queryClient = useQueryClient();

  const {
    data: categories,
    isLoading,
    isFetching,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["categories", user?.id],
    queryFn: () => getUserCategories(user?.id),
    enabled: !!(user && user.id && isAuthenticated && !isInitializing),
    staleTime: 1000 * 60 * 60 * 10, // 10 hours
  
  });

useEffect(() => {
  if (isSuccess && categories) {
//     console.log('resetting user categories');
//  console.log(categories);
    setUserCategories(categories || []);
 
  }
}, [isSuccess, categories]);
 
  const [userCategories, setUserCategories] = useState<Record<
    string,
    any
  > | null>(null);

 
 

  // reset
  useEffect(() => {
    if (isInitializing && !isAuthenticated) {
      console.log("user not authenticated, resetting user categories");
   
      setUserCategories(null); 
    }
  }, [isAuthenticated, isInitializing]);
 

 

  const createNewCategoryMutation = useMutation({
    mutationFn: (data) => createUserCategory(user?.id, data),
    onSuccess: (data) => {
     

      // Update local state
      setUserCategories((prev) => [...prev, data]);

      // Update cached userSettings with logs
      queryClient.setQueryData(["categories", user?.id], (oldData) => {
        // console.log('Cache before update:', oldData);
        if (!oldData) return oldData;

        const updatedData = {
          ...oldData,
          user_categories: [...(oldData || []), data],
        };

        // console.log('Cache after update:', updatedData);
        return updatedData;
      });
    },
  });
   

  const updateCategoryMutation = useMutation({
    mutationFn: (data) => updateUserCategory(user?.id, data.id, data.updates),
    onSuccess: (data) => {
      setUserCategories((prev) => {
        const updated = prev.map((cat) => (cat.id === data.id ? data : cat));

        return updated;
      });

      queryClient.setQueryData(["categories", user?.id], (oldData) => {
        console.log("Before updating cached categories:", oldData);

        if (!oldData) return oldData;

        const updatedCategories = {
          ...oldData,
          user_categories: oldData.map((cat) =>
            cat.id === data.id ? data : cat
          ),
        };

        console.log("After updating cached userSettings:", updatedCategories);
        return updatedCategories;
      });
    },

    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (data) => deleteUserCategory(user?.id, data.id),
onSuccess: (data) => {
  // console.log("Deleted category data:", data);

  setUserCategories((prev) =>
    prev.filter((category) => category.id !== data.id)
  );

  queryClient.setQueryData(["categories", user?.id], (oldData) => {
    if (!oldData) return oldData;

    const updatedData = {
      ...oldData,
      user_categories: oldData.filter(
        (category) => category.id !== data.id
      ),
    };

    // Log after updating
    // console.log("Cache after delete update:", updatedData);

    return updatedData;
  });
},


    onError: (error) => {
      console.error("Update app settings error:", error);
    },
  }); 

  const createNewCategory = async (newCategoryData) => {
    try {
      const updatedData = await createNewCategoryMutation.mutateAsync(newCategoryData);
      
      if (updatedData) {
        console.log(`in createNewCategory`, updatedData);
        return updatedData;
      } 

    } catch (error) {
      console.error("Error creating new category: ", error);
    }
  };

  const updateCategory = async (categoryData) => {
    try {
      await updateCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };

  const deleteCategory = async (categoryData) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryData);
    } catch (error) {
      console.error("Error updating app settings:", error);
    }
  };
 

 

  const contextValue = useMemo(() => ({
  
  userCategories,
  createNewCategory,
  createNewCategoryMutation,
  updateCategory,
  updateCategoryMutation,
  deleteCategory,
  deleteCategoryMutation, 
}), [ 
  userCategories,
  createNewCategoryMutation,
  updateCategoryMutation,
  deleteCategoryMutation, 
]);


  return (
<CategoriesContext.Provider value={contextValue}>
  {children}
</CategoriesContext.Provider>

  );
};
